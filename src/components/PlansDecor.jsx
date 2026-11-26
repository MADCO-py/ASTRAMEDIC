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
