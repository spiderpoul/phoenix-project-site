import Head from 'next/head';
import Layout from '../components/Layout';
import PhoenixAnimation from '../components/PhoenixAnimation';
import FeaturedHeroes from '../components/FeaturedHeroes';
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

  const aboutIcons = [
    (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          d="M4 7.5L12 4l8 3.5v9L12 20l-8-3.5v-9Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M12 4v16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          d="M12 4.5c2.9 0 5.25 2.35 5.25 5.25 0 2.9-2.35 5.25-5.25 5.25S6.75 12.65 6.75 9.75 9.1 4.5 12 4.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M12 15v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          d="M5 7h14M5 12h10M5 17h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          d="M7.5 8.5a2.5 2.5 0 1 1 5 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M4 18.5c.9-2.8 3.3-4.7 6-4.7s5.1 1.9 6 4.7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M14.5 18.5c.4-1.4 1.4-2.6 2.6-3.3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          d="M6 7h12M6 11h8M6 15h6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M16.5 14.5 19 17l3-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )
  ];

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

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-500">О проекте</p>
              <h2 className="section-title">Собираем истории восстановления в IT</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">{home.about_description}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="/join"
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ember-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 sm:w-auto"
              >
                Стать участником
              </a>
              <a
                href="/about"
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-slate-200/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-ember-500/60 hover:text-ember-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700/70 dark:text-slate-200 dark:focus-visible:ring-offset-slate-950 sm:w-auto"
              >
                Подробнее о проекте
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {home.about_items.map((item, index) => (
              <div
                key={item.title}
                className={`group flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-5 text-sm text-slate-600 transition duration-200 hover:-translate-y-1 hover:border-ember-500/60 hover:text-slate-800 hover:shadow-md hover:shadow-ember-500/10 dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-200 ${
                  item.featured ? 'sm:col-span-2 lg:p-6' : ''
                }`}
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ember-500/20 bg-ember-500/10 text-ember-500">
                  {aboutIcons[index % aboutIcons.length]}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{item.text}</p>
                </div>
              </div>
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
