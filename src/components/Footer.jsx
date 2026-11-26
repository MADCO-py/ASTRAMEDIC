import { CONTACT, NOTE, contactLink, openChat, openLegal } from '../data.js'
import Socials from './Socials.jsx'
import Logo from './Logo.jsx'
import { Magnetic } from './ui.jsx'

export default function Footer({ mode, onSwitch, scrollTo }) {
  const other = mode === 'personas' ? 'mascotas' : 'personas'
  const contact = contactLink()
  return (
    <footer className="footer">
      <button className="footer-cross" onClick={(e) => onSwitch(other, { x: e.clientX, y: e.clientY })}>
        <span className="footer-cross-small">¿Buscás el plan para {other}?</span>
        <span className="footer-cross-big">
          Astramedic <span className="footer-cross-word">{other === 'mascotas' ? 'Mascotas' : 'Personas'}</span> <span className="arrow">→</span>
        </span>
      </button>
      <div className="footer-grid">
        <div>
          <Logo tone={mode === 'personas' ? 'light' : 'white'} />
          <p className="footer-desc">Atención {mode === 'personas' ? 'médica' : 'veterinaria'} a domicilio en la Ciudad de Guatemala.</p>
        </div>
        <ul>
          <li><button onClick={() => scrollTo('como-funciona')}>Cómo funciona</button></li>
          <li><button onClick={() => scrollTo('servicios')}>Servicios</button></li>
          <li><button onClick={() => scrollTo('planes')}>Planes</button></li>
          <li><button onClick={openChat}>Preguntas frecuentes</button></li>
        </ul>
        <ul>
          <li><a href={contact.href} target="_blank" rel="noreferrer">{contact.label}</a></li>
          <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
          <li><button onClick={() => openLegal('terminos')}>Términos y condiciones</button></li>
          <li><button onClick={() => openLegal('privacidad')}>Aviso de privacidad</button></li>
        </ul>
        <div className="footer-top">
          <Socials className="socials-footer" />
          <Magnetic as="button" className="btn btn-ghost" onClick={() => scrollTo('top')}>↑ Volver arriba</Magnetic>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Astramedic. Todos los derechos reservados.</span>
        <span>{NOTE}</span>
      </div>
    </footer>
  )
}
