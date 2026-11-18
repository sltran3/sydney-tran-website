"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { Decision } from "@/content/site";

// one decision with a Design / Build switch
export default function DecisionView({ d, blankImages = false }: {
  d: Omit<Decision, "design" | "build" | "dropped"> & { design: ReactNode; build: ReactNode; dropped?: string };
  blankImages?: boolean;
}) {
  const [view, setView] = useState<"design" | "build">("design");
  const isD = view === "design";
  const img = isD ? d.designImg : d.buildImg;

  return (
    <article className="grid gap-8 border-t border-ink/20 py-14 md:grid-cols-12">
      <div className="md:col-span-5">
        <h2 className="mb-5 font-serif text-5xl leading-none">{d.title}</h2>

        {/* the switch */}
        <div role="group" aria-label="Choose view" className="inline-flex gap-1 rounded-full bg-[#ECE5E2] p-1">
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

        <div className="mt-6 leading-relaxed">
          <p className="label mb-2">{isD ? "What I chose and why" : "How I built it"}</p>
          <div className="mb-3.5 space-y-4 whitespace-pre-line">{isD ? d.design : d.build}</div>
          {isD && d.dropped && <p className="text-[#5B4A50]"><span className="label">Dropped: </span>{d.dropped}</p>}
        </div>
      </div>

      {/* same size box for both views, so nothing jumps */}
      <div className="md:col-span-7">
        <div className={`flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[10px] transition-colors ${isD ? "bg-pink" : "bg-ink text-paper"}`}>
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={`${d.title}, ${view} view`} className="h-full w-full object-cover" />
          ) : !blankImages && (
            <span className="label">{isD ? "[ Figma frame ]" : "[ Code snippet / screen recording ]"}</span>
          )}
        </div>
      </div>
    </article>
  );
}
