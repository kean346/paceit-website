'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowDownRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import { TiltedGridHero } from '@/components/ui/tilted-grid-hero';
import { QuoteWalkthrough } from '@/components/quote-walkthrough';
import { DaylightDemo, RelayDemo } from '@/components/work-demos';

// These three demos are independent from the decorative carousel above.
const projects = [
  {
    id: 'flow', name: 'Flow Plumbing', type: 'Product demo', category: 'Quotes & follow-ups',
    image: '/work/flow-plumbing-preview.webp', alt: 'Flow Plumbing quote dashboard with an approved quote and scheduled reminder',
    title: <>Flow Plumbing.<br /><span className="muted-heading">A clearer quote workflow.</span></>,
    description: 'From a customer message to an approved quote and a scheduled follow-up. See the whole journey in 20 seconds.',
    problem: 'Quotes scattered across messages. Approvals to check. Customers to follow up with.',
    idea: 'One place to see what’s out, what’s approved and what needs your attention next.',
    tags: ['Web application', 'Workflow design', 'Product demo'],
  },
  {
    id: 'daylight', name: 'Daylight', type: 'Interactive concept', category: 'Bookings & scheduling',
    image: '/work/daylight-preview.webp', alt: 'Daylight booking workspace concept with a weekly calendar, appointments and a next appointment panel',
    title: <>Daylight.<br /><span className="muted-heading">A more organised day.</span></>,
    description: 'A booking workspace for a small service business. Select an appointment or add one of your own to see how the calendar works.',
    problem: 'Bookings spread across messages and calendars make it harder to see where the day has gone.',
    idea: 'Bring appointments, customers and availability into one calm, readable workspace.',
    tags: ['Product concept', 'Booking workflow', 'Sample data'],
  },
  {
    id: 'relay', name: 'Relay', type: 'Interactive concept', category: 'Operations & handovers',
    image: '/work/relay-preview.webp', alt: 'Relay operations workspace concept showing tasks moving from to do to in progress and ready to review',
    title: <>Relay.<br /><span className="muted-heading">A shared view of the work.</span></>,
    description: 'A project board for a small team. Open a task, change its owner or status, and see the board update. All data is fictional.',
    problem: 'When progress lives in different conversations, even a small handover can take more chasing than it should.',
    idea: 'Give every piece of work a clear place, a visible status and an obvious next step.',
    tags: ['Product concept', 'Team workflows', 'Sample data'],
  },
];
// High-resolution local previews; repeat in order without adding lower demo tabs.
const galleryImages = [
  { src: '/work/flow-plumbing-preview.webp', alt: 'Flow Plumbing quote and follow-up dashboard' },
  { src: '/work/sa-family-travel-preview.webp', alt: 'Illustrative SA Family Travel luxury safari website preview' },
  { src: '/work/analytics-preview.webp', alt: 'Northstar dark analytics dashboard concept with revenue and acquisition charts' },
  { src: '/work/daylight-preview.webp', alt: 'Daylight minimal booking application with a weekly calendar' },
  { src: '/work/relay-preview.webp', alt: 'Relay team workspace with a clear project board' },
];

export function SelectedWork() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const reel = useRef<HTMLDivElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const project = projects[active];
  const playing = visible && tabVisible && !paused && !reduced;

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update(); preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const element = reel.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const update = () => setTabVisible(!document.hidden);
    update(); document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % projects.length;
    else if (event.key === 'ArrowLeft') next = (index + projects.length - 1) % projects.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = projects.length - 1;
    else return;
    event.preventDefault(); setActive(next); tabs.current[next]?.focus();
  }

  return <div className="work-collection">
    <div className="work-reel-wrap" ref={reel}>
      <TiltedGridHero images={galleryImages} speed={10} gap={10}
        tileClassName="border border-white/20 shadow-2xl rounded-2xl bg-neutral-900 p-1 work-screen-surface" className={`work-reel ${playing ? 'gallery-playing' : 'gallery-paused'}`}>
        <div className="work-reel-content">
          <div className="work-intro">
            <p className="eyebrow work-eyebrow">01 / Selected work</p>
            <h2 id="work-title">Good Ideas<br /><span className="muted-heading">Made Useful</span></h2>
          </div>
          <p className="work-reel-copy">Thoughtful websites. Clearer ways to work.<br />A few possibilities, brought to life.</p>
        </div>
      </TiltedGridHero>
      <div className="section-shell work-reel-toolbar">
        {reduced ? <span className="work-motion-note">A still view, at your pace.</span> :
          <button type="button" className="work-motion-toggle" aria-label={paused ? 'Resume project gallery' : 'Pause project gallery'} aria-pressed={paused} onClick={() => setPaused(value => !value)}>
            {paused ? <Play size={13} /> : <Pause size={13} />}<span>{paused ? 'Resume' : 'Pause'} gallery</span>
          </button>}
      </div>
    </div>

    <div className="section-shell work-feature" id="dashboard-example">
      <div className="work-feature-head">
        <div><p className="eyebrow work-feature-kicker">{project.type} / {project.category}</p><h3>{project.title}</h3></div>
        <p className="work-feature-description">{project.description}</p>
      </div>
      <div className="work-demo-navigation">
        <a className="work-demo-watch" href="#work-project-panel" onClick={() => setActive(0)}>Watch the Flow Plumbing demo <ArrowDownRight size={16} /></a>
        <div className="work-projects" role="tablist" aria-label="Explore projects and design concepts">
          {projects.map((item, index) => <button key={item.id} type="button" role="tab" id={`work-tab-${item.id}`}
            ref={element => { tabs.current[index] = element; }} aria-selected={active === index} aria-controls="work-project-panel"
            tabIndex={active === index ? 0 : -1} className="work-project-tab" onClick={() => setActive(index)} onKeyDown={event => moveTab(event, index)}>
            <span className="work-project-meta"><span className="mono">0{index + 1}</span><span>{item.type}</span></span>
            <span className="work-project-name"><strong>{item.name}</strong><ArrowUpRight size={18} /></span>
            <span className="work-project-category">{item.category}</span>
          </button>)}
        </div>
      </div>
      <div id="work-project-panel" role="tabpanel" aria-labelledby={`work-tab-${project.id}`} tabIndex={0}>
        {project.id === 'flow' ? <QuoteWalkthrough /> : project.id === 'daylight' ? <DaylightDemo /> : project.id === 'relay' ? <RelayDemo /> : <figure className={`work-concept-preview work-concept-${project.id}`}>
          <img src={project.image} alt={project.alt} width={1600} height={1000} />
          <figcaption><span>{project.name} <i /> Design concept</span><span>Fictional business · Illustrative preview</span></figcaption>
        </figure>}
        <div className="work-project-notes">
          <div><span className="mono">THE EVERYDAY PROBLEM</span><p>{project.problem}</p></div>
          <div><span className="mono">THE IDEA</span><p>{project.idea}</p></div>
          <div className="work-project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        </div>
      </div>
    </div>
  </div>;
}
