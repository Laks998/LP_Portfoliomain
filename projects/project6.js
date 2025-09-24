const images = document.querySelectorAll('.spiral-gallery img');
let currentIndex = 0;
let isAnimating = false;

const directions = ['left', 'right', 'top', 'bottom'];

function showImage(nextIndex, direction) {
  if (isAnimating || nextIndex === currentIndex) return;
  isAnimating = true;

  const currentImg = images[currentIndex];
  const nextImg = images[nextIndex];

  // reset all transition
  currentImg.style.transition = 'none';
  nextImg.style.transition = 'none';

  // prepare next image off-screen
  let offsetX = 0, offsetY = 0;
  if (direction === 'left') offsetX = '-100%';
  if (direction === 'right') offsetX = '100%';
  if (direction === 'top') offsetY = '-100%';
  if (direction === 'bottom') offsetY = '100%';

  nextImg.style.transform = `translate(${offsetX}, ${offsetY}) scale(0.9)`;
  nextImg.style.opacity = '0';
  nextImg.style.zIndex = '2';
  currentImg.style.zIndex = '1';

  // force reflow so browser applies above styles
  void nextImg.offsetWidth;

  // animate both together
  currentImg.style.transition = 'transform 900ms cubic-bezier(.2,.9,.2,1), opacity 900ms ease';
  nextImg.style.transition = 'transform 900ms cubic-bezier(.2,.9,.2,1), opacity 900ms ease';

  currentImg.style.transform = 'translate(0,0) scale(0.9)';
  currentImg.style.opacity = '0';
  nextImg.style.transform = 'translate(0,0) scale(1)';
  nextImg.style.opacity = '1';

  setTimeout(() => {
    currentImg.style.zIndex = '0';
    currentIndex = nextIndex;
    isAnimating = false;
  }, 950);
}

// Handle scroll with lock
window.addEventListener('wheel', (e) => {
  if (isAnimating) return;
  const direction = e.deltaY > 0 ? 1 : -1;
  let nextIndex = (currentIndex + direction + images.length) % images.length;

  // pick random entry direction
  const entry = directions[Math.floor(Math.random() * directions.length)];

  showImage(nextIndex, entry);
});

// initialize first image visible
images.forEach((img, i) => {
  img.style.opacity = i === 0 ? '1' : '0';
  img.style.transform = i === 0 ? 'scale(1)' : 'scale(0.9)';
  img.style.zIndex = i === 0 ? '1' : '0';
});