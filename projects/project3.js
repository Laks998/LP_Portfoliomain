// project3.js - V-Ed App case study
// Same shared behaviors as the CX Portal Onboarding Review page: progress
// bar, native image-drag-ghost prevention, smooth anchor scroll, an
// accessible lightbox for screenshots, scroll-triggered video autoplay
// (harmless no-op here since this page has no video), and side-nav
// section highlighting.

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

// Scroll-triggered video autoplay — kept for parity with the shared system;
// simply does nothing if the page has no .solution-video elements.
document.addEventListener('DOMContentLoaded', () => {

  const inlineVideos = document.querySelectorAll('.solution-video');
  if (inlineVideos.length === 0) return;

  if (prefersReducedMotion) {
    inlineVideos.forEach(video => {
      video.setAttribute('controls', '');
    });
    return;
  }

  inlineVideos.forEach(video => {
    video.removeAttribute('controls');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
  });

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.5 });

  inlineVideos.forEach(video => videoObserver.observe(video));

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

// Side navigation — highlights whichever section(s) are currently
// crossing the vertical center of the viewport. A parent link and its
// matching sub-link can be active at the same time.
document.addEventListener('DOMContentLoaded', () => {

  const sideNavLinks = document.querySelectorAll('.side-nav-link, .side-nav-sublink');
  if (sideNavLinks.length === 0) return;

  const sections = Array.from(sideNavLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length === 0) return;

  const activeIds = new Set();

  const updateActiveLinks = () => {
    sideNavLinks.forEach(link => {
      const id = link.getAttribute('href').slice(1);
      link.classList.toggle('is-active', activeIds.has(id));
    });
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeIds.add(entry.target.id);
      } else {
        activeIds.delete(entry.target.id);
      }
    });
    updateActiveLinks();
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));

});


// Back to top — the round button in the bottom-right corner. Shows once
// you're past the first screen, its ring fills as you read, and clicking
// it scrolls smoothly back to the top.
(function () {
  var btn = document.querySelector('.to-top');
  if (!btn || btn.dataset.ready) return;
  btn.dataset.ready = '1';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fill = btn.querySelector('.to-top-ring-fill');
  var C = 2 * Math.PI * 24;
  if (fill) { fill.style.strokeDasharray = C; fill.style.strokeDashoffset = C; }
  var ticking = false;
  function update() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    btn.classList.toggle('is-visible', y > window.innerHeight * 0.8);
    if (fill && max > 0) fill.style.strokeDashoffset = C * (1 - Math.min(y / max, 1));
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
})();