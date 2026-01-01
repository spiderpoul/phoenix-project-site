import { useEffect, useMemo, useState } from 'react';
import HeroCard from './HeroCard';
import heroesIndex from '../data/heroes-index.json';

const unique = (list) => Array.from(new Set(list)).sort();

export default function HeroesSection() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [company, setCompany] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const companies = useMemo(() => unique(heroesIndex.map((hero) => hero.company).filter(Boolean)), []);
  const tags = useMemo(() => unique(heroesIndex.flatMap((hero) => hero.tags)), []);

  const filteredHeroes = useMemo(() => {
    return heroesIndex.filter((hero) => {
      const haystack = [
        hero.name,
        hero.company,
        hero.short_phrase,
        hero.tags.join(' '),
        hero.full_story
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesQuery = debouncedQuery ? haystack.includes(debouncedQuery) : true;
      const matchesCompany = company ? hero.company === company : true;
      const matchesTags = selectedTags.length
        ? selectedTags.every((tag) => hero.tags.includes(tag))
        : true;

      return matchesQuery && matchesCompany && matchesTags;
    });
  }, [company, debouncedQuery, selectedTags]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  const resetFilters = () => {
    setQuery('');
    setCompany('');
    setSelectedTags([]);
  };

  return (
    <section id="heroes" className="scroll-mt-24 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">Герои</p>
          <h2 className="section-title">Истории IT-фениксов</h2>
          <p className="muted max-w-2xl">
            Используйте поиск и фильтры, чтобы найти историю по компании, тегам или ключевой фразе.
          </p>
        </div>
        <div className="grid gap-4 rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/60 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Поиск</label>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Имя, компания, тег, фраза"
              className="mt-2 w-full rounded-xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-ember-500/60 dark:border-slate-800/70 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Компания</label>
            <select
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-ember-500/60 dark:border-slate-800/70 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value="">Все компании</option>
              {companies.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Теги</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    selectedTags.includes(tag)
                      ? 'border-ember-500/70 bg-ember-500/20 text-ember-600'
                      : 'border-slate-200/80 text-slate-500 hover:border-ember-500/40 dark:border-slate-700/70 dark:text-slate-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-slate-500 dark:text-slate-300">
              Найдено: <strong className="text-slate-900 dark:text-white">{filteredHeroes.length}</strong>
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-medium text-ember-600 hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
        {filteredHeroes.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHeroes.map((hero) => (
              <HeroCard key={hero.slug} hero={hero} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300/70 p-10 text-center text-slate-500 dark:border-slate-700/70">
            Ничего не найдено. Попробуйте изменить фильтры.
          </div>
        )}
      </div>
    </section>
  );
}
