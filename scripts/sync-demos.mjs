import { cpSync, existsSync, rmSync, readdirSync, readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { resolve, join, relative, isAbsolute } from 'node:path';

const projectRoot = resolve('.');
const onlyIndex = process.argv.indexOf('--only');
const only = onlyIndex !== -1 ? process.argv[onlyIndex + 1] : null;

const demos = [
  {
    name: 'sushi1',
    label: 'Sushi Local',
    source: process.env.SUSHI_DEMO_DIST
      ? resolve(process.env.SUSHI_DEMO_DIST)
      : resolve('demos-src/demo-pagina-sushi1/dist'),
    destination: resolve('public/demo-pagina-sushi1'),
    base: 'demo-pagina-sushi1',
    rewritePaths: true,
    missingHint: 'Construye la demo con: npm run sushi:build',
  },
  {
    name: 'sushi2',
    label: 'Saber De Sabor Demo2',
    source: resolve('demos-src/demo-pagina-sushi2'),
    destination: resolve('public/demo-pagina-sushi2'),
    base: 'demo-pagina-sushi2',
    rewritePaths: false,
    missingHint: 'Crea la demo estática en demos-src/demo-pagina-sushi2',
  },
  {
    name: 'emberwood',
    label: 'Emberwood Artisan Pages',
    source: resolve('demos-src/emberwood'),
    destination: resolve('public/emberwood'),
    base: 'emberwood',
    rewritePaths: false,
    missingHint: 'Crea la demo estática en demos-src/emberwood',
  },
];

if (only && !demos.some((demo) => demo.name === only)) {
  console.error(`[sync:demos] Demo desconocida: ${only}`);
  process.exit(1);
}

const ensureInsidePublic = (destination) => {
  const rel = relative(projectRoot, destination);
  if (!rel.startsWith('public') || isAbsolute(rel) || rel.startsWith('..')) {
    throw new Error(`[sync:demos] destino fuera de public/: ${destination}`);
  }
};

const collectEol = (dir) => {
  const map = new Map();
  if (!existsSync(dir)) return map;

  const walk = (current, rel = '') => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name);
      const relPath = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(full, relPath);
      } else if (entry.name.endsWith('.html')) {
        map.set(relPath, readFileSync(full, 'utf8').includes('\r\n') ? 'crlf' : 'lf');
      }
    }
  };

  walk(dir);
  return map;
};

const rewriteHtml = (dir, demo, previousEol, staging) => {
  let rewritten = 0;
  const placeholder = '__DEMO_BASE__/';

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      rewritten += rewriteHtml(full, demo, previousEol, staging);
    } else if (entry.name.endsWith('.html')) {
      let c = readFileSync(full, 'utf8');

      if (demo.rewritePaths) {
        // Evita duplicar el prefijo si ya venía aplicado.
        c = c.split(`/${demo.base}/`).join(placeholder);

        // Prefija assets incluso dentro de JSON (&quot;), template literals,
        // CSS url(...) o atributos normales, no solo entre comillas.
        c = c.replace(/(^|["'`(=;\s])\/(_astro|fontawesome|images)\//g, `$1${placeholder}$2/`);
        c = c.replace(/(^|["'`(=;\s])\/(favicon\.(?:svg|ico))/g, `$1${placeholder}$2`);

        // Enlaces internos a las páginas del demo.
        c = c.replace(/href=(["'])\/\1/g, `href=$1/${demo.base}/index.html$1`);
        c = c.replace(/href=(["'])\/menu\/?\1/g, `href=$1/${demo.base}/menu/index.html$1`);
        c = c.replace(/href=(["'])\/contacto\/?\1/g, `href=$1/${demo.base}/contacto/index.html$1`);

        c = c.split(placeholder).join(`/${demo.base}/`);
      }

      const rel = relative(staging, full).split('\\').join('/');
      if (previousEol.get(rel) === 'crlf') {
        c = c.replace(/\r?\n/g, '\r\n');
      }

      writeFileSync(full, c, 'utf8');
      rewritten++;
    }
  }

  return rewritten;
};

const syncDemo = (demo) => {
  if (only && demo.name !== only) return;

  ensureInsidePublic(demo.destination);

  if (!existsSync(demo.source)) {
    console.warn(`[sync:${demo.name}] No se encontró ${demo.source}`);
    console.warn(`[sync:${demo.name}] ${demo.missingHint}`);
    return;
  }

  const previousEol = collectEol(demo.destination);
  rmSync(demo.destination, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });

  const staging = resolve(projectRoot, `.${demo.name}-staging`);
  rmSync(staging, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  cpSync(demo.source, staging, { recursive: true });

  const count = rewriteHtml(staging, demo, previousEol, staging);

  mkdirSync(resolve(projectRoot, 'public'), { recursive: true });
  try {
    renameSync(staging, demo.destination);
  } catch {
    cpSync(staging, demo.destination, { recursive: true });
    rmSync(staging, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }

  console.log(`[sync:${demo.name}] ${demo.label} sincronizado en ${demo.destination} (${count} HTML)`);
};

for (const demo of demos) {
  syncDemo(demo);
}
