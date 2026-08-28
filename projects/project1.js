// project0-enhanced.js - Comprehensive Quippy Extension Portfolio Page

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
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
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
  
  // Parallax effect for hero image/video
  const heroMedia = document.querySelector('.hero-image');
  
  if (heroMedia) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      if (scrolled < window.innerHeight) {
        heroMedia.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroMedia.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
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
  
  // Add hover effects to images and videos
  const mediaElements = document.querySelectorAll('.screen img, .screen-video, .userflow-image-wrapper img, .design-system-image img');
  
  mediaElements.forEach(media => {
    media.addEventListener('mouseenter', () => {
      media.style.transform = 'scale(1.02)';
      media.style.transition = 'transform 0.3s ease';
    });
    
    media.addEventListener('mouseleave', () => {
      media.style.transform = 'scale(1)';
    });
  });
  
  // Insight cards animation
  const insightCards = document.querySelectorAll('.insight-card');
  
  insightCards.forEach((card, index) => {
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
  
  // UX Principle cards animation
  const uxPrinciples = document.querySelectorAll('.ux-principle');
  
  uxPrinciples.forEach((card, index) => {
    const principleObserver = new IntersectionObserver((entries) => {
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
    
    principleObserver.observe(card);
  });
  
  // Flow steps animation
  const flowSteps = document.querySelectorAll('.flow-step');
  
  flowSteps.forEach((step, index) => {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
            entry.target.style.transition = 'all 0.5s ease';
          }, index * 100);
        }
      });
    }, { threshold: 0.5 });
    
    stepObserver.observe(step);
  });
  
  // Feature cards detailed animation
  const featureCardsDetailed = document.querySelectorAll('.feature-card-detailed');
  
  featureCardsDetailed.forEach((card, index) => {
    const featureObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'all 0.5s ease';
          }, index * 60);
        }
      });
    }, { threshold: 0.3 });
    
    featureObserver.observe(card);
  });
  
  // Issues found animation
  const foundIssues = document.querySelectorAll('.found-issue');
  
  foundIssues.forEach((issue, index) => {
    const issueObserver = new IntersectionObserver((entries) => {
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
    
    issueObserver.observe(issue);
  });
  
  // Learning items animation
  const learningItems = document.querySelectorAll('.learning-item');
  
  learningItems.forEach((item, index) => {
    const learningObserver = new IntersectionObserver((entries) => {
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
    
    learningObserver.observe(item);
  });
  
  // Future items animation
  const futureItems = document.querySelectorAll('.future-item');
  
  futureItems.forEach((item, index) => {
    const futureObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'all 0.5s ease';
          }, index * 60);
        }
      });
    }, { threshold: 0.5 });
    
    futureObserver.observe(item);
  });
  
  // Metric cards animation
  const metricCards = document.querySelectorAll('.metric-card');
  
  metricCards.forEach((card, index) => {
    const metricObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
            entry.target.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
          }, index * 100);
        }
      });
    }, { threshold: 0.5 });
    
    metricObserver.observe(card);
  });
  
  // Design decision cards fade in
  const designDecisionCards = document.querySelectorAll('.design-decision-card');
  
  designDecisionCards.forEach((card) => {
    const decisionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.transition = 'all 0.6s ease';
        }
      });
    }, { threshold: 0.3 });
    
    decisionObserver.observe(card);
  });
  
  // IA items animation
  const iaItems = document.querySelectorAll('.ia-item');
  
  iaItems.forEach((item, index) => {
    const iaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
            entry.target.style.transition = 'all 0.5s ease';
          }, index * 100);
        }
      });
    }, { threshold: 0.5 });
    
    iaObserver.observe(item);
  });
  
  // Tech items animation
  const techItems = document.querySelectorAll('.tech-item');
  
  techItems.forEach((item, index) => {
    const techObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
            entry.target.style.transition = 'all 0.4s ease';
          }, index * 60);
        }
      });
    }, { threshold: 0.5 });
    
    techObserver.observe(item);
  });
  
  // Design category fade in
  const designCategories = document.querySelectorAll('.design-category');
  
  designCategories.forEach((category) => {
    const categoryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.transition = 'all 0.6s ease';
        }
      });
    }, { threshold: 0.2 });
    
    categoryObserver.observe(category);
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
  
  // Live badge pulse animation
  const liveBadge = document.querySelector('.live-badge');
  if (liveBadge) {
    setInterval(() => {
      liveBadge.style.transform = 'scale(1.05)';
      setTimeout(() => {
        liveBadge.style.transform = 'scale(1)';
      }, 200);
    }, 3000);
  }
  
  // CTA button hover effect
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('mouseenter', () => {
      ctaButton.style.transform = 'translateY(-4px) scale(1.05)';
    });
    
    ctaButton.addEventListener('mouseleave', () => {
      ctaButton.style.transform = 'translateY(0) scale(1)';
    });
  }
  
  console.log('✨ Enhanced Quippy project page loaded');
  console.log('🎯 Focus: Comprehensive UX/UI case study');
  console.log('🎨 Status: Live on Chrome Web Store');
  console.log('📊 Sections: Research, UX Strategy, Design System, Development, Testing, Impact');
  
});