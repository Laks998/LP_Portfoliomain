document.addEventListener("DOMContentLoaded", () => {
  // Animate blocks when they enter viewport
  const blockObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        entry.target.style.transition = "all 1s ease";
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".about-block, [data-animate]").forEach(el => blockObserver.observe(el));


  // Handle video autoplay + pause
  const video = document.querySelector(".about-video");

  if (video) {
    const videoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(err => console.log("Autoplay blocked:", err));
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.5 });

    videoObserver.observe(video);

    // Show/hide controls on hover
    video.controls = false; // hidden by default
    video.addEventListener("mouseenter", () => {
      video.controls = true;
    });
    video.addEventListener("mouseleave", () => {
      video.controls = false;
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".side-nav a");
    const currentPath = window.location.pathname;

    // About page case
    if (currentPath.includes("about.html")) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes("about")) {
          link.classList.add("active");
        }
      });
      return;
    }

    // Timeline page case
    if (currentPath.includes("story.html")) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes("story")) {
          link.classList.add("active");
        }
      });
      return;
    }

    // Scroll sections
    const sections = {
      hero: document.querySelector("#hero"),
      work: document.querySelector("#work"),
    };

    function getActiveSection() {
      const scrollY = window.scrollY + window.innerHeight / 2;
      const workTop = sections.work.offsetTop;
      return scrollY >= workTop ? "work" : "hero";
    }

    function updateActiveNav() {
      const activeId = getActiveSection();
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${activeId}`) {
          link.classList.add("active");
        }
      });
    }

    updateActiveNav();
    window.addEventListener("scroll", updateActiveNav);
  });