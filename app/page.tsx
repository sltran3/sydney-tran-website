"use client";

import Image from "next/image";
import { Allura } from "next/font/google";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";

const allura = Allura({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-allura",
});

// ── useInViewRepeat hook (re-triggers on every entry) ─────────────────────────
function useInViewRepeat<T extends HTMLElement = HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView } as const;
}

// ── Typewriter component ───────────────────────────────────────────────────────
function TypewriterWord({ word, trigger, speed = 140 }: { word: string; trigger: boolean; speed?: number }) {
  const chars = useMemo(
    () => [...new Intl.Segmenter().segment(word)].map((s) => s.segment),
    [word]
  );
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!trigger) {
      setDisplayed(0);
      return;
    }
    let i = 0;
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(i);
        if (i >= chars.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(delay);
  }, [trigger, speed, chars]);

  return (
    <>
      {chars.slice(0, displayed).join("")}
      <span className="animate-cursor-blink ml-0.5 text-[var(--color-heading)]">|</span>
    </>
  );
}

// ── Project data ──────────────────────────────────────────────────────────────
const projects = [
  {
    title: "Research Methods AI Study Tool",
    description:
      "I built an AI-powered study tool for my ADV 281 class that generates curated practice exams to better understand the nuances of concepts",
    stack: "TypeScript • Anthropic API • Supabase",
    image: "/portfolio-research-methods.png",
    video: "/videos/research-methods.mp4",
    href: "https://sydsadv281.vercel.app/",
  },
  {
    title: "Grade Calculator",
    description:
      "I did not really like other online websites and having to calculate the minuscule categories of my grade. So I build a more functional one!",
    stack: "JavaScript • React • Next.js",
    image: "/portfolio-grade-calculator.png",
    video: "/videos/grade-calculator.mp4",
    href: "https://sydsgradecalculator.vercel.app/",
  },
  {
    title: "ZyncUp UI/UX",
    description: "User Interface design for a HackIllinois 2025 project!",
    stack: "Figma • UI/UX",
    image: "/portfolio-hackillinois-ui.png",
    video: "/videos/hackillinois.mp4",
    href: "https://devpost.com/software/zyncup",
  },
  {
    title: "Python Visual Book",
    description: "Designed and authored a visual book about Python!",
    stack: "Python • Graphic Design",
    image: "/portfolio-python-book.png",
    video: "/videos/python-book.mp4",
    href: "https://www.amazon.com/dp/B0CFZJKYKR",
  },
];

// ── About tab content (shared between card and modal) ─────────────────────────
// ── Academic tab content ───────────────────────────────────────────────────────
function AcademicTabContent({ activeTab }: { activeTab: string }) {
  return (
    <div className="px-6 py-7 font-mono text-sm leading-7 sm:px-8">
      {activeTab === "courses" && (
        <div className="space-y-1.5">
          <p className="text-[var(--color-muted)]">#pragma once</p>
          <p className="mb-3"><span className="text-[var(--color-muted)]">#include </span><span className="text-[var(--color-chip-text)]">&lt;coursesTaken&gt;</span></p>
          {[
            "Data Structures & Algorithms",
            "Systems Programming",
            "Object Oriented Programing",
            "Data Science Programming",
            "Linear Algebra",
            "Discrete Mathematics and Structures",
            "Probability & Statistics",
            "Advertising Research Methods",
          ].map((course, i) => (
            <p key={course} className="text-[var(--color-body)]">
              <span className="mr-4 select-none text-[var(--color-muted)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {course}
            </p>
          ))}
        </div>
      )}
      {activeTab === "skills" && (
        <div className="space-y-2 text-[var(--color-body)]">
          <p><span className="text-[var(--color-muted)]">const </span><span className="text-[var(--color-heading)]">languages</span><span className="text-[var(--color-muted)]"> = </span>[&quot;Python&quot;, &quot;C++&quot;, &quot;C&quot;, &quot;JavaScript&quot;, &quot;TypeScript&quot;, &quot;Java&quot;, &quot;HTML/CSS&quot;]</p>
          <p><span className="text-[var(--color-muted)]">const </span><span className="text-[var(--color-heading)]">frameworks</span><span className="text-[var(--color-muted)]"> = </span>[&quot;React&quot;, &quot;Next.js&quot;, &quot;Node.js&quot;, &quot;Webflow&quot;]</p>
          <p><span className="text-[var(--color-muted)]">const </span><span className="text-[var(--color-heading)]">technologies</span><span className="text-[var(--color-muted)]"> = </span>[&quot;Git&quot;, &quot;NumPy&quot;, &quot;CUDA&quot;, &quot;OpenCV&quot;, &quot;PyTorch&quot;, &quot;Scikit-image&quot;, &quot;ArrayFire&quot;, &quot;OpenCL&quot;, &quot;CUDA C++&quot;, &quot;Halide&quot;, &quot;Jupyter&quot;]</p>
          <p><span className="text-[var(--color-muted)]">const </span><span className="text-[var(--color-heading)]">design</span><span className="text-[var(--color-muted)]"> = </span>[&quot;Figma&quot;, &quot;UI/UX&quot;, &quot;Canva&quot;, &quot;Brand Identity&quot;]</p>
          <p><span className="text-[var(--color-muted)]">const </span><span className="text-[var(--color-heading)]">tools</span><span className="text-[var(--color-muted)]"> = </span>[&quot;Supabase&quot;, &quot;Anthropic API&quot;]</p>
        </div>
      )}
    </div>
  );
}

// ── Collage interactive hotspots ──────────────────────────────────────────────
const collageHotspots = [
  {
    id: "travel",
    src: "/collage-components/travel.png",
    label: "Travel",
    caption: "Antelope Canyon",
    popWidth: "42%",
    region: { top: "5%", left: "8%", width: "34%", height: "53%" },
  },
  {
    id: "dog",
    src: "/collage-components/dog.png",
    label: "Animals",
    caption: "My dog Bella!",
    region: { top: "4%", left: "48%", width: "38%", height: "52%" },
  },
  {
    id: "snorkel",
    src: "/collage-components/snorkel.png",
    label: "Active Activities",
    caption: "Snorkeling in Maui",
    region: { top: "46%", left: "3%", width: "44%", height: "50%" },
  },
  {
    id: "sunset",
    src: "/collage-components/sunset.png",
    label: "Adventure",
    caption: "Exploring with friends!",
    region: { top: "50%", left: "50%", width: "42%", height: "47%" },
  },
];

function CollageView() {
  const [active, setActive] = useState<string | null>(null);
  const activeHotspot = collageHotspots.find((h) => h.id === active);

  return (
    <div className="flex justify-center px-4 py-4">
      <div className="relative w-3/4">
        <Image
          src="/collage.png"
          alt="collage"
          width={800}
          height={600}
          className="w-full rounded-xl object-cover"
        />

        {collageHotspots.map((h) => (
          <button
            key={h.id}
            onClick={() => setActive(h.id)}
            aria-label={`View ${h.label}`}
            style={{
              position: "absolute",
              top: h.region.top,
              left: h.region.left,
              width: h.region.width,
              height: h.region.height,
            }}
            className="rounded-lg cursor-pointer transition-colors hover:bg-white/15 focus-visible:bg-white/15"
          />
        ))}

        {activeHotspot && (
          <>
            <button
              onClick={() => setActive(null)}
              className="absolute inset-0 rounded-xl bg-black/40"
              aria-label="Close"
            />
            <div className="animate-window-pop pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
              <button
                onClick={() => setActive(null)}
                className="pointer-events-auto relative overflow-hidden rounded-2xl shadow-2xl"
                style={{ width: activeHotspot.popWidth ?? "65%", maxWidth: 380 }}
                aria-label="Close photo"
              >
                <Image
                  src={activeHotspot.src}
                  alt={activeHotspot.label}
                  width={600}
                  height={500}
                  className="h-auto w-full object-cover"
                />
              </button>
              <div className="pointer-events-none text-center">
                <p className="text-xs font-semibold text-white drop-shadow">{activeHotspot.label}</p>
                {activeHotspot.caption && (
                  <p className="mt-0.5 text-xs text-white/80 drop-shadow">{activeHotspot.caption}</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AboutTabContent({ activeTab, triggerTypewriter }: { activeTab: string; triggerTypewriter: boolean }) {
  return (
    <div className="px-6 py-7 font-mono text-sm leading-7 sm:px-8">
      {activeTab === "about" && (
        <div className="space-y-3 text-[var(--color-body)]">
          <p className="text-base">
            <span className="text-[var(--color-muted)]"># </span>
            <span className="font-bold text-[var(--color-heading)]"><TypewriterWord word="Hey, I'm Sydney! 👩🏻‍💻" trigger={triggerTypewriter} /></span>
          </p>
          <p className="text-pretty leading-7">
            I&apos;m a CS + Advertising student at the University of Illinois, from the Bay Area,
            California. I&apos;m passionate about creating technology that improves lives and solves
            real problems, especially at the intersection of engineering and design. When I&apos;m not
            coding, I&apos;m usually exploring new things or making crafts.
          </p>
          <p className="pt-2 text-[var(--color-muted)]">Click on the terminal command to see my skills!</p>
        </div>
      )}
      {activeTab === "interests" && (
        <div className="space-y-1 text-[var(--color-body)]">
          <p className="text-[var(--color-muted)]">{"{"}</p>
          <p className="pl-6"><span className="text-[var(--color-heading)]">&quot;currently_learning&quot;</span>: &quot;AI-powered product development&quot;,</p>
          <p className="pl-6"><span className="text-[var(--color-heading)]">&quot;interests&quot;</span>: [&quot;swimming&quot;, &quot;traveling&quot;, &quot;cafe hopping&quot;, &quot;concerts&quot;],</p>
          <p className="pl-6"><span className="text-[var(--color-heading)]">&quot;locations&quot;</span>: [&quot;Cupertino, CA&quot;, &quot;Urbana-Champaign, IL&quot; ],</p>
          <p className="pl-6"><span className="text-[var(--color-heading)]">&quot;open_to&quot;</span>: [&quot;internships&quot;, &quot;collaborations&quot;, &quot;coffee chats ☕&quot;]</p>
          <p className="text-[var(--color-muted)]">{"}"}</p>
        </div>
      )}
      {activeTab === "collage" && <CollageView />}
    </div>
  );
}

// ── About tabs ────────────────────────────────────────────────────────────────
const aboutTabs = [
  { id: "about", label: "about.md" },
  { id: "interests", label: "interests.json" },
  { id: "collage", label: "collage.png" },
];

const academicTabs = [
  { id: "courses", label: "courses.h" },
  { id: "skills", label: "skills.txt" },
];

// ── Formspree ─────────────────────────────────────────────────────────────────
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xykdywev";

// ── ProjectCard ───────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  className,
}: {
  project: (typeof projects)[number];
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [hovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    const ny = -(e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    setTilt({ x: nx * 9, y: ny * 9 });
    setGlare({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50 });
  };

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-2xl border-2 border-[var(--color-panel-border)] bg-[var(--color-card-bg)] shadow-[var(--panel-shadow)] ${className ?? ""}`}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
        transition: tilt.x === 0 && tilt.y === 0
          ? "transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease"
          : "transform 0.08s linear",
        boxShadow: hovered ? "var(--card-hover-shadow)" : "var(--panel-shadow)",
      }}
    >
      {/* Image / video area */}
      <div className="relative m-3 h-44 overflow-hidden rounded-xl bg-[var(--color-image-bg)] sm:h-52">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className={`object-cover transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`}
        />
        {/* Video layer — plays on hover if file exists */}
        <video
          ref={videoRef}
          src={project.video}
          muted
          loop
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
        />
        {/* Glare */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.18) 0%, transparent 60%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
        {/* Hover overlay */}
        <div
          className={`absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
        >
          <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            View Project
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="space-y-2 px-5 pb-5 pt-2">
        <p className="font-semibold text-[var(--color-heading)]">{project.title}</p>
        <p className="text-sm leading-6 text-[var(--color-body)]">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.stack.split(" • ").map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--color-chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--color-chip-text)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {
  // Section refs for animation
  const heroLeft = useInViewRepeat<HTMLDivElement>(0.1);
  const heroRight = useInViewRepeat<HTMLDivElement>(0.1);
  const aboutSection = useInViewRepeat<HTMLElement>(0.15);
  const workSection = useInViewRepeat<HTMLElement>(0.1);
  const contactSection = useInViewRepeat<HTMLDivElement>(0.1);

  // About tab state
  const [activeTab, setActiveTab] = useState("about");
  const [activeWindow, setActiveWindow] = useState<"about" | "academic">("about");
  const [activeAcademicTab, setActiveAcademicTab] = useState("courses");

  // About window state
  const [aboutModal, setAboutModal] = useState(false);
  const [aboutMinimized] = useState(false);
  const [aboutModalShown, setAboutModalShown] = useState(false);

  useEffect(() => {
    document.body.style.overflow = aboutModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [aboutModal]);

  useEffect(() => {
    const el = aboutSection.ref.current;
    if (!el || aboutModalShown) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAboutModal(true);
          setAboutModalShown(true);
        }
      },
      { threshold: 0.85 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [aboutModalShown, aboutSection.ref]);

  // Contact form state
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!statusMessage) return;
    const t = window.setTimeout(() => setStatusMessage(null), 3500);
    return () => window.clearTimeout(t);
  }, [statusMessage]);

  // Carousel state
  const [projectPage, setProjectPage] = useState(0);
  const [slideDir, setSlideDir] = useState(0); // 1 = forward, -1 = back
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const cardsPerPage = isMobile ? 1 : 2;
  const numPages = Math.ceil(projects.length / cardsPerPage);
  const visibleProjects = projects.slice(
    projectPage * cardsPerPage,
    projectPage * cardsPerPage + cardsPerPage
  );

  useEffect(() => {
    if (projectPage >= numPages) setProjectPage(0);
  }, [numPages, projectPage]);

  const navigatePage = (dir: number) => {
    setSlideDir(dir);
    setProjectPage((p) => p + dir);
  };

  const swipeCooldown = useRef(false);
  const touchStartX = useRef<number | null>(null);

  const handleCarouselWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
    if (Math.abs(e.deltaX) < 30) return;
    if (swipeCooldown.current) return;
    swipeCooldown.current = true;
    setTimeout(() => { swipeCooldown.current = false; }, 1100);
    if (e.deltaX > 0 && projectPage < numPages - 1) navigatePage(1);
    if (e.deltaX < 0 && projectPage > 0) navigatePage(-1);
  };

  const handleCarouselTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleCarouselTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta > 0 && projectPage < numPages - 1) navigatePage(1);
    if (delta < 0 && projectPage > 0) navigatePage(-1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const form = e.currentTarget;
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (res.ok) { form.reset(); setStatusMessage("Message sent! ◡̈"); }
      else setStatusMessage("Something went wrong. Please try again.");
    } catch {
      setStatusMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className={`${allura.variable} bg-[var(--color-page-bg)] text-[var(--color-page-text)]`}>

      {/* ── HERO ── */}
      <section
        id="hero"
        className="mx-auto flex min-h-[calc(100vh-64px)] max-w-5xl flex-col items-center justify-center gap-12 px-6 py-16 sm:px-10 lg:flex-row lg:justify-between"
      >
        {/* Left — desktop full col / mobile subtitle only */}
        <div
          ref={heroLeft.ref}
          className={`max-w-xl space-y-7 hidden-until-visible ${heroLeft.inView ? "animate-fade-left animate-stagger-1" : ""}`}
        >
          <div className="space-y-3">
            <h1 className="font-[var(--font-allura)] text-6xl font-semibold text-[var(--color-heading)] sm:text-7xl text-center lg:text-left">
              Sydney Tran
            </h1>
            <p className="text-base font-medium text-[var(--color-body)] text-center lg:text-left">
              Computer Science + Advertising
              <br />
              <span >@</span>{" "}
              <span >University of Illinois Urbana-Champaign</span>
            </p>
          </div>
          <p className="hidden lg:block text-[15px] leading-7 text-[var(--color-body)]">
            I’m passionate about building intentional and impactful software. Based in the Bay Area, studying in Champaign.
          </p>
          <div className="hidden lg:flex flex-wrap items-center gap-3">
            <a
              href="mailto:sltran3@illinois.edu"
              aria-label="Email"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-icon-border)] bg-[var(--color-icon-bg)] text-[var(--color-heading)] transition-colors hover:bg-[var(--color-icon-hover-bg)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
                <path d="m22 8-10 6L2 8" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/sydney-tran-931404237"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-icon-border)] bg-[var(--color-icon-bg)] text-[var(--color-heading)] transition-colors hover:bg-[var(--color-icon-hover-bg)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 21h4V9H3v12Zm7 0h4v-6.5c0-1.86 2.5-2.01 2.5 0V21h4v-7.5c0-5.16-5.5-4.97-6.5-2.43V9h-4v12Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right — photo */}
        <div
          ref={heroRight.ref}
          className={`hidden-until-visible ${heroRight.inView ? "animate-fade-right animate-stagger-2" : ""}`}
        >
          <div className="h-64 w-64 overflow-hidden rounded-full border-2 border-[var(--color-image-border)] bg-[var(--color-image-bg)] shadow-[var(--card-hover-shadow)] sm:h-80 sm:w-80 lg:h-96 lg:w-96">
            <Image
              src="/profile.jpg"
              alt="Sydney Tran portrait"
              width={400}
              height={400}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Mobile-only: bio + buttons below photo */}
        <div className="w-full max-w-xl space-y-6 text-center lg:hidden">
          <p className="text-[15px] leading-7 text-[var(--color-body)]">
            I’m passionate about building intentional and impactful software. Based in the Bay Area, studying in Champaign. 
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:sltran3@illinois.edu"
              aria-label="Email"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-icon-border)] bg-[var(--color-icon-bg)] text-[var(--color-heading)] transition-colors hover:bg-[var(--color-icon-hover-bg)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
                <path d="m22 8-10 6L2 8" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/sydney-tran-931404237"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-icon-border)] bg-[var(--color-icon-bg)] text-[var(--color-heading)] transition-colors hover:bg-[var(--color-icon-hover-bg)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 21h4V9H3v12Zm7 0h4v-6.5c0-1.86 2.5-2.01 2.5 0V21h4v-7.5c0-5.16-5.5-4.97-6.5-2.43V9h-4v12Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <button
          onClick={() => scrollTo("about")}
          aria-label="Scroll down"
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce lg:flex"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--color-muted)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </section>

      {/* ── ABOUT ── */}
      <section
        id="about"
        ref={aboutSection.ref}
        className="mx-auto max-w-5xl px-6 py-20 sm:px-10"
      >
        <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)] hidden-until-visible ${aboutSection.inView ? "animate-fade-up animate-stagger-1" : ""}`}>
          
        </p>
        <h2 className={`mb-10 text-3xl font-bold text-[var(--color-heading)] sm:text-4xl hidden-until-visible ${aboutSection.inView ? "animate-fade-up animate-stagger-2" : ""}`}>
          {activeWindow === "about" ? "About" : "About"}
        </h2>
        <div className={`overflow-hidden rounded-2xl border border-[var(--color-panel-border)] bg-[var(--color-card-inner-bg)] hidden-until-visible ${aboutSection.inView ? "animate-window-pop animate-stagger-4" : ""}`}>
          {/* Title bar */}
          <div className="flex items-center gap-1.5 border-b border-[var(--color-panel-border)] bg-[var(--color-panel-bg)] px-4 py-2.5">
            <button onClick={() => { scrollTo("about"); setTimeout(() => scrollTo("work"), 600); }} aria-label="Go to Projects" className="relative group h-3 w-3 rounded-full bg-red-400 transition-opacity hover:opacity-75">
              <svg className="absolute inset-0 m-auto h-2 w-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 1.5l5 5M6.5 1.5l-5 5" /></svg>
            </button>
            <button
              onClick={() => {
                const tabs = activeWindow === "about" ? aboutTabs : academicTabs;
                const cur = activeWindow === "about" ? activeTab : activeAcademicTab;
                const setter = activeWindow === "about" ? setActiveTab : setActiveAcademicTab;
                const i = tabs.findIndex(t => t.id === cur);
                setter(tabs[(i + 1) % tabs.length].id);
              }}
              aria-label="Minimize"
              className="relative group h-3 w-3 rounded-full bg-yellow-400 transition-opacity hover:opacity-75"
            >
              <svg className="absolute inset-0 m-auto h-2 w-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 4h5" /></svg>
            </button>
            <button onClick={() => setAboutModal(true)} aria-label="Expand" className="relative group h-3 w-3 rounded-full bg-green-400 transition-opacity hover:opacity-75">
              <svg className="absolute inset-0 m-auto h-2 w-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4.5V7h2.5M7 3.5V1H4.5" /></svg>
            </button>
            <span className="ml-3 text-xs font-medium text-[var(--color-muted)]">~/sydney-tran/{activeWindow}</span>
          </div>

          {!aboutMinimized && (
            <>
              {/* File tabs */}
              <div className="flex border-b border-[var(--color-panel-border)] bg-[var(--color-panel-bg)]">
                {(activeWindow === "about" ? aboutTabs : academicTabs).map((tab) => {
                  const cur = activeWindow === "about" ? activeTab : activeAcademicTab;
                  const setter = activeWindow === "about" ? setActiveTab : setActiveAcademicTab;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { scrollTo("about"); setter(tab.id); }}
                      className={`border-r border-[var(--color-panel-border)] px-5 py-2.5 text-xs font-medium tracking-wide transition-colors ${
                        cur === tab.id
                          ? "border-t-2 border-t-[var(--color-chip-text)] bg-[var(--color-card-inner-bg)] text-[var(--color-heading)]"
                          : "text-[var(--color-muted)] hover:bg-[var(--color-card-inner-bg)] hover:text-[var(--color-heading)]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              {activeWindow === "about"
                ? <AboutTabContent activeTab={activeTab} triggerTypewriter={aboutSection.inView} />
                : <AcademicTabContent activeTab={activeAcademicTab} />
              }

              {/* Terminal */}
              <div className="border-t border-[var(--color-panel-border)] bg-[var(--color-panel-bg)]">
                <p className="px-4 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Terminal
                </p>
                <button
                  onClick={() => { scrollTo("about"); setActiveWindow(w => w === "about" ? "academic" : "about"); }}
                  className="group flex items-center gap-1.5 px-4 pb-3 pt-1 font-mono text-xs transition-colors"
                >
                  <span className="text-[var(--color-muted)]">sydneytran@stwebsite ~ %</span>
                  <span className="rounded px-1 text-[var(--color-body)] transition-colors group-hover:bg-[var(--color-chip-bg)] group-hover:text-[var(--color-chip-text)]">
                    cd sydney-tran/{activeWindow === "about" ? "academic" : "about"}
                  </span>
                  <span className="animate-cursor-blink text-[var(--color-muted)]">█</span>
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── WORK ── */}
      <div className="bg-[var(--color-card-inner-bg)]">
      <section
        id="work"
        ref={workSection.ref}
        className="mx-auto max-w-5xl px-6 py-20 sm:px-10"
      >
        <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)] hidden-until-visible ${workSection.inView ? "animate-fade-up animate-stagger-1" : ""}`}>

        </p>
        <h2 className={`mb-10 text-3xl font-semibold text-[var(--color-heading)] sm:text-4xl hidden-until-visible ${workSection.inView ? "animate-fade-up animate-stagger-2" : ""}`}>
          Projects
        </h2>
        {/* Carousel */}
        <div className={`hidden-until-visible ${workSection.inView ? "animate-fade-up animate-stagger-3" : ""}`}>
          <div className="flex items-center gap-4" onWheel={handleCarouselWheel} onTouchStart={handleCarouselTouchStart} onTouchEnd={handleCarouselTouchEnd}>
            {/* Left chevron */}
            <button
              onClick={() => navigatePage(-1)}
              disabled={projectPage === 0}
              aria-label="Previous projects"
              className="shrink-0 text-[var(--color-muted)] transition-opacity disabled:opacity-20 hover:text-[var(--color-heading)]"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Cards */}
            <div
              key={projectPage}
              className={`grid flex-1 gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"} ${slideDir > 0 ? "animate-carousel-right" : slideDir < 0 ? "animate-carousel-left" : ""}`}
            >
              {visibleProjects.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>

            {/* Right chevron */}
            <button
              onClick={() => navigatePage(1)}
              disabled={projectPage === numPages - 1}
              aria-label="Next projects"
              className="shrink-0 text-[var(--color-muted)] transition-opacity disabled:opacity-20 hover:text-[var(--color-heading)]"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Dot indicators */}
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: numPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setSlideDir(i > projectPage ? 1 : -1); setProjectPage(i); }}
                aria-label={`Go to page ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === projectPage ? "w-5 bg-[var(--color-heading)]" : "w-1.5 bg-[var(--color-muted)]/40"}`}
              />
            ))}
          </div>
        </div>
      </section>
      </div>

      {/* ── CONTACT ── */}
      <section
        id="contact"
        className="mx-auto max-w-5xl px-6 py-20 sm:px-10"
      >
        <div
          ref={contactSection.ref}
          className="overflow-hidden rounded-2xl border border-[var(--color-panel-border)] bg-[var(--color-card-inner-bg)]"
        >
          <div className="grid gap-0 lg:grid-cols-2">
            {/* Left */}
            <div className={`flex flex-col justify-center gap-6 border-b border-[var(--color-panel-border)] p-8 lg:border-b-0 lg:border-r sm:p-10 hidden-until-visible ${contactSection.inView ? "animate-fade-left animate-stagger-1" : ""}`}>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">
                  contact
                </p>
                <h2 className="text-3xl font-semibold text-[var(--color-heading)] sm:text-4xl">
                  Connect With Me!
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--color-body)]">
                  I'm open to new connections and opportunities! ☕
                </p>
              </div>
              <div className="space-y-3">
                <a
                  href="mailto:sltran3@illinois.edu"
                  className="flex items-center gap-3 text-sm text-[var(--color-body)] transition-colors hover:text-[var(--color-heading)]"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
                    <path d="m22 8-10 6L2 8" />
                  </svg>
                  sltran3@illinois.edu
                </a>
                <a
                  href="https://www.linkedin.com/in/sydney-tran-931404237"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-[var(--color-body)] transition-colors hover:text-[var(--color-heading)]"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor">
                    <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 21h4V9H3v12Zm7 0h4v-6.5c0-1.86 2.5-2.01 2.5 0V21h4v-7.5c0-5.16-5.5-4.97-6.5-2.43V9h-4v12Z" />
                  </svg>
                  linkedin.com/in/sydney-tran
                </a>
              </div>
            </div>

            {/* Right — form */}
            <div className={`p-8 sm:p-10 hidden-until-visible ${contactSection.inView ? "animate-fade-right animate-stagger-2" : ""}`}>
              {statusMessage && (
                <div className="mb-5 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-4 py-3 text-sm font-semibold text-[var(--color-heading)]">
                  {statusMessage}
                </div>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block space-y-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-muted)]">
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    required
                    className="block w-full rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-4 py-3 text-sm text-[var(--color-heading)] placeholder:text-[var(--color-muted)] outline-none transition-colors focus:border-[var(--color-accent-bg)]"
                  />
                </label>
                <label className="block space-y-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-muted)]">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    required
                    className="block w-full rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-4 py-3 text-sm text-[var(--color-heading)] placeholder:text-[var(--color-muted)] outline-none transition-colors focus:border-[var(--color-accent-bg)]"
                  />
                </label>
                <label className="block space-y-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-muted)]">
                  <span>Message</span>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    className="block w-full resize-none rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-4 py-3 text-sm text-[var(--color-heading)] placeholder:text-[var(--color-muted)] outline-none transition-colors focus:border-[var(--color-accent-bg)]"
                  />
                </label>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[var(--color-heading)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-panel-bg)] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT MODAL ── */}
      {aboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setAboutModal(false)}
          />
          {/* Floating window */}
          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-panel-border)] bg-[var(--color-card-inner-bg)] shadow-2xl animate-window-pop">
            {/* Title bar */}
            <div className="flex items-center gap-1.5 border-b border-[var(--color-panel-border)] bg-[var(--color-panel-bg)] px-4 py-2.5">
              <button onClick={() => setAboutModal(false)} aria-label="Close" className="relative group h-3 w-3 rounded-full bg-red-400 transition-opacity hover:opacity-75">
                <svg className="absolute inset-0 m-auto h-2 w-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 1.5l5 5M6.5 1.5l-5 5" /></svg>
              </button>
              <button
                onClick={() => {
                  const tabs = activeWindow === "about" ? aboutTabs : academicTabs;
                  const cur = activeWindow === "about" ? activeTab : activeAcademicTab;
                  const setter = activeWindow === "about" ? setActiveTab : setActiveAcademicTab;
                  const i = tabs.findIndex(t => t.id === cur);
                  setter(tabs[(i + 1) % tabs.length].id);
                }}
                aria-label="Minimize"
                className="relative group h-3 w-3 rounded-full bg-yellow-400 transition-opacity hover:opacity-75"
              >
                <svg className="absolute inset-0 m-auto h-2 w-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 4h5" /></svg>
              </button>
              <span className="h-3 w-3 rounded-full bg-green-400 opacity-40" />
              <span className="ml-3 text-xs font-medium text-[var(--color-muted)]">~/sydney-tran/{activeWindow}</span>
            </div>
            {/* File tabs */}
            <div className="flex border-b border-[var(--color-panel-border)] bg-[var(--color-panel-bg)]">
              {(activeWindow === "about" ? aboutTabs : academicTabs).map((tab) => {
                const cur = activeWindow === "about" ? activeTab : activeAcademicTab;
                const setter = activeWindow === "about" ? setActiveTab : setActiveAcademicTab;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setter(tab.id)}
                    className={`border-r border-[var(--color-panel-border)] px-5 py-2.5 text-xs font-medium tracking-wide transition-colors ${
                      cur === tab.id
                        ? "border-t-2 border-t-[var(--color-chip-text)] bg-[var(--color-card-inner-bg)] text-[var(--color-heading)]"
                        : "text-[var(--color-muted)] hover:bg-[var(--color-card-inner-bg)] hover:text-[var(--color-heading)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            {/* Tab content */}
            {activeWindow === "about"
              ? <AboutTabContent activeTab={activeTab} triggerTypewriter={true} />
              : <AcademicTabContent activeTab={activeAcademicTab} />
            }
          </div>
        </div>
      )}

    </div>
  );
}
