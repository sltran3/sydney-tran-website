"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { altitude } from "@/content/site";
import SketchStory from "@/components/SketchStory";

const N = altitude.length;
const stopsAt = altitude.map((_, k) => k / (N - 1)); // scroll progress where each stop is centred

// About: climb through the story. the view stays pinned while you scroll; the altitude counts up,
// but everything on screen moves the same way your scroll does (sky and clouds drift up, the dot travels down),
// so it still feels like scrolling a page. each supporting line sits directly below its headline.
export default function Altitude() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });
  // entering: from the section's top reaching the bottom of the screen until it pins at the top
  const { scrollYProgress: enter } = useScroll({ target: track, offset: ["start end", "start start"] });
  const lineIn = useTransform(enter, [0.5, 0.95], [0, 1]); // the sky line fades in as you scroll down into it
  const lineY = useTransform(enter, [0.5, 0.95], [40, 0]);
  const lineBlur = useTransform(enter, [0.5, 0.95], ["blur(10px)", "blur(0px)"]);
  const [i, setI] = useState(0);
  useMotionValueEvent(p, "change", (v) => setI(Math.min(N - 1, Math.max(0, Math.round(v * (N - 1))))));

  // the climb, moving with the scroll
  const skyY = useTransform(p, [0, 1], ["0%", "-33.333%"]); // sky layer is 1.5 screens tall; drifts up half a screen
  const cloudsY = useTransform(p, [0, 1], ["30%", "-120%"]); // clouds pass up and out of view as you rise through them
  const ground = useTransform(p, [0, 0.35], [1, 0]); // warm haze near the ground fades as you leave it
  const feet = useTransform(p, stopsAt, altitude.map((a) => a.alt));
  const readout = useTransform(feet, (v) => (Math.round(v / 100) * 100).toLocaleString("en-US"));
  const needle = useTransform(p, [0, 1], ["0%", "100%"]); // travels down with the scroll

  const s = altitude[i];
  const screenLine = (
    <span className="inline-flex items-baseline gap-2.5 max-w-full text-[clamp(15px,1.7vw,22px)] font-medium">
      <span aria-hidden className="text-mauve">›</span>
      <motion.span
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        {s.screen}
      </motion.span>
      <span aria-hidden className="caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.15em] bg-ink" />
    </span>
  );

  return (
    // tucks 200px up under the hero, whose bottom edge fades out over it: one continuous sky, no seam
    <section id="about" aria-label="About" className="relative z-0 -mt-[200px]">
      <h2 className="sr-only">About</h2>
      <div ref={track} className="relative" style={{ height: `${N * 65}svh` }}>
        <div className="sticky top-0 h-svh min-h-[560px] overflow-hidden bg-lilac">
          {/* the sky, full height, drifting up as you scroll */}
          <motion.div aria-hidden className="absolute inset-x-0 top-0 h-[150%] bg-[url(/img/sky.webp)] bg-cover bg-center" style={{ y: skyY }}>
            {/* same soft cloud wash as the hero, so both skies share one tone */}
            <div className="absolute inset-0 bg-[url(/img/clouds.webp)] bg-cover bg-center opacity-35 mix-blend-screen" />
            <motion.div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-[#F6D8CF]" style={{ opacity: ground }} />
          </motion.div>

          {/* clouds you rise through */}
          <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]" style={{ y: cloudsY }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/cloud.webp" alt="" className="absolute bottom-0 left-[-6%] w-[min(760px,62vw)] opacity-80 blur-[2px]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/cloud.webp" alt="" className="absolute bottom-[-8%] right-[-8%] w-[min(900px,70vw)] -scale-x-100 opacity-90 blur-[1px]" />
          </motion.div>

          {/* the sky line */}
          <motion.div className="absolute inset-x-0 top-[36%] z-10 px-6 text-center" style={{ opacity: lineIn, y: lineY, filter: lineBlur }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -24, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <p className="mx-auto max-w-[24ch] font-serif text-[clamp(38px,5.6vw,92px)] italic leading-[0.98] tracking-tight">
                  {s.sky}
                </p>
                <div className="mt-5">{screenLine}</div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* frosted glass over the lower sky, feathered at the top so there's no hard edge */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[28%] bg-[rgba(248,245,241,0.38)] backdrop-blur-2xl [mask-image:linear-gradient(to_bottom,transparent,black_38%)]" />

          {/* altimeter: the number climbs while the dot moves down with your scroll */}
          <div aria-hidden className="absolute bottom-[12%] right-4 top-[14%] z-20 flex w-24 flex-col items-end sm:right-8">
            <p className="label mb-3 text-right tabular-nums">
              <motion.span>{readout}</motion.span> ft
            </p>
            {/* the ruler; on phones only the readout shows */}
            <div className="relative flex-1 border-r border-ink/30 max-sm:hidden">
              {altitude.map((a, k) => (
                <span key={a.label} className="absolute right-0 h-px w-3 bg-ink/40" style={{ top: `${stopsAt[k] * 100}%` }} />
              ))}
              <motion.span className="absolute -right-[5px] h-[9px] w-[9px] -translate-y-1/2 rounded-full bg-ink" style={{ top: needle }} />
            </div>
          </div>

          {/* screen-reader version of the whole climb */}
          <ol className="sr-only">
            {altitude.map((a) => <li key={a.alt}>{a.sky} {a.screen}.</li>)}
          </ol>
        </div>
      </div>

      {/* the full story, always open: the hand-drawn sketch draws itself as you scroll, then the paragraphs below it */}
      <div className="bg-paper">
        <div className="mx-auto max-w-[1280px]">
          <SketchStory />
        </div>
      </div>
    </section>
  );
}
