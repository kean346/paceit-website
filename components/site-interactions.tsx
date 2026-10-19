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
const projects=[
 {title:'Flow Plumbing',type:'Dashboard demo',src:'/work/overview.svg',text:'Quotes, approvals and the next customer follow-up.',status:'Demo project',ready:true},
 {title:'Business website',type:'Website slot',src:'/work/website-placeholder.svg',text:'A place for the next website project. Details coming soon.',status:'Coming soon',ready:false},
 {title:'Booking workspace',type:'App concept',src:'/work/bookings-concept.svg',text:'A calmer view of appointments and the day ahead.',status:'Concept only',ready:false},
 {title:'Operations workspace',type:'Dashboard concept',src:'/work/operations-concept.svg',text:'An overview of requests, active work and what’s ready.',status:'Concept only',ready:false},
];
const galleryImages=projects.map(p=>({src:p.src,alt:p.title+' — '+p.status}));
export function PortfolioGallery(){
 const [playing,setPlaying]=useState(false);const [selected,setSelected]=useState(0);const ref=useRef<HTMLDivElement>(null);
 const project=projects[selected];
 useEffect(()=>{if(!playing)return;const timer=setTimeout(()=>setPlaying(false),18000);return()=>clearTimeout(timer);},[playing]);
 useEffect(()=>{const el=ref.current;if(!el)return;const ob=new IntersectionObserver(([e])=>{if(!e.isIntersecting)setPlaying(false);});ob.observe(el);return()=>ob.disconnect();},[]);
 return <div ref={ref} className={'portfolio-gallery '+(playing?'gallery-playing':'gallery-paused')}><TiltedGridHero images={galleryImages} tileHeight={75} axis={50} curve={28} speed={6} gap={10} fade={12} className="gallery-band"/><div className="gallery-caption section-shell"><span className="mono">FOUR SPACES. ROOM TO GROW.</span><button className="gallery-toggle" onClick={()=>setPlaying(!playing)} aria-pressed={playing}>{playing?<Pause size={14}/>:<Play size={14}/>} {playing?'Pause carousel':'Move carousel'}</button></div><div className="portfolio-picker section-shell"><div className="portfolio-tabs" role="tablist" aria-label="Selected work">{projects.map((p,i)=><button key={p.title} id={'project-tab-'+i} role="tab" aria-selected={selected===i} aria-controls="project-summary" tabIndex={selected===i?0:-1} onKeyDown={e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%projects.length;else if(e.key==='ArrowLeft')next=(i+projects.length-1)%projects.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=projects.length-1;else return;e.preventDefault();setSelected(next);document.getElementById('project-tab-'+next)?.focus();}} onClick={()=>setSelected(i)}><span className="mono">0{i+1} / {p.type}</span><strong>{p.title}</strong><small>{p.status}</small></button>)}</div><div className="portfolio-summary" id="project-summary" role="tabpanel" aria-labelledby={'project-tab-'+selected} tabIndex={0}><div><h3>{project.title}</h3><p>{project.text}</p></div>{project.ready?<a className="text-link" href="#dashboard-example">View project <ArrowUpRight size={17}/></a>:<span className="portfolio-status">{project.status==='Coming soon'?'Project to be added':'Illustrative preview · Not a finished product'}</span>}</div></div></div>;
}
export function ContactForm(){
 const [message,setMessage]=useState('');const [brief,setBrief]=useState('');
 const contact=process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const data=new FormData(e.currentTarget);const text=`Project enquiry for paceIT\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('idea')}`;setBrief(text);
 if(contact){window.location.href=`mailto:${contact}?subject=${encodeURIComponent('Let’s discuss a project')}&body=${encodeURIComponent(text)}`;setMessage('Your email app will open with the brief. Send it there to get in touch.');return;}
 try{await navigator.clipboard.writeText(text);setMessage('Brief copied. Nothing has been sent.');}catch{setMessage('Your brief is ready below. Select and copy it.');}}
 return <form className="contact-form" onSubmit={submit}><div className="form-heading"><span className="mono">START WITH A FEW WORDS</span><span className="small-arrow">↗</span></div><label htmlFor="name">Your name<input name="name" id="name" autoComplete="name" placeholder="Kean, for example" required maxLength={100}/></label><label htmlFor="email">Email address<input name="email" id="email" type="email" autoComplete="email" placeholder="you@yourbusiness.co.za" required maxLength={254}/></label><label htmlFor="idea">What would you like to make easier?<textarea name="idea" id="idea" placeholder="Tell us a little about the problem or idea…" required minLength={10} maxLength={4000} rows={3}/></label><button className="button primary" type="submit">{contact?'Draft an enquiry':'Copy project brief'} {contact?<ArrowUpRight size={18}/>:<Copy size={17}/>}</button><p className="form-note">{contact?'Opens your email app. No information is stored on this website.':'Direct contact details are coming soon. Prepare and copy your brief here; nothing is sent or stored.'}</p><p className="form-status" role="status">{message&&<><Check size={14}/>{message}</>}</p>{brief&&<details className="brief-details"><summary>View your brief</summary><pre>{brief}</pre></details>}</form>;
}
