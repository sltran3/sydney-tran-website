"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

// the playground: an endless wall of pieces you drag around (it repeats in every direction), with momentum when
// you let go, and a frosted fade at the screen edges. left alone it drifts slowly diagonally; after a drag or a
// fling it eases back into that drift. trackpad / mouse wheel and arrow keys pan it too.
// inspired by ruthgriffioen.art's home page, in this site's colours and type.

const CARD_W = 300; // tile size (square, like the glass tile)
const CARD_H = 300;
const GAP_X = 56;
const GAP_Y = 72; // a little more room below for the hover caption
const CELL_W = CARD_W + GAP_X;
const CELL_H = CARD_H + GAP_Y;
const FRICTION = 0.94; // momentum after letting go (closer to 1 = glides further)
const DRIFT = { x: -0.32, y: -0.22 }; // px per frame: the wall slowly drifts diagonally (up and to the left) on its own

const mod = (a: number, n: number) => ((a % n) + n) % n;

export default function PlayField() {
  const calm = useReducedMotion();
  const field = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });

  // enough slots to cover the screen plus a margin on every side; they wrap around as you pan
  useEffect(() => {
    const el = field.current;
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      // always an even number of columns: every other column sits half a tile lower, so with an odd count the two
      // columns meeting where the wall repeats would both be unshifted and the diagonal pattern would break there
      const cols = Math.ceil(r.width / CELL_W) + 2;
      setGrid({ cols: cols % 2 ? cols + 1 : cols, rows: Math.ceil(r.height / CELL_H) + 3 });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = field.current;
    if (!el || !grid.cols) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const spanX = grid.cols * CELL_W, spanY = grid.rows * CELL_H;
    // start with the wall centred so pieces sit evenly around the title
    const off = { x: (el.clientWidth - spanX) / 2 + CELL_W, y: (el.clientHeight - spanY) / 2 + CELL_H, vx: 0, vy: 0 };
    const drag = { on: false, x: 0, y: 0, t: 0 };

    // place every slot: wrap it around the field so the wall never ends; odd columns sit half a card lower
    const place = () => {
      tiles.current.forEach((t, i) => {
        if (!t) return;
        const c = i % grid.cols, r = Math.floor(i / grid.cols);
        const x = mod(c * CELL_W + off.x, spanX) - CELL_W;
        const y = mod(r * CELL_H + off.y + (c % 2 ? CELL_H / 2 : 0), spanY) - CELL_H;
        t.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };

    // no drift for reduced motion
    const drift = calm ? { x: 0, y: 0 } : DRIFT;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const k = Math.min((now - last) / 16.67, 3); // frames elapsed, so the speed is the same on any refresh rate
      last = now;
      if (!drag.on && !document.hidden) {
        // a fling's momentum dies away toward the steady drift instead of toward a stop
        const f = Math.pow(FRICTION, k);
        off.vx = drift.x + (off.vx - drift.x) * f;
        off.vy = drift.y + (off.vy - drift.y) * f;
        if (Math.abs(off.vx) > 0.01 || Math.abs(off.vy) > 0.01) {
          off.x += off.vx * k; off.y += off.vy * k;
          place();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    place();
    raf = requestAnimationFrame(tick);

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drag.on = true; drag.x = e.clientX; drag.y = e.clientY; drag.t = performance.now();
      off.vx = off.vy = 0;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.on) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      const now = performance.now(), dt = Math.max(1, now - drag.t);
      off.x += dx; off.y += dy;
      // remember the speed (per 16ms frame) for the glide after letting go
      off.vx = (dx / dt) * 16; off.vy = (dy / dt) * 16;
      drag.x = e.clientX; drag.y = e.clientY; drag.t = now;
      place();
    };
    const onUp = () => {
      drag.on = false;
      el.style.cursor = "";
      if (calm || performance.now() - drag.t > 80) { off.vx = off.vy = 0; } // held still before letting go: no glide
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      off.vx = off.vy = 0;
      off.x -= e.deltaX; off.y -= e.deltaY;
      place();
    };
    const onKey = (e: KeyboardEvent) => {
      const step = 120;
      const k: Record<string, [number, number]> = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
      if (!k[e.key]) return;
      e.preventDefault();
      off.vx = calm ? 0 : k[e.key][0] * 0.12; off.vy = calm ? 0 : k[e.key][1] * 0.12;
      if (calm) { off.x += k[e.key][0]; off.y += k[e.key][1]; place(); }
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [grid]);

  const slots = grid.cols * grid.rows;

  return (
    <div
      ref={field}
      className="relative h-svh w-full cursor-grab touch-none select-none overflow-hidden bg-[radial-gradient(120%_90%_at_50%_45%,#F8F5F1_0%,#EDE6EF_60%,#E2D6E4_100%)]"
      aria-label="My playground: drag to explore"
    >
      {/* the wall: every slot is the same glass tile for now, until the pieces are ready */}
      {Array.from({ length: slots }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { tiles.current[i] = el; }}
          aria-hidden
          className="group absolute left-0 top-0 will-change-transform"
          style={{ width: CARD_W }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/play-tile.webp"
            alt=""
            draggable={false}
            className="aspect-square w-full transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.03]"
          />
          <p className="label mt-1 text-center text-mauve opacity-0 transition-opacity duration-300 group-hover:opacity-100">Coming soon</p>
        </div>
      ))}

      {/* frosted fade around the screen edges */}
      <div aria-hidden className="pointer-events-none absolute inset-0 backdrop-blur-md [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,transparent_55%,black_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_70%_at_50%_50%,transparent_55%,rgba(248,245,241,0.85)_100%)]" />

      {/* title floating over the wall */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        {/* white + difference blend = inverted colours: near-black over the cream, the card's inverse over a card */}
        <h1 aria-label="My playground." className="font-serif text-[clamp(56px,9vw,140px)] leading-[0.95] tracking-tight text-white mix-blend-difference">
          {["My", "playground."].map((word, wordIndex) => (
            <span key={word} aria-hidden="true">
              {wordIndex > 0 && " "}
              <span className={wordIndex === 1 ? "inline-block italic" : "inline-block"}>
                {Array.from(word, (letter, i) => (
                  <motion.span
                    key={i}
                    className="inline-block origin-bottom"
                    initial={calm ? false : { opacity: 0, y: "0.24em", scale: 0.65 }}
                    animate={{ opacity: 1, y: "0em", scale: 1 }}
                    transition={{ type: "spring", duration: 0.55, bounce: 0.48, delay: ([0, 2][wordIndex] + i) * 0.035 }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </span>
          ))}
        </h1>
        <p className="label mt-4 py-1.5 text-mauve">Coming soon</p>
      </div>

    </div>
  );
}
