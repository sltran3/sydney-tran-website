"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent, MouseEvent } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xykdywev";

export default function ContactPage() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHover = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.transform = "translateY(-1px)";
    event.currentTarget.style.boxShadow = "var(--hover-shadow)";
  };

  const handleLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.transform = "translateY(0)";
    event.currentTarget.style.boxShadow = "none";
  };

  useEffect(() => {
    if (!statusMessage) return;
    const timeout = window.setTimeout(() => setStatusMessage(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [statusMessage]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (response.ok) {
        form.reset();
        setStatusMessage("Message sent!");
      } else {
        setStatusMessage("Something went wrong. Please try again.");
      }
    } catch {
      setStatusMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-page-bg)] px-6 py-10 text-[var(--color-page-text)]">
      {statusMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-5 py-4 text-sm font-semibold text-[var(--color-heading)] shadow-[var(--card-hover-shadow)]">
            <div className="flex items-start justify-between gap-3">
              <span>{statusMessage}</span>
              <button
                type="button"
                onClick={() => setStatusMessage(null)}
                className="rounded-full border border-transparent px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-heading)]"
                aria-label="Close notification"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
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
          <Link
            href="/portfolio"
            className="rounded-full bg-[var(--color-chip-alt-bg)] px-4 py-2 text-[var(--color-chip-text)] transition-colors hover:bg-[var(--color-chip-bg)]"
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
          >
            Portfolio
          </Link>
          <span className="rounded-full bg-[var(--color-chip-bg)] px-4 py-2 text-[var(--color-chip-text)]">
            Contact
          </span>
        </div>

        <div className="mt-6 rounded-3xl border border-[var(--color-panel-border)] bg-[var(--color-card-inner-bg)] px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-[var(--color-heading)]">
              Contact
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

          <p className="mt-4 text-sm text-[var(--color-body)]">
            Feel free to reach out to me!  ◡̈
          </p>

          <form
            className="mt-6 space-y-5"
            onSubmit={handleSubmit}
          >
            <label className="block space-y-2 text-sm font-semibold text-[var(--color-heading)]">
              <span>Name</span>
              <input
                type="text"
                name="name"
                
                className="w-full rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-4 py-3 text-[var(--color-heading)] placeholder:text-[var(--color-muted)] shadow-[var(--panel-shadow)] outline-none transition-colors focus:border-[var(--color-accent-bg)]"
              />
            </label>

            <label className="block space-y-2 text-sm font-semibold text-[var(--color-heading)]">
              <span>Email</span>
              <input
                type="email"
                name="email"
              
                className="w-full rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-4 py-3 text-[var(--color-heading)] placeholder:text-[var(--color-muted)] shadow-[var(--panel-shadow)] outline-none transition-colors focus:border-[var(--color-accent-bg)]"
              />
            </label>

            <label className="block space-y-2 text-sm font-semibold text-[var(--color-heading)]">
              <span>Message</span>
              <textarea
                name="message"
                rows={5}
      
                className="w-full resize-none rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-4 py-3 text-[var(--color-heading)] placeholder:text-[var(--color-muted)] shadow-[var(--panel-shadow)] outline-none transition-colors focus:border-[var(--color-accent-bg)]"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--color-heading)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-panel-bg)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
