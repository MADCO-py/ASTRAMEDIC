import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TESTIMONIALS } from '../data.js'
import { Eyebrow, SplitWords, ease } from './ui.jsx'

// Carrusel que se arrastra con el mouse o el dedo
export default function Testimonials({ mode }) {
  const items = TESTIMONIALS[mode]
  const wrapRef = useRef(null)
  const trackRef = useRef(null)
  const [limit, setLimit] = useState(0)

  useEffect(() => {
    const measure = () => {
      if (!wrapRef.current || !trackRef.current) return
      setLimit(Math.min(0, wrapRef.current.offsetWidth - trackRef.current.scrollWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [mode])

  return (
    <section id="testimonios" className="section testimonials">
      <div className="section-head split">
        <div>
          <Eyebrow>Testimonios</Eyebrow>
          <h2 className="h2">
            <SplitWords text="Lo que dicen" className="line" />
            <SplitWords text={mode === 'mascotas' ? 'sus familias.' : 'nuestros clientes.'} className="line line-alt" delay={0.15} />
          </h2>
        </div>
        <p className="lead">Arrastrá para ver más →</p>
      </div>
      <div className="t-wrap" ref={wrapRef}>
        <motion.div
          ref={trackRef}
          className="t-track"
          drag="x"
          dragConstraints={{ left: limit, right: 0 }}
          dragElastic={0.12}
          whileTap={{ cursor: 'grabbing' }}
        >
          {items.map((t, i) => (
            <motion.figure
              key={i}
              className="t-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: i * 0.08 }}
            >
              {t.example && <span className="t-example">Ejemplo</span>}
              <span className="t-quote">“</span>
              <blockquote>{t.text}</blockquote>
              <figcaption>
                <strong>{t.name}</strong>
                <span>{[t.pet, t.zone].filter(Boolean).join(' · ')}</span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
