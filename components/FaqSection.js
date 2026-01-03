import { useId, useState } from 'react';

const LIST_MARKER = /^[-•*]\s+/;

const parseAnswer = (answer) => {
  const lines = answer.split('\n').map((line) => line.trim());
  const blocks = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({ type: 'list', items: currentList });
      currentList = [];
    }
  };

  lines.forEach((line) => {
    if (!line) {
      flushList();
      return;
    }

    if (LIST_MARKER.test(line)) {
      currentList.push(line.replace(LIST_MARKER, ''));
      return;
    }

    flushList();
    blocks.push({ type: 'paragraph', text: line });
  });

  flushList();
  return blocks;
};

export default function FaqSection({ section }) {
  if (!section) {
    return null;
  }

  const {
    title = 'FAQ',
    subtitle,
    items = [],
    behavior = {},
    cta = {}
  } = section;
  const mode = behavior.mode === 'multi' ? 'multi' : 'single';
  const defaultOpenIndex =
    Number.isInteger(behavior.defaultOpenIndex) && behavior.defaultOpenIndex >= 0
      ? behavior.defaultOpenIndex
      : null;

  const orderedItems = items.some((item) => typeof item.order === 'number')
    ? [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : items;

  const [openItems, setOpenItems] = useState(() => {
    if (mode === 'multi') {
      return defaultOpenIndex === null ? [] : [defaultOpenIndex];
    }
    return defaultOpenIndex;
  });
  const baseId = useId();

  const isItemOpen = (index) => {
    if (mode === 'multi') {
      return openItems.includes(index);
    }
    return openItems === index;
  };

  const toggleItem = (index) => {
    if (mode === 'multi') {
      setOpenItems((prev) =>
        prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
      );
      return;
    }
    setOpenItems((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="pb-16 pt-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">FAQ</p>
          <h2 className="section-title mt-2">{title}</h2>
          {subtitle ? <p className="muted mt-3 text-lg">{subtitle}</p> : null}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {orderedItems.map((item, index) => {
            const isOpen = isItemOpen(index);
            const buttonId = `${baseId}-button-${index}`;
            const panelId = `${baseId}-panel-${index}`;
            const blocks = parseAnswer(item.answer || '');

            return (
              <div
                key={item.question}
                className={`card overflow-hidden transition ${
                  item.isFeatured ? 'border-ember-500/50 shadow-ember-500/10' : ''
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-controls={panelId}
                    aria-expanded={isOpen}
                    onClick={() => toggleItem(index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-500 dark:text-white dark:hover:bg-slate-800/70"
                  >
                    <span>{item.question}</span>
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-lg font-semibold ${
                        isOpen
                          ? 'border-ember-500/70 text-ember-500'
                          : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400'
                      }`}
                      aria-hidden="true"
                    >
                      {isOpen ? '–' : '+'}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid gap-3 px-5 text-sm text-slate-600 transition-[max-height,opacity] duration-200 dark:text-slate-300 ${
                    isOpen ? 'max-h-[1000px] pb-5 opacity-100' : 'max-h-0 pb-0 opacity-0'
                  } overflow-hidden`}
                >
                  {blocks.map((block, blockIndex) => {
                    if (block.type === 'list') {
                      return (
                        <ul key={`${panelId}-list-${blockIndex}`} className="grid gap-1 pl-4">
                          {block.items.map((listItem) => (
                            <li key={listItem} className="list-disc">
                              {listItem}
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    return <p key={`${panelId}-p-${blockIndex}`}>{block.text}</p>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {cta.primaryLabel ? (
            <a
              href={cta.primaryHref}
              className="inline-flex rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ember-600"
            >
              {cta.primaryLabel}
            </a>
          ) : null}
          {cta.secondaryLabel ? (
            <a
              href={cta.secondaryHref}
              className="text-sm font-semibold text-ember-500 transition hover:text-ember-600"
            >
              {cta.secondaryLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
