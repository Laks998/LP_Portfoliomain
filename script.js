document.addEventListener("DOMContentLoaded", () => {

  // ========== MINI LOTTIE PREVIEW (Animation card, index only) ==========
  const miniLottie = document.getElementById('mini-lottie');
  if (miniLottie) {
    if (typeof lottie === 'undefined') {
      console.error('Lottie library did not load — check that the cdnjs <script> tag in <head> loaded successfully (network/ad-blocker issue?).');
    } else {
      const miniAnim = lottie.loadAnimation({
        container: miniLottie,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/data.json'
      });
      miniAnim.addEventListener('data_failed', () => {
        console.error('Lottie: failed to load/parse assets/data.json for the mini preview. If you are opening index.html directly (file://) instead of via a local server, browsers block that fetch — run a local server (e.g. `python3 -m http.server` or VS Code Live Server) and check the Network/Console tab for the real error.');
      });
    }
  }

  // ========== FULL LOTTIE (animation.html only) ==========
  const fullLottie = document.getElementById('full-lottie');
  if (fullLottie) {
    if (typeof lottie === 'undefined') {
      console.error('Lottie library did not load on animation.html.');
    } else {
      const fullAnim = lottie.loadAnimation({
        container: fullLottie,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/data.json'
      });
      fullAnim.addEventListener('data_failed', () => {
        console.error('Lottie: failed to load/parse assets/data.json on animation.html.');
      });
    }
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ========== MAGNETIC TILT ON HOVER (desktop, fine pointer only) ==========
  // Project-carousel cards are excluded: they're driven by the carousel's
  // own transform (translate + scale) and fighting that with a tilt
  // transform on hover would make the rotation snap/jump.
  const supportsHoverTilt = !prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsHoverTilt) {
    const maxTilt = 6; // degrees
    const tiltCards = document.querySelectorAll('.bento-card:not(.card-project)');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;  // 0 -> 1
        const py = (e.clientY - rect.top) / rect.height;  // 0 -> 1
        const rotateY = (px - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - py) * maxTilt * 2;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015) translateY(-4px)`;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
      });
    });
  }

  // Project-carousel slots are assigned synchronously (needed so the entrance
  // animation below measures correct final positions), but its rotation timer
  // and click/idle interactions only switch on once the entrance has settled.
  const carousel = initProjectCarousel(prefersReducedMotion);

  // ========== ENTRANCE — hero photo alone & centered, everything else
  // emerges from behind it into the finished layout ==========
  const entranceMs = initHeroEntrance(prefersReducedMotion);

  if (carousel) carousel.activate(entranceMs);

});

/**
 * First paint: only the hero/photo card is visible, enlarged and centered
 * on the viewport, as if it's the only thing on the page. After a short
 * beat, every other card (quick-links + the 4 project cards) animates out
 * from directly behind it into its real grid position, while the hero
 * itself settles down into its normal spot — one orchestrated moment
 * rather than a generic per-card fade-in.
 *
 * Returns the total entrance duration in ms (0 if skipped), so callers
 * can wait for it before starting their own animations (e.g. the project
 * carousel's auto-rotation).
 */
function initHeroEntrance(prefersReducedMotion) {
  const bentoPage = document.querySelector('.bento-page');
  const heroCard = document.querySelector('.card-hero');
  if (!bentoPage || !heroCard) return 0;

  const allCards = Array.from(bentoPage.querySelectorAll('.bento-card'));
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (prefersReducedMotion || isMobile) {
    // Keep a gentle, non-choreographed fade-in instead of the splash.
    if (!prefersReducedMotion) {
      allCards.forEach((card, i) => {
        card.style.animationDelay = `${i * 60}ms`;
        card.classList.add('is-entering');
      });
    }
    return 0;
  }

  const otherCards = allCards.filter(card => card !== heroCard);
  const finalRects = new Map(allCards.map(card => [card, card.getBoundingClientRect()]));
  const heroFinal = finalRects.get(heroCard);

  // The "splash" rect: the hero card enlarged and centered on the screen.
  const startWidth = Math.min(heroFinal.width * 1.25, window.innerWidth * 0.62, window.innerHeight * 0.85 * (heroFinal.width / heroFinal.height));
  const startHeight = startWidth * (heroFinal.height / heroFinal.width);
  const heroStart = {
    left: (window.innerWidth - startWidth) / 2,
    top: (window.innerHeight - startHeight) / 2,
    width: startWidth,
    height: startHeight
  };

  function placeAt(card, from, to, fadeIn) {
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    const sx = from.width / to.width;
    const sy = from.height / to.height;
    card.style.transformOrigin = 'top left';
    card.style.transition = 'none';
    card.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    if (fadeIn) card.style.opacity = '0';
  }

  // Hero starts big & centered, on top; everything else starts tucked
  // in that exact same spot — hidden face-down behind the photo.
  placeAt(heroCard, heroStart, heroFinal, false);
  heroCard.style.zIndex = '20';

  otherCards.forEach(card => {
    placeAt(card, heroStart, finalRects.get(card), true);
    card.style.zIndex = '5';
  });

  const HOLD_MS = 550;       // beat where only the hero is on screen
  const DURATION_MS = 950;   // settle into the final grid
  const STAGGER_MS = 35;
  const EASING = 'cubic-bezier(0.65, 0, 0.35, 1)';

  requestAnimationFrame(() => {
    setTimeout(() => {
      allCards.forEach((card, i) => {
        const delay = card === heroCard ? 0 : Math.min(i * STAGGER_MS, 160);
        card.style.transition = `transform ${DURATION_MS}ms ${EASING} ${delay}ms, opacity ${Math.round(DURATION_MS * 0.7)}ms ease ${delay}ms`;
        card.style.transform = '';
        card.style.opacity = '';
      });

      setTimeout(() => {
        allCards.forEach(card => {
          card.style.transition = '';
          card.style.transformOrigin = '';
          card.style.zIndex = '';
        });
      }, DURATION_MS + 200);
    }, HOLD_MS);
  });

  return HOLD_MS + DURATION_MS + STAGGER_MS * otherCards.length;
}

/**
 * Sets up the project-card carousel: a large "main" slot (left) and three
 * stacked "top" / "mid" / "bottom" slots (right) that the 4 project cards
 * cycle through — but the cursor is in charge, not just a timer:
 *   - auto-rotation runs while the mouse is idle (not moving)
 *   - the instant the mouse moves, rotation pauses — so a card never
 *     shifts out from under someone who's about to click it
 *   - clicking a small side card promotes it into the big main slot
 *     instead of navigating away; only the main card is an actual link,
 *     with a "View" pill to make that obvious
 *   - once the mouse goes still again, auto-rotation picks back up from
 *     wherever it was left
 * Every move is animated with a FLIP transform (record the old rect, jump
 * to the new layout, animate translate+scale back to identity).
 *
 * Returns { activate(delayMs) } so entrance choreography can decide when
 * the carousel is allowed to start moving/responding to input.
 */
function initProjectCarousel(prefersReducedMotion) {
  const carousel = document.getElementById('projectCarousel');
  if (!carousel) return null;

  const SLOTS = ['main', 'top', 'mid', 'bottom'];
  const HOLD_MS = 2400;        // how long a layout stays put between rotations
  const DURATION_MS = 900;     // how long a slide/scale takes
  const IDLE_RESUME_MS = 1200; // how long the mouse must sit still before auto-rotate resumes
  const EASING = 'cubic-bezier(0.65, 0, 0.35, 1)';

  let order = Array.from(carousel.querySelectorAll('.card-project'));
  if (order.length < 4) return null;

  // Slots are assigned right away so the grid — and anything measuring it,
  // like the entrance animation — is correct from the very first layout.
  order.forEach((card, i) => card.setAttribute('data-slot', SLOTS[i]));

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (prefersReducedMotion || isMobile) return null; // static stacked list, see CSS

  let isAnimating = false;
  let intervalId = null;
  let idleTimer = null;

  function animateToOrder(newOrder) {
    if (isAnimating) return;
    isAnimating = true;

    // FIRST: capture each card's current on-screen rect.
    const firstRects = new Map(order.map(card => [card, card.getBoundingClientRect()]));

    order = newOrder;
    order.forEach((card, i) => {
      card.setAttribute('data-slot', SLOTS[i]);
      card.classList.add('is-rotating');
    });

    // Wait a frame so the browser has applied the new grid layout (LAST).
    requestAnimationFrame(() => {
      order.forEach(card => {
        const last = card.getBoundingClientRect();
        const first = firstRects.get(card);

        const dx = first.left - last.left;
        const dy = first.top - last.top;
        const sx = first.width / last.width;
        const sy = first.height / last.height;

        card.style.transformOrigin = 'top left';
        card.style.transition = 'none';
        card.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      });

      // Next frame: release to identity transform with a transition — INVERT -> PLAY.
      requestAnimationFrame(() => {
        order.forEach(card => {
          card.style.transition = `transform ${DURATION_MS}ms ${EASING}`;
          card.style.transform = '';
        });

        setTimeout(() => {
          order.forEach(card => {
            card.style.transition = '';
            card.style.transformOrigin = '';
            card.classList.remove('is-rotating');
          });
          isAnimating = false;
        }, DURATION_MS + 50);
      });
    });
  }

  function rotate() {
    // Cyclic hand-off: top -> main, mid -> top, bottom -> mid, main -> bottom.
    animateToOrder([order[1], order[2], order[3], order[0]]);
  }

  function promote(card) {
    if (order.indexOf(card) <= 0) return; // already main, or mid-animation
    // Clicked card becomes main; everyone else keeps their relative order.
    animateToOrder([card, ...order.filter(c => c !== card)]);
  }

  function startAutoRotate() {
    stopAutoRotate();
    intervalId = setInterval(rotate, HOLD_MS + DURATION_MS);
  }

  function stopAutoRotate() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
  }

  // Any mouse movement pauses auto-rotate; once the mouse has been still
  // for IDLE_RESUME_MS, auto-rotate resumes on its own.
  function handleUserActivity() {
    stopAutoRotate();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startAutoRotate, IDLE_RESUME_MS);
  }

  function activate(delayMs) {
    setTimeout(() => {
      order.forEach(card => {
        card.addEventListener('click', (e) => {
          if (card.getAttribute('data-slot') !== 'main') {
            e.preventDefault();
            promote(card);
          }
          // Main card: let the click through, it's a real link to the case study.
        });
      });

      window.addEventListener('mousemove', handleUserActivity, { passive: true });
      startAutoRotate(); // starts "idle" — runs until the mouse actually moves
    }, delayMs || 0);
  }

  return { activate };
}