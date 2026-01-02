import HeroesSlider from './HeroesSlider';

export default function FeaturedHeroes({ heroes }) {
  return (
    <section className="py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">Герои книги</p>
            <h2 className="section-title">Истории фениксов</h2>
          </div>
        </div>
        <HeroesSlider heroes={heroes} />
        <a
          href="/heroes"
          className="inline-flex w-full items-center justify-center rounded-full border border-slate-200/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-ember-500/60 hover:text-ember-600 dark:border-slate-700/70 dark:text-slate-200"
        >
          Посмотреть всех героев
        </a>
      </div>
    </section>
  );
}
