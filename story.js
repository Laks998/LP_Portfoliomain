document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Story script loaded!");

  // ========== HAMBURGER MENU TOGGLE - EXACT FROM INDEX ==========
  const hamburger = document.getElementById('hamburger');
  const sideNav = document.getElementById('sideNav');
  const navLinks = document.querySelectorAll('.side-nav a');

  if (hamburger && sideNav) {
    // Toggle hamburger menu
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      sideNav.classList.toggle('active');
      document.body.style.overflow = sideNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        sideNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!sideNav.contains(e.target) && !hamburger.contains(e.target) && sideNav.classList.contains('active')) {
        hamburger.classList.remove('active');
        sideNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ========== PROGRESS BAR ==========
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

  // ========== NAVIGATION ACTIVE STATE - EXACT FROM INDEX ==========
  const allNavLinks = document.querySelectorAll(".side-nav a");
  const currentPath = window.location.pathname;

  // About page case
  if (currentPath.includes("about.html")) {
    allNavLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes("about")) {
        link.classList.add("active");
      }
    });
    return;
  }

  // Story page case
  if (currentPath.includes("story.html")) {
    allNavLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes("story")) {
        link.classList.add("active");
      }
    });
    return;
  }

  // ========== SMOOTH SCROLL FOR TIMELINE ==========
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }
    });
  }, observerOptions);
  
  timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });

  // ========== SKILL HOVER EFFECTS ==========
  const skills = document.querySelectorAll('.skill');
  
  skills.forEach(skill => {
    skill.addEventListener('mouseenter', () => {
      skill.style.transform = 'translateY(-3px)';
    });
    
    skill.addEventListener('mouseleave', () => {
      skill.style.transform = 'translateY(0)';
    });
  });

});