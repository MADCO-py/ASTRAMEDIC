import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MODES, openLead } from '../data.js'
import { CountUp, Eyebrow, SplitWords, ease } from './ui.jsx'
import { Paw } from './Mascots.jsx'

const fmt = (n) => `Q${n.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// Calculadora: ¿cuántas mascotas tenés? (estimado: un plan por mascota)
export default function PetCalculator() {
  const plans = MODES.mascotas.plans
  const [pets, setPets] = useState(1)
  const [planId, setPlanId] = useState(2)
  const plan = plans.find((p) => p.id === planId)
  const total = plan.price * pets
  const perPayment = total / plan.id
  const monthly = plan.monthly * pets

  const change = (d) => setPets((n) => Math.max(1, Math.min(10, n + d)))

  return (
    <section id="calculadora" className="section calc">
      <div className="calc-grid">
        <div>
          <Eyebrow>Calculadora</Eyebrow>
          <h2 className="h2">
            <SplitWords text="¿Cuántas mascotas" className="line" />
            <SplitWords text="tenés?" className="line line-alt" delay={0.15} />
          </h2>
          <p className="lead">Calculá un estimado de tu plan anual según el número de mascotas y la forma de pago.</p>
        </div>

        <motion.div
          className="calc-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="calc-row">
            <span className="calc-label">Mascotas</span>
            <div className="stepper">
              <button onClick={() => change(-1)} disabled={pets <= 1} aria-label="Una mascota menos">−</button>
              <span className="stepper-value" aria-live="polite">{pets}</span>
              <button onClick={() => change(1)} disabled={pets >= 10} aria-label="Una mascota más">+</button>
            </div>
          </div>
          <div className="calc-paws" aria-hidden="true">
            <AnimatePresence initial={false}>
              {Array.from({ length: pets }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -40 }}
                  animate={{ scale: 1, rotate: i % 2 ? 12 : -12 }}
                  exit={{ scale: 0, rotate: 40 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                >
                  <Paw />
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          <div className="calc-row column">
            <span className="calc-label">Forma de pago</span>
            <div className="seg">
              {plans.map((p) => (
                <button key={p.id} className={p.id === planId ? 'on' : ''} onClick={() => setPlanId(p.id)}>
                  {p.name}<small>Q{p.price} c/u</small>
                </button>
              ))}
            </div>
          </div>

          <dl className="calc-result">
            <div className="big">
              <dt>Total anual estimado</dt>
              <dd><CountUp value={total} prefix="Q" /></dd>
            </div>
            <div>
              <dt>{plan.id === 1 ? 'Pago único' : `Cada pago (${plan.id})`}</dt>
              <dd>{fmt(perPayment)}</dd>
            </div>
            <div>
              <dt>Equivale al mes</dt>
              <dd>{fmt(monthly)}</dd>
            </div>
          </dl>

          <button className="btn btn-primary btn-block" onClick={() => openLead({ plan: planId, pets })}>
            Solicitar este plan
          </button>
          <p className="fineprint">* Estimado calculado como un plan por mascota. Precios y condiciones sujetos a cobertura y validación de Astramedic.</p>
        </motion.div>
      </div>
    </section>
  )
}
