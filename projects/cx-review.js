// cx-review.js - CleaRisk CX Portal: Onboarding Review
// Same behaviors as project1.js (Sportscove), trimmed of the video-autoplay
// and stagger-reveal logic since this page is image-only: progress bar,
// native image-drag-ghost prevention, smooth anchor scroll, and an
// accessible lightbox for the screenshots.

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {

  // Disable native browser image dragging site-wide.
  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  // Progress bar
  const progressBar = document.querySelector('.read-progress');

  function updateProgressBar() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

    progressBar.style.width = `${scrollPercent}%`;
  }

  window.addEventListener('scroll', updateProgressBar);
  updateProgressBar();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    });
  });

});

// Accessible lightbox — click, or Tab + Enter/Space, on any solution image
// to view an enlarged version.
document.addEventListener('DOMContentLoaded', () => {

  const zoomableImages = document.querySelectorAll('.solution-image');
  if (zoomableImages.length === 0) return;

  zoomableImages.forEach(img => {
    if (!img.hasAttribute('tabindex')) img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    if (!img.hasAttribute('aria-label')) {
      img.setAttribute('aria-label', `Enlarge image: ${img.alt || 'view larger'}`);
    }
  });

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Enlarged image viewer');
  overlay.innerHTML = '<img src="" alt=""><button class="lightbox-close" aria-label="Close enlarged image">&times;</button>';
  document.body.appendChild(overlay);

  const overlayImg = overlay.querySelector('img');
  const closeBtn = overlay.querySelector('.lightbox-close');
  let lastFocusedElement = null;

  function openLightbox(src, alt, triggerEl) {
    lastFocusedElement = triggerEl || document.activeElement;
    overlayImg.src = src;
    overlayImg.alt = alt || '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
    lastFocusedElement = null;
  }

  zoomableImages.forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt, img));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        openLightbox(img.src, img.alt, img);
      }
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === closeBtn) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      closeBtn.focus();
    }
  });

});