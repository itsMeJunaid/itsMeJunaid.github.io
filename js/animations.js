// animations.js - UI Animations for AI/ML Portfolio

document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP animations
    initGsapAnimations();
    
    // Initialize scroll-triggered animations
    initScrollAnimations();
    
    // Initialize text typing effect
    initTypingEffect();
    
    // Initialize skill bar animations
    initSkillBarsAnimation();
    
    // Initialize glitch text effect
    initGlitchText();
    
    // Initialize tilt effect for cards
    initTiltEffect();
});

// GSAP Animations for main elements
function initGsapAnimations() {
    // Hero section animations
    gsap.from('.hero-content h1', {
        duration: 1.2,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });
    
    gsap.from('.typing-text', {
        duration: 1.2,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.3
    });
    
    gsap.from('.cta-buttons', {
        duration: 1,
        y: 20,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.6
    });
    
    // Stagger animations for navbar items
    gsap.from('.nav-links ul li', {
        duration: 0.8,
        y: -20,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out'
    });
    
    // Logo animation
    gsap.from('.logo', {
        duration: 1,
        x: -30,
        opacity: 0,
        ease: 'power2.out'
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    // Create animation for section headers
    const sectionHeaders = document.querySelectorAll('section h2');
    sectionHeaders.forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            duration: 1,
            y: 30,
            opacity: 0,
            ease: 'power3.out'
        });
    });
    
    // Animate expertise cards with stagger effect
    gsap.from('.card', {
        scrollTrigger: {
            trigger: '.cards-container',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.15,
        ease: 'power3.out'
    });
    
    // Project cards animation
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects',
            start: 'top 60%',
            toggleActions: 'play none none none'
        },
        duration: 1,
        x: -50,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
    });
}

// Typing effect for the subtitle in hero section
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
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
    
    // Start typing after a small delay
    setTimeout(typeWriter, 1000);
}

// Animate skill bars on scroll
function initSkillBarsAnimation() {
    const skillBars = document.querySelectorAll('.progress');
    
    skillBars.forEach(bar => {
        const value = bar.getAttribute('data-value');
        
        // Initially set width to 0
        gsap.set(bar, { width: '0%' });
        
        // Animate to final width when scrolled into view
        gsap.to(bar, {
            scrollTrigger: {
                trigger: bar,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            width: value,
            duration: 1.5,
            ease: 'power3.out'
        });
    });
}

// Glitch text effect for main heading
function initGlitchText() {
    const glitchText = document.querySelector('.glitch-text');
    if (!glitchText) return;
    
    // Set data-text attribute for pseudo-elements
    const text = glitchText.textContent;
    glitchText.setAttribute('data-text', text);
    
    // Random glitch effect at intervals
    const randomGlitch = () => {
        glitchText.classList.add('active');
        
        setTimeout(() => {
            glitchText.classList.remove('active');
        }, 200);
        
        // Schedule next glitch
        setTimeout(randomGlitch, Math.random() * 10000 + 3000);
    };
    
    // Start random glitch effect
    setTimeout(randomGlitch, 3000);
}

// Initialize tilt effect for cards
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    if (tiltElements.length > 0 && typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(tiltElements, {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
        });
    }
}