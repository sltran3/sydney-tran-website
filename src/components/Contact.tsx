"use client";

import { motion, useReducedMotion } from "motion/react";
import { info } from "@/content/site";
import Reveal from "@/components/Reveal";

// Say Hello: back to the pink sky
export default function Contact() {
  const calm = useReducedMotion();

  return (
    <footer id="contact" className="relative overflow-hidden bg-lilac bg-[url(/img/sky.webp)] bg-cover bg-center px-6 pb-10 pt-28 text-center sm:px-12 sm:pt-40">
      {/* soft cloud wash, one stretched copy (a repeating tile left visible seams) */}
      <div aria-hidden className="absolute inset-0 bg-[url(/img/clouds.webp)] bg-cover bg-center opacity-30 mix-blend-screen" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#EDE6EF] to-transparent to-30%" />
      <div className="relative mx-auto max-w-[1280px]">
        <motion.h2
          initial={calm ? false : "waiting"}
          animate={calm ? "visible" : "waiting"}
          whileInView="visible"
          viewport={{ amount: 0.5 }}
          className="font-serif text-[clamp(64px,9vw,140px)] leading-[0.95] tracking-tight"
        >
          <motion.span
            variants={{ waiting: { y: "0.35em", rotate: -8, opacity: 0 }, visible: { y: "0em", rotate: 0, opacity: 1 } }}
            transition={{ type: "spring", duration: 0.75, bounce: 0.3 }}
            className="inline-block"
          >
            Say
          </motion.span>{" "}
          <motion.em
            variants={{ waiting: { y: "0.5em", rotate: 12, opacity: 0 }, visible: { y: "0em", rotate: 0, opacity: 1 } }}
            transition={{ type: "spring", duration: 0.85, bounce: 0.45, delay: 0.14 }}
            className="inline-block origin-bottom-left"
          >
            hi.
          </motion.em>
        </motion.h2>
        <Reveal delay={0.15}>
          <a href={`mailto:${info.email}`} className="mt-11 inline-flex min-h-[60px] items-center rounded-full bg-ink px-9 text-lg font-medium text-paper hover:text-paper">
            {info.email} ↗
          </a>
        </Reveal>
        <Reveal delay={0.25} className="label mt-6 flex flex-wrap justify-center gap-7">
          <a href={info.linkedin} className="inline-flex min-h-11 items-center hover:font-bold focus-visible:font-bold">LinkedIn</a>
          <a href={info.github} className="inline-flex min-h-11 items-center hover:font-bold focus-visible:font-bold">GitHub</a>
        </Reveal>
        <div className="label mt-16 flex flex-wrap justify-between gap-3">
          <span>© 2026 Sydney Tran</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
