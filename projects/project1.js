// Enhanced Sportscove Portfolio JavaScript

document.addEventListener("DOMContentLoaded", () => {
  
  // Initialize all functionality
  initScrollAnimations();
  initVideoObserver();
  initTabSystem();
  initSmoothScrolling();
  initHeroParallax();
  initProgressIndicator();
  
  // Scroll-triggered animations
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          // Add stagger effect for grid items
          if (entry.target.classList.contains('challenge-grid') || 
              entry.target.classList.contains('research-insights') ||
              entry.target.classList.contains('results-grid')) {
            staggerGridItems(entry.target);
          }
        }
      });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.case-study section').forEach(section => {
      animationObserver.observe(section);
    });
  }
  
  // Stagger animation for grid items
  function staggerGridItems(container) {
    const items = container.querySelectorAll('.challenge-item, .insight-card, .result-card, .benefit, .method, .learning-card');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 150);
    });
  }
  
  // Video and media observer
  function initVideoObserver() {
    const mediaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const media = entry.target.querySelector(".overlay-media");
        if (!media) return;
        
        if (entry.isIntersecting) {
          entry.target.classList.add("show-overlay");
          if (media.tagName === "VIDEO") {
            media.currentTime = 0;
            media.play().catch(e => console.log('Video autoplay prevented:', e));
          }
        } else {
          entry.target.classList.remove("show-overlay");
          if (media.tagName === "VIDEO") {
            media.pause();
            media.currentTime = 0;
          }
        }
      });
    }, { threshold: 0.5 });
    
    document.querySelectorAll(".ds-media").forEach(media => {
      mediaObserver.observe(media);
    });
  }
  
  // Tab system for flows section
  function initTabSystem() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        // Remove active class from all tabs and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        const targetContent = document.querySelector(`[data-tab="${targetTab}"].tab-content`);
        if (targetContent) {
          targetContent.classList.add('active');
          
          // Trigger fade-in animation for new content
          targetContent.style.opacity = '0';
          targetContent.style.transform = 'translateY(20px)';
          setTimeout(() => {
            targetContent.style.opacity = '1';
            targetContent.style.transform = 'translateY(0)';
            targetContent.style.transition = 'all 0.5s ease';
          }, 100);
        }
      });
    });
  }
  
  // Smooth scrolling for internal links
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
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
  
  // Reading progress indicator
  function initProgressIndicator() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    // Add CSS for progress bar
    const style = document.createElement('style');
    style.textContent = `
      .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(255,255,255,0.1);
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .reading-progress.show {
        opacity: 1;
      }
      
      .reading-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #EB676C, #FF8A8A);
        width: 0%;
        transition: width 0.1s ease;
      }
    `;
    document.head.appendChild(style);
    
    const progressFill = progressBar.querySelector('.reading-progress-fill');
    
    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.pageYOffset;
      const progress = (scrolled / documentHeight) * 100;
      
      progressFill.style.width = progress + '%';
      
      // Show/hide progress bar
      if (scrolled > windowHeight * 0.5) {
        progressBar.classList.add('show');
      } else {
        progressBar.classList.remove('show');
      }
    });
  }
  
  // Add hover effects to cards
  function initCardHoverEffects() {
    const cards = document.querySelectorAll('.challenge-item, .insight-card, .benefit, .method, .learning-card, .result-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }
  
  // Initialize card hover effects after a short delay
  setTimeout(initCardHoverEffects, 1000);
  
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
  
  // Performance optimization - lazy load images
  function initLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => {
      img.classList.add('lazy');
      imageObserver.observe(img);
    });
    
    // Add CSS for lazy loading
    const lazyStyle = document.createElement('style');
    lazyStyle.textContent = `
      .lazy {
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      
      .lazy.loaded {
        opacity: 1;
      }
    `;
    document.head.appendChild(lazyStyle);
  }
  
  initLazyLoading();
  
  // Add keyboard navigation
  function initKeyboardNavigation() {
    const focusableElements = document.querySelectorAll('a, button, .tab-btn');
    let currentFocus = 0;
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        
        if (e.shiftKey) {
          currentFocus = currentFocus <= 0 ? focusableElements.length - 1 : currentFocus - 1;
        } else {
          currentFocus = currentFocus >= focusableElements.length - 1 ? 0 : currentFocus + 1;
        }
        
        if (focusableElements[currentFocus]) {
          focusableElements[currentFocus].focus();
          
          // Add visual focus indicator
          focusableElements[currentFocus].style.outline = '2px solid #EB676C';
          focusableElements[currentFocus].style.outlineOffset = '2px';
        }
      }
      
      // Remove focus outline on click
      if (e.type === 'click') {
        e.target.style.outline = '';
      }
    });
  }
  
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
  
  // Add section navigation dots
  function initSectionDots() {
    const sections = document.querySelectorAll('.case-study section');
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'section-dots';
    document.body.appendChild(dotsContainer);
    
    // Add CSS for section dots
    const dotsStyle = document.createElement('style');
    dotsStyle.textContent = `
      .section-dots {
        position: fixed;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      
      .section-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
      }
      
      .section-dot.active {
        background: #EB676C;
        transform: scale(1.3);
      }
      
      .section-dot:hover {
        background: #EB676C;
        transform: scale(1.2);
      }
      
      .section-dot::before {
        content: attr(data-tooltip);
        position: absolute;
        right: 25px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        pointer-events: none;
      }
      
      .section-dot:hover::before {
        opacity: 1;
        visibility: visible;
      }
      
      @media (max-width: 768px) {
        .section-dots {
          display: none;
        }
      }
    `;
    document.head.appendChild(dotsStyle);
    
    // Create dots for each section
    const sectionTitles = ['Intro', 'Challenge', 'Research', 'Impact', 'Flows', 'Design System', 'Animation', 'Guest Mode', 'Testing', 'Learnings', 'Results'];
    
    sections.forEach((section, index) => {
      const dot = document.createElement('div');
      dot.className = 'section-dot';
      dot.setAttribute('data-tooltip', sectionTitles[index] || `Section ${index + 1}`);
      
      dot.addEventListener('click', () => {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      
      dotsContainer.appendChild(dot);
    });
    
    // Update active dot on scroll
    const dotObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const index = Array.from(sections).indexOf(entry.target);
        const dot = dotsContainer.children[index];
        
        if (entry.isIntersecting) {
          document.querySelectorAll('.section-dot').forEach(d => d.classList.remove('active'));
          if (dot) dot.classList.add('active');
        }
      });
    }, { threshold: 0.5 });
    
    sections.forEach(section => dotObserver.observe(section));
  }
  
  initSectionDots();
  
  // Add loading screen
  function initLoadingScreen() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-logo">SPORTSCOVE</div>
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
  
});