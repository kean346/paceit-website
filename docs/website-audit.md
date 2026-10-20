# Website audit — 20 October 2026

Scope: `kean346/paceit-website`, existing homepage, portfolio gallery/concepts and real enquiry form. The owner confirmed **https://paceit.co.za** as the canonical domain and **Brevo SMTP** with **info@paceit.co.za** as sender/recipient. Existing marketing copy and design were preserved; the direct enquiry flow and legal-page integration were authorised separately. The owner confirmed Kean Maan as the sole proprietor and supplied the policy details on 20 October 2026.

## Findings and implemented changes

| Area | Before | Implemented / current status |
| --- | --- | --- |
| Semantic content | One H1 and an appropriate H2/H3 service hierarchy already present; readable service content rendered in HTML | Preserved. Added the missing image role to the labelled workflow illustration; corrected the gallery button's accessible-name mismatch. |
| Search metadata | Generic metadata, no canonical origin | Targeted title/description, `en-ZA`, shared origin configuration, homepage canonical, complete Open Graph/Twitter metadata and a local 1200 × 630 share image. No hidden keyword blocks or changed visible marketing copy. |
| Structured data | Missing | Organization, WebSite, WebPage and three Service entities connected through JSON-LD IDs. Uses only existing public business facts. No invented address, ratings, prices, opening hours or client results. |
| Local SEO eligibility | No verified full address/business listing details available | Organization + Service schema now includes the owner-confirmed legal trading name and city/region/postcode address. No street address or LocalBusiness eligibility is fabricated. A genuine Google Business Profile requires owner verification; schema does not guarantee a rich result. |
| Crawl control | No sitemap or robots file | Next.js-generated `/sitemap.xml` from the published route catalogue and `/robots.txt`; APIs excluded, assets left crawlable. Preview builds use noindex and disallow crawling. No fabricated last-modified dates. |
| Image alternatives | Existing project preview data had descriptive alternatives | Preserved informative text alternatives. The WebGL carousel and duplicated fallback tiles are decorative; their empty alt/hidden semantics avoid repeated screen-reader announcements. Fallback images now have dimensions, lazy loading and asynchronous decoding. |
| Initial work | Offscreen gallery compiled GPU shaders and requested all five large textures; optional concept code loaded initially | Gallery renderer/textures load when visible; Daylight/Relay code is split and loads on selection. Sharp local previews and continuous animation are retained. |
| Media and fonts | Film/poster requested before reaching the film; fonts discovered through stylesheets | Film/poster load near the player, video uses `preload="none"`, local primary fonts are preloaded with `next/font/local`. No font service or third-party tracking requests. |
| Layout | Existing responsive design | Verified no horizontal overflow at 320, 390, 768, 1440 and 1920 px. Gallery, fallback, keyboard-accessible project tabs and film controls still work. Chromium checked; other browser engines were not available here. |
| Security headers | No application configuration | CSP, HSTS, nosniff, frame denial, referrer policy and restricted permissions. Removed the framework-identification header. The native film fullscreen control remains permitted. |
| Enquiries | Redirected to a prefilled email draft | Same-origin server endpoint, encrypted Brevo SMTP, fixed From/To, validated visitor Reply-To and honest on-page result. No SQL database or HTML email interpretation. Configuration and protections are documented separately. |
| Privacy/terms | No legal pages/links | Owner-confirmed `/privacy` and `/terms` pages, shared footer links and a privacy link beside the form. Each page has its own metadata, canonical and sitemap entry. Operational duties remain separate; see the privacy operations checklist. |
| Cookies | No analytics, advertising cookies or persistent browser storage found | No unnecessary consent banner added. The Privacy Policy covers enquiries and infrastructure processing. Reassess consent before introducing non-essential tracking or storage. |
| Content/link architecture | One indexable homepage; navigation uses section links | Added stable service anchors matching schema and two approved legal pages. The share image supports clean link previews. Service pages, a real case study and an original resource remain proposals; none were invented or published. |

## Performance evidence

Local Lighthouse mobile lab runs from the technical audit, before the subsequent legal-page integration, using system Chromium, default simulated mobile throttling and a production build on the same machine:

| Metric | Baseline | Verified updated build |
| --- | ---: | ---: |
| Performance score | 71 | 95 |
| Largest Contentful Paint | 3.0 s | 2.8 s |
| Total Blocking Time | 1,190 ms | 70 ms |
| Cumulative Layout Shift | 0.005 | 0 |
| Accessibility score | 96 | 96 |
| Best Practices score | 100 | 100 |
| SEO score | 100 | 100 |

An intermediate updated run scored 96 for performance. Results vary with CPU, network and concurrent workloads; these are lab measurements, not real-user Core Web Vitals. LCP in the verified mobile simulation is still above the 2.5 s “good” threshold. Monitor the deployed domain with PageSpeed Insights/Search Console field data, especially on slower mobile connections. INP needs real interactions/field data; lab Total Blocking Time is not INP. Lighthouse's baseline SEO score of 100 did not detect the missing canonical, structured data and content architecture; it is not a complete SEO audit or ranking guarantee.

## Security details and practical limits

- HTTPS termination and HTTP-to-HTTPS redirects are provided by Vercel when the custom domain is correctly connected. HSTS is configured for the current host only; subdomain/preload commitments were not made without verifying all subdomains.
- The CSP restricts resources to this site, denies framing, objects and nested frames, limits form destinations and upgrades insecure requests. **Inline scripts/styles remain allowed** for Next's prerendered hydration and React styles. It is a compatible baseline policy, not a strict nonce/hash policy. A stricter policy requires a separately tested rendering/deployment change; no `unsafe-eval` or third-party script origins are allowed.
- Form inputs have server-side bounds/type checks and CRLF/control-character validation. Text remains plain text. The endpoint never accepts a client-selected recipient, attachment path or URL. The public site has no SQL queries to inject into.
- The burst limiter is bounded and uses temporary keyed hashes, but serverless instances do not share memory. Configure a **global Vercel Firewall rate limit for POST `/api/enquiry`**, or a shared limit service, before relying on global protection against automated mail abuse. Origin checks alone do not stop non-browser bots.
- npm's full dependency audit returned **0 reported vulnerabilities** after the SMTP dependency was installed. This is the registry's current advisory result, not proof that every application or infrastructure vulnerability is absent.
- No SMTP secret was available in the execution environment. Mock SMTP tests verify the handler and browser behaviour; they do not establish live authentication, sender authorisation, DNS alignment, inbox placement or successful production delivery.

Public DNS/HTTPS checks from this environment were blocked by network/proxy restrictions. Live certificate validity, deployed headers, domain redirects, Vercel environment settings, Search Console ownership and index status were **not independently verified**. Local production-header and browser checks passed.

## Remaining owner decisions / configuration

1. Set the four server-only SMTP variables and authorise the sender in Brevo; redeploy using Vercel's Next.js preset/default output. See [direct enquiry setup](enquiry-setup.md).
2. Confirm the primary domain is connected and HTTPS works, then redirect aliases in Vercel. Submit `https://paceit.co.za/sitemap.xml` in Search Console and monitor indexing/field performance.
3. The legal pages and links now use the owner-confirmed business, contact and retention details. Complete the [operational privacy checklist](privacy-operations.md), including applicable PAIA/manual and Information Officer duties, provider agreements, retention/deletion practices and any additional address disclosures. The site does not claim automatic exemptions or certify operational compliance.
4. Review [the proposed content architecture](organic-content-plan.md) before changing visible content or adding pages. Real service information, original resources and verified case studies are needed to target additional search intents and earn links.
5. Approve small contrast adjustments if desired. Existing muted text in the hero illustration, process section, About and footer fails some WCAG AA contrast checks; a muted large heading is also borderline. Colours were left unchanged to respect the instruction to preserve the design. The audit corrects the invisible accessible-name issue but does not claim full accessibility compliance.

## Checks performed

- `npm run typecheck` and `npm run build`; homepage/crawl files remain statically prerendered, with only `/api/enquiry` dynamic.
- `npm run test:enquiry`: server validation, cross-origin/content-type rejection, body limits, SMTP TLS settings, accepted/rejected/error states, missing configuration and burst limiting, with a mocked transport; no real email sent.
- `npm run test:site`: production headers/metadata/schema/crawl files, 404/noindex behaviour, responsive widths, actual gallery pause/resume, the elephant preview, lazy concepts, film playback and form success/failure without navigation. Browser form requests were intercepted; no real email sent. No cookies/storage or CSP violations detected.
- `npm run test:gallery`: over 3.4 million real GPU pixel checks across motion, resize, DPR and WebGL versions, including the right edge.
- Compared existing homepage text against the original production export during the technical audit, excluding the explicitly changed enquiry form. The later legal integration adds only legal links to the homepage; marketing sections remain unchanged.
- Legal-page checks cover unique metadata/canonicals, sitemap entries, footer/form links, anchored contents, mobile navigation and responsive widths. The operator identity was confirmed by the owner; no live legal/PAIA registration or provider-account review was performed.
- `npm audit --json`: zero reported advisories across production and development dependencies.
