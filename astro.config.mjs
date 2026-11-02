// @ts-nocheck
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import path from 'path';

const SITE = 'https://fabianlizana.github.io';
const BASE = '/Portafolio/';

const IS_DEV = process.argv.includes('dev');

export default defineConfig({
  site: SITE,
  base: IS_DEV ? '/' : BASE,
  output: 'static',
  integrations: [
    sitemap({
      customPages: [
        `${SITE}${BASE}demo-pagina-sushi1/`,
        `${SITE}${BASE}demo-pagina-sushi2/`,
        `${SITE}${BASE}emberwood/`,
      ],
    }),
  ],
  security: {
    csp: {
      algorithm: 'SHA-256',
      // Los atributos style="" (variables CSS por card) se permiten aparte;
      // las etiquetas <style> siguen protegidas con hashes.
      styleDirective: {
        resources: [
          "'self'",
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-src https://www.google.com https://maps.google.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "manifest-src 'self'",
        'upgrade-insecure-requests',
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },
});
