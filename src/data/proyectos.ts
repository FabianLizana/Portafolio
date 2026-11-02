export interface Proyecto {
  title: string;
  category: 'Web' | 'Automatización' | 'Social media' | 'Multimedia';
  resultado: string;
  metrica: string;
  href: string;
  image?: string;
  lottie?: string;
}

export const proyectos: Proyecto[] = [
  {
    title: 'Sushi Local',
    category: 'Web',
    resultado: 'Diseño de marca + menú digital',
    metrica: '15% más consultas por WhatsApp en el primer mes',
    href: '/demo-pagina-sushi1/index.html',
    image: '/proyectos/sushi-local-card.webp',
  },
  {
    title: 'Saber De Sabor Demo2',
    category: 'Web',
    resultado: 'Landing page con carta interactiva',
    metrica: 'Carga en 1.2s · SEO local optimizado',
    href: '/demo-pagina-sushi2/index.html',
    image: '/proyectos/saber-de-sabor-demo2.webp',
  },
  {
    title: 'Landing Page Premium',
    category: 'Web',
    resultado: 'Marca + tienda online completa',
    metrica: 'Catálogo + carrito · Diseño oscuro premium · 3 páginas',
    href: '/emberwood/index.html',
    image: '/proyectos/emberwood-card.webp',
  },
  {
    title: 'Chatbot Inteligente',
    category: 'Automatización',
    resultado: 'Asistente 24/7 para atención al cliente',
    metrica: 'Próximamente',
    href: '#',
    lottie: '/animaciones/cute-robot-flying.lottie',
  },
  {
    title: 'Gestión de Redes',
    category: 'Social media',
    resultado: 'Planificación y generación con IA',
    metrica: 'Próximamente',
    href: '#',
    image: '/proyectos/gestion-redes-card.svg',
  },
  {
    title: 'Clínica Veterinaria',
    category: 'Web',
    resultado: 'Página web institucional para clínica',
    metrica: 'Próximamente',
    href: '/clinica-veterinaria',
    image: '/proyectos/vet-clinic-card.webp',
  },
  {
    title: 'Restaurante Video',
    category: 'Web',
    resultado: 'Portal con videos y galería',
    metrica: 'Próximamente',
    href: '/restaurante-video',
    image: '/img/1web.webp',
  },
];
