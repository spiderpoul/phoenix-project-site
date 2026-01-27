import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { href: '/', label: 'Главная' },
  { href: '/heroes', label: 'Герои' },
  { href: '/about', label: 'О проекте' },
  { href: '/join', label: 'Стать участником' }
];

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-orange-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-ember-500 to-amber-400 text-lg font-semibold text-white shadow-sm">
              ϟ
            </span>
            <span className="hidden sm:inline">Debug выгорания</span>
          </Link>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-4 text-sm text-slate-600 dark:text-slate-300 lg:flex">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="transition hover:text-ember-600">
                  {item.label}
                </a>
              ))}
            </nav>
            <button
              type="button"
              aria-label="Открыть меню"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/70 text-slate-600 transition hover:border-ember-500/60 hover:text-ember-600 dark:border-slate-700/70 dark:text-slate-200 lg:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <ThemeToggle />
          </div>
        </div>
        {isMenuOpen ? (
          <div className="border-t border-slate-200/60 px-4 py-4 text-sm text-slate-600 dark:border-slate-800/80 dark:text-slate-300 lg:hidden">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 transition hover:bg-ember-500/10 hover:text-ember-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        ) : null}
      </header>
      <main>{children}</main>
      <footer className="border-t border-slate-200/60 py-10 text-sm text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
          <span>Проект книги «Debug выгорания: 50 историй IT-фениксов»</span>
          <Link href="/" className="text-ember-600 hover:underline">
            На главную
          </Link>
        </div>
      </footer>
    </div>
  );
}
