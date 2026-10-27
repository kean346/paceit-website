# Shot and sound refinements

- 7–13 s: a single enquiry card drains its reply-time indicator. Sentence-case Jakarta typography replaces the large orange capitals. A softened slide/fade leads into the mobile reveal.
- 19–24 s: a genuine full-page capture scrolls through a fixed, rounded browser viewport. The browser remains within the output frame in both aspect ratios.
- 24–28 s: Travel, Flow, Daylight and Relay land in a two-by-two composition. Each arrival displaces existing panels briefly, then settles. Final panels remain fully visible. Pitched, low impacts land at 24.48, 25.20, 25.92 and 26.64 seconds.
- 44–50 s: analytics use rounded clipped surfaces with ambient shadows and subtle highlights; the thin rectangular screenshot outlines are removed.
- Sound: only two brief, much quieter filtered transitions remain, at 13 and 19 seconds. Other transitions use musical accents and the new panel impacts instead of repeated broadband noise.

Render: `python scripts/audio-v3.py`, `node scripts/film-v3.cjs`, `node scripts/film-v3.cjs --vertical`. Review stills: append `--stills`. QC: `node scripts/verify-v3.cjs`. Contact sheets: `node scripts/contact-v3.cjs`. New outputs are in `out/v3/`; previous versions remain available.

Scroll capture refresh: `node scripts/capture-scroll.cjs`, reading the existing production server at port 3004. It writes only the video project's assets. No website source or configuration changes.
