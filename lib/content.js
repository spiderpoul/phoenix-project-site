import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const heroesDirectory = path.join(process.cwd(), 'content', 'heroes');

export function getAllHeroes() {
  const files = fs.readdirSync(heroesDirectory);
  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const fullPath = path.join(heroesDirectory, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        ...data,
        content
      };
    })
    .filter((hero) => hero.published !== false);
}

export function getHeroBySlug(slug) {
  const files = fs.readdirSync(heroesDirectory);
  const match = files.find((file) => file.includes(slug));
  if (!match) return null;
  const fullPath = path.join(heroesDirectory, match);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return { ...data, content };
}

export async function parseMarkdown(markdown) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
