import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { href: '#about', label: 'О проекте' },
  { href: '#process', label: 'Процесс' },
  { href: '#heroes', label: 'Фениксы' },
  { href: '#value', label: 'Ценность' },
  { href: '#contacts', label: 'Контакты' },
  { href: '#faq', label: 'FAQ' }
];

export default function Layout({ children }) {
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
          <nav className="hidden items-center gap-4 text-sm text-slate-600 dark:text-slate-300 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-ember-600">
                {item.label}
              </a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
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
