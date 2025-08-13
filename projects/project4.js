(function () {
  const sheets = Array.from(document.querySelectorAll('.sheet'));
  const nextBtn = document.querySelector('.nav.next');
  const prevBtn = document.querySelector('.nav.prev');
  const rightCover = document.querySelector('.right-cover');
  const book = document.getElementById('book');

  // initial stacking: top sheet has highest z
  sheets.forEach((s, i) => (s.style.zIndex = String(100 - i)));

  let flippedCount = 0;

  function updateUI() {
    prevBtn.disabled = flippedCount === 0;
    nextBtn.disabled = flippedCount === sheets.length;
    rightCover.style.opacity = flippedCount === sheets.length ? '1' : '0';
  }

  function flipNext() {
    if (flippedCount >= sheets.length) return;
    const sheet = sheets[flippedCount];
    sheet.classList.add('flipped');
    sheet.style.zIndex = String(10 + flippedCount);
    flippedCount++;
    updateUI();
  }

  function flipPrev() {
    if (flippedCount <= 0) return;
    flippedCount--;
    const sheet = sheets[flippedCount];
    sheet.classList.remove('flipped');
    sheet.style.zIndex = String(100 - flippedCount);
    updateUI();
  }

  // ------- Drag-to-flip (both directions) -------
  let dragging = false;
  let dir = null; // "forward" | "backward"
  let activeSheet = null;
  let startX = 0;
  let lastX = 0;
  let raf = null;
  let originalZ = null;

  function beginDrag(e) {
    const ex = e.clientX ?? (e.touches && e.touches[0].clientX);
    if (ex == null) return;

    const rect = book.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    // Decide direction by which side of the book is pressed
    if (ex > centerX && flippedCount < sheets.length) {
      dir = 'forward';
      activeSheet = sheets[flippedCount];
    } else if (ex <= centerX && flippedCount > 0) {
      dir = 'backward';
      activeSheet = sheets[flippedCount - 1];
    } else {
      dir = null;
      activeSheet = null;
      return; // nothing to drag
    }

    dragging = true;
    startX = ex;
    lastX = ex;
    originalZ = activeSheet.style.zIndex;
    activeSheet.style.transition = 'none';
    activeSheet.style.willChange = 'transform';
    activeSheet.style.zIndex = '150'; // ensure it's on top while dragging

    // ensure correct starting transform for backward sheet (which is already flipped)
    if (dir === 'backward') {
      activeSheet.style.transform = 'rotateY(-180deg)';
    }

    // pointer capture so we don't lose events
    if (e.pointerId !== undefined && book.setPointerCapture) {
      book.setPointerCapture(e.pointerId);
    }
  }

  function onMove(e) {
    if (!dragging || !activeSheet) return;
    lastX = e.clientX ?? (e.touches && e.touches[0].clientX);
    if (lastX == null) return;

    if (!raf) {
      raf = requestAnimationFrame(applyDrag);
    }

    // prevent page scroll on touch-drag
    if (e.cancelable) e.preventDefault();
  }

  function applyDrag() {
    raf = null;
    if (!dragging || !activeSheet) return;

    const half = book.clientWidth / 2;
    let frac, rot;

    if (dir === 'forward') {
      // drag left on the right page
      frac = (startX - lastX) / half;          // 0..1
      frac = Math.min(Math.max(frac, 0), 1);
      rot = -180 * frac;                       // 0 -> -180
    } else {
      // drag right on the left page
      frac = (lastX - startX) / half;          // 0..1
      frac = Math.min(Math.max(frac, 0), 1);
      rot = -180 + 180 * frac;                 // -180 -> 0
    }

    activeSheet.style.transform = `rotateY(${rot}deg)`;
  }

  function endDrag(e) {
    if (!dragging) return;

    const ex = e.clientX ?? (e.changedTouches && e.changedTouches[0].clientX);
    const half = book.clientWidth / 2;
    const progress = Math.min(Math.max(Math.abs((ex - startX) / half), 0), 1);
    const complete = progress > 0.33; // threshold to complete flip

    // animate to final state
    if (activeSheet) {
      activeSheet.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)';
      activeSheet.style.willChange = 'auto';
    }

    if (dir === 'forward') {
      if (complete) {
        // finish forward flip
        activeSheet.classList.add('flipped');
        activeSheet.style.transform = ''; // let class control final -180
        activeSheet.style.zIndex = String(10 + flippedCount);
        flippedCount++;
      } else {
        // revert
        activeSheet.style.transform = ''; // back to 0
        activeSheet.style.zIndex = originalZ;
      }
    } else if (dir === 'backward') {
      if (complete) {
        // finish backward flip (unflip last)
        flippedCount--;
        activeSheet.classList.remove('flipped');
        activeSheet.style.transform = ''; // back to 0
        activeSheet.style.zIndex = String(100 - flippedCount);
      } else {
        // keep it flipped
        activeSheet.style.transform = ''; // class keeps it at -180
        activeSheet.style.zIndex = originalZ;
      }
    }

    updateUI();

    // cleanup
    dragging = false;
    dir = null;
    activeSheet = null;
    originalZ = null;
  }

  // Buttons / Keyboard (unchanged)
  nextBtn.addEventListener('click', flipNext);
  prevBtn.addEventListener('click', flipPrev);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') flipNext();
    if (e.key === 'ArrowLeft') flipPrev();
  });

  // Use Pointer Events (covers mouse + touch)
  book.addEventListener('pointerdown', beginDrag, { passive: false });
  window.addEventListener('pointermove', onMove, { passive: false });
  window.addEventListener('pointerup', endDrag, { passive: true });
  window.addEventListener('pointercancel', endDrag, { passive: true });

  updateUI();
})();

window.addEventListener('load', () => {
  const hintPage = document.querySelector('.page.hint');
  if (hintPage) {
    hintPage.classList.add('animate-flip');
  }
});

const bg = document.querySelector('.bg-animation');
let angle = 0;

function rotateBg() {
  angle += 0.02; // slower = smaller number
  bg.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;
  requestAnimationFrame(rotateBg);
}

rotateBg();


