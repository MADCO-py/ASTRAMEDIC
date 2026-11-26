import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import { MODES } from './data.js'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Steps from './components/Steps.jsx'
import Services from './components/Services.jsx'
import Plans from './components/Plans.jsx'
import Notice from './components/Notice.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Chatbot from './components/Chatbot.jsx'
import ModeTransition from './components/ModeTransition.jsx'
import Testimonials from './components/Testimonials.jsx'
import PetCalculator from './components/PetCalculator.jsx'
import PetGallery from './components/PetGallery.jsx'
import LeadForm from './components/LeadForm.jsx'
import Legal from './components/Legal.jsx'
import MobileWhatsApp from './components/MobileWhatsApp.jsx'

const readHash = () => (window.location.hash.replace(/^#\/?/, '') === 'mascotas' ? 'mascotas' : 'personas')

export default function App() {
  const [mode, setMode] = useState(readHash)
  const [switchingTo, setSwitchingTo] = useState(null)
  const lenisRef = useRef(null)

  // Scroll suave (Lenis)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenisRef.current = lenis
    let raf
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef.current = null }
  }, [])

  // Tema en <html>, título y color de barra del navegador
  useEffect(() => {
    document.documentElement.dataset.mode = mode
    document.title = mode === 'mascotas'
      ? 'Astramedic Mascotas | Veterinario a domicilio en Guatemala'
      : 'Astramedic | Médico a domicilio en Guatemala'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'mascotas' ? '#01a9b1' : '#01265c')
    if (readHash() !== mode) history.replaceState(null, '', `#/${mode}`)
  }, [mode])

  useEffect(() => {
    const onHash = () => { const next = readHash(); if (next !== mode) requestSwitch(next) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  })

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id)
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -60, duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const requestSwitch = (next, origin) => {
    if (next === mode || switchingTo) return
    setSwitchingTo({ to: next, from: mode, origin: origin || { x: window.innerWidth / 2, y: window.innerHeight / 2 } })
  }

  // La cortina cubrió la pantalla: cambiamos de modo debajo de ella
  const onCovered = () => {
    setMode(switchingTo.to)
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    setTimeout(() => setSwitchingTo(null), 120)
  }

  const data = MODES[mode]

  return (
    <>
      <Nav mode={mode} onSwitch={requestSwitch} scrollTo={scrollTo} />
      <AnimatePresence mode="wait">
        <motion.main
          key={mode}
          className="page"
          initial={{ opacity: 0, x: mode === 'mascotas' ? 80 : -80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Hero data={data} mode={mode} scrollTo={scrollTo} />
          <Marquee items={data.marquee} />
          <Steps data={data} mode={mode} />
          <Services data={data} mode={mode} />
          {mode === 'mascotas' && <PetGallery />}
          <Plans data={data} mode={mode} />
          {mode === 'mascotas' && <PetCalculator />}
          <Testimonials mode={mode} />
          <Notice mode={mode} />
          <Contact mode={mode} />
          <Footer mode={mode} onSwitch={requestSwitch} scrollTo={scrollTo} />
        </motion.main>
      </AnimatePresence>
      <MobileWhatsApp mode={mode} />
      <Chatbot mode={mode} />
      <LeadForm mode={mode} />
      <Legal />
      <AnimatePresence>
        {switchingTo && <ModeTransition key="mt" {...switchingTo} onCovered={onCovered} />}
      </AnimatePresence>
    </>
  )
}
