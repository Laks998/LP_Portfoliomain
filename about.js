// about.js - Personal About Page

document.addEventListener("DOMContentLoaded", () => {

  // ========== PROGRESS BAR ==========
  const progressBar = document.querySelector('.read-progress');

  function updateProgressBar() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollableHeight = documentHeight - windowHeight;
    const scrollPercent = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 100;

    if (progressBar) progressBar.style.width = `${scrollPercent}%`;
  }

  window.addEventListener('scroll', updateProgressBar);
  updateProgressBar();

  // ========== VIDEO PLAYER ==========
  const videoContainer = document.querySelector('.video-container');
  const video = document.querySelector('.video-container video');
  const playOverlay = document.getElementById('playOverlay');

  if (videoContainer && video && playOverlay) {
    // Play/pause video on click
    videoContainer.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        videoContainer.classList.add('playing');
      } else {
        video.pause();
        videoContainer.classList.remove('playing');
      }
    });

    // Show overlay when video ends
    video.addEventListener('ended', () => {
      videoContainer.classList.remove('playing');
    });
  }

  console.log("✨ Personal about page loaded");
});