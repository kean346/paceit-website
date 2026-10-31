# paceIT design context

## Purpose and audience

A South African software studio marketing website for business owners. The homepage explains services and presents fictional product concepts; it is not an online shop. Project terms are agreed separately. Public business facts are maintained in `lib/business.ts`; privacy operations are documented in `docs/privacy-operations.md`.

## Established visual direction

Preserve the existing quiet studio identity, split headings, generous spacing and curved portfolio gallery. No homepage copy or visual redesign is part of the legal/accessibility work. Plus Jakarta Sans handles prose and headings; Space Grotesk handles utility text and numbers. Fonts are hosted locally through `app/layout.tsx`.

## Token ownership

`app/globals.css` is the runtime source of truth, including `:root` ink, emerald, ground, paper, muted, line and green-dark variables. Tailwind's inline theme maps the font and background roles. Component colour declarations remain in this stylesheet; do not introduce a separate parallel theme. Muted foregrounds must pass contrast on their actual backgrounds, including the green and blue demo surfaces. Emerald is a brand accent, not automatically a suitable small-text colour.

## Behaviour and accessibility

Marketing/content register: retain semantic links, native controls, skip link, visible keyboard focus, one H1 per route and the existing shared LegalPage shell. Enquiry validation is inline with field associations and first-error focus. A required, initially unchecked acknowledgement requests a response only; it is not a marketing subscription or acceptance of a paid contract. Server validation independently requires it. No form values are saved to browser storage.

The owner explicitly requires the gallery to autoplay on entry, including when reduced motion is enabled. Keep an immediately available pause/resume control and pause rendering offscreen or in a hidden tab. Do not silently reintroduce automatic pausing based on system motion preferences; other page animations continue to respect reduced motion. The gallery opens on SA Family Travel and the silent looping Forme video, followed by Mr Braai Guy and Northstar. Gallery pause, offscreen and hidden-tab states pause video playback too. The Flow film and interactive demos below remain independent. Demo tabs support arrow keys, Home and End. Native dialog, select and date controls preserve platform keyboard behaviour. Dialogs remain centered and Escape dismisses them. Demo state is fictional and transient.

## Verification

`npm run test:accessibility` checks automated WCAG A/AA rules, legal routes, both concepts and dialogs, keyboard enquiries, reduced motion and tracking/storage absence. `npm run test:site` covers responsive layouts, metadata, security headers, media and mocked enquiry outcomes. `npm run test:enquiry` covers server security. Automated results are not a claim of complete WCAG conformance; screen-reader, other browser and image/video text review remain separate work.
