// project1.js - Sportscove case study
// Round 2 changes: image hover-zoom moved from JS to CSS (see .solution-image
// hover/focus-visible rules), so keyboard users tabbing to an image get the
// same affordance mouse users do. Lightbox is now a proper accessible
// dialog: role="dialog" + aria-modal, focus moves to the close button on
// open and returns to the trigger on close, focus is trapped inside while
// open, and every zoomable image/link is reachable and activatable by
// keyboard (Tab + Enter/Space), not just click.

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {

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

  // Video autoplay on scroll — skipped entirely when reduced motion is
  // requested; controls remain available so videos can still be played
  // manually.
  const videos = document.querySelectorAll('.animation-video, .autoplay-video');

  videos.forEach(video => {
    video.muted = true; // required for browsers to allow programmatic autoplay
  });

  if (!prefersReducedMotion) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;

        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay can be blocked by the browser; controls remain available.
          });
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    }, { threshold: 0.4 });

    videos.forEach(video => {
      videoObserver.observe(video);
    });
  }

  // Stagger animation for the Four Problems section
  if (!prefersReducedMotion) {
    const riskItems = document.querySelectorAll('.risk-item');

    const riskObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.risk-item');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
              item.style.transition = 'all 0.5s ease';
            }, index * 150);
          });
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    const risksList = document.querySelector('.risks-list');
    if (risksList) {
      riskItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
      });
      riskObserver.observe(risksList);
    }
  }

  // Smooth reveal for highlight sections
  if (!prefersReducedMotion) {
    const highlightSections = document.querySelectorAll('.highlight-section');

    const highlightObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'scale(1)';
          entry.target.style.transition = 'all 0.6s ease';
        }
      });
    }, { threshold: 0.3 });

    highlightSections.forEach(section => {
      highlightObserver.observe(section);
    });
  }

});

// Accessible lightbox — click, or Tab + Enter/Space, on any solution/option
// image or [data-lightbox-trigger] link to view an enlarged image.
document.addEventListener('DOMContentLoaded', () => {

  const zoomableImages = document.querySelectorAll('.solution-image, .option-card-image');
  const lightboxLinks = document.querySelectorAll('[data-lightbox-trigger]');
  if (zoomableImages.length === 0 && lightboxLinks.length === 0) return;

  // Make every zoomable image a real keyboard-operable control.
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

  function activate(el, src, alt) {
    openLightbox(src, alt, el);
  }

  zoomableImages.forEach(img => {
    img.addEventListener('click', () => activate(img, img.src, img.alt));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        activate(img, img.src, img.alt);
      }
    });
  });

  // Links (e.g. "View the original questionnaire") open their href as an
  // image in the same lightbox instead of navigating away.
  lightboxLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      activate(link, link.href, link.textContent.trim());
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

    // Focus trap: the close button is the only focusable element inside
    // the dialog, so any Tab keeps focus right there instead of escaping
    // to the page underneath.
    if (e.key === 'Tab') {
      e.preventDefault();
      closeBtn.focus();
    }
  });

});