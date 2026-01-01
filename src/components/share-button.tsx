"use client";

import { useState } from "react";

type Props = {
  title: string;
};

export function ShareButton({ title }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // ignore
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-full border border-ember-400/70 bg-ember-500/10 px-4 py-2 text-sm font-semibold text-ember-700 transition hover:bg-ember-500/20 dark:text-ember-200"
    >
      {copied ? "Ссылка скопирована" : "Поделиться"}
    </button>
  );
}
