// project2.js · Clearisk CX Dashboard case study.
// Shared behaviours from cx-review.js (progress bar, drag prevention,
// smooth anchors, lightbox, side nav highlighting, back to top, next
// project tab, scroll-triggered video) plus this page's own pieces:
// the live dashboard (cloning and scaling), scroll reveals, the
// fragmented-workflow animation, the core interaction flow, the
// before/after sequence and the prototype video slot.

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Turn on reveal styles straight away. Content stays visible if this
// script never runs, because the hidden states only apply under .has-reveal.
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('has-reveal');
}

// Live CX Dashboard. The hero holds the one source copy; it is cloned
// into the Final Design frame, the dashboard-to-application view and,
// panel by panel, into the feature rows. The full dashboard is designed
// at 1280px wide and scaled to fit whatever frame it sits in.
const DASH_WIDTH = 1280;

function buildDashboards() {
  const source = document.querySelector('[data-dash-source] .cxd');
  if (!source) return;

  document.querySelectorAll('[data-dash-clone]').forEach(slot => {
    const copy = source.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    slot.appendChild(copy);
  });

  document.querySelectorAll('[data-clone-panel]').forEach(slot => {
    const panel = source.querySelector(`[data-panel="${slot.dataset.clonePanel}"]`);
    if (panel) slot.appendChild(panel.cloneNode(true));
  });
}

function fitDashboard(frame) {
  const dash = frame.querySelector('.cxd');
  if (!dash) return;
  const scale = frame.clientWidth / DASH_WIDTH;
  dash.style.transform = `scale(${scale})`;
  frame.style.height = `${Math.ceil(dash.offsetHeight * scale)}px`;
}

function fitAllDashboards() {
  const frames = document.querySelectorAll('.cxd-frame');
  frames.forEach(fitDashboard);

  if ('ResizeObserver' in window) {
    let lastWidths = new WeakMap();
    const ro = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const w = entry.contentRect.width;
        if (lastWidths.get(entry.target) === w) return;
        lastWidths.set(entry.target, w);
        fitDashboard(entry.target);
      });
    });
    frames.forEach(frame => ro.observe(frame));
  } else {
    window.addEventListener('resize', () => frames.forEach(fitDashboard));
  }

  // Web fonts change text heights, so refit once they have loaded.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => frames.forEach(fitDashboard));
  }
}

// Give every sequenced child an index (--i) so CSS can stagger it.
function indexChildren(selector) {
  document.querySelectorAll(selector).forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.setProperty('--i', i);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {

  buildDashboards();
  fitAllDashboards();

  indexChildren('.seq');
  indexChildren('.core-flow-steps');
  indexChildren('.ba-list');
  indexChildren('.side-nav');

  document.querySelectorAll('.frag-node').forEach((node, i) => {
    node.style.setProperty('--i', i);
  });

  // Disable native image dragging.
  document.querySelectorAll('img').forEach(img => img.setAttribute('draggable', 'false'));
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });

  // Progress bar
  const progressBar = document.querySelector('.read-progress');
  function updateProgressBar() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = window.pageYOffset || document.documentElement.scrollTop;
    progressBar.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  }
  window.addEventListener('scroll', updateProgressBar, { passive: true });
  updateProgressBar();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

});

// Scroll reveals: .reveal blocks, standalone .seq groups, the core flow
// and the before/after figure all get .is-visible the first time they
// come into view.
document.addEventListener('DOMContentLoaded', () => {

  const targets = document.querySelectorAll('.reveal, .seq, [data-core-flow], [data-before-after], .cxd-frame, .cxd-solo');
  if (targets.length === 0) return;

  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(el => revealObserver.observe(el));

});

// Hero animation: the six fragmented pieces appear one by one along a
// drawn path, then gather into the CX Dashboard. Plays once on view,
// and the Replay button runs it again.
document.addEventListener('DOMContentLoaded', () => {

  const anim = document.querySelector('[data-frag-anim]');
  if (!anim) return;

  const replayBtn = anim.querySelector('[data-frag-replay]');
  const nodeCount = anim.querySelectorAll('.frag-node').length;
  // Time for every node to appear (0.35s apart) plus a pause to read it.
  const holdBeforeMerge = prefersReducedMotion ? 2500 : nodeCount * 350 + 1600;
  let mergeTimer = null;

  function play() {
    clearTimeout(mergeTimer);
    anim.classList.add('is-playing');
    mergeTimer = setTimeout(() => anim.classList.add('is-merged'), holdBeforeMerge);
  }

  function reset() {
    clearTimeout(mergeTimer);
    anim.classList.add('is-resetting');
    anim.classList.remove('is-playing', 'is-merged');
    void anim.offsetWidth; // flush styles so the reset applies without animating
    anim.classList.remove('is-resetting');
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      reset();
      requestAnimationFrame(() => requestAnimationFrame(play));
    });
  }

  if (!('IntersectionObserver' in window)) {
    play();
    return;
  }

  const animObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      play();
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  animObserver.observe(anim);

});

// Prototype video slot. Once a <video> is added inside .video-slot, the
// play button plays it with native controls. Until then the button just
// says the video is on its way.
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('[data-video-slot]').forEach(slot => {
    const button = slot.querySelector('.video-play');
    const status = slot.querySelector('.video-status');
    if (!button) return;

    button.addEventListener('click', () => {
      const video = slot.querySelector('video');

      if (!video) {
        if (status) status.textContent = 'Prototype video coming soon.';
        return;
      }

      video.setAttribute('controls', '');
      slot.classList.add('is-playing');
      video.play().catch(() => {
        slot.classList.remove('is-playing');
      });

      video.addEventListener('ended', () => slot.classList.remove('is-playing'), { once: true });
    });
  });

});

// Scroll-triggered autoplay for any inline .solution-video added later,
// same as the CX Review page. Reduced-motion users keep native controls.
document.addEventListener('DOMContentLoaded', () => {

  const inlineVideos = document.querySelectorAll('.solution-video');
  if (inlineVideos.length === 0) return;

  if (prefersReducedMotion) {
    inlineVideos.forEach(video => video.setAttribute('controls', ''));
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
      if (entry.isIntersecting) {
        entry.target.play().catch(() => {});
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.5 });

  inlineVideos.forEach(video => videoObserver.observe(video));

});

// Accessible lightbox for every .solution-image (the real images that
// replace the placeholders). Click, or Tab and Enter/Space, to enlarge.
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

// Side navigation: highlights whichever section(s) cross the middle of
// the viewport. Group links (Research, Structure and so on) point at a
// wrapper around their sections, so a group and one of its sub-links can
// be active together.
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

// Back to top: shows after the first screen; its ring fills as you read.
(function () {
  const btn = document.querySelector('.to-top');
  if (!btn || btn.dataset.ready) return;
  btn.dataset.ready = '1';

  const fill = btn.querySelector('.to-top-ring-fill');
  const C = 2 * Math.PI * 24;
  if (fill) {
    fill.style.strokeDasharray = C;
    fill.style.strokeDashoffset = C;
  }

  let ticking = false;

  function update() {
    ticking = false;
    const y = window.scrollY || window.pageYOffset;
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
  update();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
})();

// Next project tab: CSS opens it on hover and focus. On touch screens the
// first tap slides it out and the second tap follows the link.
(function () {
  const wrap = document.querySelector('.next-project');
  if (!wrap) return;
  const link = wrap.querySelector('.next-project-link');
  const noHover = window.matchMedia('(hover: none)');

  link.addEventListener('click', (e) => {
    if (noHover.matches && !wrap.classList.contains('is-open')) {
      e.preventDefault();
      wrap.classList.add('is-open');
    }
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) wrap.classList.remove('is-open');
  });

  window.addEventListener('scroll', () => wrap.classList.remove('is-open'), { passive: true });
})();