// about.js - Personal About Page

document.addEventListener("DOMContentLoaded", () => {
  
  // ========== HAMBURGER MENU TOGGLE ==========
  const hamburger = document.getElementById('hamburger');
  const sideNav = document.getElementById('sideNav');
  const navLinks = document.querySelectorAll('.side-nav a');

  if (hamburger && sideNav) {
    // Toggle hamburger menu
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      sideNav.classList.toggle('active');
      document.body.style.overflow = sideNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        sideNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!sideNav.contains(e.target) && !hamburger.contains(e.target) && sideNav.classList.contains('active')) {
        hamburger.classList.remove('active');
        sideNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

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