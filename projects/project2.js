// Fade-in effect when sections come into view
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Animate only once
    }
  });
}, {
  threshold: 0.2
});

// Observe all top-level sections inside .project-detail
document.querySelectorAll('.project-detail > section').forEach(section => {
  observer.observe(section);
});

document.querySelectorAll('#design-process-animation .stage').forEach(stage => {
  stage.addEventListener('click', () => {
    const details = stage.querySelector('.stage-details');
    if (details.hasAttribute('hidden')) {
      details.removeAttribute('hidden');
      stage.setAttribute('aria-expanded', 'true');
    } else {
      details.setAttribute('hidden', '');
      stage.setAttribute('aria-expanded', 'false');
    }
  });

  // Keyboard toggle for accessibility
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      stage.click();
    }
  });

  // Initialize aria-expanded attribute
  stage.setAttribute('aria-expanded', 'false');
});

// --- Flipbook hint fade-out on first interaction ---
const book = document.getElementById('book');
const flipHint = document.querySelector('.flip-hint-animation');

if (book && flipHint) {
  book.addEventListener('pointerdown', () => {
    flipHint.style.transition = 'opacity 0.5s ease';
    flipHint.style.opacity = '0';
    // Optional: remove from DOM after fading
    setTimeout(() => flipHint.remove(), 500);
  }, { once: true }); // triggers only once
}
