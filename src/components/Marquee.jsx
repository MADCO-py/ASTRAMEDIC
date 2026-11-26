import { useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from 'framer-motion'

// Cinta infinita cuya velocidad reacciona al scroll
export default function Marquee({ items, baseVelocity = -2.2 }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false })
  const dir = useRef(1)
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000)
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    move += dir.current * move * f
    baseX.set(baseX.get() + move)
  })

  const row = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee-track" style={{ x }}>
        {[0, 1].map((k) => (
          <div className="marquee-group" key={k}>
            {row.map((t, i) => (
              <span key={i} className="marquee-item">
                {t}
                <span className="marquee-sep">✦</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
