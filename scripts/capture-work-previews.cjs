#!/usr/bin/env node
/** Capture the actual React concept workspaces. Start the site before running. */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
async function capture() {
  const executablePath =
    process.env.PACEIT_CHROMIUM_PATH ||
    (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
  const { render, canvas } = require('./render-flow-demo.cjs');
  render(19.8);
  await sharp(canvas.toBuffer('image/png'))
    .extract({ left: 305, top: 104, width: 1310, height: 683 })
    .resize(1600, 900, { fit: 'contain', background: '#eaeae8' })
    .webp({ quality: 94 })
    .toFile(path.join(root, 'public/work/flow-plumbing-preview.webp'));
  const browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox'] });
  try {
    for (const id of ['daylight', 'relay']) {
      const page = await browser.newPage({
        viewport: { width: 1600, height: 1000 },
        reducedMotion: 'reduce',
      });
      await page.goto(process.env.DEMO_CAPTURE_URL || 'http://localhost:3000', {
        waitUntil: 'networkidle',
      });
      await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
      await page.locator(`#work-tab-${id}`).click();
      const demo = page.locator('.work-demo');
      await demo.evaluate((element) =>
        Object.assign(element.style, {
          position: 'fixed',
          left: '0',
          top: '0',
          width: '1600px',
          height: '900px',
          minHeight: '900px',
          maxWidth: 'none',
          zIndex: '9999',
          borderRadius: '0',
        })
      );
      await page.evaluate(() => document.fonts.ready);
      const png = await demo.screenshot({ type: 'png', animations: 'disabled' });
      const destination = path.join(root, `public/work/${id}-preview.webp`);
      await sharp(png).webp({ quality: 94 }).toFile(destination);
      console.log(`Captured ${destination} from the working React demo.`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
capture().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
