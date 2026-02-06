"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

export default function AboutPage() {
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
          <span className="rounded-full bg-[var(--color-chip-bg)] px-4 py-2 text-[var(--color-chip-text)]">
            About me
          </span>
          <Link
            href="/portfolio"
            className="rounded-full bg-[var(--color-chip-alt-bg)] px-4 py-2 text-[var(--color-chip-text)] transition-colors hover:bg-[var(--color-chip-bg)]"
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
          >
            Portfolio
          </Link>
        </div>

        <div className="mt-6 rounded-3xl border border-[var(--color-panel-border)] bg-[var(--color-card-inner-bg)] px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-8">
            <div>
              <div className="flex items-center justify-between">
                <div className="relative inline-flex items-center text-3xl font-semibold text-[var(--color-heading)]">
                  <span className="mr-2">&lt;/About</span>
                  <span className="relative inline-flex items-center">
                    <span className="absolute inset-0 rounded-md bg-[var(--color-accent-bg)] opacity-70" />
                    <span className="relative px-2">Me&gt;</span>
                    <span className="absolute -right-10 -top-1 hidden items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)] sm:flex">
                      <span className="inline-flex h-6 w-10 items-center justify-center rounded-md bg-[var(--color-tag-bg)]">
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-4 w-4 text-[var(--color-tag-text)]"
                          fill="currentColor"
                        >
                          <path d="m6 3 12 9-8 1 3 8-2 1-3-8-2 7-1-19Z" />
                        </svg>
                      </span>
                    </span>
                  </span>
                </div>
                <Link
                  href="/"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-heading)]"
                  onMouseEnter={handleHover}
                  onMouseLeave={handleLeave}
                >
                  Back
                </Link>
              </div>

              <div className="mt-6 rounded-3xl bg-[var(--color-accent-bg)] px-6 py-6 text-sm leading-6 text-[var(--color-accent-text)]">
                <p>
                  Hiii! Nice to meet you :P My name is Sydney Tran and I’m from
                  California. I’m a Computer Science + Advertising Student at
                  the University of Illinois Urbana-Champaign with a minor in
                  Data Science. I enjoy scrapbooking and doing my own nails. I
                  love anything active and exploring new things.
                </p>
                <p className="mt-4 italic">
                  *Fun fact I developed this website in 3 hours!*
                </p>
                <p className="mt-2 text-right text-xs">std::endl</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
