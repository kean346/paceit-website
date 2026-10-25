#!/usr/bin/env node
/** Run against `npm run build && npm start`; never sends a real enquiry. */
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:3004';
const canonical = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://paceit.co.za').origin;

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.PACEIT_CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const errors = [], requests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error' && /Content Security Policy|Refused to|violates/i.test(message.text())) errors.push(message.text()); });
    page.on('request', request => requests.push(new URL(request.url()).pathname));
    const response = await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    const headers = response.headers();
    assert.match(headers['strict-transport-security'], /max-age=31536000/);
    assert.equal(headers['x-content-type-options'], 'nosniff');
    assert.equal(headers['x-frame-options'], 'DENY');
    assert.match(headers['content-security-policy'], /frame-ancestors 'none'/);
    assert.doesNotMatch(headers['content-security-policy'], /unsafe-eval/);
    assert.equal(headers['x-powered-by'], undefined);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('html').getAttribute('lang'), 'en-ZA');
    assert((await page.title()).length < 60);
    assert((await page.locator('meta[name="description"]').getAttribute('content')).length < 160);
    assert.equal(new URL(await page.locator('link[rel="canonical"]').getAttribute('href')).href, canonical + '/');
    assert.equal(new URL(await page.locator('meta[property="og:url"]').getAttribute('content')).href, canonical + '/');
    assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute('content'), 'summary_large_image');
    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
    assert.equal(graph.filter(item => item['@type'] === 'Organization').length, 1);
    assert.equal(graph.filter(item => item['@type'] === 'Service').length, 3);
    for (const service of graph.filter(item => item['@type'] === 'Service')) assert(await page.locator(new URL(service.url).hash).count());
    const sitemap = await context.request.get(base + '/sitemap.xml');
    assert.equal(sitemap.status(), 200);
    assert((await sitemap.text()).includes(`<loc>${canonical}/</loc>`));
    for (const path of ['/privacy', '/terms', '/cookies']) assert((await sitemap.text()).includes(`<loc>${canonical}${path}</loc>`));
    assert.doesNotMatch(await sitemap.text(), /\/api\/|#|<lastmod>/);
    const robots = await context.request.get(base + '/robots.txt');
    assert.match(await robots.text(), /Allow: \/\nDisallow: \/api\//);
    assert((await robots.text()).includes(`Sitemap: ${canonical}/sitemap.xml`));
    const image = await context.request.get(base + '/social/paceit.png');
    assert.equal(image.status(), 200);
    assert.equal((await image.body()).readUInt32BE(16), 1200);
    const missing = await context.request.get(base + '/this-page-does-not-exist');
    assert.equal(missing.status(), 404);
    assert.match(await missing.text(), /name="robots" content="noindex"/);
    assert.equal((await context.request.get(base + '/api/enquiry')).status(), 405);
    assert.equal((await context.request.post(base + '/api/enquiry', { headers: { Origin: 'https://attacker.example' }, data: {} })).status(), 403);
    assert(!requests.includes('/work/flow-plumbing-demo.mp4'), 'Film must not download above the fold');
    assert(!requests.includes('/work/sa-family-travel-elephants.webp'), 'Offscreen gallery must not fetch textures');
    console.log('PASS: metadata, schema, crawl files, 404s, headers and deferred media');

    for (const width of [320, 390, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => document.fonts.ready);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator('#work-gallery').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('#work-gallery').dataset.galleryRenderer === 'ready');
    await page.getByRole('button', { name: 'Pause gallery', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#work-gallery').classList.contains('gallery-paused'));
    const still = await page.locator('#work-gallery canvas').evaluate(async canvas => { const before = canvas.toDataURL(); await new Promise(resolve => setTimeout(resolve, 200)); return before === canvas.toDataURL(); });
    assert(still, 'Pause must freeze the actual rendered gallery');
    await page.getByRole('button', { name: 'Resume gallery', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#work-gallery').classList.contains('gallery-playing'));
    // Software WebGL can resume slowly under load. Wait for a real pixel
    // change instead of assuming two rendered frames fit inside 300 ms.
    const moving = await page.locator('#work-gallery canvas').evaluate(async canvas => {
      const before = canvas.toDataURL();
      for (let attempt = 0; attempt < 30; attempt++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (before !== canvas.toDataURL()) return true;
      }
      return false;
    });
    assert(moving, 'Gallery must move after resuming');
    assert(requests.includes('/work/sa-family-travel-elephants.webp'));
    await page.getByRole('tab', { name: /Daylight/ }).click();
    await page.getByRole('heading', { name: 'A well-planned week.' }).waitFor();
    await page.getByRole('tab', { name: /Relay/ }).click();
    await page.getByRole('heading', { name: 'Project board' }).waitFor();
    await page.getByRole('tab', { name: /Flow Plumbing/ }).click();
    await page.getByRole('button', { name: 'Play film', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('video').currentTime > 0);
    await page.getByRole('button', { name: 'Pause film', exact: true }).click();
    console.log('PASS: five responsive widths, gallery pause/resume, elephant asset, demo tabs and film playback');

    const form = page.locator('.contact-form');
    const enquiry = { name: 'Alex Morgan', email: 'alex@example.com', idea: 'Please help us simplify our customer quotes.' };
    let sentBody, calls = 0;
    await page.route('**/api/enquiry', async route => { calls++; sentBody = route.request().postDataJSON(); await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ message: 'Your enquiry could not be sent. Please try again or email info@paceit.co.za.' }) }); });
    await form.locator('#name').fill(enquiry.name);
    await form.locator('#email').fill(enquiry.email);
    await form.locator('#idea').fill(enquiry.idea);
    await form.locator('#privacyAcknowledged').check();
    const location = page.url();
    await form.getByRole('button', { name: 'Send enquiry' }).click();
    await page.waitForFunction(() => document.querySelector('.form-status').textContent.includes('could not be sent'));
    assert.equal(await form.locator('#idea').inputValue(), enquiry.idea);
    assert.equal(page.url(), location);
    assert.deepEqual(sentBody, { ...enquiry, website: '', privacyAcknowledged: true });
    await page.unroute('**/api/enquiry');
    await page.route('**/api/enquiry', async route => { calls++; await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'Accepted by test transport' }) }); });
    await form.getByRole('button', { name: 'Send enquiry' }).click();
    await page.waitForFunction(() => document.querySelector('.form-status').textContent.includes('Thank you'));
    assert.equal(await form.locator('#idea').inputValue(), '');
    assert.equal(page.url(), location);
    assert.equal(calls, 2);
    assert.deepEqual(await context.cookies(), []);
    assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    assert.deepEqual(errors, []);
    console.log('PASS: on-site success/error states, failed-message preservation, no redirect, no cookies/storage or CSP errors');

    assert.equal(await form.getByRole('link', { name: 'Privacy Policy' }).getAttribute('href'), '/privacy');
    for (const [name, path] of [['Privacy', '/privacy'], ['Terms', '/terms']]) assert.equal(await page.locator('footer').getByRole('link', { name, exact: true }).getAttribute('href'), path);
    const legal = await context.newPage();
    legal.on('pageerror', error => errors.push(error.message));
    for (const [path, title] of [['/privacy', 'Privacy Policy'], ['/terms', 'Terms of Website Use'], ['/cookies', 'Cookie Policy']]) {
      const response = await legal.goto(base + path, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      assert.equal(await legal.locator('h1').count(), 1);
      assert.equal(await legal.locator('h1').textContent(), title);
      assert.equal(await legal.title(), `${title} | paceIT`);
      assert((await legal.locator('meta[name="description"]').getAttribute('content')).length < 160);
      assert.equal(await legal.locator('link[rel="canonical"]').getAttribute('href'), canonical + path);
      assert.equal(await legal.locator('meta[property="og:url"]').getAttribute('content'), canonical + path);
      assert.equal(await legal.locator('meta[name="twitter:title"]').getAttribute('content'), `${title} | paceIT`);
      assert.match(await legal.locator('main, footer').allTextContents().then(parts => parts.join(' ')), /Kean Maan/);
      assert.doesNotMatch(await legal.locator('main').innerText(), /\[publication date\]|\[full legal name|\[confirmed|Sean \/ Kean|draft for owner/i);
      assert.equal(await legal.locator('video, canvas').count(), 0);
      assert(await legal.locator('.legal-contents a').evaluateAll(links => links.every(link => document.querySelector(link.hash))));
      for (const width of [320, 390, 640, 768, 1440]) {
        await legal.setViewportSize({ width, height: 900 });
        assert(await legal.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path} overflow at ${width}px`);
      }
      await legal.setViewportSize({ width: 390, height: 844 });
      await legal.getByRole('button', { name: 'Open navigation' }).click();
      await legal.waitForFunction(() => document.querySelector('.menu-button').getAttribute('aria-expanded') === 'true');
      assert.equal(await legal.locator('#main-navigation').getByRole('link', { name: 'Work', exact: true }).getAttribute('href'), '/#work');
      assert.equal(await legal.locator('#main-navigation').getByRole('link', { name: 'Contact', exact: true }).getAttribute('href'), '/#contact');
      assert.equal(await legal.locator('footer').getByRole('link', { name: 'Back to top' }).getAttribute('href'), '#top');
      assert.equal(await legal.locator('#top').count(), 1);
    }
    await legal.close();
    assert.deepEqual(errors, []);
    console.log('PASS: legal pages, unique metadata/canonicals, sitemap/footer/form links and mobile navigation');
    await context.close();

    const fallback = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await fallback.addInitScript(() => { const original = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(kind, ...args) { return /webgl/.test(kind) ? null : original.call(this, kind, ...args); }; });
    const fallbackPage = await fallback.newPage();
    await fallbackPage.goto(base);
    await fallbackPage.locator('#work-gallery').scrollIntoViewIfNeeded();
    await fallbackPage.waitForFunction(() => document.querySelector('#work-gallery').dataset.galleryRenderer === 'fallback');
    assert(await fallbackPage.locator('#work-gallery img').count());
    assert(await fallbackPage.locator('#work-gallery img').evaluateAll(images => images.every(image => image.hasAttribute('alt') && image.getAttribute('loading') === 'lazy')));
    console.log('PASS: accessible, lazy-loaded fallback without WebGL');
    await fallback.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
