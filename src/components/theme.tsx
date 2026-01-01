"use client";

import { useEffect, useState } from "react";

const storageKey = "phoenix-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const stored = window.localStorage.getItem(storageKey) as
      | "light"
      | "dark"
      | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const nextTheme = stored ?? (prefersDark ? "dark" : "light");
    root.classList.toggle("dark", nextTheme === "dark");
    setTheme(nextTheme);
  }, []);

  const handleToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem(storageKey, nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm transition hover:border-ember-400 hover:text-ember-600 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200"
    >
      <span className="h-2 w-2 rounded-full bg-ember-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
      {theme === "dark" ? "Темная" : "Светлая"}
    </button>
  );
}
