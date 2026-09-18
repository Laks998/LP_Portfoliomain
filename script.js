// script.js — mobile nav toggle, the capability filter for the
// project grid, a simple keyword-matched "requirements" text field,
// the drag-to-flip sketchbook under Work, the tool balls that roll in
// when the Tools section first scrolls into view, and the peelable
// photo stack, the drifting gallery and the hoverable words in About.
// Nothing here gates content that isn't already visible without JS —
// chips just add filtering on top of four project cards that are
// already fully populated in the HTML.

const CAPABILITIES = [
  "B2B SaaS", "Mobile App", "Design Systems", "0→1",
  "Complex Workflows", "Independent", "Research", "Prototyping", "Dashboard"
];

// Tiny icon shown before each chip's label. Inlined (not <img>) so
// each icon's `stroke="currentColor"` follows the chip's own text
// color — selected/hovered states recolor for free.
const CAPABILITY_ICONS = {
  "B2B SaaS": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="4" rx="2" ry="2"/><line x1="2" x2="22" y1="20" y2="20"/></svg>',
  "Mobile App": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>',
  "Design Systems": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"/><path d="M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z"/><path d="M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z"/><path d="M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"/></svg>',
  "0→1": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/></svg>',
  "Complex Workflows": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/></svg>',
  "Independent": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"/><path d="M8 15H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/></svg>',
  "Research": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="7" r="4"/><path d="M10.3 15H7a4 4 0 0 0-4 4v2"/><circle cx="17" cy="17" r="3"/><path d="m21 21-1.9-1.9"/></svg>',
  "Prototyping": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z"/><path d="M12 17v4"/><path d="M8 21h8"/><rect x="2" y="3" width="20" height="14" rx="2"/></svg>',
  "Dashboard": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>'
};

const PROJECT_ORDER = ["clearisk", "sportscove", "quippy", "vr"];

// 'strong' | 'supporting' | (absent = not represented)
const EVIDENCE = {
  clearisk: {
    "B2B SaaS": "strong", "Complex Workflows": "strong", "Design Systems": "strong",
    "0→1": "supporting", "Research": "supporting", "Prototyping": "supporting", "Independent": "supporting", "Prototyping": "strong", "Dashboard": "strong"
  },
  sportscove: {
    "Mobile App": "strong", "0→1": "strong", "Design Systems": "strong", "Complex Workflows": "strong",
    "Research": "supporting", "Prototyping": "strong", "Independent": "supporting"
  },
  quippy: {
    "0→1": "strong", "Independent": "strong", "Research": "strong", "Prototyping": "strong", "Design Systems": "supporting"
  },
  vr: {
    "Research": "strong", "Prototyping": "strong"
  }
};

// Deliberately simple substring matching for the requirements field — not
// real language understanding.
const KEYWORDS = {
  "B2B SaaS": ["b2b", "saas", "enterprise"],
  "Marketplace": ["marketplace", "two-sided", "multi-sided"],
  "Design Systems": ["design system", "component librar", "design tokens"],
  "0→1": ["0 to 1", "0-to-1", "zero to one", "greenfield", "from scratch"],
  "Complex Workflows": ["workflow", "complex process"],
  "Independent": ["independent", "self-directed", "ownership", "autonomy", "solo"],
  "Research": ["research", "user interview"],
  "Prototyping": ["prototyp"]
};

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initBoard();
  initSketchbook();
  initTools();
  initPeel();
  initGallery();
  initAboutTerms();
});

// ---- Nav: mobile overlay + desktop compact-on-scroll ---------------
function initNav() {
  const nav = document.getElementById('heroNav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('heroNavLinks');
  const scrim = document.getElementById('navScrim');
  if (!nav || !toggle || !links) return;

  // ---- Mobile drawer ----
  const closeMenu = () => {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (scrim) scrim.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  const openMenu = () => {
    links.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    if (scrim) scrim.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  toggle.addEventListener('click', () => {
    if (links.classList.contains('is-open')) closeMenu(); else openMenu();
  });

  // Close after picking a link.
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on tapping the dimmed area behind the drawer.
  if (scrim) scrim.addEventListener('click', closeMenu);

  // Close on Escape.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close (and unlock scroll) if the viewport grows into the desktop
  // layout, where the links are shown inline instead of as a drawer.
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 900) closeMenu();
  });

  // ---- Desktop compact state (dots + current section, past the hero) ----
  const compactLabelEl = document.getElementById('navCompactLabel');
  const dotsEl = document.getElementById('navCompactDots');
  const heroEl = document.getElementById('top');
  const sections = Array.from(document.querySelectorAll('[data-nav-label]'));

  if (dotsEl) {
    links.querySelectorAll('a:not(.hero-resume)').forEach((link) => {
      const label = link.textContent.trim();
      const dot = document.createElement('a');
      dot.href = link.getAttribute('href');
      dot.className = 'dot';
      dot.title = label;
      dot.setAttribute('aria-label', label);
      dotsEl.appendChild(dot);
    });
  }

  if (heroEl && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        nav.classList.toggle('is-compact', !entry.isIntersecting);
      });
    }, { rootMargin: '-72px 0px 0px 0px' });
    heroObserver.observe(heroEl);
  }

  if (sections.length && compactLabelEl && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const label = entry.target.dataset.navLabel;
        if (!label) return;
        compactLabelEl.textContent = label;
        if (dotsEl) {
          dotsEl.querySelectorAll('.dot').forEach((dot) => {
            dot.classList.toggle('is-active', dot.title === label);
          });
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }
}

// ---- Project capability board --------------------------------------
function initBoard() {
  const chipGroup = document.getElementById('chipGroup');
  const boardStatus = document.getElementById('boardStatus');
  const cardsList = document.getElementById('projectCards');
  const cards = Array.from(document.querySelectorAll('.project-card[data-project]'));
  const otherCard = document.querySelector('.project-card-other');
  const otherList = document.querySelector('.project-other-list');
  const jdInput = document.getElementById('jdInput');
  const buildFromJdBtn = document.getElementById('buildFromJd');

  if (!chipGroup || !cards.length) return;

  const NAMES = {};
  cards.forEach((c) => { NAMES[c.dataset.project] = c.querySelector('h3').textContent; });

  chipGroup.hidden = false;

  const selected = new Set();
  const chipButtons = {};

  CAPABILITIES.forEach((cap) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.setAttribute('aria-pressed', 'false');

    const iconSvg = CAPABILITY_ICONS[cap];
    if (iconSvg) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'chip-icon';
      iconSpan.setAttribute('aria-hidden', 'true');
      iconSpan.innerHTML = iconSvg;
      btn.appendChild(iconSpan);
    }
    btn.appendChild(document.createTextNode(cap));

    btn.addEventListener('click', () => {
      if (selected.has(cap)) selected.delete(cap); else selected.add(cap);
      btn.setAttribute('aria-pressed', selected.has(cap) ? 'true' : 'false');
      render();
    });
    chipGroup.appendChild(btn);
    chipButtons[cap] = btn;
  });

  if (buildFromJdBtn) {
    buildFromJdBtn.addEventListener('click', () => {
      const text = (jdInput.value || '').toLowerCase();
      if (!text.trim()) return;

      let matchedAny = false;
      Object.keys(KEYWORDS).forEach((cap) => {
        if (KEYWORDS[cap].some((kw) => text.includes(kw))) {
          selected.add(cap);
          chipButtons[cap].setAttribute('aria-pressed', 'true');
          matchedAny = true;
        }
      });

      render();
      if (!matchedAny) {
        boardStatus.textContent = "Couldn't confidently match that text — try picking requirements directly instead.";
      }
    });

    if (jdInput) {
      jdInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          buildFromJdBtn.click();
        }
      });
    }
  }

  function scoreProject(id) {
    let score = 0;
    selected.forEach((cap) => {
      const state = EVIDENCE[id][cap];
      if (state === 'strong') score += 2;
      else if (state === 'supporting') score += 1;
    });
    return score;
  }

  // Highlights and reorders entries in the secondary "Other Projects"
  // list by the same selected chips — independent of, and lower
  // priority than, the four primary cards above (their own ranking
  // is never affected by this).
  function updateOtherProjects() {
    if (!otherList) return;
    const items = Array.from(otherList.children);

    items.forEach((li) => {
      const tags = (li.dataset.tags || '').split(',').map((t) => t.trim()).filter(Boolean);
      const isMatch = selected.size > 0 && tags.some((t) => selected.has(t));
      li.classList.toggle('is-match', isMatch);
    });

    const sorted = items.slice().sort((a, b) => {
      const key = (li) => li.classList.contains('is-match') ? 0 : 1;
      return key(a) - key(b);
    });
    sorted.forEach((li) => otherList.appendChild(li));
  }

  function withFlip(mutate) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) { mutate(); return; }

    const first = new Map(cards.map((c) => [c, c.getBoundingClientRect()]));
    mutate();

    requestAnimationFrame(() => {
      cards.forEach((card) => {
        const last = card.getBoundingClientRect();
        const f = first.get(card);
        const dx = f.left - last.left;
        const dy = f.top - last.top;
        if (!dx && !dy) return;
        card.style.transition = 'none';
        card.style.transform = `translate(${dx}px, ${dy}px)`;
        requestAnimationFrame(() => {
          card.style.transition = 'transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)';
          card.style.transform = '';
        });
      });
    });
  }

  function render() {
    withFlip(renderInner);
  }

  function renderInner() {
    const count = selected.size;

    if (count === 0) {
      boardStatus.textContent = "";
      cards.forEach((card) => {
        card.classList.remove('is-best-match', 'is-limited');
        card.querySelector('.project-match-label').hidden = true;
      });
      PROJECT_ORDER.forEach((id) => {
        const card = cards.find((c) => c.dataset.project === id);
        if (card) cardsList.appendChild(card);
      });
      if (otherCard) cardsList.appendChild(otherCard);
      updateOtherProjects();
      return;
    }

    const scored = PROJECT_ORDER.map((id) => ({ id, score: scoreProject(id) }));
    const bestScore = Math.max(...scored.map((s) => s.score));

    scored.forEach(({ id, score }) => {
      const card = cards.find((c) => c.dataset.project === id);
      const label = card.querySelector('.project-match-label');
      card.classList.remove('is-best-match', 'is-limited');

      if (score === 0) {
        card.classList.add('is-limited');
        label.hidden = true;
      } else if (score === bestScore) {
        card.classList.add('is-best-match');
        label.hidden = false;
        label.textContent = 'Best match';
      } else {
        label.hidden = true;
      }
    });

    const sortedCards = cards.slice().sort((a, b) => {
      const key = (c) => c.classList.contains('is-best-match') ? 0 : c.classList.contains('is-limited') ? 2 : 1;
      return key(a) - key(b);
    });
    sortedCards.forEach((card) => cardsList.appendChild(card));
    if (otherCard) cardsList.appendChild(otherCard);
    updateOtherProjects();

    const bestNames = scored.filter((s) => s.score === bestScore && bestScore > 0).map((s) => NAMES[s.id]);
    boardStatus.textContent = bestScore === 0
      ? `${count} selected — nothing strong here yet.`
      : `${count} selected — best match: ${bestNames.join(' & ')}.`;
  }
}

// ---- Sketchbook: drag-to-flip + arrow keys -------------------------
function initSketchbook() {
  const book = document.getElementById('sbBook');
  if (!book) return;

  const sheets = Array.from(book.querySelectorAll('.sb-sheet'));
  const rightCover = book.querySelector('.sb-cover-right');
  const hintPage = book.querySelector('.sb-page.hint');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initial stacking: first sheet on top.
  sheets.forEach((s, i) => { s.style.zIndex = String(100 - i); });

  let flippedCount = 0;
  let inView = false;      // arrow keys only work while the book is on screen
  let hintPlayed = false;

  function updateUI() {
    if (rightCover) rightCover.style.opacity = flippedCount === sheets.length ? '1' : '0';
  }

  function flipNext() {
    if (flippedCount >= sheets.length) return;
    const sheet = sheets[flippedCount];
    sheet.classList.add('flipped');
    sheet.style.zIndex = String(10 + flippedCount);
    flippedCount++;
    updateUI();
  }

  function flipPrev() {
    if (flippedCount <= 0) return;
    flippedCount--;
    const sheet = sheets[flippedCount];
    sheet.classList.remove('flipped');
    sheet.style.zIndex = String(100 - flippedCount);
    updateUI();
  }

  // ------- Drag-to-flip (both directions) -------
  let dragging = false;
  let dir = null;            // 'forward' | 'backward'
  let activeSheet = null;
  let startX = 0;
  let lastX = 0;
  let raf = null;
  let originalZ = null;

  function beginDrag(e) {
    const ex = e.clientX;
    if (ex == null) return;

    const rect = book.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    // Decide direction by which side of the book is pressed.
    if (ex > centerX && flippedCount < sheets.length) {
      dir = 'forward';
      activeSheet = sheets[flippedCount];
    } else if (ex <= centerX && flippedCount > 0) {
      dir = 'backward';
      activeSheet = sheets[flippedCount - 1];
    } else {
      dir = null;
      activeSheet = null;
      return; // nothing to drag
    }

    dragging = true;
    startX = ex;
    lastX = ex;
    originalZ = activeSheet.style.zIndex;
    activeSheet.style.transition = 'none';
    activeSheet.style.willChange = 'transform';
    activeSheet.style.zIndex = '150'; // keep it on top while dragging

    // A backward sheet is already flipped, so start from its flipped angle.
    if (dir === 'backward') {
      activeSheet.style.transform = 'rotateY(-180deg)';
    }

    if (e.pointerId !== undefined && book.setPointerCapture) {
      try { book.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    }
  }

  function onMove(e) {
    if (!dragging || !activeSheet) return;
    lastX = e.clientX;
    if (lastX == null) return;

    if (!raf) raf = requestAnimationFrame(applyDrag);
    if (e.cancelable) e.preventDefault();
  }

  function applyDrag() {
    raf = null;
    if (!dragging || !activeSheet) return;

    const half = book.clientWidth / 2;
    let frac, rot;

    if (dir === 'forward') {
      frac = Math.min(Math.max((startX - lastX) / half, 0), 1);
      rot = -180 * frac;                 // 0 -> -180
    } else {
      frac = Math.min(Math.max((lastX - startX) / half, 0), 1);
      rot = -180 + 180 * frac;           // -180 -> 0
    }

    activeSheet.style.transform = `rotateY(${rot}deg)`;
  }

  function endDrag(e, cancelled) {
    if (!dragging) return;

    const half = book.clientWidth / 2;
    const progress = Math.min(Math.max(Math.abs((e.clientX - startX) / half), 0), 1);
    // A cancelled gesture (e.g. the browser took over for vertical scroll) never completes a flip.
    const complete = !cancelled && progress > 0.33;

    if (raf) { cancelAnimationFrame(raf); raf = null; }

    activeSheet.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)';
    activeSheet.style.willChange = 'auto';

    if (dir === 'forward') {
      if (complete) {
        activeSheet.classList.add('flipped');
        activeSheet.style.transform = ''; // class controls the final -180
        activeSheet.style.zIndex = String(10 + flippedCount);
        flippedCount++;
      } else {
        activeSheet.style.transform = ''; // back to 0
        activeSheet.style.zIndex = originalZ;
      }
    } else if (dir === 'backward') {
      if (complete) {
        flippedCount--;
        activeSheet.classList.remove('flipped');
        activeSheet.style.transform = ''; // back to 0
        activeSheet.style.zIndex = String(100 - flippedCount);
      } else {
        activeSheet.style.transform = ''; // class keeps it at -180
        activeSheet.style.zIndex = originalZ;
      }
    }

    updateUI();

    dragging = false;
    dir = null;
    activeSheet = null;
    originalZ = null;
  }

  // Arrow keys — only while the book is on screen, and never while typing
  // (the requirements field sits higher up the same page).
  document.addEventListener('keydown', (e) => {
    if (!inView) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
    if (e.key === 'ArrowRight') flipNext();
    if (e.key === 'ArrowLeft') flipPrev();
  });

  // Pointer Events cover mouse + touch.
  book.addEventListener('pointerdown', beginDrag, { passive: false });
  window.addEventListener('pointermove', onMove, { passive: false });
  window.addEventListener('pointerup', (e) => endDrag(e, false), { passive: true });
  window.addEventListener('pointercancel', (e) => endDrag(e, true), { passive: true });

  // Play the one-time hint flip when the book first scrolls into view
  // (it's below the fold, so playing on page load would be missed).
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        inView = entry.isIntersecting;
        if (entry.isIntersecting && hintPage && !hintPlayed && !reduceMotion) {
          hintPlayed = true;
          hintPage.classList.add('animate-flip');
        }
      });
    }, { threshold: 0.5 });
    io.observe(book);
  } else {
    inView = true;
  }

  updateUI();
}

// ---- Tools: balls roll in from the left, once ----------------------
function initTools() {
  const section = document.getElementById('tools');
  const row = document.getElementById('toolBalls');
  if (!section || !row) return;

  const balls = Array.from(row.querySelectorAll('.tool-ball'));
  if (!balls.length) return;

  // No motion (or no observer): leave the balls resting in place.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  let played = false;

  // Park every ball just past the left edge of the screen. Each one gets:
  //   --from   how far left it starts, measured from its resting spot
  //   --spin   whole turns matching that distance (rolling without slipping),
  //            so the logo finishes upright
  //   --delay  launch order: the right-most ball leaves first, so they arrive
  //            as a queue and keep the order they're written in
  function arm() {
    section.classList.remove('is-armed');
    const n = balls.length;

    balls.forEach((ball, i) => {
      const r = ball.getBoundingClientRect();
      const dist = r.right + 40;
      const turns = Math.max(1, Math.round(dist / (Math.PI * r.width)));
      ball.style.setProperty('--from', `${-dist}px`);
      ball.style.setProperty('--spin', `${turns * 360}deg`);
      ball.style.setProperty('--delay', `${(n - 1 - i) * 0.22}s`);
    });

    section.classList.add('is-armed');
  }

  arm();

  // Re-measure if the window changes before the animation has run.
  let resizeTimer;
  window.addEventListener('resize', () => {
    if (played) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (!played) arm(); }, 150);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !played) {
        played = true;
        section.classList.add('is-playing');
        io.disconnect();               // one time only
      }
    });
  }, { threshold: 0.5, rootMargin: '0px 0px -8% 0px' });

  io.observe(section);
}

// ---- About: a stack of photos you can peel ---------------------------
// The top photo is peeled from its bottom-right corner C. Drag the corner
// to a point P and the paper folds along the perpendicular bisector of C→P:
//   keep  = the part of the photo still lying flat
//   flap  = the folded-over part, reflected across the fold (shown as the
//           paper's blank back, shaded darker at the crease)
// Pure geometry, in the SVG's own units (viewBox), so it scales with the image.
function peelGeometry(P, W, H) {
  const C = { x: W, y: H };
  const rect = [{ x: 0, y: 0 }, { x: W, y: 0 }, { x: W, y: H }, { x: 0, y: H }];
  const dx = C.x - P.x, dy = C.y - P.y;
  const len = Math.hypot(dx, dy);
  if (len < 0.5) return { keep: rect, flap: [], M: C, len: 0 };

  const n = { x: dx / len, y: dy / len };                 // points from P toward C
  const M = { x: (C.x + P.x) / 2, y: (C.y + P.y) / 2 };   // a point on the fold
  const side = (v) => (v.x - M.x) * n.x + (v.y - M.y) * n.y; // > 0 on the corner's side

  // Sutherland–Hodgman clip of the photo's rectangle against one side of the fold.
  const clip = (poly, sign) => {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const da = sign * side(a), db = sign * side(b);
      if (da >= 0) out.push(a);
      if ((da >= 0) !== (db >= 0)) {
        const t = da / (da - db);
        out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    return out;
  };

  const keep = clip(rect, -1);
  const flap = clip(rect, 1).map((v) => {
    const s = side(v);
    return { x: v.x - 2 * s * n.x, y: v.y - 2 * s * n.y };
  });
  return { keep, flap, M, len };
}

function initPeel() {
  const wrap = document.getElementById('peel');
  if (!wrap) return;
  const svg = wrap.querySelector('.peel-svg');
  const hotspot = wrap.querySelector('.peel-hotspot');
  const layers = svg && svg.querySelector('.peel-layers');
  const pagePoly = svg && svg.querySelector('#peelPage');
  const flapPoly = svg && svg.querySelector('.peel-flap');
  const grad = svg && svg.querySelector('#peelGrad');
  if (!svg || !hotspot || !layers || !pagePoly || !flapPoly || !grad) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vb = svg.viewBox.baseVal;
  const W = vb.width, H = vb.height;
  const DIAG = Math.hypot(W, H);
  const REST = W * 0.075;   // size of the little curled corner at rest
  const HOVER = W * 0.13;   // ...and when the pointer is over it
  const curl = (a) => ({ x: W - a, y: H - a });
  const pts = (poly) => poly.map((v) => `${v.x.toFixed(2)},${v.y.toFixed(2)}`).join(' ');

  // Crop every photo like CSS "cover", biased toward the top so faces stay in frame.
  Array.from(layers.children).forEach((img) => {
    const probe = new Image();
    probe.onload = () => {
      const s = Math.max(W / probe.naturalWidth, H / probe.naturalHeight);
      const w = probe.naturalWidth * s, h = probe.naturalHeight * s;
      img.setAttribute('preserveAspectRatio', 'none');
      img.setAttribute('width', w);
      img.setAttribute('height', h);
      img.setAttribute('x', (W - w) / 2);
      img.setAttribute('y', (H - h) * 0.2);
    };
    probe.src = img.getAttribute('href');
  });

  let P = curl(REST);
  let raf = 0;
  let busy = false;      // a peel-away is running
  let dragging = false;
  let queued = false;    // a drag render is already scheduled

  function render() {
    const g = peelGeometry(P, W, H);
    pagePoly.setAttribute('points', pts(g.keep));
    flapPoly.setAttribute('points', pts(g.flap));
    // Shade the back of the paper from the crease (dark) to the tip (light).
    grad.setAttribute('x1', g.M.x); grad.setAttribute('y1', g.M.y);
    grad.setAttribute('x2', P.x);   grad.setAttribute('y2', P.y);
  }

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOutBack = (t) => { const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

  function tweenTo(to, ms, ease, done) {
    cancelAnimationFrame(raf);
    const from = { x: P.x, y: P.y };
    const dur = reduceMotion ? 0 : ms;
    const t0 = performance.now();
    (function step(now) {
      const t = dur ? Math.min(1, (now - t0) / dur) : 1;
      const k = (ease || easeOut)(t);
      P = { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k };
      render();
      if (t < 1) raf = requestAnimationFrame(step);
      else if (done) done();
    })(t0);
  }

  // The peeled photo goes to the bottom of the pile, so the stack cycles
  // and every photo can be peeled again.
  function cycle() {
    const imgs = Array.from(layers.children);          // bottom → top
    const top = imgs[imgs.length - 1];
    top.removeAttribute('clip-path');
    layers.insertBefore(top, imgs[0]);
    layers.lastElementChild.setAttribute('clip-path', 'url(#peelClip)');
    P = curl(2);
    render();
    tweenTo(curl(REST), 320, easeOutBack, () => { busy = false; });
  }

  function peelAway() {
    if (busy) return;
    busy = true;
    tweenTo({ x: -W, y: -H }, 560, easeInOut, cycle);
  }

  // -- pointer: grab the corner and drag --
  let startP = null, startPt = null, moved = false;

  function toSvg(e) {
    const r = svg.getBoundingClientRect();
    const k = W / r.width;
    return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
  }

  hotspot.addEventListener('pointerenter', (e) => {
    if (busy || dragging || e.pointerType === 'touch') return;
    tweenTo(curl(HOVER), 240, easeOut);
  });
  hotspot.addEventListener('pointerleave', (e) => {
    if (busy || dragging || e.pointerType === 'touch') return;
    tweenTo(curl(REST), 280, easeOut);
  });

  hotspot.addEventListener('pointerdown', (e) => {
    if (busy || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault();
    cancelAnimationFrame(raf);
    dragging = true;
    moved = false;
    startP = { x: P.x, y: P.y };
    startPt = toSvg(e);
    try { hotspot.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });

  hotspot.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const pt = toSvg(e);
    if (Math.hypot(pt.x - startPt.x, pt.y - startPt.y) > 5) moved = true;
    P = {
      x: Math.min(W - 6, Math.max(0, startP.x + pt.x - startPt.x)),
      y: Math.min(H - 6, Math.max(0, startP.y + pt.y - startPt.y))
    };
    if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; render(); }); }
  });

  function release(e) {
    if (!dragging) return;
    dragging = false;
    cancelAnimationFrame(raf);
    raf = 0;
    const progress = Math.hypot(W - P.x, H - P.y) / DIAG;
    if (e.type === 'pointerup' && (!moved || progress > 0.4)) peelAway();   // tap, or pulled far enough
    else tweenTo(curl(REST), 380, easeOutBack);                             // let go early: it settles back
  }
  hotspot.addEventListener('pointerup', release);
  hotspot.addEventListener('pointercancel', release);

  // Keyboard: Enter / Space on the focused corner peels the photo.
  hotspot.addEventListener('click', (e) => { if (e.detail === 0) peelAway(); });

  // One-time nudge when the photos first scroll into view.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (busy || dragging) return;
        tweenTo(curl(W * 0.17), 520, easeOut, () => { if (!busy && !dragging) tweenTo(curl(REST), 560, easeOutBack); });
      });
    }, { threshold: 0.6 });
    io.observe(wrap);
  }

  render();
}

// ---- Galleries (About, Illustrations): drift left to right, pause on hover ------
// The <li> items are written once in the HTML. This repeats them so the strip
// is always at least two viewports wide, then the CSS animation slides it by
// exactly one repeat, which looks identical, so it loops with no jump.
function initGallery() {
  document.querySelectorAll('.gallery').forEach(setupGallery);
}

function setupGallery(gallery) {
  const track = gallery.querySelector('.gallery-track');
  if (!track) return;

  const originals = Array.from(track.children);
  if (!originals.length) return;

  const playVideos = (root) => root.querySelectorAll('video').forEach((v) => {
    v.muted = true;                       // cloned videos lose the muted flag, and autoplay needs it
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  });
  playVideos(track);

  // No motion: leave it as a strip you can scroll by hand.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const SPEED = 45;   // pixels per second

  function build() {
    gallery.classList.remove('is-moving');
    track.querySelectorAll('.is-clone').forEach((n) => n.remove());

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const first = originals[0];
    const last = originals[originals.length - 1];
    const setW = last.offsetLeft + last.offsetWidth - first.offsetLeft + gap;   // one full set, including its trailing gap
    if (!setW) return;

    // One "group" is enough copies to cover the viewport; the track holds two groups.
    const copies = Math.max(1, Math.ceil(gallery.clientWidth / setW));
    for (let c = 0; c < copies * 2 - 1; c++) {
      originals.forEach((el) => {
        const clone = el.cloneNode(true);
        clone.classList.add('is-clone');
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
        playVideos(clone);
      });
    }

    const shift = copies * setW;
    track.style.setProperty('--gallery-shift', `${shift}px`);
    gallery.style.setProperty('--gallery-dur', `${shift / SPEED}s`);
    gallery.classList.add('is-moving');
  }

  build();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });
}

// ---- About: hover a highlighted word, a small photo follows the cursor ----
// Each .about-term carries data-img="assets/<name>". The extension is optional:
// with none, .jpg, .jpeg, .png and .webp are tried in that order. A word whose
// photo can't be found simply shows nothing.
function initAboutTerms() {
  const terms = Array.from(document.querySelectorAll('.about-term'));
  if (!terms.length) return;

  const tip = document.createElement('div');
  tip.className = 'hover-pic';
  tip.setAttribute('aria-hidden', 'true');
  const card = document.createElement('div');
  card.className = 'hover-pic-card';
  const img = document.createElement('img');
  img.alt = '';
  card.appendChild(img);
  tip.appendChild(card);
  document.body.appendChild(tip);

  const EXTS = ['jpg', 'jpeg', 'png', 'webp'];
  const cache = new Map();
  function resolve(base) {
    if (cache.has(base)) return cache.get(base);
    const p = new Promise((done) => {
      if (/\.(jpe?g|png|webp|gif|avif)$/i.test(base)) return done(base);
      let i = 0;
      (function next() {
        if (i >= EXTS.length) return done(null);
        const probe = new Image();
        probe.onload = () => done(probe.src);
        probe.onerror = next;
        probe.src = `${base}.${EXTS[i++]}`;
      })();
    });
    cache.set(base, p);
    return p;
  }

  let active = null;   // the word currently showing its photo
  let anchor = null;   // set when shown for keyboard/touch: sits above the word instead of following the cursor
  let pos = { x: 0, y: 0 };

  function place() {
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let x, y;
    if (anchor) {
      const r = anchor.getBoundingClientRect();
      x = r.left + r.width / 2 - w / 2;
      y = r.top - h - 12;
      if (y < 8) y = r.bottom + 12;
    } else {
      x = pos.x + 18;
      y = pos.y + 18;
      if (x + w > window.innerWidth - 8) x = pos.x - w - 18;
      if (y + h > window.innerHeight - 8) y = pos.y - h - 18;
    }
    x = Math.max(8, Math.min(x, window.innerWidth - w - 8));
    y = Math.max(8, Math.min(y, window.innerHeight - h - 8));
    tip.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  async function show(term, viaPointer) {
    active = term;
    anchor = viaPointer ? null : term;
    const url = await resolve(term.dataset.img);
    if (active !== term || !url) return;
    if (img.getAttribute('src') !== url) img.src = url;
    place();
    tip.classList.add('is-visible');
    if (!img.complete) img.addEventListener('load', place, { once: true });
  }

  function hide(term) {
    if (term && active !== term) return;
    active = null;
    tip.classList.remove('is-visible');
  }

  terms.forEach((term) => {
    term.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'touch') return;
      pos = { x: e.clientX, y: e.clientY };
      show(term, true);
    });
    term.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      pos = { x: e.clientX, y: e.clientY };
      if (active !== term) show(term, true); else place();
    });
    term.addEventListener('pointerleave', () => hide(term));

    // Keyboard focus: show it above the word.
    term.addEventListener('focus', () => show(term, false));
    term.addEventListener('blur', () => hide(term));

    // Touch has no hover: tap the word to show or hide its photo.
    term.addEventListener('pointerup', (e) => {
      if (e.pointerType !== 'touch') return;
      if (active === term) hide(term); else show(term, false);
    });
  });

  // Tapping elsewhere, or scrolling, puts it away.
  document.addEventListener('pointerdown', (e) => {
    if (active && !(e.target instanceof Element && e.target.closest('.about-term'))) hide();
  });
  window.addEventListener('scroll', () => hide(), { passive: true });

  // First time the text scrolls into view: every photo pops up above its word
  // for a moment (in reading order), so people know the words do something.
  async function popAll() {
    const found = await Promise.all(terms.map(async (t) => ({ t, url: await resolve(t.dataset.img) })));
    const pops = [];
    found.forEach(({ t, url }) => {
      if (!url) return;
      const r = t.getBoundingClientRect();
      const half = 62;                                          // keep the photo on screen sideways
      const cx = r.left + r.width / 2;
      const x = Math.max(half, Math.min(cx, document.documentElement.clientWidth - half));

      const pop = document.createElement('div');
      pop.className = 'about-pop';
      pop.setAttribute('aria-hidden', 'true');
      pop.style.left = `${x + window.scrollX}px`;
      pop.style.top = `${r.top + window.scrollY - 6}px`;

      const card = document.createElement('div');
      card.className = 'about-pop-card';
      card.style.setProperty('--d', `${pops.length * 0.11}s`);
      const im = document.createElement('img');
      im.alt = '';
      im.src = url;
      card.appendChild(im);
      pop.appendChild(card);
      document.body.appendChild(pop);
      pops.push(pop);
    });
    setTimeout(() => pops.forEach((p) => p.remove()), 1500 + pops.length * 110 + 300);
  }

  const textBlock = document.querySelector('.about-text');
  if (textBlock && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();                 // one time only
      popAll();
    }, { threshold: 0.35 });
    io.observe(textBlock);
  }
}