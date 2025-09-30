document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script loaded!");

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

  // ========== BALL INTERACTIONS ==========
  const ball = document.getElementById("ball");
  const instruction = document.getElementById("instruction");

  let moveCount = 0;
  let clickEnabled = false;
  let lastMoveTime = 0;
  let movementAllowed = false;
  let ballExpanded = false;
  let arrowReady = false;

  const messages = ["Too slow", "Nope", "You're getting there", "Okay, this is sad"];

  ball.style.display = "flex";
  instruction.textContent = "View";

  setTimeout(() => {
    movementAllowed = true;
    console.log("🟢 Movement now allowed.");
  }, 500);

  function getRandomPositionAvoidingNav() {
    const navWidth = 180;
    const padding = 80;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    const maxLeft = screenW - navWidth - padding;
    const maxTop = screenH - padding;

    const randomLeft = Math.floor(Math.random() * (maxLeft - padding)) + padding;
    const randomTop = Math.floor(Math.random() * (maxTop - padding)) + padding;

    return { top: `${randomTop}px`, left: `${randomLeft}px` };
  }

  function moveBallToNextPosition() {
    const pos = moveCount < 4
      ? getRandomPositionAvoidingNav()
      : { top: "50%", left: "50%" };

    ball.style.left = pos.left;
    ball.style.top = pos.top;

    ball.style.transform = "translate(-50%, -50%) scale(1.05, 0.95)";
    setTimeout(() => {
      ball.style.transform = "translate(-50%, -50%) scale(1)";
    }, 200);

    if (moveCount < messages.length) {
      instruction.textContent = messages[moveCount];
    }

    if (moveCount >= 4) {
      instruction.textContent = "Okay, Alright!";
      clickEnabled = true;
      ball.classList.add("clickable");
    }

    moveCount++;
    lastMoveTime = Date.now();
  }

  document.addEventListener("mousemove", (e) => {
    if (!movementAllowed || clickEnabled) return;

    const now = Date.now();
    if (now - lastMoveTime < 500) return;

    const ballRect = ball.getBoundingClientRect();
    const dx = e.clientX - (ballRect.left + ballRect.width / 2);
    const dy = e.clientY - (ballRect.top + ballRect.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 80) {
      moveBallToNextPosition();
    }
  });

  ball.classList.add("bounce");
  setTimeout(() => {
    ball.classList.remove("bounce");
  }, 300);

  function dropToArrow() {
    instruction.textContent = "";
    ball.classList.remove("expanded", "clickable");
    ball.classList.add("back-to-original");

    setTimeout(() => {
      ball.classList.remove("back-to-original");

      const hero = document.getElementById("hero");
      const heroTop = hero.getBoundingClientRect().top + window.scrollY;
      const heroHeight = hero.offsetHeight;
      const ballHeight = 140;
      const padding = 30;
      const dropDistance = heroTop + heroHeight - ballHeight - padding;

      ball.style.setProperty('--dropDistance', `${dropDistance}px`);
      ball.innerHTML = "↓";
      ball.classList.add("arrow-drop");

      arrowReady = true;
      ballExpanded = false;

      ball.addEventListener("click", function scrollToWork() {
        const workSection = document.getElementById("work");
        if (workSection) {
          workSection.scrollIntoView({ behavior: "smooth" });
        }
        ball.removeEventListener("click", scrollToWork);
      });

    }, 700);
  }

  ball.addEventListener("click", () => {
    if (!clickEnabled && !arrowReady) return;

    if (!ballExpanded && !arrowReady) {
      ball.classList.add("expanded");
      instruction.textContent = "I change distracted users to engaged users!";
      instruction.style.fontSize = "1.5rem";
      instruction.style.lineHeight = "1";
      instruction.style.color = "black";
      ballExpanded = true;

      setTimeout(() => {
        if (ballExpanded) dropToArrow();
      }, 2500);
    } else if (ballExpanded) {
      dropToArrow();
    }
  });

  const heroSection = document.getElementById("hero");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && arrowReady) {
        ball.innerHTML = "↓";
        ball.classList.add("arrow-drop", "clickable");
        ball.classList.remove("expanded");

        ball.addEventListener("click", function scrollToWorkAgain() {
          const workSection = document.getElementById("work");
          if (workSection) {
            workSection.scrollIntoView({ behavior: "smooth" });
          }
          ball.removeEventListener("click", scrollToWorkAgain);
        });
      }
    });
  }, { threshold: 0.6 });

  observer.observe(heroSection);

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

  // ========== TAGLINE TYPING ANIMATION ==========
  const taglines = document.querySelectorAll(".taglines div");
  let delay = 0;

  taglines.forEach((line, index) => {
    const text = line.textContent;
    line.textContent = "";
    setTimeout(() => {
      line.style.opacity = 1;
      let i = 0;
      const typing = setInterval(() => {
        line.textContent += text.charAt(i);
        i++;
        if (i === text.length) {
          clearInterval(typing);
          line.style.borderRight = "none";
        }
      }, 100);
    }, delay);

    delay += text.length * 100 + 800;
  });

});