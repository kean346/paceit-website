'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Maximize, Pause, Play, RotateCcw } from 'lucide-react';

const filmSource = '/work/flow-plumbing-demo.mp4';
const filmPoster = '/work/flow-plumbing-poster.jpg';
const timestamp = (seconds: number) => `00:${String(Math.floor(seconds)).padStart(2, '0')}`;

export function QuoteWalkthrough() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [manualPlay, setManualPlay] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(20);
  const [failed, setFailed] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) setManualPlay(false);
    };
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.18 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setTabVisible(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    const element = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    setFullscreenSupported(Boolean(document.fullscreenEnabled || element?.webkitEnterFullscreen));
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  const shouldPlay = visible && tabVisible && !userPaused && !ended && !failed && (!reducedMotion || manualPlay);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let cancelled = false;
    if (shouldPlay) {
      void element.play().catch((error: DOMException) => {
        // Browser autoplay policy may require a deliberate press of Play.
        if (!cancelled && error.name !== 'AbortError') setUserPaused(true);
      });
    } else { element.pause(); }
    return () => { cancelled = true; };
  }, [shouldPlay]);

  function play(fromStart = false) {
    const element = video.current;
    if (!element) return;
    if (fromStart || element.ended) { element.currentTime = 0; setTime(0); }
    setEnded(false);
    setManualPlay(true);
    setUserPaused(false);
    // Start in the button's user gesture as well as the visibility effect.
    void element.play().catch((error: DOMException) => {
      if (error.name !== 'AbortError') setUserPaused(true);
    });
  }
  function togglePlayback() {
    if (playing) { setUserPaused(true); video.current?.pause(); }
    else { play(); }
  }
  function seek(value: number) {
    const element = video.current;
    if (!element) return;
    const wasEnded = ended;
    element.currentTime = value;
    setTime(value);
    setEnded(value >= duration);
    if (wasEnded) setUserPaused(true);
  }
  function fullscreen() {
    const element = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (element?.requestFullscreen && document.fullscreenEnabled) {
      void element.requestFullscreen().catch(() => {});
    } else { element?.webkitEnterFullscreen?.(); }
  }

  const progress = duration > 0 ? Math.min(100, time / duration * 100) : 0;
  const chapter = time < 3 ? 'The request' : time < 7 ? 'Build the quote' : time < 11 ? 'Ready to send'
    : time < 15 ? 'Approved, in view' : time < 18 ? 'The next step' : 'Everything, in its place';

  return (
    <figure ref={root} className="product-film" aria-label="Flow Plumbing product demonstration">
      <div className="product-film-header">
        <span className="product-film-brand"><span className="product-film-brand-dot" />Flow Plumbing</span>
        <span className="product-film-disclaimer">Demo · Fictional business</span>
      </div>
      <div className="product-film-screen">
        <video ref={video} className="product-film-video" src={filmSource} poster={filmPoster}
          preload="metadata" muted playsInline
          aria-label="A twenty-second silent demonstration of Flow Plumbing" aria-describedby="flow-film-description"
          onLoadedMetadata={(event) => {
            const length = event.currentTarget.duration;
            if (Number.isFinite(length) && length > 0) setDuration(length);
          }}
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
          onEnded={() => { setEnded(true); setPlaying(false); }}
          onError={() => { setFailed(true); setPlaying(false); }}
        >Your browser does not support embedded video. <a href={filmSource}>Open the Flow Plumbing film.</a></video>
        {failed && <div className="product-film-error" role="status"><p>The film could not load.</p><a href={filmSource}>Open the video <ArrowUpRight size={16} /></a></div>}
      </div>
      <div className="product-film-player">
        <div className="product-film-timeline">
          <label className="product-film-sr-only" htmlFor="flow-film-seek">Seek Flow Plumbing demo</label>
          <input id="flow-film-seek" className="product-film-seek" type="range" min={0} max={duration} step={0.05}
            value={time} disabled={failed} aria-valuetext={`${timestamp(time)} of ${timestamp(duration)}`}
            style={{ background: `linear-gradient(to right, #43b19b ${progress}%, #353538 ${progress}%)` }}
            onChange={(event) => seek(Number(event.currentTarget.value))} />
        </div>
        <div className="product-film-toolbar">
          <span className="product-film-chapter">{ended ? 'Less chasing. More getting it done.' : chapter}</span>
          <div className="product-film-controls">
            <span className="product-film-time" aria-hidden="true">{timestamp(time)} <span>/ {timestamp(duration)}</span></span>
            <button type="button" className="product-film-control product-film-primary" onClick={togglePlayback} disabled={failed}
              aria-label={ended ? 'Play film again' : playing ? 'Pause film' : 'Play film'}>
              {playing ? <Pause size={15} /> : <Play size={15} />}<span>{playing ? 'Pause' : ended ? 'Play again' : 'Play'}</span>
            </button>
            <button type="button" className="product-film-control" onClick={() => play(true)} disabled={failed} aria-label="Replay film from the beginning">
              <RotateCcw size={15} /><span>Replay</span>
            </button>
            {fullscreenSupported && <button type="button" className="product-film-control product-film-fullscreen" onClick={fullscreen} disabled={failed} aria-label="Watch film fullscreen"><Maximize size={17} /></button>}
          </div>
        </div>
      </div>
      <figcaption className="product-film-caption">
        <p>{reducedMotion && !manualPlay ? 'Motion is off. Play the film when you’re ready.' : 'One request. A quote. A clear next step.'}</p>
        <span>20 seconds · No sound</span>
      </figcaption>
      <details className="product-film-transcript">
        <summary>Read the walkthrough</summary>
        <p id="flow-film-description">Alex Morgan asks Flow Plumbing for a geyser installation quote in Pretoria. Installation labour is R 3,200 and fittings and materials are R 1,250. Quote Q-008 totals R 4,450. The quote is sent and marked Approved; the dashboard’s approved value rises from R 20,400 to R 24,850. A reminder to arrange Alex’s installation is scheduled for tomorrow at 09:00. Less chasing. More getting it done.</p>
        <p>Fictional business and sample data. No messages are sent.</p>
      </details>
    </figure>
  );
}
