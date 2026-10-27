const {chromium}=require('playwright');
const path=require('path');const fs=require('fs');
const root=path.resolve(__dirname,'..');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
for(const [name,width,height] of [['desktop',1600,1000],['mobile',420,900]]){const p=await b.newPage({viewport:{width,height},reducedMotion:'reduce'});await p.goto('http://127.0.0.1:3004',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:root+'/assets/'+name+'.png'});if(name==='desktop'){await p.locator('#work').scrollIntoViewIfNeeded();await p.waitForTimeout(1500);await p.screenshot({path:root+'/assets/gallery.png'});}await p.close();}await b.close();})();
