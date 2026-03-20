import Link from 'next/link';
import HeroAvatar from './HeroAvatar';

function SocialIcon({ type }) {
  const icons = {
    telegram: '✈️',
    linkedin: '🔗',
    twitter: '🐦',
    github: '💻',
    website: '🌐'
  };
  const normalized = type?.toLowerCase();
  return <span className="text-sm">{icons[normalized] || '🔗'}</span>;
}

export default function HeroCard({ hero, variant = 'full' }) {
  const maxTags = variant === 'compact' ? 2 : 3;
  const tags = Array.isArray(hero.tags) ? hero.tags : [];
  const visibleTags = tags.slice(0, maxTags);
  const extraCount = tags.length - visibleTags.length;

  return (
    <Link
      href={`/heroes/${hero.slug}`}
      className="card card-hover group relative flex h-full flex-col gap-5 overflow-visible px-6 pb-6 pt-32"
    >
      <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-[23%] items-center justify-center">
        <div className="rounded-full border border-white bg-white p-1.5 shadow-sm dark:border-slate-900 dark:bg-slate-900">
          <HeroAvatar
            name={hero.name}
            photo={hero.photo}
            size={132}
            className="h-33 w-33 rounded-full object-cover text-3xl sm:h-33 sm:w-33"
            sizes="(min-width: 640px) 8.25rem, 8.25rem"
          />
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{hero.name}</h3>
        {hero.position && (
          <p className="whitespace-pre-line text-sm text-slate-500 dark:text-slate-300">{hero.position}</p>
        )}
      </div>
      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-200">
        <p className="text-xs font-semibold uppercase tracking-widest text-ember-500">О чем история</p>
        <p className={`whitespace-pre-line ${variant === 'compact' ? 'line-clamp-4' : 'line-clamp-5'}`}>
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
