"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Decision } from "@/content/site";

// one decision with a Design / Build switch. click the picture to open it large: it grows out of its spot over a
// blurred backdrop, and Esc or a click anywhere sends it back
export default function DecisionView({ d, blankImages = false }: {
  d: Omit<Decision, "design" | "build" | "dropped"> & { design: ReactNode; build: ReactNode; dropped?: string };
  blankImages?: boolean;
}) {
  const [view, setView] = useState<"design" | "build">("design");
  const isD = view === "design";
  const img = isD ? d.designImg : d.buildImg;
  const [open, setOpen] = useState(false);
  const shared = useId(); // ties the small picture to the large one, so it can grow out of its spot
  const calm = useReducedMotion();
  const grow = calm ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 30 };
  const alt = `${d.title}, ${view} view`;

  return (
    // phones: one column of title → picture → switch → text (the left column's pieces join the article's grid via
    // `contents` so the picture can sit between them). wider screens: text column on the left, picture on the right
    <article className="grid gap-5 border-t border-ink/20 py-14 md:grid-cols-12 md:gap-8">
      <div className="contents md:col-span-5 md:block">
        <h2 className="font-serif text-5xl leading-none md:mb-5">{d.title}</h2>

        {/* the switch */}
        <div role="group" aria-label="Choose view" className="order-3 inline-flex w-fit gap-1 rounded-full bg-[#ECE5E2] p-1 md:order-none">
          {(["design", "build"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`label min-h-10 rounded-full px-4 transition-colors ${view === v ? "bg-ink text-paper" : ""}`}
            >
              {v} view
            </button>
          ))}
        </div>

        <div className="order-4 leading-relaxed md:order-none md:mt-6">
          <p className="label mb-2">{isD ? "What I chose and why" : "How I built it"}</p>
          <div className="mb-3.5 space-y-4 whitespace-pre-line">{isD ? d.design : d.build}</div>
          {isD && d.dropped && <p className="text-[#5B4A50]"><span className="label">Dropped: </span>{d.dropped}</p>}
        </div>
      </div>

      {/* same size box for both views, so nothing jumps */}
      <div className="order-2 md:order-none md:col-span-7">
        <div className={`flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[10px] transition-colors ${isD ? "bg-pink" : "bg-ink text-paper"}`}>
          {img ? (
            <button type="button" onClick={() => setOpen(true)} aria-label={`Open larger: ${alt}`} className="h-full w-full cursor-zoom-in">
              {!open && (
                <motion.img layoutId={shared} transition={grow} src={img} alt={alt} draggable={false} className="h-full w-full rounded-[10px] object-cover transition-[filter] duration-300 hover:brightness-[1.03]" />
              )}
            </button>
          ) : !blankImages && (
            <span className="label">{isD ? "[ Figma frame ]" : "[ Code snippet / screen recording ]"}</span>
          )}
        </div>
      </div>

      {img && <Lightbox open={open} onClose={() => setOpen(false)} src={img} alt={alt} shared={shared} grow={grow} calm={!!calm} />}
    </article>
  );
}

const noop = () => () => {};

function Lightbox({ open, onClose, src, alt, shared, grow, calm }: {
  open: boolean; onClose: () => void; src: string; alt: string; shared: string; grow: object; calm: boolean;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  // false on the server and during hydration, true after: the portal needs document.body
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  // while open: Esc closes, the page underneath doesn't scroll, and focus moves into it (then back afterwards)
  useEffect(() => {
    if (!open) return;
    const before = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    dialog.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
      before?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={`${alt}. Press Escape or click to close`}
          tabIndex={-1}
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center p-4 outline-none sm:p-10"
          onClick={onClose}
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-[rgba(36,24,30,0.62)] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: calm ? 0 : 0.3 }}
          />
          <motion.img
            layoutId={shared}
            transition={grow}
            src={src}
            alt={alt}
            draggable={false}
            className="relative max-h-full w-auto max-w-full rounded-[14px] object-contain shadow-[0_30px_80px_rgba(20,10,16,0.45)]"
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
