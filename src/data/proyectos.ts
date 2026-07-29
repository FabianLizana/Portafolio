export interface Proyecto {
  title: string;
  category: 'Web' | 'Automatización' | 'Social media';
  resultado: string;
  metrica: string;
  href: string;
  image?: string;
}

export const proyectos: Proyecto[] = [
  {
    title: 'Sushi Local',
    category: 'Web',
    resultado: 'Diseño de marca + menú digital',
    metrica: '15% más consultas por WhatsApp en el primer mes',
    href: '/demo-pagina-sushi1/index.html',
    image: '/proyectos/sushi-local.jpg',
  },
  {
    title: 'Saber De Sabor Demo2',
    category: 'Web',
    resultado: 'Landing page con carta interactiva',
    metrica: 'Carga en 1.2s · SEO local optimizado',
    href: '/demo-pagina-sushi2/index.html',
    image: '/proyectos/saber-de-sabor-demo2.jpg',
  },
  {
    title: 'Landing Page Premium',
    category: 'Web',
    resultado: 'Marca + tienda online completa',
    metrica: 'Catálogo + carrito · Diseño oscuro premium · 3 páginas',
    href: '/emberwood/index.html',
    image: '/emberwood/img/hero.jpg',
  },
  {
    title: 'Chatbot Inteligente',
    category: 'Automatización',
    resultado: 'Asistente 24/7 para atención al cliente',
    metrica: 'Próximamente',
    href: '#',
  },
  {
    title: 'Gestión de Redes',
    category: 'Social media',
    resultado: 'Planificación y generación con IA',
    metrica: 'Próximamente',
    href: '#',
  },
];
