"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#about-me", label: "About" },
  { href: "/play", label: "Play" },
  { href: "/#contact", label: "Contact", arrow: true },
];

// open header: no pill. once you scroll, a soft frosted veil fades in behind it.
// on phones the links fold into a Menu button that opens a full-screen menu.
export default function Nav() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // while the phone menu is open: the page underneath can't scroll, Escape closes it, and it closes itself if
  // the screen gets wide enough for the normal links (e.g. turning a tablet)
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    const wide = window.matchMedia("(min-width: 640px)");
    const onWide = () => { if (wide.matches) setOpen(false); };
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      html.style.overflow = before;
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <header className={`veil fixed inset-x-0 top-0 z-50 ${scrolled || open ? "veil-on" : ""}`}>
      {/* thin white line under the menu while you're at the top; the frosted veil takes over once you scroll */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-4 bottom-0 h-px bg-white/75 transition-opacity duration-500 sm:inset-x-10 ${scrolled || open ? "opacity-0" : "opacity-100"}`}
      />
      <div className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between gap-x-8 px-4 py-2 sm:px-10 sm:pb-3 sm:pt-4">
        {/* the chrome "S" mark, in place of the name (screen readers still hear "Sydney Tran") */}
        <Link href="/#top" onClick={() => setOpen(false)} aria-label="Sydney Tran, home" className="-my-1 inline-flex items-center sm:-my-2">
          <Image
            src="/img/logo-s.webp"
            alt=""
            width={221}
            height={204}
            priority
            className="h-14 w-auto drop-shadow-[0_4px_8px_rgba(60,40,60,0.32)] transition-transform duration-500 hover:rotate-[-6deg] hover:scale-105 sm:h-[68px]"
          />
        </Link>

        {/* wider screens: the links in a row */}
        <nav aria-label="Main" className="hidden flex-wrap items-baseline gap-x-9 gap-y-1 font-news text-[19px] sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={path === l.href ? "page" : undefined}
              className="navlink inline-flex min-h-11 items-center"
            >
              {l.label}
              {l.arrow && <span aria-hidden className="ml-1">↗</span>}
            </Link>
          ))}
        </nav>

        {/* phones: a menu button, just two lines that turn into an × */}
        <button
          ref={toggle}
          type="button"
          aria-expanded={open}
          aria-controls="phone-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
          className="-mr-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full sm:hidden"
        >
          <span aria-hidden className="relative block h-3 w-6">
            <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ${open ? "top-1/2 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`} />
          </span>
        </button>
      </div>

      {/* the phone menu: full screen, big serif links that rise in one after another */}
      <div
        id="phone-menu"
        hidden={!open}
        className="fixed inset-0 z-0 bg-paper/95 backdrop-blur-xl sm:hidden"
      >
        <nav aria-label="Main" className="h-full px-6 pb-10 pt-28">
          <ul className="flex flex-col gap-1">
            {links.map((l, i) => (
              <li key={l.href} className="menu-rise border-b border-ink/15" style={{ animationDelay: `${0.05 + i * 0.06}s` }}>
                <Link
                  ref={i === 0 ? firstLink : undefined}
                  href={l.href}
                  aria-current={path === l.href ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-baseline py-4 font-serif text-[44px] leading-none tracking-tight"
                >
                  {i === 1 ? <em>{l.label}</em> : l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
