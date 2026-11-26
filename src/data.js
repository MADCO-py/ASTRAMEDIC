// ─────────────────────────────────────────────────────────────
//  CONFIGURACIÓN GENERAL — edita aquí los datos de contacto
// ─────────────────────────────────────────────────────────────
export const CONTACT = {
  // Código de país + 8 dígitos, solo números
  whatsapp: '50253958261',
  whatsappDisplay: '+502 5395-8261',
  whatsappIsPlaceholder: false,
  email: 'info@astra-medic.com',
  // ⚠️ Redes de prueba: pon la URL real y cambia 'ready' a true.
  socials: [
    { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/', ready: false },
    { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com/', ready: false },
  ],
}

export const BRAND = 'Astramedic'

export const NOTE = '* Precios y condiciones sujetos a cobertura y validación de Astramedic.'

// Cobertura: por ahora solo la Ciudad de Guatemala (con excepciones por seguridad)
export const COVERAGE = {
  short: 'Ciudad de Guatemala*',
  note: '* Por motivos de seguridad, hay algunas zonas de la ciudad que no cubrimos. Escribinos y te confirmamos si llegamos a tu dirección.',
}

export const PAYMENT_METHODS = ['Transferencia', 'Tarjeta de crédito', 'Cheque']

// Enlace de contacto: WhatsApp si hay número, si no, correo.
export function contactLink(message = 'Hola Astramedic, quiero más información.') {
  const text = encodeURIComponent(message)
  if (CONTACT.whatsapp) {
    return { href: `https://wa.me/${CONTACT.whatsapp}?text=${text}`, label: 'Escribir por WhatsApp', channel: 'whatsapp' }
  }
  return {
    href: `mailto:${CONTACT.email}?subject=${encodeURIComponent('Información de planes Astramedic')}&body=${text}`,
    label: 'Escribir por correo',
    channel: 'email',
  }
}

// ─────────────────────────────────────────────────────────────
//  CONTENIDO POR MODO
// ─────────────────────────────────────────────────────────────
const personas = {
  key: 'personas',
  label: 'Personas',
  eyebrow: 'Atención médica a domicilio',
  title: ['Tu salud,', 'más cerca de casa.'],
  subtitle: 'Consulta médica general y servicios para tu familia, sin salir de casa.',
  from: 840,
  marquee: [
    'Visitas sin límite a domicilio',
    'Ciudad de Guatemala',
    'Consulta médica general',
    'Laboratorios a domicilio',
    'Medicamentos con receta',
    'Vacunas',
  ],
  steps: [
    'Elegí la forma de pago que más te convenga',
    'Compartinos la dirección de tu visita',
    'Coordinamos tu atención en casa',
  ],
  services: [
    { title: 'Consulta médica general' },
    { title: 'Laboratorios a domicilio' },
    { title: 'Medicamentos con receta' },
  ],
  plans: [
    {
      id: 1, name: '1 pago', price: 840, monthly: 70,
      features: ['Consultas médicas', 'Laboratorios', 'Vacunas', 'Venta de medicamentos'],
    },
    {
      id: 2, name: '2 pagos', price: 900, monthly: 75, featured: true,
      features: ['Consultas médicas', 'Laboratorios', 'Vacunas', 'Venta de medicamentos'],
    },
    {
      id: 3, name: '3 pagos', price: 960, monthly: 80,
      features: ['Consultas médicas', 'Laboratorios', 'Vacunas', 'Venta de medicamentos'],
    },
  ],
  bot: { name: 'Astra', role: 'Asistente de salud' },
}

const PET_FEATURES = [
  'Consulta veterinaria general', 'Descuento en vacunas', 'Descuento en laboratorios', 'Desparasitación',
  'Seguimiento de salud', 'Asesoría nutricional', 'Convenios y beneficios especiales',
]

const mascotas = {
  key: 'mascotas',
  label: 'Mascotas',
  eyebrow: 'Atención veterinaria a domicilio',
  title: ['El cuidado de ellos,', 'sin salir de casa.'],
  subtitle: 'Atención veterinaria para acompañar el bienestar de tu mascota en casa.',
  from: 600,
  marquee: [
    'Visitas sin límite a domicilio',
    'Ciudad de Guatemala',
    'Consulta veterinaria general',
    'Laboratorios',
    'Vacunas y medicamentos',
    'Perros y gatos',
  ],
  steps: [
    'Elegí la forma de pago que más te convenga',
    'Compartinos la dirección de tu visita',
    'Coordinamos tu visita a domicilio',
  ],
  services: [
    { title: 'Consulta veterinaria general' },
    { title: 'Laboratorios' },
    { title: 'Vacunas y medicamentos' },
  ],
  // El plan es por domicilio, no por mascota. Los 3 planes incluyen todo; solo cambia la forma de pago.
  plans: [
    { id: 1, name: '1 pago', price: 600, monthly: 50, features: PET_FEATURES },
    { id: 2, name: '2 pagos', price: 660, monthly: 55, featured: true, features: PET_FEATURES },
    { id: 3, name: '3 pagos', price: 720, monthly: 60, features: PET_FEATURES },
  ],
  bot: { name: 'Miki', role: 'Asistente veterinario' },
}

export const MODES = { personas, mascotas }

// ─────────────────────────────────────────────────────────────
//  PREGUNTAS FRECUENTES (7) — usadas por el chatbot y la sección FAQ
// ─────────────────────────────────────────────────────────────
const q = (n) => `Q${n.toLocaleString('es-GT')}`

export function getFaq(mode) {
  const m = MODES[mode]
  const isPet = mode === 'mascotas'
  const [p1, p2, p3] = m.plans
  return [
    {
      q: '¿Qué servicios ofrecen?',
      short: 'Servicios',
      keys: ['servicio', 'ofrecen', 'hacen', 'consulta', 'laboratorio', 'medicamento', 'vacuna', 'receta'],
      a: isPet
        ? 'Ofrecemos consulta veterinaria general, laboratorios, y vacunas y medicamentos, todo con atención a domicilio.'
        : 'Ofrecemos consulta médica general, laboratorios a domicilio y medicamentos con receta, todo con atención a domicilio.',
    },
    {
      q: '¿Qué zonas cubren?',
      short: 'Cobertura',
      keys: ['zona', 'cubren', 'cobertura', 'donde', 'dónde', 'ciudad', 'guatemala', 'llegan', 'municipio', 'mixco', 'villa', 'nueva', 'canales', 'pinula', 'fraijanes', 'amatitlan', 'chinautla', 'petapa', 'palencia', 'sacatepequez', 'departamento', 'carretera', 'colonia', 'direccion', 'dirección'],
      a: 'Por ahora cubrimos la Ciudad de Guatemala. Por motivos de seguridad, hay algunas zonas de la ciudad que no cubrimos. Compartinos tu dirección y te confirmamos si llegamos.',
    },
    {
      q: '¿Cuánto cuesta y cómo se paga?',
      short: 'Precios y pagos',
      keys: ['cuesta', 'precio', 'costo', 'cuanto', 'cuánto', 'pago', 'pagar', 'paga', 'tarjeta', 'transferencia', 'cheque', 'mensual', 'q'],
      a: `Es un plan anual: ${q(p1.price)} en 1 pago (equivale a ${q(p1.monthly)} mensuales), ${q(p2.price)} en 2 pagos (${q(p2.monthly)} mensuales) o ${q(p3.price)} en 3 pagos (${q(p3.monthly)} mensuales). Aceptamos transferencia, tarjeta de crédito o cheque.${isPet ? ' El plan es por domicilio, no por mascota.' : ''}`,
    },
    {
      q: '¿Qué diferencia hay entre los planes?',
      short: 'Diferencias',
      keys: ['diferencia', 'incluye', 'plan', 'planes', 'beneficio', 'mejor', 'comparar'],
      a: isPet
        ? 'Los tres planes incluyen lo mismo: consulta veterinaria general, descuento en vacunas y laboratorios, desparasitación, seguimiento de salud, asesoría nutricional y convenios y beneficios especiales. Solo cambia la forma de pago: 1, 2 o 3 pagos al año. El plan es por domicilio, no por mascota.'
        : 'Los tres planes incluyen lo mismo: consultas médicas, laboratorios, vacunas y venta de medicamentos. Solo cambia la forma de pago: 1, 2 o 3 pagos al año.',
    },
    {
      q: '¿Cuántas visitas a domicilio incluye?',
      short: 'Visitas',
      keys: ['visita', 'visitas', 'cuantas', 'cuántas', 'limite', 'límite', 'veces', 'domicilio'],
      a: 'Las visitas a domicilio son sin límite durante la vigencia de tu plan anual.',
    },
    {
      q: '¿Atienden emergencias?',
      short: 'Emergencias',
      keys: ['emergencia', 'urgencia', 'urgente', 'grave', 'accidente'],
      a: isPet
        ? 'No. Astramedic no atiende emergencias. Si tu mascota tiene una emergencia, llevala de inmediato a una clínica veterinaria de emergencias.'
        : 'No. Astramedic no atiende emergencias médicas. Ante una emergencia, acudí al servicio de emergencias más cercano.',
    },
    {
      q: '¿Cómo contrato y coordino mi visita?',
      short: 'Contratar',
      keys: ['contrato', 'contratar', 'coordino', 'agendar', 'agenda', 'cita', 'whatsapp', 'correo', 'contacto', 'empezar', 'comprar', 'adquirir'],
      a: `Es simple: 1) elegí la forma de pago que más te convenga, 2) compartinos la dirección de tu visita y 3) coordinamos tu ${isPet ? 'visita a domicilio' : 'atención en casa'}. Escribinos por WhatsApp o a ${CONTACT.email}.`,
    },
  ]
}

// Busca la pregunta frecuente que mejor coincide con lo que escribió el usuario
export function matchFaq(mode, text) {
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const words = norm(text).split(/[^a-z0-9ñ]+/).filter((w) => w.length > 2)
  let best = null
  let bestScore = 0
  for (const item of getFaq(mode)) {
    const keys = item.keys.map(norm)
    const score = words.reduce((acc, w) => acc + (keys.some((k) => k.length > 1 && (w.startsWith(k) || k.startsWith(w))) ? 1 : 0), 0)
    if (score > bestScore) { best = item; bestScore = score }
  }
  return best
}

// ─────────────────────────────────────────────────────────────
//  TESTIMONIOS — ⚠️ EJEMPLOS. Reemplazar por testimonios reales
//  (con permiso del cliente) y cambiar `example` a false.
// ─────────────────────────────────────────────────────────────
export const TESTIMONIALS = {
  personas: [
    { name: 'Cliente de ejemplo', zone: 'Zona 15', text: 'Aquí irá el testimonio real de un cliente sobre la atención médica a domicilio.', example: true },
    { name: 'Cliente de ejemplo', zone: 'Zona 10', text: 'Espacio para una opinión real sobre la consulta médica general en casa.', example: true },
    { name: 'Cliente de ejemplo', zone: 'Zona 16', text: 'Espacio para una opinión real sobre laboratorios o medicamentos a domicilio.', example: true },
    { name: 'Cliente de ejemplo', zone: 'Zona 14', text: 'Espacio para una opinión real sobre el plan anual y la forma de pago.', example: true },
  ],
  mascotas: [
    { name: 'Cliente de ejemplo', pet: 'Perro', zone: 'Zona 15', text: 'Aquí irá el testimonio real de un cliente sobre la visita veterinaria a domicilio.', example: true },
    { name: 'Cliente de ejemplo', pet: 'Gato', zone: 'Zona 10', text: 'Espacio para una opinión real sobre la consulta veterinaria en casa.', example: true },
    { name: 'Cliente de ejemplo', pet: 'Perro', zone: 'Zona 16', text: 'Espacio para una opinión real sobre vacunas o desparasitación.', example: true },
    { name: 'Cliente de ejemplo', pet: 'Gato', zone: 'Zona 14', text: 'Espacio para una opinión real sobre el seguimiento de salud de su mascota.', example: true },
  ],
}

// Arma el enlace de WhatsApp con un mensaje
export function waLink(message) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`
}

// Abre el formulario de solicitud desde cualquier parte del sitio
export function openLead(detail = {}) {
  window.dispatchEvent(new CustomEvent('astramedic:lead', { detail }))
}
export function openChat() {
  window.dispatchEvent(new CustomEvent('astramedic:chat'))
}
export function openLegal(tab = 'terminos') {
  window.dispatchEvent(new CustomEvent('astramedic:legal', { detail: { tab } }))
}
