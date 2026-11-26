// Logo oficial de Astramedic.
// tone: 'color' (fondos claros) · 'light' (fondo azul marino) · 'white' (fondo turquesa)
const MARK = {
  color: './img/logo-mark.png',
  light: './img/logo-mark-light.png',
  white: './img/logo-mark-white.png',
}

export default function Logo({ tone = 'color', className = '' }) {
  return (
    <span className={`logo logo-${tone} ${className}`} aria-label="Astramedic">
      <img src={MARK[tone]} alt="" width="40" height="31" />
      <span className="logo-word">
        <span className="lw-a">ASTRA</span>
        <span className="lw-b">MEDIC</span>
      </span>
    </span>
  )
}
