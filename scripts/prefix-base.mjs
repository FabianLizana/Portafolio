import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const BASE = '/Portafolio/';

const TEXT_EXT = new Set(['.html', '.css', '.js', '.mjs', '.json', '.svg', '.webmanifest', '.xml', '.txt']);

const ABS_ROOT = /((?:src|href|action|poster|data-src|data-lottie|content)\s*=\s*["']|\burl\(\s*["']?|\bfetch\(\s*["']?)(\/[^"')]+?)\s*["')]/g;

function isRootRelative(path) {
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//')) return false;
  if (path.startsWith(BASE)) return false;
  if (/^(?:\/Portafolio\/)/.test(path)) return false;
  return true;
}

function rewritePath(path) {
  if (!isRootRelative(path)) return path;
  return BASE + path.replace(/^\//, '');
}

function processFile(file) {
  const text = readFileSync(file, 'utf8');
  const out = text.replace(ABS_ROOT, (match, prefix, path) => {
    const rewritten = rewritePath(path);
    return prefix + rewritten;
  });
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
        const matches = text.match(ABS_ROOT);
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