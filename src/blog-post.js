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
  // Reading progress bar
  const bar = document.getElementById('progress')
  if (bar) {
    ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        bar.style.width = (self.progress * 100) + '%'
        bar.setAttribute('aria-valuenow', Math.round(self.progress * 100))
      },
    })
  }

  // Article header entrance
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from('.article-back',       { y: 15, opacity: 0, duration: 0.6 }, 0.1)
  tl.from('.article-meta-top',   { y: 15, opacity: 0, duration: 0.6 }, 0.2)
  splitReveal('.article-title',  { delay: 0.3 })
  tl.from('.article-lead',       { y: 20, opacity: 0, duration: 0.7 }, 0.5)
  tl.from('.article-author-row', { y: 15, opacity: 0, duration: 0.6 }, 0.65)
  tl.from('.article-hero-img',   { y: 30, opacity: 0, duration: 1, scale: 0.98 }, 0.55)

  // TOC active state on scroll
  const tocLinks = document.querySelectorAll('.toc-link')
  const sections = document.querySelectorAll('.article-content section[id]')

  sections.forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 40%',
      end: 'bottom 40%',
      onToggle: self => {
        if (self.isActive) {
          tocLinks.forEach(l => l.classList.remove('active'))
          const active = document.querySelector(`.toc-link[href="#${section.id}"]`)
          if (active) active.classList.add('active')
        }
      },
    })
  })

  // Article content sections reveal
  document.querySelectorAll('.article-content section').forEach((s, i) => {
    gsap.from(s, {
      y: 25,
      opacity: 0,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: { trigger: s, start: 'top 88%' },
    })
  })

  // Callout
  gsap.from('.article-callout', {
    x: -20,
    opacity: 0,
    duration: 0.7,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.article-callout', start: 'top 85%' },
  })

  // Related cards
  gsap.from('.related-card', {
    y: 35,
    opacity: 0,
    duration: 0.8,
    ease: 'expo.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '.related-grid', start: 'top 85%' },
  })

  // TOC sidebar entrance
  gsap.from('.article-toc', {
    x: -20,
    opacity: 0,
    duration: 0.8,
    ease: 'expo.out',
    delay: 0.4,
  })

  // Share button copy link
  const shareBtn = document.querySelector('.share-btn')
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText(window.location.href)
      const original = shareBtn.innerHTML
      shareBtn.textContent = 'Copied!'
      setTimeout(() => { shareBtn.innerHTML = original }, 2000)
    })
  }
})
