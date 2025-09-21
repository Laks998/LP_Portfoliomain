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

// Intersection Observer for scroll animations
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

// Parallax effect for hero
function initParallax() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });
}

// Smooth scroll for navigation
function initSmoothScroll() {
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

// Add typing effect to hero subtitle
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Initialize typing effect
function initTypingEffect() {
  setTimeout(() => {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
      const originalText = subtitle.textContent;
      typeWriter(subtitle, originalText, 80);
    }
  }, 1500);
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