// about.js - About Page Interactions

document.addEventListener("DOMContentLoaded", () => {
  
  // ===== SCROLL ANIMATIONS =====
  const sections = document.querySelectorAll(".about-section");
  
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -80px 0px",
    }
  );
  
  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
  
  // ===== VIDEO PLAYER CONTROLS =====
  const videoPlayer = document.querySelector(".video-player");
  const video = document.querySelector(".main-video");
  const playPauseBtn = document.querySelector(".play-pause-btn");
  const progressContainer = document.querySelector(".progress-container");
  const progressBar = document.querySelector(".progress-bar");
  const currentTimeDisplay = document.querySelector(".current-time");
  const durationDisplay = document.querySelector(".duration");
  const volumeBtn = document.querySelector(".volume-btn");
  const fullscreenBtn = document.querySelector(".fullscreen-btn");
  const videoControls = document.querySelector(".video-controls");
  
  if (video && videoPlayer) {
    
    // Play/Pause
    playPauseBtn.addEventListener("click", togglePlayPause);
    video.addEventListener("click", togglePlayPause);
    
    function togglePlayPause() {
      if (video.paused) {
        video.play();
        videoPlayer.classList.add("playing");
      } else {
        video.pause();
        videoPlayer.classList.remove("playing");
      }
    }
    
    // Update progress bar
    video.addEventListener("timeupdate", updateProgress);
    
    function updateProgress() {
      const percent = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${percent}%`;
      
      // Update time displays
      currentTimeDisplay.textContent = formatTime(video.currentTime);
      if (!isNaN(video.duration)) {
        durationDisplay.textContent = formatTime(video.duration);
      }
    }
    
    // Seek functionality
    progressContainer.addEventListener("click", seek);
    
    function seek(e) {
      const rect = progressContainer.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      video.currentTime = percent * video.duration;
    }
    
    // Volume toggle
    volumeBtn.addEventListener("click", toggleMute);
    
    function toggleMute() {
      video.muted = !video.muted;
      if (video.muted) {
        videoPlayer.classList.add("muted");
      } else {
        videoPlayer.classList.remove("muted");
      }
    }
    
    // Fullscreen
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
    
    // Format time helper
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Show/hide controls on mouse movement
    let controlsTimeout;
    
    videoPlayer.addEventListener("mousemove", () => {
      videoControls.classList.add("show");
      clearTimeout(controlsTimeout);
      
      if (!video.paused) {
        controlsTimeout = setTimeout(() => {
          videoControls.classList.remove("show");
        }, 2000);
      }
    });
    
    videoPlayer.addEventListener("mouseleave", () => {
      if (!video.paused) {
        videoControls.classList.remove("show");
      }
    });
    
    // Keep controls visible when paused
    video.addEventListener("pause", () => {
      videoControls.classList.add("show");
    });
    
    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        if (e.code === "Space" && videoPlayer.matches(":hover")) {
          e.preventDefault();
          togglePlayPause();
        }
      }
    });
    
    // Autoplay when in viewport
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Don't autoplay, just make ready
            video.load();
          } else {
            if (!video.paused) {
              video.pause();
              videoPlayer.classList.remove("playing");
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    
    videoObserver.observe(videoPlayer);
  }
  
  // ===== STAT NUMBER ANIMATION =====
  const statLarge = document.querySelector(".stat-large");
  
  if (statLarge) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.hasAttribute("data-animated")) {
            entry.target.setAttribute("data-animated", "true");
            animateStatNumber(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    statObserver.observe(statLarge);
  }
  
  function animateStatNumber(element) {
    const text = element.textContent;
    if (text.includes("M")) {
      const target = parseFloat(text);
      let current = 0;
      const increment = target / 40;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = current.toFixed(1) + "M";
      }, 40);
    }
  }
  
  // ===== ACTIVE NAV STATE =====
  const navLinks = document.querySelectorAll(".side-nav a");
  const currentPath = window.location.pathname;
  
  // About page
  if (currentPath.includes("about.html")) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes("about")) {
        link.classList.add("active");
      }
    });
    return;
  }
  
  // Career Story page
  if (currentPath.includes("story.html")) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes("story")) {
        link.classList.add("active");
      }
    });
    return;
  }
  
  // Main page scroll sections
  const mainSections = {
    hero: document.querySelector("#hero"),
    work: document.querySelector("#work"),
  };
  
  function getActiveSection() {
    const scrollY = window.scrollY + window.innerHeight / 2;
    const workTop = mainSections.work?.offsetTop || 0;
    return scrollY >= workTop ? "work" : "hero";
  }
  
  function updateActiveNav() {
    const activeId = getActiveSection();
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${activeId}`) {
        link.classList.add("active");
      }
    });
  }
  
  if (mainSections.hero && mainSections.work) {
    updateActiveNav();
    window.addEventListener("scroll", updateActiveNav);
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
  
  // ===== CONTACT SECTION ANIMATION =====
  const contactSection = document.querySelector(".contact-section");
  
  if (contactSection) {
    const contactObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            entry.target.style.transition = "all 0.8s ease";
          }
        });
      },
      { threshold: 0.2 }
    );
    
    contactSection.style.opacity = "0";
    contactSection.style.transform = "translateY(30px)";
    contactObserver.observe(contactSection);
  }
  
  console.log("✨ About page loaded");
});