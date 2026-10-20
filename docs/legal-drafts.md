# Legal pages — draft for owner approval, not published

These drafts are not website routes, do not appear in the sitemap and have no public footer links. The owner requested approval before adding content. Review the wording and confirm the items below before publication. The drafts must describe actual business practices; they do not establish legal compliance by themselves.

## Confirm before publication

- Full legal name of the responsible party operating as paceIT, business type and a suitable contact/service address. The site currently states only “Kean Maan”, Pretoria and South Africa.
- Information Officer/privacy contact and any applicable registration/PAIA manual obligations. `info@paceit.co.za` is the known business email; confirm that it handles privacy requests too.
- Retention periods for unsuccessful enquiries, client records, mailbox messages and Brevo/hosting logs; who has access and how deletion requests are handled.
- Hosting and email provider arrangements, processing locations, agreements and applicable international-transfer safeguards. The code uses Vercel-compatible Next.js hosting and Brevo SMTP; actual account settings remain unverified.
- Whether the business offers services to or monitors people in the EEA/UK; GDPR/UK GDPR applicability cannot be inferred just from a publicly accessible website.
- Rights/licences for portfolio imagery and material, and the website-use terms below.

## Proposed `/privacy` — Privacy Policy

**Last updated:** [publication date]

### Who we are

paceIT is operated by [full legal name and business details], based in Pretoria, South Africa. For questions about this notice or your personal information, contact [confirmed privacy contact] at info@paceit.co.za. Our contact/service address is [confirmed address].

### Information we collect

When you send an enquiry, we receive the name, email address and project information you enter in the form. Please include only information needed to explain your enquiry, and avoid sending sensitive information or information about other people without an appropriate reason.

Our hosting provider may process technical information such as your IP address, requested pages and request time to deliver and protect the website. The enquiry endpoint temporarily uses a keyed hash of the requesting IP address to help limit repeated submissions; its application memory entries expire after ten minutes. It does not save enquiries in a website database or intentionally log their contents.

### How and why we use information

We use enquiry information to respond, discuss a possible project and take steps you request before entering a service agreement. We use necessary technical information to operate, secure and troubleshoot the website. We do not use an enquiry as permission to subscribe you to marketing.

We process information on an appropriate basis under applicable law, including steps requested before a contract, legitimate interests in responding to enquiries and securing our services, or compliance with a legal obligation. Where consent is required for a separate use, we will request it.

### Who processes information

Enquiries are sent through Brevo's SMTP service to info@paceit.co.za, and are handled by the people authorised to respond at paceIT. Hosting, email delivery and mailbox providers process information needed to provide those services. We do not sell enquiry information.

Providers may process information outside South Africa. [Confirm the providers, locations and applicable contractual or other safeguards before publication.]

### Retention

We retain information only for as long as needed to respond to enquiries, manage the resulting relationship and meet applicable legal requirements. [Insert the confirmed retention periods or specific retention criteria and deletion process.]

### Cookies and similar technologies

This version of the website does not set analytics, advertising or non-essential cookies, or use browser storage to persist visitor data. The portfolio concepts use temporary page state and reset when the page is reloaded. If optional tracking or other non-essential storage is introduced, this notice and any required consent controls will be updated before it is enabled.

### Your choices and rights

You can contact us at info@paceit.co.za to ask about access to your personal information, correction, deletion or an objection to processing, subject to applicable legal requirements and exceptions. We may need to verify your identity before fulfilling a request.

If South African law applies, you may also raise a concern with the Information Regulator at https://inforegulator.org.za/. If the GDPR or another privacy law applies to your circumstances, its relevant rights and complaint mechanisms also apply. [Confirm the appropriate jurisdiction-specific wording and contact details.]

### Updates

We may update this notice when the website or our processing practices change. The publication date above identifies the current version.

## Proposed `/terms` — Terms of Website Use

**Last updated:** [publication date]

### About this website

This website is operated by [full legal name and business details], trading as paceIT. You can contact us at info@paceit.co.za or [confirmed contact/service address]. These terms cover use of this website. Any paid project will have a separate agreed scope, fees and service terms.

### Information and demonstrations

The website describes our services and shows examples of possible software workflows. Flow Plumbing, Daylight and Relay are labelled demonstrations or concepts using fictional sample data. Their displayed bookings, quotes, approvals and tasks are not real transactions. Interacting with a portfolio demo does not book a service, approve a real quote or send a message.

### Enquiries

Submitting the enquiry form sends a message to paceIT. It does not create a service agreement, confirm a price or commit either party to a project. Please provide accurate contact details and submit only information you are entitled to share. Our Privacy Policy explains how we handle enquiry information.

### Acceptable use

Use this website lawfully. Do not attempt to compromise its security, interfere with its operation, send spam through the enquiry form or access systems or information without authorisation.

### Website materials

Unless otherwise stated, website materials belong to paceIT or are used with permission or under licence. You may view the website and share links to it. Do not present portfolio concepts as your own work or reuse protected material without appropriate permission. [Confirm ownership/licences before publication.]

### Availability and accuracy

We aim to keep the website accurate and available, but information may change and interruptions may occur. Please confirm current project details with us directly. Nothing in these terms excludes rights or liabilities that cannot lawfully be excluded.

### Applicable law and contact

These website terms are governed by South African law, subject to any mandatory rights that apply to you. For questions about the website or these terms, contact info@paceit.co.za.

## Proposed integration after approval

Add accessible `/privacy` and `/terms` pages, their unique metadata/canonicals and entries in `indexableRoutes`. Add small “Privacy” and “Terms” footer links, plus a contextual Privacy Policy link by the enquiry form. Preserve the existing homepage sections and wording. A non-essential cookie banner is not needed for the currently implemented functionality; add consent controls only if optional tracking/storage is actually introduced.
