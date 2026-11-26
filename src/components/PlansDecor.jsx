import { useEffect, useRef } from 'react'

// Escucha el cursor (o el dedo) en toda la página y llama a `fn` una vez por cuadro
function usePointer(fn) {
  const fnRef = useRef(fn)
  fnRef.current = fn
  useEffect(() => {
    let raf = 0
    let last = null
    const onMove = (e) => {
      last = { x: e.clientX, y: e.clientY }
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; fnRef.current(last) })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [])
}

// ─────────────────────────────────────────────────────────────
//  PERSONAS: campo de vacunas que apuntan hacia el cursor
// ─────────────────────────────────────────────────────────────
function Syringe() {
  return (
    <svg viewBox="0 0 20 60" aria-hidden="true">
      <line x1="10" y1="0" x2="10" y2="14" stroke="currentColor" strokeWidth="1.6" />
      <rect x="8" y="14" width="4" height="4" fill="currentColor" />
      <rect x="4" y="18" width="12" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <rect x="5.5" y="19.5" width="9" height="12" fill="var(--teal)" />
      <rect x="1" y="44" width="18" height="2.5" fill="currentColor" />
      <rect x="9" y="46" width="2" height="9" fill="currentColor" />
      <rect x="5" y="55" width="10" height="2.5" fill="currentColor" />
    </svg>
  )
}

export function SyringeField() {
  const ref = useRef(null)
  const items = useRef([])

  usePointer(({ x, y }) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box || y < box.top - 300 || y > box.bottom + 300) return
    for (const el of items.current) {
      if (!el) continue
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const angle = (Math.atan2(y - cy, x - cx) * 180) / Math.PI + 90
      const dist = Math.hypot(x - cx, y - cy)
      el.style.transform = `rotate(${angle}deg)`
      el.style.opacity = String(Math.max(0.16, 0.75 - dist / 900))
    }
  })

  const cells = Array.from({ length: 60 }, (_, i) => i)
  return (
    <div className="syringe-field" ref={ref} aria-hidden="true">
      {cells.map((i) => (
        <span key={i} className="syringe-cell">
          <span className="syringe" ref={(el) => (items.current[i] = el)} style={{ transform: `rotate(${(i * 37) % 360}deg)` }}>
            <Syringe />
          </span>
        </span>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  MASCOTAS: gato naranja. La imagen del gato tiene los ojos huecos;
//  detrás de cada hueco hay un ojo que se mueve hacia el cursor.
// ─────────────────────────────────────────────────────────────
const HOLES = [
  { src: './img/gato-ojo-izq.png', left: 28.67, top: 22.23 },
  { src: './img/gato-ojo-der.png', left: 49.35, top: 22.23 },
]
const HOLE_W = 10.37
const HOLE_H = 9.2

export function CatWatcher() {
  const eyes = useRef([])

  usePointer(({ x, y }) => {
    for (const el of eyes.current) {
      if (!el) continue
      const r = el.parentNode.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const a = Math.atan2(y - cy, x - cx)
      const k = Math.min(Math.hypot(x - cx, y - cy) / 220, 1)
      el.style.transform = `translate(calc(-50% + ${Math.cos(a) * k * 26}%), calc(-50% + ${Math.sin(a) * k * 22}%))`
    }
  })

  return (
    <div className="cat-watch" aria-hidden="true">
      {HOLES.map((h, i) => (
        <span
          key={h.src}
          className="cat-eye"
          style={{ left: `${h.left - 0.6}%`, top: `${h.top - 0.6}%`, width: `${HOLE_W + 1.2}%`, height: `${HOLE_H + 1.2}%` }}
        >
          <img ref={(el) => (eyes.current[i] = el)} src={h.src} alt="" draggable="false" />
        </span>
      ))}
      <img className="cat-body" src="./img/gato-naranja.webp" alt="" draggable="false" />
    </div>
  )
}
