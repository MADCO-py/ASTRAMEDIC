import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const blink = {
  animate: { scaleY: [1, 1, 0.1, 1, 1] },
  transition: { duration: 5, times: [0, 0.92, 0.94, 0.96, 1], repeat: Infinity },
}

// Astra (Personas): la "A" del logo, con ojos y boca. Camina y da vueltas.
export function Astra({ walking = false, talking = false }) {
  return (
    <motion.svg
      viewBox="0 0 80 100"
      className="mascot-svg"
      aria-hidden="true"
      animate={walking ? { rotate: [-5, 5, -5], rotateY: 0 } : { rotate: 0, rotateY: [0, 0, 360] }}
      transition={walking ? { duration: 0.6, repeat: Infinity } : { duration: 5, times: [0, 0.8, 1], repeat: Infinity, ease: 'easeInOut' }}
      style={{ originX: '50%', originY: '100%' }}
    >
      <ellipse cx="40" cy="97" rx="26" ry="2.5" fill="rgba(0,0,0,.15)" />
      {/* swoosh turquesa detrás */}
      <path d="M70 18 C86 34 74 58 44 70" fill="none" stroke="#01a9b1" strokeWidth="4" strokeLinecap="round" />
      {/* la A */}
      <path
        fillRule="evenodd"
        fill="#01265c"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinejoin="round"
        paintOrder="stroke"
        d="M4 90 L30 4 L50 4 L76 90 L56 90 L50 70 L30 70 L24 90 Z M35 56 L40 32 L45 56 Z"
      />
      {/* swoosh turquesa delante */}
      <path d="M2 74 C10 92 50 92 72 66" fill="none" stroke="#01a9b1" strokeWidth="4" strokeLinecap="round" />
      {/* cara */}
      <motion.g {...blink} style={{ originY: '50px', transformBox: 'view-box' }}>
        <circle cx="24" cy="50" r="4" fill="#ffffff" />
        <circle cx="56" cy="50" r="4" fill="#ffffff" />
        <circle cx="25" cy="51" r="1.8" fill="#01265c" />
        <circle cx="55" cy="51" r="1.8" fill="#01265c" />
      </motion.g>
      <motion.path
        d="M34 62 Q40 67 46 62"
        fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round"
        animate={talking ? { d: ['M34 62 Q40 67 46 62', 'M34 62 Q40 70 46 62', 'M34 62 Q40 67 46 62'] } : {}}
        transition={{ duration: 0.3, repeat: talking ? Infinity : 0 }}
      />
    </motion.svg>
  )
}

// Miki (Mascotas): perrito blanco de perfil, vestido de doctor.
// Camina moviendo las patas; sentado (al abrir el chat) baja la cadera y mueve la colita.
const LINE = '#8d969a'
const TEAL = '#01a9b1'
const NAVY = '#01265c'

function Leg({ x, walking, delay, folded = false }) {
  return (
    <motion.rect
      x={x} y="58" width="8" height="20" fill="#ffffff" stroke={LINE} strokeWidth="2"
      style={{ originX: `${x + 4}px`, originY: '58px', transformBox: 'view-box' }}
      animate={folded ? { rotate: 0, scaleY: 0.35 } : walking ? { rotate: [22, -22, 22], scaleY: 1 } : { rotate: 0, scaleY: 1 }}
      transition={walking && !folded ? { duration: 0.45, repeat: Infinity, delay } : { duration: 0.3 }}
    />
  )
}

// La cabeza (y la pupila) de Miki siguen al cursor, con movimiento suave
function useLookAt() {
  const pivot = useRef(null)
  const head = useRef(null)
  const pupil = useRef(null)
  useEffect(() => {
    let target = { a: 0, px: 0, py: 0 }
    const cur = { a: 0, px: 0, py: 0 }
    let raf = 0
    const onMove = (e) => {
      const p = pivot.current
      if (!p) return
      const r = p.getBoundingClientRect()
      const ctm = p.ownerSVGElement?.getScreenCTM()
      const flip = ctm && ctm.a < 0 ? -1 : 1 // si está volteado hacia la izquierda
      const dx = (e.clientX - (r.left + r.width / 2)) * flip
      const dy = e.clientY - (r.top + r.height / 2)
      const ang = (Math.atan2(dy, Math.abs(dx) + 20) * 180) / Math.PI
      const len = Math.hypot(dx, dy) || 1
      target = {
        a: Math.max(-38, Math.min(22, ang)),
        px: (dx / len) * 1.3,
        py: (dy / len) * 1.3,
      }
    }
    const loop = () => {
      cur.a += (target.a - cur.a) * 0.12
      cur.px += (target.px - cur.px) * 0.2
      cur.py += (target.py - cur.py) * 0.2
      head.current?.setAttribute('transform', `rotate(${cur.a.toFixed(2)} 86 44)`)
      pupil.current?.setAttribute('transform', `translate(${cur.px.toFixed(2)} ${cur.py.toFixed(2)})`)
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [])
  return { pivot, head, pupil }
}

export function Miki({ walking = false, sitting = false, talking = false }) {
  const look = useLookAt()
  const moving = walking && !sitting
  const tail = sitting
    ? { animate: { rotate: [10, -35, 10] }, transition: { duration: 0.32, repeat: Infinity } }
    : { animate: { rotate: [0, -20, 0] }, transition: { duration: moving ? 0.35 : 0.9, repeat: Infinity } }
  return (
    <svg viewBox="0 0 124 92" className="mascot-svg" aria-hidden="true">
      <ellipse cx="62" cy="88" rx="40" ry="3" fill="rgba(0,0,0,.15)" />

      {/* parte trasera: se inclina hacia abajo al sentarse */}
      <motion.g
        animate={{ rotate: sitting ? -22 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        style={{ originX: '80px', originY: '52px', transformBox: 'view-box' }}
      >
        {/* cola */}
        {['#8d969a', '#ffffff'].map((c, i) => (
          <motion.path
            key={c}
            d="M26 44 C14 40 12 28 18 22"
            fill="none" stroke={c} strokeWidth={i ? 5 : 9} strokeLinecap="round"
            style={{ originX: '26px', originY: '44px', transformBox: 'view-box' }}
            {...tail}
          />
        ))}
        {/* patas traseras */}
        <Leg x={32} walking={moving} delay={0.22} folded={sitting} />
        <Leg x={44} walking={moving} delay={0} folded={sitting} />
        {/* cuerpo */}
        <ellipse cx="58" cy="48" rx="36" ry="20" fill="#ffffff" stroke={LINE} strokeWidth="2.2" />
        {/* filipina de doctor */}
        <path d="M44 31 Q60 27 80 31 L84 62 Q62 69 42 64 Z" fill={TEAL} stroke="#018a92" strokeWidth="1.5" />
        <path d="M80 31 L70 46 L78 60" fill="none" stroke="#ffffff" strokeWidth="1.6" opacity=".85" />
        <rect x="52" y="46" width="11" height="9" fill="#ffffff" opacity=".9" />
        <path d="M57.5 47.5 v6 M54.5 50.5 h6" stroke="#e5484d" strokeWidth="1.8" />
      </motion.g>

      {/* patas delanteras */}
      <Leg x={70} walking={moving} delay={0} />
      <Leg x={82} walking={moving} delay={0.22} />

      {/* cabeza: mira hacia el cursor */}
      <circle ref={look.pivot} cx="94" cy="30" r="1" fill="none" />
      <g ref={look.head}>
      <motion.g
        animate={moving ? { y: [0, -2, 0] } : { y: sitting ? -2 : 0 }}
        transition={moving ? { duration: 0.45, repeat: Infinity } : { duration: 0.3 }}
      >
        <circle cx="94" cy="30" r="20" fill="#ffffff" stroke={LINE} strokeWidth="2.2" />
        <ellipse cx="112" cy="36" rx="9" ry="7" fill="#ffffff" stroke={LINE} strokeWidth="2.2" />
        <ellipse cx="85" cy="30" rx="7" ry="13" fill="#d7dbdc" transform="rotate(14 85 30)" />
        {/* gorro quirúrgico */}
        <path d="M76 20 Q80 4 97 5 Q112 6 113 19 Q96 14 76 20 Z" fill={TEAL} stroke="#018a92" strokeWidth="1.5" />
        <path d="M95 7.5 v8 M91 11.5 h8" stroke="#ffffff" strokeWidth="2.2" />
        <motion.g {...blink} style={{ originY: '27px', transformBox: 'view-box' }}>
          <g ref={look.pupil}>
            <circle cx="100" cy="27" r="3" fill="#1b1b1b" />
            <circle cx="101" cy="26" r="0.9" fill="#ffffff" />
          </g>
        </motion.g>
        <circle cx="118" cy="33" r="3.6" fill="#1b1b1b" />
        <motion.path
          d="M108 42 Q113 46 118 41"
          fill="none" stroke="#1b1b1b" strokeWidth="1.8" strokeLinecap="round"
          animate={talking ? { d: ['M108 42 Q113 46 118 41', 'M108 42 Q113 50 118 41', 'M108 42 Q113 46 118 41'] } : {}}
          transition={{ duration: 0.3, repeat: talking ? Infinity : 0 }}
        />
      </motion.g>
      </g>

      {/* estetoscopio colgado al cuello */}
      <path d="M78 44 C76 58 86 64 92 56" fill="none" stroke={NAVY} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M92 56 L92 64" stroke={NAVY} strokeWidth="2" />
      <circle cx="92" cy="67" r="3.6" fill="#c9d3da" stroke={NAVY} strokeWidth="1.8" />
    </svg>
  )
}

export function Paw() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <ellipse cx="20" cy="27" rx="9" ry="8" fill="currentColor" />
      <ellipse cx="8" cy="17" rx="4" ry="5" fill="currentColor" />
      <ellipse cx="15" cy="9" rx="4" ry="5" fill="currentColor" />
      <ellipse cx="25" cy="9" rx="4" ry="5" fill="currentColor" />
      <ellipse cx="32" cy="17" rx="4" ry="5" fill="currentColor" />
    </svg>
  )
}
