import { cpSync, existsSync, rmSync, readdirSync, readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { resolve, join, relative, isAbsolute } from 'node:path';

const source = process.env.SUSHI_DEMO_DIST
  ? resolve(process.env.SUSHI_DEMO_DIST)
  : resolve('../demo-pagina-sushi1/dist');
const destination = resolve('public/demo-pagina-sushi1');
const BASE = 'demo-pagina-sushi1';

// Defensiva: el destino debe vivir siempre dentro de este proyecto
const projectRoot = resolve('.');
const destRel = relative(projectRoot, destination);
if (!destRel.startsWith('public') || isAbsolute(destRel) || destRel.startsWith('..')) {
  console.error(`[sync:sushi] destination fuera del proyecto: ${destination}`);
  process.exit(1);
}

if (!existsSync(source)) {
  console.warn(`[sync:sushi] No se encontro el build de Sushi Local: ${source}`);
  process.exit(0);
}

// Borra el destino anterior (ya validado dentro de public/)
rmSync(destination, { recursive: true, force: true });

// Copia primero a un directorio temporal dentro del proyecto y luego
// renombra — operación más atómica que rm+cp: si cp falla a mitad, el
// destino anterior ya está borrado, pero el temporal queda para inspección.
const staging = resolve(projectRoot, '.sushi-staging');
rmSync(staging, { recursive: true, force: true });
cpSync(source, staging, { recursive: true });

const Q = ['"', '"'];

const rewriteHtml = (dir) => {
  let rewritten = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      rewritten += rewriteHtml(full);
    } else if (entry.name.endsWith('.html')) {
      let c = readFileSync(full, 'utf8');
      for (const q of Q) {
        c = c.replaceAll(`${q}/_astro/`, `${q}/${BASE}/_astro/`);
        c = c.replaceAll(`${q}/fontawesome/`, `${q}/${BASE}/fontawesome/`);
        c = c.replaceAll(`${q}/images/`, `${q}/${BASE}/images/`);
        c = c.replaceAll(`${q}/favicon.svg${q}`, `${q}/${BASE}/favicon.svg${q}`);
        c = c.replaceAll(`${q}/favicon.ico${q}`, `${q}/${BASE}/favicon.ico${q}`);
        c = c.replaceAll(`href=${q}/${q}`, `href=${q}/${BASE}/index.html${q}`);
        c = c.replaceAll(`href=${q}/menu${q}`, `href=${q}/${BASE}/menu/index.html${q}`);
        c = c.replaceAll(`href=${q}/menu/${q}`, `href=${q}/${BASE}/menu/index.html${q}`);
        c = c.replaceAll(`href=${q}/contacto${q}`, `href=${q}/${BASE}/contacto/index.html${q}`);
        c = c.replaceAll(`href=${q}/contacto/${q}`, `href=${q}/${BASE}/contacto/index.html${q}`);
      }
      writeFileSync(full, c, 'utf8');
      rewritten++;
    }
  }
  return rewritten;
};

const count = rewriteHtml(staging);

// Reposición final: renombra el staging al destino
if (existsSync(destination)) {
  rmSync(destination, { recursive: true, force: true });
}
mkdirSync(resolve(projectRoot, 'public'), { recursive: true });
renameSync(staging, destination);

console.log(`[sync:sushi] Sushi Local sincronizado en ${destination} (${count} HTML reescritos con base /${BASE}/)`);
