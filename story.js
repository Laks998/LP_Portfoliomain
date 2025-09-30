// story.js - UX Journey Focus

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
  
  // Journey steps reveal on scroll
  const journeySteps = document.querySelectorAll('.journey-step');
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  journeySteps.forEach(step => {
    stepObserver.observe(step);
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
  
  // Interactive skill tags
  const skillTags = document.querySelectorAll('.skill-tag');
  
  skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.style.transform = 'translateY(-3px)';
      tag.style.boxShadow = '0 4px 12px rgba(235, 103, 108, 0.2)';
    });
    
    tag.addEventListener('mouseleave', () => {
      tag.style.transform = 'translateY(0)';
      tag.style.boxShadow = 'none';
    });
  });
  
  // Step numbers pulse on scroll into view
  const stepNumbers = document.querySelectorAll('.step-number');
  
  const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
          entry.target.style.animation = 'none';
        }, 600);
      }
    });
  }, { threshold: 0.5 });
  
  stepNumbers.forEach(number => {
    numberObserver.observe(number);
  });
  
  // Add pulse animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `;
  document.head.appendChild(style);
  
  // Insight boxes highlight on scroll
  const insightBoxes = document.querySelectorAll('.insight-box');
  
  const insightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'translateX(10px)';
        entry.target.style.transition = 'transform 0.5s ease';
        setTimeout(() => {
          entry.target.style.transform = 'translateX(0)';
        }, 500);
      }
    });
  }, { threshold: 0.5 });
  
  insightBoxes.forEach(box => {
    insightObserver.observe(box);
  });
  
  // Education topics animation
  const topics = document.querySelectorAll('.topic');
  
  topics.forEach((topic, index) => {
    topic.style.opacity = '0';
    topic.style.transform = 'translateY(20px)';
    
    const topicObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'all 0.5s ease';
          }, index * 100);
        }
      });
    }, { threshold: 0.5 });
    
    topicObserver.observe(topic);
  });
  
  // Why box special entrance
  const whyBox = document.querySelector('.why-box');
  
  if (whyBox) {
    const whyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'scale(0.95)';
          
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
            entry.target.style.transition = 'all 0.6s ease';
          }, 200);
        }
      });
    }, { threshold: 0.3 });
    
    whyObserver.observe(whyBox);
  }
  
  // Reading time estimator (optional)
  const content = document.querySelector('.story-wrapper');
  if (content) {
    const text = content.innerText;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed
    
    console.log(`Estimated reading time: ${readingTime} minutes`);
  }
  
  // Parallax effect for hero
  const hero = document.querySelector('.story-hero');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (hero && scrolled < window.innerHeight) {
      hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
      hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });
  
  // Keyboard navigation
  let currentStep = 0;
  const steps = document.querySelectorAll('.journey-step');
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentStep = Math.min(currentStep + 1, steps.length - 1);
      steps[currentStep].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentStep = Math.max(currentStep - 1, 0);
      steps[currentStep].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  
  // Update current step based on scroll position
  window.addEventListener('scroll', () => {
    steps.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top >= 0 && rect.top <= windowHeight / 2) {
        currentStep = index;
      }
    });
  });
  
  // Add smooth transitions for all interactive elements
  const interactiveElements = document.querySelectorAll('.skill-tag, .topic, .insight-box');
  
  interactiveElements.forEach(element => {
    element.style.transition = 'all 0.3s ease';
  });
  
  // Console message
  console.log('📖 Story loaded successfully!');
  console.log('💡 Use arrow keys to navigate between steps');
  
});

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".side-nav a");
    const currentPath = window.location.pathname;

    // About page case
    if (currentPath.includes("about.html")) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes("about")) {
          link.classList.add("active");
        }
      });
      return;
    }

    // Timeline page case
    if (currentPath.includes("story.html")) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes("story")) {
          link.classList.add("active");
        }
      });
      return;
    }

    // Scroll sections
    const sections = {
      hero: document.querySelector("#hero"),
      work: document.querySelector("#work"),
    };

    function getActiveSection() {
      const scrollY = window.scrollY + window.innerHeight / 2;
      const workTop = sections.work.offsetTop;
      return scrollY >= workTop ? "work" : "hero";
    }

    function updateActiveNav() {
      const activeId = getActiveSection();
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${activeId}`) {
          link.classList.add("active");
        }
      });
    }

    updateActiveNav();
    window.addEventListener("scroll", updateActiveNav);
  });