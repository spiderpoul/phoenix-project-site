import Image from "next/image";
import Link from "next/link";
import { HeroesCatalog } from "@/components/heroes-catalog";
import { ThemeToggle } from "@/components/theme";
import {
  getAllHeroes,
  getLandingContent,
  markdownToHtml,
  markdownToText
} from "@/lib/content";

export default function HomePage() {
  const landing = getLandingContent();
  const heroes = getAllHeroes();
  const heroesForClient = heroes.map((hero) => ({
    slug: hero.slug,
    name: hero.name,
    photo: hero.photo,
    shortPhrase: hero.shortPhrase,
    company: hero.company,
    tags: hero.tags,
    storyText: markdownToText(hero.story)
  }));

  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={landing.branding.phoenixLogo}
              alt="Логотип проекта"
              width={36}
              height={36}
              className="h-9 w-9"
            />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-200">
              Debug выгорания
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
            <Link href="#about" className="hover:text-ember-500">
              О проекте
            </Link>
            <Link href="#process" className="hover:text-ember-500">
              Процесс
            </Link>
            <Link href="#heroes" className="hover:text-ember-500">
              Герои
            </Link>
            <Link href="#value" className="hover:text-ember-500">
              Ценность
            </Link>
            <Link href="#contacts" className="hover:text-ember-500">
              Контакты
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-phoenix-glow" id="about">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-ember-400/60 bg-ember-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ember-700 dark:text-ember-200">
                Проект-книга
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-white md:text-5xl">
                {landing.hero.title}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {landing.hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={landing.hero.ctaPrimaryHref}
                  className="rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(249,115,22,0.4)] transition hover:bg-ember-600"
                >
                  {landing.hero.ctaPrimaryText}
                </a>
                <a
                  href={landing.hero.ctaSecondaryHref}
                  className="rounded-full border border-slate-200/70 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-ember-400 hover:text-ember-600 dark:border-slate-700/70 dark:bg-slate-950/40 dark:text-slate-200"
                >
                  {landing.hero.ctaSecondaryText}
                </a>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                {landing.about.title}
              </h2>
              <div
                className="prose-ember"
                dangerouslySetInnerHTML={{
                  __html: markdownToHtml(landing.about.text)
                }}
              />
              <ul className="grid gap-3">
                {landing.about.points.map((point) => (
                  <li
                    key={point}
                    className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm text-slate-700 dark:border-slate-800/70 dark:bg-slate-950/40 dark:text-slate-200"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="glow-card relative flex h-full min-h-[320px] w-full flex-col items-center justify-center rounded-[32px] border border-ember-400/50 bg-phoenix-gradient p-10 text-white shadow-xl">
                <Image
                  src={landing.branding.phoenixLogo}
                  alt="Phoenix mark"
                  width={84}
                  height={84}
                  className="mb-6"
                />
                <p className="text-center text-lg font-semibold">
                  50 историй IT-фениксов
                </p>
                <p className="mt-2 text-center text-sm text-white/80">
                  Место для вдохновения и будущей анимации
                </p>
                {landing.branding.animationAsset ? (
                  <a
                    href={landing.branding.animationAsset}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-xs uppercase tracking-[0.2em]"
                  >
                    Смотреть анимацию
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20" id="process">
          <div className="mb-10 flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-600">
              {landing.process.title}
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Путь героя
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {landing.process.steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm transition hover:border-ember-400/70 dark:border-slate-800/70 dark:bg-slate-950/40"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-500">
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20" id="heroes">
          <div className="mb-10 flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-600">
              {landing.heroes.title}
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              {landing.heroes.subtitle}
            </h2>
          </div>
          <HeroesCatalog heroes={heroesForClient} />
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20" id="value">
          <div className="mb-8 flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-600">
              {landing.value.title}
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Смысл проекта
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {landing.value.points.map((point) => (
              <div
                key={point}
                className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 text-sm text-slate-700 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/40 dark:text-slate-200"
              >
                {point}
              </div>
            ))}
          </div>
        </section>

        {landing.faq?.items?.length ? (
          <section className="mx-auto max-w-6xl px-6 py-20" id="faq">
            <div className="mb-8 flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-600">
                FAQ
              </p>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
                Частые вопросы
              </h2>
            </div>
            <div className="grid gap-4">
              {landing.faq.items.map((item) => (
                <div
                  key={item.q}
                  className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/40"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-6xl px-6 py-20" id="contacts">
          <div className="grid gap-8 rounded-[32px] border border-ember-400/50 bg-phoenix-gradient p-10 text-white md:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="text-3xl font-semibold">{landing.contacts.title}</h2>
              <p className="mt-3 text-sm text-white/80">
                {landing.contacts.text}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {landing.contacts.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
