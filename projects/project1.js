// project1.js - Redesigned for Story Style with Design Decisions

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
  
  // Section reveal animations - FIXED
  const sections = document.querySelectorAll('.project-section');
  
  const observerOptions = {
    threshold: 0.05, // FIXED: Changed from 0.2 to 0.05 for earlier trigger
    rootMargin: '0px 0px -50px 0px' // FIXED: Reduced from -100px
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
  
  // FORCE VISIBILITY FOR DESIGN DECISIONS SECTION - EMERGENCY FIX
  setTimeout(() => {
    const designSection = document.querySelector('.design-decisions-section');
    if (designSection) {
      designSection.classList.add('visible');
      designSection.style.opacity = '1';
      designSection.style.transform = 'translateY(0)';
    }
  }, 100);
  
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
  
  // Video autoplay on scroll
  const videos = document.querySelectorAll('.animation-video');
  
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      
      if (entry.isIntersecting) {
        video.play().catch(e => console.log('Video autoplay prevented:', e));
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, { threshold: 0.5 });
  
  videos.forEach(video => {
    videoObserver.observe(video);
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
  
  // Add stagger animation to problem items
  const problemItems = document.querySelectorAll('.problem-item');
  
  const problemObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.problem-item');
        items.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            item.style.transition = 'all 0.5s ease';
          }, index * 150);
        });
      }
    });
  }, { threshold: 0.3 });
  
  const problemList = document.querySelector('.problem-list');
  if (problemList) {
    // Set initial state
    problemItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
    });
    problemObserver.observe(problemList);
  }
  
  // Add stagger animation to approach steps
  const approachSteps = document.querySelectorAll('.approach-step');
  
  const approachObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const steps = entry.target.querySelectorAll('.approach-step');
        steps.forEach((step, index) => {
          setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
            step.style.transition = 'all 0.5s ease';
          }, index * 150);
        });
      }
    });
  }, { threshold: 0.3 });
  
  const approachContainer = document.querySelector('.approach-steps');
  if (approachContainer) {
    // Set initial state
    approachSteps.forEach(step => {
      step.style.opacity = '0';
      step.style.transform = 'translateY(20px)';
    });
    approachObserver.observe(approachContainer);
  }
  
  // Metric counter animation
  const metricValues = document.querySelectorAll('.metric-value');
  let hasAnimated = false;
  
  const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        
        metricValues.forEach(metric => {
          const text = metric.textContent;
          
          // Only animate numeric values
          if (text.includes('%')) {
            const target = parseInt(text);
            let count = 0;
            const increment = target / 50;
            
            const interval = setInterval(() => {
              count += increment;
              if (count >= target) {
                metric.textContent = text;
                clearInterval(interval);
              } else {
                metric.textContent = Math.floor(count) + '%';
              }
            }, 30);
          }
        });
      }
    });
  }, { threshold: 0.5 });
  
  const metricsGrid = document.querySelector('.metrics-grid');
  if (metricsGrid) {
    metricObserver.observe(metricsGrid);
  }
  
  // Design Decision Blocks Animation - FIXED
  const decisionBlocks = document.querySelectorAll('.design-decision-block');
  
  const decisionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // FIXED: Set visible immediately
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    });
  }, { threshold: 0.05 }); // FIXED: Lower threshold
  
  decisionBlocks.forEach(block => {
    block.style.opacity = '1'; // FIXED: Start visible
    block.style.transform = 'translateY(0)'; // FIXED: No offset
    decisionObserver.observe(block);
  });
  
  // Animate notification categories on scroll
  const notificationCategories = document.querySelectorAll('.notification-category');
  
  const categoryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const categories = entry.target.parentElement.querySelectorAll('.notification-category');
        categories.forEach((cat, index) => {
          setTimeout(() => {
            cat.style.opacity = '1';
            cat.style.transform = 'translateY(0)';
            cat.style.transition = 'all 0.5s ease';
          }, index * 100);
        });
      }
    });
  }, { threshold: 0.3 });
  
  const notificationGrid = document.querySelector('.notification-categories');
  if (notificationGrid) {
    notificationCategories.forEach(cat => {
      cat.style.opacity = '0';
      cat.style.transform = 'translateY(20px)';
    });
    categoryObserver.observe(notificationGrid);
  }
  
  // FIXED: Criteria items are now always visible (no animation) - this was causing the gap
  // Animation code removed to prevent opacity: 0 issue
  
  // Animate final notifications
  const notificationItems = document.querySelectorAll('.notification-item');
  
  const notificationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.parentElement.querySelectorAll('.notification-item');
        items.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
            item.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
          }, index * 100);
        });
      }
    });
  }, { threshold: 0.5 });
  
  const finalNotifications = document.querySelector('.final-notifications');
  if (finalNotifications) {
    notificationItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'scale(0.8)';
    });
    notificationObserver.observe(finalNotifications);
  }
  
  // Animate outcome items
  const outcomeItems = document.querySelectorAll('.outcome-item');
  
  const outcomeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.outcome-item');
        items.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            item.style.transition = 'all 0.5s ease';
          }, index * 120);
        });
      }
    });
  }, { threshold: 0.3 });
  
  document.querySelectorAll('.outcome-grid').forEach(grid => {
    const items = grid.querySelectorAll('.outcome-item');
    items.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
    });
    outcomeObserver.observe(grid);
  });
  
  // Animate update badges
  const updateBadges = document.querySelectorAll('.update-badge');
  
  const badgeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const badges = entry.target.querySelectorAll('.update-badge');
        badges.forEach((badge, index) => {
          setTimeout(() => {
            badge.style.opacity = '1';
            badge.style.transform = 'translateY(0)';
            badge.style.transition = 'all 0.4s ease';
          }, index * 80);
        });
      }
    });
  }, { threshold: 0.5 });
  
  const contextualUpdates = document.querySelector('.contextual-updates');
  if (contextualUpdates) {
    updateBadges.forEach(badge => {
      badge.style.opacity = '1';
      badge.style.transform = 'translateY(10px)';
    });
    badgeObserver.observe(contextualUpdates);
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
  const images = document.querySelectorAll('.solution-image, .final-image');
  
  images.forEach(img => {
    img.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.02)';
      img.style.transition = 'transform 0.3s ease';
    });
    
    img.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });
  });
  
  // Smooth reveal for highlight sections
  const highlightSections = document.querySelectorAll('.highlight-section');
  
  const highlightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'scale(1)';
        entry.target.style.transition = 'all 0.6s ease';
      }
    });
  }, { threshold: 0.3 });
  
  highlightSections.forEach(section => {
    highlightObserver.observe(section);
  });
  
  // Add pulse effect to decision icons on scroll
  const decisionIcons = document.querySelectorAll('.decision-icon');
  
  const iconObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'pulse 0.6s ease';
        
        setTimeout(() => {
          entry.target.style.animation = '';
        }, 600);
      }
    });
  }, { threshold: 0.8 });
  
  decisionIcons.forEach(icon => {
    iconObserver.observe(icon);
  });
  
  // Add CSS animation keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
  
  // Reading time estimator
  const content = document.querySelector('.project-content');
  if (content) {
    const text = content.innerText;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    console.log(`📖 Estimated reading time: ${readingTime} minutes`);
    console.log(`📝 Word count: ${wordCount} words`);
  }
  
  // Log design decisions section stats
  const decisionSections = document.querySelectorAll('.design-decision-block');
  if (decisionSections.length > 0) {
    console.log(`🎯 Design decisions documented: ${decisionSections.length}`);
    
    decisionSections.forEach((block, index) => {
      const title = block.querySelector('.decision-title-wrapper h3');
      if (title) {
        console.log(`   ${index + 1}. ${title.textContent.trim()}`);
      }
    });
  }
  
  console.log('✨ Sportscove project page loaded');
  console.log('🎯 Focus: UX design process, problem-solving, and key design decisions');
  
});