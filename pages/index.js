import Head from 'next/head';
import Layout from '../components/Layout';
import PhoenixAnimation from '../components/PhoenixAnimation';
import HeroesSection from '../components/HeroesSection';
import landing from '../content/landing.json';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>{landing.hero_title} — истории IT-фениксов</title>
        <meta name="description" content={landing.hero_subtitle} />
      </Head>

      <section id="top" className="scroll-mt-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">
              Книга о возрождении в IT
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              <span className="gradient-text">{landing.hero_title}</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">{landing.hero_subtitle}</p>
            <div className="flex flex-wrap gap-4">
              <a
                href={landing.hero_cta_primary.href}
                className="rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ember-600"
              >
                {landing.hero_cta_primary.text}
              </a>
              <a
                href={landing.hero_cta_secondary.href}
                className="rounded-full border border-slate-200/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-ember-500/60 hover:text-ember-600 dark:border-slate-700/70 dark:text-slate-200"
              >
                {landing.hero_cta_secondary.text}
              </a>
            </div>
          </div>
          <PhoenixAnimation src={landing.phoenix_animation_asset} />
        </div>
      </section>

      <section id="about" className="scroll-mt-24 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">О проекте</p>
            <h2 className="section-title">Истории, которые возвращают опору</h2>
            <p className="muted text-base">{landing.about_text}</p>
          </div>
          <ul className="grid gap-3">
            {landing.about_points.map((point) => (
              <li key={point} className="card p-4 text-sm text-slate-700 dark:text-slate-200">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="process" className="scroll-mt-24 bg-slate-50/70 py-16 dark:bg-slate-900/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">Процесс</p>
            <h2 className="section-title">Как рождается история феникса</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {landing.process_steps.map((step, index) => (
              <div key={step} className="card card-hover flex flex-col gap-3 p-5">
                <span className="text-sm font-semibold text-ember-500">0{index + 1}</span>
                <p className="text-sm text-slate-700 dark:text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HeroesSection />

      <section id="value" className="scroll-mt-24 py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">Ценность</p>
            <h2 className="section-title">Почему фениксы делятся историей</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {landing.value_points.map((point) => (
              <div key={point} className="card card-hover p-5 text-sm text-slate-700 dark:text-slate-200">
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className="scroll-mt-24 bg-slate-50/70 py-16 dark:bg-slate-900/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">Контакты</p>
            <h2 className="section-title">Хотите стать героем?</h2>
            <p className="muted">Свяжитесь с нами в Telegram или по почте. Это не реклама — просто приглашение в проект.</p>
          </div>
          <div className="card flex flex-col gap-4 p-6 text-sm">
            <a className="text-ember-600 hover:underline" href={landing.contacts.telegram}>
              Telegram
            </a>
            <a className="text-ember-600 hover:underline" href={`mailto:${landing.contacts.email}`}>
              {landing.contacts.email}
            </a>
            <a className="text-ember-600 hover:underline" href={landing.contacts.form}>
              Заполнить форму
            </a>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">FAQ</p>
            <h2 className="section-title">Частые вопросы</h2>
          </div>
          <div className="grid gap-4">
            {landing.faq_items.map((item) => (
              <details key={item.question} className="card p-5">
                <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
