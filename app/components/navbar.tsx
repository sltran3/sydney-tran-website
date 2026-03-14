"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = ["hero", "about", "work", "contact"];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => { setMenuOpen(false); setIsClosing(false); }, 180);
  };

  const scrollTo = (href: string) => {
    closeMenu();
    const id = href.replace("#", "");
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--color-panel-border)] bg-[var(--color-panel-bg)]/90 backdrop-blur-md shadow-[var(--panel-shadow)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-1 sm:px-10">
        {/* Logo */}
        <button
          onClick={() => scrollTo("#hero")}
          className="transition-opacity hover:opacity-70"
        >
          <span className="relative block h-10">
            <Image
              src="/sydneytranlogo.png"
              alt="Sydney Tran"
              width={0}
              height={0}
              sizes="120px"
              className={`h-10 w-auto object-contain transition-opacity duration-300 ${isDark ? "opacity-0" : "opacity-100"}`}
              priority
            />
            <Image
              src="/sydneytranlogodark.png"
              alt="Sydney Tran"
              width={0}
              height={0}
              sizes="120px"
              className={`absolute inset-0 h-10 w-auto object-contain transition-opacity duration-300 ${isDark ? "opacity-100" : "opacity-0"}`}
              priority
            />
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map(({ label, href }) => {
            const id = href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                  isActive
                    ? "bg-[var(--color-chip-bg)] text-[var(--color-chip-text)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-nav-hover-bg)] hover:text-[var(--color-heading)]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Mobile: hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={() => { if (menuOpen) { closeMenu(); } else { setMenuOpen(true); } }}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-icon-border)] bg-[var(--color-icon-bg)] text-[var(--color-heading)]"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {(menuOpen || isClosing) && (
        <div className={`border-t border-[var(--color-panel-border)] bg-[var(--color-panel-bg)] px-6 pb-4 sm:hidden ${isClosing ? "animate-menu-close" : "animate-menu-open"}`}>
          {NAV_LINKS.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              className="block w-full py-3 text-left text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-heading)]"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
