import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CONTACT, MODES, PAYMENT_METHODS, waLink } from '../data.js'
import { WhatsAppIcon } from './Icons.jsx'
import { ease } from './ui.jsx'

const empty = { name: '', phone: '', zone: '', plan: 2, payment: '', pets: 1, petType: 'Perro', petName: '', comment: '' }

// Formulario: la persona llena sus datos y se abre WhatsApp con el mensaje ya escrito.
// No guarda nada en el sitio.
export default function LeadForm({ mode }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const firstRef = useRef(null)
  const isPet = mode === 'mascotas'
  const data = MODES[mode]

  useEffect(() => {
    const onOpen = (e) => {
      const d = e.detail || {}
      setForm((f) => ({ ...f, plan: d.plan ?? f.plan, pets: d.pets ?? f.pets }))
      setErrors({})
      setOpen(true)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('astramedic:lead', onOpen)
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('astramedic:lead', onOpen); window.removeEventListener('keydown', onKey) }
  }, [])

  useEffect(() => { if (open) setTimeout(() => firstRef.current?.focus(), 350) }, [open])
  useEffect(() => { document.documentElement.classList.toggle('modal-open', open) }, [open])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const plan = data.plans.find((p) => p.id === Number(form.plan))

  const buildMessage = () => {
    const lines = [
      `Hola Astramedic, quiero información del plan anual para ${isPet ? 'mascotas' : 'personas'}.`,
      '',
      `• Nombre: ${form.name.trim()}`,
      `• Teléfono: ${form.phone.trim()}`,
      `• Zona / colonia: ${form.zone.trim()}`,
      `• Plan: ${plan.name} (Q${plan.price} al año)`,
    ]
    if (form.payment) lines.push(`• Forma de pago: ${form.payment}`)
    if (isPet) {
      lines.push(`• Mascotas: ${form.pets} (${form.petType})`)
      if (form.petName.trim()) lines.push(`• Nombre(s): ${form.petName.trim()}`)
    }
    if (form.comment.trim()) lines.push(`• Comentario: ${form.comment.trim()}`)
    return lines.join('\n')
  }

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (form.name.trim().length < 2) err.name = 'Escribí tu nombre.'
    if (form.phone.replace(/\D/g, '').length < 8) err.phone = 'Escribí un teléfono de 8 dígitos.'
    if (!form.zone.trim()) err.zone = 'Indicá tu zona o colonia.'
    setErrors(err)
    if (Object.keys(err).length) return
    window.open(waLink(buildMessage()), '_blank', 'noopener')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="modal-scrim" onClick={() => setOpen(false)} />
          <motion.form
            className="modal-card lead"
            onSubmit={submit}
            noValidate
            role="dialog"
            aria-label="Solicitar información"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease }}
            data-lenis-prevent
          >
            <header className="modal-head">
              <div>
                <span className="modal-kicker">Plan {data.label.toLowerCase()}</span>
                <h3>Solicitar información</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setOpen(false)} aria-label="Cerrar">✕</button>
            </header>

            <p className="lead-intro">Llená tus datos y te abrimos WhatsApp con el mensaje ya escrito. Solo tenés que enviarlo.</p>

            <div className="field-grid">
              <label className={`field ${errors.name ? 'has-error' : ''}`}>
                <span>Nombre completo *</span>
                <input ref={firstRef} value={form.name} onChange={set('name')} autoComplete="name" maxLength={80} />
                {errors.name && <em>{errors.name}</em>}
              </label>
              <label className={`field ${errors.phone ? 'has-error' : ''}`}>
                <span>Teléfono *</span>
                <input value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" placeholder="0000 0000" maxLength={20} />
                {errors.phone && <em>{errors.phone}</em>}
              </label>
              <label className={`field span-2 ${errors.zone ? 'has-error' : ''}`}>
                <span>Zona y colonia *</span>
                <input value={form.zone} onChange={set('zone')} placeholder="Ej. Zona 15, Vista Hermosa" maxLength={100} />
                {errors.zone && <em>{errors.zone}</em>}
              </label>

              <fieldset className="field span-2">
                <span>Plan</span>
                <div className="seg">
                  {data.plans.map((p) => (
                    <button type="button" key={p.id} className={Number(form.plan) === p.id ? 'on' : ''} onClick={() => setForm((f) => ({ ...f, plan: p.id }))}>
                      {p.name}<small>Q{p.price}</small>
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="field span-2">
                <span>Forma de pago preferida</span>
                <select value={form.payment} onChange={set('payment')}>
                  <option value="">Todavía no sé</option>
                  {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </label>

              {isPet && (
                <>
                  <label className="field">
                    <span>¿Cuántas mascotas?</span>
                    <input type="number" min={1} max={20} value={form.pets} onChange={set('pets')} />
                  </label>
                  <label className="field">
                    <span>Tipo</span>
                    <select value={form.petType} onChange={set('petType')}>
                      <option>Perro</option>
                      <option>Gato</option>
                      <option>Perro y gato</option>
                      <option>Otro</option>
                    </select>
                  </label>
                  <label className="field span-2">
                    <span>Nombre de tu(s) mascota(s)</span>
                    <input value={form.petName} onChange={set('petName')} maxLength={80} />
                  </label>
                </>
              )}

              <label className="field span-2">
                <span>Comentario (opcional)</span>
                <textarea rows={2} value={form.comment} onChange={set('comment')} maxLength={300} />
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-wa">
              <WhatsAppIcon /> Continuar en WhatsApp
            </button>
            <p className="lead-privacy">
              Tus datos no se guardan en este sitio: solo se incluyen en el mensaje que vos enviás.
              {CONTACT.whatsappIsPlaceholder && <strong className="placeholder-flag"> Número de prueba: {CONTACT.whatsappDisplay}</strong>}
            </p>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
