// Scroll reveal animations
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".case-study section");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => {
    section.classList.add("hidden");
    observer.observe(section);
  });
});

// Optional: simple image zoom on click
document.addEventListener("click", e => {
  if (e.target.closest(".img-grid img")) {
    const src = e.target.getAttribute("src");
    const modal = document.createElement("div");
    modal.classList.add("img-modal");
    modal.innerHTML = `
      <div class="img-modal-content">
        <img src="${src}" alt="zoomed image">
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", () => modal.remove());
  }
});
