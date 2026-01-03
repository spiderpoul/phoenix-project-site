import Head from 'next/head';
import Layout from '../components/Layout';
import FaqSection from '../components/FaqSection';
import ValueForHeroSection from '../components/ValueForHeroSection';
import join from '../content/join.json';

export default function JoinPage() {
  const faqItems = join.faqSection?.items || [];
  const faqJsonLd = faqItems.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      }
    : null;

  return (
    <Layout>
      <Head>
        <title>{join.title} — Debug выгорания</title>
        <meta name="description" content={join.subtitle} />
        {faqJsonLd ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        ) : null}
      </Head>
      <ValueForHeroSection content={join.value} />
      <section id="how-to" className="pb-16 pt-8">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">Как стать участником</p>
              <h1 className="text-4xl font-semibold">{join.title}</h1>
              <p className="muted mt-3 text-lg">{join.subtitle}</p>
            </div>
            <div className="grid gap-3">
              {join.steps.map((step, index) => (
                <div key={step} className="card flex items-center gap-4 p-4 text-sm">
                  <span className="text-sm font-semibold text-ember-500">0{index + 1}</span>
                  <span className="text-slate-700 dark:text-slate-200">{step}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Готовы рассказать историю?</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Напишите нам — обсудим формат, темп и комфортный уровень публичности.
              </p>
              <a
                href={join.cta.href}
                className="mt-5 inline-flex rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ember-600"
              >
                {join.cta.text}
              </a>
            </div>
            <div className="card p-6">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Что важно знать</h3>
              <ul className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                {join.notes.map((note) => (
                  <li key={note}>• {note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <FaqSection section={join.faqSection} />
    </Layout>
  );
}
