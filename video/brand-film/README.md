# paceIT brand film

## Current delivery: revision 3

Use `out/v3/paceit-signal-16x9.mp4` and `out/v3/paceit-signal-reel.mp4`. This revision updates the enquiry typography/transition, replaces the cropped website shot with a browser scroll, assembles four complete project panels with synchronized landing sounds, rounds and shadows the analytics cards, and removes most of the noise sweeps. Commands and precise shot changes are in `notes/REVISION-v3.md`. The matching audio master and editable stems are in `audio/v3/`.

## Revised delivery: SIGNAL

Use `out/v2/paceit-signal-16x9.mp4` and `out/v2/paceit-signal-reel.mp4` for the revised film. Both are 57 seconds at 60 fps with stereo AAC. The revision replaces the persistent grid and slide composition with original shaded 3D emerald geometry, perspective product surfaces, full-frame UI, a travelling portfolio, sampled animated analytics and a new composed score.

Current commands: `npm run audio`, `npm run stills`, `npm run render`, `npm run render:portrait`. `bash render.sh` runs the complete current pipeline. `npm run render:v1` retains the older version. Python dependencies are pinned in `requirements.txt`; install them into an isolated environment inside this directory if needed. Source modules are `film-v2.cjs`, `tube-v2.cjs`, `analytics-v2.cjs` and `audio-v2.py`, all under `scripts/`.

Audio stems and cue sheet are in `audio/v2/`. The new score has evolving harmony, varied rhythm and deliberately placed camera sweeps and logo accents. The metallic conduit uses per-pixel normal interpolation and depth testing; the real website screens use perspective texture mapping. The analytics trace follows the original Northstar image. No external video-generation subscription, stock footage or copied reference audio is used.

`audio/v2/master-final.wav` is the final synchronized mix used by current renders. Its measured loudness is −15.95 LUFS, with a −1.49 dB true peak. Listening on physical speakers/headphones has not been verified here. `out/v2/verification.json` records the encoded-video and Git checks; `node scripts/verify-v2.cjs` repeats those checks. `node scripts/contact-v2.cjs` generates chronological contact sheets with timestamps.

Full-resolution review stills and contact sheets are in `out/v2/`. Art direction is recorded in `notes/ART-DIRECTION-v2.md`. The reference supplied the problem-to-product progression and camera language; the design is an original interpretation, not a replication of its fluid simulation.

## Prior version (retained)

Deliverables: `out/paceit-cinematic-16x9.mp4` (1920×1080) and `out/paceit-cinematic-reel.mp4` (1080×1920). Both are 57 seconds, H.264 at 30 fps, with stereo AAC. Portrait framing is independently arranged.

The prior version used `scripts/film.cjs` and `scripts/audio.py`. Prerequisites for the current version: Node 24, FFmpeg 7, Python 3, NumPy and SciPy. npm dependencies are isolated here. Deterministic Canvas rendering uses projected textured panels, not Remotion.

Copied fonts and assets and real website captures are retained in `assets/`. `npm run capture` refreshes captures from an already-running production server on port 3004 without changing source. Do not start root Next development as part of the film workflow; it can rewrite root files.

To regenerate extracted source frames, run `mkdir -p assets/flow-frames` then `ffmpeg -i assets/flow-plumbing-demo.mp4 -vf 'fps=12,scale=1280:720' -q:v 3 assets/flow-frames/%04d.jpg`. The original website asset is untouched.

`audio/master.wav` is the original stereo mix. Five editable WAV stems: music, atmosphere, transitions, ui and impacts. Synthesized harmonic pads, bass, percussion, arpeggios, sweeps and tones contain no sampled reference audio.

`out/contact-sheet.jpg` and `out/vertical-contact.jpg` summarize the layouts; numbered JPEGs are full-resolution stills. Use the 54-second still as a poster. `output/` contains obsolete early experiments, not deliverables.

## Creative limitations

The reference was downloaded and its frames and audio envelope analyzed; see `notes/scene-map.md`. This is a restrained graphic adaptation with panel projection and wipes, not a reproduction of the reference's fluid simulation or full 3D choreography. The gallery uses a real capture with animated project layers. Northstar motion is an illustrative overlay. The real homepage, SA Family Travel, Daylight, Relay, Northstar and original Flow film supply the visuals; concepts carry demo labels. UI sounds follow chapter labels rather than every click inside the compressed original film.

Typography uses copied website fonts. Reference footage is analysis-only and ignored by Git. No commits, pushes or deployments. Audio is measured programmatically; speaker/device listening has not been verified in this environment.
