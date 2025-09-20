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



  
  // Add loading screen
  function initLoadingScreen() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-logo">CLEARISK DASHBOARD</div>
        <div class="loader-bar">
          <div class="loader-progress"></div>
        </div>
        <div class="loader-text">A little heavy, sorry</div>
      </div>
    `;
    document.body.prepend(loader);
    
    // Add CSS for loader
    const loaderStyle = document.createElement('style');
    loaderStyle.textContent = `
      .page-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #000, #1a1a1a);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.5s ease, visibility 0.5s ease;
      }
      
      .page-loader.fade-out {
        opacity: 0;
        visibility: hidden;
      }
      
      .loader-content {
        text-align: center;
        color: #f1f1f1;
      }
      
      .loader-logo {
        font-size: 2.5rem;
        font-weight: 900;
        color: #EB676C;
        margin-bottom: 30px;
        letter-spacing: 0.1em;
        animation: pulse 2s ease-in-out infinite;
      }
      
      .loader-bar {
        width: 200px;
        height: 3px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        margin: 20px auto;
        overflow: hidden;
      }
      
      .loader-progress {
        height: 100%;
        background: linear-gradient(90deg, #EB676C, #FF8A8A);
        width: 0%;
        border-radius: 2px;
        animation: loading 2s ease-in-out;
      }
      
      .loader-text {
        margin-top: 20px;
        font-size: 0.9rem;
        color: #888;
        animation: fadeInOut 2s ease-in-out infinite;
      }
      
      @keyframes loading {
        0% { width: 0%; }
        100% { width: 100%; }
      }
      
      @keyframes fadeInOut {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
    `;
    document.head.appendChild(loaderStyle);
    
    // Hide loader after content loads
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => loader.remove(), 500);
      }, 1000);
    });
    
    // Fallback: hide loader after 3 seconds
    setTimeout(() => {
      if (loader.parentNode) {
        loader.classList.add('fade-out');
        setTimeout(() => loader.remove(), 500);
      }
    }, 3000);
  }
  
  initLoadingScreen();
  
  // Add performance monitoring
  function initPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', () => {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
      
      // Log other performance metrics
      if ('connection' in navigator) {
        console.log(`🌐 Connection: ${navigator.connection.effectiveType}`);
      }
      
      // Monitor scroll performance
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const scrollTop = window.pageYOffset;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = (scrollTop / docHeight) * 100;
          
          if (scrollPercent > 50 && !sessionStorage.getItem('scrolled50')) {
            sessionStorage.setItem('scrolled50', 'true');
            console.log('📊 User scrolled past 50% of content');
          }
        }, 100);
      });
    });
  }
  
  initPerformanceMonitoring();
  
  // Add accessibility improvements
  function initAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.prepend(skipLink);
    
    // Add id to main content
    const mainContent = document.querySelector('.case-study');
    if (mainContent) {
      mainContent.id = 'main-content';
    }
    
    // Add CSS for skip link
    const skipStyle = document.createElement('style');
    skipStyle.textContent = `
      .skip-link {
        position: absolute;
        top: -100px;
        left: 20px;
        background: #EB676C;
        color: #000;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        z-index: 10001;
        transition: top 0.3s ease;
        font-weight: 600;
      }
      
      .skip-link:focus {
        top: 20px;
      }
    `;
    document.head.appendChild(skipStyle);
    
    // Add ARIA labels to interactive elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn, index) => {
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    });
    
    // Add reduced motion support
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      
      const reducedMotionStyle = document.createElement('style');
      reducedMotionStyle.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(reducedMotionStyle);
    }
  }
  
  initAccessibility();
  
  console.log('🎨 Sportscove portfolio initialized successfully!');
  console.log('✨ Features loaded: Animations, Videos, Tabs, Parallax, Progress, Cursor, Navigation');
  console.log('🚀 Ready for an amazing user experience!');
  