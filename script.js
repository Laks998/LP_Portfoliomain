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
  ball.addEventListener("click", () => {
    if (!clickEnabled) return;

    // Expand and show message
    ball.classList.add("expanded");
    instruction.textContent = "So what I do is change distracted users to engaged users!";
    instruction.style.fontSize = "1.5rem";
    instruction.style.lineHeight = "1";
    instruction.style.color = "black";

    // 👇 Only when mouse leaves, begin the shrink + drop sequence
    const handleMouseLeave = () => {
      instruction.textContent = "";
      ball.classList.remove("expanded");
      ball.classList.remove("clickable");
      ball.classList.add("back-to-original");

      // Shrink delay
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

        // 👇 Only scroll when user clicks the arrow
        ball.addEventListener("click", function scrollToProjects() {
          const projectsSection = document.getElementById("work");
          if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: "smooth" });
          }
          ball.removeEventListener("click", scrollToProjects);
        });
      }, 700);
    };

    // Attach mouseleave handler
    ball.addEventListener("mouseleave", handleMouseLeave, { once: true });
  });
});
