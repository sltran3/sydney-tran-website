"use client";

import Image from "next/image";
import { Allura } from "next/font/google";
import type { MouseEvent } from "react";

const allura = Allura({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-allura",
});

export default function Home() {
  const handleHover = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.transform = "translateY(-1px)";
    event.currentTarget.style.boxShadow = "0 8px 18px rgba(20, 17, 13, 0.12)";
  };

  const handleLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.transform = "translateY(0)";
    event.currentTarget.style.boxShadow = "none";
  };

  return (
    <div
      className={`${allura.variable} flex min-h-screen items-center justify-center bg-[#f1efe9] px-6 py-10 text-[#2f2c26]`}
    >
      <main className="w-full max-w-5xl rounded-sm border border-[#c7c2b6] bg-[#f5f2eb] px-10 py-12 shadow-[0_1px_0_rgba(0,0,0,0.04)] sm:px-14 sm:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <section className="max-w-xl space-y-6">
            <div className="space-y-3">
              <h1 className="font-[var(--font-allura)] text-5xl font-semibold text-[#2a2722] sm:text-6xl">
                Sydney Tran
              </h1>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#7a746a]">
                
              </p>
            </div>
            <div className="space-y-2 text-[15px] leading-6 text-[#5b564f]">
              <p>Computer Science + Advertising</p>
              <p>Student @ University of Illinois</p>
              <p>Urbana-Champaign</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="mailto:sltran3@illinois.edu"
                aria-label="Email Sydney Tran"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6d1c6] bg-white/80 text-[#2a2722] transition-colors hover:bg-white"
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
                  <path d="m22 8-10 6L2 8" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/sydney-tran-931404237"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sydney Tran on LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6d1c6] bg-white/80 text-[#2a2722] transition-colors hover:bg-white"
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 21h4V9H3v12Zm7 0h4v-6.5c0-1.86 2.5-2.01 2.5 0V21h4v-7.5c0-5.16-5.5-4.97-6.5-2.43V9h-4v12Z" />
                </svg>
              </a>
            </div>
          </section>

          <div className="flex w-full justify-start lg:justify-end">
            <div className="h-60 w-60 overflow-hidden rounded-full border border-[#d3cfc6] bg-[#e8e4da] sm:h-72 sm:w-72 lg:h-80 lg:w-80">
              <Image
                src="/head-shot.JPEG"
                alt="Sydney Tran portrait"
                width={400}
                height={400}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>

        <nav className="mt-12 flex flex-wrap items-center gap-8 text-sm font-semibold uppercase tracking-[0.2em] text-[#3b362f]">
          <a
            className="rounded-full border border-transparent px-4 py-2 transition-colors hover:border-[#d6d1c6] hover:bg-white/70"
            href="/portfolio"
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
          >
            Portfolio
          </a>
          <a
            className="rounded-full border border-transparent px-4 py-2 transition-colors hover:border-[#d6d1c6] hover:bg-white/70"
            href="/about"
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
          >
            About Me
          </a>
        </nav>
      </main>
    </div>
  );
}
