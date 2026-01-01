export default function PhoenixAnimation({ src }) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-ember-500/40 via-orange-300/30 to-amber-300/40 blur-2xl" />
      <img
        src={src}
        alt="Феникс"
        loading="lazy"
        className="relative h-56 w-56 animate-[pulse_4s_ease-in-out_infinite] sm:h-72 sm:w-72"
      />
    </div>
  );
}
