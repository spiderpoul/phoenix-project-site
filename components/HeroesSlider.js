import { useEffect, useRef, useState } from 'react';
import HeroCard from './HeroCard';

export default function HeroesSlider({ heroes }) {
  const listRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = listRef.current;
    if (!el) {
      return;
    }
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    const el = listRef.current;
    if (!el) {
      return;
    }
    const handleScroll = () => updateScrollState();
    el.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [heroes]);

  const scrollByAmount = (amount) => {
    listRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div className="absolute right-0 top-0 hidden items-center gap-2 sm:flex">
        <button
          type="button"
          onClick={() => scrollByAmount(-320)}
          className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
            canScrollLeft
              ? 'border-slate-200/70 text-slate-600 hover:border-ember-500/60 hover:text-ember-600 dark:border-slate-700/70 dark:text-slate-200'
              : 'cursor-not-allowed border-slate-200/40 text-slate-300 dark:border-slate-800/60 dark:text-slate-600'
          }`}
          aria-label="Прокрутить влево"
          disabled={!canScrollLeft}
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollByAmount(320)}
          className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
            canScrollRight
              ? 'border-slate-200/70 text-slate-600 hover:border-ember-500/60 hover:text-ember-600 dark:border-slate-700/70 dark:text-slate-200'
              : 'cursor-not-allowed border-slate-200/40 text-slate-300 dark:border-slate-800/60 dark:text-slate-600'
          }`}
          aria-label="Прокрутить вправо"
          disabled={!canScrollRight}
        >
          →
        </button>
      </div>
      <div
        ref={listRef}
        className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-4 pt-10"
        role="list"
        aria-label="Список героев"
      >
        {heroes.map((hero) => (
          <div key={hero.slug} className="min-w-[300px] flex-1 sm:min-w-[340px] lg:min-w-[360px]">
            <HeroCard hero={hero} variant="compact" />
          </div>
        ))}
      </div>
    </div>
  );
}
