/**
 * Gallery — Filters, Lightbox, Keyboard Navigation
 */

(function () {
  'use strict';

  const grid = document.getElementById('gallery-grid');
  const filters = document.querySelectorAll('.gallery__filter');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  if (!grid) return;

  let visibleItems = [];
  let currentIndex = 0;

  /* --- Filter Gallery --- */
  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      const category = filter.dataset.filter;

      filters.forEach(f => {
        f.classList.remove('active');
        f.setAttribute('aria-selected', 'false');
      });
      filter.classList.add('active');
      filter.setAttribute('aria-selected', 'true');

      grid.querySelectorAll('.gallery__item').forEach(item => {
        const match = category === 'all' || item.dataset.category === category;
        item.classList.toggle('hidden', !match);
        if (match) {
          item.style.animation = 'none';
          item.offsetHeight;
          item.style.animation = '';
        }
      });

      updateVisibleItems();
    });
  });

  function updateVisibleItems() {
    visibleItems = [...grid.querySelectorAll('.gallery__item:not(.hidden) img')];
  }

  updateVisibleItems();

  /* --- Open Lightbox --- */
  grid.addEventListener('click', e => {
    const figure = e.target.closest('.gallery__item');
    if (!figure || figure.classList.contains('hidden')) return;

    const img = figure.querySelector('img');
    currentIndex = visibleItems.indexOf(img);
    if (currentIndex === -1) {
      updateVisibleItems();
      currentIndex = visibleItems.indexOf(img);
    }

    openLightbox(img);
  });

  function openLightbox(img) {
    if (!lightbox || !lightboxImg) return;

    lightbox.removeAttribute('hidden');
    requestAnimationFrame(() => lightbox.classList.add('active'));

    lightboxImg.src = img.dataset.full || img.src;
    lightboxImg.alt = img.alt;

    const caption = img.closest('.gallery__item')?.querySelector('.gallery__caption');
    if (lightboxCaption) {
      lightboxCaption.textContent = caption?.textContent || '';
    }

    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => lightbox?.setAttribute('hidden', ''), 300);
  }

  function showPrev() {
    if (!visibleItems.length) return;
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(visibleItems[currentIndex]);
  }

  function showNext() {
    if (!visibleItems.length) return;
    currentIndex = (currentIndex + 1) % visibleItems.length;
    openLightbox(visibleItems[currentIndex]);
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', showPrev);
  lightboxNext?.addEventListener('click', showNext);

  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape': closeLightbox(); break;
      case 'ArrowRight': showPrev(); break;
      case 'ArrowLeft': showNext(); break;
    }
  });

  /* --- Touch Swipe for Lightbox --- */
  let touchStartX = 0;

  lightbox?.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox?.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? showPrev() : showNext();
    }
  }, { passive: true });

})();
