// project4.js - VR Experience Design

document.addEventListener('DOMContentLoaded', () => {
  
  // Progress bar
  const progressBar = document.querySelector('.read-progress');
  
  function updateProgressBar() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    
    progressBar.style.width = `${scrollPercent}%`;
  }
  
  window.addEventListener('scroll', updateProgressBar);
  updateProgressBar();
  
  // Section reveal animations
  const sections = document.querySelectorAll('.project-section');
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
  
  // Smooth scroll for anchor links
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
  
  // Parallax effect for hero image
  const heroImage = document.querySelector('.hero-image');
  
  if (heroImage) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      if (scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroImage.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
      }
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
    } else if (e.key === 'Home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (e.key === 'End') {
      e.preventDefault();
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  });
  
  // Add hover effects to images
  const images = document.querySelectorAll('.flow-image img, .unity-showcase img, .movie-poster img, .concept-image');
  
  images.forEach(img => {
    img.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.02)';
      img.style.transition = 'transform 0.3s ease';
    });
    
    img.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });
  });
  
  // Finding cards staggered animation
  const findingCards = document.querySelectorAll('.finding-card');
  
  findingCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          }, index * 100);
        }
      });
    }, { threshold: 0.3 });
    
    cardObserver.observe(card);
  });
  
  // Result metrics animation
  const resultMetrics = document.querySelectorAll('.result-metric');
  
  resultMetrics.forEach((metric, index) => {
    metric.style.opacity = '0';
    metric.style.transform = 'translateY(20px)';
    
    const metricObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'all 0.5s ease';
          }, index * 80);
        }
      });
    }, { threshold: 0.5 });
    
    metricObserver.observe(metric);
  });
  
  // Flow cards animation
  const flowCards = document.querySelectorAll('.flow-card');
  
  flowCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    const flowObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'all 0.5s ease';
          }, index * 100);
        }
      });
    }, { threshold: 0.3 });
    
    flowObserver.observe(card);
  });
  
  // Movie cards animation
  const movieCards = document.querySelectorAll('.movie-card');
  
  movieCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateX(-30px)';
    
    const movieObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
            entry.target.style.transition = 'all 0.6s ease';
          }, index * 150);
        }
      });
    }, { threshold: 0.2 });
    
    movieObserver.observe(card);
  });
  
  // Takeaway cards animation
  const takeawayCards = document.querySelectorAll('.takeaway-card');
  
  takeawayCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    const takeawayObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'all 0.5s ease';
          }, index * 80);
        }
      });
    }, { threshold: 0.3 });
    
    takeawayObserver.observe(card);
  });
  
  // Validation cards animation
  const validationCards = document.querySelectorAll('.validation-item');
  
  validationCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    const validationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'all 0.5s ease';
          }, index * 100);
        }
      });
    }, { threshold: 0.3 });
    
    validationObserver.observe(card);
  });
  
  // Framework blocks animation
  const frameworkBlocks = document.querySelectorAll('.framework-block');
  
  frameworkBlocks.forEach((block, index) => {
    block.style.opacity = '0';
    block.style.transform = 'translateY(20px)';
    
    const frameworkObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'all 0.6s ease';
          }, index * 120);
        }
      });
    }, { threshold: 0.2 });
    
    frameworkObserver.observe(block);
  });
  
  // Impact cards animation
  const impactCards = document.querySelectorAll('.impact-card');
  
  impactCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    
    const impactObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
            entry.target.style.transition = 'all 0.5s ease';
          }, index * 80);
        }
      });
    }, { threshold: 0.3 });
    
    impactObserver.observe(card);
  });
  
  // Counter animation for stats
  const statNumbers = document.querySelectorAll('.stat-number, .metric-number');
  
  const animateCounter = (element) => {
    const text = element.textContent;
    // Handle cases like "100%" or "5-7" or "2-3" or "80%"
    if (text.includes('%')) {
      const target = parseInt(text);
      let current = 0;
      const increment = target / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '%';
      }, 50);
    } else if (!text.includes('-') && !isNaN(parseInt(text))) {
      const target = parseInt(text);
      let current = 0;
      const increment = target / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current);
      }, 50);
    }
  };
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
        entry.target.setAttribute('data-animated', 'true');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach(stat => {
    statsObserver.observe(stat);
  });
  
  // Challenge items animation
  const challengeItems = document.querySelectorAll('.challenge-item');
  
  challengeItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    
    const challengeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'all 0.5s ease';
          }, index * 100);
        }
      });
    }, { threshold: 0.3 });
    
    challengeObserver.observe(item);
  });
  
  // Process stages animation
  const processStages = document.querySelectorAll('.process-stage');
  
  processStages.forEach((stage, index) => {
    stage.style.opacity = '0';
    stage.style.transform = 'translateX(-30px)';
    
    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
            entry.target.style.transition = 'all 0.6s ease';
          }, index * 150);
        }
      });
    }, { threshold: 0.3 });
    
    processObserver.observe(stage);
  });
  
  // Tech items animation
  const techItems = document.querySelectorAll('.tech-item');
  
  techItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    
    const techObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'all 0.5s ease';
          }, index * 100);
        }
      });
    }, { threshold: 0.3 });
    
    techObserver.observe(item);
  });
  
  // Pilot cards animation
  const pilotCards = document.querySelectorAll('.pilot-card');
  
  pilotCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    const pilotObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'all 0.5s ease';
          }, index * 100);
        }
      });
    }, { threshold: 0.3 });
    
    pilotObserver.observe(card);
  });
  
  // Reading time estimator
  const content = document.querySelector('.project-content');
  if (content) {
    const text = content.innerText;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    console.log(`📖 Estimated reading time: ${readingTime} minutes`);
    console.log(`📝 Word count: ${wordCount} words`);
  }
  
  // Log project load
  console.log('✨ VR Experience Design project loaded');
  console.log('🎯 Research → Design → Build → Test → Framework');
  
});