import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { contactLink } from '../data.js'
import { WhatsAppIcon } from './Icons.jsx'
import { ease } from './ui.jsx'

// Barra fija de WhatsApp (solo celular). Aparece al pasar el inicio,
// que ya tiene su propio botón.
export default function MobileWhatsApp({ mode }) {
  const { scrollY } = useScroll()
  const [show, setShow] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setShow(v > window.innerHeight * 0.7))
  const contact = contactLink(`Hola Astramedic, quiero información de los planes para ${mode}.`)

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="m-wa"
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          exit={{ y: '110%' }}
          transition={{ duration: 0.4, ease }}
        >
          <a href={contact.href} target="_blank" rel="noreferrer" className="m-wa-btn">
            <WhatsAppIcon size={20} /> Escribinos por WhatsApp
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
