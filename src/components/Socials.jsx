import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CONTACT } from '../data.js'
import { MailIcon, SOCIAL_ICONS } from './Icons.jsx'

// Íconos de Instagram, Facebook y correo. Las redes que aún no están listas
// muestran "Próximamente" en lugar de abrir un enlace.
export default function Socials({ className = '' }) {
  const [soon, setSoon] = useState(null)
  return (
    <ul className={`socials ${className}`}>
      {CONTACT.socials.map((s) => {
        const Icon = SOCIAL_ICONS[s.icon]
        return (
          <li key={s.name}>
            <a
              href={s.ready ? s.url : '#'}
              target={s.ready ? '_blank' : undefined}
              rel="noreferrer"
              aria-label={s.ready ? s.name : `${s.name} (próximamente)`}
              className={s.ready ? '' : 'is-soon'}
              onClick={(e) => {
                if (s.ready) return
                e.preventDefault()
                setSoon(s.name)
                setTimeout(() => setSoon(null), 1800)
              }}
            >
              <Icon size={20} />
            </a>
            <AnimatePresence>
              {soon === s.name && (
                <motion.span className="soon-tip" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  Próximamente
                </motion.span>
              )}
            </AnimatePresence>
          </li>
        )
      })}
      <li>
        <a href={`mailto:${CONTACT.email}`} aria-label={`Correo: ${CONTACT.email}`}>
          <MailIcon size={20} />
        </a>
      </li>
    </ul>
  )
}
