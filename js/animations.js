/**
 * GSAP Scroll Animations
 * Interactive Story · Timeline · Parallax
 */

(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  /* --- Hero Entrance --- */
  gsap.from('.hero__title-name', {
    scrollTrigger: { trigger: '.hero', start: 'top top', toggleActions: 'play none none reverse' },
    duration: 1.2,
    y: 60,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.3
  });

  /* --- Timeline Items --- */
  gsap.utils.toArray('.timeline__item').forEach((item, i) => {
    const card = item.querySelector('.timeline__card');
    const marker = item.querySelector('.timeline__year');

    gsap.from(card, {
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'top 30%',
        toggleActions: 'play none none reverse'
      },
      x: item.classList.contains('timeline__item--reverse') ? 60 : -60,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: i * 0.1
    });

    gsap.from(marker, {
      scrollTrigger: { trigger: item, start: 'top 75%' },
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)'
    });
  });

  /* --- Interactive Story Chapters --- */
  gsap.utils.toArray('.story__chapter').forEach(chapter => {
    const bg = chapter.querySelector('.story__bg');
    const content = chapter.querySelector('.story__content');

    /* Parallax background */
    gsap.to(bg, {
      scrollTrigger: {
        trigger: chapter,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: '-15%',
      ease: 'none'
    });

    /* Content fade in */
    ScrollTrigger.create({
      trigger: chapter,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => chapter.classList.add('visible'),
      onEnterBack: () => chapter.classList.add('visible'),
      onLeave: () => chapter.classList.remove('visible'),
      onLeaveBack: () => chapter.classList.remove('visible')
    });

    gsap.from(content, {
      scrollTrigger: {
        trigger: chapter,
        start: 'top 65%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });
  });

  /* --- Legacy Section Parallax --- */
  gsap.to('.legacy__bg', {
    scrollTrigger: {
      trigger: '.legacy',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    },
    y: '-20%',
    ease: 'none'
  });

  /* --- Stat Cards Stagger --- */
  gsap.from('.stat-card', {
    scrollTrigger: {
      trigger: '.stats-grid',
      start: 'top 75%'
    },
    y: 40,
    opacity: 0,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power2.out'
  });

  /* --- Gallery Items --- */
  gsap.from('.gallery__item:not(.hidden)', {
    scrollTrigger: {
      trigger: '.gallery__grid',
      start: 'top 80%'
    },
    scale: 0.9,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power2.out'
  });

  /* --- Section Headers --- */
  gsap.utils.toArray('.section__header').forEach(header => {
    gsap.from(header.children, {
      scrollTrigger: { trigger: header, start: 'top 85%' },
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out'
    });
  });

  /* --- Audio Player Glow --- */
  gsap.to('.audio-player__art-glow', {
    scrollTrigger: {
      trigger: '.audio-player',
      start: 'top 80%',
      toggleActions: 'play pause resume pause'
    },
    scale: 1.2,
    opacity: 0.8,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

})();
