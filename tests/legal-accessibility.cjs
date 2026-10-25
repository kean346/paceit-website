#!/usr/bin/env node
// Local production checks only. Form requests are mocked; no real email is sent.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { source } = require('axe-core');
const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:3004';
(async () => {
 const browser = await chromium.launch({executablePath:process.env.PACEIT_CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
 try {
  const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page = await context.newPage();
  const external = []; page.on('request',r=>{if(new URL(r.url()).origin!==new URL(base).origin)external.push(r.url())});
  async function audit(label) {
   await page.addScriptTag({content:source});
   const result = await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
   assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,reason:n.failureSummary}))})),[],label);
   console.log('PASS: automated accessibility — '+label);
  }
  for (const route of ['/','/privacy','/terms','/cookies']) {
   await page.goto(base+route,{waitUntil:'networkidle'});
   for(const width of [1440,390]) {await page.setViewportSize({width,height:1000});await audit(route+' '+width+'px');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  }
  await page.goto(base,{waitUntil:'networkidle'});
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('#work-gallery').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('#work-gallery').dataset.galleryRenderer==='ready');
  assert(await page.getByRole('button',{name:'Resume gallery',exact:true}).count());
  assert(await page.locator('#work-gallery').evaluate(el=>el.classList.contains('gallery-paused')));
  for(const name of ['Daylight','Relay']) {
   await page.getByRole('tab',{name:new RegExp(name)}).click();await page.locator('.work-demo').waitFor();await page.waitForTimeout(300);await audit(name);
   if(name==='Daylight')await page.getByRole('button',{name:'New appointment',exact:true}).click();
   else await page.locator('.demo-task').filter({has:page.locator('strong',{hasText:'Build enquiry form'})}).click();
   await page.getByRole('dialog').waitFor();await audit(name+' dialog');
   const box=await page.getByRole('dialog').boundingBox();assert(box.x>=0&&box.y>=0&&box.x+box.width<=1440&&box.y+box.height<=1000);
   await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
  }
  const form=page.locator('.contact-form');let calls=0;
  await page.route('**/api/enquiry',async route=>{calls++;assert.equal(route.request().postDataJSON().privacyAcknowledged,true);await route.fulfill({status:200,contentType:'application/json',body:'{"message":"Test accepted"}'});});
  await form.getByRole('button',{name:'Send enquiry'}).click();assert.equal(await page.evaluate(()=>document.activeElement.id),'name');assert.equal(calls,0);
  await form.locator('#name').fill('Alex Morgan');await form.locator('#email').fill('not-an-email');await form.locator('#idea').fill('Please help us with an enquiry workflow.');
  await form.getByRole('button',{name:'Send enquiry'}).click();assert.equal(await page.evaluate(()=>document.activeElement.id),'email');
  await form.locator('#email').fill('alex@example.com');await form.getByRole('button',{name:'Send enquiry'}).click();assert.equal(calls,0);assert.equal(await page.evaluate(()=>document.activeElement.id),'privacyAcknowledged');
  await page.keyboard.press('Space');assert(await form.locator('#privacyAcknowledged').isChecked());
  await form.getByRole('button',{name:'Send enquiry'}).focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('.form-status').textContent.includes('Thank you'));
  assert.equal(calls,1);assert.equal(await form.locator('#privacyAcknowledged').isChecked(),false);
  assert.deepEqual(external,[]);assert.deepEqual(await context.cookies(),[]);assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);assert.equal(await page.locator('iframe').count(),0);
  await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Open navigation'}).click();await page.locator('#main-navigation a').first().focus();await page.keyboard.press('Escape');assert.equal(await page.getByRole('button',{name:'Open navigation'}).getAttribute('aria-expanded'),'false');
  console.log('PASS: reduced motion, keyboard forms, required acknowledgement, no trackers/storage/embeds, dialog Escape and menu focus');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
