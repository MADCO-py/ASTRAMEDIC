import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { NOTE, PAYMENT_METHODS, openLead } from '../data.js'
import { CountUp, Eyebrow, Magnetic, SplitWords, ease } from './ui.jsx'
import { CatWatcher, SyringeField } from './PlansDecor.jsx'
import PlanTable from './PlanTable.jsx'

export default function Plans({ data, mode }) {
  const [selected, setSelected] = useState(2)
  const plan = data.plans.find((p) => p.id === selected)

  return (
    <section id="planes" className={`section plans plans-${mode}`}>
      {mode === 'personas' && <SyringeField />}
      <div className="plans-grid">
        <div className="plans-left">
          <Eyebrow index="03">Planes anuales</Eyebrow>
          <h2 className="h2">
            <SplitWords text="Elegí cómo" className="line" />
            <SplitWords text="preferís pagar." className="line line-alt" delay={0.15} />
          </h2>
          <p className="lead">Elegí 1, 2 o 3 pagos para tu plan anual.</p>

          <LayoutGroup>
            <div className="plan-options" role="radiogroup" aria-label="Forma de pago">
              {data.plans.map((p) => {
                const active = p.id === selected
                return (
                  <button
                    key={p.id}
                    role="radio"
                    aria-checked={active}
                    className={`plan-option ${active ? 'active' : ''}`}
                    onClick={() => setSelected(p.id)}
                  >
                    {active && <motion.span layoutId={`plan-sel-${mode}`} className="plan-option-sel" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                    <span className="plan-option-name">
                      {p.name}
                      {p.featured && <span className="tag">Más elegido</span>}
                    </span>
                    <span className="plan-option-price">Q{p.price}<small>/año</small></span>
                  </button>
                )
              })}
            </div>
          </LayoutGroup>
          <p className="fineprint">{NOTE}</p>
        </div>

        <motion.div
          className="plan-summary"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1, ease }}
        >
          {mode === 'mascotas' && <CatWatcher />}
          <div className="plan-summary-head">
            <span className="plan-summary-label">Plan {data.label.toLowerCase()} · {plan.name}</span>
            <div className="plan-price">
              <CountUp value={plan.price} prefix="Q" />
              <span className="plan-price-per">/ al año</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={plan.monthly}
                className="plan-monthly"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                Equivale a Q{plan.monthly.toFixed(2)} mensuales
              </motion.p>
            </AnimatePresence>
          </div>

          <ul className="plan-features">
            <li className="plan-feature highlight">
              <span className="check">+</span> Visitas sin límite a domicilio
            </li>
            <AnimatePresence initial={false} mode="popLayout">
              {plan.features.map((f, i) => (
                <motion.li
                  layout
                  key={f}
                  className="plan-feature"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.4, ease, delay: i * 0.03 }}
                >
                  <span className="check">✓</span> {f}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="plan-pay">
            <span>Formas de pago</span>
            <div>{PAYMENT_METHODS.map((m) => <span key={m} className="chip">{m}</span>)}</div>
          </div>

          <Magnetic as="button" className="btn btn-primary btn-block" onClick={() => openLead({ plan: selected })} strength={0.08}>
            Solicitar información
          </Magnetic>
        </motion.div>
      </div>
      {mode === 'mascotas' && <PlanTable plans={data.plans} />}
    </section>
  )
}
