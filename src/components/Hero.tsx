"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import Logo3D from "@/components/Logo3D";

const KEY = "sky-intro"; // sessionStorage flag: the intro plays once per visit
const RISE = 3.8; // seconds to climb from the bottom of the sky to the main sky
const ease = [0.65, 0, 0.25, 1] as const;

// pop-in for everything that appears after the rise; `at` is seconds after the rise ends
const pop = (at: number, extra: Transition = {}): Transition => ({ delay: RISE + at, duration: 1.1, ease: [0.2, 0.7, 0.2, 1], ...extra });
const hidden = { opacity: 0, y: 36, filter: "blur(10px)" };
const shown = { opacity: 1, y: 0, filter: "blur(0px)" };

// drifting clouds. top = % down the hero, w = px width, dur = seconds to cross the screen,
// at = where in its trip it starts (0 to 1), rest = spot if motion is reduced
type Cloud = { top: number; w: number; dur: number; at: number; swell: number; flip?: boolean; o: number; blur?: number; rest: number };
// low band only: big, soft, see-through, very slow. they sit at the bottom and fade upward
const low: Cloud[] = [
  { top: 62, w: 900, dur: 420, at: 0.1, swell: 26, o: 0.55, blur: 3, rest: -10 },
  { top: 70, w: 760, dur: 480, at: 0.55, swell: 30, flip: true, o: 0.5, blur: 3, rest: 55 },
  { top: 76, w: 1000, dur: 380, at: 0.8, swell: 24, o: 0.6, blur: 2, rest: 20 },
];

// one depth of clouds; during the intro they sink into view as the camera climbs past
function CloudLayer({ clouds, z, shift, init }: { clouds: Cloud[]; z: number; shift: { x: number; y: number }; init: false | "start" }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_top,black_20%,transparent_55%)]"
      style={{ zIndex: z }}
      initial={init && { y: -260 - z * 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: RISE * 0.35, duration: RISE * 0.75, ease: [0.3, 0.6, 0.3, 1] }}
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-out" style={{ transform: `translate(${shift.x}px, ${shift.y}px)` }}>
        {clouds.map((c, i) => (
          <div
            key={i}
            className="cloud"
            style={{
              top: `${c.top}%`,
              width: c.w,
              opacity: c.o,
              filter: c.blur ? `blur(${c.blur}px)` : undefined,
              ["--dur" as string]: `${c.dur}s`,
              ["--delay" as string]: `${-c.dur * c.at}s`,
              ["--swell" as string]: `${c.swell}s`,
              ["--rest" as string]: `${c.rest}vw`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/cloud.webp" alt="" style={c.flip ? { scale: "-1 1" } : undefined} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// The Sky: opening screen
export default function Hero() {
  const [m, setM] = useState({ x: 0, y: 0 }); // mouse position, -0.5 to 0.5
  const calm = useReducedMotion();
  // "pending" until we know whether to play the intro; matches the server render
  const [mode, setMode] = useState<"pending" | "intro" | "skip">("pending");

  // runs before the first paint, so a skipped intro never flashes its start frame
  const decided = useRef<"intro" | "skip" | null>(null); // survives React's dev double-run of effects
  useLayoutEffect(() => {
    if (!decided.current) {
      let seen = false;
      try {
        seen = !!sessionStorage.getItem(KEY);
        sessionStorage.setItem(KEY, "1");
      } catch {}
      document.documentElement.setAttribute("data-sky", "seen");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      decided.current = seen || reduce ? "skip" : "intro";
    }
    // sessionStorage only exists in the browser, so this is decided here, before paint
    setMode(decided.current);
  }, []);

  function onMove(e: React.MouseEvent<HTMLElement>) {
    if (calm) return;
    const r = e.currentTarget.getBoundingClientRect();
    setM({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  }

  // the logo turns toward the mouse (degrees)
  const tilt = { x: m.y * -8, y: m.x * 10 };

  // skip = render straight at the end state; otherwise start at the bottom of the sky
  const init = mode === "skip" ? false : "start";

  return (
    <section
      id="top"
      onMouseMove={onMove}
      data-ready={mode === "pending" ? undefined : ""}
      // the bottom 200px fades out over the about section's sky (which slides up underneath), so the two skies melt together
      className="relative z-[1] h-[960px] overflow-hidden bg-lilac [mask-image:linear-gradient(to_bottom,black_calc(100%-200px),transparent)]"
    >
      {/* key remounts everything once the mode is known, so `initial` is read fresh */}
      <div key={mode} className="absolute inset-0">
        {/* the sky stage: 2.5 screens tall. main sky on top, lower sky below.
            it slides down 60% (1.5 screens), so the view climbs from the bottom up */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 top-[-150%] h-[250%]"
          initial={init}
          animate="end"
          variants={{ start: { y: "0%" }, end: { y: "60%" } }}
          transition={{ duration: RISE, ease }}
        >
          {/* lower sky: tall cloud strip, warm haze near the horizon */}
          <div className="absolute inset-x-0 bottom-0 top-[20%] bg-[url(/img/clouds.webp)] bg-cover bg-top" />
          <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-[#F6D8CF] via-[#F2D0D5]/70 to-transparent" />
          {/* main sky, fading into the lower sky at its bottom edge */}
          <div className="absolute inset-x-0 top-0 h-[40%] bg-[url(/img/sky.webp)] bg-cover bg-center [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
            {/* soft screen-blended cloud wash: keeps the sky light and airy */}
            <div className="absolute inset-0 bg-[url(/img/clouds.webp)] bg-cover bg-center opacity-35 mix-blend-screen" />
          </div>
        </motion.div>

        {/* near clouds: rush past faster than the sky, then thin out */}
        {mode !== "skip" && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-[-10%] top-[-200%] z-[8] h-[300%] bg-[url(/img/clouds.webp)] bg-[length:120%_auto] bg-repeat-y opacity-60 mix-blend-screen blur-[6px]"
            initial={{ y: "0%", opacity: 0.75 }}
            animate={{ y: "66.7%", opacity: 0 }}
            transition={{ duration: RISE * 1.05, ease }}
          />
        )}


        {/* low clouds: a quiet band along the bottom that melts into the sky */}
        <CloudLayer clouds={low} z={1} shift={{ x: m.x * 8, y: m.y * 4 }} init={init} />

        {/* the big white type and the chrome name are placed together, so the name always just grazes the bottom
            of "Portfolio", whatever the screen size. (no z-index on this wrapper: the type and the name still layer
            between the cloud bands on their own) */}
        <div className="absolute inset-x-0 top-[24svh] sm:top-[150px]">
          {/* big white type behind everything */}
          <div aria-hidden className="relative z-[2] text-center font-bodoni text-[clamp(52px,15vw,230px)] uppercase italic leading-[0.82] text-white/80">
            <motion.span className="block" initial={init && hidden} animate={shown} transition={pop(-0.15)}>Digital</motion.span>
            <motion.span className="block" initial={init && hidden} animate={shown} transition={pop(0)}>Portfolio</motion.span>
          </div>

          {/* chrome name, just under the type: its tallest letters barely dip into the bottom of "Portfolio" */}
          <div className="pointer-events-none absolute left-1/2 top-full z-[5] w-[92vw] -translate-x-1/2 -translate-y-[2%] sm:-translate-y-[12%] lg:-translate-y-[24%] sm:w-[min(980px,76vw)]">
            {/* floating in the wind: a slow drift, and a sway on a different rhythm so it never feels looped */}
            <div className="logo-float">
              <div className="logo-sway">
                {/* the 3D chrome name: poofs in when it's ready (after the sky climb on a first visit), turns toward
                    the mouse, and a real light follows the cursor while hovered */}
                <Logo3D tilt={tilt} appearAt={mode === "intro" ? RISE + 0.2 : 0} />
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-[130px] z-[6] flex flex-col items-center gap-2.5 text-center max-sm:bottom-auto max-sm:top-[calc(100svh-190px)]">
          <a
            href="#about"
            aria-label="Scroll to about"
            className="pointer-events-auto mt-5 flex flex-col items-center gap-2 rounded-full px-2 pb-2 text-mauve"
          >
            <span className="label">Scroll</span>
            <span aria-hidden className="scroll-cue relative block h-5 w-4">
              <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-current" />
              <span className="absolute bottom-px left-1/2 size-2 -translate-x-1/2 rotate-45 border-b border-r border-current" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
