import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, deliveryKey, isEmail, MAX_REQUEST_BYTES, parseEnquiry } from '@/lib/enquiry';
import { site } from '@/lib/site';
import { createTransport } from 'nodemailer';

export const runtime = 'nodejs';
export const maxDuration = 30;

function reply(status: number, message: string, headers: Record<string, string> = {}) {
  return NextResponse.json({ message }, { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', ...headers } });
}

async function readBody(request: NextRequest): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > MAX_REQUEST_BYTES) throw new RangeError('Body too large');
  if (!request.body) throw new SyntaxError('Missing body');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_REQUEST_BYTES) { await reader.cancel(); throw new RangeError('Body too large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export async function POST(request: NextRequest) {
  // A JSON-only, same-origin endpoint. There is no open email relay or CORS.
  if (request.headers.get('origin') !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') {
    return reply(403, 'Please send your enquiry using the form on this website.');
  }
  if (!/^application\/json(?:;|$)/i.test(request.headers.get('content-type') || '')) return reply(415, 'Please use the enquiry form to send your message.');

  const host = process.env.SMTP_HOST?.trim() || '';
  const port = Number(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASS;
  if (!host || !/^[a-zA-Z0-9.-]+$/.test(host) || !Number.isInteger(port) || port < 1 || port > 65535 || !user || !password || !isEmail(site.email)) {
    return reply(503, `The enquiry service is temporarily unavailable. Please email ${site.email}.`);
  }

  // Vercel overwrites the forwarded IP at its edge. Do not trust arbitrary
  // forwarded headers if deploying this application behind a different proxy.
  const ip = process.env.VERCEL === '1' ? (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown') : 'local';
  const limit = checkRateLimit(ip, password);
  if (!limit.allowed) return reply(429, 'Please wait a few minutes before sending another enquiry.', { 'Retry-After': String(limit.retryAfter) });

  let data: unknown;
  try { data = await readBody(request); }
  catch (error) { return reply(error instanceof RangeError ? 413 : 400, 'Please check the form and try again.'); }
  const enquiry = parseEnquiry(data);
  if (!enquiry) return reply(400, 'Please enter your name, a valid email address and a message of 10–4,000 characters.');

  const transporter = createTransport({
    host, port, secure: port === 465, requireTLS: port !== 465,
    auth: { user, pass: password }, tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    connectionTimeout: 5000, greetingTimeout: 5000, socketTimeout: 10000,
    disableFileAccess: true, disableUrlAccess: true, logger: false, debug: false,
  });
  let deadline: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = await Promise.race([
      transporter.sendMail({
        from: { name: 'paceIT', address: site.email }, to: site.email,
        replyTo: { name: enquiry.name, address: enquiry.email },
        subject: 'New website enquiry for paceIT',
        messageId: `<${deliveryKey(enquiry, password)}@paceit.co.za>`,
        // Plain text only: visitor input is never interpreted as HTML or SQL.
        text: `Project enquiry for paceIT\n\nName: ${enquiry.name}\nEmail: ${enquiry.email}\n\n${enquiry.idea}`,
      }),
      new Promise<never>((_, reject) => { deadline = setTimeout(() => { transporter.close(); reject(new Error('SMTP deadline exceeded')); }, 18000); }),
    ]);
    if (!result.accepted.some(address => typeof address === 'string' && address.toLowerCase() === site.email)) {
      console.error('enquiry_delivery_rejected');
      return reply(502, `Your enquiry could not be sent. Please try again or email ${site.email}.`);
    }
    return reply(200, 'Thank you. Your enquiry has been sent. We’ll be in touch.');
  } catch {
    // Do not log personal data, provider responses or credentials.
    console.error('enquiry_delivery_unavailable');
    return reply(503, `Your enquiry could not be sent. Please try again or email ${site.email}.`);
  } finally { if (deadline) clearTimeout(deadline); transporter.close(); }
}
