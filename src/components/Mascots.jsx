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

// Miki (Mascotas): perrito blanco, de perfil, simple. Mueve las patas al caminar.
function Leg({ x, walking, delay }) {
  return (
    <motion.rect
      x={x} y="58" width="8" height="20" fill="#ffffff" stroke="#8d969a" strokeWidth="2"
      style={{ originX: `${x + 4}px`, originY: '58px', transformBox: 'view-box' }}
      animate={walking ? { rotate: [22, -22, 22] } : { rotate: 0 }}
      transition={walking ? { duration: 0.45, repeat: Infinity, delay } : { duration: 0.2 }}
    />
  )
}

export function Miki({ walking = false, talking = false }) {
  return (
    <svg viewBox="0 0 124 88" className="mascot-svg" aria-hidden="true">
      <ellipse cx="60" cy="84" rx="40" ry="3" fill="rgba(0,0,0,.15)" />
      {/* cola */}
      <motion.path
        d="M26 44 C14 40 12 28 18 22"
        fill="none" stroke="#8d969a" strokeWidth="9" strokeLinecap="round"
        style={{ originX: '26px', originY: '44px', transformBox: 'view-box' }}
        animate={{ rotate: [0, -20, 0] }}
        transition={{ duration: walking ? 0.35 : 0.9, repeat: Infinity }}
      />
      <motion.path
        d="M26 44 C14 40 12 28 18 22"
        fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round"
        style={{ originX: '26px', originY: '44px', transformBox: 'view-box' }}
        animate={{ rotate: [0, -20, 0] }}
        transition={{ duration: walking ? 0.35 : 0.9, repeat: Infinity }}
      />
      {/* patas */}
      <Leg x={32} walking={walking} delay={0.22} />
      <Leg x={44} walking={walking} delay={0} />
      <Leg x={70} walking={walking} delay={0} />
      <Leg x={82} walking={walking} delay={0.22} />
      {/* cuerpo */}
      <ellipse cx="58" cy="48" rx="36" ry="20" fill="#ffffff" stroke="#8d969a" strokeWidth="2.2" />
      {/* cabeza */}
      <motion.g
        animate={walking ? { y: [0, -2, 0] } : { rotate: [0, -6, 0, 0] }}
        transition={walking ? { duration: 0.45, repeat: Infinity } : { duration: 4, repeat: Infinity }}
        style={{ originX: '92px', originY: '40px', transformBox: 'view-box' }}
      >
        <circle cx="94" cy="30" r="20" fill="#ffffff" stroke="#8d969a" strokeWidth="2.2" />
        <ellipse cx="112" cy="36" rx="9" ry="7" fill="#ffffff" stroke="#8d969a" strokeWidth="2.2" />
        <ellipse cx="85" cy="30" rx="7" ry="13" fill="#d7dbdc" transform="rotate(14 85 30)" />
        <motion.g {...blink} style={{ originY: '27px', transformBox: 'view-box' }}>
          <circle cx="100" cy="27" r="3" fill="#1b1b1b" />
        </motion.g>
        <circle cx="118" cy="33" r="3.6" fill="#1b1b1b" />
        <motion.path
          d="M108 42 Q113 46 118 41"
          fill="none" stroke="#1b1b1b" strokeWidth="1.8" strokeLinecap="round"
          animate={talking ? { d: ['M108 42 Q113 46 118 41', 'M108 42 Q113 50 118 41', 'M108 42 Q113 46 118 41'] } : {}}
          transition={{ duration: 0.3, repeat: talking ? Infinity : 0 }}
        />
      </motion.g>
      {/* collar */}
      <rect x="76" y="40" width="6" height="16" fill="#01a9b1" transform="rotate(-20 79 48)" />
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
