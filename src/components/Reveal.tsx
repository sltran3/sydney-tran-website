"use client";

import { motion, useReducedMotion } from "motion/react";

// section transitions: content drifts up from below and comes into focus as it scrolls into view (once).
// same feel as the opening animation. `as` keeps lists and headings semantic.
// (the big section titles use TitleRise instead, which is tied to scroll in both directions)
const tags = { div: motion.div, li: motion.li, h2: motion.h2, p: motion.p } as const;

export default function Reveal({
  children,
  as = "div",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  as?: keyof typeof tags;
  delay?: number;
  className?: string;
}) {
  const calm = useReducedMotion();
  const Tag = tags[as];
  return (
    <Tag
      className={className}
      initial={calm ? false : { opacity: 0, y: 40, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </Tag>
  );
}
