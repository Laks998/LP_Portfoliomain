document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script loaded!");

  const ball = document.getElementById("ball");
  const instruction = document.getElementById("instruction");
  const startBtn = document.getElementById("startTimeline");
  const timelineBall = document.getElementById("timeline-ball");
  const milestones = [...document.querySelectorAll(".milestone")];

  let moveCount = 0;
  let clickEnabled = false;
  let lastMoveTime = 0;
  let movementAllowed = false;
  let ballExpanded = false;
  let arrowReady = false;
  let currentStep = -1;

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

      ball.addEventListener("click", function scrollToTimeline() {
        const timelineSection = document.getElementById("timeline-section");
        if (timelineSection) {
          timelineSection.scrollIntoView({ behavior: "smooth" });
        }
        ball.removeEventListener("click", scrollToTimeline);
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

        ball.addEventListener("click", function scrollToTimelineAgain() {
          const timelineSection = document.getElementById("timeline-section");
          if (timelineSection) {
            timelineSection.scrollIntoView({ behavior: "smooth" });
          }
          ball.removeEventListener("click", scrollToTimelineAgain);
        });
      }
    });
  }, { threshold: 0.6 });

  observer.observe(heroSection);

  // ✅ Timeline Logic FIXED & included
  function resetTimeline() {
    currentStep = -1;
    timelineBall.style.left = "10%";
    timelineBall.style.top = "70%";
    timelineBall.innerHTML = "";

    milestones.forEach(m => m.classList.remove("reached"));

    startBtn.innerHTML = `View my journey`;
    startBtn.disabled = false;
    startBtn.classList.remove("end-state", "started", "restart");
  }

  startBtn.addEventListener("click", () => {
    if (startBtn.classList.contains("restart")) {
      resetTimeline();
      return;
    }

    currentStep++;

    if (currentStep >= milestones.length) {
      startBtn.disabled = true;
      startBtn.innerHTML = `That’s me! Unless you have something better for me to move from here, ofcourse`;
      startBtn.classList.add("end-state");

      setTimeout(() => {
        startBtn.innerHTML = `Start again`;
        startBtn.disabled = false;
        startBtn.classList.add("restart");
      }, 2000);

      return;
    }

    const milestone = milestones[currentStep];
    const left = milestone.parentElement.style.left;
    const top = milestone.parentElement.style.top;

    const label = milestone.dataset.label;
    const year = milestone.parentElement.querySelector('.milestone-label')?.textContent || "";

    timelineBall.style.left = left;
    timelineBall.style.top = top;

    timelineBall.innerHTML = `
      <div class="timeline-label">${label}</div>
      <div class="timeline-year">${year}</div>
    `;

    milestone.classList.add("reached");

    if (currentStep === 0) {
      startBtn.innerHTML = `And then? <i class="fa-solid fa-arrow-right"></i>`;
      startBtn.classList.add("started");
    }
  });

});
