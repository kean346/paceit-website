import { ArrowUpRight, ArrowDown, ArrowRight, Code2, Workflow, PanelsTopLeft, Check, CornerDownRight } from 'lucide-react';
import { Navigation, Reveal, PortfolioGallery, ContactForm } from '@/components/site-interactions';
import { QuoteWalkthrough } from '@/components/quote-walkthrough';

export default function Home() {
 return <>
  <a className="skip-link" href="#main">Skip to content</a>
  <Navigation />
  <main id="main">
   <section className="hero section-shell" id="home" aria-labelledby="hero-title">
    <div className="hero-topline mono"><span><i className="signal-dot" /> INDEPENDENT TECHNOLOGY STUDIO</span><span>PRETORIA, SOUTH AFRICA ↗</span></div>
    <div className="hero-grid">
     <div className="hero-copy"><p className="eyebrow">A little less friction. A lot more forward.</p><h1 id="hero-title">Good business.<br/>Better <span className="accent-word">systems<svg viewBox="0 0 500 20" aria-hidden="true"><path d="M3 13 Q240 -2 497 9" /></svg></span>.</h1><p className="hero-description">Custom software and automation that give you back time, clarity and room to grow.</p><div className="hero-actions"><a className="button primary" href="#contact">Discuss a project <ArrowUpRight size={18}/></a><a className="text-link" href="#work">See selected work <ArrowDown size={16}/></a></div></div>
     <div className="system-art" aria-label="An illustration of a quote moving from a request to an organised workflow">
      <div className="art-grid"/><div className="orbit orbit-one"/><div className="orbit orbit-two"/>
      <div className="art-caption mono">SMALL CONNECTIONS.<br/>A BIG DIFFERENCE.</div>
      <div className="flow-note note-one"><span className="note-symbol"><PanelsTopLeft size={17}/></span><div><small>IT STARTS WITH A REQUEST</small><strong>“Can you send me a quote?”</strong></div><span className="note-dot"/></div>
      <div className="flow-connector"><span/><ArrowDown size={19}/></div>
      <div className="flow-note note-two"><div className="note-header"><span className="mono">ONE CLEAR WORKFLOW</span><span className="mini-brand">pace<span>IT.</span></span></div><div className="progress-line"><span className="progress-node"><Check size={13}/></span><i/><span className="progress-node"><Check size={13}/></span><i/><span className="progress-node final-node"><ArrowUpRight size={15}/></span></div><div className="progress-labels"><span>Capture</span><span>Organise</span><span>Move forward</span></div></div>
      <div className="flow-note note-three"><span className="success-icon"><Check size={18}/></span><div><strong>One less thing to chase.</strong><small>MORE TIME FOR THE WORK THAT MATTERS.</small></div></div>
      <div className="art-foot mono"><span>DESIGNED AROUND YOUR BUSINESS</span><span>01 — 03</span></div>
     </div>
    </div>
    <div className="hero-footer"><span>Built for the way you work.</span><div><span>Software</span><i/><span>Automation</span><i/><span>Web</span></div><a href="#work" aria-label="Scroll to selected work"><ArrowDown size={19}/></a></div>
   </section>

   <section className="work-section" id="work" aria-labelledby="work-title">
    <div className="section-shell"><Reveal><div className="section-heading"><div><p className="eyebrow section-index">01 / THE DEMO ROOM</p><h2 id="work-title">Small ideas.<br/><span className="muted-heading">In working order.</span></h2></div><p>A few ways better systems could look.<br/>Concepts today. Room for what comes next.</p></div></Reveal></div>
    <PortfolioGallery />
    <div className="section-shell"><div className="project-heading"><div><p className="eyebrow">DEMO FILM / 001</p><h3>From quote to next step.</h3><p>Flow Plumbing · A quotes workspace for a fictional Pretoria business.</p></div><span className="outline-pill">Demo project <span>·</span> Fictional business</span></div>
    <QuoteWalkthrough />
    <div className="project-details"><div><span className="mono">THE EVERYDAY PROBLEM</span><p>Quotes scattered across messages. Approvals to check. Customers to follow up with.</p></div><div><span className="mono">THE IDEA</span><p>One place to see what’s out, what’s approved and what needs your attention next.</p></div><div className="project-tags"><span>Web application</span><span>Workflow design</span><span>Animated demo</span></div></div></div>
   </section>

   <section className="services-section section-shell" id="services" aria-labelledby="services-title"><Reveal><div className="section-heading"><div><p className="eyebrow section-index">02 / WHAT WE CAN BUILD</p><h2 id="services-title">Your problem.<br/><span className="muted-heading">Our starting point.</span></h2></div><p>A useful tool should fit your business.<br/>Let’s work out what yours needs.</p></div></Reveal>
    <div className="service-list">
     {[{n:'01',icon:Code2,title:'Software that fits.',text:'Custom web apps, customer portals and internal tools that make the day-to-day easier.',tags:'WEB APPS / PORTALS / WEBSITES'}, {n:'02',icon:Workflow,title:'Work that takes care of itself.',text:'Connect your tools, cut repeat admin and keep the next step moving.',tags:'AUTOMATION / FOLLOW-UPS / INTEGRATIONS'}, {n:'03',icon:PanelsTopLeft,title:'A clearer picture.',text:'Bring information together in useful dashboards. Add AI where it genuinely helps.',tags:'DASHBOARDS / REPORTING / PRACTICAL AI'}].map(({n,icon:Icon,title,text,tags})=><Reveal key={n}><article className="service-row"><span className="service-number mono">{n}</span><div className="service-icon"><Icon size={25} strokeWidth={1.4}/></div><div className="service-copy"><h3>{title}</h3><p>{text}</p><span className="mono service-tags">{tags}</span></div><ArrowUpRight className="service-arrow" size={28} strokeWidth={1.3}/></article></Reveal>)}
    </div>
   </section>

   <section className="process-section"><div className="section-shell"><div className="process-heading"><p className="eyebrow section-index">03 / HOW IT HAPPENS</p><h2>A clear process.<br/>A useful result.</h2></div><div className="process-grid">{[{n:'01',title:'Understand.',text:'We start with your business, the problem and what a useful result would look like.'},{n:'02',title:'Build.',text:'Agree a manageable scope. Build it in clear stages, with you involved along the way.'},{n:'03',title:'Improve.',text:'Put it to work, learn from real use and plan the improvements that matter.'}].map(p=><article key={p.n}><span className="mono">/{p.n}</span><h3>{p.title}</h3><p>{p.text}</p></article>)}</div></div></section>

   <section className="about-section section-shell" id="about"><div><p className="eyebrow section-index">04 / THE STUDIO</p><h2>Small studio.<br/>A personal approach.</h2></div><div className="about-copy"><p>paceIT is an independent software and automation business founded by Kean Maan in South Africa.</p><p>We work closely with businesses to turn everyday friction into useful tools. Starting with practical projects. Building towards software that can help more people.</p><span className="founder-line"><span className="founder-avatar">KM</span><span><strong>Kean Maan</strong><small>Founder · Software & automation</small></span><CornerDownRight size={24}/></span></div></section>

   <section className="contact-section" id="contact"><div className="section-shell contact-grid"><div><p className="eyebrow section-index">05 / YOUR NEXT MOVE</p><h2>What could<br/>work <span>better?</span></h2><p>A repetitive task. A messy process.<br/>An idea you’re ready to explore.<br/>That’s a good place to start.</p><ArrowUpRight size={62} strokeWidth={1} className="contact-arrow"/></div><ContactForm /></div></section>
  </main>
  <footer className="section-shell footer"><a className="wordmark" href="#home" aria-label="paceIT home">pace<span>IT.</span></a><p>Software for what’s next.</p><div><span>© {new Date().getFullYear()} paceIT</span><a href="#home">Back to top <ArrowUpRight size={14}/></a></div></footer>
 </>;
}
