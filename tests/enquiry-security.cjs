#!/usr/bin/env node
/** Exercise the real route handler with a mocked SMTP transport; sends no mail. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { test, after } = require('node:test');
const { NextRequest } = require('next/server');
const root = path.resolve(__dirname, '..');
const originalFetch = global.fetch;
const savedEnv = Object.fromEntries(['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'VERCEL'].map(key => [key, process.env[key]]));
after(() => { global.fetch = originalFetch; for (const [key, value] of Object.entries(savedEnv)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } });

function setup(provider = () => ({ accepted: ['info@paceit.co.za'], rejected: [] })) {
  process.env.SMTP_HOST = 'smtp-relay.brevo.com';
  process.env.SMTP_PORT = '587';
  process.env.SMTP_USER = 'test-smtp-login';
  process.env.SMTP_PASS = 'test-only-not-a-real-key';
  delete process.env.VERCEL;
  const calls = [], transportOptions = [];
  const smtp = { createTransport(options) {
    transportOptions.push(options);
    return { sendMail(mail) { calls.push(mail); return provider(mail); }, close() {} };
  } };
  const modules = new Map();
  function load(file) {
    if (modules.has(file)) return modules.get(file);
    const module = { exports: {} };
    const source = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
    new Function('require', 'module', 'exports', source)(name => name === 'nodemailer' ? smtp : name.startsWith('@/') ? load(name.slice(2) + '.ts') : require(name), module, module.exports);
    modules.set(file, module.exports);
    return module.exports;
  }
  return { route: load('app/api/enquiry/route.ts'), calls, transportOptions, helpers: load('lib/enquiry.ts') };
}
const valid = { name: 'Alex & Morgan', email: 'alex@example.com', idea: 'Please help with our customer quotation process.', website: '' };
function request(data = valid, headers = {}) {
  return new NextRequest('https://paceit.example/api/enquiry', { method: 'POST', headers: { Origin: 'https://paceit.example', 'Content-Type': 'application/json', ...headers }, body: typeof data === 'string' ? data : JSON.stringify(data) });
}

test('only SMTP-accepted messages succeed; fixed sender/recipient and validated reply-to', async () => {
  const { route, calls, transportOptions } = setup();
  const result = await route.POST(request({ ...valid, to: 'attacker@example.com', from: 'attacker@example.com', idea: '<script>alert(1)</script> is a literal project example.' }));
  assert.equal(result.status, 200);
  assert.equal(result.headers.get('cache-control'), 'no-store');
  assert.equal(calls.length, 1);
  const email = calls[0];
  assert.equal(email.to, 'info@paceit.co.za');
  assert.deepEqual(email.from, { name: 'paceIT', address: 'info@paceit.co.za' });
  assert.deepEqual(email.replyTo, { name: valid.name, address: valid.email });
  assert.equal(transportOptions[0].requireTLS, true);
  assert.equal(transportOptions[0].tls.rejectUnauthorized, true);
  assert.equal(transportOptions[0].tls.minVersion, 'TLSv1.2');
  assert.equal(transportOptions[0].disableFileAccess, true);
  assert.equal(transportOptions[0].disableUrlAccess, true);
  assert.match(email.text, /<script>alert\(1\)<\/script>/);
  assert.equal(email.html, undefined);
  // Exercise Nodemailer's actual MIME encoder in memory, without a connection.
  const transport = require('nodemailer').createTransport({ streamTransport: true, buffer: true });
  const mime = (await transport.sendMail(email)).message.toString();
  assert.match(mime, /From: paceIT <info@paceit\.co\.za>/);
  assert.match(mime, /Reply-To: "Alex & Morgan" <alex@example\.com>/);
  assert.match(mime, /Content-Type: text\/plain/);
  assert.doesNotMatch(mime, /^Bcc:/m);
});

test('rejects cross-origin requests and non-JSON submissions without contacting provider', async () => {
  const { route, calls } = setup();
  assert.equal((await route.POST(request(valid, { Origin: 'https://attacker.example' }))).status, 403);
  assert.equal((await route.POST(request(valid, { 'Sec-Fetch-Site': 'cross-site' }))).status, 403);
  assert.equal((await route.POST(request(valid, { 'Content-Type': 'text/plain' }))).status, 415);
  const missingOrigin = request(); missingOrigin.headers.delete('origin');
  assert.equal((await route.POST(missingOrigin)).status, 403);
  assert.equal(calls.length, 0);
});

test('validates inputs server-side, including CRLF injection, spam trap and bounded strings', async () => {
  const invalid = [
    {}, [], null, { ...valid, name: '   ' }, { ...valid, name: 'x'.repeat(101) },
    { ...valid, name: 'Alex\r\nBcc: victim@example.com' }, { ...valid, email: 'alex@example.com\r\nBcc:a@b.com' },
    { ...valid, email: 'invalid' }, { ...valid, idea: 'short' }, { ...valid, idea: 'x'.repeat(4001) },
    { ...valid, idea: 1234 }, { ...valid, idea: 'Control\u0000character example' }, { ...valid, website: 'bot.example' },
  ];
  for (const input of invalid) {
    const { route, calls } = setup();
    assert.equal((await route.POST(request(input))).status, 400, JSON.stringify(input));
    assert.equal(calls.length, 0);
  }
});

test('rejects malformed JSON and oversized bodies, with and without declared size', async () => {
  const { route, calls } = setup();
  assert.equal((await route.POST(request('{'))).status, 400);
  assert.equal((await route.POST(request('x'.repeat(25000)))).status, 413);
  assert.equal((await route.POST(request(valid, { 'Content-Length': '25000' }))).status, 413);
  assert.equal(calls.length, 0);
});

test('unconfigured service fails honestly without redirecting or reporting success', async () => {
  const { route, calls } = setup();
  delete process.env.SMTP_PASS;
  const response = await route.POST(request());
  assert.equal(response.status, 503);
  assert.match((await response.json()).message, /info@paceit\.co\.za/);
  assert.equal(calls.length, 0);
});

test('rejects invalid SMTP configuration before contacting the provider', async () => {
  for (const [key, value] of [['SMTP_HOST', 'smtp://invalid-host'], ['SMTP_PORT', 'invalid'], ['SMTP_PORT', '65536'], ['SMTP_USER', '']]) {
    const { route, calls } = setup();
    process.env[key] = value;
    assert.equal((await route.POST(request())).status, 503);
    assert.equal(calls.length, 0);
  }
});

test('port 465 uses implicit TLS and retains certificate validation', async () => {
  const { route, transportOptions } = setup();
  process.env.SMTP_PORT = '465';
  assert.equal((await route.POST(request())).status, 200);
  assert.equal(transportOptions[0].secure, true);
  assert.equal(transportOptions[0].tls.rejectUnauthorized, true);
});

test('rate limit stops a burst before a sixth provider request', async () => {
  const { route, calls } = setup();
  for (let i = 0; i < 5; i++) assert.equal((await route.POST(request())).status, 200);
  const response = await route.POST(request());
  assert.equal(response.status, 429);
  assert(Number(response.headers.get('retry-after')) > 0);
  assert.equal(calls.length, 5);
});

test('provider errors, malformed responses and network failures never report sent', async () => {
  for (const provider of [() => ({ accepted: [], rejected: ['info@paceit.co.za'] }), () => ({}), () => { throw new Error('SMTP connection unavailable'); }]) {
    const { route } = setup(provider);
    const response = await route.POST(request());
    assert(response.status >= 500);
    assert.doesNotMatch((await response.json()).message, /Thank you/);
  }
});

test('deduplication keys contain no personal data; rate entries expire', () => {
  const { helpers } = setup();
  assert.equal(helpers.deliveryKey(valid, 'secret', 1000), helpers.deliveryKey(valid, 'secret', 2000));
  assert.match(helpers.deliveryKey(valid, 'secret', 1000), /^[a-f0-9]{64}$/);
  for (let i = 0; i < 5; i++) assert.equal(helpers.checkRateLimit('test-ip', 'secret', 0).allowed, true);
  assert.equal(helpers.checkRateLimit('test-ip', 'secret', 1).allowed, false);
  assert.equal(helpers.checkRateLimit('test-ip', 'secret', 600001).allowed, true);
});
