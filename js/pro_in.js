// Main JavaScript for Projects Slider and Skills Animation

document.addEventListener("DOMContentLoaded", function() {
    // Initialize Project Slider
    initProjectSlider();
    
    // Initialize Skill Bars Animation
    initSkillBars();
    
    // Initialize Smooth Scrolling
    initSmoothScrolling();
  });
  
  /**
   * Initialize and manage the projects slider functionality
   */
  function initProjectSlider() {
    const projectWrapper = document.querySelector('.projects-wrapper');
    const projectCards = document.querySelectorAll('.project-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const progressBar = document.querySelector('.progress-bar');
    
    let currentIndex = 0;
    const totalProjects = projectCards.length;
    const cardWidth = projectCards[0].offsetWidth;
    const cardGap = 24; // 1.5rem = 24px
    
    // Set initial active card
    updateActiveCard();
    updateProgressBar();
    
    // Event listeners for next and previous buttons
    nextBtn.addEventListener('click', () => {
      if (currentIndex < totalProjects - 1) {
        currentIndex++;
        updateSlider();
      } else {
        // Optional: Loop back to the first slide with a smooth animation
        animateResetToFirst();
      }
    });
    
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      } else {
        // Optional: Loop to the last slide with a smooth animation
        animateToLast();
      }
    });
    
    // Touch swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    
    projectWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    projectWrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe left
        nextBtn.click();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe right
        prevBtn.click();
      }
    }
    
    // Auto rotation every 5 seconds
    let autoSlideInterval = setInterval(() => {
      if (currentIndex < totalProjects - 1) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateSlider();
    }, 5000);
    
    // Pause auto rotation when hovering over the slider
    projectWrapper.addEventListener('mouseenter', () => {
      clearInterval(autoSlideInterval);
    });
    
    projectWrapper.addEventListener('mouseleave', () => {
      autoSlideInterval = setInterval(() => {
        if (currentIndex < totalProjects - 1) {
          currentIndex++;
        } else {
          currentIndex = 0;
        }
        updateSlider();
      }, 5000);
    });
    
    // Helper functions
    function updateSlider() {
      // Calculate the translation amount
      const translation = (cardWidth + cardGap) * currentIndex;
      projectWrapper.style.transform = `translateX(-${translation}px)`;
      
      updateActiveCard();
      updateProgressBar();
    }
    
    function updateActiveCard() {
      // Remove active class from all cards
      projectCards.forEach(card => {
        card.classList.remove('active');
      });
      
      // Add active class to current card
      projectCards[currentIndex].classList.add('active');
    }
    
    function updateProgressBar() {
      // Update progress bar width based on current index
      const progressPercentage = ((currentIndex + 1) / totalProjects) * 100;
      progressBar.style.width = `${progressPercentage}%`;
    }
    
    function animateResetToFirst() {
      // Animate to one past the last card
      projectWrapper.style.transition = 'transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)';
      projectWrapper.style.transform = `translateX(-${(cardWidth + cardGap) * totalProjects}px)`;
      
      // Then quickly reset to the first card after the animation
      setTimeout(() => {
        projectWrapper.style.transition = 'none';
        currentIndex = 0;
        projectWrapper.style.transform = 'translateX(0)';
        updateActiveCard();
        updateProgressBar();
        
        // Re-enable the transition after resetting
        setTimeout(() => {
          projectWrapper.style.transition = 'transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)';
        }, 50);
      }, 500);
    }
    
    function animateToLast() {
      currentIndex = totalProjects - 1;
      updateSlider();
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
      // Recalculate card width on window resize
      const newCardWidth = projectCards[0].offsetWidth;
      
      // Update card width and reposition slider
      if (newCardWidth !== cardWidth) {
        const translation = newCardWidth * currentIndex;
        projectWrapper.style.transform = `translateX(-${translation}px)`;
      }
    });
    
    // Preload images for smooth display
    projectCards.forEach(card => {
      const img = card.querySelector('img');
      if (img) {
        const preloadImg = new Image();
        preloadImg.src = img.src;
      }
    });
  }
  
  /**
   * Initialize and animate the skill bars
   */
  function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    // Animate skill bars when they come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skillBar = entry.target;
          const percentage = skillBar.getAttribute('data-percentage');
          const fillBar = skillBar.querySelector('.skill-bar-fill');
          
          // Animate the fill
          setTimeout(() => {
            fillBar.style.transform = `scaleX(${percentage / 100})`;
          }, 200);
          
          // Stop observing after animation
          observer.unobserve(skillBar);
        }
      });
    }, { threshold: 0.2 });
    
    // Observe each skill bar
    skillBars.forEach(bar => {
      observer.observe(bar);
    });
    
    // Add hover effect
    skillBars.forEach(bar => {
      bar.addEventListener('mouseenter', () => {
        const fillBar = bar.querySelector('.skill-bar-fill');
        fillBar.style.transition = 'transform 0.3s ease-out';
        fillBar.style.transform = 'scaleX(1)';
      });
      
      bar.addEventListener('mouseleave', () => {
        const fillBar = bar.querySelector('.skill-bar-fill');
        const percentage = bar.getAttribute('data-percentage');
        fillBar.style.transition = 'transform 0.5s ease-out';
        fillBar.style.transform = `scaleX(${percentage / 100})`;
      });
    });
  }
  
  /**
   * Initialize smooth scrolling for anchor links
   */
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        const headerOffset = 80; // Adjust based on your header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      });
    });
    
    // Back to top button functionality (if you have one)
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      });
      
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }
  
  // Additional effects and animations for a more impressive UI
  function initAdditionalEffects() {
    // Parallax effect on project card images
    document.addEventListener('mousemove', (e) => {
      const projectCards = document.querySelectorAll('.project-card.active');
      
      projectCards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        
        const moveX = (e.clientX - cardCenterX) / 30;
        const moveY = (e.clientY - cardCenterY) / 30;
        
        const image = card.querySelector('img');
        if (image) {
          image.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        }
      });
    });
    
    // Reset transforms when mouse leaves
    document.addEventListener('mouseleave', () => {
      const images = document.querySelectorAll('.project-card img');
      images.forEach(image => {
        image.style.transform = 'scale(1)';
      });
    });
  }
  
  // Call additional effects
  initAdditionalEffects();