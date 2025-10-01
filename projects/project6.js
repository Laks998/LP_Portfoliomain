// project6.js - Illustrations Gallery with Lightbox

document.addEventListener('DOMContentLoaded', () => {
  
  // Create lightbox HTML
  const lightboxHTML = `
    <div class="lightbox" id="lightbox">
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Previous">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="lightbox-content">
        <img src="" alt="" id="lightbox-img">
        <div class="lightbox-counter">
          <span id="current-index">1</span> / <span id="total-images">8</span>
        </div>
      </div>
      <button class="lightbox-nav lightbox-next" aria-label="Next">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;
  
  // Insert lightbox into body
  document.body.insertAdjacentHTML('beforeend', lightboxHTML);
  
  // Get elements
  const galleryImages = document.querySelectorAll('.spiral-gallery img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const currentIndexSpan = document.getElementById('current-index');
  const totalImagesSpan = document.getElementById('total-images');
  
  let currentIndex = 0;
  const images = [];
  
  // Collect all images
  galleryImages.forEach((img, index) => {
    images.push({
      src: img.src,
      alt: img.alt
    });
    
    // Click to open lightbox
    img.addEventListener('click', () => {
      openLightbox(index);
    });
  });
  
  // Set total images count
  totalImagesSpan.textContent = images.length;
  
  // Open lightbox
  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Update lightbox content
  function updateLightbox() {
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
    currentIndexSpan.textContent = currentIndex + 1;
    
    // Disable/enable navigation buttons
    lightboxPrev.disabled = currentIndex === 0;
    lightboxNext.disabled = currentIndex === images.length - 1;
  }
  
  // Navigate to previous image
  function showPrevious() {
    if (currentIndex > 0) {
      currentIndex--;
      updateLightbox();
    }
  }
  
  // Navigate to next image
  function showNext() {
    if (currentIndex < images.length - 1) {
      currentIndex++;
      updateLightbox();
    }
  }
  
  // Event listeners
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrevious);
  lightboxNext.addEventListener('click', showNext);
  
  // Click outside image to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrevious();
    } else if (e.key === 'ArrowRight') {
      showNext();
    }
  });
  
  // Smooth scroll reveal for gallery items
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  galleryImages.forEach(img => {
    observer.observe(img);
  });
  
  console.log('✨ Illustrations gallery loaded');
  console.log(`🎨 ${images.length} illustrations in gallery`);
  
});