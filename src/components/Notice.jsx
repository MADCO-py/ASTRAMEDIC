import { motion } from 'framer-motion'
import { ease } from './ui.jsx'

export default function Notice({ mode }) {
  return (
    <section className="notice" aria-label="Aviso importante">
      <motion.div
        className="notice-inner"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 1.1, ease }}
      >
        <span className="notice-mark">!</span>
        <p>
          <strong>Astramedic no atiende emergencias{mode === 'personas' ? ' médicas' : ''}.</strong>{' '}
          {mode === 'personas'
            ? 'Ante una emergencia, acudí al servicio de emergencias más cercano.'
            : 'Si tu mascota tiene una emergencia, llevala a una clínica veterinaria de emergencias.'}
        </p>
      </motion.div>
    </section>
  )
}
