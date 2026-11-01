'use client';

import { useEffect, useRef } from 'react';
import styles from './services-combined.module.css';

// The reference's seven-row LED lettering, rendered as vectors at every screen size.
const intelligentGlyphs: Record<string, string[]> = {
 I: ['111','010','010','010','010','010','111'],
 n: ['00000','00000','11110','10001','10001','10001','10001'],
 t: ['010','010','111','010','010','010','001'],
 e: ['00000','00000','01110','10001','11111','10000','01110'],
 l: ['10','10','10','10','10','10','01'],
 i: ['1','0','1','1','1','1','1'],
 g: ['00000','00000','01111','10001','01111','00001','01110'],
};

function IntelligentWord() {
 let x = 0;
 const dots: { x: number; y: number }[] = [];
 for (const character of 'Intelligent') {
  const glyph = intelligentGlyphs[character];
  glyph.forEach((row, y) => [...row].forEach((bit, column) => {
   if (bit === '1') dots.push({ x: x + column * 4 + 1.8, y: y * 4 + 1.8 });
  }));
  x += glyph[0].length * 4 + 4;
 }
 return <span className="sc-dot-word" role="img" aria-label="Intelligent"><svg viewBox={`0 0 ${x} 28`} aria-hidden="true">{dots.map((dot, index) => <circle key={index} cx={dot.x} cy={dot.y} r="1.65" />)}</svg></span>;
}

export function ServicesCombined() {
 const section = useRef<HTMLElement>(null);

 useEffect(() => {
  const root = section.current;
  if (!root) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 650px)');
  const videos = [...root.querySelectorAll('video')];
  const visible = new Set<HTMLVideoElement>();
  let disposed = false;

  const updatePlayback = () => {
   videos.forEach(video => {
    const activeSize = video.classList.contains('sc-stage-video--mobile') ? narrow.matches
     : video.classList.contains('sc-stage-video--wide') ? !narrow.matches : true;
    if (!disposed && !document.hidden && !reduced.matches && activeSize && visible.has(video)) {
     video.muted = true;
     void video.play().catch(() => { /* Original posters remain visible if playback is unavailable. */ });
    } else video.pause();
   });
  };

  // Reveal once, scoped to this section. Content remains readable without JavaScript.
  root.classList.add('sc-js');
  const entrance = new IntersectionObserver(entries => {
   if (entries.some(entry => entry.isIntersecting)) {
    root.classList.add('sc-in-view');
    entrance.disconnect();
   }
  }, { threshold: .08 });
  entrance.observe(root);
  const playback = new IntersectionObserver(entries => {
   entries.forEach(entry => {
    const video = entry.target as HTMLVideoElement;
    if (entry.isIntersecting) visible.add(video); else visible.delete(video);
   });
   updatePlayback();
  }, { threshold: .02 });
  videos.forEach(video => playback.observe(video));
  reduced.addEventListener('change', updatePlayback);
  narrow.addEventListener('change', updatePlayback);
  document.addEventListener('visibilitychange', updatePlayback);
  return () => {
   disposed = true;
   entrance.disconnect(); playback.disconnect();
   videos.forEach(video => video.pause());
   reduced.removeEventListener('change', updatePlayback);
   narrow.removeEventListener('change', updatePlayback);
   document.removeEventListener('visibilitychange', updatePlayback);
  };
 }, []);

 return (
  <section ref={section} className={styles.section} id="services" aria-labelledby="services-title">
    <video className="sc-stage-video sc-stage-video--wide" muted loop playsInline preload="none" aria-hidden="true"
      poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/5c3ec08f-2dbf-4c0a-8588-f6106a789443.webp"
      src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125226_45cb4f38-aa7e-47e1-885d-ae0b69745369.mp4"></video>
    <video className="sc-stage-video sc-stage-video--mobile" muted loop playsInline preload="none" aria-hidden="true"
      poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/0f4926a4-e660-4df2-9195-2bfb3e341bdd.webp"
      src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125242_daae1570-386d-4bd5-8896-80499e2371e0.mp4"></video>
    <div className="sc-stage-tint" aria-hidden="true"></div>
    <svg className="sc-paper" aria-hidden="true" width="100%" height="100%">
      <defs>
        <filter id="services-paper-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" seed="8" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <pattern id="services-paper-fibres" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(17)">
          <path d="M0 0V7M3.5 0V7" stroke="#727b6f" strokeWidth=".45" opacity=".12" />
          <path d="M0 1H7M0 5H7" stroke="#fff" strokeWidth=".6" opacity=".4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" filter="url(#services-paper-noise)" opacity=".16" />
      <rect width="100%" height="100%" fill="url(#services-paper-fibres)" />
    </svg>
    <div className="sc-inner">
      <header className="sc-top">
        <div>
          <p className="sc-eyebrow">02 / WHAT WE DO &amp; HOW WE WORK</p>
          <h2 className="sc-title" id="services-title">Your problem.<span className="sc-title-line"><IntelligentWord /> solutions.</span></h2>
        </div>
        <div className="sc-process" aria-label="Our process: Understand, Build, Improve">
          <b>Understand</b><i className="sc-arrow" aria-hidden="true"></i><b>Build</b><i className="sc-arrow" aria-hidden="true"></i><b>Improve</b>
        </div>
      </header>
      <div className="sc-cards" aria-label="What we can build">
        <article className="sc-card sc-card--software" id="custom-software">
          <video className="sc-card__video" muted loop playsInline preload="none" aria-hidden="true"
            poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/167977c6-8539-46b1-9a15-8dba566f50b8.png"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_130045_1a612b69-4854-4b34-8043-ccb91f2c60af.mp4"></video>
          <div className="sc-card__gradient" aria-hidden="true" /><div className="sc-card__shine" aria-hidden="true" />
          <div className="sc-card__head"><span className="sc-card__number">01 / SOFTWARE</span><h3>Software that fits.</h3></div>
          <div className="sc-visual sc-visual--software" aria-hidden="true"><span className="sc-core">&lt;/&gt;</span></div>
          <div className="sc-card__footer"><p>Websites, apps, portals and internal tools.</p></div>
        </article>
        <article className="sc-card sc-card--automation" id="business-automation">
          <video className="sc-card__video" muted loop playsInline preload="none" aria-hidden="true"
            poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/0446d1d5-e65e-4db5-8090-3e30d09afc43.png"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_130054_dd005674-d693-4d81-80a5-357f7f10b3a3.mp4"></video>
          <div className="sc-card__gradient" aria-hidden="true" /><div className="sc-card__shine" aria-hidden="true" />
          <div className="sc-card__head"><span className="sc-card__number">02 / AUTOMATION</span><h3>Less busywork.</h3></div>
          <div className="sc-visual sc-visual--automation" aria-hidden="true"><div className="sc-flow-panel">
            <svg viewBox="0 0 300 145" preserveAspectRatio="xMidYMid meet"><path d="M32 105 H106 Q121 105 121 89 V79 Q121 64 137 64 H166 Q180 64 180 79 V89 Q180 105 195 105 H270"/><circle cx="32" cy="105" r="5"/><circle cx="121" cy="64" r="5"/><circle cx="180" cy="105" r="5"/><circle cx="269" cy="105" r="5"/></svg>
          </div></div>
          <div className="sc-card__footer"><p>Automations and integrations that keep things moving.</p></div>
        </article>
        <article className="sc-card sc-card--insight" id="dashboards-reporting">
          <video className="sc-card__video" muted loop playsInline preload="none" aria-hidden="true"
            poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/da8d0242-4dee-4f6d-813f-a5887e86ad77.png"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_130103_7550f407-f14b-40a6-9616-7a26d7a8bd9f.mp4"></video>
          <div className="sc-card__gradient" aria-hidden="true" /><div className="sc-card__shine" aria-hidden="true" />
          <div className="sc-card__head"><span className="sc-card__number">03 / INSIGHT</span><h3>A clearer picture.</h3></div>
          <div className="sc-visual sc-visual--insight" aria-hidden="true">
            <svg className="sc-network" viewBox="0 0 429 238" preserveAspectRatio="none">
              <path d="M0 5H128c27 0 36 7 39 26 2 16 9 22 24 22h106c16 0 23-8 25-25 2-16 10-23 31-23h76"/>
              <path d="M0 61h95c14 0 22-6 27-20 4-13 12-20 27-20h115c15 0 23 6 27 20 5 14 13 20 28 20h110"/>
              <path d="M0 117h88c15 0 22-8 25-25 4-24 12-31 31-31h129c20 0 27 7 31 31 3 17 10 25 26 25h99"/>
              <path d="M0 173h87c15 0 22 7 27 25 4 15 11 22 28 22h140c17 0 25-7 29-22 5-18 12-25 28-25h90"/>
              <circle cx="45" cy="117" r="5.5"/><circle cx="133" cy="61" r="5.5"/><circle cx="189" cy="61" r="5.5"/><circle cx="319" cy="61" r="5.5"/><circle cx="319" cy="117" r="5.5"/>
            </svg>
          </div>
          <div className="sc-card__footer"><p>Dashboards, reporting and practical AI.</p></div>
        </article>
      </div>
      <div className="sc-tech" aria-label="Technology and capabilities">
        <span className="sc-tech__label">TOOLS &amp; TECHNOLOGIES</span>
        <div className="sc-tech__window">
          <span className="sc-sr-only">Web Apps, Portals, Automation, Dashboards, AI, JavaScript, TypeScript, React, Next.js, Node.js, Python, Java, SQL, APIs, Supabase, Firebase, GitHub, Vercel</span>
          <div className="sc-tech__track" aria-hidden="true">
            <div className="sc-tech__group"><span>Web Apps</span><span className="sc-sep">✦</span><span>Portals</span><span className="sc-sep">✦</span><span>Automation</span><span className="sc-sep">✦</span><span>Dashboards</span><span className="sc-sep">✦</span><span>AI</span><span className="sc-sep">✦</span><span>JavaScript</span><span className="sc-sep">✦</span><span>TypeScript</span><span className="sc-sep">✦</span><span>React</span><span className="sc-sep">✦</span><span>Next.js</span><span className="sc-sep">✦</span><span>Node.js</span><span className="sc-sep">✦</span><span>Python</span><span className="sc-sep">✦</span><span>Java</span><span className="sc-sep">✦</span><span>SQL</span><span className="sc-sep">✦</span><span>APIs</span><span className="sc-sep">✦</span><span>Supabase</span><span className="sc-sep">✦</span><span>Firebase</span><span className="sc-sep">✦</span><span>GitHub</span><span className="sc-sep">✦</span><span>Vercel</span><span className="sc-sep">✦</span></div>
            <div className="sc-tech__group"><span>Web Apps</span><span className="sc-sep">✦</span><span>Portals</span><span className="sc-sep">✦</span><span>Automation</span><span className="sc-sep">✦</span><span>Dashboards</span><span className="sc-sep">✦</span><span>AI</span><span className="sc-sep">✦</span><span>JavaScript</span><span className="sc-sep">✦</span><span>TypeScript</span><span className="sc-sep">✦</span><span>React</span><span className="sc-sep">✦</span><span>Next.js</span><span className="sc-sep">✦</span><span>Node.js</span><span className="sc-sep">✦</span><span>Python</span><span className="sc-sep">✦</span><span>Java</span><span className="sc-sep">✦</span><span>SQL</span><span className="sc-sep">✦</span><span>APIs</span><span className="sc-sep">✦</span><span>Supabase</span><span className="sc-sep">✦</span><span>Firebase</span><span className="sc-sep">✦</span><span>GitHub</span><span className="sc-sep">✦</span><span>Vercel</span><span className="sc-sep">✦</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
 );
}
