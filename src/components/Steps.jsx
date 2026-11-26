import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Eyebrow, SplitWords, ease } from './ui.jsx'

export default function Steps({ data }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })
  const height = useTransform(progress, [0, 1], ['0%', '100%'])

  return (
    <section id="como-funciona" className="section steps" ref={ref}>
      <div className="steps-head">
        <Eyebrow index="01">Cómo funciona</Eyebrow>
        <h2 className="h2">
          <SplitWords text="Atención simple," className="line" />
          <SplitWords text="desde el primer mensaje." className="line line-alt" delay={0.15} />
        </h2>
      </div>
      <div className="steps-list">
        <div className="steps-rail"><motion.div className="steps-rail-fill" style={{ height }} /></div>
        {data.steps.map((s, i) => (
          <motion.div
            key={s}
            className="step"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.9, ease, delay: i * 0.08 }}
          >
            <span className="step-num">0{i + 1}</span>
            <p className="step-text">{s}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
