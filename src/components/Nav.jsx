import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import Logo from './Logo.jsx'
import { contactLink, openChat } from '../data.js'
import ModeToggle from './ModeToggle.jsx'
import { ease } from './ui.jsx'

const LINKS = [
  ['como-funciona', 'Cómo funciona'],
  ['servicios', 'Servicios'],
  ['planes', 'Planes'],
  ['contacto', 'Contacto'],
]

export default function Nav({ mode, onSwitch, scrollTo }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(v > 40)
    setHidden(v > 400 && v > prev && !open)
  })

  useEffect(() => { setOpen(false) }, [mode])

  const go = (id) => { setOpen(false); scrollTo(id) }
  const contact = contactLink()

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? 'is-scrolled' : ''}`}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease }}
      >
        <button className="nav-logo" onClick={() => go('top')} aria-label="Ir al inicio">
          <Logo tone={scrolled ? 'color' : mode === 'personas' ? 'light' : 'white'} />
        </button>

        <ModeToggle mode={mode} onSwitch={onSwitch} />

        <nav className="nav-links" aria-label="Secciones">
          {LINKS.slice(0, 3).map(([id, label]) => (
            <button key={id} onClick={() => go(id)}>{label}</button>
          ))}
          <button className="nav-menu-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            {open ? 'Cerrar' : 'Menú'}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.aside
            className="menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease }}
            data-lenis-prevent
          >
            <ul>
              {LINKS.map(([id, label], i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease }}
                >
                  <button onClick={() => go(id)}>{label}</button>
                </motion.li>
              ))}
              <motion.li initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5, ease }}>
                <button onClick={() => { setOpen(false); openChat() }}>Preguntas frecuentes</button>
              </motion.li>
            </ul>
            <div className="menu-foot">
              <a href={contact.href} target="_blank" rel="noreferrer" className="btn btn-primary btn-block">{contact.label}</a>
              <button className="btn btn-ghost btn-block" onClick={() => onSwitch(mode === 'personas' ? 'mascotas' : 'personas')}>
                Ver planes de {mode === 'personas' ? 'mascotas' : 'personas'}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div className="menu-scrim" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        )}
      </AnimatePresence>
    </>
  )
}
