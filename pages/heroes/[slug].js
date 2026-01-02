import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
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
    <Layout>
      <Head>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="twitter:card" content="summary_large_image" />
      </Head>

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
    </Layout>
  );
}
