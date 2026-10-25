# Legal, privacy and accessibility review — 25 October 2026

## Scope and decisions

Reviewed the current Next.js source and a local production build of `kean346/paceit-website`. Kept the marketing copy, portfolio and visual identity. Existing owner-confirmed Privacy Policy and Terms of Website Use remain in place; added a separate `/cookies` policy and links. Public operator details are Kean Maan, sole proprietor trading as paceIT, Pretoria, Gauteng, South Africa, 0002, info@paceit.co.za.

The owner replied “i dont have any items so dont worry” when asked about refunds. No refund page, invented deadline, blanket exclusion or non-refundable deposit term was added. The website accepts enquiries, not orders/payments. If paid service agreements are entered into separately, assess applicable cancellation, advance-payment and service-quality remedies before agreeing terms. Selling services rather than physical items does not automatically remove consumer rights.

## Implemented checks and fixes

- Reused the shared LegalPage shell and page-specific metadata/canonical/sitemap for `/cookies`. Privacy and website terms are linked throughout. Updated the policy review date.
- Required an initially unchecked acknowledgement that enquiry details will be used to respond. It is distinct from marketing consent and does not claim to be the only lawful processing basis. Both browser and server reject missing confirmation. SMTP plain text includes that a response was requested; no additional tracking/database was added.
- Still collect only name, email and a project description (plus a spam-trap field). No telephone, ID number, address, payment data or attachments requested. Warn against sending sensitive information.
- Added inline form errors, linked descriptions/invalid states, first-invalid-field focus and keyboard-operated checkbox. Duplicate requests remain guarded; pending, success, failure and retry states remain on-site.
- Measured text contrast with axe-core and adjusted failing foreground shades while preserving the palette. Fixed the native demo dialogs' centering, select focus and voice-control accessible-name mismatch; mobile navigation closes with Escape and restores focus.
- Restored reduced-motion preference support to the autoplay gallery. Pause/resume remains available; normal autoplay is retained. The film already has playback controls and a written walkthrough. Media artwork and text within screenshots/video are not comprehensively assessed by DOM scanners.
- All existing image elements have alt attributes. Repeated decorative carousel tiles remain hidden with empty alt; the project previews and hero illustration have descriptive alternatives. Image labels identify concepts; source scans found no fabricated testimonials, ratings or guaranteed results. No unrelated marketing copy was removed.

## Tracking, embeds and consent assessment

Application source has no visitor analytics, advertising pixels, trackers, externally hosted fonts, third-party embeds, cookies or local/session storage. Gallery media, fonts and video are local. Brevo SMTP is server-side, not an embedded tracker. CSP prevents third-party script/connect destinations and iframe loading. Therefore no optional-cookie consent banner is needed for this application's current configuration. A banner that pretends to offer nonexistent choices was not added.

This is an application-code/local-browser finding, not a full deployed-infrastructure attestation. Vercel integrations, Firewall challenges, externally configured analytics or future scripts could change it. Re-test the actual public domain after deployment. Before introducing consent-requiring optional tracking, implement prior blocking, equally accessible reject/accept choices, granular purposes and withdrawal. The enquiry acknowledgement does not authorise cookies or direct marketing.

## Applicable legal framework and remaining risks

The primary framework is South Africa, based on the confirmed business location and audience. These are issues to verify with qualified local advice, not a legal opinion or a certification. Live official-source access was attempted during this review but blocked by the environment's network proxy; current amendments, regulator guidance and registration records could not be independently verified.

1. **POPIA** (Act 4 of 2013): necessity, purpose, transparency, retention, security/operator duties, Information Officer responsibilities, direct marketing (s69) and cross-border processing (s72). Publishing notices does not establish actual compliance. Confirm registration, provider/operator agreements and safeguards for Vercel, Brevo and the mailbox provider. Establish breach assessment/notification procedures and implement the promised six-month enquiry retention and eligible-request handling. The code does not delete mailbox records.
2. **PAIA** (Act 2 of 2000): determine and fulfill applicable s51 manual/access duties. Do not assume an exemption merely because this is a small sole proprietorship. A generic template on request is not evidence of compliance. See `privacy-operations.md`.
3. **ECTA** (Act 25 of 2002) and **CPA** (Act 68 of 2008): assess disclosure, electronic transaction, cancellation/cooling-off, advance-payment and service-quality duties against the actual service sales process and any exemptions. A city/postcode is not guaranteed to satisfy every physical-address disclosure requirement. Obtain a suitable lawful service address if needed; do not invent or expose a home address. No personal telephone, VAT number or company-registration details were supplied, so none were fabricated. Do not claim statutory remedies are waived by custom project terms.
4. **Copyright Act** (Act 98 of 1978) and contractual licences: the owner previously confirmed portfolio ownership/licensing/permission. This is not independent clearance. Keep actual evidence for SA Family Travel's screenshot, underlying elephant photograph, logo/type assets, mockups and all third-party material. A screenshot does not itself establish the underlying image licence. Check that permissions cover website portfolio use and the downloadable walkthrough video. Fonts/dependencies have their own licences; preserve relevant notices when redistributing. No unsupported claim of independent copyright verification was added.
5. **Advertising accuracy**: concepts remain labelled as fictional, with sample data; their revenue/quote numbers are not real customer outcomes. No fake reviews or ratings were found in copy/schema. Maintain that distinction in future case studies.
6. **GDPR/UK GDPR and cookie rules**: public global availability alone does not determine scope; review establishment, targeting and monitoring if activities change. If applicable, honour those rules and mandatory rights. European infrastructure alone is not proof that all processing is compliant.
7. **Accessibility**: WCAG 2.2 AA is the technical target, not a legal certification. Automated tests and Chromium keyboard checks cannot establish every success criterion. Complete screen-reader, Safari/Firefox, touch, zoom and media-content review before claiming full conformance. Applicable equality/disability obligations require context-specific assessment.
8. **Security/operations**: existing TLS-enforced SMTP, fixed sender/recipient, bounded plain-text inputs, same-origin POST, CSP/HSTS/frame denial and temporary burst limits remain. A global Vercel Firewall/shared rate limit is still needed for distributed mail abuse. CSP still allows inline framework scripts; this is not a strict nonce policy. SMTP production configuration, live delivery, DNS, production headers and provider settings are not verified by local mocked tests.

## Official references for owner/adviser verification

- Information Regulator (POPIA, PAIA and Information Officer guidance): https://inforegulator.org.za/
- POPIA statutory text: https://www.justice.gov.za/legislation/acts/2013-004.pdf
- PAIA statutory text: https://www.justice.gov.za/legislation/acts/2000-002.pdf
- CPA: https://www.gov.za/documents/consumer-protection-act
- ECTA: https://www.gov.za/documents/electronic-communications-and-transactions-act
- WCAG 2.2: https://www.w3.org/TR/WCAG22/

These links identify relevant authorities/texts; they were not live-source verified from this environment. Operational confirmations are outstanding, so the site must not be described as immune from litigation or fully legally compliant.

## Verification record

See package scripts for reproducible checks. Tests use a local production server and mocked enquiry delivery, not real messages. Exact results are recorded after verification below.

- `npm run typecheck`: passed.
- `npm run build`: passed; home, all three legal pages and crawl files prerender successfully; only enquiries require a server.
- `npm run test:enquiry`: all 10 security/SMTP tests passed, including missing/false/string privacy acknowledgement rejection and injection/body/rate limits. No live SMTP messages were sent.
- `AUDIT_BASE_URL=http://127.0.0.1:3009 npm run test:site`: passed, including five responsive widths, metadata/security, gallery/film/concepts, legal links and mocked on-site success/failure.
- `AUDIT_BASE_URL=http://127.0.0.1:3009 npm run test:accessibility`: passed. Zero automated WCAG A/AA violations in the 12 checked states: four routes at 1440/390px, Daylight, Relay and both dialogs. Keyboard validation, required acknowledgement, Escape, reduced motion, no external requests/iframes/cookies/storage also passed. This is not a complete conformance claim.
- `npm audit --cache /workspace/.cache/npm --json`: zero reported advisories across production and development dependencies at review time.
- Reviewed desktop contact and mobile enquiry/policy/footer screenshots in Chromium. Contact underlines were also strengthened for field-boundary contrast; image/video pixels and every WCAG criterion were not independently certified.
- `git diff --check`: passed. No formatter/linter command exists in this repository; no formatter result is claimed.

## Owner correction — gallery autoplay

The owner rejected the reduced-motion-based initial pause after deployment. Restored the explicitly requested gallery autoplay for both system motion settings; the visitor can still pause/resume, and offscreen/hidden-tab rendering still pauses. The reduced-motion initial-pause statements above are historical and superseded by this decision. Other reduced-motion behaviour is unchanged. This intentional exception must be considered in any future accessibility conformance review; do not claim universal reduced-motion support.
