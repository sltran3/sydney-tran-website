"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { tech } from "@/content/site";
import Reveal from "@/components/Reveal";

function TechRow({ group, items }: (typeof tech)[number]) {
  const row = useRef<HTMLLIElement>(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: row,
    offset: ["start end", "end start"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [60, 0, 0, 60]);

  return (
    <li ref={row} className="group border-t border-ink/20">
      <motion.div
        style={calm ? undefined : { transformPerspective: 800, rotateX }}
        className="grid origin-top items-baseline gap-3 py-6 sm:py-8 md:grid-cols-[1fr_1.4fr]"
      >
        <h3 className="font-news text-[clamp(32px,5vw,40px)] leading-none transition-colors group-hover:text-[#854562]">
          {group}
        </h3>
        <p className="text-[15px] leading-relaxed text-[#5B4A50] transition-colors group-hover:font-bold group-hover:text-[#854562]">
          {items.join(" · ")}
        </p>
      </motion.div>
    </li>
  );
}

export default function Tech() {
  return (
    <section id="tech" className="overflow-x-clip bg-paper px-6 py-20 sm:px-12 sm:py-28">
      <div className="mx-auto max-w-[1280px]">
        <Reveal as="h2" className="mb-12 font-news text-[clamp(48px,6vw,88px)] leading-none">My <em>Toolkit</em></Reveal>
        <ul>
          {tech.map((t) => (
            <TechRow key={t.group} {...t} />
          ))}
        </ul>
        <div className="border-t border-ink/20" />
      </div>
    </section>
  );
}
