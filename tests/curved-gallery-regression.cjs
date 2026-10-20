#!/usr/bin/env node
/** Check real GPU output for missing/white pixels inside moving curved screens. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const ts = require('typescript');
const { createCanvas } = require('@napi-rs/canvas');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const moduleSource = ts.transpileModule(fs.readFileSync(path.join(root, 'lib/curved-gallery-renderer.ts'), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const image = createCanvas(32, 16);
const context = image.getContext('2d');
context.fillStyle = '#2c6a90'; context.fillRect(0, 0, 32, 16);
const imageBytes = image.toBuffer('image/png');
const html = `<!doctype html><style>body{margin:0}canvas{display:block}</style><canvas></canvas><script type="module">
import { createGalleryRenderer } from '/renderer.js';
const callbacks = new Map(); let id = 0;
window.requestAnimationFrame = callback => {callbacks.set(++id, callback); return id;};
window.cancelAnimationFrame = key => callbacks.delete(key);
window.fixture = {
  async start(width, height, legacy) {
    const canvas = document.querySelector('canvas');
    if (legacy) { const original = canvas.getContext.bind(canvas); canvas.getContext = (name, ...args) => name === 'webgl2' ? null : original(name, ...args); }
    await new Promise((resolve, reject) => {
      this.renderer = createGalleryRenderer(canvas, {images:Array.from({length:5},()=>({src:'/image.png'})), speed:1, tileHeight:40, aspectRatio:16/9, gap:10, axis:57, curve:65, framed:true, onReady:resolve, onError:()=>reject(Error('Renderer failed'))});
      this.resize(width, height); this.renderer.setPaused(false);
    });
    this.step(0);
  },
  resize(width,height) { const canvas=document.querySelector('canvas'); canvas.style.width=width+'px';canvas.style.height=height+'px';this.renderer.resize(width,height); },
  step(time) { const pending=[...callbacks.values()];callbacks.clear();for(const callback of pending)callback(time); },
  verify(frames, start=0) {
    const canvas=document.querySelector('canvas');const gl=canvas.getContext('webgl2')||canvas.getContext('webgl');
    const program=gl.getParameter(gl.CURRENT_PROGRAM),uniform=name=>gl.getUniform(program,gl.getUniformLocation(program,name));
    const width=canvas.clientWidth, radius=uniform('uRadius'), arc=uniform('uArc'), pitch=arc*(16/9+.1)/(16/9);
    const angles=new Float64Array(canvas.width);
    // Invert the projected cylinder independently of the mesh's vertex shader.
    for(let x=0;x<canvas.width;x++) { const target=(x+.5)/canvas.width*width-width/2;let low=-Math.PI/2,high=Math.PI/2;for(let j=0;j<30;j++){const a=(low+high)/2;const projected=radius*Math.sin(a)*1.6/(.6+Math.cos(a));if(projected<target)low=a;else high=a;}angles[x]=(low+high)/2; }
    const row=new Uint8Array(canvas.width*4);let samples=0,rightEdgeSamples=0;
    for(let frame=1;frame<=frames;frame++) {
      this.step((start+frame)*100);
      const phase=((-(uniform('uAngle')/pitch))%1+1)%1;
      gl.readPixels(0,Math.round(canvas.height*(1-.57)),canvas.width,1,gl.RGBA,gl.UNSIGNED_BYTE,row);
      for(let x=0;x<canvas.width;x++) {
        const centre=(Math.round(angles[x]/pitch+phase)-phase)*pitch;
        const u=(angles[x]-centre)/arc+.5;
        if(u<.08||u>.92)continue;
        const p=x*4;
        if(row[p+3]<252||Math.abs(row[p]-44)>3||Math.abs(row[p+1]-106)>3||Math.abs(row[p+2]-144)>3)
          throw Error('Surface discontinuity at frame '+(start+frame)+', pixel '+x+': '+Array.from(row.slice(p,p+4)));
        samples++;if(x===canvas.width-1)rightEdgeSamples++;
      }
    }
    if(!samples||!rightEdgeSamples)throw Error('No meaningful right-edge samples');
    return {samples,rightEdgeSamples,renderer:canvas.dataset.renderer};
  }
};
</script>`;

(async () => {
  const server = http.createServer((request, response) => {
    const [content, type] = request.url === '/renderer.js' ? [moduleSource, 'text/javascript'] : request.url === '/image.png' ? [imageBytes, 'image/png'] : [html, 'text/html'];
    response.writeHead(200, { 'Content-Type': type }); response.end(content);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    const executablePath = process.env.PACEIT_CHROMIUM_PATH || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
    browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
    const results = [];
    for (const [width, scale, legacy] of [[390,1,false],[1440,1,false],[1440,1.25,false],[1760,2,false],[1440,1,true]]) {
      const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
      await page.goto(`http://127.0.0.1:${server.address().port}`);
      await page.waitForFunction(() => window.fixture);
      await page.evaluate(({width,legacy}) => window.fixture.start(width, width < 700 ? 460 : 640, legacy), {width,legacy});
      // Fifty screen advances include every old loop boundary and image position.
      const output = await page.evaluate(() => window.fixture.verify(500));
      results.push({ width, scale, ...output });
      if (width === 1440 && scale === 1 && !legacy) {
        for (const [index, nextWidth] of [320,768,1920,390,1440].entries()) {
          await page.evaluate(width => window.fixture.resize(width, width < 700 ? 460 : 640), nextWidth);
          const resized = await page.evaluate(start => window.fixture.verify(30, start), 500+index*30);
          assert.ok(resized.samples > 0);
        }
      }
      await page.close();
    }
    console.log(JSON.stringify({ checks: 'Continuous surface and right edge across movement, resizing, DPR and WebGL versions', results }, null, 2));
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
