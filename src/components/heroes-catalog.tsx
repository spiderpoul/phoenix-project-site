"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export type HeroListItem = {
  slug: string;
  name: string;
  photo: string;
  shortPhrase: string;
  company?: string;
  tags: string[];
  storyText: string;
};

type Props = {
  heroes: HeroListItem[];
};

export function HeroesCatalog({ heroes }: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput.trim().toLowerCase());
    }, 250);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  const companies = useMemo(() => {
    const set = new Set(
      heroes.map((hero) => hero.company).filter(Boolean) as string[]
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ru"));
  }, [heroes]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    heroes.forEach((hero) => hero.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ru"));
  }, [heroes]);

  const filtered = useMemo(() => {
    return heroes.filter((hero) => {
      if (company !== "all" && hero.company !== company) {
        return false;
      }
      if (selectedTags.length > 0) {
        const hasAll = selectedTags.every((tag) => hero.tags.includes(tag));
        if (!hasAll) {
          return false;
        }
      }
      if (!search) {
        return true;
      }
      const haystack = [
        hero.name,
        hero.company ?? "",
        hero.shortPhrase,
        hero.tags.join(" "),
        hero.storyText
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });
  }, [company, heroes, search, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleReset = () => {
    setSearchInput("");
    setCompany("all");
    setSelectedTags([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Поиск
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Имя, компания, тег, история..."
            className="w-full rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-ember-400 dark:border-slate-700/70 dark:bg-slate-950/40 dark:text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Компания
          <select
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="w-full rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-ember-400 dark:border-slate-700/70 dark:bg-slate-950/40 dark:text-slate-100"
          >
            <option value="all">Все компании</option>
            {companies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                active
                  ? "border-ember-500 bg-ember-500/15 text-ember-700 dark:text-ember-200"
                  : "border-slate-200/70 bg-white/70 text-slate-600 hover:border-ember-400 dark:border-slate-700/70 dark:bg-slate-950/40 dark:text-slate-300"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Найдено: <span className="font-semibold text-slate-900 dark:text-white">{filtered.length}</span>
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-semibold uppercase tracking-wide text-ember-600 transition hover:text-ember-500"
        >
          Сбросить фильтры
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200/70 bg-white/60 p-8 text-center text-slate-600 dark:border-slate-700/70 dark:bg-slate-950/30 dark:text-slate-300">
          Пока нет героев, соответствующих выбранным фильтрам. Попробуйте сбросить условия.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((hero) => (
            <Link
              key={hero.slug}
              href={`/heroes/${hero.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-ember-400/70 dark:border-slate-800/70 dark:bg-slate-950/40"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <img
                  src={hero.photo}
                  alt={hero.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {hero.name}
                  </p>
                  {hero.company ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {hero.company}
                    </p>
                  ) : null}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {hero.shortPhrase}
                </p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {hero.tags.map((tag) => (
                    <span
                      key={`${hero.slug}-${tag}`}
                      className="rounded-full bg-ember-500/10 px-2 py-1 text-xs font-semibold text-ember-700 dark:text-ember-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
