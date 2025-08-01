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

  // ⬇️ EXPAND on click
    ball.addEventListener("click", () => {
  if (clickEnabled) {
    ball.classList.add("expanded");
    instruction.textContent = "So what I do is change distracted users to engaged users!";
    instruction.style.fontSize = "2rem";
    instruction.style.lineHeight = "1";
    instruction.style.color = "black";

    // After expansion, listen for mouse leaving the ball
    ball.addEventListener("mouseleave", () => {
      ball.classList.remove("expanded");
      ball.classList.add("shrinking");

      setTimeout(() => {
        ball.classList.remove("shrinking");
        ball.classList.add("disappear");
      }, 400); // wait for shrink-to-normal before shrinking to dot

      // Final removal and drop circle animation
      setTimeout(() => {
        ball.style.display = "none";

        const drop = document.getElementById("dropCircle");
        drop.classList.add("animate");
      }, 800); // match timing with disappear animation

    }, { once: true }); // 🟡 Ensure this only triggers once
  }
});

});
