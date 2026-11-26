import { Fragment, useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useSpring } from 'framer-motion'

export const ease = [0.22, 1, 0.36, 1]

// Texto que aparece palabra por palabra al entrar en pantalla
export function SplitWords({ text, className, delay = 0, as: Tag = 'span', stagger = 0.06 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const words = text.split(' ')
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="word-mask" aria-hidden="true">
            <motion.span
              className="word"
              initial={{ y: '110%' }}
              animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 0.9, ease, delay: delay + i * stagger }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  )
}

export function Reveal({ children, delay = 0, y = 40, className, ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

// Número que cuenta hacia el valor
export function CountUp({ value, prefix = '', decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(value)
  const prev = useRef(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(prev.current, value, {
      duration: 1.1,
      ease,
      onUpdate: (v) => setDisplay(v),
    })
    prev.current = value
    return () => controls.stop()
  }, [value, inView])
  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString('es-GT', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  )
}

// Botón / enlace con efecto magnético
export function Magnetic({ children, className, strength = 0.25, as = 'a', ...rest }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18 })
  const sy = useSpring(y, { stiffness: 220, damping: 18 })
  const Comp = as === 'button' ? motion.button : motion.a
  return (
    <Comp
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => { x.set(0); y.set(0) }}
      whileTap={{ scale: 0.96 }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

export function Eyebrow({ children, index }) {
  return (
    <div className="eyebrow">
      {index && <span className="eyebrow-index">{index}</span>}
      <span>{children}</span>
    </div>
  )
}
