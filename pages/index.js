import Head from 'next/head';
import Layout from '../components/Layout';
import PhoenixAnimation from '../components/PhoenixAnimation';
import FeaturedHeroes from '../components/FeaturedHeroes';
import HeroCard from '../components/HeroCard';
import heroesIndex from '../data/heroes-index.json';
import home from '../content/home.json';

export default function Home() {
  const featuredHeroes = [...heroesIndex]
    .sort((a, b) => {
      const weightDiff = (b.weight || 0) - (a.weight || 0);
      if (weightDiff !== 0) {
        return weightDiff;
      }
      return (a.name || '').localeCompare(b.name || '', 'ru');
    })
    .slice(0, home.featured_count);

  const aboutHeroes = featuredHeroes.slice(0, 2);

  return (
    <Layout>
      <Head>
        <title>{home.hero_title} — истории IT-фениксов</title>
        <meta name="description" content={home.hero_subtitle} />
      </Head>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">
              Книга о возрождении в IT
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              <span className="gradient-text">{home.hero_title}</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">{home.hero_subtitle}</p>
            <div className="flex flex-wrap gap-4">
              <a
                href={home.hero_cta_primary.href}
                className="rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ember-600"
              >
                {home.hero_cta_primary.text}
              </a>
              <a
                href={home.hero_cta_secondary.href}
                className="rounded-full border border-slate-200/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-ember-500/60 hover:text-ember-600 dark:border-slate-700/70 dark:text-slate-200"
              >
                {home.hero_cta_secondary.text}
              </a>
            </div>
          </div>
          <PhoenixAnimation src="/images/phoenix.svg" />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[0.4fr_0.6fr] lg:items-start">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-500">О проекте</p>
              <h2 className="section-title">{home.about_manifesto.title}</h2>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {home.about_manifesto.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">
                {home.about_manifesto.accent_title}
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {home.about_manifesto.bullets.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ember-500" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-base font-semibold text-slate-900 dark:text-white">{home.about_manifesto.final_line}</p>
          </div>
          <div className="grid gap-6 pt-10 sm:grid-cols-2 lg:grid-cols-1">
            {aboutHeroes.map((hero) => (
              <HeroCard key={hero.slug} hero={hero} />
            ))}
          </div>
        </div>
      </section>

      <FeaturedHeroes heroes={featuredHeroes} />

      <section className="py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-3xl border border-ember-200/70 bg-gradient-to-r from-ember-50 via-white to-orange-50 px-6 py-10 text-slate-700 shadow-sm dark:border-ember-500/20 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:text-slate-200 sm:px-10">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">Как стать героем</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{home.join_cta_title}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {home.join_cta_bullets.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-ember-500" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div>
            <a
              href={home.join_cta_button.href}
              className="inline-flex items-center justify-center rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ember-600"
            >
              {home.join_cta_button.text}
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
