import Head from 'next/head';
import Layout from '../components/Layout';
import PhoenixAnimation from '../components/PhoenixAnimation';
import FeaturedHeroes from '../components/FeaturedHeroes';
import home from '../content/home.json';
import phoenixImage from '../public/images/phoenix.png';
import { getAllHeroes } from '../lib/content';

export async function getStaticProps() {
  const heroes = getAllHeroes();
  return {
    props: {
      heroes
    }
  };
}

export default function Home({ heroes }) {
  const featuredHeroes = [...heroes]
    .sort((a, b) => {
      const weightDiff = (b.weight || 0) - (a.weight || 0);
      if (weightDiff !== 0) {
        return weightDiff;
      }
      return (a.name || '').localeCompare(b.name || '', 'ru');
    })
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
          <PhoenixAnimation image={phoenixImage} />
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[0.48fr_0.52fr] lg:items-start">
          <div className="flex max-w-xl flex-col gap-6">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-500">О проекте</p>
              <h2 className="section-title">{home.about_manifesto.title}</h2>
              <div className="space-y-4 text-base text-slate-600 dark:text-slate-300">
                {home.about_manifesto.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="border-l-2 border-ember-500/60 pl-4 text-base font-semibold text-slate-900 dark:text-white">
              {home.about_manifesto.final_line}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {home.about_features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-5 text-sm text-slate-600 transition hover:-translate-y-1 hover:border-ember-500/60 hover:shadow-md hover:shadow-ember-500/10 dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-300"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-ember-500/20 bg-ember-500/10 text-ember-500">
                  {index === 0 && (
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                      <path
                        d="M6 4h9l3 3v13H6V4Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                      <path
                        d="M7 7.5a3.5 3.5 0 1 1 7 0"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M4.5 18.5c.9-2.8 3.4-4.7 6-4.7s5.1 1.9 6 4.7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle cx="18" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                      <path
                        d="M6.5 9a5.5 5.5 0 1 1 6.8 5.4L12 20l-2-3-3-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {index === 3 && (
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                      <path
                        d="M8 5c2.5 0 4 1.6 4 4.2V19"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M16 5c-2.5 0-4 1.6-4 4.2V19"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path d="M8 9h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{feature.text}</p>
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
