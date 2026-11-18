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
  // "Next" skips archived case studies (an archived page itself still opens by its address)
  const shown = studies.filter((x) => !x.archived);
  const next = shown.find((x) => studies.indexOf(x) > i) ?? shown[0];

  const facts = [
    ["Client", s.client],
    ["Role", s.role],
    ...(s.type ? [["Type", s.type], ["Team", s.team], ["Year", s.time], ["Tools", s.tools]] : [
      ["Timeline", s.time], ["Tools", s.tools], ["Users", s.users],
    ]),
  ].filter(([, value]) => value);

  return (
    <main className="bg-paper">
      <Nav />

      {/* header */}
      <section className="mx-auto max-w-[1200px] px-12 pb-10 pt-36">
        <h1 className="font-serif text-[clamp(64px,8vw,120px)] leading-[0.95] tracking-tight">{s.name}</h1>
        <p className="mt-3.5 font-serif text-[38px] italic">{s.outcome}</p>
        {s.description && <p className="mt-4 max-w-[54ch] text-lg">{s.description}</p>}
        {s.video ? (
          // the project's film: plays silently on a loop, like a moving cover image
          <video
            src={s.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={`${s.name}: a short film of the project`}
            className="mt-12 aspect-video w-full rounded-[10px] bg-lilac object-cover"
          />
        ) : (
          <div className="mt-12 flex aspect-video items-center justify-center rounded-[10px] bg-gradient-to-br from-pink to-lilac">
            {!s.blankImages && <span className="label">[ Hero mockup — 2880 × 1620 ]</span>}
          </div>
        )}
        <div className="mt-9 grid grid-cols-2 gap-6 md:grid-cols-4">
          {facts.map(([k, v]) => (
            <div key={k} className="border-t border-ink/20 pt-3.5">
              <p className="label mb-1.5 text-mauve">{k}</p>
              <p>{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* story */}
      <section className="mx-auto max-w-[760px] px-12 py-16 text-lg leading-relaxed">
        {s.overview && (
          <div className="mb-12">
            <h2 className="label mb-3.5 text-mauve">Overview</h2>
            <p className="mb-5 font-serif text-[32px] italic leading-tight">{s.overview.heading}</p>
            {s.overview.paragraphs.map((p) => <p key={p} className="mb-5">{p}</p>)}
          </div>
        )}
        <p className="label mb-3.5 text-mauve">The problem</p>
        {s.problemHeading && <p className="mb-5 font-serif text-[32px] italic leading-tight">{s.problemHeading}</p>}
        {s.problem.map((p) => <p key={p} className="mb-5">{p}</p>)}
        <p className="label mb-2.5 mt-8 text-mauve">The goal</p>
        <p className="font-serif text-[32px] italic leading-tight">{s.goal}</p>
        {s.concept && (
          <div className="mt-12">
            <h2 className="label mb-3.5 text-mauve">The concept</h2>
            <p className="mb-5 font-serif text-[32px] italic leading-tight">{s.concept.heading}</p>
            {s.concept.paragraphs.map((p) => <p key={p} className="mb-5">{p}</p>)}
          </div>
        )}
      </section>

      {/* four decisions */}
      <section className="mx-auto max-w-[1200px] px-12 pb-20">
        {s.decisions.map((d) => <DecisionView key={d.title} d={d} blankImages={s.blankImages} />)}
      </section>

      {s.technical && (
        <section className="mx-auto max-w-[760px] px-12 pb-20 text-lg leading-relaxed">
          <h2 className="label mb-3.5 text-mauve">Technical development</h2>
          <p className="mb-5 font-serif text-[32px] italic leading-tight">{s.technical.heading}</p>
          {s.technical.paragraphs.map((p) => <p key={p} className="mb-5">{p}</p>)}
        </section>
      )}

      {/* ending */}
      <section className="bg-[#EDE6EF] px-12 py-24">
        <div className="mx-auto grid max-w-[1200px] gap-12 text-lg leading-relaxed md:grid-cols-2">
          <div>
            <p className="label mb-3.5 text-mauve">{s.changedHeading ? "Final product" : "What changed"}</p>
            {s.changedHeading && <p className="mb-5 font-serif text-[32px] italic leading-tight">{s.changedHeading}</p>}
            <p className="whitespace-pre-line">{s.changed}</p>
          </div>
          <div>
            <p className="label mb-3.5 text-mauve">{s.reflectHeading ? "Reflection" : "What I'd change"}</p>
            {s.reflectHeading && <p className="mb-5 font-serif text-[32px] italic leading-tight">{s.reflectHeading}</p>}
            <p className="whitespace-pre-line">{s.reflect}</p>
          </div>
        </div>
      </section>

      <footer className="label flex flex-wrap justify-between gap-3 px-12 py-12">
        <Link href="/#work" className="inline-flex min-h-11 items-center">← All work</Link>
        <Link href={`/work/${next.slug}`} className="inline-flex min-h-11 items-center">Next: {next.name} →</Link>
      </footer>
    </main>
  );
}
