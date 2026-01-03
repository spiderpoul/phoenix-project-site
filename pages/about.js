import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Layout from '../components/Layout';
import { parseMarkdown } from '../lib/content';

const ABOUT_PATH = path.join(process.cwd(), 'content', 'about.json');

const FALLBACK_ABOUT = {
  heroTitle: 'Debug выгорания',
  heroSubtitle: '50 историй IT-фениксов',
  heroLead: 'Истории восстановления и нового старта в IT.',
  heroPrimaryCtaText: 'Стать героем',
  heroPrimaryCtaHref: '/join',
  heroSecondaryCtaText: 'Посмотреть героев',
  heroSecondaryCtaHref: '/heroes',
  heroNote: '',
  sections: [],
  finalCtaTitle: 'Готовы стать частью книги?',
  finalCtaText: 'Поделитесь своей историей или поддержите героев.',
  finalCtaPrimaryText: 'Стать героем',
  finalCtaPrimaryHref: '/join',
  finalCtaSecondaryText: '',
  finalCtaSecondaryHref: ''
};

const iconMap = {
  sparkles: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 3l1.7 4.8L18 9.5l-4.3 1.7L12 16l-1.7-4.8L6 9.5l4.3-1.7L12 3z" />
      <path d="M5 4l.7 2L8 6.7 6 7.5 5 10l-.7-2L2 6.7 4 6 5 4z" />
      <path d="M19 13l.7 2 2.3.7-2.3.8L19 19l-.7-2-2.3-.8 2.3-.7 0-.1L19 13z" />
    </svg>
  ),
  heart: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M12 20s-6-4.4-8.2-7.4C1.7 9.7 3 6.5 5.9 6.1c2-.3 3.6.9 4.6 2.4 1-1.5 2.6-2.7 4.6-2.4 2.9.4 4.2 3.6 2.1 6.5C18 15.6 12 20 12 20z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
  compass: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M15.5 8.5l-2.3 6-6 2.3 2.3-6 6-2.3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
  book: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M5 5.5c0-1.1.9-2 2-2h11v15H7c-1.1 0-2 .9-2 2V5.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M7 5h11v14H7" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  shield: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M12 3l7 3v5.5c0 4.1-3 7.7-7 8.5-4-0.8-7-4.4-7-8.5V6l7-3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  flame: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M12 3c2.3 3 1.5 5.2.2 6.8-1.1 1.3-.5 3.2 1.3 3.5 2.2.4 3.5-1.4 4.3-3.1 2.2 3 .9 8.4-3.3 10.2-3.6 1.5-8.2-.3-9.4-4.3C3.8 12.3 6 8.9 9.3 7c1.6-.9 2.2-2.4 2.7-4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
};

const DefaultIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 8v8M8 12h8" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

function Icon({ name }) {
  const IconComponent = iconMap[name] || DefaultIcon;
  return <IconComponent className="h-5 w-5" />;
}

function MarkdownBlock({ html, className }) {
  if (!html) return null;
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

function ActionButton({ href, children, variant = 'primary' }) {
  if (!href || !children) return null;
  const base =
    'rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-500/60';
  const styles =
    variant === 'secondary'
      ? 'border border-slate-200/70 text-slate-700 hover:border-ember-500/60 hover:text-ember-600 dark:border-slate-700/70 dark:text-slate-200'
      : variant === 'ghost'
        ? 'border border-transparent text-slate-600 hover:text-ember-600 dark:text-slate-300'
        : 'bg-ember-500 text-white shadow-sm hover:bg-ember-600';
  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
    </a>
  );
}

function SectionRenderer({ section }) {
  if (!section) return null;
  const hasContent = section.title || section.bodyHtml || (section.items && section.items.length > 0);
  if (!hasContent) return null;

  if (section.variant === 'cards') {
    return (
      <section id={section.id} className="py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4">
          {section.title ? <h2 className="section-title">{section.title}</h2> : null}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {section.items?.map((item, index) => (
              <div
                key={item.title || item.icon || `${section.id}-card-${index}`}
                className="card card-hover flex h-full flex-col gap-3 p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-ember-500/20 bg-ember-500/10 text-ember-500">
                  <Icon name={item.icon} />
                </div>
                {item.title ? (
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                ) : null}
                <MarkdownBlock
                  html={item.descriptionHtml}
                  className="text-sm text-slate-600 dark:text-slate-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.variant === 'timeline') {
    return (
      <section id={section.id} className="py-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4">
          {section.title ? <h2 className="section-title">{section.title}</h2> : null}
          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/70">
            <ol className="relative space-y-6 border-l border-slate-200 pl-6 dark:border-slate-700">
              {section.items?.map((item, index) => (
                <li key={item.title || `${section.id}-step-${index}`} className="relative">
                  <span className="absolute -left-[33px] top-1.5 h-3 w-3 rounded-full border border-ember-500/60 bg-ember-500" />
                  {item.title ? (
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  ) : null}
                  <MarkdownBlock
                    html={item.descriptionHtml}
                    className="mt-2 text-sm text-slate-600 dark:text-slate-300"
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    );
  }

  if (section.variant === 'bullets') {
    const hasAside = Boolean(section.bodyHtml);
    return (
      <section id={section.id} className="py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4">
          {section.title ? <h2 className="section-title">{section.title}</h2> : null}
          <div className={hasAside ? 'grid gap-8 lg:grid-cols-[1.1fr_0.9fr]' : ''}>
            <div className="grid gap-4">
              {section.items?.map((item, index) => (
                <div key={item.title || `${section.id}-bullet-${index}`} className="card flex flex-col gap-2 p-5">
                  {item.title ? (
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  ) : null}
                  <MarkdownBlock
                    html={item.descriptionHtml}
                    className="text-sm text-slate-600 dark:text-slate-300"
                  />
                </div>
              ))}
            </div>
            {hasAside ? (
              <div className="card h-fit p-6">
                <MarkdownBlock
                  html={section.bodyHtml}
                  className="prose prose-sm text-slate-700 dark:prose-invert dark:text-slate-200"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  if (section.variant === 'cta') {
    const ctaButtons =
      section.items?.filter((item) => item.title && item.href).map((item, index) => (
        <ActionButton key={item.title} href={item.href} variant={index === 0 ? 'primary' : 'secondary'}>
          {item.title}
        </ActionButton>
      )) || [];

    if (!section.title && !section.bodyHtml && ctaButtons.length === 0) return null;

    return (
      <section id={section.id} className="py-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 text-center">
          {section.title ? <h2 className="section-title">{section.title}</h2> : null}
          <MarkdownBlock
            html={section.bodyHtml}
            className="prose mx-auto max-w-2xl text-slate-600 dark:prose-invert dark:text-slate-300"
          />
          {ctaButtons.length ? <div className="flex flex-wrap justify-center gap-4">{ctaButtons}</div> : null}
        </div>
      </section>
    );
  }

  const isPhoenix = section.id === 'phoenix';
  return (
    <section id={section.id} className="py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4">
        <div className={`relative overflow-hidden ${isPhoenix ? 'rounded-3xl border border-slate-200/70 p-8 dark:border-slate-800/80' : ''}`}>
          {isPhoenix ? (
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-6 top-6 text-5xl font-semibold uppercase tracking-[0.4em] text-slate-200/60 dark:text-slate-700/40">
                DEBUG
              </div>
              <div className="absolute bottom-6 right-6 text-4xl font-semibold uppercase tracking-[0.35em] text-slate-200/50 dark:text-slate-700/40">
                PHOENIX
              </div>
            </div>
          ) : null}
          <div className={isPhoenix ? 'relative z-10' : ''}>
            {section.title ? <h2 className="section-title">{section.title}</h2> : null}
            <MarkdownBlock
              html={section.bodyHtml}
              className="prose mt-4 max-w-3xl text-slate-600 dark:prose-invert dark:text-slate-300"
            />
            {section.items?.length ? (
              <div className="mt-6 border-l-4 border-ember-500/60 bg-ember-500/10 p-4">
                {section.items[0].title ? (
                  <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">
                    {section.items[0].title}
                  </p>
                ) : null}
                <MarkdownBlock
                  html={section.items[0].descriptionHtml}
                  className="mt-2 text-base text-slate-700 dark:text-slate-200"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage({ about }) {
  const pageTitle = about.heroTitle ? `${about.heroTitle} — Debug выгорания` : 'О проекте — Debug выгорания';
  const heroButtons = [
    about.heroPrimaryCtaText && about.heroPrimaryCtaHref
      ? {
          text: about.heroPrimaryCtaText,
          href: about.heroPrimaryCtaHref,
          variant: 'primary'
        }
      : null,
    about.heroSecondaryCtaText && about.heroSecondaryCtaHref
      ? {
          text: about.heroSecondaryCtaText,
          href: about.heroSecondaryCtaHref,
          variant: 'secondary'
        }
      : null
  ].filter(Boolean);

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={about.heroSubtitle} />
      </Head>

      <section className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-ember-500/20 blur-3xl" />
          <div className="absolute left-1/4 top-24 h-64 w-64 rounded-full bg-orange-400/10 blur-3xl" />
        </div>
        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-6 px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-ember-500">О проекте</p>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{about.heroTitle}</h1>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">{about.heroSubtitle}</p>
          </div>
          <MarkdownBlock
            html={about.heroLeadHtml}
            className="prose max-w-2xl text-slate-600 dark:prose-invert dark:text-slate-300"
          />
          {heroButtons.length ? (
            <div className="flex flex-wrap justify-center gap-4">
              {heroButtons.map((button) => (
                <ActionButton key={button.text} href={button.href} variant={button.variant}>
                  {button.text}
                </ActionButton>
              ))}
            </div>
          ) : null}
          {about.heroNote ? <p className="text-xs text-slate-500 dark:text-slate-400">{about.heroNote}</p> : null}
        </div>
      </section>

      {about.sections?.map((section, index) => (
        <SectionRenderer key={section.id || section.title || `section-${index}`} section={section} />
      ))}

      {(about.finalCtaTitle || about.finalCtaTextHtml) && (
        <section className="py-16">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 text-center">
            {about.finalCtaTitle ? <h2 className="section-title">{about.finalCtaTitle}</h2> : null}
            <MarkdownBlock
              html={about.finalCtaTextHtml}
              className="prose mx-auto max-w-2xl text-slate-600 dark:prose-invert dark:text-slate-300"
            />
            <div className="flex flex-wrap justify-center gap-4">
              <ActionButton href={about.finalCtaPrimaryHref} variant="primary">
                {about.finalCtaPrimaryText}
              </ActionButton>
              {about.finalCtaSecondaryText && about.finalCtaSecondaryHref ? (
                <ActionButton href={about.finalCtaSecondaryHref} variant="secondary">
                  {about.finalCtaSecondaryText}
                </ActionButton>
              ) : null}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const isDev = process.env.NODE_ENV !== 'production';
  const heroLeadFallback = isDev
    ? 'Контент страницы ещё не заполнен.'
    : 'Истории восстановления и нового старта в IT.';

  let rawData = null;
  if (fs.existsSync(ABOUT_PATH)) {
    rawData = JSON.parse(fs.readFileSync(ABOUT_PATH, 'utf8'));
  }

  const aboutData = {
    ...FALLBACK_ABOUT,
    heroLead: heroLeadFallback,
    ...rawData,
    heroPrimaryCtaHref: rawData?.heroPrimaryCtaHref || FALLBACK_ABOUT.heroPrimaryCtaHref,
    heroSecondaryCtaHref: rawData?.heroSecondaryCtaHref || FALLBACK_ABOUT.heroSecondaryCtaHref,
    finalCtaPrimaryHref: rawData?.finalCtaPrimaryHref || FALLBACK_ABOUT.finalCtaPrimaryHref
  };

  const heroLeadHtml = aboutData.heroLead ? await parseMarkdown(aboutData.heroLead) : '';
  const finalCtaTextHtml = aboutData.finalCtaText ? await parseMarkdown(aboutData.finalCtaText) : '';

  const sections =
    aboutData.sections?.length > 0
      ? await Promise.all(
          aboutData.sections.map(async (section) => {
            const bodyHtml = section.body ? await parseMarkdown(section.body) : '';
            const items = section.items
              ? await Promise.all(
                  section.items.map(async (item) => ({
                    ...item,
                    descriptionHtml: item.description ? await parseMarkdown(item.description) : ''
                  }))
                )
              : [];
            return {
              ...section,
              bodyHtml,
              items
            };
          })
        )
      : [];

  return {
    props: {
      about: {
        ...aboutData,
        heroLeadHtml,
        finalCtaTextHtml,
        sections
      }
    }
  };
}
