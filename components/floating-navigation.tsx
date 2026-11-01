'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './floating-navigation.module.css';

const links = ['Work', 'Services', 'About', 'Contact'];

export function FloatingNavigation() {
 const root = useRef<HTMLElement>(null);
 const toggle = useRef<HTMLButtonElement>(null);
 const [open, setOpen] = useState(false);
 const [scrolled, setScrolled] = useState(false);

 useEffect(() => {
  const update = () => setScrolled(window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
  return () => window.removeEventListener('scroll', update);
 }, []);

 useEffect(() => {
  const keydown = (event: KeyboardEvent) => {
   if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus(); }
  };
  const outside = (event: PointerEvent) => {
   if (open && event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
  };
  const resize = () => { if (window.innerWidth > 760) setOpen(false); };
  window.addEventListener('keydown', keydown);
  window.addEventListener('pointerdown', outside);
  window.addEventListener('resize', resize);
  return () => {
   window.removeEventListener('keydown', keydown);
   window.removeEventListener('pointerdown', outside);
   window.removeEventListener('resize', resize);
  };
 }, [open]);

 return <nav ref={root} className={styles.navigation} data-scrolled={scrolled} aria-label="Main navigation">
  <a className={styles.brand} href="#home" aria-label="paceIT home" onClick={() => setOpen(false)}>pace<b>IT.</b></a>
  <div className={styles.links} id="main-navigation" data-open={open}>
   {links.map(label => <a key={label} href={'#' + label.toLowerCase()} onClick={() => setOpen(false)}>{label}</a>)}
  </div>
  <a className={styles.contact} href="#contact" onClick={() => setOpen(false)}>Let’s talk</a>
  <button ref={toggle} className={styles.toggle} type="button" aria-controls="main-navigation" aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(value => !value)}><span /><span /></button>
 </nav>;
}
