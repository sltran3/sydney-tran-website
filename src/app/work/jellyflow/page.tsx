import type { Metadata } from "next";
import Link from "next/link";
import DecisionView from "@/components/DecisionView";
import Nav from "@/components/Nav";
import CaseVideo from "@/components/CaseVideo";
import { nextCaseStudy } from "@/content/site";

export const metadata: Metadata = {
  title: "Jellyflow | Sydney Tran",
  description: "Making studying feel like a little adventure.",
};

const liveUrl = "https://jellyflowbeta.vercel.app/";
const facts = [
  ["Role", "Product Designer & Developer"],
  ["Type", "Personal Project · Interactive Study Game"],
  ["Year", "2026"],
];

const next = nextCaseStudy("/work/jellyflow");

export default function JellyflowCaseStudy() {
  return (
    <main className="bg-paper">
      <Nav />
      <header className="mx-auto max-w-[1200px] px-6 pb-10 pt-36 sm:px-12">
        <h1 className="font-serif text-[clamp(64px,8vw,120px)] leading-[0.95] tracking-tight">Jellyflow</h1>
        <p className="mt-3.5 font-serif text-[38px] italic">Making studying feel like a little adventure.</p>
        {/* the project's film: plays silently on a loop, with its own pause / skip controls */}
        <CaseVideo src="/videos/carousel/jellyflow-portfolio-reel.mp4" label="Jellyflow: a short film of the project" className="mt-12" />
        <dl className="mt-9 grid grid-cols-2 gap-6 md:grid-cols-4">
          {facts.map(([label, value]) => (
            <div key={label} className="border-t border-ink/20 pt-3.5">
              <dt className="label mb-1.5 text-mauve">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
          <div className="border-t border-ink/20 pt-3.5">
            <dt className="label mb-1.5 text-mauve">Live Website</dt>
            <dd><a href={liveUrl} className="underline underline-offset-4">Play Jellyflow ↗</a></dd>
          </div>
        </dl>
      </header>

      <div className="mx-auto max-w-[760px] space-y-12 px-6 py-16 text-lg leading-relaxed sm:px-12 [&_p+p]:mt-5 [&_h2]:mb-3.5 [&_h2]:text-mauve [&_h3]:mb-5 [&_h3]:font-serif [&_h3]:text-[32px] [&_h3]:italic [&_h3]:leading-tight">
        <section>
          <h2 className="label">01 / Overview</h2>
          <h3>Making studying a little more fun.</h3>
          <p>Jellyflow is an interactive underwater study game I created to make studying feel more engaging. I wanted to build something that combined the productivity of a study tool with the experience of playing a game.</p>
          <p>Inspired by the gameplay of Krillion and the art style of <em>Ponyo</em>, I created an underwater world where players can explore different ocean depths while studying.</p>
          <p>This project was also an opportunity for me to experiment with game design and build something that felt different from a traditional productivity app.</p>
        </section>

        <section>
          <h2 className="label">02 / The Problem</h2>
          <h3>Studying shouldn&apos;t have to feel so repetitive.</h3>
          <p>A lot of study tools are designed around getting things done, but I feel like they don&apos;t always make the actual process of studying enjoyable.</p>
          <p>I wanted to explore how I could use game mechanics to make studying feel more rewarding without taking away from the purpose of the tool.</p>
          <p>My goal was to create something that students would actually want to use, even when they don&apos;t feel motivated to study.</p>
          <p className="label mb-2.5 mt-8 text-mauve">The goal</p>
          <p className="font-serif text-[32px] italic leading-tight">How might I make studying feel more like an experience rather than another task to complete?</p>
        </section>

        <section>
          <h2 className="label">03 / The Concept</h2>
          <h3>Turning studying into an underwater adventure.</h3>
          <p>I liked the idea of using the ocean because there are so many ways to make the environment change as you explore deeper.</p>
          <p>Instead of having a traditional progress bar, I wanted players to feel like they were making progress by moving through different parts of the ocean.</p>
          <p>The game starts closer to the surface, where the water is brighter, and gradually moves into darker areas with different sea creatures and underwater details.</p>
          <p>I wanted the environment itself to give players something to look forward to as they continued studying.</p>
        </section>

      </div>

      <section className="mx-auto max-w-[1200px] px-6 pb-20 sm:px-12">
        <h2 className="label mb-3.5 text-mauve">04 / Design Process</h2>
        <DecisionView blankImages d={{
          title: "01. Creating the underwater world",
          design: <>
            <p>One of the first things I worked on was figuring out how the environment would look as players moved deeper into the ocean.</p>
            <p>I wanted the game to have a soft, hand-painted style similar to <em>Ponyo</em>, rather than the typical pixel-art style used in a lot of games.</p>
          </>,
          build: <>
            <p>I experimented with different ocean backgrounds and lighting to make each depth feel different while still looking like one continuous environment.</p>
            <p>One challenge was making sure the backgrounds connected without noticeable lines or sudden color changes. I ended up separating the environment into different sections so I could adjust each part individually.</p>
          </>,
          designImg: "/img/jellyflow/01-underwater-world.webp",
          buildImg: "/img/jellyflow/01-underwater-world.webp",
        }} />
        <DecisionView blankImages d={{
          title: "02. Designing the characters",
          design: <>
            <p>I wanted the sea creatures to feel like they belonged in the same world, so I spent time experimenting with their shapes and expressions.</p>
            <p>I designed characters like a pufferfish, seahorse, and jellyfish, making adjustments to their proportions until they felt consistent with the overall art style.</p>
          </>,
          build: <>
            <p>A lot of the process involved small changes, like adjusting the shape of a character&apos;s face or making sure its features were still recognizable at a smaller size.</p>
            <p>I also created the characters as separate assets so they could move independently from the background.</p>
          </>,
          designImg: "/img/jellyflow/02-characters.webp",
          buildImg: "/img/jellyflow/02-characters.webp",
        }} />
        <DecisionView blankImages d={{
          title: "03. Making the environment feel continuous",
          design: <>
            <p>One of the harder parts was creating a long underwater environment that didn&apos;t feel repetitive.</p>
            <p>I didn&apos;t want players to keep seeing the same background as they moved through the game, so I created different decorative elements that could be placed throughout the ocean.</p>
          </>,
          build: <>
            <p>I also worked on how the lighting changed with depth. The deeper areas have darker colors and glowing elements, which helps make the transition feel more natural.</p>
            <p>This was one of the parts I spent the most time adjusting because even small differences between sections could make the environment look disconnected.</p>
          </>,
          designImg: "/img/jellyflow/03-deeper-waters.webp",
          buildImg: "/img/jellyflow/03-deeper-waters.webp",
        }} />
        <DecisionView blankImages d={{
          title: "04. Bringing everything together",
          design: <>
            <p>After creating the visual assets, I worked on bringing them into the game and making sure everything looked consistent together.</p>
            <p>I had to think about how the characters would fit into the environment and how the different background sections would work as players moved through them.</p>
          </>,
          build: <>
            <p>I also wanted the interface to stay simple because the underwater environment already has a lot of visual details.</p>
            <p>My goal was to make the game feel playful without making it difficult to understand or use.</p>
          </>,
          designImg: "/img/jellyflow/04-game-interface.webp",
          buildImg: "/img/jellyflow/04-game-interface.webp",
        }} />
      </section>

      <section className="bg-[#EDE6EF] px-6 py-24 sm:px-12">
        <div className="mx-auto max-w-[1200px] text-lg leading-relaxed">
          <h2 className="label mb-3.5 text-mauve">05 / Final Product</h2>
          <h3 className="mb-5 font-serif text-[32px] italic leading-tight">A different way to study.</h3>
          <p>Jellyflow brings studying and underwater exploration together. As players study, they move from brighter waters near the surface into darker depths, where new sea creatures and glowing details mark their progress.</p>
          <a href={liveUrl} className="mt-6 inline-flex min-h-11 items-center underline underline-offset-4">Play Jellyflow ↗</a>
        </div>
      </section>

      <footer className="label flex flex-wrap justify-between gap-3 px-6 py-12 sm:px-12">
        <Link href="/#work" className="inline-flex min-h-11 items-center">← All work</Link>
        <Link href={next.href} className="inline-flex min-h-11 items-center">Next: {next.name} →</Link>
      </footer>
    </main>
  );
}
