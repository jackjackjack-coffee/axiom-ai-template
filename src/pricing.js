import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initLenis, initCursor, initMagnetic, initNav, splitReveal, fadeUp, initAccordions } from './shared.js'

gsap.registerPlugin(ScrollTrigger)

initLenis()
initCursor()
initNav()
initMagnetic()

document.addEventListener('DOMContentLoaded', () => {
  splitReveal('.pricing-heading', { delay: 0.2 })
  fadeUp('.pricing-sub', { delay: 0.5 })
  fadeUp('.billing-toggle', { delay: 0.65 })

  // Pricing cards stagger
  gsap.from('[data-card]', {
    y: 50,
    opacity: 0,
    duration: 0.9,
    ease: 'expo.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '.pricing-grid', start: 'top 82%' },
  })

  // Billing toggle
  const toggle   = document.getElementById('billing-toggle')
  const amounts  = document.querySelectorAll('.pc-amount[data-monthly]')
  let isAnnual   = false

  if (toggle) {
    toggle.addEventListener('click', () => {
      isAnnual = !isAnnual
      toggle.classList.toggle('on', isAnnual)
      toggle.setAttribute('aria-checked', String(isAnnual))

      amounts.forEach(el => {
        const val = isAnnual ? el.dataset.annual : el.dataset.monthly
        gsap.to(el, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            el.textContent = '$' + val
            gsap.to(el, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
          },
        })
      })
    })
  }

  // Comparison table fade
  fadeUp('.compare-table-wrap', { start: 'top 85%' })

  // Accordion
  initAccordions()

  splitReveal('.section-title')
  fadeUp('.section-sub')
})
