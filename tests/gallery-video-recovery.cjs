const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');

function fixture() {
 const document = new EventTarget(), window = new EventTarget();
 document.hidden = false;
 let now = 0, tick, blocked = true, loads = 0, plays = 0;
 const video = new EventTarget();
 Object.assign(video, { currentTime: 0, paused: true, error: null, setAttribute() {}, pause() { this.paused = true; }, load() { loads++; this.error = null; }, play() {
  plays++; if (blocked) return Promise.reject(new DOMException('Blocked', 'NotAllowedError'));
  this.paused = false; return Promise.resolve();
 } });
 const exports = {};
 const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../lib/gallery-video.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
 vm.runInNewContext(code, { exports, document, window, navigator: { onLine: true }, performance: { now: () => now }, DOMException, setInterval: callback => { tick = callback; return 1; }, clearInterval: () => { tick = undefined; } });
 const controller = exports.createGalleryVideoPlayback(video);
 return { video, window, document, controller, unblock() { blocked = false; }, async flush() { await new Promise(resolve => setImmediate(resolve)); }, advance(ms) { now += ms; tick?.(); }, counts: () => ({ loads, plays }) };
}

test('blocked autoplay recovers on interaction without relying on loadeddata', async () => {
 const f = fixture(); f.controller.setActive(true); await f.flush();
 f.advance(15000); assert.equal(f.counts().loads, 0);
 f.unblock(); f.window.dispatchEvent(new Event('touchend')); await f.flush();
 assert.equal(f.video.paused, false);
 f.controller.destroy(); const before = f.counts().plays;
 f.window.dispatchEvent(new Event('pointerdown')); f.advance(20000); assert.equal(f.counts().plays, before);
});

test('stalled downloads reload at most twice; paused gallery never retries', async () => {
 const f = fixture(); f.unblock(); f.controller.setActive(true); await f.flush();
 for (let i = 0; i < 5; i++) { f.advance(11000); await f.flush(); }
 assert.equal(f.counts().loads, 2);
 f.controller.setActive(false); const before = f.counts(); f.advance(20000); f.window.dispatchEvent(new Event('online')); await f.flush();
 assert.deepEqual(f.counts(), before); assert.equal(f.video.paused, true); f.controller.destroy();
});

test('tab visibility and reconnect resume playback', async () => {
 const f = fixture(); f.unblock(); f.controller.setActive(true); await f.flush();
 f.document.hidden = true; f.document.dispatchEvent(new Event('visibilitychange')); assert.equal(f.video.paused, true);
 f.document.hidden = false; f.document.dispatchEvent(new Event('visibilitychange')); await f.flush(); assert.equal(f.video.paused, false);
 f.video.error = {}; f.window.dispatchEvent(new Event('online')); await f.flush(); assert.equal(f.counts().loads, 1); assert.equal(f.video.paused, false);
 f.controller.destroy();
});
