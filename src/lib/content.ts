import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export type LandingContent = {
  hero: {
    title: string;
    subtitle: string;
    ctaPrimaryText: string;
    ctaPrimaryHref: string;
    ctaSecondaryText: string;
    ctaSecondaryHref: string;
  };
  about: {
    title: string;
    text: string;
    points: string[];
  };
  process: {
    title: string;
    steps: { title: string; text: string }[];
  };
  heroes: {
    title: string;
    subtitle: string;
  };
  value: {
    title: string;
    points: string[];
  };
  contacts: {
    title: string;
    text: string;
    links: { label: string; href: string }[];
  };
  faq?: {
    items: { q: string; a: string }[];
  };
  branding: {
    phoenixLogo: string;
    animationAsset?: string;
  };
};

export type HeroSocial = {
  type: string;
  url: string;
};

export type Hero = {
  slug: string;
  name: string;
  photo: string;
  shortPhrase: string;
  company?: string;
  tags: string[];
  story: string;
  socials: HeroSocial[];
  seo?: {
    title?: string;
    description?: string;
  };
};

const contentDir = path.join(process.cwd(), "content");
const heroesDir = path.join(contentDir, "heroes");

export function getLandingContent(): LandingContent {
  const filePath = path.join(contentDir, "landing.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as LandingContent;
}

export function getHeroSlugs(): string[] {
  return fs
    .readdirSync(heroesDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getHeroBySlug(slug: string): Hero {
  const filePath = path.join(heroesDir, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug: data.slug as string,
    name: data.name as string,
    photo: data.photo as string,
    shortPhrase: data.shortPhrase as string,
    company: data.company as string | undefined,
    tags: (data.tags as string[]) ?? [],
    socials: (data.socials as HeroSocial[]) ?? [],
    seo: data.seo as { title?: string; description?: string } | undefined,
    story: content.trim()
  };
}

export function getAllHeroes(): Hero[] {
  return getHeroSlugs()
    .map((slug) => getHeroBySlug(slug))
    .sort((a, b) => a.name.localeCompare(b.name, "ru"));
}

export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown) as string;
}

export function markdownToText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[#>*_`~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
