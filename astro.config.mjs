// @ts-nocheck
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://fabianlizana.github.io';
const BASE = '/Portafolio/';

const IS_DEV = process.argv.includes('dev');

export default defineConfig({
  site: SITE,
  base: IS_DEV ? '/' : BASE,
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
