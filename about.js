document.addEventListener("DOMContentLoaded", () => {
  const fadeEls = document.querySelectorAll(".fade-in, .about-block");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible"); // apply immediately
      }
    });
  }, { threshold: 0.2 });

  fadeEls.forEach(el => observer.observe(el));
});
