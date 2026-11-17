import { craft } from "@/content/site";

// 05 / The Laboratory: craft gallery (4:5)
export default function Lab() {
  return (
    <section id="play" className="bg-gradient-to-b from-paper to-[#EDE6EF] px-12 py-28">
      <div className="mx-auto max-w-[1280px]">
        <p className="mono mb-5 text-mauve">05 / The Laboratory</p>
        <h2 className="mb-12 font-serif text-[clamp(48px,6vw,88px)] leading-none">The chrome <em>laboratory.</em></h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {craft.map((c) => (
            <figure key={c.title}>
              <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg" style={{ background: c.bg }}>
                {c.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.img} alt={c.title} className="w-[88%]" />
                ) : (
                  <span className="mono">[ 4:5 image ]</span>
                )}
              </div>
              <figcaption className="mt-3">
                <span className="block font-serif text-xl italic">{c.title}</span>
                <span className="mono">{c.cap}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
