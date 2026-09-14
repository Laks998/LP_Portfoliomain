// project6.js - Illustrations page, now showcasing a single video (animo-cover-flow)

document.addEventListener('DOMContentLoaded', () => {

  const video = document.querySelector('.showcase-video');
  if (!video) return;

  // Scroll reveal for the video, same feel as the old gallery item reveal
  video.style.opacity = '0';
  video.style.transform = 'translateY(30px)';
  video.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  observer.observe(video);

  // Some browsers ignore the autoplay attribute until interaction has
  // occurred elsewhere on the page; this is a harmless best-effort retry.
  video.play().catch(() => {});

  // Click the video to toggle play/pause
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  console.log('🎬 Illustrations page now showing animo-cover-flow video');
});