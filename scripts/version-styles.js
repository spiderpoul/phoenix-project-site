// Version exported stylesheet URLs so browsers discard an interrupted older download.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.join(__dirname, '..', 'out');
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
for (const file of walk(root).filter(file => file.endsWith('.html'))) {
  const before = fs.readFileSync(file, 'utf8');
  const after = before.replace(/(href=")([^"?]+\.css)(?:\?[^" ]*)?(")/g, (match, start, url, end) => {
    if (!url.startsWith('/_next/')) return match;
    const css = fs.readFileSync(path.join(root, url));
    const version = crypto.createHash('sha256').update(css).digest('hex').slice(0, 12);
    return `${start}${url}?v=${version}${end}`;
  });
  if (before !== after) fs.writeFileSync(file, after);
}
