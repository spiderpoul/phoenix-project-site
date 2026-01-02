const HIGHLIGHT_PHRASE = '«меня опубликовали»';

function HighlightedText({ text }) {
  if (!text.includes(HIGHLIGHT_PHRASE)) {
    return text;
  }

  const [before, after] = text.split(HIGHLIGHT_PHRASE);

  return (
    <>
      {before}
      <span className="font-semibold text-ember-500">{HIGHLIGHT_PHRASE}</span>
      {after}
    </>
  );
}

export default function ValueForHeroSection({ content }) {
  return (
    <section id="value" className="pb-8 pt-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">
              {content.subtitle}
            </p>
            <h2 className="section-title mt-2 text-3xl sm:text-4xl">{content.title}</h2>
          </div>
          <div className="grid gap-2 text-lg text-slate-700 dark:text-slate-200">
            {content.lead.map((line) => (
              <p key={line}>
                <HighlightedText text={line} />
              </p>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {content.items.map((item) => (
            <div key={item.title} className="card card-hover flex h-full flex-col gap-4 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              {item.text ? <p className="text-sm text-slate-600 dark:text-slate-300">{item.text}</p> : null}
              {item.listTitle ? (
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.listTitle}</p>
              ) : null}
              {item.list?.length ? (
                <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600 marker:text-ember-400 dark:text-slate-300">
                  {item.list.map((listItem) => (
                    <li key={listItem}>{listItem}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
