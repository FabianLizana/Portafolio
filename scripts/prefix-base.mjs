import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const BASE = '/Portafolio/';

const TEXT_EXT = new Set(['.html', '.css', '.js', '.mjs', '.json', '.svg', '.webmanifest', '.xml', '.txt']);

function isRootRelative(path) {
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//')) return false;
  if (path.startsWith(BASE)) return false;
  return true;
}

function rewritePath(path) {
  if (!isRootRelative(path)) return path;
  return BASE + path.replace(/^\//, '');
}

const ATTR_URL = /((?:src|href|poster|action|data-src|data-lottie|content)\s*=\s*["'])(\/[^"')\s>]+)(["')])/g;

function rewriteAttr(_match, attr, path, suffix) {
  return attr + rewritePath(path) + suffix;
}

const SRCSET_URL = /([^"')\s,>]+)/g;

const CSS_URL = /\burl\(\s*(?:(["'])([^"')]+)\1|([^"')]+))\s*\)/g;

function rewriteCssUrl(_match, g1, g2, g3) {
  const url = g2 ?? g3;
  const q = g1 ?? '';
  return `url(${q}${rewritePath(url)}${q})`;
}

function processFile(file) {
  const text = readFileSync(file, 'utf8');
  let out = text
    .replace(/((?:src|href|poster|action|data-src|data-lottie|content)\s*=\s*["'])(\/[^"')\s>]+)(["')])/g, rewriteAttr)
    .replace(/\b(srcset|imagesrcset)\s*=\s*(["'])([^"']*)(["'])/g, (_m, attrName, q1, list, q2) => {
      const rewritten = list.replace(SRCSET_URL, (mm) => {
        const trimmed = mm.trim();
        const rewrittenPath = rewritePath(trimmed);
        const spacesBefore = mm.length - mm.trimStart().length;
        const spacesAfter = mm.length - mm.trimEnd().length;
        return ' '.repeat(spacesBefore) + rewrittenPath + ' '.repeat(spacesAfter);
      });
      return `${attrName}=${q1}${rewritten}${q2}`;
    })
    .replace(CSS_URL, rewriteCssUrl);
  if (out !== text) {
    writeFileSync(file, out, 'utf8');
  }
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      walk(full);
    } else if (TEXT_EXT.has(extname(full).toLowerCase())) {
      processFile(full);
    }
  }
}

if (process.argv.includes('--dry-run')) {
  let count = 0;
  const walkDry = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stats = statSync(full);
      if (stats.isDirectory()) walkDry(full);
      else if (TEXT_EXT.has(extname(full).toLowerCase())) {
        const text = readFileSync(full, 'utf8');
        const matches = text.match(ATTR_URL);
        if (matches) { count += matches.length; console.log(full); }
      }
    }
  };
  walkDry(DIST);
  console.log(`Total root-relative refs: ${count}`);
} else {
  walk(DIST);
  console.log('[prefix-base] Prefijadas rutas raiz con ' + BASE);
}