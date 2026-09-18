// about.js - Personal About Page (editorial edition)

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
  const videoWrap = document.getElementById('videoWrap');
  const video = videoWrap ? videoWrap.querySelector('video') : null;

  if (videoWrap && video) {
    videoWrap.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        videoWrap.classList.add('playing');
      } else {
        video.pause();
        videoWrap.classList.remove('playing');
      }
    });

    video.addEventListener('ended', () => {
      videoWrap.classList.remove('playing');
    });
  }

  console.log("About page loaded");
});