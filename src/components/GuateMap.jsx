import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Mapa estilizado (no a escala) del departamento de Guatemala.
// Por ahora solo la Ciudad de Guatemala es zona de cobertura; el pin late sobre ella.
const MUNICIPIOS = [
  { id: 1, name: 'San Juan Sacatepéquez', pts: '40,110 70,70 120,60 140,95 135,150 110,175 70,165' },
  { id: 2, name: 'San Raymundo', pts: '120,60 150,40 170,60 165,110 140,120 140,95' },
  { id: 3, name: 'Chuarrancho', pts: '150,40 215,25 240,55 205,75 170,60' },
  { id: 4, name: 'San José del Golfo', pts: '240,55 275,45 305,75 280,100 250,90' },
  { id: 5, name: 'San Pedro Ayampuc', pts: '205,75 240,55 250,90 280,100 265,130 215,135 200,105' },
  { id: 6, name: 'Chinautla', pts: '165,110 170,60 205,75 200,105 215,135 190,145 165,140' },
  { id: 7, name: 'San Pedro Sacatepéquez', pts: '110,175 135,150 140,120 165,110 165,140 160,150 150,180 115,190' },
  { id: 8, name: 'Mixco', pts: '115,190 150,180 160,200 170,210 158,235 120,240 105,215' },
  { id: 10, name: 'Palencia', pts: '265,130 280,100 305,75 340,95 370,150 350,185 300,180 272,165 275,128' },
  { id: 11, name: 'San José Pinula', pts: '272,165 300,180 350,185 345,220 300,250 260,235 240,190' },
  { id: 12, name: 'Santa Catarina Pinula', pts: '170,210 200,200 240,190 260,235 225,245 190,235' },
  { id: 13, name: 'Villa Nueva', pts: '120,240 158,235 170,210 190,235 180,265 150,270 125,265' },
  { id: 14, name: 'Petapa', pts: '180,265 190,235 225,245 215,280 195,285' },
  { id: 15, name: 'Fraijanes', pts: '225,245 260,235 300,250 290,300 255,320 240,285' },
  { id: 16, name: 'Villa Canales', pts: '195,285 215,280 225,245 240,285 255,320 240,360 205,385 185,340' },
  { id: 17, name: 'Amatitlán', pts: '125,265 150,270 180,265 195,285 185,340 150,320 120,295' },
]
const CIUDAD = { id: 9, name: 'Ciudad de Guatemala', pts: '160,150 165,140 190,145 215,135 265,130 275,128 272,165 240,190 200,200 170,210 160,200 150,180' }

// centro aproximado de cada municipio (promedio de sus vértices)
const center = (pts) => {
  const xy = pts.split(' ').map((p) => p.split(',').map(Number))
  return [xy.reduce((a, p) => a + p[0], 0) / xy.length, xy.reduce((a, p) => a + p[1], 0) / xy.length]
}
const PIN_TIP = [215, 168]

export default function GuateMap() {
  const [hover, setHover] = useState(null)
  const [hop, setHop] = useState(0)
  const all = [...MUNICIPIOS, CIUDAD].sort((x, y) => x.id - y.id)

  // el pin brinca sobre la ciudad cada cierto tiempo
  useEffect(() => {
    const t = setInterval(() => setHop((n) => n + 1), 2200)
    return () => clearInterval(t)
  }, [])

  const shown = all.find((m) => m.id === (hover ?? CIUDAD.id))
  const covered = shown.id === CIUDAD.id
  const [ax, ay] = center(CIUDAD.pts)

  return (
    <div className="gmap">
      <svg viewBox="20 10 370 390" className="gmap-svg" role="img" aria-label="Mapa del departamento de Guatemala: por ahora la zona de cobertura es la Ciudad de Guatemala">
        {/* contorno que late alrededor de la ciudad */}
        <motion.g
          className="gmap-pulse"
          animate={{ opacity: [0.5, 0], scale: [1, 1.06] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: 1.6 }}
          style={{ originX: '205px', originY: '205px', transformBox: 'view-box' }}
        >
          <polygon points={CIUDAD.pts} />
        </motion.g>
        <g className="gmap-base">
          {all.map((m) => <polygon key={m.id} points={m.pts} />)}
        </g>
        {all.map((m, i) => (
          <motion.polygon
            key={m.id}
            points={m.pts}
            className={`gmap-muni ${m.id === CIUDAD.id ? 'is-city' : 'is-out'} ${hover === m.id ? 'is-hover' : ''}`}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
            style={{ originX: '205px', originY: '205px', transformBox: 'view-box' }}
            onPointerEnter={() => setHover(m.id)}
            onPointerLeave={() => setHover(null)}
          />
        ))}
        <ellipse cx="160" cy="292" rx="24" ry="7" transform="rotate(-18 160 292)" className="gmap-lake" />
        {/* pin sobre la Ciudad de Guatemala */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          animate={{ x: ax - PIN_TIP[0], y: ay - PIN_TIP[1] + 4 }}
          transition={{ type: 'spring', stiffness: 170, damping: 16 }}
        >
          <motion.ellipse
            key={`s${hop}`}
            cx={PIN_TIP[0]} cy={PIN_TIP[1]} rx="7" ry="2.5" className="gmap-pin-shadow"
            initial={{ scale: 0.3, opacity: 0.2 }}
            animate={{ scale: 1, opacity: 0.45 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <motion.g
            key={`p${hop}`}
            initial={{ y: 0 }}
            animate={{ y: [0, -26, 0, -6, 0] }}
            transition={{ duration: 0.7, times: [0, 0.4, 0.7, 0.85, 1], ease: 'easeOut' }}
          >
            <path d="M215 168 l-9 -14 a11 11 0 1 1 18 0 z" className="gmap-pin" />
            <rect x="211" y="143" width="8" height="8" className="gmap-pin-dot" />
          </motion.g>
        </motion.g>
      </svg>

      <div className="gmap-legend">
        <span className="gmap-key"><i /> Zona de cobertura: Ciudad de Guatemala*</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={shown.id}
            className="gmap-name"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {covered ? `${shown.name} ✓` : `${shown.name} · fuera de cobertura por ahora`}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}
