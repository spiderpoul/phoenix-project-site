import HeroCard from './HeroCard';

export default function FeaturedHeroes({ heroes }) {
  return (
    <section className="py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">Герои книги</p>
            <h2 className="section-title">Истории фениксов</h2>
          </div>
          <a href="/heroes" className="hidden text-sm font-medium text-ember-600 hover:underline sm:inline">
            Посмотреть всех
          </a>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {heroes.map((hero) => (
            <HeroCard key={hero.slug} hero={hero} variant="compact" />
          ))}
        </div>
        <a
          href="/heroes"
          className="inline-flex w-full items-center justify-center rounded-full border border-slate-200/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-ember-500/60 hover:text-ember-600 dark:border-slate-700/70 dark:text-slate-200 sm:hidden"
        >
          Посмотреть всех
        </a>
      </div>
    </section>
  );
}
