# paceIT website

A compact Next.js / React / TypeScript website for paceIT. Tailwind CSS 4, shadcn-compatible component structure, locally bundled fonts, a prerendered homepage and a server-side Brevo SMTP enquiry endpoint. No database is required. Email credentials stay on the server.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The homepage is `/`; its Work section is `/#work`.

```sh
npm run typecheck
npm run build
```

`next build` creates a standard Next.js production build. Run it locally with `npm start`, or deploy on Vercel with the Next.js preset and default output settings. Do not set a custom `out` output directory: static-only hosting cannot run the enquiry endpoint. Keep this marketing repository separate from `paceit-plumbing-demo`.

## Contact setup

The form sends directly from the website through Brevo SMTP to `info@paceit.co.za`, with the same address as From and the visitor's address as Reply-To. It never redirects to an email app. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` and `SMTP_PASS` as server-only environment variables; see [the complete setup guide](docs/enquiry-setup.md) and `.env.example`. Success requires SMTP acceptance; failures preserve the visitor's input. No enquiries are stored in a website database. No analytics, cookies or persistent browser storage are implemented.

The primary canonical URL is `https://paceit.co.za`, confirmed by the owner. `NEXT_PUBLIC_SITE_URL` can override this public origin. The generated sitemap, robots file, metadata and Organization/Service JSON-LD use the same origin. Vercel preview deployments are marked noindex.

## Audit and verification

[SEO, performance, security and legal audit](docs/website-audit.md). The owner-confirmed Privacy Policy and Terms are available at `/privacy` and `/terms`; see [the legal implementation record](docs/legal-drafts.md) and [operational follow-up](docs/privacy-operations.md). The proposed [organic content architecture](docs/organic-content-plan.md) remains unpublished pending approval. Existing marketing copy and design are preserved; approved changes are the direct enquiry flow and small legal links.

```sh
npm run test:enquiry  # Mock SMTP only; no email sent
npm run test:gallery  # Real GPU regression checks
npm run test:site     # Requires npm start on port 3004; mocks form requests
```

The browser checks use system Chromium by default; set `PACEIT_CHROMIUM_PATH` or `AUDIT_BASE_URL` as needed. The security headers are defined in `next.config.ts`. The homepage remains statically rendered; optional demos, gallery textures and film downloads are deferred until needed.

## Portfolio

The Flow Plumbing demo is an original, silent 20-second product film, rendered at 1920 × 1080 and 60 fps. The customer request transforms into a quote form, quotation and dashboard row, followed by approval and a scheduled reminder. A single cursor follows timed control hit points; Alex Morgan, Q-008 and R 4,450 remain consistent throughout. The approved value increases from R 20,400 to R 24,850. The interface builds on the existing Flow Plumbing dashboard artwork.

The MP4 is `public/work/flow-plumbing-demo.mp4`; its final-frame poster is `public/work/flow-plumbing-poster.jpg`. The website plays it once when visible, pauses offscreen or in a hidden tab, and provides pause, replay, seeking, fullscreen and a text walkthrough. Reduced-motion visitors see the poster and can explicitly choose Play. It uses fictional sample data and sends nothing.

To regenerate the film, install dependencies with `npm ci`, ensure FFmpeg is available, then run `npm run render:film`. The deterministic Canvas renderer is `scripts/render-flow-demo.cjs`; fonts come from the existing Fontsource dependencies. Encoding uses H.264, yuv420p and fast-start metadata for website playback, with no audio track. `npm run render:film -- --stills` creates review frames in `.next/film-stills/` without rendering the video. Rendering is an authoring step; ordinary website builds use the committed video and do not need FFmpeg.

The Selected Work section uses the supplied Tilted Grid Hero composition with larger screens, a 65° curve and ten-second-per-tile motion. A continuous WebGL surface prevents strip seams at the right edge; a flat animated fallback is available without WebGL. It starts automatically when visible, as requested by the owner, and pauses offscreen, in a hidden tab or with Pause gallery. Its five local high-resolution previews include the actual elephant SA Family Travel website. A keyboard-accessible project selector opens the Flow Plumbing film or the interactive Daylight (booking) and Relay (operations) concepts. The film independently respects reduced motion.

Daylight supports selecting, adding and cancelling appointments, checking for overlapping bookings, and switching between week and list views. Relay supports creating and editing tasks, assigning owners, filtering projects and moving tasks between statuses. Their summaries derive from the current demo state. Both use fictional sample data in local React state and offer Reset demo; no messages are sent and changes are not persisted.

Edit the `projects` collection in `components/selected-work.tsx` to add a real project screenshot, title and description. The concept UI source is `components/work-demos.tsx`; its local WebP previews are actual browser captures. To refresh them, start the development server, then run `npm run render:work`. The capture script is `scripts/capture-work-previews.cjs`; it uses system Chromium at `/usr/bin/chromium` when available. Otherwise install the Playwright browser (`npx playwright install chromium`) or set `PACEIT_CHROMIUM_PATH`. `DEMO_CAPTURE_URL` overrides the default local development address. Ordinary builds use the saved preview assets.

The original site is retained on GitHub branch `backup/before-expanding-demo` (commit `5d9b1b3`). The intermediate expanding prototype is commit `8ad6567`.

## Components and provenance

- `components/ui/tilted-grid-hero.tsx`: the user's supplied React component, integrated into the Work section. Gallery motion starts when visible, offers a pause control and pauses offscreen. `lib/curved-gallery-renderer.ts` draws the continuous cylindrical mesh. The renderer and its textures load only when the gallery is visible; optional concept code loads when selected. Controlled gallery playback follows the owner’s explicit autoplay preference; uncontrolled component use respects reduced motion. The collection, presentation and project data live in `components/selected-work.tsx`.
- `components/ui/spotlight.tsx`: retained Motion Primitives Spotlight source by ibelick, MIT, retrieved from https://github.com/ibelick/motion-primitives/blob/main/components/core/spotlight.tsx (blob `59012f27dd56cee2f718fb4e93b9c77d048547a9`), also listed on https://21st.dev/@ibelick/components/spotlight. Not imported by the current homepage.
- `lib/utils.ts`, `components.json`, and `@/*` aliases provide the shadcn-compatible structure.
- Fonts: Plus Jakarta Sans and Space Grotesk, bundled through Fontsource.
- Icons: Lucide React.

## Editable content

Page copy: `app/page.tsx`. Design and responsive styles: `app/globals.css`. Contact/navigation: `components/site-interactions.tsx`. Selected Work: `components/selected-work.tsx`. Film playback: `components/quote-walkthrough.tsx`.

No testimonials, revenue claims, client logos, phone numbers or unverified contact addresses have been added.
