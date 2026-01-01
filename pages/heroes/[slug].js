import Head from 'next/head';
import Link from 'next/link';
import ThemeToggle from '../../components/ThemeToggle';
import { getAllHeroes, getHeroBySlug, parseMarkdown } from '../../lib/content';

export async function getStaticPaths() {
  const heroes = getAllHeroes();
  return {
    paths: heroes.map((hero) => ({ params: { slug: hero.slug } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const hero = getHeroBySlug(params.slug);
  if (!hero) {
    return { notFound: true };
  }
  const storyHtml = await parseMarkdown(hero.content);
  const otherHeroes = getAllHeroes().filter((item) => item.slug !== hero.slug).slice(0, 3);

  return {
    props: {
      hero: {
        ...hero,
        storyHtml
      },
      otherHeroes
    }
  };
}

export default function HeroPage({ hero, otherHeroes }) {
  const ogTitle = `${hero.name} — ${hero.short_phrase}`;
  const ogDescription = hero.short_phrase;
  const ogImage = '/images/og-cover.svg';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-orange-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <Head>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="twitter:card" content="summary_large_image" />
      </Head>

      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-ember-500 to-amber-400 text-lg font-semibold text-white shadow-sm">
              ϟ
            </span>
            <span className="hidden sm:inline">Debug выгорания</span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="/#heroes"
              className="rounded-full border border-slate-200/70 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-ember-500/60 hover:text-ember-600 dark:border-slate-700/70 dark:text-slate-200 sm:hidden"
            >
              Назад
            </a>
            <nav className="hidden items-center gap-4 text-sm text-slate-600 dark:text-slate-300 sm:flex">
              <a href="/#about" className="transition hover:text-ember-600">О проекте</a>
              <a href="/#heroes" className="transition hover:text-ember-600">Все фениксы</a>
              <a
                href="/#heroes"
                className="rounded-full border border-slate-200/70 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-ember-500/60 hover:text-ember-600 dark:border-slate-700/70 dark:text-slate-200"
              >
                Назад
              </a>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-12">
        <section className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="card flex flex-col items-start gap-4 p-6">
            <img
              src={hero.photo}
              alt={hero.name}
              className="h-44 w-44 rounded-3xl object-cover"
            />
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{hero.name}</h1>
              {hero.company && <p className="text-sm text-slate-500 dark:text-slate-300">{hero.company}</p>}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-200">{hero.short_phrase}</p>
            <div className="flex flex-wrap gap-2">
              {hero.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-ember-500/30 bg-ember-500/10 px-4 py-3 text-xs text-ember-600 dark:text-ember-400">
              <span className="text-base">ϟ</span>
              <span>Герой книги «Debug выгорания: 50 историй IT-фениксов»</span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold">История</h2>
              <div
                className="prose prose-slate mt-4 max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: hero.storyHtml }}
              />
            </div>
            <div className="card p-6 text-sm text-slate-600 dark:text-slate-300">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">О проекте</h3>
              <p className="mt-2">
                «Debug выгорания» — серия честных историй о восстановлении и силе. Проект создан, чтобы поддерживать и вдохновлять IT-сообщество.
              </p>
              <Link href="/" className="mt-3 inline-flex text-ember-600 hover:underline">
                Узнать о проекте
              </Link>
            </div>
          </div>
        </section>

        {otherHeroes.length ? (
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Другие фениксы</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherHeroes.map((item) => (
                <Link key={item.slug} href={`/heroes/${item.slug}`} className="card card-hover p-4">
                  <div className="flex items-center gap-3">
                    <img src={item.photo} alt={item.name} className="h-14 w-14 rounded-2xl object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-300">{item.company}</p>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs text-slate-600 dark:text-slate-200">{item.short_phrase}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <footer className="border-t border-slate-200/60 py-8 text-center text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
        Аккуратная ссылка на проект: <Link href="/" className="text-ember-600 hover:underline">Debug выгорания</Link>
      </footer>
    </div>
  );
}
