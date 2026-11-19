"use client";

import { useEffect, useRef, useState } from "react";
import Spinner from "@/components/Spinner";
import { PHONE_MEDIA, phoneVideoFor, posterFor } from "@/content/site";

// the film at the top of a case study: plays silently on a loop like a moving cover image, with a small frosted
// control pill (back 5s · play/pause · forward 5s · scrubber · time) that shows only while the pointer is over the
// bottom strip of the film (where the pill sits) and fades out quickly when it leaves. keyboard users get it while tabbing through it; touch screens (no
// hover) get it while paused, so a tap on the film pauses it and brings the controls up. clicking the film also
// pauses / plays.
// until it's playing, the film's still (its first frame) shows, with a loading ring while it downloads. if the
// phone won't start it on its own (e.g. iPhone Low Power Mode), a big play button shows instead.

const SKIP = 5; // seconds

const fmt = (t: number) => {
  if (!Number.isFinite(t)) return "0:00";
  const s = Math.max(0, Math.floor(t));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export default function CaseVideo({ src, label, className = "" }: { src: string; label: string; className?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true); // nothing playing yet, or it's stalled waiting for data
  const [blocked, setBlocked] = useState(false); // the browser refused to start it without a tap

  // start it ourselves too, so we hear about it if the browser refuses
  useEffect(() => {
    video.current?.play().catch((e: unknown) => {
      if (e instanceof DOMException && e.name === "NotAllowedError") setBlocked(true);
    });
  }, []);
  const scrubbing = useRef(false);

  // the scrubber fill follows playback every frame (timeupdate alone only fires ~4× a second and looks jumpy)
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const v = video.current;
      if (v && fill.current && v.duration) fill.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  };
  const skip = (by: number) => {
    const v = video.current;
    if (!v || !v.duration) return;
    // wrap around, since the film loops
    v.currentTime = (((v.currentTime + by) % v.duration) + v.duration) % v.duration;
    setTime(v.currentTime);
  };
  const seekTo = (clientX: number) => {
    const v = video.current, t = track.current;
    if (!v || !t || !v.duration) return;
    const r = t.getBoundingClientRect();
    v.currentTime = Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * v.duration;
    setTime(v.currentTime);
  };

  const btn =
    "grid size-9 place-items-center rounded-full text-white/90 transition hover:bg-white/15 hover:text-white active:scale-90 focus-visible:outline-2 focus-visible:outline-white/80";

  return (
    <div className={`group relative overflow-hidden rounded-[10px] bg-lilac ${className}`}>
      <video
        ref={video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterFor(src)}
        aria-label={label}
        onClick={toggle}
        onPlay={() => setPaused(false)}
        onPlaying={() => { setLoading(false); setBlocked(false); }}
        onWaiting={() => setLoading(true)}
        onPause={() => setPaused(true)}
        onTimeUpdate={(e) => { if (!scrubbing.current) setTime(e.currentTarget.currentTime); }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        className="block aspect-video w-full cursor-pointer object-cover"
      >
        {/* the browser plays the first one that fits: phones get the lighter 720p copy */}
        <source src={phoneVideoFor(src)} type="video/mp4" media={PHONE_MEDIA} />
        <source src={src} type="video/mp4" />
      </video>

      {/* loading ring in the middle while it downloads; a big play button if the phone wouldn't start it */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        {blocked ? (
          <button
            type="button"
            onClick={toggle}
            aria-label="Play video"
            className="pointer-events-auto grid size-16 place-items-center rounded-full bg-[rgba(24,16,22,0.42)] text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] ring-1 ring-white/20 backdrop-blur-xl transition active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="size-7 translate-x-0.5" fill="currentColor" aria-hidden><path d="M8 5.6v12.8a1 1 0 0 0 1.5.86l10.2-6.4a1 1 0 0 0 0-1.72L9.5 4.74A1 1 0 0 0 8 5.6Z" /></svg>
          </button>
        ) : (
          <Spinner show={loading} />
        )}
      </div>

      {/* the hover zone: the bottom strip of the film. the controls only come up while the pointer is in here
          (a click on the empty part of the strip still pauses / plays, like the rest of the film) */}
      <div
        className="group/bar absolute inset-x-0 bottom-0 h-24 cursor-pointer sm:h-28"
        onClick={(e) => { if (e.target === e.currentTarget) toggle(); }}
      >
      {/* a soft shade at the bottom so the controls read on light frames */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-150 group-hover/bar:opacity-100 group-has-[:focus-visible]/bar:opacity-100 ${paused ? "[@media(hover:none)]:opacity-100" : ""}`}
      />

      <div
        className={`absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[rgba(24,16,22,0.42)] py-1 pl-1 pr-4 text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] ring-1 ring-white/15 backdrop-blur-xl translate-y-1.5 opacity-0 transition duration-150 ease-out group-hover/bar:translate-y-0 group-hover/bar:opacity-100 group-has-[:focus-visible]/bar:translate-y-0 group-has-[:focus-visible]/bar:opacity-100 sm:bottom-5 ${paused ? "[@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100" : ""}`}
      >
        <button type="button" className={btn} onClick={() => skip(-SKIP)} aria-label={`Back ${SKIP} seconds`}>
          <SkipIcon back />
        </button>
        <button type="button" className={`${btn} size-10`} onClick={toggle} aria-label={paused ? "Play" : "Pause"}>
          {paused ? (
            <svg viewBox="0 0 24 24" className="size-[18px] translate-x-px" fill="currentColor" aria-hidden><path d="M8 5.6v12.8a1 1 0 0 0 1.5.86l10.2-6.4a1 1 0 0 0 0-1.72L9.5 4.74A1 1 0 0 0 8 5.6Z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden><rect x="6.5" y="5" width="3.8" height="14" rx="1.2" /><rect x="13.7" y="5" width="3.8" height="14" rx="1.2" /></svg>
          )}
        </button>
        <button type="button" className={btn} onClick={() => skip(SKIP)} aria-label={`Forward ${SKIP} seconds`}>
          <SkipIcon />
        </button>

        {/* the scrubber: a thin line that thickens under the pointer; click or drag to jump */}
        <div
          ref={track}
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
          aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
          className="group/track relative ml-2 flex h-9 w-28 cursor-pointer touch-none items-center sm:w-44 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 rounded-sm"
          onPointerDown={(e) => { scrubbing.current = true; e.currentTarget.setPointerCapture(e.pointerId); seekTo(e.clientX); }}
          onPointerMove={(e) => { if (scrubbing.current) seekTo(e.clientX); }}
          onPointerUp={() => { scrubbing.current = false; }}
          onPointerCancel={() => { scrubbing.current = false; }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") { e.preventDefault(); skip(SKIP); }
            if (e.key === "ArrowLeft") { e.preventDefault(); skip(-SKIP); }
          }}
        >
          <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/25 transition-[height] duration-200 group-hover/track:h-[5px]">
            <div ref={fill} style={{ transform: "scaleX(0)" }} className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-[#F2D0D5] to-[#E48AA0] shadow-[0_0_8px_rgba(242,208,213,0.6)]" />
          </div>
        </div>
        <span className="ml-3 text-[12px] tabular-nums tracking-wide text-white/85">
          {fmt(time)} <span className="text-white/45">/ {fmt(duration)}</span>
        </span>
      </div>
      </div>
    </div>
  );
}

// a circular arrow with the number of seconds inside
function SkipIcon({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`size-[22px] ${back ? "" : "-scale-x-100"}`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
      <path d="M4.5 4.2v3.3h3.3" />
      <text x="12" y="15.4" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="currentColor" stroke="none" className={back ? "" : "[transform:scaleX(-1)] [transform-box:fill-box] [transform-origin:center]"}>
        {SKIP}
      </text>
    </svg>
  );
}
