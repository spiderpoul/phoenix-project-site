import Head from 'next/head';
import Layout from '../components/Layout';
import about from '../content/about.json';

export default function AboutPage() {
  return (
    <Layout>
      <Head>
        <title>{about.title} — Debug выгорания</title>
        <meta name="description" content={about.subtitle} />
      </Head>
      <section className="py-16">
        <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">О проекте</p>
            <h1 className="text-4xl font-semibold">{about.title}</h1>
            <p className="muted text-lg">{about.subtitle}</p>
          </div>
          <div className="grid gap-6">
            {about.sections.map((section) => (
              <div key={section.title} className="card p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{section.title}</h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{section.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
