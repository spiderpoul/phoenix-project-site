import Head from 'next/head';
import Image from 'next/image';
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
  const tags = Array.isArray(hero.tags) ? hero.tags : [];
  const socials = Array.isArray(hero.socials) ? hero.socials : [];

  const getSocialIcon = (type) => {
    const icons = {
      telegram: '✈️',
      linkedin: '🔗',
      twitter: '🐦',
      github: '💻',
      youtube: '▶️',
      website: '🌐'
    };
    return icons[type?.toLowerCase()] || '🔗';
  };

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
          <div className="card flex flex-col gap-6 p-6 pt-14 sm:p-8 sm:pt-16">
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-br from-ember-500/10 via-white/60 to-sky-500/10 p-6 dark:from-ember-500/20 dark:via-slate-900/40 dark:to-sky-500/20">
              <Image
                src={hero.photo}
                alt={hero.name}
                width={176}
                height={176}
                className="-mt-12 h-44 w-44 rounded-full object-cover ring-4 ring-ember-500/30 shadow-lg shadow-ember-500/20 sm:h-52 sm:w-52"
                sizes="(min-width: 1024px) 11rem, 11rem"
              />
              <h1 className="text-center text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">
                {hero.name}
              </h1>
              {hero.position && (
                <p className="text-center text-sm text-slate-500 dark:text-slate-300">{hero.position}</p>
              )}
              <p className="text-center text-base leading-relaxed text-slate-600 dark:text-slate-200">
                {hero.short_phrase}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              {socials.length ? (
                <div className="flex flex-wrap justify-center gap-2">
                  {socials.map((social) => (
                    <a
                      key={`${social.type}-${social.url}`}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-ember-500/60 hover:text-ember-600 dark:border-slate-700/70 dark:bg-slate-950 dark:text-slate-200"
                    >
                      <span aria-hidden="true">{getSocialIcon(social.type)}</span>
                      <span>{social.type || 'Ссылка'}</span>
                    </a>
                  ))}
                </div>
              ) : null}
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
                    <Image
                      src={item.photo}
                      alt={item.name}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-2xl object-cover"
                      sizes="56px"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-300">{item.position}</p>
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
