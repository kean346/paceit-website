/** Recover decorative demo playback without replacing the authored poster or controls. */
export function createGalleryVideoPlayback(video: HTMLVideoElement, onFrame: () => void = () => {}) {
 let active = false, disposed = false, pending = false, blocked = false;
 let reloads = 0, lastTime = video.currentTime, lastProgress = performance.now();
 let timer: ReturnType<typeof setInterval> | undefined;
 video.muted = true;
 video.defaultMuted = true;
 video.loop = true;
 video.playsInline = true;
 video.setAttribute('muted', '');
 video.setAttribute('playsinline', '');
 video.preload = 'auto';
 const canRun = () => active && !disposed && !document.hidden;

 function play() {
  if (!canRun() || pending || blocked || video.error || (!video.paused && video.readyState >= 2)) return;
  pending = true;
  void video.play().then(() => {
   if (!canRun()) video.pause();
  }).catch((error: unknown) => {
   // Autoplay restrictions need a user gesture, not repeated downloads.
   if (error instanceof DOMException && error.name === 'NotAllowedError') blocked = true;
  }).finally(() => { pending = false; });
 }
 function reload() {
  if (!canRun() || navigator.onLine === false || reloads >= 2 || blocked) return;
  reloads++;
  lastProgress = performance.now();
  video.load();
  play();
 }
 function ready() { if (!disposed) { onFrame(); play(); } }
 function progress() {
  if (video.currentTime !== lastTime) { lastTime = video.currentTime; lastProgress = performance.now(); }
 }
 function check() {
  if (!canRun() || navigator.onLine === false || blocked) return;
  progress();
  if (performance.now() - lastProgress > 10000) reload();
  else if (video.paused) play();
 }
 function sync() {
  if (timer) clearInterval(timer);
  timer = undefined;
  if (!canRun()) { video.pause(); return; }
  lastProgress = performance.now();
  if (video.error) reload(); else play();
  timer = setInterval(check, 1500);
 }
 function retry() {
  if (!canRun()) return;
  blocked = false;
  if (video.error) reload(); else play();
 }
 function online() { reloads = 0; retry(); }
 const readyEvents = ['loadedmetadata', 'loadeddata', 'canplay', 'playing'];
 readyEvents.forEach(event => video.addEventListener(event, ready));
 video.addEventListener('timeupdate', progress);
 document.addEventListener('visibilitychange', sync);
 window.addEventListener('online', online);
 window.addEventListener('pointerdown', retry, { passive: true });
 window.addEventListener('touchend', retry, { passive: true });
 window.addEventListener('keydown', retry);

 return {
  setActive(next: boolean) {
   if (active === next) return;
   active = next;
   if (active) reloads = 0;
   sync();
  },
  destroy() {
   disposed = true;
   if (timer) clearInterval(timer);
   video.pause();
   readyEvents.forEach(event => video.removeEventListener(event, ready));
   video.removeEventListener('timeupdate', progress);
   document.removeEventListener('visibilitychange', sync);
   window.removeEventListener('online', online);
   window.removeEventListener('pointerdown', retry);
   window.removeEventListener('touchend', retry);
   window.removeEventListener('keydown', retry);
  },
 };
}
