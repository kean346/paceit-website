import { ArrowUpRight, CornerDownRight } from 'lucide-react';
import { ContactForm } from '@/components/site-interactions';
import { SelectedWork } from '@/components/selected-work';
import { SiteFooter } from '@/components/site-footer';
import { HandsHero } from '@/components/hands-hero';
import { ServicesCombined } from '@/components/services-combined';
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

   <ServicesCombined />

   <section className="about-section section-shell" id="about"><div><p className="eyebrow section-index">04 / THE STUDIO</p><h2>Small studio.<br/>A personal approach.</h2></div><div className="about-copy"><p>paceIT is an independent software and automation business founded by Kean Maan in South Africa.</p><p>We work closely with businesses to turn everyday friction into useful tools. Starting with practical projects. Building towards software that can help more people.</p><span className="founder-line"><span className="founder-avatar">KM</span><span><strong>Kean Maan</strong><small>Founder · Software & automation</small></span><CornerDownRight size={24}/></span></div></section>

   <section className="contact-section" id="contact"><div className="section-shell contact-grid"><div><p className="eyebrow section-index">05 / YOUR NEXT MOVE</p><h2>What could<br/>work <span>better?</span></h2><p>A repetitive task. A messy process.<br/>An idea you’re ready to explore.<br/>That’s a good place to start.</p><ArrowUpRight size={62} strokeWidth={1} className="contact-arrow"/></div><ContactForm /></div></section>
  </main>
  <SiteFooter />
 </>;
}
