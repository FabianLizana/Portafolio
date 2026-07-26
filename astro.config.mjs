// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://portfolio.fabianlizana.dev';

export default defineConfig({
  site: SITE,
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
