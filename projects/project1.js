document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll(".overlay-media");

  videos.forEach(video => {
    const container = video.closest(".ds-media");

    container.addEventListener("mouseenter", () => {
      video.currentTime = 0;
      video.play();
    });

    container.addEventListener("mouseleave", () => {
      video.pause();
    });
  });
});
