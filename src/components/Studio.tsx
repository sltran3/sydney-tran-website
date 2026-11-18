import { skills } from "@/content/site";
import Reveal from "@/components/Reveal";
import ChromeBead from "@/components/ChromeBead";

// The Studio: skill marquee, right under the about climb
export default function Studio() {
  return (
    <Reveal>
    <section aria-label="Skills" className="bg-paper pb-16 pt-10">
      {/* marquee pauses on hover. first copy is readable, second is just for the loop */}
      <div className="marq overflow-hidden whitespace-nowrap border-y border-ink/20 py-5">
        <div className="track inline-flex items-center gap-11 font-serif text-[42px] italic">
          {[0, 1].map((copy) =>
            skills.map((s, i) => (
              <span key={copy + s} aria-hidden={copy === 1} className="inline-flex items-center gap-11">
                {s}
                {/* every other separator is a little spinning chrome shape, cycling through the four */}
                {i % 2 ? <ChromeBead shape={(i - 1) / 2} /> : <span className="label not-italic" aria-hidden>✦</span>}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
    </Reveal>
  );
}
