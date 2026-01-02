const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const heroesDir = path.join(process.cwd(), 'content', 'heroes');
const outputPath = path.join(process.cwd(), 'data', 'heroes-index.json');

if (!fs.existsSync(heroesDir)) {
  console.error('Heroes directory not found:', heroesDir);
  process.exit(1);
}

const files = fs.readdirSync(heroesDir).filter((file) => file.endsWith('.md'));

const heroes = files
  .map((file) => {
    const fullPath = path.join(heroesDir, file);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    if (data.published === false) {
      return null;
    }

    return {
      slug: data.slug,
      name: data.name,
      photo: data.photo,
      company: data.company || '',
      short_phrase: data.short_phrase,
      weight: data.weight || 0,
      tags: data.tags || [],
      socials: data.socials || [],
      full_story: content
    };
  })
  .filter(Boolean);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(heroes, null, 2));

console.log(`Generated heroes index: ${outputPath}`);
