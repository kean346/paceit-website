import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Navigation } from '@/components/site-interactions';
import { SiteFooter } from '@/components/site-footer';
import { business } from '@/lib/business';

type LegalSection = { id: string; title: string; content: ReactNode };

export function LegalPage({ title, introduction, summary, sections }: { title: string; introduction: ReactNode; summary?: string[]; sections: LegalSection[] }) {
  return <div id="top">
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation homePage={false}/>
    <main id="main" className="section-shell legal-page" aria-labelledby="legal-title">
      <header className="legal-heading">
        <a className="legal-back" href="/"><ArrowLeft size={16} aria-hidden="true"/>Back to paceIT</a>
        <p className="eyebrow section-index">LEGAL INFORMATION</p>
        <h1 id="legal-title">{title}</h1>
        <p className="legal-updated">Last updated <time dateTime={business.policyUpdated}>{business.policyUpdatedLabel}</time></p>
        <div className="legal-intro">{introduction}</div>
        {summary && <aside className="legal-summary" aria-labelledby="legal-summary-title">
          <h2 id="legal-summary-title">In plain terms</h2>
          <ul>{summary.map(item => <li key={item}>{item}</li>)}</ul>
          <p>This overview helps you find your way. Read the full document below for the details.</p>
        </aside>}
      </header>
      <div className="legal-layout">
        <nav className="legal-contents" aria-label="On this page"><p className="mono">ON THIS PAGE</p><ol>{sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav>
        <article className="legal-copy" aria-label={title}>{sections.map((section, index) => <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
          <h2 id={`${section.id}-title`}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{section.title}</h2>
          {section.content}
        </section>)}</article>
      </div>
      <div className="legal-end"><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Website Use</a><a href="/cookies">Cookie Policy</a><a href="/#contact">Contact paceIT</a></div>
    </main>
    <SiteFooter homePage={false}/>
  </div>;
}
