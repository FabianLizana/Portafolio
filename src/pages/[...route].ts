import { OGImageRoute } from 'astro-og-canvas';
import { site } from '../data/site';

export const { getStaticPaths, GET } = await OGImageRoute({
  pages: {
    og: {
      title: site.name,
      description: 'Portfolio / Diseño y desarrollo con intención.',
    },
  },
  getImageOptions: (_, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[9, 10, 13], [17, 20, 26], [9, 10, 13]],
    border: { color: [82, 243, 222], width: 12, side: 'block-start' },
    font: {
      title: { color: [82, 243, 222], size: 84 },
      description: { color: [220, 226, 224], size: 34 },
    },
  }),
});
