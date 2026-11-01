import { ArrowUpRight, Code2, Workflow, PanelsTopLeft, CornerDownRight } from 'lucide-react';
import { Reveal, ContactForm } from '@/components/site-interactions';
import { SelectedWork } from '@/components/selected-work';
import { SiteFooter } from '@/components/site-footer';
import { HandsHero } from '@/components/hands-hero';
import type { Metadata } from 'next';
import { businessSchema } from '@/lib/site';

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default function Home() {
 return <>
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema()).replace(/</g, '\\u003c') }} />
  <a className="skip-link" href="#main">Skip to content</a>
  <main id="main">
   <HandsHero />

   <section className="work-section" id="work" aria-labelledby="work-title">
    <SelectedWork />
   </section>

   <section className="services-section section-shell" id="services" aria-labelledby="services-title"><Reveal><div className="section-heading"><div><p className="eyebrow section-index">02 / WHAT WE CAN BUILD</p><h2 id="services-title">Your problem.<br/><span className="muted-heading">Our starting point.</span></h2></div><p>A useful tool should fit your business.<br/>Let’s work out what yours needs.</p></div></Reveal>
    <div className="service-list">
     {[{id:'custom-software',n:'01',icon:Code2,title:'Software that fits.',text:'Custom web apps, customer portals and internal tools that make the day-to-day easier.',tags:'WEB APPS / PORTALS / WEBSITES'}, {id:'business-automation',n:'02',icon:Workflow,title:'Work that takes care of itself.',text:'Connect your tools, cut repeat admin and keep the next step moving.',tags:'AUTOMATION / FOLLOW-UPS / INTEGRATIONS'}, {id:'dashboards-reporting',n:'03',icon:PanelsTopLeft,title:'A clearer picture.',text:'Bring information together in useful dashboards. Add AI where it genuinely helps.',tags:'DASHBOARDS / REPORTING / PRACTICAL AI'}].map(({id,n,icon:Icon,title,text,tags})=><Reveal key={n}><article className="service-row" id={id}><span className="service-number mono">{n}</span><div className="service-icon"><Icon size={25} strokeWidth={1.4}/></div><div className="service-copy"><h3>{title}</h3><p>{text}</p><span className="mono service-tags">{tags}</span></div><ArrowUpRight className="service-arrow" size={28} strokeWidth={1.3}/></article></Reveal>)}
    </div>
   </section>

   <section className="process-section"><div className="section-shell"><div className="process-heading"><p className="eyebrow section-index">03 / HOW IT HAPPENS</p><h2>A clear process.<br/>A useful result.</h2></div><div className="process-grid">{[{n:'01',title:'Understand.',text:'We start with your business, the problem and what a useful result would look like.'},{n:'02',title:'Build.',text:'Agree a manageable scope. Build it in clear stages, with you involved along the way.'},{n:'03',title:'Improve.',text:'Put it to work, learn from real use and plan the improvements that matter.'}].map(p=><article key={p.n}><span className="mono">/{p.n}</span><h3>{p.title}</h3><p>{p.text}</p></article>)}</div></div></section>

   <section className="about-section section-shell" id="about"><div><p className="eyebrow section-index">04 / THE STUDIO</p><h2>Small studio.<br/>A personal approach.</h2></div><div className="about-copy"><p>paceIT is an independent software and automation business founded by Kean Maan in South Africa.</p><p>We work closely with businesses to turn everyday friction into useful tools. Starting with practical projects. Building towards software that can help more people.</p><span className="founder-line"><span className="founder-avatar">KM</span><span><strong>Kean Maan</strong><small>Founder · Software & automation</small></span><CornerDownRight size={24}/></span></div></section>

   <section className="contact-section" id="contact"><div className="section-shell contact-grid"><div><p className="eyebrow section-index">05 / YOUR NEXT MOVE</p><h2>What could<br/>work <span>better?</span></h2><p>A repetitive task. A messy process.<br/>An idea you’re ready to explore.<br/>That’s a good place to start.</p><ArrowUpRight size={62} strokeWidth={1} className="contact-arrow"/></div><ContactForm /></div></section>
  </main>
  <SiteFooter />
 </>;
}
