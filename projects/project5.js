const illustrations = document.querySelectorAll('.illustration');

document.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;

  illustrations.forEach(el => {
    const rect = el.getBoundingClientRect();
    const elX = rect.left + rect.width / 2;
    const elY = rect.top + rect.height / 2;

    const dx = (x - elX) / 20; // smaller divisor = stronger effect
    const dy = (y - elY) / 20;

    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
});
