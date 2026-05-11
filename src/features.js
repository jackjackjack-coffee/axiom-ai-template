import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initLenis, initCursor, initMagnetic, initNav, splitReveal, fadeUp } from './shared.js'

gsap.registerPlugin(ScrollTrigger)

initLenis()
initCursor()
initNav()
initMagnetic()

document.addEventListener('DOMContentLoaded', () => {
  // Page hero
  splitReveal('.feat-heading', { delay: 0.2 })
  fadeUp('.feat-hero .page-hero-sub', { delay: 0.5 })
  fadeUp('.feat-hero-cta', { delay: 0.65 })

  // Feature rows — alternating slide in
  document.querySelectorAll('[data-feat]').forEach((row, i) => {
    const isReverse = row.classList.contains('reverse')
    gsap.from(row.querySelector('.feat-copy'), {
      x: isReverse ? 40 : -40,
      opacity: 0,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: { trigger: row, start: 'top 80%' },
    })
    gsap.from(row.querySelector('.feat-visual'), {
      x: isReverse ? -40 : 40,
      opacity: 0,
      duration: 0.9,
      ease: 'expo.out',
      delay: 0.1,
      scrollTrigger: { trigger: row, start: 'top 80%' },
    })
  })

  // Confidence bar animate on scroll
  document.querySelectorAll('.conf-bar').forEach(bar => {
    const w = bar.style.getPropertyValue('--w')
    bar.style.setProperty('--w', '0%')
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        setTimeout(() => bar.style.setProperty('--w', w), 300)
      },
    })
  })

  // Mini cards stagger
  gsap.from('[data-reveal]', {
    y: 35,
    opacity: 0,
    duration: 0.8,
    ease: 'expo.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '.feat-mini-grid', start: 'top 82%' },
  })

  splitReveal('.section-title')
  fadeUp('.section-sub')
})
