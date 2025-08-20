document.addEventListener("DOMContentLoaded", () => {
  const scrollImg = document.querySelector(".scroll-img");
  const typewriterText = document.querySelector(".typewriter-text");
  const message = "Hi, I'm Lakshmi Pratap";

  let progress = 0;   // 0 (closed) → 1 (fully open)
  let typed = false;

  // Capture mouse wheel
  window.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) {
      // Scrolling down → open
      progress = Math.min(progress + 0.05, 1);
    } else {
      // Scrolling up → close
      progress = Math.max(progress - 0.05, 0);
    }

    // Update scroll height
    scrollImg.style.height = `${progress * 100}%`;

    // Trigger typewriter once fully open
    if (progress === 1 && !typed) {
      typed = true;
      typeWriter(message, typewriterText, 100);
    }

    // Reset if closed back
    if (progress < 1) {
      typewriterText.textContent = "";
      typewriterText.style.width = "0";
      typed = false;
    }
  }, { passive: false });
});

// Typewriter function
function typeWriter(text, element, speed) {
  let i = 0;
  element.style.width = "auto";
  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}
