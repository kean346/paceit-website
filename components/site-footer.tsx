import { ArrowUpRight } from 'lucide-react';

export function SiteFooter({ homePage = true }: { homePage?: boolean }) {
  return <footer className="section-shell footer">
    <a className="wordmark" href={homePage ? '#home' : '/'} aria-label="paceIT home">pace<span>IT.</span></a>
    <p>Software for what’s next.</p>
    <div>
      <nav className="footer-legal" aria-label="Legal information"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav>
      <span>© {new Date().getFullYear()} paceIT</span>
      <a href={homePage ? '#home' : '#top'}>Back to top <ArrowUpRight size={14}/></a>
    </div>
  </footer>;
}
