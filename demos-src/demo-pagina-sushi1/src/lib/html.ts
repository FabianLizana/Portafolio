import { menuImages } from '../data/menu';

export const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export function nextImageFactory() {
  let i = 0;
  return () => menuImages[i++ % menuImages.length];
}

export const whatsappLink = 'https://wa.me/56973341304';
