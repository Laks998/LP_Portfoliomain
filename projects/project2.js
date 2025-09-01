// Fade-in effect when sections come into view
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Animate only once
    }
  });
}, {
  threshold: 0.2
});

// Observe all top-level sections inside .project-detail
document.querySelectorAll('.project-detail > section').forEach(section => {
  observer.observe(section);
});

document.querySelectorAll('#design-process-animation .stage').forEach(stage => {
  stage.addEventListener('click', () => {
    const details = stage.querySelector('.stage-details');
    if (details.hasAttribute('hidden')) {
      details.removeAttribute('hidden');
      stage.setAttribute('aria-expanded', 'true');
    } else {
      details.setAttribute('hidden', '');
      stage.setAttribute('aria-expanded', 'false');
    }
  });

  // Keyboard toggle for accessibility
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      stage.click();
    }
  });

  // Initialize aria-expanded attribute
  stage.setAttribute('aria-expanded', 'false');
});

// --- Flipbook hint fade-out on first interaction ---
const book = document.getElementById('book');
const flipHint = document.querySelector('.flip-hint-animation');

if (book && flipHint) {
  book.addEventListener('pointerdown', () => {
    flipHint.style.transition = 'opacity 0.5s ease';
    flipHint.style.opacity = '0';
    // Optional: remove from DOM after fading
    setTimeout(() => flipHint.remove(), 500);
  }, { once: true }); // triggers only once
}



/* ---------- Roles character carousel JS (append below existing code) ---------- */
(function () {
  const wrapper = document.querySelector('.roles-wrapper');
  if (!wrapper) return; // nothing to do if no section on this page

  const carousel = wrapper.querySelector('.roles-carousel');
  const cardNodes = Array.from(carousel.querySelectorAll('.role-card'));
  const leftBtn = wrapper.querySelector('.scroll-arrow.left');
  const rightBtn = wrapper.querySelector('.scroll-arrow.right');
  const scrollViewBtn = document.getElementById('scrollViewBtn');
  const gridViewBtn = document.getElementById('gridViewBtn');

  if (!cardNodes.length) return;

  // wait until images are loaded so dimensions are accurate
  const imgs = carousel.querySelectorAll('img.role-card-img');
  const waitForImages = () => new Promise(resolve => {
    let count = 0;
    imgs.forEach(img => {
      if (img.complete) {
        count++;
      } else {
        img.addEventListener('load', () => {
          count++;
          if (count === imgs.length) resolve();
        }, { once: true });
      }
    });
    if (count === imgs.length) resolve();
  });

  let index = 0;
  const GAP = parseFloat(getComputedStyle(carousel).getPropertyValue('--card-gap')) || 20;

  function getCardWidth() {
    return cardNodes[0].getBoundingClientRect().width;
  }
  function getWrapWidth() {
    return wrapper.getBoundingClientRect().width;
  }

  function applyClasses() {
    cardNodes.forEach((card, i) => {
      card.classList.remove('active', 'prev', 'next');
      if (i === index) card.classList.add('active');
      else if (i === ((index - 1 + cardNodes.length) % cardNodes.length)) card.classList.add('prev');
      else if (i === ((index + 1) % cardNodes.length)) card.classList.add('next');
    });
  }

  function centerOnIndex() {
    // in grid view, do nothing
    if (wrapper.classList.contains('grid-view')) {
      carousel.style.transform = 'none';
      return;
    }

    const cardW = getCardWidth();
    const wrapW = getWrapWidth();

    // translate so the selected card is centered
    const offset = (wrapW / 2) - (cardW / 2) - index * (cardW + GAP);
    carousel.style.transform = `translateX(${offset}px)`;

    // disable arrows at edges if you want (optional wrap-around not used here)
    if (leftBtn) leftBtn.disabled = (index === 0);
    if (rightBtn) rightBtn.disabled = (index === cardNodes.length - 1);
  }

  function goTo(i) {
    index = Math.max(0, Math.min(cardNodes.length - 1, i));
    applyClasses();
    centerOnIndex();
  }

  function go(delta) {
    goTo(index + delta);
  }

  // init after images loaded
  waitForImages().then(() => {
    // ensure CSS variable fallback values are available
    // compute initial
    applyClasses();
    // small delay to ensure layout settled
    requestAnimationFrame(centerOnIndex);
  });

  // clicks
  leftBtn && leftBtn.addEventListener('click', () => go(-1));
  rightBtn && rightBtn.addEventListener('click', () => go(1));

  // click on a visible card to jump focus
  cardNodes.forEach((card, i) => card.addEventListener('click', () => { if (i !== index) goTo(i); }));

  // keyboard support (left/right)
  wrapper.addEventListener('keydown', (e) => {
    if (wrapper.classList.contains('grid-view')) return; // grid uses native tabbing
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });

  // view toggles
  scrollViewBtn && scrollViewBtn.addEventListener('click', () => {
    wrapper.classList.remove('grid-view');
    scrollViewBtn.classList.add('active');
    gridViewBtn && gridViewBtn.classList.remove('active');
    // show arrows (unless small screen)
    if (window.innerWidth > 680) {
      leftBtn && (leftBtn.style.display = 'block');
      rightBtn && (rightBtn.style.display = 'block');
    }
    // re-center
    requestAnimationFrame(centerOnIndex);
  });

  gridViewBtn && gridViewBtn.addEventListener('click', () => {
    wrapper.classList.add('grid-view');
    gridViewBtn.classList.add('active');
    scrollViewBtn && scrollViewBtn.classList.remove('active');
    leftBtn && (leftBtn.style.display = 'none');
    rightBtn && (rightBtn.style.display = 'none');
    // remove transform so grid arranges naturally
    carousel.style.transform = 'none';
  });

  // handle resize: debounce
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      centerOnIndex();
    }, 120);
  });
})();

(function () {
  const wrapper = document.querySelector('.roles-wrapper2');
  if (!wrapper) return; // nothing to do if no section on this page

  const carousel = wrapper.querySelector('.roles-carousel2');
  const cardNodes = Array.from(carousel.querySelectorAll('.role-card2'));
  const leftBtn = wrapper.querySelector('.scroll-arrow2.left');
  const rightBtn = wrapper.querySelector('.scroll-arrow2.right');
  const scrollViewBtn = document.getElementById('scrollViewBtn2');
  const gridViewBtn = document.getElementById('gridViewBtn2');

  if (!cardNodes.length) return;

  // wait until images are loaded so dimensions are accurate
  const imgs = carousel.querySelectorAll('img.role-card-img2');
  const waitForImages = () => new Promise(resolve => {
    let count = 0;
    imgs.forEach(img => {
      if (img.complete) {
        count++;
      } else {
        img.addEventListener('load', () => {
          count++;
          if (count === imgs.length) resolve();
        }, { once: true });
      }
    });
    if (count === imgs.length) resolve();
  });

  let index = 0;
  const GAP = parseFloat(getComputedStyle(carousel).getPropertyValue('--card-gap')) || 20;

  function getCardWidth() {
    return cardNodes[0].getBoundingClientRect().width;
  }
  function getWrapWidth() {
    return wrapper.getBoundingClientRect().width;
  }

  function applyClasses() {
    cardNodes.forEach((card, i) => {
      card.classList.remove('active', 'prev', 'next');
      if (i === index) card.classList.add('active');
      else if (i === ((index - 1 + cardNodes.length) % cardNodes.length)) card.classList.add('prev');
      else if (i === ((index + 1) % cardNodes.length)) card.classList.add('next');
    });
  }

  function centerOnIndex() {
    if (wrapper.classList.contains('grid-view')) {
      carousel.style.transform = 'none';
      return;
    }

    const cardW = getCardWidth();
    const wrapW = getWrapWidth();
    const offset = (wrapW / 2) - (cardW / 2) - index * (cardW + GAP);
    carousel.style.transform = `translateX(${offset}px)`;

    if (leftBtn) leftBtn.disabled = (index === 0);
    if (rightBtn) rightBtn.disabled = (index === cardNodes.length - 1);
  }

  function goTo(i) {
    index = Math.max(0, Math.min(cardNodes.length - 1, i));
    applyClasses();
    centerOnIndex();
  }

  function go(delta) {
    goTo(index + delta);
  }

  waitForImages().then(() => {
    applyClasses();
    requestAnimationFrame(centerOnIndex);
  });

  leftBtn && leftBtn.addEventListener('click', () => go(-1));
  rightBtn && rightBtn.addEventListener('click', () => go(1));

  cardNodes.forEach((card, i) => card.addEventListener('click', () => { if (i !== index) goTo(i); }));

  wrapper.addEventListener('keydown', (e) => {
    if (wrapper.classList.contains('grid-view')) return;
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });

  scrollViewBtn && scrollViewBtn.addEventListener('click', () => {
    wrapper.classList.remove('grid-view');
    scrollViewBtn.classList.add('active');
    gridViewBtn && gridViewBtn.classList.remove('active');
    if (window.innerWidth > 680) {
      leftBtn && (leftBtn.style.display = 'block');
      rightBtn && (rightBtn.style.display = 'block');
    }
    requestAnimationFrame(centerOnIndex);
  });

  gridViewBtn && gridViewBtn.addEventListener('click', () => {
    wrapper.classList.add('grid-view');
    gridViewBtn.classList.add('active');
    scrollViewBtn && scrollViewBtn.classList.remove('active');
    leftBtn && (leftBtn.style.display = 'none');
    rightBtn && (rightBtn.style.display = 'none');
    carousel.style.transform = 'none';
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      centerOnIndex();
    }, 120);
  });
})();

//New ONe//

(function () {
  const wrapper = document.querySelector('.roles-wrapper2');
  if (!wrapper) return; // nothing to do if no section on this page

  const carousel = wrapper.querySelector('.roles-carousel2');
  const cardNodes = Array.from(carousel.querySelectorAll('.role-card2'));
  const leftBtn = wrapper.querySelector('.scroll-arrow2.left');
  const rightBtn = wrapper.querySelector('.scroll-arrow2.right');
  const scrollViewBtn = document.getElementById('scrollViewBtn2');
  const gridViewBtn = document.getElementById('gridViewBtn2');

  if (!cardNodes.length) return;

  // wait until images are loaded so dimensions are accurate
  const imgs = carousel.querySelectorAll('img.role-card-img2');
  const waitForImages = () => new Promise(resolve => {
    let count = 0;
    imgs.forEach(img => {
      if (img.complete) {
        count++;
      } else {
        img.addEventListener('load', () => {
          count++;
          if (count === imgs.length) resolve();
        }, { once: true });
      }
    });
    if (count === imgs.length) resolve();
  });

  let index = 0;
  const GAP = parseFloat(getComputedStyle(carousel).getPropertyValue('--card-gap')) || 20;

  function getCardWidth() {
    return cardNodes[0].getBoundingClientRect().width;
  }
  function getWrapWidth() {
    return wrapper.getBoundingClientRect().width;
  }

  function applyClasses() {
    cardNodes.forEach((card, i) => {
      card.classList.remove('active', 'prev', 'next');
      if (i === index) card.classList.add('active');
      else if (i === ((index - 1 + cardNodes.length) % cardNodes.length)) card.classList.add('prev');
      else if (i === ((index + 1) % cardNodes.length)) card.classList.add('next');
    });
  }

  function centerOnIndex() {
    if (wrapper.classList.contains('grid-view')) {
      carousel.style.transform = 'none';
      return;
    }

    const cardW = getCardWidth();
    const wrapW = getWrapWidth();
    const offset = (wrapW / 2) - (cardW / 2) - index * (cardW + GAP);
    carousel.style.transform = `translateX(${offset}px)`;

    if (leftBtn) leftBtn.disabled = (index === 0);
    if (rightBtn) rightBtn.disabled = (index === cardNodes.length - 1);
  }

  function goTo(i) {
    index = Math.max(0, Math.min(cardNodes.length - 1, i));
    applyClasses();
    centerOnIndex();
  }

  function go(delta) {
    goTo(index + delta);
  }

  waitForImages().then(() => {
    applyClasses();
    requestAnimationFrame(centerOnIndex);
  });

  leftBtn && leftBtn.addEventListener('click', () => go(-1));
  rightBtn && rightBtn.addEventListener('click', () => go(1));

  cardNodes.forEach((card, i) => card.addEventListener('click', () => { if (i !== index) goTo(i); }));

  wrapper.addEventListener('keydown', (e) => {
    if (wrapper.classList.contains('grid-view')) return;
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });

  scrollViewBtn && scrollViewBtn.addEventListener('click', () => {
    wrapper.classList.remove('grid-view');
    scrollViewBtn.classList.add('active');
    gridViewBtn && gridViewBtn.classList.remove('active');
    if (window.innerWidth > 680) {
      leftBtn && (leftBtn.style.display = 'block');
      rightBtn && (rightBtn.style.display = 'block');
    }
    requestAnimationFrame(centerOnIndex);
  });

  gridViewBtn && gridViewBtn.addEventListener('click', () => {
    wrapper.classList.add('grid-view');
    gridViewBtn.classList.add('active');
    scrollViewBtn && scrollViewBtn.classList.remove('active');
    leftBtn && (leftBtn.style.display = 'none');
    rightBtn && (rightBtn.style.display = 'none');
    carousel.style.transform = 'none';
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      centerOnIndex();
    }, 120);
  });
})();
