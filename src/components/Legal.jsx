import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CONTACT, PAYMENT_METHODS } from '../data.js'
import { ease } from './ui.jsx'

// ⚠️ BORRADOR: estos textos se basan solo en la información del servicio.
// Deben revisarse con un asesor legal antes del lanzamiento.
const UPDATED = 'noviembre de 2026'

function Terminos() {
  return (
    <>
      <p className="legal-draft">Borrador pendiente de revisión legal.</p>
      <h4>1. El servicio</h4>
      <p>Astramedic ofrece planes anuales de atención a domicilio para personas (consulta médica general, laboratorios, vacunas y medicamentos con receta) y para mascotas (consulta veterinaria general, laboratorios, vacunas y medicamentos), según el plan contratado.</p>
      <h4>2. Cobertura</h4>
      <p>El servicio se presta en el departamento de Guatemala (sus 17 municipios, incluida la Ciudad de Guatemala). Las visitas a domicilio son sin límite durante la vigencia del plan anual.</p>
      <h4>3. Emergencias</h4>
      <p>Astramedic no atiende emergencias. Ante una emergencia, acudí al servicio de emergencias o a la clínica veterinaria de emergencias más cercana.</p>
      <h4>4. Precios y pagos</h4>
      <p>Los planes son anuales y pueden pagarse en 1, 2 o 3 pagos. Formas de pago aceptadas: {PAYMENT_METHODS.join(', ').toLowerCase()}. Precios y condiciones sujetos a cobertura y validación de Astramedic.</p>
      <h4>5. Coordinación de visitas</h4>
      <p>Las visitas se coordinan por WhatsApp o correo electrónico, a partir de la dirección que nos compartís.</p>
      <h4>6. Contacto</h4>
      <p>Para dudas sobre estos términos escribinos a {CONTACT.email}.</p>
    </>
  )
}

function Privacidad() {
  return (
    <>
      <p className="legal-draft">Borrador pendiente de revisión legal.</p>
      <h4>1. Qué datos recibimos</h4>
      <p>Este sitio no guarda datos personales. Cuando llenás el formulario de solicitud, tus datos (nombre, teléfono, zona y detalles del plan) se colocan en un mensaje de WhatsApp que vos decidís enviar.</p>
      <h4>2. Para qué los usamos</h4>
      <p>Usamos la información que nos enviás por WhatsApp o correo únicamente para responder tu solicitud y coordinar el servicio.</p>
      <h4>3. Con quién los compartimos</h4>
      <p>No vendemos ni compartimos tus datos con terceros para fines comerciales.</p>
      <h4>4. Tus derechos</h4>
      <p>Podés pedir que actualicemos o eliminemos tu información escribiendo a {CONTACT.email}.</p>
      <h4>5. Servicios externos</h4>
      <p>Al usar WhatsApp aplican también las políticas de privacidad de ese servicio.</p>
    </>
  )
}

export default function Legal() {
  const [tab, setTab] = useState(null)

  useEffect(() => {
    const onOpen = (e) => setTab(e.detail?.tab || 'terminos')
    const onKey = (e) => e.key === 'Escape' && setTab(null)
    window.addEventListener('astramedic:legal', onOpen)
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('astramedic:legal', onOpen); window.removeEventListener('keydown', onKey) }
  }, [])
  useEffect(() => { document.documentElement.classList.toggle('modal-open', !!tab) }, [tab])

  return (
    <AnimatePresence>
      {tab && (
        <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="modal-scrim" onClick={() => setTab(null)} />
          <motion.div
            className="modal-card legal"
            role="dialog"
            aria-label="Información legal"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease }}
            data-lenis-prevent
          >
            <header className="modal-head">
              <div className="legal-tabs">
                <button className={tab === 'terminos' ? 'on' : ''} onClick={() => setTab('terminos')}>Términos y condiciones</button>
                <button className={tab === 'privacidad' ? 'on' : ''} onClick={() => setTab('privacidad')}>Aviso de privacidad</button>
              </div>
              <button className="modal-close" onClick={() => setTab(null)} aria-label="Cerrar">✕</button>
            </header>
            <div className="legal-body">
              {tab === 'terminos' ? <Terminos /> : <Privacidad />}
              <p className="legal-updated">Última actualización: {UPDATED}.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
