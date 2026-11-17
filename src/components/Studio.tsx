import { about, skills } from "@/content/site";

// 02 / The Studio: about + skill marquee
export default function Studio() {
  return (
    <section id="about" className="bg-paper px-12 pb-16 pt-36">
      <div className="mx-auto max-w-[1280px]">
        <p className="mono mb-6 text-mauve">02 / The Studio</p>
        <h2 className="mb-14 font-serif text-[clamp(48px,6vw,88px)] leading-none tracking-tight">
          A designer who loves <em>building things.</em>
        </h2>
        <div className="grid gap-10 text-[17px] leading-relaxed md:grid-cols-3">
          {about.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
        </div>
      </div>

      {/* marquee pauses on hover. first copy is readable, second is just for the loop */}
      <div className="marq mt-24 overflow-hidden whitespace-nowrap border-y border-ink/20 py-5">
        <div className="track inline-flex items-center gap-11 font-serif text-[42px] italic">
          {[0, 1].map((copy) =>
            skills.map((s) => (
              <span key={copy + s} aria-hidden={copy === 1} className="inline-flex items-center gap-11">
                {s}<span className="mono not-italic" aria-hidden>✦</span>
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
