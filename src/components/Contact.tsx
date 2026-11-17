import { info } from "@/content/site";

// 06 / Say Hello: back to the pink sky
export default function Contact() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-lilac bg-[url(/img/sky.webp)] bg-cover bg-center px-12 pb-10 pt-40 text-center">
      <div aria-hidden className="drift absolute inset-0 bg-[url(/img/clouds.webp)] bg-[length:900px_auto] opacity-30 mix-blend-screen" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#EDE6EF] to-transparent to-30%" />
      <div className="relative mx-auto max-w-[1280px]">
        <p className="mono mb-5">06 / Say Hello</p>
        <h2 className="font-serif text-[clamp(64px,9vw,140px)] leading-[0.95] tracking-tight">Something good starts <em>with a hello.</em></h2>
        <a href={`mailto:${info.email}`} className="mt-11 inline-flex min-h-[60px] items-center rounded-full bg-ink px-9 text-lg font-medium text-paper hover:text-paper">
          {info.email} ↗
        </a>
        <div className="mono mt-6 flex flex-wrap justify-center gap-7">
          <a href={info.linkedin} className="inline-flex min-h-11 items-center">LinkedIn</a>
          <a href={info.github} className="inline-flex min-h-11 items-center">GitHub</a>
          <a href={info.resume} className="inline-flex min-h-11 items-center">Résumé</a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/wordmark.webp" alt="" aria-hidden className="mx-auto mt-24 block w-[min(760px,70%)] drop-shadow-[0_20px_24px_rgba(60,40,60,0.3)]" />
        <div className="mono mt-16 flex flex-wrap justify-between gap-3">
          <span>© 2026 Sydney Tran</span>
          <span>Somewhere between sky &amp; screen</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
