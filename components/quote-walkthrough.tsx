'use client';
import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {ArrowUpRight,Bell,Check,CheckCircle2,FileText,MousePointer2,Pause,Play,RotateCcw} from 'lucide-react';
import {AnimatePresence,motion} from 'motion/react';
import {Spotlight} from '@/components/ui/spotlight';

const duration=20000;
export function QuoteWalkthrough(){
 const root=useRef<HTMLDivElement>(null);
 const [time,setTime]=useState(0);
 const [paused,setPaused]=useState(false);
 const [visible,setVisible]=useState(false);
 const [reduced,setReduced]=useState(true);
 const [run,setRun]=useState(0);
 const [manual,setManual]=useState(false);
 const [tabVisible,setTabVisible]=useState(true);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 useEffect(()=>{if(!('IntersectionObserver' in window)){setVisible(true);return;}const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:0.05});if(root.current)observer.observe(root.current);return()=>observer.disconnect();},[]);
 useEffect(()=>{const update=()=>setTabVisible(!document.hidden);update();document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update);},[]);
 const staticView=reduced&&!manual;
 const playing=visible&&tabVisible&&!paused&&!staticView&&time<duration;
 useEffect(()=>{if(!playing)return;const timer=setInterval(()=>setTime(t=>Math.min(duration,t+250)),250);return()=>clearInterval(timer);},[playing]);
 const t=staticView?duration:time;
 const scene=t<3250?'request':t<8250?'form':t<12250?'document':t<15750?'dashboard':t<18250?'approval':'complete';
 const screen=useRef<HTMLDivElement>(null);
 const [cursor,setCursor]=useState({left:'50%',top:'85%'});
 const target=scene==='request'?'create':scene==='form'?(t<6000?'customer':'generate'):scene==='document'?'send':scene==='dashboard'?'update':scene==='approval'?'save':'done';
 useLayoutEffect(()=>{const position=()=>{const el=screen.current;const button=el?.querySelector<HTMLElement>('[data-target="'+target+'"]');if(!el||!button)return;const a=el.getBoundingClientRect(),b=button.getBoundingClientRect();if(!a.width||!a.height)return;setCursor({left:((b.left+b.width*.65-a.left)/a.width*100)+'%',top:((b.top+b.height*.6-a.top)/a.height*100)+'%'});};position();const timer=setTimeout(position,450);window.addEventListener('resize',position);return()=>{clearTimeout(timer);window.removeEventListener('resize',position);};},[target,run]);
 const click=[2750,7750,11750,15250,17750].some(at=>t>=at&&t<at+500);
 const chapter=scene==='request'?'It starts with a customer.':scene==='form'?'The details become a quote.':scene==='document'?'Ready to send.':scene==='dashboard'?'Every quote, in view.':scene==='approval'?'An approval. A clear next step.':'Less chasing. More getting it done.';
 function replay(){setManual(true);setVisible(true);setTime(0);setPaused(false);setRun(n=>n+1);}
 const transition={duration:reduced?0:.55,ease:[.22,1,.36,1] as [number,number,number,number]};
 return <div ref={root} className="film-card studio-film" data-paused={!playing}>
 {!reduced&&<Spotlight size={520} className="film-spotlight"/>}
 <div className="film-top"><span>Flow Plumbing</span><span className="film-sample">Demo · Fictional business</span></div>
 <div className="film-stage" key={run}><div ref={screen} className={'film-screen scene-'+scene}>
 <div className="film-browser"><span><i/><i/><i/></span><span>Flow Plumbing / Workspace</span><span>paceIT</span></div>
 <div className="studio-scene-stage">
 <AnimatePresence initial={false} mode="sync">
 <motion.div key={scene} className="studio-scene" initial={{opacity:0,y:reduced?0:18,scale:reduced?1:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:reduced?0:-12,scale:reduced?1:1.015}} transition={transition}>
 {scene==='request'&&<div className="request-scene"><div className="request-icon"><Bell size={25}/></div><span className="scene-kicker">A NEW CUSTOMER REQUEST</span><h3>“Could you quote me<br/>for a geyser installation?”</h3><div className="request-person"><span>AM</span><div><strong>Alex Morgan</strong><small>Pretoria · Just received</small></div></div><span className="scene-action" data-target="create">Create quote <ArrowUpRight size={17}/></span></div>}
 {scene==='form'&&<div className="quote-form-scene"><div className="scene-heading"><div><span className="scene-kicker">QUOTE Q-008</span><h3>A few details. All together.</h3></div><span className="scene-badge">Draft</span></div><div className="scene-fields"><div data-target="customer"><label>Customer</label><strong>{t>=4000?'Alex Morgan':'Add customer…'}</strong></div><div><label>Location</label><strong>{t>=4500?'Pretoria':'Add location…'}</strong></div></div><div className="scene-line-head"><span>Description</span><span>Amount</span></div><div className="scene-line"><span>{t>=5000?'Geyser installation labour':'—'}</span><span>{t>=5000?'R 3,200':'—'}</span></div><div className="scene-line"><span>{t>=5500?'Fittings and materials':'—'}</span><span>{t>=5500?'R 1,250':'—'}</span></div><div className="scene-total"><span>Total</span><strong>{t>=5750?'R 4,450':'—'}</strong></div><span className="scene-action" data-target="generate">Generate quote <FileText size={17}/></span></div>}
 {scene==='document'&&<div className="document-scene"><div className="document-context"><span className="scene-kicker">READY FOR YOUR CUSTOMER</span><h3>From details<br/>to a proper quote.</h3><p>Clear scope.<br/>One total.<br/>Ready to send.</p><span className="scene-action" data-target="send">Send quote <ArrowUpRight size={17}/></span></div><div className="quote-paper"><div className="paper-brand">flow<span>.</span><small>PLUMBING</small></div><div className="paper-title"><h4>Quotation</h4><span>Q-008</span></div><p>Prepared for<strong>Alex Morgan</strong>Pretoria</p><div className="paper-row"><span>Installation labour</span><strong>R 3,200</strong></div><div className="paper-row"><span>Fittings & materials</span><strong>R 1,250</strong></div><div className="paper-total"><span>Total</span><strong>R 4,450</strong></div><small>Thank you for considering Flow Plumbing.</small></div></div>}
 {(scene==='dashboard'||scene==='complete')&&<div className="overview-scene"><div className="scene-heading"><div><span className="scene-kicker">YOUR WORKSPACE</span><h3>Know what happens next.</h3></div><span className="scene-badge">{scene==='complete'?'Up to date':'Quote sent'}</span></div><div className="overview-stats"><div><span>Quotes sent</span><strong>08</strong></div><div><span>Approved value</span><strong>R {scene==='complete'?'24,850':'20,400'}</strong></div><div><span>Follow-ups</span><strong>{scene==='complete'?'03':'02'}</strong></div></div><div className="scene-line-head"><span>Recent quotes</span><span>Status</span></div><div className="overview-quote"><div><strong>Alex Morgan</strong><small>Q-008 · Geyser installation</small></div><strong>R 4,450</strong><span className="scene-action" data-target="update">{scene==='complete'?<><Check size={15}/>Approved</>:<>Update quote <ArrowUpRight size={15}/></>}</span></div><div className="overview-quote secondary"><div><strong>Jamie Taylor</strong><small>Q-007 · Kitchen repairs</small></div><strong>R 2,850</strong><span>Sent</span></div>{scene==='complete'&&<div className="completion-note" data-target="done"><Bell size={23}/><div><strong>Next step: arrange the installation.</strong><p>Follow up with Alex Morgan tomorrow.</p></div><CheckCircle2 size={22}/></div>}</div>}
 {scene==='approval'&&<div className="approval-scene"><div className="approval-mark"><Check size={32}/></div><span className="scene-kicker">UPDATE QUOTE Q-008</span><h3>The customer said yes.</h3><p>Alex Morgan · R 4,450</p><div className="approval-field"><span>Quote status</span><strong>Approved <Check size={17}/></strong></div><div className="approval-field"><span>Next step</span><strong>Arrange installation</strong></div><span className="scene-action" data-target="save">Save & set reminder <Bell size={17}/></span></div>}
 </motion.div>
 </AnimatePresence>
 </div>
 {!reduced&&time<duration&&<div aria-hidden="true" className={'film-cursor '+(click?'film-click':'')} style={cursor}><MousePointer2 fill="#0f0f11" stroke="white" size={27}/><span>paceIT</span></div>}
 </div></div>
 <div className="film-caption"><h4>{chapter}</h4><div className="film-controls"><span className="mono">{String(Math.floor(t/1000)).padStart(2,'0')} / 20s</span>{!staticView&&time<duration&&<button className="film-control-label" aria-label={paused?'Resume animation':'Pause animation'} onClick={()=>setPaused(v=>!v)}>{paused?<Play size={16}/>:<Pause size={16}/>}<span>{paused?'Resume':'Pause'}</span></button>}<button className="film-control-label" aria-label={staticView?'Play animation':'Replay animation'} onClick={replay}>{staticView?<Play size={16}/>:<RotateCcw size={16}/>}<span>{staticView?'Play example':'Replay'}</span></button></div></div>
 <div className="film-progress" aria-hidden="true"><span style={{width:`${t/duration*100}%`}}/></div><p className="film-note">{staticView?'Motion is off on your device. You can choose to play the example.':'Sample data. No live messages are sent.'}</p>
 </div>;
}
