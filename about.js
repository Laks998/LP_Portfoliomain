// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const quadrants = [
    document.querySelector('.quad.top-right'),  // arch
    document.querySelector('.quad.bottom-right'), // clay
    document.querySelector('.quad.bottom-left'),  // ambr
    document.querySelector('.quad.top-left')     // sket
  ];

  let revealedCount = 0;

  function revealNextQuadrant() {
    if (revealedCount < quadrants.length) {
      quadrants[revealedCount].classList.add('visible');
      revealedCount++;
    }
  }
  

  // Trigger reveals based on scroll position
  window.addEventListener('scroll', () => {
    const triggerY = document.querySelector('.main-photo-container').getBoundingClientRect().bottom;

    if (triggerY < window.innerHeight - 100) {
      revealNextQuadrant();
    }
  });
});
