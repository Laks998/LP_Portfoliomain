document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script loaded!");

  // ========== LOTTIE ANIMATION ==========
  const animationContainer = document.getElementById('lottie-animation');
  
  if (animationContainer) {
    lottie.loadAnimation({
      container: animationContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/data.json'
    });
  }

  // ========== SCROLL INDICATOR ==========
  const scrollIndicator = document.querySelector('.scroll-indicator');
  
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const workSection = document.querySelector('#work');
      if (workSection) {
        workSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ========== NAVIGATION ACTIVE STATE ==========
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
  if (currentPath.includes("timeline.html")) {
    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes("timeline")) {
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

  // ========== CARD → FULLSCREEN TRANSITION ==========
  const projectCards = document.querySelectorAll('.project-card');

  // Add staggered fade-in animation
  projectCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 * index);
  });

  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();

      const rect = card.getBoundingClientRect();
      const scrollY = window.scrollY;

      const clone = card.cloneNode(true);
      clone.classList.add('project-card-clone');

      // Style the clone
      clone.style.position = 'absolute';
      clone.style.top = (rect.top + scrollY) + 'px';
      clone.style.left = rect.left + 'px';
      clone.style.width = rect.width + 'px';
      clone.style.height = rect.height + 'px';
      clone.style.margin = '0';
      clone.style.zIndex = '9999';
      clone.style.transition = 'all 0.9s ease-in-out';

      // Optional transparent overlay
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.zIndex = '9998';
      overlay.style.background = 'transparent';
      overlay.style.pointerEvents = 'none';

      document.body.appendChild(overlay);
      document.body.appendChild(clone);

      // Animate to full screen
      requestAnimationFrame(() => {
        clone.style.top = scrollY + 'px';
        clone.style.left = '0';
        clone.style.width = '100vw';
        clone.style.height = '100vh';
      });

      // Navigate after animation
      setTimeout(() => {
        const projectId = card.getAttribute('data-project');
        window.location.href = `projects/${projectId}.html`;
      }, 1000);
    });
  });

  // ========== CATEGORY FILTERING ==========
  const categoryBtns = document.querySelectorAll('.category-btn');
  const allProjectCards = document.querySelectorAll('.project-card');

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;

      // Update active button
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide projects based on category
      allProjectCards.forEach(card => {
        if (card.classList.contains(`category-${category}`)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

});