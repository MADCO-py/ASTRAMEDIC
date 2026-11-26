import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Eyebrow, SplitWords, ease } from './ui.jsx'

const PHOTOS = [
  { src: './img/perro-jack.webp', alt: 'Perro jack russell sonriendo' },
  { src: './img/gato.webp', alt: 'Gato atigrado lamiéndose' },
  { src: './img/perro-cafe.webp', alt: 'Perro café sacando la lengua' },
  { src: './img/perro-orejas.webp', alt: 'Cachorro de orejas grandes con collar' },
  { src: './img/perro-curioso.webp', alt: 'Perro curioso mirando a la cámara' },
]

function Photo({ p, i, progress }) {
  // cada foto se desplaza a distinta velocidad (parallax)
  const y = useTransform(progress, [0, 1], [i % 2 ? 60 : -20, i % 2 ? -60 : 40])
  return (
    <motion.figure
      className={`pg-photo pg-${i}`}
      style={{ y }}
      initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
      whileInView={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1.1, ease, delay: i * 0.08 }}
    >
      <img src={p.src} alt={p.alt} loading="lazy" />
    </motion.figure>
  )
}

export default function PetGallery() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  return (
    <section className="section pet-gallery" ref={ref}>
      <div className="section-head split">
        <div>
          <Eyebrow>Perros y gatos</Eyebrow>
          <h2 className="h2">
            <SplitWords text="Ellos también" className="line" />
            <SplitWords text="son familia." className="line line-alt" delay={0.15} />
          </h2>
        </div>
        <p className="lead">Atención veterinaria en casa, donde tu mascota se siente tranquila.</p>
      </div>
      <div className="pg-grid">
        {PHOTOS.map((p, i) => <Photo key={p.src} p={p} i={i} progress={scrollYProgress} />)}
      </div>
    </section>
  )
}
