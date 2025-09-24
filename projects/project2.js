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

document.addEventListener("DOMContentLoaded", () => {
  
  // Initialize all functionality
  initHeroParallax();
  initScrollToTop();
  initEasterEgg();

  function initScrollAnimations() {
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach(section => {
    observer.observe(section);
  });
}


  // Hero parallax effect
  function initHeroParallax() {
      const hero = document.querySelector('.project-hero');
      const heroImg = document.querySelector('.hero-bg');
      const heroText = document.querySelector('.hero-text');
      
      if (!hero || !heroImg || !heroText) return;
      
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        const textRate = scrolled * 0.2;
        
        if (scrolled < window.innerHeight) {
          heroImg.style.transform = `translateY(${rate}px)`;
          heroText.style.transform = `translateY(${textRate}px)`;
        }
      });
    }

    // Add typing effect to hero title
  function initTypingEffect() {
    const title = document.querySelector('.project-title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '3px solid #EB676C';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        title.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 150);
      } else {
        setTimeout(() => {
          title.style.borderRight = 'none';
        }, 1000);
      }
    };
    
    // Start typing effect after page load
    setTimeout(typeWriter, 500);
  }
  
  // Initialize typing effect
  initTypingEffect();

  initKeyboardNavigation();
  
  // Add scroll-to-top functionality
  function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
    
    // Add CSS for scroll-to-top button
    const scrollStyle = document.createElement('style');
    scrollStyle.textContent = `
      .scroll-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #EB676C;
        color: #000;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(235, 103, 108, 0.3);
      }
      
      .scroll-to-top.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      
      .scroll-to-top:hover {
        background: #FF8A8A;
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(235, 103, 108, 0.4);
      }
      
      .scroll-to-top:active {
        transform: translateY(0);
      }
    `;
    document.head.appendChild(scrollStyle);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollBtn.classList.add('show');
      } else {
        scrollBtn.classList.remove('show');
      }
    });
    
    // Smooth scroll to top
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  initScrollToTop();

  // Add easter egg - Konami code
  function initEasterEgg() {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let userInput = [];
    
    document.addEventListener('keydown', (e) => {
      userInput.push(e.keyCode);
      
      if (userInput.length > konamiCode.length) {
        userInput.shift();
      }
      
      if (userInput.join(',') === konamiCode.join(',')) {
        activateEasterEgg();
        userInput = [];
      }
    });
    
    function activateEasterEgg() {
      document.body.style.animation = 'rainbow 2s ease infinite';
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
      
      setTimeout(() => {
        document.body.style.animation = '';
        style.remove();
      }, 5000);
      
      // Show message
      const message = document.createElement('div');
      message.textContent = '🎨 Designer mode activated! 🎨';
      message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #EB676C;
        color: #000;
        padding: 20px 40px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 10000;
        animation: bounce 1s ease;
      `;
      document.body.appendChild(message);
      
      setTimeout(() => message.remove(), 3000);
    }
  }
  
  initEasterEgg();
});