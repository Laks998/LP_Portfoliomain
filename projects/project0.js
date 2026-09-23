// sportscove-nav.js — Sportscove case study: side nav highlighting.
// Kept in its own file so it works alongside whatever else the page
// loads. Also runs the back-to-top button.

(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {

    // ---- Side nav: highlight the section(s) crossing the middle of the
    // screen. A section (e.g. Booking) and one of its sub-sections (e.g.
    // Coach profile) can both be lit at once.
    const links = document.querySelectorAll('.side-nav-link, .side-nav-sublink');
    const sections = Array.from(links)
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
      const activeIds = new Set();
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) activeIds.add(entry.target.id);
          else activeIds.delete(entry.target.id);
        });
        links.forEach((link) => {
          link.classList.toggle('is-active', activeIds.has(link.getAttribute('href').slice(1)));
        });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      sections.forEach((section) => io.observe(section));
    }

  });
})();


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