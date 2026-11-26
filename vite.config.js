import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { CONTACT, MODES, getFaq } from './src/data.js'

// ─────────────────────────────────────────────────────────────
//  DIRECCIÓN DEL SITIO — cambiala cuando conectés tu dominio.
//  Ej: 'https://www.astramedic.com'  (sin "/" al final)
// ─────────────────────────────────────────────────────────────
const SITE_URL = process.env.SITE_URL || 'https://madco-py.github.io/ASTRAMEDIC'
// Si usás dominio propio, escribilo aquí (sin https). Se genera el archivo CNAME.
const CUSTOM_DOMAIN = process.env.CUSTOM_DOMAIN || ''
// Código de verificación de Google Search Console (opcional)
const GOOGLE_VERIFICATION = process.env.GOOGLE_VERIFICATION || ''

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Datos estructurados (schema.org) para que Google entienda el negocio
function structuredData() {
  const socials = CONTACT.socials.filter((s) => s.ready).map((s) => s.url)
  const area = { '@type': 'City', name: 'Ciudad de Guatemala', containedInPlace: { '@type': 'Country', name: 'Guatemala' } }
  const offers = (mode) =>
    MODES[mode].plans.map((p) => ({
      '@type': 'Offer',
      name: `Plan anual ${MODES[mode].label} · ${p.name}`,
      price: p.price,
      priceCurrency: 'GTQ',
      description: p.features.join(', '),
    }))
  const org = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#org`,
    name: 'Astramedic',
    alternateName: ['AstraMedic', 'Astra Medic', 'Astramedics', 'Astra-medic'],
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icon-512.png`,
    email: CONTACT.email,
    slogan: 'Cuidamos tu salud, estamos contigo',
    ...(socials.length ? { sameAs: socials } : {}),
    ...(!CONTACT.whatsappIsPlaceholder ? { telephone: `+${CONTACT.whatsapp}` } : {}),
  }
  const faq = getFaq('personas')
  return {
    '@context': 'https://schema.org',
    '@graph': [
      org,
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#web`,
        url: `${SITE_URL}/`,
        name: 'Astramedic',
        alternateName: org.alternateName,
        inLanguage: 'es-GT',
        publisher: { '@id': `${SITE_URL}/#org` },
      },
      {
        '@type': 'MedicalBusiness',
        '@id': `${SITE_URL}/#personas`,
        name: 'Astramedic · Atención médica a domicilio',
        url: `${SITE_URL}/#/personas`,
        image: `${SITE_URL}/og-image.png`,
        parentOrganization: { '@id': `${SITE_URL}/#org` },
        areaServed: area,
        email: CONTACT.email,
        priceRange: 'Q840 - Q960 al año',
        description: MODES.personas.subtitle,
        makesOffer: offers('personas'),
      },
      {
        '@type': 'VeterinaryCare',
        '@id': `${SITE_URL}/#mascotas`,
        name: 'Astramedic Mascotas · Atención veterinaria a domicilio',
        url: `${SITE_URL}/#/mascotas`,
        image: `${SITE_URL}/og-image.png`,
        parentOrganization: { '@id': `${SITE_URL}/#org` },
        areaServed: area,
        email: CONTACT.email,
        priceRange: 'Q600 - Q720 al año',
        description: MODES.mascotas.subtitle,
        makesOffer: offers('mascotas'),
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  }
}

// Contenido en HTML puro dentro de #root: lo lee Google y lo ve quien no tenga JavaScript.
// React lo reemplaza apenas carga la página.
function staticContent() {
  const block = (mode) => {
    const m = MODES[mode]
    return `
      <section>
        <h2>${esc(m.eyebrow)}: ${esc(m.title.join(' '))}</h2>
        <p>${esc(m.subtitle)}</p>
        <h3>Servicios</h3>
        <ul>${m.services.map((s) => `<li>${esc(s.title)}</li>`).join('')}</ul>
        <h3>Planes anuales</h3>
        <ul>${m.plans.map((p) => `<li><strong>${esc(p.name)}: Q${p.price} al año</strong> (equivale a Q${p.monthly} mensuales) — ${esc(p.features.join(', '))}</li>`).join('')}</ul>
        <p><a href="./#/${mode}">Ver planes para ${esc(m.label.toLowerCase())}</a></p>
      </section>`
  }
  return `
    <div class="boot" aria-hidden="true"><img class="boot-light" src="./img/logo-mark-light.png" alt="" /><img class="boot-dark" src="./img/logo-mark.png" alt="" /></div>
    <div class="seo-fallback">
      <header><img src="./img/logo-mark.png" alt="Astramedic" width="64" height="49" /><p class="brand">ASTRA<b>MEDIC</b></p></header>
      <h1>Astramedic: atención médica y veterinaria a domicilio en Guatemala</h1>
      <p>Planes anuales con visitas sin límite a domicilio en la Ciudad de Guatemala (por motivos de seguridad, hay algunas zonas que no cubrimos). Elegí pagar en 1, 2 o 3 pagos con transferencia, tarjeta de crédito o cheque.</p>
      ${block('personas')}
      ${block('mascotas')}
      <p>Astramedic no atiende emergencias. Escribinos a <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>.</p>
    </div>`
}

// 2) después: datos estructurados y contenido estático (con rutas que Vite no debe tocar)
function seoContentPlugin() {
  return {
    name: 'astramedic-seo-content',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html
          .replace('%STRUCTURED_DATA%', `<script type="application/ld+json">${JSON.stringify(structuredData())}</script>`)
          .replace('%STATIC_CONTENT%', staticContent())
      },
    },
  }
}

function seoPlugin() {
  return {
    name: 'astramedic-seo',
    // 1) antes de que Vite lea el HTML: dirección del sitio y verificación
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replaceAll('%SITE_URL%', SITE_URL)
          .replace('%GOOGLE_VERIFICATION%', GOOGLE_VERIFICATION ? `<meta name="google-site-verification" content="${esc(GOOGLE_VERIFICATION)}" />` : '')
      },
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n` })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE_URL}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n`,
      })
      if (CUSTOM_DOMAIN) this.emitFile({ type: 'asset', fileName: 'CNAME', source: `${CUSTOM_DOMAIN}\n` })
    },
  }
}

// base './' permite publicar en GitHub Pages (usuario.github.io/ASTRAMEDIC) o en dominio propio
export default defineConfig({
  plugins: [react(), seoPlugin(), seoContentPlugin()],
  base: './',
})
