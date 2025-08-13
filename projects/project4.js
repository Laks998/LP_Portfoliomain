(function () {
  const sheets = Array.from(document.querySelectorAll('.sheet'));
  const nextBtn = document.querySelector('.nav.next');
  const prevBtn = document.querySelector('.nav.prev');
  const rightCover = document.querySelector('.right-cover');

  // Highest sheet should be on top initially
  sheets.forEach((s, i) => (s.style.zIndex = String(100 - i)));

  let flippedCount = 0; // how many sheets are flipped

  function updateUI() {
    // Disable prev if nothing flipped; disable next if all flipped
    prevBtn.disabled = flippedCount === 0;
    nextBtn.disabled = flippedCount === sheets.length;

    // Show back cover only when all sheets are flipped (end state)
    rightCover.style.opacity = flippedCount === sheets.length ? '1' : '0';
  }

  function flipNext() {
    if (flippedCount >= sheets.length) return;
    const sheet = sheets[flippedCount];
    sheet.classList.add('flipped');
    // Move flipped sheet to bottom of stack so the next one is interactive
    sheet.style.zIndex = String(10 + flippedCount);
    flippedCount++;
    updateUI();
  }

  function flipPrev() {
    if (flippedCount <= 0) return;
    flippedCount--;
    const sheet = sheets[flippedCount];
    sheet.classList.remove('flipped');
    // Put it back on top of the remaining stack
    sheet.style.zIndex = String(100 - flippedCount);
    updateUI();
  }

  // Buttons
  nextBtn.addEventListener('click', flipNext);
  prevBtn.addEventListener('click', flipPrev);

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') flipNext();
    if (e.key === 'ArrowLeft') flipPrev();
  });

  // Basic swipe support
  let touchStartX = null;
  const book = document.getElementById('book');

  book.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  book.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) flipNext(); else flipPrev();
    }
    touchStartX = null;
  }, { passive: true });

  // Init
  updateUI();
})();
