// Create animated neural network background
function createNeuralNetwork() {
  const network = document.getElementById('neural-network');
  const nodeCount = 20;
  
  for (let i = 0; i < nodeCount; i++) {
    const node = document.createElement('div');
    node.className = 'node';
    node.style.left = Math.random() * 100 + '%';
    node.style.top = Math.random() * 100 + '%';
    node.style.animationDelay = Math.random() * 3 + 's';
    network.appendChild(node);
    
    // Create connections
    if (i < nodeCount - 1) {
      const connection = document.createElement('div');
      connection.className = 'connection';
      connection.style.left = Math.random() * 100 + '%';
      connection.style.top = Math.random() * 100 + '%';
      connection.style.width = Math.random() * 200 + 50 + 'px';
      connection.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      connection.style.animationDelay = Math.random() * 4 + 's';
      network.appendChild(connection);
    }
  }
}

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

// Add hover effects to cards
function initCardHoverEffects() {
  const cards = document.querySelectorAll('.overview-card, .finding-card, .feature-item');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}


// Counter animation for statistics
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const text = target.textContent;
        const number = parseInt(text.replace(/[^\d]/g, ''));
        
        if (number && !target.hasAttribute('data-animated')) {
          target.setAttribute('data-animated', 'true');
          let current = 0;
          const increment = number / 30;
          const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
              current = number;
              clearInterval(timer);
            }
            target.textContent = text.replace(number.toString(), Math.floor(current).toString());
          }, 50);
        }
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}


// Add floating animation to background nodes
function addFloatingAnimation() {
  const nodes = document.querySelectorAll('.node');
  nodes.forEach((node, index) => {
    const duration = 8000 + (index * 200);
    const delay = index * 100;
    
    node.style.animation += `, float ${duration}ms ${delay}ms ease-in-out infinite`;
  });
}

// Loading animation
function initLoadingAnimation() {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
}

// Scroll progress indicator
function createScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #EB676C, #ff8a8f);
    z-index: 1000;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = Math.min(scrollPercent, 100) + '%';
  });
}

// Intersection observer for timeline items
function animateTimeline() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, index * 200);
      }
    });
  }, { threshold: 0.3 });

  timelineItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);
  });
}

// VR showcase rotation effect
function initVRShowcaseEffect() {
  const showcase = document.querySelector('.vr-showcase');
  if (showcase) {
    showcase.addEventListener('mousemove', (e) => {
      const rect = showcase.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * 5;
      const rotateY = (x - centerX) / centerX * 5;
      
      showcase.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    showcase.addEventListener('mouseleave', () => {
      showcase.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }
}

// Glitch effect for title
function addGlitchEffect() {
  const title = document.querySelector('.hero h1');
  if (title) {
    title.addEventListener('mouseenter', () => {
      title.style.animation = 'glitch 0.5s ease-in-out';
    });
    
    title.addEventListener('animationend', () => {
      title.style.animation = 'slideUp 1s ease-out';
    });
  }
  
  // Add glitch keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glitch {
      0%, 100% { transform: translateX(0); }
      10% { transform: translateX(-2px) skewX(-2deg); }
      20% { transform: translateX(2px) skewX(2deg); }
      30% { transform: translateX(-1px) skewX(-1deg); }
      40% { transform: translateX(1px) skewX(1deg); }
      50% { transform: translateX(-2px) skewX(-2deg); }
      60% { transform: translateX(2px) skewX(2deg); }
      70% { transform: translateX(-1px) skewX(-1deg); }
      80% { transform: translateX(1px) skewX(1deg); }
      90% { transform: translateX(-2px) skewX(-2deg); }
    }
  `;
  document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initLoadingAnimation();
  createNeuralNetwork();
  initScrollAnimations();
  initParallax();
  initSmoothScroll();
  initCardHoverEffects();
  initTypingEffect();
  animateTimeline();
  initVRShowcaseEffect();
  addGlitchEffect();
  createScrollProgress();
  
  // Initialize counter animations after a delay
  setTimeout(animateCounters, 1000);
  
  // Add floating animation to neural network after initial load
  setTimeout(addFloatingAnimation, 2000);
});

// Add to your existing script.js file

// Method Flow Interactive Steps
function initMethodFlowInteraction() {
  const flowSteps = document.querySelectorAll('.flow-step');
  const sections = {
    'Literature Review': '.foundation',
    'User Interviews': '.methodology .interviews-section',
    'VR Development': '.technical-implementation',
    'Testing & Analysis': '.testing-results'
  };
  
  flowSteps.forEach(step => {
    step.style.cursor = 'pointer';
    step.addEventListener('click', () => {
      // Remove active class from all steps
      flowSteps.forEach(s => s.classList.remove('active'));
      // Add active class to clicked step
      step.classList.add('active');
      
      // Scroll to corresponding section
      const stepText = step.textContent.trim();
      const targetSelector = sections[stepText];
      const targetSection = document.querySelector(targetSelector);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Add this to your DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
  // ... your existing initialization code ...
  initMethodFlowInteraction();
});


