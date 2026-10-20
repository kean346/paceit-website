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

Set `NEXT_PUBLIC_CONTACT_EMAIL` to the confirmed public business email, then rebuild/redeploy. The form opens an email draft; it does not submit to a backend. Until configured it prepares and copies a brief, explicitly saying nothing has been sent. No analytics, cookies or form storage are implemented.

## Portfolio

The Flow Plumbing demo is an original, silent 20-second product film, rendered at 1920 × 1080 and 60 fps. The customer request transforms into a quote form, quotation and dashboard row, followed by approval and a scheduled reminder. A single cursor follows timed control hit points; Alex Morgan, Q-008 and R 4,450 remain consistent throughout. The approved value increases from R 20,400 to R 24,850. The interface builds on the existing Flow Plumbing dashboard artwork.

The MP4 is `public/work/flow-plumbing-demo.mp4`; its final-frame poster is `public/work/flow-plumbing-poster.jpg`. The website plays it once when visible, pauses offscreen or in a hidden tab, and provides pause, replay, seeking, fullscreen and a text walkthrough. Reduced-motion visitors see the poster and can explicitly choose Play. It uses fictional sample data and sends nothing.

To regenerate the film, install dependencies with `npm ci`, ensure FFmpeg is available, then run `npm run render:film`. The deterministic Canvas renderer is `scripts/render-flow-demo.cjs`; fonts come from the existing Fontsource dependencies. Encoding uses H.264, yuv420p and fast-start metadata for website playback, with no audio track. `npm run render:film -- --stills` creates review frames in `.next/film-stills/` without rendering the video. Rendering is an authoring step; ordinary website builds use the committed video and do not need FFmpeg.

The gallery uses the supplied Tilted Grid Hero with Flow Plumbing illustrations and two explicitly labelled illustrative concepts (bookings and operations) and a fictional architectural website concept, not completed client work. No live-app link is offered.

The original site is retained on GitHub branch `backup/before-expanding-demo` (commit `5d9b1b3`). The intermediate expanding prototype is commit `8ad6567`.

## Components and provenance

- `components/ui/tilted-grid-hero.tsx`: the user's supplied React component, integrated into the Work section. Gallery motion starts when visible, offers a pause control, pauses offscreen, and respects reduced motion. The original component defaults restore the supplied reference composition. Replace `galleryImages` in `components/site-interactions.tsx` to add future portfolio assets.
- `components/ui/spotlight.tsx`: actual Motion Primitives Spotlight source by ibelick, MIT, retrieved from https://github.com/ibelick/motion-primitives/blob/main/components/core/spotlight.tsx (blob `59012f27dd56cee2f718fb4e93b9c77d048547a9`), also listed on https://21st.dev/@ibelick/components/spotlight. Integrated in the dark featured-work card; hidden for touch and disabled for reduced motion.
- `lib/utils.ts`, `components.json`, and `@/*` aliases provide the shadcn-compatible structure.
- Fonts: Plus Jakarta Sans and Space Grotesk, bundled through Fontsource.
- Icons: Lucide React.

## Editable content

Page copy: `app/page.tsx`. Design and responsive styles: `app/globals.css`. Contact/navigation/gallery: `components/site-interactions.tsx`. Product demo: `components/quote-walkthrough.tsx`.

No testimonials, revenue claims, client logos, phone numbers or unverified contact addresses have been added.
