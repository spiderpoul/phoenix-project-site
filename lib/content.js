import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const heroesDirectory = path.join(process.cwd(), 'content', 'heroes');

const getSlugFromFile = (file) => path.basename(file, path.extname(file));

const normalizeHero = (data, content, file) => {
  const slug = data.slug || getSlugFromFile(file);
  return {
    ...data,
    slug,
    position: data.position || data.company || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    socials: Array.isArray(data.socials) ? data.socials : [],
    content
  };
};

export function getAllHeroes() {
  const files = fs.readdirSync(heroesDirectory);
  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const fullPath = path.join(heroesDirectory, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return normalizeHero(data, content, file);
    })
    .filter((hero) => hero.published !== false);
}

export function getHeroBySlug(slug) {
  const files = fs.readdirSync(heroesDirectory);
  for (const file of files) {
    if (!file.endsWith('.md')) {
      continue;
    }
    const fullPath = path.join(heroesDirectory, file);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const hero = normalizeHero(data, content, file);
    if (hero.slug === slug) {
      return hero;
    }
  }
  return null;
}

export async function parseMarkdown(markdown) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
