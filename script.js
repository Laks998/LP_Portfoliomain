document.addEventListener("DOMContentLoaded", () => {

  // ========== MINI LOTTIE PREVIEW (Animation card, index only) ==========
  const miniLottie = document.getElementById('mini-lottie');
  if (miniLottie) {
    if (typeof lottie === 'undefined') {
      console.error('Lottie library did not load — check that the cdnjs <script> tag in <head> loaded successfully (network/ad-blocker issue?).');
    } else {
      const miniAnim = lottie.loadAnimation({
        container: miniLottie,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/data.json'
      });
      miniAnim.addEventListener('data_failed', () => {
        console.error('Lottie: failed to load/parse assets/data.json for the mini preview. If you are opening index.html directly (file://) instead of via a local server, browsers block that fetch — run a local server (e.g. `python3 -m http.server` or VS Code Live Server) and check the Network/Console tab for the real error.');
      });
    }
  }

  // ========== FULL LOTTIE (animation.html only) ==========
  const fullLottie = document.getElementById('full-lottie');
  if (fullLottie) {
    if (typeof lottie === 'undefined') {
      console.error('Lottie library did not load on animation.html.');
    } else {
      const fullAnim = lottie.loadAnimation({
        container: fullLottie,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/data.json'
      });
      fullAnim.addEventListener('data_failed', () => {
        console.error('Lottie: failed to load/parse assets/data.json on animation.html.');
      });
    }
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = document.querySelectorAll('.bento-card');

  // ========== STAGGERED ENTRANCE ==========
  if (!prefersReducedMotion) {
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 70}ms`;
      card.classList.add('is-entering');
    });
  }

  // ========== MAGNETIC TILT ON HOVER (desktop, fine pointer only) ==========
  const supportsHoverTilt = !prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsHoverTilt) {
    const maxTilt = 6; // degrees

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;  // 0 -> 1
        const py = (e.clientY - rect.top) / rect.height;  // 0 -> 1
        const rotateY = (px - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - py) * maxTilt * 2;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015) translateY(-4px)`;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
      });
    });
  }

});