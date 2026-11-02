export const NAV = [
  { id: "inicio", label: "Inicio" },
  { id: "servicios", label: "Servicios" },
  { id: "equipo", label: "Nuestro equipo" },
  { id: "horarios", label: "Horarios" },
  { id: "contacto", label: "Contacto" },
] as const;

export const SERVICES = [
  {
    icon: "stethoscope",
    name: "Consulta veterinaria",
    desc: "Evaluaciones generales y seguimiento de la salud de tu mascota.",
  },
  {
    icon: "syringe",
    name: "Vacunación",
    desc: "Planes preventivos y orientación sobre el calendario de vacunas.",
  },
  {
    icon: "microscope",
    name: "Exámenes y diagnóstico",
    desc: "Apoyo diagnóstico según las necesidades de cada paciente.",
  },
  {
    icon: "scissors",
    name: "Cirugía veterinaria",
    desc: "Procedimientos quirúrgicos sujetos a evaluación profesional.",
  },
  {
    icon: "smile",
    name: "Odontología veterinaria",
    desc: "Prevención y cuidado de la salud bucal.",
  },
  {
    icon: "sparkles",
    name: "Peluquería y estética",
    desc: "Higiene y cuidado del pelaje con trato delicado.",
  },
  {
    icon: "bug",
    name: "Desparasitación",
    desc: "Orientación y tratamientos preventivos según evaluación veterinaria.",
  },
  {
    icon: "siren",
    name: "Atención de urgencias",
    desc: "Información clara sobre disponibilidad y cómo contactarnos.",
  },
] as const;

// Perfiles demostrativos: edita nombre, especialidad, texto y foto.
export const TEAM = [
  {
    img: "vet-camila",
    name: "Dra. Camila Torres",
    role: "Medicina veterinaria general",
    bio: "Cree que cada consulta empieza por escuchar al tutor. Le encanta acompañar a las familias desde el primer control del cachorro.",
  },
  {
    img: "vet-sebastian",
    name: "Dr. Sebastián Rojas",
    role: "Medicina preventiva y diagnóstico",
    bio: "Apasionado por la prevención. Explica cada paso con calma para que tú y tu mascota se sientan tranquilos.",
  },
  {
    img: "vet-valentina",
    name: "Dra. Valentina Muñoz",
    role: "Cirugía y cuidado integral",
    bio: "Combina rigor profesional con mucha paciencia. Su prioridad es que cada paciente se sienta seguro y cuidado.",
  },
] as const;

export const REVIEWS = [
  {
    name: "Francisca P.",
    pet: "tutora de Luna (gata)",
    text: "Nos explicaron todo con mucha paciencia. Luna salió tranquila y nosotros también.",
  },
  {
    name: "Matías G.",
    pet: "tutor de Rocco (perro)",
    text: "Muy buena disposición del equipo para responder dudas sobre las vacunas de Rocco.",
  },
  {
    name: "Daniela S.",
    pet: "tutora de Milo y Nala",
    text: "Se nota el cariño con que tratan a los animales. Agendar por WhatsApp fue muy simple.",
  },
] as const;

export const FAQ = [
  [
    "¿Cómo puedo agendar una hora?",
    "Puedes completar el formulario de esta página o escribirnos por WhatsApp. La clínica te contactará para confirmar la disponibilidad.",
  ],
  [
    "¿Qué debo llevar a la primera consulta?",
    "Si los tienes, trae el carnet de vacunas y antecedentes previos. Para perros, usa correa; para gatos, un transportador seguro.",
  ],
  [
    "¿Atienden perros y gatos?",
    "Sí, atendemos perros y gatos. Si tienes otra especie, consúltanos previamente para orientarte.",
  ],
  [
    "¿Puedo consultar por vacunas?",
    "Claro. Te orientamos sobre el calendario de vacunación según la edad y condición de tu mascota, previa evaluación.",
  ],
  [
    "¿Cómo puedo conocer el precio de un servicio?",
    "Los valores dependen de cada caso. Escríbenos por WhatsApp o teléfono y te entregaremos la información actualizada.",
  ],
  [
    "¿Qué debo hacer si mi mascota necesita atención urgente?",
    "Contáctanos de inmediato para confirmar disponibilidad. Si no podemos atenderte, acude al centro veterinario de urgencias más cercano que esté disponible.",
  ],
] as const;

export const ATTENTION_TYPES = [
  "Consulta con hora agendada",
  "Consultas generales",
  "Vacunación y controles preventivos",
  "Evaluación de procedimientos",
  "Consultas sobre disponibilidad de servicios",
] as const;
