export interface Proyecto {
  title: string;
  description: string;
  tags: string[];
  image: string;
  href: string;
  status: 'live' | 'coming-soon';
  featured: boolean;
}

export const proyectos: Proyecto[] = [
  {
    title: 'Sushi Local',
    description: 'Una experiencia de marca para un sushi bar de Peñaflor: narrativa nocturna, carta clara y CTA directo a WhatsApp.',
    tags: ['Astro', 'Tailwind CSS', 'UX/UI'],
    image: '/proyectos/sushi-local.jpg',
    href: '/demo-pagina-sushi1/index.html',
    status: 'live',
    featured: true,
  },
  {
    title: 'Saber De Sabor Demo2',
    description: 'Segunda versión del sushi bar de Peñaflor: misma marca, ejecución más simple en HTML, CSS y JS puro, con menú, contacto y CTA a WhatsApp.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: '/proyectos/saber-de-sabor-demo2.jpg',
    href: '/demo-pagina-sushi2/index.html',
    status: 'live',
    featured: false,
  },
  {
    title: 'Archivo 003',
    description: 'Un nuevo sistema visual está tomando forma detrás de escena.',
    tags: ['Identidad', 'E-commerce'],
    image: '/proyectos/archivo-003.svg',
    href: '#',
    status: 'coming-soon',
    featured: false,
  },
];
