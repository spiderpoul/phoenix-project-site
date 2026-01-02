import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-ember-500/50 hover:text-ember-600 dark:border-slate-800/70 dark:text-slate-200"
      aria-label="Переключить тему"
    >
      <span className="text-base">{theme === 'dark' ? '🌙' : '☀️'}</span>
      <span className="hidden sm:inline">{theme === 'dark' ? 'Тёмная' : 'Светлая'}</span>
    </button>
  );
}
