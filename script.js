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

  // ========== BOUNCING BALL — collides with viewport edges, every .bento-card, AND the mouse ==========
  initBouncingBall(prefersReducedMotion);

});

function initBouncingBall(prefersReducedMotion) {
  const ball = document.querySelector('.bg-ball');
  if (!ball) return;

  const radius = 23; // half of the 46px ball

  if (prefersReducedMotion) {
    ball.classList.add('is-static');
    return;
  }

  let x = Math.random() * (window.innerWidth - radius * 2) + radius;
  let y = Math.random() * (window.innerHeight - radius * 2) + radius;
  const baseSpeed = 2.0;
  const angle = Math.random() * Math.PI * 2;
  let vx = Math.cos(angle) * baseSpeed;
  let vy = Math.sin(angle) * baseSpeed;

  // ---- mouse tracking ----
  let mouseX = -9999;
  let mouseY = -9999;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hasFinePointer) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouseX = -9999;
      mouseY = -9999;
    });
  }

  const mouseInfluenceRadius = 150;
  const mouseForce = 0.9;

  function getObstacleRects() {
    const cards = document.querySelectorAll('.bento-card');
    return Array.from(cards).map(el => el.getBoundingClientRect());
  }

  let obstacles = getObstacleRects();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      obstacles = getObstacleRects();
      x = Math.min(Math.max(x, radius), window.innerWidth - radius);
      y = Math.min(Math.max(y, radius), window.innerHeight - radius);
    }, 150);
  });

  function resolveRectCollision(rect) {
    const closestX = Math.max(rect.left, Math.min(x, rect.right));
    const closestY = Math.max(rect.top, Math.min(y, rect.bottom));
    const dx = x - closestX;
    const dy = y - closestY;
    const distSq = dx * dx + dy * dy;

    if (distSq < radius * radius) {
      const dist = Math.sqrt(distSq) || 0.001;
      const nx = dx / dist;
      const ny = dy / dist;

      const overlap = radius - dist;
      x += nx * overlap;
      y += ny * overlap;

      const dot = vx * nx + vy * ny;
      if (dot < 0) {
        vx -= 2 * dot * nx;
        vy -= 2 * dot * ny;
      }
    }
  }

  function applyMouseRepulsion() {
    const dx = x - mouseX;
    const dy = y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < mouseInfluenceRadius && dist > 0.001) {
      const strength = (1 - dist / mouseInfluenceRadius) * mouseForce;
      vx += (dx / dist) * strength;
      vy += (dy / dist) * strength;
    }
  }

  function clampSpeed() {
    const currentSpeed = Math.hypot(vx, vy);
    const maxSpeed = baseSpeed * 2.6;
    const minSpeed = baseSpeed * 0.85;

    if (currentSpeed > maxSpeed) {
      const scale = maxSpeed / currentSpeed;
      vx *= scale;
      vy *= scale;
    } else if (currentSpeed < minSpeed && currentSpeed > 0) {
      const scale = minSpeed / currentSpeed;
      vx *= scale;
      vy *= scale;
    }
  }

  function step() {
    applyMouseRepulsion();
    clampSpeed();

    x += vx;
    y += vy;

    // screen edges
    if (x - radius <= 0) { x = radius; vx = Math.abs(vx); }
    if (x + radius >= window.innerWidth) { x = window.innerWidth - radius; vx = -Math.abs(vx); }
    if (y - radius <= 0) { y = radius; vy = Math.abs(vy); }
    if (y + radius >= window.innerHeight) { y = window.innerHeight - radius; vy = -Math.abs(vy); }

    // card edges
    for (const rect of obstacles) {
      resolveRectCollision(rect);
    }

    ball.style.transform = `translate(${x - radius}px, ${y - radius}px)`;
    requestAnimationFrame(step);
  }

  setInterval(() => { obstacles = getObstacleRects(); }, 1000);

  requestAnimationFrame(step);
}