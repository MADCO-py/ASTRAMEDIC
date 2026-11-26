import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MODES } from '../data.js'
import ModeIcon from './ModeIcon.jsx'

const ease = [0.7, 0, 0.2, 1]

// Slide horizontal: hacia Mascotas el panel entra por la derecha y sale por la izquierda
// (te "manda" a la derecha); hacia Personas, al revés.
export default function ModeTransition({ to, from, onCovered }) {
  const dir = to === 'mascotas' ? 1 : -1
  const [iconMode, setIconMode] = useState(from)
  const done = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => setIconMode(to), 300)
    return () => clearTimeout(t)
  }, [to])

  return (
    <motion.div
      className={`mode-curtain curtain-${to}`}
      initial={{ x: `${dir * 100}%` }}
      animate={{ x: '0%' }}
      exit={{ x: `${-dir * 100}%`, transition: { duration: 0.55, ease } }}
      transition={{ duration: 0.55, ease }}
      onAnimationComplete={() => { if (done.current) return; done.current = true; setTimeout(onCovered, 280) }}
    >
      <motion.div
        className="curtain-content"
        initial={{ x: dir * 160, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -dir * 160, opacity: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.1 }}
      >
        <div className="curtain-icon"><ModeIcon mode={iconMode} size={72} /></div>
        <span className="curtain-big">{MODES[to].label}</span>
      </motion.div>
    </motion.div>
  )
}
