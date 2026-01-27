import { useEffect, useMemo, useState } from 'react';
import HeroCard from './HeroCard';

const unique = (list) => Array.from(new Set(list)).sort();

export default function HeroesSection({ heroes = [] }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const tags = useMemo(
    () => unique(heroes.flatMap((hero) => (Array.isArray(hero.tags) ? hero.tags : []))),
    [heroes]
  );

  const filteredHeroes = useMemo(() => {
    return heroes.filter((hero) => {
      const tagsList = Array.isArray(hero.tags) ? hero.tags : [];
      const haystack = [
        hero.name,
        hero.position,
        hero.short_phrase,
        tagsList.join(' '),
        hero.content
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesQuery = debouncedQuery ? haystack.includes(debouncedQuery) : true;
      const matchesTags = selectedTags.length ? selectedTags.every((tag) => tagsList.includes(tag)) : true;

      return matchesQuery && matchesTags;
    });
  }, [debouncedQuery, heroes, selectedTags]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedTags([]);
  };

  return (
    <section className="py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">Каталог</p>
          <h1 className="section-title">Все герои проекта</h1>
          <p className="muted max-w-2xl">Поиск работает по имени, должности, тегам и тексту истории.</p>
        </div>
        <div className="grid gap-4 rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/60">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Поиск</label>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Имя, должность, тег, фраза"
              className="mt-2 w-full rounded-xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-ember-500/60 dark:border-slate-800/70 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>
          <div>
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
              <HeroCard key={hero.slug} hero={hero} variant="full" />
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
