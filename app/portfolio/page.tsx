"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";

const portfolioItems = [
  {
    title: "Grade Calculator",
    description:
      "I got sick of the other websites and having to calculate the minuscule categories of my grade. Click to try out my Grade Calculator!",
    stack: "JavaScript • React • Next.js",
    image: "/portfolio-grade-calculator.png",
    href: "https://sydsgradecalculator.vercel.app/",
  },
  {
    title: "HackIllinois UI",
    description: "User Interface design for a HackIllinois 2025 project!",
    stack: "Figma • UI/UX",
    image: "/portfolio-hackillinois-ui.png",
    href: "https://devpost.com/software/zyncup?_gl=1*z3nz7q*_gcl_au*MjczNjM2NDQ2LjE3NzAyNjIyNTI.*_ga*MzMxNjQ1NDI5LjE3NzAyNjIyNTI.*_ga_0YHJK3Y10M*czE3NzAyNjIyNTIkbzEkZzEkdDE3NzAyNjIyNTYkajU2JGwwJGgw",
  },
  {
    title: "Python Visual Book",
    description: "Designed and Authored a visual book about Python!",
    stack: "Python • Graphic Design",
    image: "/portfolio-python-book.png",
    href: "https://www.amazon.com/dp/B0CFZJKYKR?ref=cm_sw_r_cp_ud_dp_7EASQPVS6NQETBS6ZRRW&ref_=cm_sw_r_cp_ud_dp_7EASQPVS6NQETBS6ZRRW&social_share=cm_sw_r_cp_ud_dp_7EASQPVS6NQETBS6ZRRW",
  },
];

export default function PortfolioPage() {
  const handleHover = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.transform = "translateY(-1px)";
    event.currentTarget.style.boxShadow = "var(--hover-shadow)";
  };

  const handleLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.transform = "translateY(0)";
    event.currentTarget.style.boxShadow = "none";
  };

  return (
    <div className="min-h-screen bg-[var(--color-page-bg)] px-6 py-10 text-[var(--color-page-text)]">
      <main className="mx-auto w-full max-w-5xl rounded-sm border border-[var(--color-panel-border)] bg-[var(--color-panel-bg)] px-6 py-8 shadow-[var(--panel-shadow)] sm:px-10 sm:py-10">
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
          <Link
            href="/about"
            className="rounded-full bg-[var(--color-chip-alt-bg)] px-4 py-2 text-[var(--color-chip-text)] transition-colors hover:bg-[var(--color-chip-bg)]"
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
          >
            About me
          </Link>
          <span className="rounded-full bg-[var(--color-chip-bg)] px-4 py-2 text-[var(--color-chip-text)]">
            Portfolio
          </span>
        </div>

        <div className="mt-6 rounded-3xl border border-[var(--color-panel-border)] bg-[var(--color-card-inner-bg)] px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-[var(--color-heading)]">
              Portfolio
            </h1>
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-heading)]"
              onMouseEnter={handleHover}
              onMouseLeave={handleLeave}
            >
              Back
            </Link>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {portfolioItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="group rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-4 shadow-[var(--panel-shadow)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[var(--card-hover-shadow)]"
              >
                <div className="overflow-hidden rounded-xl border border-[var(--color-image-border)] bg-[var(--color-image-bg)]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={520}
                    height={320}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:h-48"
                  />
                </div>
                <div className="mt-4 space-y-2 text-sm text-[var(--color-body)]">
                  <p className="font-semibold text-[var(--color-heading)]">
                    {item.title}
                  </p>
                  <p>{item.description}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    {item.stack}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
