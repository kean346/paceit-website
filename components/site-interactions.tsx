'use client';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowUpRight, Check, Menu, X } from 'lucide-react';
import { isEmail } from '@/lib/enquiry-validation';
import { site } from '@/lib/site';

export function Navigation({homePage=true}:{homePage?:boolean}) {
 const [open,setOpen]=useState(false);
 const prefix=homePage?'':'/';
 return <header className="site-header section-shell"><a className="wordmark" href={homePage?'#home':'/'} aria-label="paceIT home">pace<span>IT.</span></a><nav aria-label="Main navigation" className={open?'nav open':'nav'} id="main-navigation" onKeyDown={event=>{if(event.key==='Escape'&&open){setOpen(false);document.querySelector<HTMLButtonElement>('.menu-button')?.focus();}}}>{['Home','Work','Services','About','Contact'].map(v=><a key={v} href={prefix+'#'+v.toLowerCase()} onClick={()=>setOpen(false)}>{v}</a>)}</nav><a href={prefix+'#contact'} className="nav-cta">Let’s talk <ArrowUpRight size={17}/></a><button className="menu-button" aria-controls="main-navigation" aria-expanded={open} aria-label={open?'Close navigation':'Open navigation'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></header>;
}
export function Reveal({children}:{children:ReactNode}) {
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{const el=ref.current;if(!el||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const ob=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('is-visible');ob.disconnect();}},{threshold:.08});el.classList.add('reveal-ready');ob.observe(el);return()=>ob.disconnect();},[]);
 return <div ref={ref}>{children}</div>;
}
export function ContactForm(){
 const [message,setMessage]=useState('');const [sending,setSending]=useState(false);const [sent,setSent]=useState(false);
 const inFlight=useRef(false);
 const [errors,setErrors]=useState<Record<string,string>>({});
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(inFlight.current)return;setSent(false);
  const form=e.currentTarget;const data=new FormData(form);
  const invalid:Record<string,string>={};
  if(!String(data.get('name')||'').trim())invalid.name='Enter your name.';
  if(!isEmail(String(data.get('email')||'').trim()))invalid.email='Enter a valid email address.';
  const idea=String(data.get('idea')||'').trim();
  if(idea.length<10||idea.length>4000)invalid.idea='Describe your enquiry in 10–4,000 characters.';
  if(data.get('privacyAcknowledged')!=='on')invalid.privacyAcknowledged='Please confirm that you want us to respond to your enquiry.';
  setErrors(invalid);
  if(Object.keys(invalid).length){setMessage('Please check the highlighted fields.');(form.elements.namedItem(Object.keys(invalid)[0]) as HTMLElement)?.focus();return;}

  inFlight.current=true;setSending(true);setSent(false);setMessage('');
  try {
   const response=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.get('name'),email:data.get('email'),idea:data.get('idea'),website:data.get('website'),privacyAcknowledged:data.get('privacyAcknowledged')==='on'}),signal:AbortSignal.timeout(25000)});
   const result=await response.json();
   if(!response.ok){setMessage(typeof result.message==='string'?result.message:`Your enquiry could not be sent. Please email ${site.email}.`);return;}
   setSent(true);setMessage('Thank you. Your enquiry has been sent. We’ll be in touch.');form.reset();
  } catch {setMessage(`Your enquiry could not be sent. Please try again or email ${site.email}.`);}
  finally{inFlight.current=false;setSending(false);}
 }
 return <form className="contact-form" noValidate onSubmit={submit} aria-busy={sending}><div className="form-heading"><span className="mono">START WITH A FEW WORDS</span><span className="small-arrow">↗</span></div><label htmlFor="name">Your name<input name="name" id="name" aria-invalid={!!errors.name} aria-describedby={errors.name?'name-error':undefined} autoComplete="name" placeholder="Kean, for example" required maxLength={100} disabled={sending}/>{errors.name&&<span className="form-field-error" id="name-error">{errors.name}</span>}</label><label htmlFor="email">Email address<input name="email" id="email" aria-invalid={!!errors.email} aria-describedby={errors.email?'email-error':undefined} type="email" autoComplete="email" placeholder="you@yourbusiness.co.za" required maxLength={254} disabled={sending}/>{errors.email&&<span className="form-field-error" id="email-error">{errors.email}</span>}</label><label htmlFor="idea">What would you like to make easier?<textarea name="idea" id="idea" aria-invalid={!!errors.idea} aria-describedby={errors.idea?'idea-error':undefined} placeholder="Tell us a little about the problem or idea…" required minLength={10} maxLength={4000} rows={3} disabled={sending}/>{errors.idea&&<span className="form-field-error" id="idea-error">{errors.idea}</span>}</label><div className="enquiry-trap" aria-hidden="true"><label htmlFor="website">Website<input name="website" id="website" type="text" tabIndex={-1} autoComplete="off"/></label></div><label className="form-consent" htmlFor="privacyAcknowledged"><input type="checkbox" id="privacyAcknowledged" name="privacyAcknowledged" required disabled={sending} aria-invalid={!!errors.privacyAcknowledged} aria-describedby="consent-help consent-error"/><span>I understand how my enquiry details will be used and ask paceIT to respond.</span></label><p className="form-consent-help" id="consent-help">See our <a href="/privacy">Privacy Policy</a>. This does not subscribe you to marketing. Please don’t include passwords or sensitive personal information.</p><p className="form-field-error" id="consent-error">{errors.privacyAcknowledged}</p><button className="button primary" type="submit" disabled={sending}>{sending?'Sending…':'Send enquiry'} <ArrowUpRight size={18}/></button><p className="form-note">Send your enquiry directly to <a href={`mailto:${site.email}`}>{site.email}</a>. </p><p className="form-status" role="status" aria-live="polite">{message&&<>{sent&&<Check size={14}/>}<span>{message}</span></>}</p></form>;
}
