const illustrations = document.querySelectorAll('.illustration');

// Random side entry
function getRandomStart() {
  const sides = ['left', 'right', 'top', 'bottom'];
  return sides[Math.floor(Math.random() * sides.length)];
}

illustrations.forEach((el, index) => {
  window.addEventListener('scroll', () => {
    const triggerPoint = window.innerHeight * (index * 0.5); // trigger at intervals
    if (window.scrollY > triggerPoint) {
      let side = getRandomStart();
      el.style.opacity = 1;

      // Animate from random side
      switch (side) {
        case 'left':
          el.style.transform = 'translateX(-100vw)';
          setTimeout(() => el.style.transform = 'translate(0,0)', 50);
          break;
        case 'right':
          el.style.transform = 'translateX(100vw)';
          setTimeout(() => el.style.transform = 'translate(0,0)', 50);
          break;
        case 'top':
          el.style.transform = 'translateY(-100vh)';
          setTimeout(() => el.style.transform = 'translate(0,0)', 50);
          break;
        case 'bottom':
          el.style.transform = 'translateY(100vh)';
          setTimeout(() => el.style.transform = 'translate(0,0)', 50);
          break;
      }
    }
  });
});
