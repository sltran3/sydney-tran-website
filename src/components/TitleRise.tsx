"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

// a big title whose pieces (letters or words) rise out of a hidden edge one after another as it scrolls in,
// then lift up out of view as you keep scrolling down. everything is tied to scroll position, so scrolling back
// up plays it all in reverse. the scroll is smoothed with a spring, so the motion glides rather than ticking.
export type Piece = { t: string; italic?: boolean };

const STAGGER = 0.12; // how far behind each piece runs on the way in (share of the move)
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp = (x: number) => Math.min(1, Math.max(0, x));

// share of piece i's rise-in that's done, given the overall progress v (0-1)
const inShare = (v: number, i: number, n: number) => easeOut(clamp((v - i * STAGGER) / (1 - STAGGER * (n - 1))));

function PieceSpan({ piece, i, n, enter, leave, together, calm }: {
  piece: Piece; i: number; n: number; enter: MotionValue<number>; leave: MotionValue<number>; together: boolean; calm: boolean | null;
}) {
  // 110% below the edge → in place → 110% above the edge
  const y = useTransform([enter, leave], ([e, l]: number[]) => {
    const out = together ? easeInOut(clamp(l)) : inShare(l, i, n);
    return `${110 * (1 - inShare(e, i, n)) - 110 * out}%`;
  });
  return (
    // the hidden edge: clipped above and below only (never at the sides), so wide or italic letters keep their shape
    <span className="inline-block align-bottom" style={{ clipPath: "inset(-0.05em -1em -0.16em -1em)" }}>
      <motion.span className={`inline-block ${piece.italic ? "italic" : ""}`} style={{ y: calm ? 0 : y }}>
        {piece.t}
      </motion.span>
    </span>
  );
}

export default function TitleRise({
  pieces,
  label,
  className,
  rowClassName,
  onIn,
  together = false,
  lift = false,
  leaveOffset = ["start 0.12", "end start"],
}: {
  pieces: Piece[];
  label: string; // what screen readers hear
  className?: string;
  rowClassName?: string; // layout of the row of pieces (spacing, alignment, size)
  onIn?: (fullyIn: boolean) => void; // called whenever the rise-in finishes or un-finishes
  together?: boolean; // lift out as one word instead of piece by piece
  lift?: boolean; // the whole title also rises up from lower down and fades in as it scrolls in
  leaveOffset?: [string, string]; // when the lift-out starts and ends (longer = slower)
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const calm = useReducedMotion();
  // rise in: from the title's top entering the bottom of the screen until it's 40% of the way down
  const { scrollYProgress: enterRaw } = useScroll({ target: ref, offset: ["start end", "start 0.4"] });
  // lift out: by default from the title's top reaching 12% of the way down until its bottom leaves the top
  const { scrollYProgress: leaveRaw } = useScroll({ target: ref, offset: leaveOffset as never });
  // smoothing: the motion follows the scroll with a soft spring instead of tracking it exactly
  const smooth = { stiffness: 90, damping: 24, mass: 0.6 };
  const enter = useSpring(enterRaw, smooth);
  const leave = useSpring(leaveRaw, smooth);

  // the whole title rising up into place (only with `lift`)
  const liftY = useTransform(enter, (v) => `${(1 - easeOut(clamp(v))) * 0.8}em`);
  const liftO = useTransform(enter, (v) => easeOut(clamp(v * 1.4)));

  // report when the rise-in is done (from the raw scroll, so it's not delayed by the smoothing)
  const inRef = useRef(false);
  const check = (v: number) => {
    const now = !!calm || v >= 0.999;
    if (now !== inRef.current) { inRef.current = now; onIn?.(now); }
  };
  useMotionValueEvent(enterRaw, "change", check);
  // if the page loads with the title already on screen, there may be no "change" yet
  useEffect(() => { check(enterRaw.get()); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.h2 ref={ref} aria-label={label} className={className} style={lift && !calm ? { y: liftY, opacity: liftO } : undefined}>
      <span aria-hidden className={rowClassName}>
        {pieces.map((p, i) => (
          <PieceSpan key={i} piece={p} i={i} n={pieces.length} enter={enter} leave={leave} together={together} calm={calm} />
        ))}
      </span>
    </motion.h2>
  );
}
