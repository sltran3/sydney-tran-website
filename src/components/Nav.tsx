import Link from "next/link";
import { info } from "@/content/site";

// fixed editorial header
export default function Nav() {
  return (
    <header className="fixed inset-x-4 top-3.5 z-30 flex flex-wrap items-center justify-between gap-3 rounded-full border border-white/80 bg-paper/70 px-5 py-1 text-[13px] uppercase tracking-[0.08em] backdrop-blur-md">
      <span className="flex items-center gap-4">
        <Link href="/#top" className="navlink py-3 font-semibold">Sydney Tran</Link>
        <span className="mono rounded-full border border-ink px-2.5 py-0.5">ST26</span>
      </span>
      <nav className="flex flex-wrap gap-7">
        <Link href="/#work" className="navlink py-3">Work</Link>
        <Link href="/#about" className="navlink py-3">About</Link>
        <Link href="/#play" className="navlink py-3">Play</Link>
        <Link href="/#contact" className="navlink py-3">Contact</Link>
      </nav>
      <a href={info.resume} className="navlink py-3">Résumé ↗</a>
    </header>
  );
}
