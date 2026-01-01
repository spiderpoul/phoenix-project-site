const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
const heroesDir = path.join(process.cwd(), 'content', 'heroes');
const publicDir = path.join(process.cwd(), 'public');

const files = fs.readdirSync(heroesDir).filter((file) => file.endsWith('.md'));
const heroes = files
  .map((file) => {
    const fullPath = path.join(heroesDir, file);
    const { data } = matter(fs.readFileSync(fullPath, 'utf8'));
    return data.published === false ? null : data.slug;
  })
  .filter(Boolean);

const urls = [
  `${baseUrl}/`,
  ...heroes.map((slug) => `${baseUrl}/heroes/${slug}/`)
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => `  <url><loc>${url}</loc></url>`)
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(
  path.join(publicDir, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`
);

console.log('Generated sitemap and robots.txt');
