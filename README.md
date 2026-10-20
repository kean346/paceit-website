# paceIT website

A compact Next.js / React / TypeScript website for paceIT. Tailwind CSS 4, shadcn-compatible component structure, locally bundled fonts, and static export. No database or server secrets are required.

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

`next build` exports the site to `out/`. Vercel can import the repository with the Next.js preset. Keep this marketing repository separate from `paceit-plumbing-demo`.

## Contact setup

The enquiry form opens a pre-filled email to `info@paceit.co.za`, including the visitor's name, email address and project brief. Visitors review and send it in their email app. The address is also displayed as a direct email link. This works without setting an environment variable; `NEXT_PUBLIC_CONTACT_EMAIL` is an optional public recipient override and requires a rebuild/redeploy when changed. The website does not send or store enquiries itself. No analytics, cookies or form storage are implemented.

## Portfolio

The Flow Plumbing demo is an original, silent 20-second product film, rendered at 1920 × 1080 and 60 fps. The customer request transforms into a quote form, quotation and dashboard row, followed by approval and a scheduled reminder. A single cursor follows timed control hit points; Alex Morgan, Q-008 and R 4,450 remain consistent throughout. The approved value increases from R 20,400 to R 24,850. The interface builds on the existing Flow Plumbing dashboard artwork.

The MP4 is `public/work/flow-plumbing-demo.mp4`; its final-frame poster is `public/work/flow-plumbing-poster.jpg`. The website plays it once when visible, pauses offscreen or in a hidden tab, and provides pause, replay, seeking, fullscreen and a text walkthrough. Reduced-motion visitors see the poster and can explicitly choose Play. It uses fictional sample data and sends nothing.

To regenerate the film, install dependencies with `npm ci`, ensure FFmpeg is available, then run `npm run render:film`. The deterministic Canvas renderer is `scripts/render-flow-demo.cjs`; fonts come from the existing Fontsource dependencies. Encoding uses H.264, yuv420p and fast-start metadata for website playback, with no audio track. `npm run render:film -- --stills` creates review frames in `.next/film-stills/` without rendering the video. Rendering is an authoring step; ordinary website builds use the committed video and do not need FFmpeg.

The Selected Work section uses the supplied Tilted Grid Hero with its original 26% tile height, 16:9 aspect ratio, 80° curve and four-second-per-tile motion. The heading and description follow the reference composition above and below the reel. A keyboard-accessible project selector opens the Flow Plumbing film or the interactive Daylight (booking) and Relay (operations) concepts. Gallery motion pauses offscreen, in a hidden tab, and on request; reduced-motion visitors see a complete still composition.

Daylight supports selecting, adding and cancelling appointments, checking for overlapping bookings, and switching between week and list views. Relay supports creating and editing tasks, assigning owners, filtering projects and moving tasks between statuses. Their summaries derive from the current demo state. Both use fictional sample data in local React state and offer Reset demo; no messages are sent and changes are not persisted.

Edit the `projects` collection in `components/selected-work.tsx` to add a real project screenshot, title and description. The concept UI source is `components/work-demos.tsx`; its local WebP previews are actual browser captures. To refresh them, start the development server, then run `npm run render:work`. The capture script is `scripts/capture-work-previews.cjs`; it uses system Chromium at `/usr/bin/chromium` when available. Otherwise install the Playwright browser (`npx playwright install chromium`) or set `PACEIT_CHROMIUM_PATH`. `DEMO_CAPTURE_URL` overrides the default local development address. Ordinary builds use the saved preview assets.

The original site is retained on GitHub branch `backup/before-expanding-demo` (commit `5d9b1b3`). The intermediate expanding prototype is commit `8ad6567`.

## Components and provenance

- `components/ui/tilted-grid-hero.tsx`: the user's supplied React component, integrated into the Work section. Gallery motion starts when visible, offers a pause control, pauses offscreen, and respects reduced motion. Its cylindrical geometry and continuous CSS animation are retained, with the existing reduced-motion fix. The collection, presentation and project data live in `components/selected-work.tsx`.
- `components/ui/spotlight.tsx`: actual Motion Primitives Spotlight source by ibelick, MIT, retrieved from https://github.com/ibelick/motion-primitives/blob/main/components/core/spotlight.tsx (blob `59012f27dd56cee2f718fb4e93b9c77d048547a9`), also listed on https://21st.dev/@ibelick/components/spotlight. Integrated in the dark featured-work card; hidden for touch and disabled for reduced motion.
- `lib/utils.ts`, `components.json`, and `@/*` aliases provide the shadcn-compatible structure.
- Fonts: Plus Jakarta Sans and Space Grotesk, bundled through Fontsource.
- Icons: Lucide React.

## Editable content

Page copy: `app/page.tsx`. Design and responsive styles: `app/globals.css`. Contact/navigation: `components/site-interactions.tsx`. Selected Work: `components/selected-work.tsx`. Film playback: `components/quote-walkthrough.tsx`.

No testimonials, revenue claims, client logos, phone numbers or unverified contact addresses have been added.
