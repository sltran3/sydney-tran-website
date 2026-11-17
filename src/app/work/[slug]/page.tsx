import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import DecisionView from "@/components/DecisionView";
import { studies } from "@/content/site";

// make a page for each case study at build time
export function generateStaticParams() {
  return studies.map((s) => ({ slug: s.slug }));
}

export default async function CaseStudy(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const i = studies.findIndex((s) => s.slug === slug);
  if (i < 0) notFound();
  const s = studies[i];
  const next = studies[(i + 1) % studies.length];

  const facts = [
    ["Role", s.role],
    ["Timeline", s.time],
    ["Tools", s.tools],
    ["Users", s.users],
  ];

  return (
    <main className="bg-paper">
      <Nav />

      {/* header */}
      <section className="mx-auto max-w-[1200px] px-12 pb-10 pt-36">
        <p className="mono mb-4 text-mauve">Case study 0{i + 1} / 0{studies.length}</p>
        <h1 className="font-serif text-[clamp(64px,8vw,120px)] leading-[0.95] tracking-tight">{s.name}</h1>
        <p className="mt-3.5 font-serif text-[38px] italic">{s.outcome}</p>
        <div className="mt-12 flex aspect-video items-center justify-center rounded-[10px] bg-gradient-to-br from-pink to-lilac">
          <span className="mono">[ Hero mockup — 2880 × 1620 ]</span>
        </div>
        <div className="mt-9 grid grid-cols-2 gap-6 md:grid-cols-4">
          {facts.map(([k, v]) => (
            <div key={k} className="border-t border-ink/20 pt-3.5">
              <p className="mono mb-1.5 text-mauve">{k}</p>
              <p>{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* story */}
      <section className="mx-auto max-w-[760px] px-12 py-16 text-lg leading-relaxed">
        <p className="mono mb-3.5 text-mauve">The problem</p>
        {s.problem.map((p) => <p key={p} className="mb-5">{p}</p>)}
        <p className="mono mb-2.5 mt-8 text-mauve">The goal</p>
        <p className="font-serif text-[32px] italic leading-tight">{s.goal}</p>
      </section>

      {/* four decisions */}
      <section className="mx-auto max-w-[1200px] px-12 pb-20">
        {s.decisions.map((d, n) => <DecisionView key={d.title} d={d} n={n + 1} />)}
      </section>

      {/* ending */}
      <section className="bg-[#EDE6EF] px-12 py-24">
        <div className="mx-auto grid max-w-[1200px] gap-12 text-lg leading-relaxed md:grid-cols-2">
          <div><p className="mono mb-3.5 text-mauve">What changed</p><p>{s.changed}</p></div>
          <div><p className="mono mb-3.5 text-mauve">What I&apos;d change</p><p>{s.reflect}</p></div>
        </div>
      </section>

      <footer className="mono flex flex-wrap justify-between gap-3 px-12 py-12">
        <Link href="/#work" className="inline-flex min-h-11 items-center">← All work</Link>
        <Link href={`/work/${next.slug}`} className="inline-flex min-h-11 items-center">Next: {next.name} →</Link>
      </footer>
    </main>
  );
}
