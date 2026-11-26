import { AnimatePresence, motion } from 'framer-motion'

export function PersonGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="7.5" r="4" fill="currentColor" />
      <path d="M3.5 21c0-4.7 3.8-7.5 8.5-7.5s8.5 2.8 8.5 7.5z" fill="currentColor" />
    </svg>
  )
}

export function PawGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="16" rx="5.4" ry="4.6" fill="currentColor" />
      <ellipse cx="4.6" cy="10.4" rx="2.3" ry="2.9" fill="currentColor" />
      <ellipse cx="9" cy="5.6" rx="2.3" ry="2.9" fill="currentColor" />
      <ellipse cx="15" cy="5.6" rx="2.3" ry="2.9" fill="currentColor" />
      <ellipse cx="19.4" cy="10.4" rx="2.3" ry="2.9" fill="currentColor" />
    </svg>
  )
}

// Ícono que se "transforma" de humano a mascota y viceversa
export default function ModeIcon({ mode, size = 18 }) {
  return (
    <span className="mode-icon" style={{ width: size, height: size }}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={mode}
          className="mode-icon-inner"
          initial={{ scale: 0, rotate: mode === 'mascotas' ? -120 : 120, filter: 'blur(6px)' }}
          animate={{ scale: 1, rotate: 0, filter: 'blur(0px)' }}
          exit={{ scale: 0, rotate: mode === 'mascotas' ? 120 : -120, filter: 'blur(6px)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          {mode === 'mascotas' ? <PawGlyph /> : <PersonGlyph />}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
