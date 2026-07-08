/**
 * Main Application Logic
 * Navigation, Audio, Lazy Loading, Accessibility
 */

(function () {
  'use strict';

  /* --- DOM Elements --- */
  const preloader = document.getElementById('preloader');
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const bgAudio = document.getElementById('bg-audio');
  const audioToggle = document.getElementById('audio-toggle');
  const backToTop = document.getElementById('back-to-top');
  const heroVideo = document.getElementById('hero-video');

  /* --- Preloader --- */
  window.addEventListener('load', () => {
    setTimeout(() => preloader?.classList.add('hidden'), 800);
  });

  /* --- Sticky Header --- */
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    header?.classList.toggle('scrolled', scrollY > 60);
    backToTop?.classList.toggle('visible', scrollY > 500);
    lastScroll = scrollY;
  }, { passive: true });

  /* --- Mobile Navigation --- */
  navToggle?.addEventListener('click', () => {
    const isOpen = navMenu?.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('open');
      navToggle?.classList.remove('active');
      navToggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* --- Active Nav Link on Scroll --- */
  const sections = document.querySelectorAll('section[id], .story__chapter');
  const observerNav = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id || 'story';
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach(s => observerNav.observe(s));

  /* --- Background Audio Toggle --- */
  audioToggle?.addEventListener('click', async () => {
    if (!bgAudio) return;
    try {
      if (bgAudio.paused) {
        await bgAudio.play();
        audioToggle.classList.add('playing');
        audioToggle.querySelector('.btn__text').textContent = 'إيقاف الصوت';
      } else {
        bgAudio.pause();
        audioToggle.classList.remove('playing');
        audioToggle.querySelector('.btn__text').textContent = 'تشغيل الصوت';
      }
    } catch (err) {
      console.warn('Audio playback blocked:', err);
    }
  });

  /* --- Back to Top --- */
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* --- Lazy Loading (native + fallback) --- */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.addEventListener('error', handleImageError);
    });
  } else if ('IntersectionObserver' in window) {
    const lazyObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => lazyObserver.observe(img));
  }

  function handleImageError(e) {
    const img = e.target;
    img.alt = img.alt || 'صورة';
    img.style.objectFit = 'contain';
    img.style.padding = '2rem';
    img.style.opacity = '0.4';
  }

  document.querySelectorAll('img').forEach(img => img.addEventListener('error', handleImageError));

  /* --- Hero Video Fallback --- */
  heroVideo?.addEventListener('error', () => {
    heroVideo.style.display = 'none';
    const wrap = heroVideo.closest('.hero__video-wrap');
    if (wrap) {
      wrap.style.background = `
        linear-gradient(135deg, #0a0a0f 0%, #1a1510 50%, #0a0a0f 100%),
        radial-gradient(ellipse at 50% 60%, rgba(201,162,39,0.15), transparent 70%)
      `;
    }
  });

  /* --- Audio Player --- */
  initAudioPlayer();

  function initAudioPlayer() {
    const audio = document.getElementById('sermon-audio');
    const playBtn = document.getElementById('player-play');
    const progressBar = document.getElementById('player-progress');
    const currentTime = document.getElementById('player-current');
    const durationEl = document.getElementById('player-duration');
    const titleEl = document.getElementById('player-title');
    const metaEl = document.getElementById('player-meta');
    const playlist = document.getElementById('audio-playlist');
    const downloadBtn = document.getElementById('player-download');
    const shareBtn = document.getElementById('player-share');
    const prevBtn = document.getElementById('player-prev');
    const nextBtn = document.getElementById('player-next');

    if (!audio || !playlist) return;

    let currentIndex = 0;
    const items = [...playlist.querySelectorAll('.audio-playlist__item')];

    function formatTime(sec) {
      if (!sec || isNaN(sec)) return '0:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
    }

    function loadTrack(index) {
      currentIndex = index;
      const item = items[index];
      if (!item) return;

      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const src = item.dataset.src;
      const title = item.dataset.title;
      const meta = item.dataset.meta;

      audio.src = src;
      if (titleEl) titleEl.textContent = title;
      if (metaEl) metaEl.textContent = meta;
    }

    playBtn?.addEventListener('click', async () => {
      try {
        if (audio.paused) {
          await audio.play();
          playBtn.textContent = '⏸';
          playBtn.setAttribute('aria-label', 'إيقاف');
        } else {
          audio.pause();
          playBtn.textContent = '▶';
          playBtn.setAttribute('aria-label', 'تشغيل');
        }
      } catch (err) {
        console.warn('Sermon playback blocked:', err);
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (progressBar && audio.duration) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
      }
      if (currentTime) currentTime.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      if (durationEl) durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
      if (currentIndex < items.length - 1) {
        loadTrack(currentIndex + 1);
        audio.play();
      } else {
        playBtn.textContent = '▶';
      }
    });

    progressBar?.addEventListener('input', () => {
      if (audio.duration) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
      }
    });

    items.forEach((item, i) => {
      item.addEventListener('click', () => {
        loadTrack(i);
        audio.play();
        playBtn.textContent = '⏸';
      });
    });

    prevBtn?.addEventListener('click', () => {
      const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      loadTrack(prev);
      audio.play();
      playBtn.textContent = '⏸';
    });

    nextBtn?.addEventListener('click', () => {
      const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      loadTrack(next);
      audio.play();
      playBtn.textContent = '⏸';
    });

    downloadBtn?.addEventListener('click', () => {
      const src = audio.src;
      if (src) {
        const a = document.createElement('a');
        a.href = src;
        a.download = titleEl?.textContent || 'sermon.mp3';
        a.click();
      }
    });

    shareBtn?.addEventListener('click', async () => {
      const shareData = {
        title: titleEl?.textContent || 'عظة',
        text: 'استمع إلى هذه العظة الروحية',
        url: window.location.href + '#voices'
      };
      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(shareData.url);
          alert('تم نسخ الرابط!');
        }
      } catch (err) {
        console.warn('Share failed:', err);
      }
    });
  }

  /* --- Counter Animation --- */
  initCounters();

  function initCounters() {
    const counters = document.querySelectorAll('.stat-card__number[data-count]');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(c => counterObserver.observe(c));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('ar-EG');
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  /* --- Initialize AOS --- */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }

  /* --- Initialize Swipers --- */
  if (typeof Swiper !== 'undefined') {
    new Swiper('.video-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      pagination: { el: '.video-swiper .swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.video-swiper .swiper-button-next',
        prevEl: '.video-swiper .swiper-button-prev'
      },
      breakpoints: {
        768: { slidesPerView: 2 }
      }
    });

    new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 6000, disableOnInteraction: false },
      pagination: { el: '.testimonial-swiper .swiper-pagination', clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1100: { slidesPerView: 3 }
      }
    });
  }

  /* --- Keyboard: Escape closes menus/lightbox --- */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      navMenu?.classList.remove('open');
      navToggle?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

})();
