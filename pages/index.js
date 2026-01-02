import Head from 'next/head';
import Layout from '../components/Layout';
import PhoenixAnimation from '../components/PhoenixAnimation';
import FeaturedHeroes from '../components/FeaturedHeroes';
import heroesIndex from '../data/heroes-index.json';
import home from '../content/home.json';

export default function Home() {
  const featuredHeroes = [...heroesIndex]
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    .slice(0, home.featured_count);

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

      <section className="py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">О проекте</p>
          <p className="muted max-w-3xl text-base">{home.about_preview}</p>
          <div className="flex flex-wrap gap-3">
            <a href="/about" className="text-sm font-semibold text-ember-600 hover:underline">
              Подробнее о проекте
            </a>
            <a href="/join" className="text-sm font-semibold text-ember-600 hover:underline">
              Стать участником
            </a>
          </div>
        </div>
      </section>

      <FeaturedHeroes heroes={featuredHeroes} />
    </Layout>
  );
}
