import Image from 'next/image';

function getInitials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export default function HeroAvatar({
  name,
  photo,
  size = 132,
  className = '',
  sizes,
  priority = false
}) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={name}
        width={size}
        height={size}
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    <div
      aria-label={name}
      className={`flex items-center justify-center bg-gradient-to-br from-ember-500 to-orange-400 font-semibold text-white ${className}`}
      style={{ width: size, height: size }}
    >
      <span>{getInitials(name) || 'IT'}</span>
    </div>
  );
}
