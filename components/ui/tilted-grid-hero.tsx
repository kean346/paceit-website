"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { createGalleryRenderer } from "@/lib/curved-gallery-renderer";

export type TiltedGridImage = { src: string; video?: string; alt?: string };
export type TiltedGridHeroProps = {
  images: TiltedGridImage[];
  /** Seconds to move by one screen. */
  speed?: number;
  /** Controlled playback; otherwise follow the device's motion preference. */
  paused?: boolean;
  /** Screen height as a percentage of the hero height. */
  tileHeight?: number;
  aspectRatio?: number;
  /** Gap as a percentage of screen height. */
  gap?: number;
  /** Row centre as a percentage of hero height. */
  axis?: number;
  /** Bend at the viewport edge, in degrees. */
  curve?: number;
  fade?: number;
  fadeColor?: string;
  children?: React.ReactNode;
  /** Enables the dark screen frame; also styles the non-WebGL fallback. */
  tileClassName?: string;
  className?: string;
};

/** A cylinder drawn on one surface, without independently clipped CSS strips. */
export function TiltedGridHero({
  images, speed = 4, paused, tileHeight = 26, aspectRatio = 16 / 9,
  gap = 6, axis = 56, curve = 80, fade = 12,
  fadeColor = 'var(--color-background, #eaeae8)', children, tileClassName,
  className, ...props
}: React.ComponentProps<'div'> & TiltedGridHeroProps) {
  const root = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const renderer = React.useRef<ReturnType<typeof createGalleryRenderer> | null>(null);
  const [mode, setMode] = React.useState<'loading' | 'ready' | 'fallback'>('loading');
  const [systemPaused, setSystemPaused] = React.useState(true);
  const isPaused = paused ?? systemPaused;
  const pauseState = React.useRef(isPaused);
  pauseState.current = isPaused;
  const fallback = `gallery-fallback-${React.useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  React.useEffect(() => {
    if (paused !== undefined) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemPaused(preference.matches);
    update(); preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, [paused]);

  React.useEffect(() => {
    const element = root.current, drawing = canvas.current;
    if (!element || !drawing || !images.length) return;
    let disposed = false;
    let cleanup = () => {};
    async function start() {
      try {
        const { createGalleryRenderer } = await import('@/lib/curved-gallery-renderer');
        if (disposed) return;
        const instance = createGalleryRenderer(drawing!, {
          images, speed, tileHeight, aspectRatio, gap, axis, curve,
          framed: !!tileClassName,
          onReady: () => { if (!disposed) setMode('ready'); },
          onError: () => { if (!disposed) setMode('fallback'); },
        });
        renderer.current = instance;
        instance.setPaused(pauseState.current);
        const resize = () => instance.resize(element!.clientWidth, element!.clientHeight);
        resize();
        const observer = new ResizeObserver(([entry]) => instance.resize(entry.contentRect.width, entry.contentRect.height));
        observer.observe(element!);
        window.addEventListener('resize', resize);
        cleanup = () => { observer.disconnect(); window.removeEventListener('resize', resize); instance.destroy(); renderer.current = null; };
      } catch { if (!disposed) setMode('fallback'); }
    }
    // Do not compile GPU shaders or fetch five large textures below the fold.
    const visibility = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { visibility?.disconnect(); void start(); }
    }) : null;
    if (visibility) visibility.observe(element); else void start();
    return () => { disposed = true; visibility?.disconnect(); cleanup(); };
  }, [images, speed, tileHeight, aspectRatio, gap, axis, curve, tileClassName]);

  React.useEffect(() => { renderer.current?.setPaused(isPaused); }, [isPaused, images, speed, tileHeight, aspectRatio, gap, axis, curve, tileClassName]);

  const u = (n: number) => `calc(${n} * min(${tileHeight}cqh, ${55 / aspectRatio}cqw))`;
  return <div ref={root} className={cn('relative overflow-hidden', className)} {...props}
    data-gallery-renderer={mode} style={{ containerType: 'size', isolation: 'isolate', ...props.style }}>
    <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ visibility: mode === 'ready' ? 'visible' : 'hidden' }} />
    {mode === 'fallback' && <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`@keyframes ${fallback}{to{transform:translateX(calc(-50% - ${u(gap / 200)}))}}.${fallback}{animation-duration:${Math.max(1, images.length) * speed}s!important;animation-iteration-count:infinite!important}`}</style>
      <div className={cn('absolute flex', fallback)} style={{
        left: `calc(50% - ${u(aspectRatio + gap / 200)})`,
        top: `calc(${axis}% - ${u(.5)})`, gap: u(gap / 100), width: 'max-content',
        animation: `${fallback} ${images.length * speed}s linear infinite`, animationPlayState: isPaused ? 'paused' : 'running',
      }}>
        {[...images, ...images].map((image, i) => <div key={i} className={cn('shrink-0 overflow-hidden rounded-2xl', tileClassName)} style={{ width: u(aspectRatio), height: u(1) }}>
          {image.video ? <video src={image.video} poster={image.src} muted loop playsInline autoPlay={!isPaused}
            ref={element => { if (element) { if (isPaused) element.pause(); else void element.play().catch(() => {}); } }}
            className="h-full w-full object-contain" /> : <img src={image.src} alt="" width={1600} height={900} loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover" />}
        </div>)}
      </div>
    </div>}
    {fade > 0 && <div aria-hidden data-gallery-edge-fade className="pointer-events-none absolute -inset-px"
      style={{ background: `linear-gradient(90deg,${fadeColor},transparent ${fade}%,transparent ${100 - fade}%,${fadeColor})` }} />}
    {children}
  </div>;
}

export default TiltedGridHero;
