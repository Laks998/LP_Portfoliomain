// hero.js — interactions for the hero only. script.js (work-section
// chip filtering) is untouched and loads separately.

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     Persona parallax — subtle cursor-follow, off for touch/reduced motion.
  --------------------------------------------------------------- */
  (function personaParallax() {
    const wrap = document.getElementById('personaParallax');
    if (!wrap || reduceMotion || window.matchMedia('(hover: none)').matches) return;

    let raf = null;
    let targetX = 0, targetY = 0, curX = 0, curY = 0;

    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      targetX = x * 14;
      targetY = y * 10;
      if (!raf) raf = requestAnimationFrame(tick);
    });

    function tick() {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      wrap.style.transform = `translate(${curX.toFixed(2)}px, ${curY.toFixed(2)}px)`;
      if (Math.abs(targetX - curX) > 0.05 || Math.abs(targetY - curY) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }
  })();

  /* ---------------------------------------------------------------
     Icon 1 — play favourite song.
     Point AUDIO_SRC at a real file (e.g. "assets/audio/favourite-song.mp3")
     or a direct audio URL once you have one; until then this shows a
     small reminder instead of failing silently.
  --------------------------------------------------------------- */
  (function favouriteSong() {
    const AUDIO_SRC = ''; // <- put your song file/URL here
    const btn = document.getElementById('audioBtn');
    const audio = document.getElementById('favSongAudio');
    const tooltip = document.getElementById('audioTooltip');
    if (!btn || !audio) return;

    if (AUDIO_SRC) audio.src = AUDIO_SRC;
    let tooltipTimer = null;

    function showTooltip(msg) {
      tooltip.textContent = msg;
      tooltip.classList.add('is-visible');
      clearTimeout(tooltipTimer);
      tooltipTimer = setTimeout(() => tooltip.classList.remove('is-visible'), 2200);
    }

    btn.addEventListener('click', () => {
      if (!AUDIO_SRC) {
        showTooltip('Add your song at assets/audio/…');
        return;
      }
      if (audio.paused) {
        audio.play().catch(() => showTooltip("Couldn't play that file"));
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play', () => btn.setAttribute('aria-pressed', 'true'));
    audio.addEventListener('pause', () => btn.setAttribute('aria-pressed', 'false'));
    audio.addEventListener('ended', () => btn.setAttribute('aria-pressed', 'false'));
  })();

  /* ---------------------------------------------------------------
     Icon 3 — tools radial menu.
  --------------------------------------------------------------- */
  (function tools() {
    const trigger = document.getElementById('toolsBtn');
    const radial = document.getElementById('toolsRadial');
    if (!trigger || !radial) return;

    const TOOLS = [
      { name: 'Figma', mark: 'Fi' },
      { name: 'Claude', mark: 'C' },
      { name: 'Manus', mark: 'M' },
      { name: 'ChatGPT', mark: 'G' },
    ];

    let built = false;
    let open = false;

    function build() {
      TOOLS.forEach((tool, i) => {
        const node = document.createElement('span');
        node.className = 'tool-node';
        node.style.setProperty('--node-delay', `${i * 0.04}s`);
        node.innerHTML = `<span class="tool-mark" aria-hidden="true">${tool.mark}</span>${tool.name}`;
        radial.appendChild(node);
      });
      built = true;
    }

    function positionDesktop() {
      if (!window.matchMedia('(min-width: 720px)').matches) return;
      const anchor = { x: trigger.offsetLeft + trigger.offsetWidth / 2, y: trigger.offsetTop + trigger.offsetHeight / 2 };
      const radius = 100;
      const startDeg = 200, endDeg = 260; // fan up and to the left of the icon
      const nodes = radial.querySelectorAll('.tool-node');
      nodes.forEach((node, i) => {
        const t = nodes.length > 1 ? i / (nodes.length - 1) : 0;
        const deg = startDeg + (endDeg - startDeg) * t;
        const rad = (deg * Math.PI) / 180;
        const dx = Math.cos(rad) * radius;
        const dy = Math.sin(rad) * radius;
        node.style.left = `${anchor.x}px`;
        node.style.top = `${anchor.y}px`;
        node.style.setProperty('--tx', `${dx}px`);
        node.style.setProperty('--ty', `${dy}px`);
      });
    }

    function openRadial() {
      if (!built) build();
      positionDesktop();
      radial.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      open = true;
      document.addEventListener('click', onDocClick);
      document.addEventListener('keydown', onKeydown);
    }

    function closeRadial() {
      radial.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      open = false;
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKeydown);
    }

    function onDocClick(e) {
      if (!trigger.contains(e.target) && !radial.contains(e.target)) closeRadial();
    }
    function onKeydown(e) {
      if (e.key === 'Escape') { closeRadial(); trigger.focus(); }
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      open ? closeRadial() : openRadial();
    });

    window.addEventListener('resize', () => { if (open) positionDesktop(); });
  })();

})();