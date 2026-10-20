import { LegalPage } from '@/components/legal-page';
import { business } from '@/lib/business';
import { pageMetadata, site } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Terms of Website Use', path: '/terms',
  description: 'Terms for using paceIT’s website, sending enquiries and viewing its portfolio demonstrations. Operated by Kean Maan in Pretoria, South Africa.',
});

export default function Terms() {
  return <LegalPage title="Terms of Website Use" introduction={<p>These terms explain how you may use this website and its demonstrations. Paid projects are covered by a separate agreement.</p>} sections={[
    { id: 'operator', title: 'About this website', content: <>
      <p>This website is operated by {business.ownerName}, a sole proprietor trading as paceIT, based in {business.location}.</p>
      <p>For enquiries or questions about these terms, email <a href={`mailto:${site.email}`}>{site.email}</a>. Any paid project will have a separately agreed scope, fees and service terms.</p>
    </> },
    { id: 'demonstrations', title: 'Information and demonstrations', content: <>
      <p>This website describes our services and shows examples of software workflows. Flow Plumbing, Daylight and Relay are labelled demonstrations or concepts that use fictional sample data.</p>
      <p>Their displayed quotes, approvals, bookings, reminders and tasks are not real transactions. Using a portfolio demo does not book a service, approve a real quote or send a message. Temporary changes to the interactive concepts reset when the page is reloaded.</p>
    </> },
    { id: 'enquiries', title: 'Sending an enquiry', content: <>
      <p>The website’s contact form sends an enquiry to paceIT. Submitting it does not create a service agreement, confirm a price or commit either party to a project.</p>
      <p>Please provide accurate contact details and share only information you are entitled to submit. Our <a href="/privacy">Privacy Policy</a> explains how we handle enquiry information.</p>
    </> },
    { id: 'acceptable-use', title: 'Acceptable use', content: <>
      <p>Use the website lawfully. Do not attempt to compromise its security, interfere with its operation, submit spam or malicious material through the enquiry form, or access systems or information without authorisation.</p>
    </> },
    { id: 'materials', title: 'Portfolio and website materials', content: <>
      <p>Website copy, design work, portfolio visuals and concept demonstrations are owned by paceIT, licensed for use or shown with permission. Third-party materials remain subject to their owners’ rights and licence terms.</p>
      <p>You may view the website and share links to it. Do not present our portfolio work as your own or reuse protected material without the necessary permission.</p>
    </> },
    { id: 'availability', title: 'Availability and accuracy', content: <>
      <p>We aim to keep the website accurate and available, but information may change and interruptions may occur. Confirm current project details with us directly before relying on them.</p>
      <p>Nothing in these terms excludes rights or liabilities that applicable law does not allow us to exclude.</p>
    </> },
    { id: 'law-and-contact', title: 'Applicable law and contact', content: <>
      <p>These website terms are governed by South African law, subject to any mandatory rights that apply to you.</p>
      <p>We may update these terms when the website changes. The date at the top identifies the current version. For questions, contact <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
    </> },
  ]}/>;
}
