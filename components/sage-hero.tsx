'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, PanelsTopLeft, Code2, Workflow } from 'lucide-react';
import styles from './sage-hero.module.css';

const videoSource = '/media/sage-system.mp4';
const navigation = ['Work', 'Services', 'About', 'Contact'];
const services = [
 { label: 'Websites', value: 'Stand out.', detail: 'Digital presence', href: '#services', Icon: PanelsTopLeft },
 { label: 'Software', value: 'Work smart.', detail: 'Custom systems', href: '#custom-software', Icon: Code2 },
 { label: 'Automation', value: 'Do more.', detail: 'Less busywork', href: '#business-automation', Icon: Workflow },
];

export function SageHero() {
 const stage = useRef<HTMLElement>(null);
 const photo = useRef<HTMLImageElement>(null);
 const firstVideo = useRef<HTMLVideoElement>(null);
 const secondVideo = useRef<HTMLVideoElement>(null);
 const menuButton = useRef<HTMLButtonElement>(null);
 const [menuOpen, setMenuOpen] = useState(false);

 useEffect(() => {
  const root = stage.current, image = photo.current, a = firstVideo.current, b = secondVideo.current;
  if (!root || !image || !a || !b) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let disposed = false, frame = 0, fadeTimer = 0, playback = 0;
  let current = a, next = b, fading = false, fadeStart = 0;
  const animations: Animation[] = [];

  function stopVideo() {
   playback++; cancelAnimationFrame(frame); window.clearTimeout(fadeTimer);
   for (const video of [a!, b!]) { video.pause(); video.style.opacity = '0'; video.style.transition = 'none'; }
  }

  function tick(now: number) {
   if (disposed || reduced.matches || document.hidden) return;
   if (!fading && current.duration && current.currentTime >= current.duration - 1 && next.readyState >= 2) {
    next.currentTime = 0; next.style.zIndex = '3'; current.style.zIndex = '2'; next.style.opacity = '0';
    void next.play().catch(() => {}); fading = true; fadeStart = now;
   }
   if (fading) {
    const progress = Math.min(1, (now - fadeStart) / 1000);
    next.style.opacity = String(progress);
    if (progress >= 1) {
     current.pause(); current.style.opacity = '0'; current.currentTime = 0;
     const previous = current; current = next; next = previous; fading = false;
    }
   }
   frame = requestAnimationFrame(tick);
  }

  async function startVideo() {
   stopVideo();
   if (disposed || reduced.matches || document.hidden) return;
   const request = playback;
   current = a!; next = b!; fading = false;
   for (const video of [a!, b!]) {
    video.muted = true;
    if (!video.getAttribute('src')) { video.src = videoSource; video.preload = 'auto'; video.load(); }
   }
   current.currentTime = 0;
   try {
    await current.play();
    if (disposed || request !== playback || reduced.matches || document.hidden) return;
    current.style.zIndex = '2'; current.style.transition = 'opacity .8s ease'; current.style.opacity = '1';
    fadeTimer = window.setTimeout(() => { if (!disposed) current.style.transition = 'none'; }, 850);
    frame = requestAnimationFrame(tick);
   } catch { /* The authored poster remains visible when autoplay is unavailable. */ }
  }

  function entrance() {
   if (disposed || reduced.matches) return;
   const animate = (element: Element | null, keyframes: Keyframe[], duration: number, delay: number) => {
    if (element) animations.push(element.animate(keyframes, { duration, delay, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }));
   };
   root!.querySelectorAll('header > *').forEach((element, i) => animate(element, [{ opacity: 0, transform: 'translateY(-12px)' }, { opacity: 1, transform: 'translateY(0)' }], 750, i * 80));
   animate(root!.querySelector('[data-dot]'), [{ clipPath: 'circle(0%)' }, { clipPath: 'circle(75%)' }], 650, 180);
   animate(root!.querySelector('[data-eyebrow]'), [{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], 750, 260);
   root!.querySelectorAll('[data-line]').forEach((element, i) => animate(element, [{ opacity: 0, transform: 'translateY(110%)' }, { opacity: 1, transform: 'translateY(0)' }], 1000, 340 + i * 120));
   root!.querySelectorAll('[data-copy]').forEach((element, i) => animate(element, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], 800, 660 + i * 90));
   root!.querySelectorAll('[data-card]').forEach((element, i) => animate(element, [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], 950, 650 + i * 110));
   void Promise.all(animations.map(animation => animation.finished.catch(() => {}))).then(() => animations.forEach(animation => animation.cancel()));
  }

  const imageReady = image.complete ? Promise.resolve() : new Promise<void>(resolve => { image.addEventListener('load', () => resolve(), { once: true }); image.addEventListener('error', () => resolve(), { once: true }); });
  void Promise.all([document.fonts.ready, imageReady]).then(() => { if (!disposed) { entrance(); void startVideo(); } });
  const motionChanged = () => { animations.forEach(animation => animation.cancel()); void startVideo(); };
  const visibilityChanged = () => { if (document.hidden) stopVideo(); else void startVideo(); };
  reduced.addEventListener('change', motionChanged); document.addEventListener('visibilitychange', visibilityChanged);
  return () => { disposed = true; stopVideo(); animations.forEach(animation => animation.cancel()); reduced.removeEventListener('change', motionChanged); document.removeEventListener('visibilitychange', visibilityChanged); };
 }, []);

 useEffect(() => {
  const close = (event: KeyboardEvent) => { if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); } };
  const resize = () => { if (innerWidth > 820) setMenuOpen(false); };
  window.addEventListener('keydown', close); window.addEventListener('resize', resize);
  return () => { window.removeEventListener('keydown', close); window.removeEventListener('resize', resize); };
 }, [menuOpen]);

 return <section ref={stage} className={styles.stage} id="home" aria-labelledby="hero-title">
  <div className={styles.scene} aria-hidden="true">
   {/* The hand and globe are photographic assets, not code-drawn scene elements. */}
   {/* eslint-disable-next-line @next/next/no-img-element */}
   <img ref={photo} className={styles.photo} src="/media/sage-system-poster.png" alt="" fetchPriority="high" />
   <video ref={firstVideo} className={styles.film} muted playsInline preload="none" tabIndex={-1} />
   <video ref={secondVideo} className={styles.film} muted playsInline preload="none" tabIndex={-1} />
  </div>
  <header className={menuOpen ? styles.menuOpen : undefined}>
   <a className={styles.logo} href="#home" aria-label="paceIT home" onClick={() => setMenuOpen(false)}>pace<span>IT.</span></a>
   <nav id="main-navigation" aria-label="Main navigation">{navigation.map(label => <a key={label} href={'#' + label.toLowerCase()} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav>
   <div className={styles['header-actions']}><a className={`${styles.pill} ${styles.contact}`} href="#contact" onClick={() => setMenuOpen(false)}>Let’s talk <ArrowUpRight size={18} aria-hidden="true" /></a><a className={`${styles.pill} ${styles.solid}`} href="#work" onClick={() => setMenuOpen(false)}>Explore our work</a></div>
   <button ref={menuButton} className={styles.burger} type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}><span /><span /></button>
  </header>
  <div className={styles.copy}>
   <p className={styles.eyebrow}><span className={styles['status-dot']} data-dot aria-hidden="true" /><span data-eyebrow>Built around your business</span></p>
   <h1 id="hero-title"><span className={styles.line}><span data-line>Your business.</span></span><span className={styles.line}><span data-line>Better connected.</span></span></h1>
   <p className={styles.description} data-copy>Websites, custom software and smart automation — thoughtfully connected to make your business work better.</p>
   <a className={`${styles.pill} ${styles.solid} ${styles['main-cta']}`} href="#contact" data-copy>Let’s build something useful <ArrowUpRight size={18} aria-hidden="true" /></a>
  </div>
  <aside className={styles.cards} aria-label="What paceIT builds">{services.map(({ label, value, detail, href, Icon }) => <a key={label} className={styles['glass-card']} href={href} data-card><div className={styles['card-label']}>{label}<Icon aria-hidden="true" /></div><div className={styles['card-value']}>{value}</div><div className={styles['card-detail']}>{detail}</div></a>)}</aside>
 </section>;
}
