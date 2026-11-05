import { LegalPage } from '@/components/legal-page';
import { business } from '@/lib/business';
import { pageMetadata, site } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Terms of Website Use', path: '/terms',
  description: 'Terms for using paceIT’s website, sending enquiries and viewing its portfolio demonstrations. Operated by Kean Maan in Pretoria, South Africa.',
});

export default function Terms() {
  return <LegalPage title="Terms of Website Use" introduction={<p>These terms apply to the paceIT website, enquiries and portfolio demonstrations. They explain what you can expect when exploring our work or contacting us.</p>} summary={[
    'The website helps you explore our services. An enquiry does not commit you to a project.',
    'Paid work needs a separate agreement covering the scope, price and delivery terms.',
    'Portfolio concepts use fictional data and do not carry out real transactions.',
    'South African law applies, and your mandatory legal rights remain protected.',
  ]} sections={[
    { id: 'operator', title: 'About this website', content: <>
      <p>This website is operated by {business.ownerName}, a sole proprietor trading as paceIT, based in {business.location}.</p>
      <p>For enquiries or questions about these terms, email <a href={`mailto:${site.email}`}>{site.email}</a>. Any paid project will have a separately agreed scope, fees and service terms.</p>
    </> },
    { id: 'client-agreements', title: 'Website use and paid projects', content: <>
      <p>Our services include custom software, web applications, business automation, integrations and reporting tools. These website terms do not set the commercial terms for that work.</p>
      <p>Before paid work begins, we agree the project terms separately in writing. That agreement should address scope, deliverables, timing, fees, responsibilities, intellectual property and any support. For the project it covers, the agreed project terms take priority over these website terms.</p>
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
    { id: 'payment-and-cancellation', title: 'Fees and cancellation', content: <>
      <p>This website does not take payments or place orders. A demonstration price is sample data, rather than an offer to supply work at that price.</p>
      <p>Project prices, deposits, payment dates, changes, cancellation and any refunds must be addressed in the separate project agreement. Sending an enquiry does not create a payment obligation. Applicable consumer rights continue to apply.</p>
    </> },
    { id: 'project-ownership', title: 'Rights in project deliverables', content: <>
      <p>Permission to view our portfolio does not transfer rights in its materials. Ownership and licences for commissioned deliverables, reusable tools, pre-existing code and third-party components are matters for the project agreement. These website terms do not promise an automatic transfer of ownership.</p>
    </> },
    { id: 'external-services', title: 'External websites and services', content: <>
      <p>Links may take you to websites or services run by other providers. Check their terms and privacy information before sharing information or using them. paceIT does not control those websites or guarantee their content or availability.</p>
      <p>Our use of providers to operate this website is described in our <a href="/privacy">Privacy Policy</a>. External links do not change our own obligations under applicable law.</p>
    </> },
    { id: 'reliance-and-liability', title: 'Reliance and responsibility', content: <>
      <p>Portfolio examples illustrate possible workflows. They are not a guarantee of revenue, savings, accuracy or suitability for your business. Discuss your requirements with us before making decisions based on an example.</p>
      <p>Warranties, remedies and any agreed limits of liability for paid work belong in the project agreement. These website terms do not introduce a monetary liability cap or require you to indemnify paceIT. Nothing here removes a mandatory consumer remedy or excludes liability that cannot lawfully be excluded.</p>
    </> },
    { id: 'confidential-information', title: 'Sharing project information', content: <>
      <p>An initial enquiry should contain only enough information to start a discussion. Please do not send passwords, access credentials or confidential customer records through the website form. If a project needs confidential materials or personal information, we will agree appropriate arrangements before that information is shared.</p>
    </> },
    { id: 'access', title: 'Misuse and website access', content: <>
      <p>We may restrict access or reject abusive requests to protect the website and its visitors. A restriction on website access does not itself cancel a separate client agreement or remove rights you have under it.</p>
    </> },
    { id: 'law-and-contact', title: 'Applicable law and contact', content: <>
      <p>These website terms are governed by South African law, subject to any mandatory rights that apply to you.</p>
      <p>Please email <a href={`mailto:${site.email}`}>{site.email}</a> if a concern arises so that we can try to resolve it. This does not prevent you from using a court, regulator or other remedy available under applicable law.</p>
    </> },
    { id: 'changes', title: 'Changes to these terms', content: <>
      <p>We may revise these terms as the website changes. The date above identifies the version. Revisions apply going forward and do not rewrite an existing project agreement. If part of these terms cannot be enforced, the remaining provisions continue to apply to the extent permitted by law.</p>
    </> },
  ]}/>;
}
