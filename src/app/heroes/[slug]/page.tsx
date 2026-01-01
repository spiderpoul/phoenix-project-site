import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ShareButton } from "@/components/share-button";
import { ThemeToggle } from "@/components/theme";
import {
  getAllHeroes,
  getHeroBySlug,
  getHeroSlugs,
  markdownToHtml
} from "@/lib/content";

export function generateStaticParams() {
  return getHeroSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params
}: {
  params: { slug: string };
}): Metadata {
  const hero = getHeroBySlug(params.slug);
  const title = hero.seo?.title ?? `${hero.name} — Герой IT-фениксов`;
  const description =
    hero.seo?.description ?? hero.shortPhrase ?? "История героя IT-фениксов";

  return {
    title,
    description,
    openGraph: {
      title: `${hero.name} — Герой IT-фениксов`,
      description,
      images: [
        {
          url: hero.photo
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${hero.name} — Герой IT-фениксов`,
      description,
      images: [hero.photo]
    }
  };
}

export default function HeroPage({ params }: { params: { slug: string } }) {
  const hero = getHeroBySlug(params.slug);
  const allHeroes = getAllHeroes();

  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/60">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/phoenix-mark.svg"
              alt="Логотип проекта"
              width={32}
              height={32}
            />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-700 dark:text-slate-200">
              Phoenix Book
            </span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
            <Link href="/#about" className="hover:text-ember-500">
              О проекте
            </Link>
            <Link href="/#heroes" className="hover:text-ember-500">
              Герои
            </Link>
            <Link href="/#contacts" className="hover:text-ember-500">
              Контакты
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 flex flex-col gap-6 rounded-[32px] border border-slate-200/70 bg-white/80 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.12)] dark:border-slate-800/70 dark:bg-slate-950/40 md:flex-row md:items-center">
          <div className="relative h-60 w-full overflow-hidden rounded-3xl border border-ember-400/40 md:h-72 md:w-1/2">
            <img
              src={hero.photo}
              alt={hero.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-ember-400/60 bg-ember-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ember-700 dark:text-ember-200">
              Герой книги Debug выгорания
            </span>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              {hero.name}
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300">
              {hero.shortPhrase}
            </p>
            {hero.company ? (
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {hero.company}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {hero.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-ember-500/10 px-3 py-1 text-xs font-semibold text-ember-700 dark:text-ember-200"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ShareButton title={hero.name} />
              <Link
                href="/#heroes"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-600"
              >
                Назад к участникам
              </Link>
            </div>
          </div>
        </div>

        <div className="prose-ember" dangerouslySetInnerHTML={{ __html: markdownToHtml(hero.story) }} />

        {hero.socials.length ? (
          <div className="mt-10 flex flex-wrap gap-3">
            {hero.socials.map((social) => (
              <a
                key={social.url}
                href={social.url}
                className="rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-ember-400 hover:text-ember-600 dark:border-slate-800/70 dark:bg-slate-950/40 dark:text-slate-300"
              >
                {social.type}
              </a>
            ))}
          </div>
        ) : null}

        <div className="mt-16 rounded-3xl border border-slate-200/70 bg-white/70 p-6 text-sm text-slate-600 dark:border-slate-800/70 dark:bg-slate-950/40 dark:text-slate-300">
          <div className="flex items-center gap-3">
            <Image src="/phoenix-mark.svg" alt="Phoenix" width={36} height={36} />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Проект "Debug выгорания"
              </p>
              <p>Книга о восстановлении и силе сообщества в IT.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200/70 pt-8 text-xs text-slate-500 dark:border-slate-800/70 dark:text-slate-400">
          Другие герои: {allHeroes.map((item) => item.name).join(" · ")}
        </div>
      </main>
    </div>
  );
}
