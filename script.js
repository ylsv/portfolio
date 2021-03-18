'use strict'

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const btnCloseModal = document.querySelector('.btn--close-modal')
const btnsOpenModal = document.querySelectorAll('.btn--show-modal')
const btnScrollTo = document.querySelector('.btn--scroll-to')
const header = document.querySelector('.header')
const nav = document.querySelector('.nav')
const section1 = document.querySelector('#section--1')
const allSections = document.querySelectorAll('.section')
const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')
const lazyImages = document.querySelectorAll('img[data-src]')

const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden')
  overlay.classList.remove('hidden')
}

const closeModal = function () {
  modal.classList.add('hidden')
  overlay.classList.add('hidden')
}

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))
btnCloseModal.addEventListener('click', closeModal)
overlay.addEventListener('click', closeModal)
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal()
  }
})

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect()
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  })
})

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault()
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href')
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
  }
})

// Tabbed component
tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab')

  if (!clicked) return

  tabs.forEach(t => t.classList.remove('operations__tab--active'))
  tabsContent.forEach(c => c.classList.remove('operations__content--active'))

  clicked.classList.add('operations__tab--active')
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active')
})

// Menu fade animation
const handleHover = (e, opacity) => {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target
    const siblings = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity
    })
    logo.style.opacity = opacity
  }
}
nav.addEventListener('mouseover', e => handleHover(e, 0.5))
nav.addEventListener('mouseout', e => handleHover(e, 1))

// Sticky navigation using Intersection Observer API
// https://developer.mozilla.org/ru/docs/Web/API/Intersection_Observer_API
const stickyNav = entries => {
  const [entry] = entries
  if (!entry.isIntersecting) {
    nav.classList.add('sticky')
  } else {
    nav.classList.remove('sticky')
  }
}
const navHeight = nav.getBoundingClientRect().height
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
}
const headerObserver = new IntersectionObserver(stickyNav, obsOptions)
headerObserver.observe(header)

// Reveal sections on scroll
const revealSection = (entries, observer) => {
  const [entry] = entries
  if (!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target) // unobserve revealed section after scroll not to trigger unnecessary events
}
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
})
allSections.forEach(section => {
  sectionObserver.observe(section)
  section.classList.add('section--hidden')
})

// Lazy-loading images
const loadImg = (entries, observer) => {
  const [entry] = entries
  if (!entry.isIntersecting) return
  entry.target.src = entry.target.dataset.src
  //remove blur only after img loading by listening to load event
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  )
  observer.unobserve(entry.target)
}
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
})
lazyImages.forEach(img => imgObserver.observe(img))
