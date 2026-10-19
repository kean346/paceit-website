'use client';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowUpRight, Check, Copy, Menu, Pause, Play, X } from 'lucide-react';
import { TiltedGridHero } from '@/components/ui/tilted-grid-hero';

export function Navigation() {
 const [open,setOpen]=useState(false);
 return <header className="site-header section-shell"><a className="wordmark" href="#home" aria-label="paceIT home">pace<span>IT.</span></a><nav aria-label="Main navigation" className={open?'nav open':'nav'} id="main-navigation">{['Home','Work','Services','About','Contact'].map(v=><a key={v} href={'#'+v.toLowerCase()} onClick={()=>setOpen(false)}>{v}</a>)}</nav><a href="#contact" className="nav-cta">Let’s talk <ArrowUpRight size={17}/></a><button className="menu-button" aria-controls="main-navigation" aria-expanded={open} aria-label={open?'Close navigation':'Open navigation'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></header>;
}
export function Reveal({children}:{children:ReactNode}) {
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{const el=ref.current;if(!el||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const ob=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('is-visible');ob.disconnect();}},{threshold:.08});el.classList.add('reveal-ready');ob.observe(el);return()=>ob.disconnect();},[]);
 return <div ref={ref}>{children}</div>;
}
const galleryImages=[{src:'/work/overview.svg',alt:'Flow Plumbing quotes overview prototype'},{src:'/work/quote.svg',alt:'Quote details prototype'},{src:'/work/followups.svg',alt:'Follow-up view prototype'},{src:'/work/overview.svg',alt:'Quotes overview'}];
export function PortfolioGallery(){
 const [playing,setPlaying]=useState(false);const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!playing)return;const timer=setTimeout(()=>setPlaying(false),18000);return()=>clearTimeout(timer);},[playing]);
 useEffect(()=>{const el=ref.current;if(!el)return;const ob=new IntersectionObserver(([e])=>{if(!e.isIntersecting)setPlaying(false);});ob.observe(el);return()=>ob.disconnect();},[]);
 return <div ref={ref} className={'portfolio-gallery '+(playing?'gallery-playing':'gallery-paused')}><TiltedGridHero images={galleryImages} tileHeight={76} axis={51} curve={42} speed={6} gap={10} fade={12} className="gallery-band"/><div className="gallery-caption section-shell"><span className="mono">ONE PROJECT. THREE VIEWS. <span className="gallery-mobile-hide">/ FLOW PLUMBING</span></span><button className="gallery-toggle" onClick={()=>setPlaying(!playing)} aria-pressed={playing}>{playing?<Pause size={14}/>:<Play size={14}/>} {playing?'Pause reel':'Play reel'}</button></div></div>;
}
export function ContactForm(){
 const [message,setMessage]=useState('');const [brief,setBrief]=useState('');
 const contact=process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const data=new FormData(e.currentTarget);const text=`Project enquiry for paceIT\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('idea')}`;setBrief(text);
 if(contact){window.location.href=`mailto:${contact}?subject=${encodeURIComponent('Let’s discuss a project')}&body=${encodeURIComponent(text)}`;setMessage('Your email app will open with the brief. Send it there to get in touch.');return;}
 try{await navigator.clipboard.writeText(text);setMessage('Brief copied. Nothing has been sent.');}catch{setMessage('Your brief is ready below. Select and copy it.');}}
 return <form className="contact-form" onSubmit={submit}><div className="form-heading"><span className="mono">START WITH A FEW WORDS</span><span className="small-arrow">↗</span></div><label htmlFor="name">Your name<input name="name" id="name" autoComplete="name" placeholder="Kean, for example" required maxLength={100}/></label><label htmlFor="email">Email address<input name="email" id="email" type="email" autoComplete="email" placeholder="you@yourbusiness.co.za" required maxLength={254}/></label><label htmlFor="idea">What would you like to make easier?<textarea name="idea" id="idea" placeholder="Tell us a little about the problem or idea…" required minLength={10} maxLength={4000} rows={3}/></label><button className="button primary" type="submit">{contact?'Draft an enquiry':'Copy project brief'} {contact?<ArrowUpRight size={18}/>:<Copy size={17}/>}</button><p className="form-note">{contact?'Opens your email app. No information is stored on this website.':'Direct contact details are coming soon. Prepare and copy your brief here; nothing is sent or stored.'}</p><p className="form-status" role="status">{message&&<><Check size={14}/>{message}</>}</p>{brief&&<details className="brief-details"><summary>View your brief</summary><pre>{brief}</pre></details>}</form>;
}
