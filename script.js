document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script loaded!");

  const ball = document.getElementById("ball");
  const instruction = document.getElementById("instruction");

  let moveCount = 0;
  let clickEnabled = false;
  let lastMoveTime = 0;
  let movementAllowed = false;

  const messages = ["Too slow", "Nope", "You're getting there", "Okay, this is sad"];

  // Initial setup
  ball.style.display = "flex";
  instruction.textContent = "View";

  // Start movement detection after short delay
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

    return { top: `${randomTop}px`, left: `${randomTop}px` };
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

  // ✅ Handle click to expand and drop
  ball.addEventListener("click", () => {
    if (!clickEnabled) return;

    // Step 1: Expand and show text
    ball.classList.add("expanded");
    instruction.textContent = "So what I do is change distracted users to engaged users!";
    instruction.style.fontSize = "1.5rem";
    instruction.style.lineHeight = "1";
    instruction.style.color = "black";

    // Step 2: Shrink to original after a delay
    setTimeout(() => {
      instruction.textContent = "";
      ball.classList.remove("expanded");
      ball.classList.remove("clickable");
      ball.classList.add("back-to-original");

      // Step 3: Drop as arrow
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

        // ✅ Final Step: Scroll to #projects after drop
        // ✅ Final Step: Make arrow scroll when clicked
setTimeout(() => {
  const projectsSection = document.getElementById("work");
  if (!projectsSection) return;

  // ⬇️ You can remove this if you only want scroll on click
  // projectsSection.scrollIntoView({ behavior: "smooth" });

  // ✅ Now allow clicking ↓ to scroll
  ball.addEventListener("click", () => {
    projectsSection.scrollIntoView({ behavior: "smooth" });
  }, { once: true });
}, 1000);
 // ⏱ wait for drop animation

      }, 700); // wait for shrink to original

    }, 1500); // time user sees expanded state
  });
});
