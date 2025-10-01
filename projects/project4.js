// project4.js - UX-focused version

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
  const images = document.querySelectorAll('.flow-image img, .unity-showcase img');
  
  images.forEach(img => {
    img.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.02)';
      img.style.transition = 'transform 0.3s ease';
    });
    
    img.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });
  });
  
  // Insight cards animation
  const insightCards = document.querySelectorAll('.insight-card');
  
  insightCards.forEach((card, index) => {
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
  
  // Counter animation for stats
  const statNumbers = document.querySelectorAll('.stat-number, .metric-number');
  
  const animateCounter = (element) => {
    const text = element.textContent;
    // Handle cases like "100%" or "5-7" or "2-3"
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
  
  // Reading time estimator
  const content = document.querySelector('.project-content');
  if (content) {
    const text = content.innerText;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    console.log(`📖 Estimated reading time: ${readingTime} minutes`);
    console.log(`📝 Word count: ${wordCount} words`);
  }
  
  console.log('✨ VR Experience Design project loaded');
  console.log('🎯 UX research → design → test → iterate');
  
});