import { LegalPage } from '@/components/legal-page';
import { pageMetadata, site } from '@/lib/site';

export const metadata = pageMetadata({ title: 'Cookie Policy', path: '/cookies', description: 'How paceIT uses cookies, browser storage and locally hosted demos. No optional analytics or advertising trackers are enabled in this website.' });

export default function Cookies() {
  return <LegalPage title="Cookie Policy" introduction={<p>This policy explains cookies, browser storage and third-party content on the paceIT website. Read it alongside our <a href="/privacy">Privacy Policy</a>.</p>} sections={[
    { id: 'current-setup', title: 'Our current setup', content: <>
      <p>The website application does not set cookies or save visitor information in localStorage or sessionStorage. It does not load analytics, advertising pixels, cross-site tracking scripts or third-party video, map or social media embeds.</p>
      <p>Fonts, portfolio images and the Flow Plumbing film are served from this website. The interactive concepts keep temporary state in the current page; changes disappear when you reload it. They do not create real bookings or transactions.</p>
    </> },
    { id: 'infrastructure', title: 'Hosting and enquiry processing', content: <>
      <p>Vercel delivers and protects this website. Hosting security features may process technical request information. This is separate from optional analytics and advertising tracking. The enquiry service uses a temporary server-side keyed hash for rate limiting, rather than a tracking cookie.</p>
      <p>Submitting an enquiry sends your details to paceIT through Brevo SMTP. Our <a href="/privacy">Privacy Policy</a> explains providers, international processing, retention and your rights. The enquiry acknowledgement does not authorise tracking or marketing.</p>
    </> },
    { id: 'consent', title: 'Cookie consent', content: <>
      <p>No optional tracking or storage is enabled by this application, so it does not display an accept-all cookie banner. If we introduce optional cookies, analytics or embedded content that requires consent, we will update these policies and provide a choice before activating it.</p>
      <p>Where consent is needed, rejecting optional tracking must be possible, and withdrawing consent must be as easy as giving it. Access to the enquiry form will not depend on accepting optional tracking.</p>
    </> },
    { id: 'browser-controls', title: 'Your browser controls', content: <>
      <p>Your browser settings let you review, block or delete cookies and site storage. Browser extensions and sites you visit through external links have their own practices. External provider policy links on our website do not load those providers’ content until you follow the link.</p>
      <p>For questions about this policy, email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
    </> },
  ]}/>;
}
