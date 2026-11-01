'use client';

import { useEffect, useRef, useState } from 'react';
import { mountHands } from './hands-animation';
import styles from './hands-hero.module.css';

const navigation = ['Work', 'Services', 'About', 'Contact'];

export function HandsHero() {
 const canvas = useRef<HTMLCanvasElement>(null);
 const menuButton = useRef<HTMLButtonElement>(null);
 const [menuOpen, setMenuOpen] = useState(false);

 useEffect(() => {
  if (canvas.current) return mountHands(canvas.current);
 }, []);

 useEffect(() => {
  const close = (event: KeyboardEvent) => {
   if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); }
  };
  const resize = () => { if (innerWidth > 760) setMenuOpen(false); };
  window.addEventListener('keydown', close);
  window.addEventListener('resize', resize);
  return () => { window.removeEventListener('keydown', close); window.removeEventListener('resize', resize); };
 }, [menuOpen]);

 return <section className={styles.hero} id="home" aria-labelledby="hero-title">
  <canvas ref={canvas} aria-hidden="true" />
  <nav className="navigation" aria-label="Main navigation">
   <a className="brand" href="#home" aria-label="paceIT home" onClick={() => setMenuOpen(false)}>pace<b>IT.</b></a>
   <div className={menuOpen ? 'nav-links open' : 'nav-links'} id="main-navigation">{navigation.map(label => <a key={label} href={'#' + label.toLowerCase()} onClick={() => setMenuOpen(false)}>{label}</a>)}</div>
   <a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Let’s talk</a>
   <button ref={menuButton} type="button" className="menu-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}><span /><span /></button>
  </nav>
  <div className="copy"><h1 id="hero-title"><span>Connecting</span>Your business.</h1><p>Websites, apps and automation.<br />Thoughtfully connected. Built around you.</p><div className="cta"><a href="#contact">Let’s build together</a></div></div>
  <div className="services" aria-label="What we build">
<div className="service"><svg className="mini" viewBox="0 0 44 34" aria-hidden="true"><rect className="frame" x="1" y="2" width="42" height="29" rx="4"/><path className="line" d="M2 9h40"/><circle className="dark" cx="5" cy="5.5" r=".7"/><circle className="green" cx="8" cy="5.5" r=".7"/><rect className="green" x="5" y="13" width="8" height="14" rx="1"/><rect className="paper" x="16" y="13" width="23" height="6" rx="1"/><path className="line" d="M17 23h8m-8 3h5"/><path className="wire" d="m29 26 3-4 3 2 4-5"/></svg><span>Web apps</span></div>
<div className="service"><svg className="mini" viewBox="0 0 44 34" aria-hidden="true"><rect className="frame" x="9" y="1" width="21" height="32" rx="4"/><rect className="paper" x="12" y="5" width="15" height="24" rx="1"/><rect className="green" x="14" y="8" width="11" height="8" rx="2"/><path className="line" d="M14 20h10m-10 3h6"/><rect className="dark" x="14" y="26" width="11" height="2" rx="1"/><rect className="frame" x="25" y="16" width="13" height="13" rx="3"/><path d="m29 22 2 2 3-4" className="wire"/></svg><span>Applications</span></div>
<div className="service"><svg className="mini" viewBox="0 0 44 34" aria-hidden="true"><rect className="frame" x="1" y="3" width="34" height="24" rx="3"/><rect className="paper" x="4" y="6" width="28" height="18" rx="1"/><rect className="green" x="6" y="9" width="24" height="7" rx="1"/><path className="line" d="M7 20h12M12 31h14m-7-4v4"/><rect className="frame" x="29" y="14" width="13" height="19" rx="2"/><rect className="green" x="31" y="17" width="9" height="6" rx="1"/><path className="line" d="M32 26h7m-7 3h4"/></svg><span>Responsive websites</span></div>
<div className="service"><svg className="mini" viewBox="0 0 44 34" aria-hidden="true"><path className="wire" d="M10 17h11m0 0V7h9M21 17v10h9"/><rect className="frame" x="1" y="11" width="14" height="12" rx="3"/><rect className="green" x="28" y="1" width="14" height="12" rx="3"/><rect className="frame" x="28" y="21" width="14" height="12" rx="3"/><path className="wire" d="m5 17 2 2 4-5m21-7h6m-3-3v6m-3 18 2 2 4-5"/></svg><span>Business automation systems</span></div>
</div>
 </section>;
}
