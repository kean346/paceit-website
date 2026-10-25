import { createHash, createHmac } from 'node:crypto';
import { isEmail } from '@/lib/enquiry-validation';
export { isEmail } from '@/lib/enquiry-validation';

export const MAX_REQUEST_BYTES = 24 * 1024;
export type Enquiry = { name: string; email: string; idea: string; website: string };

export function parseEnquiry(value: unknown): Enquiry | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  if (data.privacyAcknowledged !== true) return null;
  if (typeof data.name !== 'string' || typeof data.email !== 'string' || typeof data.idea !== 'string' || (data.website !== undefined && typeof data.website !== 'string')) return null;
  const enquiry = { name: data.name.trim().normalize('NFC'), email: data.email.trim(), idea: data.idea.trim().normalize('NFC'), website: String(data.website ?? '').trim() };
  if (enquiry.name.length < 1 || enquiry.name.length > 100 || /[\u0000-\u001f\u007f]/.test(enquiry.name)
    || !isEmail(enquiry.email) || enquiry.idea.length < 10 || enquiry.idea.length > 4000
    || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(enquiry.idea) || enquiry.website) return null;
  return enquiry;
}

// A bounded, short-lived burst limit. Serverless instances do not share this
// memory: also configure Vercel Firewall rate limiting for a global limit.
const attempts = new Map<string, { count: number; expires: number }>();
export function checkRateLimit(ip: string, secret: string, now = Date.now()) {
  for (const [key, entry] of attempts) if (entry.expires <= now) attempts.delete(key);
  const key = createHmac('sha256', secret).update(ip).digest('hex');
  let entry = attempts.get(key);
  if (!entry) {
    if (attempts.size >= 2000) return { allowed: false, retryAfter: 600 };
    entry = { count: 0, expires: now + 10 * 60 * 1000 };
    attempts.set(key, entry);
  }
  entry.count += 1;
  return { allowed: entry.count <= 5, retryAfter: Math.max(1, Math.ceil((entry.expires - now) / 1000)) };
}

export function deliveryKey(enquiry: Enquiry, secret: string, now = Date.now()) {
  // Stable Message-ID for identical retries; SMTP itself is not idempotent.
  const digest = createHash('sha256').update(JSON.stringify([enquiry.name, enquiry.email, enquiry.idea])).digest('hex');
  return createHmac('sha256', secret).update(`${Math.floor(now / 300000)}:${digest}`).digest('hex');
}
