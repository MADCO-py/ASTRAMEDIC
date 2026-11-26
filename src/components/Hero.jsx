import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { contactLink } from '../data.js'
import { CountUp, Magnetic, SplitWords, ease } from './ui.jsx'
import { Paw } from './Mascots.jsx'
import { WhatsAppIcon } from './Icons.jsx'

// Línea de electrocardiograma que se repite a lo ancho
function ecgPath(width = 1600, mid = 200) {
  let d = `M0 ${mid}`
  let x = 0
  while (x < width) {
    d += ` L${x + 120} ${mid} L${x + 135} ${mid - 14} L${x + 150} ${mid} L${x + 165} ${mid}`
    d += ` L${x + 175} ${mid + 22} L${x + 190} ${mid - 120} L${x + 205} ${mid + 60} L${x + 215} ${mid}`
    d += ` L${x + 245} ${mid} L${x + 265} ${mid - 26} L${x + 285} ${mid} L${x + 400} ${mid}`
    x += 400
  }
  return d
}

function PulseArt() {
  const d = ecgPath()
  return (
    <svg className="hero-ecg" viewBox="0 0 1600 400" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} className="ecg-base" />
      <motion.path
        d={d}
        className="ecg-glow"
        initial={{ pathLength: 0.12, pathOffset: 0 }}
        animate={{ pathOffset: [0, 1] }}
        transition={{ duration: 5.5, ease: 'linear', repeat: Infinity }}
      />
    </svg>
  )
}

const PAWS = Array.from({ length: 12 }, (_, i) => {
  const t = i / 11
  return {
    x: 8 + t * 84,
    y: 82 - Math.sin(t * Math.PI) * 30 - t * 30 + (i % 2 ? 4 : -4),
    r: -55 + t * 60 + (i % 2 ? 8 : -8),
  }
})

function PawTrail() {
  return (
    <div className="hero-paws" aria-hidden="true">
      {PAWS.map((p, i) => (
        <motion.div
          key={i}
          className="paw-print"
          style={{ left: `${p.x}%`, top: `${p.y}%`, rotate: p.r + 90 }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 0.9, 0.9, 0], scale: [0.4, 1, 1, 0.9] }}
          transition={{ duration: 4.8, times: [0, 0.08, 0.7, 1], delay: i * 0.28, repeat: Infinity, repeatDelay: 1.2 }}
        >
          <Paw />
        </motion.div>
      ))}
    </div>
  )
}

const SIDE_PETS = [
  { src: './img/perro-cafe.webp', cls: 'hp-l1', rot: -7, from: -1 },
  { src: './img/gato.webp', cls: 'hp-l2', rot: 6, from: -1 },
  { src: './img/perro-orejas.webp', cls: 'hp-r1', rot: 7, from: 1 },
  { src: './img/perro-jack.webp', cls: 'hp-r2', rot: -5, from: 1 },
]

// Fotos de mascotas a los lados del inicio (solo Mascotas)
function HeroPets({ progress }) {
  const yA = useTransform(progress, [0, 1], [0, -120])
  const yB = useTransform(progress, [0, 1], [0, -220])
  return (
    <div className="hero-pets" aria-hidden="true">
      {SIDE_PETS.map((p, i) => (
        <motion.div key={p.src} className={`hero-pet ${p.cls}`} style={{ y: i % 2 ? yB : yA }}>
          <motion.img
            src={p.src}
            alt=""
            initial={{ opacity: 0, x: p.from * 160, rotate: p.rot * 2 }}
            animate={{ opacity: 1, x: 0, rotate: p.rot, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 0.9, delay: 0.3 + i * 0.12 },
              x: { duration: 1.1, ease, delay: 0.3 + i * 0.12 },
              rotate: { duration: 1.1, ease, delay: 0.3 + i * 0.12 },
              y: { duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: 1.5 },
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default function Hero({ data, mode, scrollTo }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const artScale = useTransform(scrollYProgress, [0, 1], [1, 1.25])
  const contact = contactLink(`Hola Astramedic, quiero información de los planes para ${mode}.`)

  return (
    <section ref={ref} id="top" className={`hero hero-${mode}`}>
      <motion.div className="hero-art" style={{ scale: artScale }}>
        {mode === 'personas' ? <PulseArt /> : <><PawTrail /><HeroPets progress={scrollYProgress} /></>}
        <div className="hero-grain" />
      </motion.div>

      <motion.div className="hero-inner" style={{ y, opacity }}>
        <motion.p
          className="hero-eyebrow"
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.28em' }}
          transition={{ duration: 1.4, ease, delay: 0.2 }}
        >
          {data.eyebrow}
        </motion.p>
        <h1 className="hero-title">
          <SplitWords text={data.title[0]} className="line" delay={0.35} />
          <SplitWords text={data.title[1]} className="line line-alt" delay={0.55} />
        </h1>
        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 1 }}
        >
          {data.subtitle}
        </motion.p>
      </motion.div>

      <motion.div
        className="hero-bottom"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 1.2 }}
      >
        <div className="hero-ctas">
          <Magnetic as="button" className="btn btn-primary" onClick={() => scrollTo('planes')}>Ver planes</Magnetic>
          <Magnetic className="btn btn-ghost btn-wa" href={contact.href} target="_blank" rel="noreferrer"><WhatsAppIcon /> {contact.label}</Magnetic>
        </div>
        <dl className="hero-stats">
          <div>
            <dt>Desde</dt>
            <dd><CountUp value={data.from} prefix="Q" /><small> /año*</small></dd>
          </div>
          <div>
            <dt>Visitas a domicilio</dt>
            <dd>Sin límite</dd>
          </div>
          <div>
            <dt>Cobertura</dt>
            <dd>Depto. de Guatemala</dd>
          </div>
        </dl>
      </motion.div>

      <button className="scroll-cue" onClick={() => scrollTo('como-funciona')} aria-label="Bajar">
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>↓</motion.span>
      </button>
    </section>
  )
}
