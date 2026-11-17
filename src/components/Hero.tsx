"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { info, tiles } from "@/content/site";

// 01 / The Sky
export default function Hero() {
  const [m, setM] = useState({ x: 0, y: 0 }); // mouse position, -0.5 to 0.5
  const dragged = useRef(false); // so a drag doesn't count as a click
  const calm = useReducedMotion();

  function onMove(e: React.MouseEvent<HTMLElement>) {
    if (calm) return;
    const r = e.currentTarget.getBoundingClientRect();
    setM({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  }

  return (
    <section
      id="top"
      onMouseMove={onMove}
      className="relative h-[960px] overflow-hidden bg-lilac bg-[url(/img/sky.webp)] bg-cover bg-center"
    >
      {/* drifting cloud layer */}
      <div aria-hidden className="drift absolute inset-0 bg-[url(/img/clouds.webp)] bg-[length:900px_auto] opacity-35 mix-blend-screen" />

      {/* frame with crosshairs */}
      <div aria-hidden className="pointer-events-none absolute inset-x-7 bottom-7 top-21 border border-white/70" />

      {/* big white type behind everything */}
      <div aria-hidden className="absolute inset-x-0 top-[150px] text-center font-serif text-[clamp(110px,15vw,230px)] uppercase italic leading-[0.82] text-white/80">
        <motion.span className="block" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>Somewhere</motion.span>
        <motion.span className="block" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.15 }}>Between</motion.span>
      </div>

      {/* 8 draggable tiles: they spring back when you let go */}
      {tiles.map((t, i) => (
        // outer box = position + small mouse parallax by depth
        <div
          key={t.id}
          className="absolute transition-transform duration-500 ease-out"
          style={{ left: `${t.x}%`, top: t.y, zIndex: t.z, transform: `translate(${m.x * t.z * 6}px, ${m.y * t.z * 5}px)` }}
        >
        <motion.a
          href="#work"
          aria-label={`${t.id} ${t.name}, drag me or click to see work`}
          draggable={false}
          drag
          dragSnapToOrigin
          dragElastic={0.6}
          onDragStart={() => (dragged.current = true)}
          onPointerDown={() => (dragged.current = false)}
          onClick={(e) => { if (dragged.current) e.preventDefault(); }}
          whileDrag={{ scale: 1.06, zIndex: 20 }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.08 }}
          className="relative block cursor-grab touch-none select-none overflow-hidden rounded-md shadow-[0_18px_40px_rgba(60,40,60,0.22)]"
          style={{ width: t.w, height: t.w * 1.25, rotate: t.r }}
        >
          <div className="bob flex h-full w-full flex-col justify-between p-2.5" style={{ background: t.bg, animationDelay: `${-i * 0.9}s` }}>
            {t.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <>
                <span className="mono">{t.id}</span>
                <span className="text-xs font-medium">{t.name}</span>
              </>
            )}
          </div>
        </motion.a>
        </div>
      ))}

      {/* chrome name, centered, tilts toward the mouse */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[5] w-[min(980px,76vw)] -translate-x-1/2 -translate-y-[46%] [perspective:900px]">
        <motion.img
          src="/img/wordmark.webp"
          alt="Sydney Tran"
          className="block h-auto w-full drop-shadow-[0_24px_28px_rgba(60,40,60,0.35)]"
          animate={{ rotateX: m.y * -8, rotateY: m.x * 10 }}
          transition={{ type: "tween", duration: 0.2 }}
        />
      </div>

      {/* lines under the name */}
      <div className="pointer-events-none absolute inset-x-0 bottom-16 z-[6] flex flex-col items-center gap-2.5 text-center">
        <p className="font-serif text-[34px] italic">Product designer who builds.</p>
        <p className="mono">Computer Science + Advertising / Champaign, IL</p>
        <p className="mono mt-1.5 inline-flex items-center gap-2 rounded-full bg-paper/70 px-3.5 py-1.5">
          <span className="h-[7px] w-[7px] rounded-full bg-[#D2374E]" />
          {info.status}
        </p>
      </div>
      <p className="mono absolute bottom-12 left-12 z-[6]">{info.place}</p>
      <a href="#about" className="mono absolute bottom-10 right-12 z-[6] inline-flex min-h-11 items-center">Scroll to explore ↓</a>
      <p className="mono absolute left-12 top-[100px] z-[6]">01 / The Sky</p>
      <p className="mono absolute right-12 top-[100px] z-[6]">40.11° N, 88.24° W</p>
    </section>
  );
}
