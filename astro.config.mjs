// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://fabianlizana.github.io';
const BASE = '/Portafolio/';

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
