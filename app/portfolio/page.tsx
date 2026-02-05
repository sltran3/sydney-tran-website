"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";

const portfolioItems = [
  {
    title: "Grade Calculator",
    description:
      "I got sick of the other websites and having to calculate the miniscule categories of my grade. Try out my Grade Calculator!",
    image: "/portfolio-grade-calculator.png",
    href: "https://sydsgradecalculator.vercel.app/",
  },
  {
    title: "Python Visual Book",
    description: "Designed and Authored a visual book about Python!",
    image: "/portfolio-python-book.png",
    href: "https://www.amazon.com/dp/B0CFZJKYKR?ref=cm_sw_r_cp_ud_dp_7EASQPVS6NQETBS6ZRRW&ref_=cm_sw_r_cp_ud_dp_7EASQPVS6NQETBS6ZRRW&social_share=cm_sw_r_cp_ud_dp_7EASQPVS6NQETBS6ZRRW",
  },
  {
    title: "HackIllinois UI",
    description:
      "Created a User Interface design for a HackIllinois 2025 project!",
    image: "/portfolio-hackillinois-ui.png",
    href: "https://devpost.com/software/zyncup?_gl=1*z3nz7q*_gcl_au*MjczNjM2NDQ2LjE3NzAyNjIyNTI.*_ga*MzMxNjQ1NDI5LjE3NzAyNjIyNTI.*_ga_0YHJK3Y10M*czE3NzAyNjIyNTIkbzEkZzEkdDE3NzAyNjIyNTYkajU2JGwwJGgw",
  },
];

export default function PortfolioPage() {
  const handleHover = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.transform = "translateY(-1px)";
    event.currentTarget.style.boxShadow = "0 8px 18px rgba(20, 17, 13, 0.12)";
  };

  const handleLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.transform = "translateY(0)";
    event.currentTarget.style.boxShadow = "none";
  };

  return (
    <div className="min-h-screen bg-[#f1efe9] px-6 py-10 text-[#2f2c26]">
      <main className="mx-auto w-full max-w-5xl rounded-sm border border-[#c7c2b6] bg-[#f5f2eb] px-6 py-8 shadow-[0_1px_0_rgba(0,0,0,0.04)] sm:px-10 sm:py-10">
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#7a746a]">
          <Link
            href="/about"
            className="rounded-full bg-white px-4 py-2 text-[#2a2722] transition-colors hover:bg-[#dfc6b7]"
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
          >
            About me
          </Link>
          <span className="rounded-full bg-[#dfc6b7] px-4 py-2 text-[#2a2722]">
            Portfolio
          </span>
        </div>

        <div className="mt-6 rounded-3xl border border-[#e3dfd6] bg-white px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-[#2a2722]">
              Portfolio
            </h1>
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a746a] transition-colors hover:text-[#2a2722]"
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
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group rounded-2xl border border-[#e7e1d7] bg-[#faf7f1] p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_14px_24px_rgba(20,17,13,0.16)]"
              >
                <div className="overflow-hidden rounded-xl border border-[#d5d0c5] bg-white">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={520}
                    height={320}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:h-48"
                  />
                </div>
                <div className="mt-4 space-y-2 text-sm text-[#5b564f]">
                  <p className="font-semibold text-[#2a2722]">{item.title}</p>
                  <p>{item.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
