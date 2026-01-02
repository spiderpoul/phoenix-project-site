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
      className="card card-hover group flex h-full flex-col gap-4 p-5"
    >
      <div className="flex items-center gap-4">
        <img
          src={hero.photo}
          alt={hero.name}
          className="h-16 w-16 rounded-2xl object-cover"
          loading="lazy"
        />
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{hero.name}</h3>
          {hero.company && <p className="text-sm text-slate-500 dark:text-slate-300">{hero.company}</p>}
        </div>
      </div>
      <p className={`${variant === 'compact' ? 'line-clamp-1' : 'line-clamp-2'} text-sm text-slate-600 dark:text-slate-200`}>
        {hero.short_phrase}
      </p>
      <div className="flex flex-wrap gap-2">
        {visibleTags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
        {extraCount > 0 && <span className="tag">+{extraCount}</span>}
      </div>
      {hero.socials?.length ? (
        <div className="mt-auto flex items-center gap-2 text-slate-500 transition group-hover:text-ember-500">
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
