import { motion } from 'framer-motion'
import { Eyebrow, SplitWords, ease } from './ui.jsx'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'square' }

const ICONS = {
  consulta: (
    <svg viewBox="0 0 48 48" {...stroke}>
      <path d="M12 6v12a8 8 0 0 0 16 0V6" />
      <path d="M20 26v6a9 9 0 0 0 18 0v-4" />
      <rect x="34" y="22" width="8" height="8" />
      <path d="M9 6h6M25 6h6" />
    </svg>
  ),
  laboratorio: (
    <svg viewBox="0 0 48 48" {...stroke}>
      <path d="M18 5h12M20 5v14L9 41h30L28 19V5" />
      <path d="M14 31h20" />
      <rect x="20" y="34" width="3" height="3" />
      <rect x="27" y="27" width="2" height="2" />
    </svg>
  ),
  medicamento: (
    <svg viewBox="0 0 48 48" {...stroke}>
      <rect x="8" y="18" width="32" height="12" transform="rotate(-45 24 24)" />
      <path d="M18.3 18.3l11.4 11.4" transform="translate(0 0)" />
    </svg>
  ),
  vacuna: (
    <svg viewBox="0 0 48 48" {...stroke}>
      <path d="M30 6l12 12M36 12l-6 6M33 15L15 33l-3-3 18-18M15 33l-9 9M20 22l3 3M24 18l3 3" />
    </svg>
  ),
}

const ICON_ORDER = {
  personas: ['consulta', 'laboratorio', 'medicamento'],
  mascotas: ['consulta', 'laboratorio', 'vacuna'],
}

export default function Services({ data, mode }) {
  return (
    <section id="servicios" className="section services">
      <div className="section-head split">
        <div>
          <Eyebrow index="02">Servicios</Eyebrow>
          <h2 className="h2">
            <SplitWords text="Todo lo esencial," className="line" />
            <SplitWords text="más cerca de ti." className="line line-alt" delay={0.15} />
          </h2>
        </div>
        <p className="lead">Conocé los servicios disponibles para tu atención a domicilio.</p>
      </div>
      <div className="services-grid">
        {data.services.map((s, i) => (
          <motion.article
            key={s.title}
            className="service"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 1, ease, delay: i * 0.12 }}
            whileHover="hover"
          >
            <motion.div className="service-fill" variants={{ hover: { scaleY: 1 } }} initial={{ scaleY: 0 }} transition={{ duration: 0.55, ease }} />
            <div className="service-top">
              <span className="service-index">0{i + 1}</span>
              <motion.span className="service-icon" variants={{ hover: { rotate: -8, scale: 1.12 } }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
                {ICONS[ICON_ORDER[mode][i]]}
              </motion.span>
            </div>
            <div className="service-body">
              <h3>{s.title}</h3>
              {s.text && <p>{s.text}</p>}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
