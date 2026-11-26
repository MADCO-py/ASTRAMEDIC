import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion'
import { MODES, contactLink, getFaq, matchFaq } from '../data.js'
import { Astra, Miki } from './Mascots.jsx'
import { ease } from './ui.jsx'

// Avatar pequeño (encabezado y mensajes del chat)
function Avatar({ mode, ...props }) {
  return mode === 'personas' ? <Astra {...props} /> : <Miki {...props} />
}

const time = () => new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })

// Recorrido: camina a la izquierda, pausa 10 s, regresa a la derecha, pausa 10 s.
// En celular camina menos para no tapar el contenido.
const WALK_X = typeof window !== 'undefined' && window.innerWidth < 600 ? -90 : -170
const SPEED = 170 / 2.6 // px por segundo
const PAUSE = 10000

// Mueve al asistente con su propio motion value: así puede detenerse justo donde está
function useWalker(paused) {
  const x = useMotionValue(0)
  const [pose, setPose] = useState('stand-right')

  useEffect(() => {
    if (paused) return
    let cancelled = false
    let ctrl = null
    const timers = []
    const wait = (ms) => new Promise((r) => timers.push(setTimeout(r, ms)))
    const go = async (target, dir) => {
      const dist = Math.abs(target - x.get())
      if (dist > 1) {
        setPose(`walk-${dir}`)
        ctrl = animate(x, target, { duration: dist / SPEED, ease: 'linear' })
        await ctrl
      }
      if (!cancelled) setPose(`stand-${dir}`)
    }
    ;(async () => {
      await wait(3000)
      while (!cancelled) {
        await go(WALK_X, 'left'); if (cancelled) break
        await wait(PAUSE); if (cancelled) break
        await go(0, 'right'); if (cancelled) break
        await wait(PAUSE)
      }
    })()
    return () => {
      cancelled = true
      ctrl?.stop()
      timers.forEach(clearTimeout)
      setPose((p) => p.replace('walk-', 'stand-'))
    }
  }, [paused, x])

  return { x, pose }
}

function useIsMobile() {
  const query = '(max-width: 760px)'
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return m
}

export default function Chatbot({ mode }) {
  const [open, setOpen] = useState(false)
  const [bubble, setBubble] = useState(false)
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const bodyRef = useRef(null)
  const timers = useRef([])
  const isMobile = useIsMobile()
  // En celular Astra se queda quieto en la esquina derecha
  const astraStill = isMobile && mode === 'personas'
  const walk = useWalker(open || astraStill)
  useEffect(() => { if (astraStill) walk.x.set(0) }, [astraStill, walk.x])
  const face = !astraStill && walk.pose.endsWith('left') ? -1 : 1
  const walking = walk.pose.startsWith('walk')

  const faq = getFaq(mode)
  const bot = MODES[mode].bot
  const isRobot = mode === 'personas'
  const greeting = isRobot
    ? `Hola, soy ${bot.name}, el asistente virtual de Astramedic. ¿En qué te echo la mano? Elegí un tema o escribí tu pregunta.`
    : `¡Guau! Soy ${bot.name}, el asistente de Astramedic Mascotas. ¿En qué te echo la mano? Elegí un tema o escribí tu pregunta.`

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    setMessages([{ from: 'bot', text: greeting, time: time() }])
    setTyping(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  useEffect(() => {
    setBubble(false)
    const t1 = setTimeout(() => setBubble(true), 3500)
    const t2 = setTimeout(() => setBubble(false), 11000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [mode])

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    const onChat = () => { setOpen(true); setBubble(false) }
    window.addEventListener('astramedic:chat', onChat)
    return () => window.removeEventListener('astramedic:chat', onChat)
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const reply = (userText, answer) => {
    if (typing) return
    setMessages((m) => [...m, { from: 'user', text: userText, time: time() }])
    setTyping(true)
    const t = setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { from: 'bot', text: answer, time: time() }])
    }, 650 + Math.min(answer.length * 5, 900))
    timers.current.push(t)
  }

  const contact = contactLink(`Hola Astramedic, tengo una consulta sobre los planes para ${mode}.`)

  const send = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    const hit = matchFaq(mode, text)
    reply(
      text,
      hit
        ? hit.a
        : `No tengo esa respuesta todavía. Podés elegir uno de los temas de abajo o escribirle a nuestro equipo: ${contact.channel === 'whatsapp' ? 'por WhatsApp' : 'a ' + 'info@astra-medic.com'}.`
    )
  }

  const asked = new Set(messages.filter((m) => m.from === 'user').map((m) => m.text))

  return (
    <div className={`bot bot-${mode}`}>
      <AnimatePresence>
        {open && (
          <motion.div
            className="bot-panel"
            role="dialog"
            aria-label={`Asistente ${bot.name}`}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease }}
          >
            <header className="bot-head">
              <div className="bot-head-avatar"><Avatar mode={mode} talking={typing} /></div>
              <div className="bot-head-text">
                <strong>{bot.name}</strong>
                <span>
                  <i className="bot-dot" /> {typing ? 'Escribiendo…' : `${bot.role} · En línea`}
                </span>
              </div>
              <button className="bot-close" onClick={() => setOpen(false)} aria-label="Cerrar">✕</button>
            </header>

            <div className="bot-body" ref={bodyRef} data-lenis-prevent>
              {messages.map((m, i) => (
                <motion.div
                  key={`${mode}-${i}`}
                  className={`msg-row msg-row-${m.from}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease }}
                >
                  {m.from === 'bot' && <div className="msg-avatar"><Avatar mode={mode} /></div>}
                  <div className={`msg msg-${m.from}`}>
                    {m.text}
                    <span className="msg-time">{m.time}</span>
                  </div>
                </motion.div>
              ))}
              <AnimatePresence>
                {typing && (
                  <motion.div key="typing" className="msg-row msg-row-bot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="msg-avatar"><Avatar mode={mode} talking /></div>
                    <div className="msg msg-bot msg-typing">
                      {[0, 1, 2].map((d) => (
                        <motion.span key={d} animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!typing && (
                <div className="bot-options" key={messages.length}>
                  {faq.map((item, i) => (
                    <motion.button
                      key={item.q}
                      className={`bot-option ${asked.has(item.q) ? 'asked' : ''}`}
                      onClick={() => reply(item.q, item.a)}
                      initial={{ opacity: 0, scale: 0.6, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 22, delay: 0.1 + i * 0.05 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.q}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>


            <form className="bot-input" onSubmit={send}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribí tu pregunta…"
                aria-label="Escribí tu pregunta"
                maxLength={200}
              />
              <button type="submit" disabled={!input.trim() || typing} aria-label="Enviar">↑</button>
            </form>
            <a className="bot-human" href={contact.href} target="_blank" rel="noreferrer">
              ¿Preferís hablar con una persona? {contact.channel === 'whatsapp' ? 'WhatsApp' : 'Escribinos'} →
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="bot-walker"
        style={{ x: walk.x }}
      >
        <AnimatePresence>
          {bubble && !open && (
            <motion.button
              className="bot-bubble"
              onClick={() => { setOpen(true); setBubble(false) }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
            >
              {isRobot ? 'Hola, soy Astra. ¿Te echo la mano?' : '¡Guau! Soy Miki, ¿te echo la mano?'}
            </motion.button>
          )}
        </AnimatePresence>
        <motion.button
          className="bot-launcher"
          onClick={() => { setOpen((o) => !o); setBubble(false) }}
          aria-label={open ? 'Cerrar asistente' : 'Abrir asistente de preguntas frecuentes'}
          aria-expanded={open}
          whileTap={{ scale: 0.94 }}
        >
          <motion.div className="bot-figure" animate={{ scaleX: face }} transition={{ duration: 0.25 }}>
            {/* Al darle clic (chat abierto), Miki se sienta y mueve la colita */}
            {isRobot ? <Astra walking={walking} still={astraStill} /> : <Miki walking={walking} sitting={open} />}
          </motion.div>
          <span className="bot-launcher-label">{open ? 'Cerrar' : 'Ayuda'}</span>
        </motion.button>
      </motion.div>
    </div>
  )
}
