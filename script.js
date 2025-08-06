document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script loaded!");

  const ball = document.getElementById("ball");
  const instruction = document.getElementById("instruction");

  let moveCount = 0;
  let clickEnabled = false;
  let lastMoveTime = 0;
  let movementAllowed = false;

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

  // Initial bounce
  ball.classList.add("bounce");
  setTimeout(() => {
    ball.classList.remove("bounce");
  }, 300);

  // ✅ Handle click to expand and wait for mouse leave
  let ballExpanded = false;

ball.addEventListener("click", () => {
  if (!clickEnabled) return;

  if (!ballExpanded) {
    // First click: Expand and show message
    ball.classList.add("expanded");
    instruction.textContent = "So what I do is change distracted users to engaged users!";
    instruction.style.fontSize = "1.5rem";
    instruction.style.lineHeight = "1";
    instruction.style.color = "black";

    ballExpanded = true;
  } else {
    // Second click: Shrink, transform, drop arrow
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

      // 👇 Click on arrow triggers scroll
      ball.addEventListener("click", function scrollToProjects() {
        const projectsSection = document.getElementById("work");
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: "smooth" });
        }
        ball.removeEventListener("click", scrollToProjects);
      });
    }, 700);

    ballExpanded = false;
  }
});


const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
  card.addEventListener('click', (e) => {
    e.preventDefault();

    const rect = card.getBoundingClientRect();
    const scrollY = window.scrollY;

    // Clone the entire card
    const clone = card.cloneNode(true);
    clone.classList.add('project-card-clone');

    // Set initial styles
    clone.style.position = 'absolute';
    clone.style.top = (rect.top + scrollY) + 'px';
    clone.style.left = rect.left + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.margin = '0';
    clone.style.zIndex = '9999';
    clone.style.transition = 'all 0.9s ease-in-out';
    clone.style.borderRadius = '0';

    // Overlay to hold the clone
    const overlay = document.createElement('div');
    overlay.classList.add('project-overlay');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '9998';
    overlay.style.background = 'transparent'; // ✅ keeps the context
    overlay.style.pointerEvents = 'none';

    document.body.appendChild(overlay);
    document.body.appendChild(clone);

    // Animate to fullscreen
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

});
