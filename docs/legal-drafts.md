# Legal pages — implementation record

The owner supplied the business details and confirmed **Kean Maan** as the exact legal name on 20 October 2026. The resulting website pages are `/privacy` and `/terms`. This file retains its original review-link filename; the public page sources are now the authoritative wording.

## Implemented details

- Kean Maan, a sole proprietor trading as paceIT.
- Public business location: Pretoria, Gauteng, South Africa, 0002. No home street address is published.
- Kean Maan as Information Officer; `info@paceit.co.za` handles privacy, access, correction and deletion requests.
- Unsuccessful enquiries: up to six months for follow-up, then deletion from active records, with legal/dispute exceptions.
- Relevant client records: five years, subject to applicable statutory starting dates and longer legal, audit or dispute requirements.
- Eligible requests: a 30-day response/processing target, subject to identity checks, applicable procedures and lawful retention exceptions.
- Vercel hosting, Brevo SMTP, mailbox processing and possible international/sub-processor processing.
- Access restricted to the owner within paceIT, alongside necessary service-provider processing.
- South African business focus, without excluding rights under another privacy law where it applies.
- Portfolio ownership, licensing and permissions confirmed by the owner; fictional demo labels remain intact.

## Website integration

- `/privacy`: Privacy Policy, including enquiry purposes, data categories, retention, rights, providers, security, cookies and complaints.
- `/terms`: Terms of Website Use, covering the operator, demonstrations, enquiries, acceptable use and intellectual property. Paid projects remain subject to a separate agreement.
- Shared footer links on the homepage and legal pages; a contextual privacy link beside the enquiry form.
- Per-page titles, descriptions, Open Graph/Twitter URLs and canonicals, with sitemap entries.
- Shared navigation correctly returns to homepage sections from a legal page.
- No consent banner: the current application has no analytics, advertising cookies or persistent browser storage.

## Precision retained in the wording

A small/sole-proprietor business is not described as automatically exempt from PAIA obligations. Keeping a generic template on request is not presented as proof of compliance. The public notice directs access enquiries to the Information Officer without claiming a completed manual or registration exists.

The public pages identify the authorised location without claiming that city/postcode alone satisfies every address-disclosure requirement. They do not certify that a provider is universally POPIA/GDPR-compliant merely because it has European infrastructure.

Retention and deletion wording preserves lawful exceptions and acknowledges provider logs/backups, rather than promising permanent removal from every system within a fixed period. The 30-day handling target does not waive statutory procedures or mandatory rights.

## Operational follow-up

The website wording is implemented; [the owner’s operational checklist](privacy-operations.md) covers PAIA/Information Officer duties, retention, requests, provider agreements and address disclosures that cannot be established by code alone. SMTP authentication and live inbox delivery still require the separately documented account configuration.
