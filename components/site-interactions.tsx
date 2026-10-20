'use client';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowUpRight, Check, Menu, X } from 'lucide-react';
import { site } from '@/lib/site';

export function Navigation() {
 const [open,setOpen]=useState(false);
 return <header className="site-header section-shell"><a className="wordmark" href="#home" aria-label="paceIT home">pace<span>IT.</span></a><nav aria-label="Main navigation" className={open?'nav open':'nav'} id="main-navigation">{['Home','Work','Services','About','Contact'].map(v=><a key={v} href={'#'+v.toLowerCase()} onClick={()=>setOpen(false)}>{v}</a>)}</nav><a href="#contact" className="nav-cta">Let’s talk <ArrowUpRight size={17}/></a><button className="menu-button" aria-controls="main-navigation" aria-expanded={open} aria-label={open?'Close navigation':'Open navigation'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></header>;
}
export function Reveal({children}:{children:ReactNode}) {
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{const el=ref.current;if(!el||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const ob=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('is-visible');ob.disconnect();}},{threshold:.08});el.classList.add('reveal-ready');ob.observe(el);return()=>ob.disconnect();},[]);
 return <div ref={ref}>{children}</div>;
}
export function ContactForm(){
 const [message,setMessage]=useState('');const [sending,setSending]=useState(false);const [sent,setSent]=useState(false);
 const inFlight=useRef(false);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(inFlight.current)return;
  const form=e.currentTarget;const data=new FormData(form);
  inFlight.current=true;setSending(true);setSent(false);setMessage('');
  try {
   const response=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.get('name'),email:data.get('email'),idea:data.get('idea'),website:data.get('website')}),signal:AbortSignal.timeout(25000)});
   const result=await response.json();
   if(!response.ok){setMessage(typeof result.message==='string'?result.message:`Your enquiry could not be sent. Please email ${site.email}.`);return;}
   setSent(true);setMessage('Thank you. Your enquiry has been sent. We’ll be in touch.');form.reset();
  } catch {setMessage(`Your enquiry could not be sent. Please try again or email ${site.email}.`);}
  finally{inFlight.current=false;setSending(false);}
 }
 return <form className="contact-form" onSubmit={submit} aria-busy={sending}><div className="form-heading"><span className="mono">START WITH A FEW WORDS</span><span className="small-arrow">↗</span></div><label htmlFor="name">Your name<input name="name" id="name" autoComplete="name" placeholder="Kean, for example" required maxLength={100} disabled={sending}/></label><label htmlFor="email">Email address<input name="email" id="email" type="email" autoComplete="email" placeholder="you@yourbusiness.co.za" required maxLength={254} disabled={sending}/></label><label htmlFor="idea">What would you like to make easier?<textarea name="idea" id="idea" placeholder="Tell us a little about the problem or idea…" required minLength={10} maxLength={4000} rows={3} disabled={sending}/></label><div className="enquiry-trap" aria-hidden="true"><label htmlFor="website">Website<input name="website" id="website" type="text" tabIndex={-1} autoComplete="off"/></label></div><button className="button primary" type="submit" disabled={sending}>{sending?'Sending…':'Send enquiry'} <ArrowUpRight size={18}/></button><p className="form-note">Send your enquiry directly to <a href={`mailto:${site.email}`}>{site.email}</a>.</p><p className="form-status" role="status" aria-live="polite">{message&&<>{sent&&<Check size={14}/>}<span>{message}</span></>}</p></form>;
}
