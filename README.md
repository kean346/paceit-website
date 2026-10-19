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

The Flow Plumbing walkthrough uses browser-local sample data. It is clearly labelled as a fictional demonstration, not a real customer case study. It does not connect to the plumbing database or send follow-up messages. The curved gallery shows three purpose-made SVG views of the same prototype, not additional client projects or claimed screenshots.

The original demo was found at `kean346/paceit-plumbing-demo` with a Vercel project, but public availability and database readiness were not established, so no live-app button is shown.

## Components and provenance

- `components/ui/tilted-grid-hero.tsx`: the user's supplied React component, integrated into the Work section. Gallery motion starts only on request, pauses after 18 seconds or when outside the viewport, and respects reduced motion. Replace `galleryImages` in `components/site-interactions.tsx` to add future portfolio assets.
- `components/ui/spotlight.tsx`: actual Motion Primitives Spotlight source by ibelick, MIT, retrieved from https://github.com/ibelick/motion-primitives/blob/main/components/core/spotlight.tsx (blob `59012f27dd56cee2f718fb4e93b9c77d048547a9`), also listed on https://21st.dev/@ibelick/components/spotlight. Integrated in the dark featured-work card; hidden for touch and disabled for reduced motion.
- `lib/utils.ts`, `components.json`, and `@/*` aliases provide the shadcn-compatible structure.
- Fonts: Plus Jakarta Sans and Space Grotesk, bundled through Fontsource.
- Icons: Lucide React.

## Editable content

Page copy: `app/page.tsx`. Design and responsive styles: `app/globals.css`. Contact/navigation/gallery: `components/site-interactions.tsx`. Product demo: `components/quote-walkthrough.tsx`.

No testimonials, revenue claims, client logos, phone numbers or unverified contact addresses have been added.
