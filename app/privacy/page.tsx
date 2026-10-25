import { LegalPage } from '@/components/legal-page';
import { business } from '@/lib/business';
import { pageMetadata, site } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Privacy Policy', path: '/privacy',
  description: 'How paceIT handles enquiries, personal information, retention and privacy requests. Contact Kean Maan at info@paceit.co.za.',
});

const email = <a href={`mailto:${site.email}`}>{site.email}</a>;

export default function Privacy() {
  return <LegalPage title="Privacy Policy" introduction={<p>This notice explains how paceIT handles personal information when you visit this website, send an enquiry or become a client.</p>} sections={[
    { id: 'responsible-party', title: 'Who is responsible', content: <>
      <p>paceIT is the trading name of {business.ownerName}, operating as a sole proprietor in South Africa.</p>
      <dl className="legal-details"><div><dt>Responsible party</dt><dd>{business.ownerName}, trading as paceIT</dd></div><div><dt>Information Officer</dt><dd>{business.ownerName}</dd></div><div><dt>Business location</dt><dd>{business.location}</dd></div><div><dt>Privacy contact</dt><dd>{email}</dd></div></dl>
      <p>Send privacy questions, access requests, corrections and deletion requests to this email address.</p>
    </> },
    { id: 'information-collected', title: 'Information we collect', content: <>
      <p>When you use the enquiry form, we receive your name, email address and the project information you provide. If you become a client, we may also process the contact, project, agreement and billing information needed to provide our services.</p>
      <p>Our hosting provider may process technical information, including your IP address, requested page and request time, to deliver and protect the website. The enquiry endpoint uses a temporary keyed hash of the requesting IP address for a ten-minute rate-limit window. It does not save enquiries in a website database or intentionally log their contents.</p>
      <p>Please share only information needed to explain your enquiry. Avoid including passwords, sensitive information or information about other people unless it is necessary and you are entitled to share it.</p>
    </> },
    { id: 'purposes', title: 'Why we use it', content: <>
      <p>We use enquiry information to respond, discuss a possible project and take steps you request before entering an agreement. Client information is used to deliver agreed work, administer the relationship and meet applicable accounting, tax and other legal obligations. Technical information helps us operate, secure and troubleshoot the website.</p>
      <p>We rely on an appropriate basis under applicable law, such as steps requested before a contract, performance of an agreement, legitimate interests in responding to enquiries and securing our services, or a legal obligation. If consent is required for a separate use, we will request it.</p>
      <p>The form asks you to confirm that you understand how your details will be used and want us to respond. This is limited to your enquiry; it is not permission for unrelated marketing. Sending an enquiry does not subscribe you to marketing. You can choose not to provide information, but we may be unable to respond or provide a service without the necessary details.</p>
    </> },
    { id: 'providers-and-transfers', title: 'Providers and international processing', content: <>
      <p>Vercel hosts this website. Brevo provides the SMTP service that sends enquiries to {email}. Our mailbox provider also processes messages received at that address. These providers process information needed to deliver their services. We do not sell your personal information.</p>
      <p>Information may be processed outside South Africa. Vercel uses global infrastructure, including data centres in the United States and Europe. Brevo and other providers may use their own infrastructure and sub-processors. The relevant processing locations depend on the services and account arrangements in use.</p>
      <p>Transfers outside South Africa are subject to applicable legal requirements, including the protections required by section 72 of POPIA. Contact us for information about the safeguards applicable to your personal information.</p>
      <p>You can read more in <a href="https://vercel.com/legal/privacy-policy">Vercel’s Privacy Policy</a> and <a href="https://www.brevo.com/legal/privacypolicy/">Brevo’s Privacy Policy</a>.</p>
    </> },
    { id: 'retention', title: 'How long we keep information', content: <>
      <ul><li><strong>Unsuccessful enquiries:</strong> kept for up to six months for possible follow-up, then deleted from our active records, unless a legal obligation or dispute requires us to retain them.</li><li><strong>Client records:</strong> relevant client, billing and agreement records are retained for five years, or longer where tax, accounting or other legal requirements, an audit or an unresolved dispute requires it. Where the law specifies the starting point for a retention period, that rule applies.</li></ul>
      <p>We limit retained information to what is needed for those purposes. Hosting logs, email-service records and backups may follow the providers’ own retention policies. If you request deletion, we will explain any provider or legal restrictions that affect the request.</p>
    </> },
    { id: 'security', title: 'Access and security', content: <>
      <p>Administrative access at paceIT is restricted to the business owner. Service providers process information as needed to deliver hosting, email and related services.</p>
      <p>We use TLS/SSL for website connections and encrypted SMTP delivery. The enquiry form checks input on the server and applies request limits and spam checks. SMTP credentials stay on the server and are not included in the website’s public code.</p>
    </> },
    { id: 'cookies', title: 'Cookies and browser storage', content: <>
      <p>This version of the website does not use analytics or advertising cookies, or persistent browser storage for visitor data. The interactive portfolio concepts use temporary page state and reset when the page is reloaded.</p>
      <p>Read our <a href="/cookies">Cookie Policy</a> for details about the current setup. If we introduce non-essential tracking or storage, we will update this notice and provide any consent controls required before enabling it.</p>
    </> },
    { id: 'your-rights', title: 'Access, correction and deletion', content: <>
      <p>Email {email} to ask about your personal information, request access or correction, object to processing, or request deletion, subject to applicable legal requirements and exceptions. We may need to verify your identity before disclosing or changing records.</p>
      <p>We aim to respond to and process eligible requests within 30 days. If a legal retention duty, identity verification or an applicable statutory procedure affects the request, we will explain the position and the next steps. We cannot delete records that we are legally required to keep.</p>
      <p>For information about access requests under POPIA or PAIA, including applicable request procedures and manual requirements, contact the Information Officer at the same address.</p>
    </> },
    { id: 'applicable-rights', title: 'Audience and complaints', content: <>
      <p>paceIT primarily serves South African businesses. We do not use this website for behavioural profiling or marketing specifically directed at people in the EEA or UK. This notice explains our practices for all visitors. If the GDPR, UK GDPR or another privacy law applies to your circumstances, its mandatory rights continue to apply.</p>
      <p>If you have a concern, please contact us first. You can also complain to South Africa’s <a href="https://inforegulator.org.za/">Information Regulator</a> or another competent supervisory authority where applicable.</p>
    </> },
    { id: 'updates', title: 'Updates to this notice', content: <>
      <p>We may update this notice when our services or processing practices change. The date at the top identifies the current version. For questions, contact {email}.</p>
    </> },
  ]}/>;
}
