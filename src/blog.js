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
  splitReveal('.blog-heading', { delay: 0.2 })
  fadeUp('.blog-sub', { delay: 0.5 })

  // Featured post
  gsap.from('.blog-featured', {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.blog-featured', start: 'top 85%' },
  })

  // Post cards stagger
  gsap.from('.post-card', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'expo.out',
    stagger: 0.08,
    scrollTrigger: { trigger: '.blog-grid', start: 'top 82%' },
  })

  // Newsletter
  fadeUp('.newsletter-inner', { start: 'top 85%' })

  // Category filter
  const filterBtns = document.querySelectorAll('.filter-btn')
  const cards      = document.querySelectorAll('.post-card[data-category]')

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')

      const filter = btn.dataset.filter

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter
        gsap.to(card, {
          opacity: match ? 1 : 0.25,
          scale:   match ? 1 : 0.97,
          duration: 0.4,
          ease: 'power2.out',
        })
        card.style.pointerEvents = match ? '' : 'none'
      })
    })
  })
})
