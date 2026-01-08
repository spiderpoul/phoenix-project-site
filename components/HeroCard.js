import Image from 'next/image';
import Link from 'next/link';

function SocialIcon({ type }) {
  const icons = {
    telegram: '✈️',
    linkedin: '🔗',
    twitter: '🐦',
    github: '💻',
    website: '🌐'
  };
  return <span className="text-sm">{icons[type] || '🔗'}</span>;
}

export default function HeroCard({ hero, variant = 'full' }) {
  const maxTags = variant === 'compact' ? 2 : 3;
  const visibleTags = hero.tags.slice(0, maxTags);
  const extraCount = hero.tags.length - visibleTags.length;

  return (
    <Link
      href={`/heroes/${hero.slug}`}
      className="card card-hover group relative flex h-full flex-col gap-5 overflow-visible px-6 pb-6 pt-32"
    >
      <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-[23%] items-center justify-center">
        <div className="rounded-full border border-white bg-white p-1.5 shadow-sm dark:border-slate-900 dark:bg-slate-900">
          <Image
            src={hero.photo}
            alt={hero.name}
            width={132}
            height={132}
            className="h-33 w-33 rounded-full object-cover sm:h-33 sm:w-33"
            sizes="(min-width: 640px) 8.25rem, 8.25rem"
          />
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{hero.name}</h3>
        {hero.company && <p className="text-sm text-slate-500 dark:text-slate-300">{hero.company}</p>}
      </div>
      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-200">
        <p className="text-xs font-semibold uppercase tracking-widest text-ember-500">О чем история</p>
        <p className={`${variant === 'compact' ? 'line-clamp-4' : 'line-clamp-5'}`}>
          {hero.short_phrase}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {visibleTags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
        {extraCount > 0 && <span className="tag">+{extraCount}</span>}
      </div>
      {hero.socials?.length ? (
        <div className="mt-auto flex items-center justify-center gap-2 text-slate-500 transition group-hover:text-ember-500">
          {hero.socials.slice(0, 3).map((social) => (
            <span key={social.type} aria-label={social.type}>
              <SocialIcon type={social.type} />
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
