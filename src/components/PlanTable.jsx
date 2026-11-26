import { motion } from 'framer-motion'
import { openLead } from '../data.js'
import { ease } from './ui.jsx'

// Tabla comparativa: junta todos los beneficios de los planes y marca cuál incluye cada uno.
export default function PlanTable({ plans }) {
  const rows = ['Visitas sin límite a domicilio']
  plans.forEach((p) => p.features.forEach((f) => { if (!rows.includes(f)) rows.push(f) }))
  const has = (p, f) => f === 'Visitas sin límite a domicilio' || p.features.includes(f)

  return (
    <motion.div
      className="ptable-wrap"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, ease }}
    >
      <h3 className="ptable-title">Compará los planes</h3>
      <div className="ptable-scroll">
        <table className="ptable">
          <thead>
            <tr>
              <th scope="col"><span className="sr-only">Beneficio</span></th>
              {plans.map((p) => (
                <th key={p.id} scope="col" className={p.featured ? 'featured' : ''}>
                  {p.featured && <span className="tag">Más elegido</span>}
                  <span className="pt-name">{p.name}</span>
                  <span className="pt-price">Q{p.price}<small>/año</small></span>
                  <span className="pt-month">Q{p.monthly} al mes</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((f, r) => (
              <tr key={f}>
                <th scope="row">{f}</th>
                {plans.map((p) => (
                  <td key={p.id} className={p.featured ? 'featured' : ''}>
                    {has(p, f) ? (
                      <motion.span
                        className="pt-yes"
                        aria-label="Incluido"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 420, damping: 16, delay: 0.05 * r + 0.05 * p.id }}
                      >
                        ✓
                      </motion.span>
                    ) : (
                      <span className="pt-no" aria-label="No incluido">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" />
              {plans.map((p) => (
                <td key={p.id} className={p.featured ? 'featured' : ''}>
                  <button className="pt-cta" onClick={() => openLead({ plan: p.id })}>Lo quiero</button>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </motion.div>
  )
}
