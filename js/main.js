// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links ul li');
    
    // Mobile Menu Toggle
    burger.addEventListener('click', () => {
        // Toggle Nav
        navLinks.classList.toggle('active');
        
        // Burger Animation
        burger.classList.toggle('active');

        // Links Animation
        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `slideIn 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });
    
    // Close Menu When Link is Clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            burger.classList.remove('active');
            
            links.forEach(l => {
                l.style.animation = '';
            });
        });
    });
    
    // Close Menu When Clicking Outside
    document.addEventListener('click', (event) => {
        const isClickInsideNavbar = burger.contains(event.target) || 
                                     navLinks.contains(event.target);
        
        if (!isClickInsideNavbar && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            burger.classList.remove('active');
            
            links.forEach(l => {
                l.style.animation = '';
            });
        }
    });
    
    // Initialize tilt effect for cards
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    if (typeof VanillaTilt !== 'undefined' && tiltElements.length > 0) {
        VanillaTilt.init(tiltElements, {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.2
        });
    }
    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Typing effect for hero text
    const typingText = document.querySelector('.typing-text');
    
    if (typingText && typeof gsap !== 'undefined') {
        const text = typingText.textContent;
        typingText.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing animation after a small delay
        setTimeout(typeWriter, 500);
    }
    
    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.card, .project-card, .skill, h2, .hero-content');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    // Initialize animation if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        animateOnScroll();
    }
    
    // Skill progress bars animation
    const animateProgressBars = () => {
        const progressBars = document.querySelectorAll('.progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Get the width from the data-value attribute
                    const width = entry.target.getAttribute('data-value');
                    entry.target.style.width = '0%';
                    
                    // Animate after a small delay
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 300);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    };
    
    // Initialize progress bars animation
    animateProgressBars();
    
    // Add glitch effect to the title
    const glitchText = document.querySelector('.glitch-text');
    
    if (glitchText) {
        // Set the data-text attribute to match the inner text
        glitchText.setAttribute('data-text', glitchText.textContent);
    }
    
    // Form validation for contact form
    const contactForm = document.querySelector('form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let valid = true;
            const inputs = contactForm.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                if (input.required && !input.value.trim()) {
                    valid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
                
                // Validate email format
                if (input.type === 'email' && input.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        valid = false;
                        input.classList.add('error');
                    }
                }
            });
            
            if (valid) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                // Add success message after a delay (in a real app, this would be after AJAX call)
                setTimeout(() => {
                    const successMsg = document.createElement('div');
                    successMsg.className = 'success-message';
                    successMsg.textContent = 'Message sent successfully!';
                    contactForm.appendChild(successMsg);
                    
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Remove success message after 3 seconds
                    setTimeout(() => {
                        successMsg.style.opacity = '0';
                        setTimeout(() => {
                            successMsg.remove();
                        }, 300);
                    }, 3000);
                }, 1500);
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.required && !input.value.trim()) {
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
                
                // Validate email format
                if (input.type === 'email' && input.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        input.classList.add('error');
                    }
                }
            });
        });
    }
    
    // Dark/light theme toggle (if implemented)
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            
            // Save preference to localStorage
            const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
        });
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
    }
});

function smoothScroll(target, duration) {
    const targetElement = document.querySelector(target);
    const startPosition = window.pageYOffset;
    const targetPosition = targetElement.getBoundingClientRect().top;
    const startTime = performance.now();

    function animation(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        window.scrollTo(0, startPosition + targetPosition * easeInOutQuad(progress));

        if (elapsedTime < duration) {
            requestAnimationFrame(animation);
        }
    }

    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    requestAnimationFrame(animation);
}

// Apply the smooth scroll function to all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        smoothScroll(this.getAttribute("href"), 1000); // 1000ms = 1 second
    });
});
