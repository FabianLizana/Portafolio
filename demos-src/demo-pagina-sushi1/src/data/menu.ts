export interface MenuImage {
  img?: string;
  featured?: boolean;
}

export interface MenuItem extends MenuImage {
  name: string;
  desc: string;
  price: string;
}

export interface MenuCategory {
  id: string;
  title: string;
  subtitle: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: 'carta',
    title: 'Carta',
    subtitle: 'Nuestros rolls clásicos',
    items: [
      { name: 'Promo 1 (20 pz)', desc: 'Especial palta (camarón, queso crema) y Frito (pollo, queso crema, cebollín)', price: '$6.500', featured: true, img: '/images/promo-1.jpg' },
      { name: 'Promo 2 (20 pz)', desc: '2 tipos de fritos: Camarón, queso crema, cebollín y Pollo, queso crema, cebollín', price: '$6.000', featured: true, img: '/images/promo-2.jpg' },
      { name: 'Promo 3 (30 pz)', desc: 'Especial palta, California y Frito', price: '$9.000', featured: true, img: '/images/promo-3.jpg' },
      { name: 'Promo 4 (40 pz)', desc: 'Tempura, Pollo, Camarón, Panko, Kanikama y Palmito (con queso crema y cebollín)', price: '$12.000', featured: true, img: '/images/promo-4.jpg' },
      { name: 'Promo 5 (50 pz)', desc: 'Especial palta, Camarón, queso crema y más variedades', price: '$14.500', featured: true, img: '/images/promo-5.jpg' },
      { name: 'Promo 6 (60 pz)', desc: 'Especial palta, Salmón, queso crema, cebollín y más', price: '$18.900', featured: true, img: '/images/promo-6.jpg' },
      { name: 'Ceviche Mixto', desc: 'Salmón, reineta, baqueta y camarón', price: '$4.500', featured: true, img: '/images/ceviche.jpg' },
      { name: 'Volcán Peñaflor', desc: 'Salmón flambeado, queso crema, cebollín crocante, salsa acevichada', price: '$8.500', featured: true, img: '/images/volcan.jpg' },
    ],
  },
  {
    id: 'clasicos',
    title: 'Rolls Clásicos',
    subtitle: '8–10 piezas',
    items: [
      { name: 'California Roll', desc: 'Kanikama, palta, pepino', price: '$4.500' },
      { name: 'Salmón Roll', desc: 'Salmón, queso crema, cebollín', price: '$5.500' },
      { name: 'Ebi Roll', desc: 'Camarón furai, palta, panko', price: '$5.900' },
    ],
  },
  {
    id: 'especiales',
    title: 'Especiales de la Casa',
    subtitle: 'Los que nos hacen únicos',
    items: [
      { name: 'Dragon Roll', desc: 'Camarón tempura, palta laminada, salsa unagi', price: '$7.900' },
      { name: 'Rainbow Roll', desc: 'Surtido de pescados frescos sobre roll california', price: '$8.900' },
    ],
  },
  {
    id: 'nigiri',
    title: 'Nigiri & Sashimi',
    subtitle: 'Pescado puro, sin distracciones',
    items: [
      { name: 'Nigiri salmón', desc: '2 piezas · arroz y lámina de salmón fresco', price: '$2.500' },
      { name: 'Sashimi mixto', desc: '10 láminas · surtido de pescados del día', price: '$9.500' },
    ],
  },
  {
    id: 'veggie',
    title: 'Vegetarianos',
    subtitle: '100% verde, 100% sabor',
    items: [
      { name: 'Roll Palta-Queso', desc: 'Palta, queso crema, arroz y alga nori', price: '$4.000' },
      { name: 'Roll Vegetariano Crocante', desc: 'Verduras salteadas con panko crocante', price: '$4.500' },
    ],
  },
  {
    id: 'aperitivos',
    title: 'Aperitivos y Bocadillos',
    subtitle: 'Para empezar o picotear',
    items: [
      { name: 'Gyozas', desc: '5 unidades · dumplings rellenos de cerdo y verduras', price: '$3.500' },
      { name: 'Tempura de camarón', desc: '6 unidades · camarones rebozados, crujientes', price: '$4.900' },
      { name: 'Edamame', desc: 'Habas de soya cocidas con sal marina', price: '$2.500' },
    ],
  },
  {
    id: 'bebidas',
    title: 'Bebidas',
    subtitle: 'Para acompañar',
    items: [
      { name: 'Bebidas lata', desc: 'Coca-Cola, Sprite, Fanta, agua tónica', price: '$1.500' },
      { name: 'Té verde', desc: 'Té verde tradicional japonés, caliente', price: '$1.000' },
    ],
  },
  {
    id: 'postres',
    title: 'Postres',
    subtitle: 'El cierre dulce',
    items: [
      { name: 'Cheesecake de maracuyá', desc: 'Tarta de queso cremosa con coulis de maracuyá', price: '$3.500' },
      { name: 'Mochi helado', desc: '2 unidades · helado envuelto en masa de arroz', price: '$3.000' },
    ],
  },
];

// Imágenes locales de repuesto para items sin imagen propia
export const menuImages = ['/images/02.jpg', '/images/03.jpg', '/images/04.jpg'];
