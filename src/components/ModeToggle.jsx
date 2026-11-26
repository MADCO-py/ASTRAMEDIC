import { useRef } from 'react'
import { motion } from 'framer-motion'
import ModeIcon from './ModeIcon.jsx'

// Interruptor Personas ⇄ Mascotas: la perilla se desliza y el ícono se transforma
export default function ModeToggle({ mode, onSwitch }) {
  const knobRef = useRef(null)
  const isPet = mode === 'mascotas'

  const fire = (next) => {
    if (next === mode) return
    const r = knobRef.current?.getBoundingClientRect()
    onSwitch(next, r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined)
  }

  return (
    <div className="mode-toggle" role="group" aria-label="Tipo de plan">
      <button className={`mt-label ${!isPet ? 'on' : ''}`} onClick={() => fire('personas')} aria-pressed={!isPet}>
        Personas
      </button>
      <motion.button
        className="mt-track"
        style={{ justifyContent: isPet ? 'flex-end' : 'flex-start' }}
        onClick={() => fire(isPet ? 'personas' : 'mascotas')}
        aria-label={`Cambiar a ${isPet ? 'personas' : 'mascotas'}`}
        whileTap={{ scale: 0.94 }}
      >
        <motion.span
          ref={knobRef}
          className="mt-knob"
          layout
          animate={{ rotate: isPet ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        >
          <motion.span animate={{ rotate: isPet ? -180 : 0 }} transition={{ type: 'spring', stiffness: 380, damping: 24 }} style={{ display: 'grid' }}>
            <ModeIcon mode={mode} size={22} />
          </motion.span>
        </motion.span>
      </motion.button>
      <button className={`mt-label ${isPet ? 'on' : ''}`} onClick={() => fire('mascotas')} aria-pressed={isPet}>
        Mascotas
      </button>
    </div>
  )
}
