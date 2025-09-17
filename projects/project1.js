document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const media = entry.target.querySelector(".overlay-media");
      if (!media) return;

      if (entry.isIntersecting) {
        entry.target.classList.add("show-overlay");
        if (media.tagName === "VIDEO") {
          media.currentTime = 0;
          media.play();
        }
      } else {
        entry.target.classList.remove("show-overlay");
        if (media.tagName === "VIDEO") {
          media.pause();
          media.currentTime = 0;
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".ds-media").forEach(media => {
    observer.observe(media);
  });
});
