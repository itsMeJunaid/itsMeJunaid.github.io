// projects-carousel.js - Projects Slider for AI/ML Portfolio

document.addEventListener('DOMContentLoaded', () => {
    // Initialize projects carousel
    initProjectsCarousel();
});

function initProjectsCarousel() {
    const slider = document.querySelector('.project-slider');
    const slides = document.querySelectorAll('.project-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slider || slides.length === 0 || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // Initially hide all slides except the first one
    for (let i = 1; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    
    // Clone slides for infinite scrolling
    const cloneSlides = () => {
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            clone.style.display = 'none';
            slider.appendChild(clone);
        });
    };
    
    // Show current slide with animation
    const showSlide = (index) => {
        // Hide all slides with fade out effect
        slides.forEach(slide => {
            gsap.to(slide, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    slide.style.display = 'none';
                }
            });
        });
        
        // Show the target slide with fade in effect
        gsap.fromTo(slides[index], 
            { opacity: 0, display: 'flex' },
            { 
                opacity: 1, 
                duration: 0.5,
                ease: 'power2.inOut'
            }
        );
    };
    
    // Navigate to the next slide
    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    };
    
    // Navigate to the previous slide
    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        showSlide(currentIndex);
    };
    
    // Set up click events for navigation buttons
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Add swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    const handleSwipe = () => {
        const minSwipeDistance = 50;
        if (touchEndX < touchStartX - minSwipeDistance) {
            // Swipe left - show next slide
            nextSlide();
        } else if (touchEndX > touchStartX + minSwipeDistance) {
            // Swipe right - show previous slide
            prevSlide();
        }
    };
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });
    
    // Auto-advance slides every 5 seconds
    let autoSlide = setInterval(nextSlide, 5000);
    
    // Pause auto-slide on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
    });
    
    slider.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, 5000);
    });
    
    // Add slide indicators/dots
    const addSlideIndicators = () => {
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.classList.add('slide-indicators');
        
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                currentIndex = i;
                showSlide(currentIndex);
                updateIndicators();
            });
            
            indicatorsContainer.appendChild(indicator);
        }
        
        slider.appendChild(indicatorsContainer);
    };
    
    // Update slide indicators to reflect current slide
    const updateIndicators = () => {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, i) => {
            if (i === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    };
    
    // Initialize slide indicators
    addSlideIndicators();
    
    // Add hover effect for project cards
    slides.forEach(slide => {
        slide.addEventListener('mouseenter', () => {
            gsap.to(slide, {
                y: -10,
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
                duration: 0.3
            });
        });
        
        slide.addEventListener('mouseleave', () => {
            gsap.to(slide, {
                y: 0,
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                duration: 0.3
            });
        });
    });
}