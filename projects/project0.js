// project0.js - Sportscove case study. Every behaviour on the page lives
// here: progress bar, image-drag prevention, smooth anchor scroll,
// scroll-triggered video autoplay, image lightbox, side nav highlighting,
// and the back-to-top button.

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Progress bar, image dragging, smooth anchor scroll
document.addEventListener('DOMContentLoaded', () => {

  // Disable native browser image dragging.
  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });

  // Reading progress bar along the top of the page.
  const progressBar = document.querySelector('.read-progress');

  function updateProgressBar() {
    if (!progressBar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    progressBar.style.width = max > 0 ? `${(scrollTop / max) * 100}%` : '0%';
  }

  window.addEventListener('scroll', updateProgressBar, { passive: true });
  window.addEventListener('resize', updateProgressBar);
  updateProgressBar();

  // Smooth scroll for in-page links (side nav).
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });

});

// Scroll-triggered video autoplay — no controls shown; each video plays
// once it's in view and pauses once it scrolls out. Muted and looping so
// browsers allow it.
document.addEventListener('DOMContentLoaded', () => {

  const videos = document.querySelectorAll('.autoplay-video');
  if (videos.length === 0) return;

  videos.forEach(video => {
    video.removeAttribute('controls');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
  });

  if (!('IntersectionObserver' in window)) {
    videos.forEach(video => video.play().catch(() => {}));
    return;
  }

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {
          // Autoplay can be blocked in some browsers; fail silently.
        });
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.5 });

  videos.forEach(video => videoObserver.observe(video));

});

// Accessible lightbox — click, or Tab + Enter/Space, on a screenshot to
// view it larger. The "View the original questionnaire" link opens its
// image the same way.
document.addEventListener('DOMContentLoaded', () => {

  const zoomableImages = document.querySelectorAll('.solution-image, .option-card-image');
  const triggerLinks = document.querySelectorAll('[data-lightbox-trigger]');
  if (zoomableImages.length === 0 && triggerLinks.length === 0) return;

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

  triggerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(link.getAttribute('href'), link.textContent.trim(), link);
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

// Side nav — highlights the section(s) crossing the middle of the screen.
// A section (e.g. Booking) and one of its sub-sections (e.g. Coach
// profile) can both be lit at once.
document.addEventListener('DOMContentLoaded', () => {

  const links = document.querySelectorAll('.side-nav-link, .side-nav-sublink');
  const sections = Array.from(links)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length === 0 || !('IntersectionObserver' in window)) return;

  const activeIds = new Set();

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) activeIds.add(entry.target.id);
      else activeIds.delete(entry.target.id);
    });
    links.forEach(link => {
      link.classList.toggle('is-active', activeIds.has(link.getAttribute('href').slice(1)));
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));

});

// Back to top — the round arrow button in the bottom-right corner. Shows
// once you're past the first screen, its ring fills as you read, and
// clicking it scrolls smoothly back to the top.
document.addEventListener('DOMContentLoaded', () => {

  const btn = document.querySelector('.to-top');
  if (!btn) return;

  const fill = btn.querySelector('.to-top-ring-fill');
  const C = 2 * Math.PI * 24;
  if (fill) {
    fill.style.strokeDasharray = C;
    fill.style.strokeDashoffset = C;
  }

  let ticking = false;

  function update() {
    ticking = false;
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    btn.classList.toggle('is-visible', y > window.innerHeight * 0.8);
    if (fill && max > 0) fill.style.strokeDashoffset = C * (1 - Math.min(y / max, 1));
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

});