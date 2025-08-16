// project3.js

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section.fade-section");

  // Make hero fade in immediately
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.classList.add("visible");
  }

  const observerOptions = {
    root: null,
    threshold: 0.15
  };

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    if (!section.classList.contains("hero")) {
      revealOnScroll.observe(section);
    }
  });
});

document.querySelectorAll('.plan-of-action a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const header = document.querySelector("header"); // detect header if present
      const headerOffset = header ? header.offsetHeight : 80; // fallback to 80px
      const targetPosition = target.offsetTop - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Accessibility: shift focus to section after scrolling
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  });
});



if (entry.isIntersecting) {
  entry.target.classList.add("visible");
} else {
  entry.target.classList.remove("visible");
}

