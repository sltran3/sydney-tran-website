"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "theme-preference";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY);
    const initialTheme = stored === "light" ? "light" : "dark";
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(THEME_KEY, nextTheme);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-icon-border)] bg-[var(--color-icon-bg)] text-[var(--color-heading)] shadow-[var(--panel-shadow)] transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[var(--color-icon-hover-bg)]"
    >
      {isDark ? (
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
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2.75v2.5M12 18.75v2.5M4.75 12h2.5M16.75 12h2.5M5.47 5.47l1.77 1.77M16.76 16.76l1.77 1.77M18.53 5.47l-1.77 1.77M7.24 16.76l-1.77 1.77" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-5 w-5"
          fill="currentColor"
        >
          <path d="M17.5 15.5A6.5 6.5 0 0 1 8.5 6.5a.75.75 0 0 0-.9-.93A7.75 7.75 0 1 0 18.43 16.4a.75.75 0 0 0-.93-.9Z" />
        </svg>
      )}
    </button>
  );
}
