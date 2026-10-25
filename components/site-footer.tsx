import { business } from '@/lib/business';
import { site } from '@/lib/site';
import { ArrowUpRight } from 'lucide-react';

export function SiteFooter({ homePage = true }: { homePage?: boolean }) {
  return <footer className="section-shell footer">
    <a className="wordmark" href={homePage ? '#home' : '/'} aria-label="paceIT home">pace<span>IT.</span></a>
    <div className="footer-business"><p>Software for what’s next.</p><small>{business.ownerName}, trading as paceIT · Sole proprietor<br/>{business.location}<br/><a href={`mailto:${site.email}`}>{site.email}</a></small></div>
    <div>
      <nav className="footer-legal" aria-label="Legal information"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/cookies">Cookies</a></nav>
      <span>© {new Date().getFullYear()} paceIT</span>
      <a href={homePage ? '#home' : '#top'}>Back to top <ArrowUpRight size={14}/></a>
    </div>
  </footer>;
}
