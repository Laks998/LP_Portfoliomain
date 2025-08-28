document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show-overlay");
        const video = entry.target.querySelector(".overlay-media");
        video.currentTime = 0;
        video.play();
      } else {
        entry.target.classList.remove("show-overlay");
        const video = entry.target.querySelector(".overlay-media");
        video.pause();
        video.currentTime = 0;
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".ds-media").forEach(media => {
    observer.observe(media);
  });
});
