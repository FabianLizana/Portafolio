// Datos centralizados de la clínica (FICTICIOS). Reemplázalos antes de publicar.
export const CLINIC = {
  name: "VetVida",
  fullName: "VetVida — Clínica Veterinaria Integral",
  address: "Av. Principal 123, Peñaflor, Región Metropolitana, Chile",
  phoneDisplay: "+56 9 0000 0000",
  phoneTel: "+56900000000",
  // Número de WhatsApp en formato internacional sin "+" ni espacios.
  whatsapp: "56900000000",
  email: "contacto@vetvida-demo.cl",
  mapsQuery: "Peñaflor, Región Metropolitana, Chile",
  hours: [
    { days: "Lunes a viernes", time: "09:00 – 19:00" },
    { days: "Sábados", time: "09:00 – 14:00" },
    { days: "Domingos y festivos", time: "Cerrado*" },
  ],
} as const;

export const waLink = (message = "Hola, quisiera consultar por una hora para mi mascota") =>
  `https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(message)}`;

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLINIC.mapsQuery)}`;
