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
const galleryImages=[
 {src:'/work/overview.svg',alt:'Flow Plumbing — dashboard demo'},
 {src:'/work/website-placeholder.svg',alt:'Field Studio — fictional website concept'},
 {src:'/work/bookings-concept.svg',alt:'Daylight — booking app concept'},
 {src:'/work/operations-concept.svg',alt:'Relay — operations board concept'},
];
export function PortfolioGallery(){
 const [paused,setPaused]=useState(false);const [visible,setVisible]=useState(false);const [reduced,setReduced]=useState(true);const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 useEffect(()=>{if(!ref.current)return;const ob=new IntersectionObserver(([e])=>setVisible(e.isIntersecting));ob.observe(ref.current);return()=>ob.disconnect();},[]);
 const playing=visible&&!paused&&!reduced;
 return <div ref={ref} className={'portfolio-gallery portfolio-reference '+(playing?'gallery-playing':'gallery-paused')}><TiltedGridHero images={galleryImages} tileHeight={36} className="gallery-band"><div className="reference-copy"><h2 id="work-title">Selected work.</h2><p>Websites, software and automation<br/>built around real business needs.</p></div></TiltedGridHero><div className="reference-footer"><span>Demo projects &amp; design concepts</span>{!reduced&&<button className="gallery-toggle" onClick={()=>setPaused(v=>!v)} aria-label={paused?'Resume carousel':'Pause carousel'}>{paused?<Play size={15}/>:<Pause size={15}/>}<span>{paused?'Resume':'Pause'}</span></button>}</div></div>;
}
export function ContactForm(){
 const [message,setMessage]=useState('');const [brief,setBrief]=useState('');
 const contact=process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const data=new FormData(e.currentTarget);const text=`Project enquiry for paceIT\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('idea')}`;setBrief(text);
 if(contact){window.location.href=`mailto:${contact}?subject=${encodeURIComponent('Let’s discuss a project')}&body=${encodeURIComponent(text)}`;setMessage('Your email app will open with the brief. Send it there to get in touch.');return;}
 try{await navigator.clipboard.writeText(text);setMessage('Brief copied. Nothing has been sent.');}catch{setMessage('Your brief is ready below. Select and copy it.');}}
 return <form className="contact-form" onSubmit={submit}><div className="form-heading"><span className="mono">START WITH A FEW WORDS</span><span className="small-arrow">↗</span></div><label htmlFor="name">Your name<input name="name" id="name" autoComplete="name" placeholder="Kean, for example" required maxLength={100}/></label><label htmlFor="email">Email address<input name="email" id="email" type="email" autoComplete="email" placeholder="you@yourbusiness.co.za" required maxLength={254}/></label><label htmlFor="idea">What would you like to make easier?<textarea name="idea" id="idea" placeholder="Tell us a little about the problem or idea…" required minLength={10} maxLength={4000} rows={3}/></label><button className="button primary" type="submit">{contact?'Draft an enquiry':'Copy project brief'} {contact?<ArrowUpRight size={18}/>:<Copy size={17}/>}</button><p className="form-note">{contact?'Opens your email app. No information is stored on this website.':'Direct contact details are coming soon. Prepare and copy your brief here; nothing is sent or stored.'}</p><p className="form-status" role="status">{message&&<><Check size={14}/>{message}</>}</p>{brief&&<details className="brief-details"><summary>View your brief</summary><pre>{brief}</pre></details>}</form>;
}
