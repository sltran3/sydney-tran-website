import Link from "next/link";
import { studies } from "@/content/site";

// 04 / Behind the Work: list of case studies
export default function Behind() {
  return (
    <section className="bg-paper px-12 py-28">
      <div className="mx-auto max-w-[1280px]">
        <p className="mono mb-5 text-mauve">04 / Behind the Work</p>
        <h2 className="mb-12 font-serif text-[clamp(48px,6vw,88px)] leading-none">Design decisions, <em>with receipts.</em></h2>
        {studies.map((s, i) => (
          <Link key={s.slug} href={`/work/${s.slug}`} className="grid items-center gap-6 border-t border-ink/20 py-8 md:grid-cols-[70px_1fr_1.4fr_40px]">
            <span className="mono">0{i + 1}</span>
            <span className="font-serif text-[40px] leading-none">{s.name}</span>
            <span className="text-sm leading-relaxed text-[#5B4A50]">{s.decisions.map((d) => d.title).join(" · ")}</span>
            <span aria-hidden className="text-[22px]">→</span>
          </Link>
        ))}
        <div className="border-t border-ink/20" />
      </div>
    </section>
  );
}
