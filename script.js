// script.js — capability filter for the project grid, plus a simple
// keyword-matched "requirements" text field. Nothing here gates content
// that isn't already visible without JS — chips just add filtering on top
// of four project cards that are already fully populated in the HTML.

const CAPABILITIES = [
  "B2B SaaS", "Mobile App", "Design Systems", "0→1",
  "Complex Workflows", "Independent", "Research", "Prototyping", "Dashboard"
];

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

document.addEventListener('DOMContentLoaded', initBoard);

function initBoard() {
  const chipGroup = document.getElementById('chipGroup');
  const boardStatus = document.getElementById('boardStatus');
  const cardsList = document.getElementById('projectCards');
  const cards = Array.from(document.querySelectorAll('.project-card'));
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
    btn.textContent = cap;
    btn.setAttribute('aria-pressed', 'false');
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

    const bestNames = scored.filter((s) => s.score === bestScore && bestScore > 0).map((s) => NAMES[s.id]);
    boardStatus.textContent = bestScore === 0
      ? `${count} selected — nothing strong here yet.`
      : `${count} selected — best match: ${bestNames.join(' & ')}.`;
  }
}