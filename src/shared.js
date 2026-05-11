import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

/* ─── Lenis smooth scroll ────────────────────────────────────────────────── */
export function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 2,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add(time => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  return lenis
}

/* ─── Custom cursor ──────────────────────────────────────────────────────── */
export function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return

  const dot  = document.createElement('div')
  const ring = document.createElement('div')
  dot.className  = 'cursor-dot'
  ring.className = 'cursor-ring'
  document.body.append(dot, ring)

  const xDot  = gsap.quickTo(dot,  'x', { duration: 0.08 })
  const yDot  = gsap.quickTo(dot,  'y', { duration: 0.08 })
  const xRing = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3.out' })
  const yRing = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3.out' })

  window.addEventListener('mousemove', e => {
    xDot(e.clientX); yDot(e.clientY)
    xRing(e.clientX); yRing(e.clientY)
  })

  const hoverEls = () => document.querySelectorAll('a, button, .magnetic, [role="button"]')

  const onEnter = () => gsap.to(ring, { scale: 1.6, opacity: 0.4, duration: 0.35, ease: 'power2.out' })
  const onLeave = () => gsap.to(ring, { scale: 1,   opacity: 1,   duration: 0.35, ease: 'power2.out' })

  function bindCursorHovers() {
    hoverEls().forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
  }
  bindCursorHovers()

  return { rebind: bindCursorHovers }
}

/* ─── Magnetic hover ─────────────────────────────────────────────────────── */
export function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect()
      const dx = (e.clientX - r.left - r.width  / 2) * 0.3
      const dy = (e.clientY - r.top  - r.height / 2) * 0.3
      gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' })
    })
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
    })
  })
}

/* ─── Nav scroll behavior ────────────────────────────────────────────────── */
export function initNav() {
  const nav = document.querySelector('.nav')
  if (!nav) return

  ScrollTrigger.create({
    start: 'top -60',
    onToggle: self => nav.classList.toggle('scrolled', self.isActive),
  })

  // Mark active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html'
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop()
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active')
    }
  })
}

/* ─── Split text reveal ──────────────────────────────────────────────────── */
export function splitReveal(selector, opts = {}) {
  const {
    delay    = 0,
    stagger  = 0.04,
    y        = 60,
    duration = 0.9,
    start    = 'top 85%',
    type     = 'lines,words',
  } = opts

  document.querySelectorAll(selector).forEach(el => {
    const split = new SplitType(el, { types: type })
    const targets = split.words || split.lines

    gsap.from(targets, {
      y,
      opacity: 0,
      duration,
      ease: 'expo.out',
      stagger,
      delay,
      scrollTrigger: { trigger: el, start },
    })
  })
}

/* ─── Fade up reveal ─────────────────────────────────────────────────────── */
export function fadeUp(selector, opts = {}) {
  const { stagger = 0.1, delay = 0, start = 'top 88%' } = opts

  const els = typeof selector === 'string'
    ? document.querySelectorAll(selector)
    : [selector]

  gsap.from(els, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'expo.out',
    stagger,
    delay,
    scrollTrigger: { trigger: els[0], start },
  })
}

/* ─── Scrub opacity (word-by-word) ──────────────────────────────────────── */
export function scrubOpacity(selector) {
  document.querySelectorAll(selector).forEach(el => {
    const split = new SplitType(el, { types: 'words' })
    gsap.from(split.words, {
      opacity: 0.1,
      stagger: 0.05,
      scrollTrigger: {
        trigger: el,
        start: 'top 75%',
        end: 'bottom 40%',
        scrub: 1.5,
      },
    })
  })
}

/* ─── Count up ───────────────────────────────────────────────────────────── */
export function countUp(selector) {
  document.querySelectorAll(selector).forEach(el => {
    const target = parseFloat(el.dataset.count)
    const suffix = el.dataset.suffix || ''
    const decimals = el.dataset.decimals || 0
    const obj = { val: 0 }

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = parseFloat(obj.val).toFixed(decimals) + suffix
          },
        })
      },
    })
  })
}

/* ─── Glitch effect ──────────────────────────────────────────────────────── */
export function glitch(el) {
  if (!el) return
  const text = el.textContent
  el.setAttribute('data-text', text)

  function fire() {
    el.classList.add('glitching')
    setTimeout(() => el.classList.remove('glitching'), 200)
  }

  // Fire on load then randomly
  setTimeout(fire, 900)
  setTimeout(fire, 1200)
  setInterval(() => {
    if (Math.random() < 0.3) fire()
  }, 4000)
}

/* ─── Typing effect ──────────────────────────────────────────────────────── */
export function typeWriter(el, text, { speed = 38, startDelay = 1400 } = {}) {
  if (!el) return
  el.textContent = ''
  let i = 0

  setTimeout(() => {
    const id = setInterval(() => {
      el.textContent += text[i]
      i++
      if (i >= text.length) clearInterval(id)
    }, speed)
  }, startDelay)
}

/* ─── Accordion ──────────────────────────────────────────────────────────── */
export function initAccordions() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item')
      const body = item.querySelector('.accordion-body')
      const content = item.querySelector('.accordion-content')
      const isOpen = item.classList.contains('open')

      // Close all
      document.querySelectorAll('.accordion-item.open').forEach(open => {
        open.classList.remove('open')
        open.querySelector('.accordion-body').style.maxHeight = '0'
      })

      if (!isOpen) {
        item.classList.add('open')
        body.style.maxHeight = content.scrollHeight + 'px'
      }
    })
  })
}
