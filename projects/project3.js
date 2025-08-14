// project3.js

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");

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
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80, // adjust for header height
        behavior: 'smooth'
      });
    }
  });
});
