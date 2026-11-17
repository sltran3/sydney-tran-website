import Link from "next/link";
import { features, tools } from "@/content/site";

// shows the image if there is one, otherwise a labeled placeholder
function Pic({ img, label, ratio, bg }: { img: string; label: string; ratio: string; bg: string }) {
  return (
    <div className="relative overflow-hidden rounded-[10px] transition-transform duration-500 group-hover:scale-[1.015]" style={{ aspectRatio: ratio, background: bg }}>
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt={label} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center"><span className="mono">[ {label} ]</span></div>
      )}
    </div>
  );
}

// 03 / Selected Work
export default function Work() {
  return (
    <section id="work">
      <div className="bg-paper px-12 pb-10 pt-28">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mono mb-5 text-mauve">03 / Selected Work</p>
            <h2 className="font-serif text-[clamp(56px,7vw,110px)] leading-[0.95] tracking-tight">Selected <em>work</em></h2>
          </div>
          <p className="mono">3 featured · 2 tools</p>
        </div>
      </div>

      {/* big featured projects, each on its own color band */}
      {features.map((f, i) => (
        <article key={f.slug} className="group px-12 py-24" style={{ background: f.bg }}>
          <div className="mx-auto max-w-[1280px]">
            <Pic img={f.img} label={`${f.name} — 16:9 mockup, 2880 × 1620`} ratio="16 / 9" bg="rgba(255,255,255,0.55)" />
            <div className="mt-11 grid gap-6 md:grid-cols-12">
              <div className="md:col-span-7">
                <p className="mono mb-3.5 text-mauve">0{i + 1} — {f.name}</p>
                <h3 className="font-serif text-[clamp(36px,3.4vw,54px)] leading-[1.05]">{f.h1} <em>{f.h2}</em></h3>
                <p className="mono mt-4">{f.meta}</p>
              </div>
              <div className="leading-relaxed md:col-span-5">
                <p className="mb-3"><span className="mono inline-block w-16">Design</span>{f.design}</p>
                <p className="mb-6"><span className="mono inline-block w-16">Build</span>{f.build}</p>
                <Link href={`/work/${f.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper hover:text-paper">
                  Explore the process →
                </Link>
              </div>
            </div>
          </div>
        </article>
      ))}

      {/* 2 smaller tools */}
      <div className="bg-paper px-12 py-24">
        <div className="mx-auto max-w-[1280px]">
          <p className="mono mb-7 text-mauve">More tools</p>
          <div className="grid gap-8 md:grid-cols-2">
            {tools.map((t) => (
              <article key={t.name} className="group">
                <Pic img={t.img} label={`${t.name} — 4:3, 1600 × 1200`} ratio="4 / 3" bg={t.bg} />
                <p className="mono mb-2 mt-5 text-mauve">{t.name}</p>
                <h3 className="font-serif text-[34px] leading-tight">{t.h1} <em>{t.h2}</em></h3>
                <p className="mt-3.5 text-[15px]"><span className="mono inline-block w-[60px]">Design</span>{t.design}</p>
                <p className="text-[15px]"><span className="mono inline-block w-[60px]">Build</span>{t.build}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
