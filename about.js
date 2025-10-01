// about.js - Dynamic About Page Interactions

document.addEventListener("DOMContentLoaded", () => {
  
  // ===== SCROLL-TRIGGERED ANIMATIONS =====
  const scrollElements = document.querySelectorAll("[data-scroll]");
  const sections = document.querySelectorAll(".about-section");
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -100px 0px",
  };
  
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);
  
  scrollElements.forEach((el) => scrollObserver.observe(el));
  sections.forEach((section) => scrollObserver.observe(section));
  
  // ===== NUMBER COUNTER ANIMATION =====
  const statNumber = document.querySelector("[data-count]");
  
  if (statNumber) {
    const target = parseFloat(statNumber.getAttribute("data-count"));
    let hasAnimated = false;
    
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateNumber(entry.target, target);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    counterObserver.observe(statNumber);
  }
  
  function animateNumber(element, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = current.toFixed(1);
    }, stepTime);
  }
  
  // ===== PARALLAX SCROLL EFFECTS =====
  const floatingShapes = document.querySelectorAll(".floating-shape");
  const sectionBadges = document.querySelectorAll(".section-badge");
  
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    
    floatingShapes.forEach((shape, index) => {
      const speed = 0.3 + index * 0.1;
      shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    sectionBadges.forEach((badge) => {
      const rect = badge.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
        badge.style.transform = `translateY(${scrollPercent * 50}px)`;
      }
    });
  });
  
  // ===== VIDEO PLAYER CONTROLS =====
  const videoPlayer = document.querySelector(".video-player");
  const video = document.querySelector(".main-video");
  const centerPlayBtn = document.querySelector(".center-play-btn");
  const playPauseBtn = document.querySelector(".play-pause-btn");
  const progressContainer = document.querySelector(".progress-container");
  const progressBar = document.querySelector(".progress-bar");
  const currentTimeDisplay = document.querySelector(".current-time");
  const durationDisplay = document.querySelector(".duration");
  const volumeBtn = document.querySelector(".volume-btn");
  const fullscreenBtn = document.querySelector(".fullscreen-btn");
  const videoControls = document.querySelector(".video-controls");
  
  if (video && videoPlayer) {
    
    function togglePlayPause() {
      if (video.paused) {
        video.play();
        videoPlayer.classList.add("playing");
      } else {
        video.pause();
        videoPlayer.classList.remove("playing");
      }
    }
    
    if (centerPlayBtn) {
      centerPlayBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        togglePlayPause();
      });
    }
    
    playPauseBtn.addEventListener("click", togglePlayPause);
    video.addEventListener("click", togglePlayPause);
    
    video.addEventListener("timeupdate", updateProgress);
    
    function updateProgress() {
      const percent = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${percent}%`;
      
      currentTimeDisplay.textContent = formatTime(video.currentTime);
      if (!isNaN(video.duration)) {
        durationDisplay.textContent = formatTime(video.duration);
      }
    }
    
    progressContainer.addEventListener("click", seek);
    
    function seek(e) {
      const rect = progressContainer.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      video.currentTime = percent * video.duration;
    }
    
    volumeBtn.addEventListener("click", toggleMute);
    
    function toggleMute() {
      video.muted = !video.muted;
      if (video.muted) {
        videoPlayer.classList.add("muted");
      } else {
        videoPlayer.classList.remove("muted");
      }
    }
    
    fullscreenBtn.addEventListener("click", toggleFullscreen);
    
    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        if (videoPlayer.requestFullscreen) {
          videoPlayer.requestFullscreen();
        } else if (videoPlayer.webkitRequestFullscreen) {
          videoPlayer.webkitRequestFullscreen();
        } else if (videoPlayer.msRequestFullscreen) {
          videoPlayer.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
    
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    let controlsTimeout;
    
    videoPlayer.addEventListener("mousemove", () => {
      videoControls.classList.add("show");
      clearTimeout(controlsTimeout);
      
      if (videoPlayer.classList.contains("playing")) {
        controlsTimeout = setTimeout(() => {
          videoControls.classList.remove("show");
        }, 2000);
      }
    });
    
    videoPlayer.addEventListener("mouseleave", () => {
      if (videoPlayer.classList.contains("playing")) {
        videoControls.classList.remove("show");
      }
    });
    
    video.addEventListener("pause", () => {
      videoControls.classList.add("show");
      clearTimeout(controlsTimeout);
    });
    
    video.addEventListener("play", () => {
      controlsTimeout = setTimeout(() => {
        videoControls.classList.remove("show");
      }, 2000);
    });
    
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        const videoInView = videoPlayer.getBoundingClientRect();
        const isVideoVisible = videoInView.top < window.innerHeight && videoInView.bottom > 0;
        
        if (isVideoVisible) {
          if (e.code === "Space") {
            e.preventDefault();
            togglePlayPause();
          } else if (e.key === "m" || e.key === "M") {
            e.preventDefault();
            toggleMute();
          } else if (e.key === "f" || e.key === "F") {
            e.preventDefault();
            toggleFullscreen();
          }
        }
      }
    });
    
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && videoPlayer.classList.contains("playing")) {
            video.pause();
            videoPlayer.classList.remove("playing");
          }
        });
      },
      { threshold: 0.3 }
    );
    
    videoObserver.observe(videoPlayer);
  }
  
  // ===== IMAGE HOVER TILT EFFECT =====
  const imageFloats = document.querySelectorAll(".image-float, .viral-image");
  
  imageFloats.forEach((img) => {
    img.addEventListener("mousemove", (e) => {
      const rect = img.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    img.addEventListener("mouseleave", () => {
      img.style.transform = "";
    });
  });
  
  // ===== CARD STACK HOVER EFFECT =====
  const cards = document.querySelectorAll(".card");
  
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      cards.forEach((c) => {
        if (c !== card) {
          c.style.filter = "brightness(0.7)";
        }
      });
    });
    
    card.addEventListener("mouseleave", () => {
      cards.forEach((c) => {
        c.style.filter = "";
      });
    });
  });
  
  // ===== ACTIVE NAV STATE =====
  const navLinks = document.querySelectorAll(".side-nav a");
  const currentPath = window.location.pathname;
  
  if (currentPath.includes("about.html")) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes("about")) {
        link.classList.add("active");
      }
    });
  } else if (currentPath.includes("story.html")) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes("story")) {
        link.classList.add("active");
      }
    });
  }
  
  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
  
  // ===== EMAIL LINK RIPPLE EFFECT =====
  const emailLink = document.querySelector(".email-link");
  
  if (emailLink) {
    emailLink.addEventListener("click", (e) => {
      const ripple = document.createElement("span");
      ripple.style.position = "absolute";
      ripple.style.width = "20px";
      ripple.style.height = "20px";
      ripple.style.background = "rgba(255, 255, 255, 0.5)";
      ripple.style.borderRadius = "50%";
      ripple.style.left = `${e.offsetX}px`;
      ripple.style.top = `${e.offsetY}px`;
      ripple.style.transform = "translate(-50%, -50%)";
      ripple.style.animation = "ripple 0.6s ease-out";
      
      emailLink.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }
  
  // Add ripple animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes ripple {
      to {
        width: 100px;
        height: 100px;
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // ===== SOCIAL CARD MAGNETIC EFFECT =====
  const socialCards = document.querySelectorAll(".social-card");
  
  socialCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      card.style.transform = `translateY(-8px) translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
  
  // ===== FEATURE HIGHLIGHT REVEAL =====
  const featureHighlight = document.querySelector(".feature-highlight");
  
  if (featureHighlight) {
    const highlightObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "0";
            entry.target.style.transform = "translateY(20px)";
            setTimeout(() => {
              entry.target.style.transition = "all 0.6s ease";
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            }, 300);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    highlightObserver.observe(featureHighlight);
  }
  
  console.log("✨ Dynamic About page loaded");
  console.log("🎨 Layouts: Offset, Diagonal, Spotlight, Cards, Immersive");
});