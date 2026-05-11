import '../src/style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import {
  initLenis, initCursor, initMagnetic, initNav,
  splitReveal, fadeUp, scrubOpacity, glitch, typeWriter
} from './shared.js'

gsap.registerPlugin(ScrollTrigger)

/* ─── Init ───────────────────────────────────────────────────────────────── */
initLenis()
initCursor()
initNav()
initMagnetic()

/* ─── Hero entrance ──────────────────────────────────────────────────────── */
function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

  // Eyebrow badge
  tl.from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.8 }, 0.2)

  // Split headline by lines
  const titleLines = document.querySelectorAll('.hero-line')
  titleLines.forEach((line, i) => {
    const split = new SplitType(line, { types: 'words' })
    tl.from(split.words, {
      y: 80,
      opacity: 0,
      duration: 0.9,
      stagger: 0.04,
    }, 0.35 + i * 0.12)
  })

  // Typing subtitle
  const subtitle = document.querySelector('.hero-subtitle')
  typeWriter(subtitle, 'Deploy intelligent agents. Automate decisions. Ship faster than ever.')

  // CTAs
  tl.from('.hero-cta', { y: 30, opacity: 0, duration: 0.7 }, 1.0)
  tl.from('.hero-metrics', { y: 25, opacity: 0, duration: 0.7 }, 1.15)

  // Mockup
  tl.from('.hero-mockup', {
    y: 60,
    opacity: 0,
    scale: 0.96,
    duration: 1.2,
    ease: 'expo.out',
  }, 1.0)

  // Glitch the last hero line
  glitch(document.querySelector('.glitch-target'))

  // Orbs parallax
  gsap.to('.orb-1', {
    y: -80,
    scrollTrigger: { start: 'top top', end: 'bottom top', scrub: 1.5 },
  })
  gsap.to('.orb-2', {
    y: -40,
    x: 30,
    scrollTrigger: { start: 'top top', end: 'bottom top', scrub: 2 },
  })
}

/* ─── Marquee ────────────────────────────────────────────────────────────── */
function initMarquee() {
  // Pause/resume on scroll direction handled by Lenis scroll event
  // Marquee runs purely via CSS animation — no JS needed beyond setup
}

/* ─── Features bento ─────────────────────────────────────────────────────── */
function initFeatures() {
  // Cards stagger reveal
  gsap.from('.bento-card', {
    y: 50,
    opacity: 0,
    duration: 0.9,
    ease: 'expo.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: '.bento-grid',
      start: 'top 82%',
    },
  })

  // Hover glow on cards
  document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width)  * 100
      const y = ((e.clientY - r.top)  / r.height) * 100
      card.style.setProperty('--mouse-x', `${x}%`)
      card.style.setProperty('--mouse-y', `${y}%`)
    })
  })

  // NLP tokens animation
  const tokens = document.querySelectorAll('.nlp-token')
  if (tokens.length) {
    gsap.to(tokens, {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 0.5,
      ease: 'back.out(1.5)',
      delay: 0.5,
      scrollTrigger: { trigger: '.nlp-visual', start: 'top 80%' },
    })
    gsap.from(tokens, {
      opacity: 0,
      y: 12,
      stagger: 0.15,
      duration: 0.5,
      ease: 'back.out(1.5)',
      delay: 0.5,
      scrollTrigger: { trigger: '.nlp-visual', start: 'top 80%' },
    })
  }

  // Agent flow arrows draw
  gsap.from('.agent-arrow', {
    scaleX: 0,
    transformOrigin: 'left center',
    duration: 0.5,
    stagger: 0.2,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.agent-visual', start: 'top 78%' },
  })
}

/* ─── How it works (pinned left, scrolling right) ────────────────────────── */
function initHowItWorks() {
  const section  = document.querySelector('.how-section')
  const howLeft  = document.querySelector('.how-left')
  const steps    = document.querySelectorAll('.step')
  if (!section || !howLeft || !steps.length) return

  // Reveal left title
  splitReveal('.how-title', { start: 'top 80%' })
  fadeUp('.how-sub', { start: 'top 78%' })

  // Reveal each step on scroll
  steps.forEach((step, i) => {
    gsap.from(step, {
      x: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: step,
        start: 'top 82%',
      },
    })

    // Step number count-up feel
    const numEl = step.querySelector('.step-num')
    if (numEl) {
      gsap.from(numEl, {
        opacity: 0,
        scale: 0.7,
        duration: 0.5,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: step, start: 'top 82%' },
      })
    }
  })

  // Code block line reveal
  document.querySelectorAll('.code-block').forEach(block => {
    gsap.from(block, {
      opacity: 0,
      y: 15,
      duration: 0.6,
      ease: 'expo.out',
      scrollTrigger: { trigger: block, start: 'top 85%' },
    })
  })
}

/* ─── Testimonials marquee ────────────────────────────────────────────────── */
function initTestimonials() {
  splitReveal('.testi-heading', { start: 'top 80%' })
}

/* ─── CTA section ─────────────────────────────────────────────────────────── */
function initCTA() {
  scrubOpacity('.cta-title')
  fadeUp('.cta-sub', { start: 'top 82%', delay: 0.1 })
  fadeUp('.cta-actions', { start: 'top 82%', delay: 0.2 })
}

/* ─── Mockup live counter ─────────────────────────────────────────────────── */
function initMockupCounter() {
  const liveEl = document.querySelector('.mock-live')
  if (!liveEl) return

  setInterval(() => {
    const base = 1284
    const delta = Math.floor(Math.random() * 60 - 30)
    liveEl.textContent = (base + delta).toLocaleString()
  }, 1800)
}

/* ─── Run ────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  heroEntrance()
  initMarquee()
  initFeatures()
  initHowItWorks()
  initTestimonials()
  initCTA()
  initMockupCounter()
  splitReveal('.section-title')
  fadeUp('.section-sub')
})
