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
  
  // Section reveal animations
  const sections = document.querySelectorAll('.project-section');
  
  const observerOptions = {
    threshold: 0.05,
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
  
  // Video autoplay on scroll — every video in the project (hero excluded, it
  // already autoplays via the autoplay attribute in HTML). Videos play when
  // they scroll into view and pause + reset when they scroll out. This
  // includes the two Additional-stuff-I-did-because-I-wanted-to videos
  // (splash screen + spinner loader), since they reuse the same
  // .autoplay-video class as every other video on the page.
  const videos = document.querySelectorAll('.animation-video, .autoplay-video');
  
  videos.forEach(video => {
    video.muted = true; // required for browsers to allow programmatic autoplay
  });
  
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
  }, { threshold: 0.4 });
  
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
  
  // Add stagger animation to risk items (Four Problems section)
  const riskItems = document.querySelectorAll('.risk-item');

  const riskObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.risk-item');
        items.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            item.style.transition = 'all 0.5s ease';
          }, index * 150);
        });
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  const risksList = document.querySelector('.risks-list');
  if (risksList) {
    riskItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
    });
    riskObserver.observe(risksList);
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
  const images = document.querySelectorAll('.solution-image');
  
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

// Lightbox — click any solution/final/option image, or any element with
// [data-lightbox-trigger] (e.g. the "view questionnaire" link), to view an
// enlarged image.
document.addEventListener('DOMContentLoaded', () => {

  const zoomableImages = document.querySelectorAll('.solution-image, .option-card-image');
  const lightboxLinks = document.querySelectorAll('[data-lightbox-trigger]');
  if (zoomableImages.length === 0 && lightboxLinks.length === 0) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<img src="" alt=""><button class="lightbox-close" aria-label="Close">&times;</button>';
  document.body.appendChild(overlay);

  const overlayImg = overlay.querySelector('img');
  const closeBtn = overlay.querySelector('.lightbox-close');

  function openLightbox(src, alt) {
    overlayImg.src = src;
    overlayImg.alt = alt || '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  zoomableImages.forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  // Links (e.g. "View the original questionnaire") open their href as an
  // image in the same lightbox instead of navigating away.
  lightboxLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(link.href, link.textContent.trim());
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === closeBtn) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

});