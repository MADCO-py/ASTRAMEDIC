import { CONTACT, contactLink } from '../data.js'
import { Eyebrow, Magnetic, Reveal, SplitWords } from './ui.jsx'
import Socials from './Socials.jsx'
import GuateMap from './GuateMap.jsx'
import { WhatsAppIcon } from './Icons.jsx'

export default function Contact({ mode }) {
  const contact = contactLink(`Hola Astramedic, quiero información de los planes para ${mode}.`)

  return (
    <section id="contacto" className="section contact">
      <div className="contact-map">
        <GuateMap />
      </div>
      <div className="contact-inner">
        <Eyebrow index="04">Cobertura y contacto</Eyebrow>
        <h2 className="h2">
          <SplitWords text="Cubrimos todo" className="line" />
          <SplitWords text="Guatemala." className="line line-alt" delay={0.15} />
        </h2>
        <Reveal delay={0.2}>
          <p className="lead">Llegamos a los 17 municipios del departamento, incluida la Ciudad de Guatemala. Para más información, escribinos por WhatsApp o correo.</p>
          <div className="contact-actions">
            <Magnetic className="btn btn-primary btn-wa btn-wa-big" href={contact.href} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={22} /> {contact.label}
            </Magnetic>
            <div className="contact-lines">
              <a href={contact.href} target="_blank" rel="noreferrer" className="contact-mail">
                {CONTACT.whatsappDisplay}
                {CONTACT.whatsappIsPlaceholder && <span className="placeholder-flag">Número de prueba</span>}
              </a>
              <a className="contact-mail" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </div>
          </div>
          <Socials />
        </Reveal>
      </div>
    </section>
  )
}
