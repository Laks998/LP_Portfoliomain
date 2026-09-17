// script.js — mobile nav toggle, plus the capability filter for the
// project grid and a simple keyword-matched "requirements" text field.
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
      boardStatus.textContent = "Nothing selected yet — pick what matters to you.";
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