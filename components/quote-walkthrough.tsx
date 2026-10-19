'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,Bell,Check,CheckCircle2,FileText,MousePointer2,Pause,Play,RotateCcw} from 'lucide-react';
import {Spotlight} from '@/components/ui/spotlight';

const duration=15000;
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
 const generating=t>=2500&&t<5000;
 const created=t>=5000;
 const editing=t>=8500&&t<11500;
 const approved=t>=11500;
 const reminder=t>=13500;
 const click=t>=1750&&t<2250||t>=7500&&t<8000||t>=10500&&t<11000;
 const cursor=t<1000?{left:'43%',top:'79%'}:t<6000?{left:'82%',top:'24%'}:t<9500?{left:'85%',top:'55%'}:t<12500?{left:'66%',top:'73%'}:{left:'79%',top:'82%'};
 const chapter=t<5000?'Generate a quote.':t<8500?'Everything in one place.':t<11500?'Update it in a click.':'A clear next step.';
 function replay(){setManual(true);setVisible(true);setTime(0);setPaused(false);setRun(n=>n+1);}
 return <div ref={root} className="film-card" data-paused={!playing}>
  {!reduced&&<Spotlight size={520} className="film-spotlight"/>}
  <div className="film-top"><span className="mono"><i className="signal-dot"/>FLOW PLUMBING / DEMO FILM</span><span className="film-sample">Fictional business · Sample data</span></div>
  <div className="film-stage" key={run}>
   <div className={'film-screen '+(generating||editing?'film-screen-focus':'')}>
    <div className="film-browser"><span><i/><i/><i/></span><span>flow / quotes</span><span>paceIT demo ↗</span></div>
    <div className="film-workspace">
     <aside className="film-sidebar"><strong>flow<span>.</span></strong><small>PLUMBING</small><span className="film-nav-active"><FileText size={14}/>Quotes</span><span><Bell size={14}/>Follow-ups</span><small className="film-built">BUILT BY paceIT</small></aside>
     <div className="film-content"><div className="film-heading"><div><span className="mono">YOUR WORKSPACE</span><h4>Quotes, under control.</h4></div><span className={'film-mock-action '+(t>=1750&&t<2500?'film-hit':'')}><span>+</span> Generate quote</span></div>
      <div className="film-metrics"><div><span>Quotes sent</span><strong>{created?'08':'07'}</strong></div><div><span>Approved value</span><strong>R {approved?'24,850':'20,400'}</strong></div><div><span>Follow-ups</span><strong>{reminder?'03':'02'}</strong></div></div>
      <div className="film-table"><div className="film-table-head"><strong>Recent quotes</strong><span>THIS MONTH</span></div><div className="film-row film-labels"><span>CUSTOMER / JOB</span><span>AMOUNT</span><span>STATUS</span></div>
       {created&&<div className="film-row film-new"><span><strong>Alex Morgan</strong><small>Q-008 · Geyser installation</small></span><span>R 4,450</span><span className={approved?'film-status film-approved':'film-status'}>{approved?<><Check size={11}/> Approved</>:'Update quote ↗'}</span></div>}
       <div className="film-row"><span><strong>Jamie Taylor</strong><small>Q-007 · Kitchen repairs</small></span><span>R 2,850</span><span className="film-status">Sent</span></div><div className="film-row"><span><strong>Sam Jacobs</strong><small>Q-006 · Bathroom fittings</small></span><span>R 8,200</span><span className="film-status film-approved">Approved</span></div>
      </div>
     </div>
    </div>
    {(generating||editing)&&<div className="film-overlay"><div className="film-dialog"><span className="mono">{generating?'NEW QUOTE / Q-008':'UPDATE QUOTE / Q-008'}</span><h5>{generating?'A quote, ready to go.':'Good news. Approved.'}</h5><div className="film-dialog-line"><span>Alex Morgan</span><strong>R 4,450</strong></div><p>Geyser installation · Pretoria</p><div className="film-dialog-status">{generating?<><FileText size={18}/>Preparing quote…</>:<><CheckCircle2 size={18}/>Status: Approved</>}</div><span className="film-dialog-submit">{generating?'Generating your quote':'Save update'}<ArrowUpRight size={15}/></span></div></div>}
    {reminder&&<div className="film-reminder"><span><Bell size={18}/></span><div><strong>Next step, remembered.</strong><small>Arrange Alex’s installation.</small></div><Check size={16}/></div>}
    {!reduced&&time<duration&&<div aria-hidden="true" className={'film-cursor '+(click?'film-click':'')} style={cursor}><MousePointer2 fill="#0f0f11" stroke="white" size={27}/><span>paceIT</span></div>}
   </div>
  </div>
  <div className="film-caption"><div><span className="mono">{t<5000?'01 / CREATE':t<11500?'02 / UPDATE':'03 / MOVE FORWARD'}</span><h4>{chapter}</h4></div><div className="film-controls"><span className="mono">{String(Math.floor(t/1000)).padStart(2,'0')} / 15s</span>{!staticView&&time<duration&&<button className="film-control-label" aria-label={paused?'Resume animation':'Pause animation'} onClick={()=>setPaused(v=>!v)}>{paused?<Play size={16}/>:<Pause size={16}/>}<span>{paused?'Resume':'Pause'}</span></button>}<button className="film-control-label" aria-label={staticView?'Play animation':'Replay animation'} onClick={replay}>{staticView?<Play size={16}/>:<RotateCcw size={16}/>}<span>{staticView?'Play example':'Replay'}</span></button></div></div>
  <div className="film-progress" aria-hidden="true"><span style={{width:`${t/duration*100}%`}}/></div>
  <p className="film-note">{staticView?'Motion is off on your device. Play the example if you’d like to see the sequence.':'Animated product concept. No live data or messages.'}</p>
 </div>;
}
