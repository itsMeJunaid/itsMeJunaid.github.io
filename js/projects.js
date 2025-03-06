/**
 * Project Grid and Modal Functionality
 * Handles project filtering, modal display, and image optimization
 */

document.addEventListener('DOMContentLoaded', function() {
    // Project data - can be expanded with more details
    const projectData = [
        {
            id: 'advanced-object-detection',
            title: 'Advanced Object Detection',
            category: 'computer-vision',
            image: 'assets/images/obj.png',
            description: 'A real-time object detection system using deep learning techniques to identify and track multiple objects in videos and live camera feeds. The system utilizes YOLO (You Only Look Once) architecture and achieves state-of-the-art accuracy while maintaining high processing speeds.',
            technologies: ['PyTorch', 'OpenCV', 'YOLO', 'Python', 'CUDA'],
            github: 'https://github.com/yourusername/object-detection',
            demo: 'https://your-demo-link.com/object-detection'
        },
        {
            id: 'sentiment-analysis',
            title: 'Sentiment Analysis Platform',
            category: 'nlp',
            image: 'assets/images/sen.png',
            description: 'An advanced sentiment analysis platform that detects emotions and classifies sentiment in text data using transformer-based models. The system can process large volumes of customer feedback, social media posts, and reviews to extract actionable insights about brand perception and customer satisfaction.',
            technologies: ['BERT', 'TensorFlow', 'spaCy', 'Python', 'Flask'],
            github: 'https://github.com/yourusername/sentiment-analysis',
            demo: 'https://your-demo-link.com/sentiment-analysis'
        },
        {
            id: 'predictive-analytics',
            title: 'Predictive Analytics Engine',
            category: 'ml',
            image: 'assets/images/da.png',
            description: 'A machine learning-powered predictive analytics engine that forecasts business trends and outcomes based on historical data. The system uses ensemble methods to improve accuracy and provides interactive visualizations for better decision-making.',
            technologies: ['Scikit-learn', 'Pandas', 'XGBoost', 'Matplotlib', 'Streamlit'],
            github: 'https://github.com/yourusername/predictive-analytics',
            demo: 'https://your-demo-link.com/predictive-analytics'
        },
        {
            id: 'neural-style-transfer',
            title: 'Neural Style Transfer',
            category: 'deep-learning',
            image: 'assets/images/nst.png',
            description: 'An artistic image transformation application using generative adversarial networks to apply the style of one image to the content of another. The system offers various pre-trained styles and allows users to upload their own style images for unique artistic creations.',
            technologies: ['TensorFlow', 'GANs', 'Keras', 'Python', 'JavaScript'],
            github: 'https://github.com/yourusername/neural-style-transfer',
            demo: 'https://your-demo-link.com/neural-style-transfer'
        },
        {
            id: 'medical-image-segmentation',
            title: 'Medical Image Segmentation',
            category: 'computer-vision',
            image: 'assets/images/med.png',
            description: 'An automated tumor detection and boundary segmentation system for medical imaging. Using U-Net architecture, this deep learning solution helps medical professionals identify and measure abnormalities in MRI and CT scans with high precision.',
            technologies: ['U-Net', 'PyTorch', 'OpenCV', 'NumPy', 'DICOM'],
            github: 'https://github.com/yourusername/medical-segmentation',
            demo: 'https://your-demo-link.com/medical-segmentation'
        }
    ];

    // DOM Elements
    const projectsGrid = document.querySelector('.projects-grid');
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('projectModal');
    const closeModal = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modalProjectTitle');
    const modalImage = document.getElementById('modalProjectImage');
    const modalDescription = document.getElementById('modalProjectDescription');
    const modalTechnologies = document.getElementById('modalTechnologies');
    const githubLink = document.getElementById('githubLink');
    const demoLink = document.getElementById('demoLink');

    // Add filter buttons if not already present in HTML
    if (!document.querySelector('.project-filter')) {
        const filterSection = document.createElement('div');
        filterSection.className = 'project-filter';
        filterSection.innerHTML = `
            <button class="filter-btn active" data-filter="all">All Projects</button>
            <button class="filter-btn" data-filter="computer-vision">Computer Vision</button>
            <button class="filter-btn" data-filter="nlp">NLP</button>
            <button class="filter-btn" data-filter="ml">Machine Learning</button>
            <button class="filter-btn" data-filter="deep-learning">Deep Learning</button>
        `;
        projectsGrid.parentNode.insertBefore(filterSection, projectsGrid);
        
        // Add event listeners to filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                filterProjects(filter);
            });
        });
    }

    // Filter projects based on category
    function filterProjects(filter) {
        projectCards.forEach(card => {
            // Reset animations
            card.classList.remove('fade-in');
            void card.offsetWidth; // Trigger reflow
            
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Set up project cards to open modal when clicked
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.id || this.getAttribute('data-category') + '-' + 
                                Array.from(projectsGrid.children).indexOf(this);
            
            // Find the project data
            const project = projectData.find(p => p.id === projectId) || 
                            projectData.find(p => p.category === this.getAttribute('data-category'));
            
            if (project) {
                // Populate the modal with project data
                modalTitle.textContent = project.title;
                modalImage.src = project.image;
                modalImage.alt = project.title;
                modalDescription.textContent = project.description;
                
                // Add technologies
                modalTechnologies.innerHTML = '';
                project.technologies.forEach(tech => {
                    const span = document.createElement('span');
                    span.textContent = tech;
                    modalTechnologies.appendChild(span);
                });
                
                // Set links
                githubLink.href = project.github;
                demoLink.href = project.demo;
            } else {
                // Fallback if project data not found
                const title = this.querySelector('h3')?.textContent || 'Project Details';
                const description = this.querySelector('p')?.textContent || 'Detailed information about this project.';
                const techElements = this.querySelectorAll('.project-tech span');
                
                modalTitle.textContent = title;
                modalImage.src = this.querySelector('img').src;
                modalImage.alt = title;
                modalDescription.textContent = description;
                
                // Add technologies
                modalTechnologies.innerHTML = '';
                techElements.forEach(tech => {
                    const span = document.createElement('span');
                    span.textContent = tech.textContent;
                    modalTechnologies.appendChild(span);
                });
                
                // Set generic links
                githubLink.href = '#';
                demoLink.href = '#';
            }
            
            // Show modal with animation
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    });

    // Close modal when clicking the close button or outside the modal
    closeModal.addEventListener('click', closeProjectModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProjectModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });
    
    function closeProjectModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }, 300);
    }

    // Lazy loading for project images to improve performance
    if ('IntersectionObserver' in window) {
        const imgOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: "0px 0px 100px 0px"
        };
        
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src') || img.src;
                    
                    // If there's a data-src attribute, use it
                    if (img.getAttribute('data-src')) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    img.onload = () => {
                        img.classList.add('loaded');
                    };
                    
                    observer.unobserve(img);
                }
            });
        }, imgOptions);
        
        // Observe all project images
        document.querySelectorAll('.project-image img').forEach(img => {
            imgObserver.observe(img);
        });
    }

    // Create fade-in animation for projects on page load
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, 100 * index);
    });

    // Handle image optimization and fallbacks
    document.querySelectorAll('.project-image img').forEach(img => {
        // Set a fallback in case image fails to load
        img.onerror = function() {
            this.src = 'assets/images/placeholder.jpg';
            console.warn(`Failed to load image: ${this.alt}`);
        };
        
        // Add loading attribute for better performance
        img.loading = 'lazy';
    });
});

// Project Showcase and Skills Animation JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Projects Slider
    initProjectsSlider();
    
    // Initialize Skills Animation
    initSkillsAnimation();
    
    // Initialize Smooth Scrolling
    initSmoothScrolling();
});

// Project Slider Functionality
function initProjectsSlider() {
    const wrapper = document.querySelector('.projects-wrapper');
    const cards = document.querySelectorAll('.project-card');
    const prevBtn = document.querySelector('.projects-slider .prev-btn');
    const nextBtn = document.querySelector('.projects-slider .next-btn');
    const progressBar = document.querySelector('.project-progress .progress-bar');
    
    if (!wrapper || !cards.length) return;
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // Set initial active state
    updateActiveCard();
    updateProgressBar();
    
    // Add click event listeners to navigation buttons
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalCards;
        slideToCard();
    });
    
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        slideToCard();
    });
    
    // Add touch swipe functionality
    let startX, moveX;
    
    wrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    wrapper.addEventListener('touchmove', (e) => {
        moveX = e.touches[0].clientX;
    });
    
    wrapper.addEventListener('touchend', () => {
        if (!startX || !moveX) return;
        
        const diff = startX - moveX;
        
        if (Math.abs(diff) > 50) { // Threshold for swipe
            if (diff > 0) {
                // Swipe left, go to next
                currentIndex = (currentIndex + 1) % totalCards;
            } else {
                // Swipe right, go to prev
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            }
            slideToCard();
        }
        
        startX = null;
        moveX = null;
    });
    
    // Auto slide every 5 seconds
    let autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalCards;
        slideToCard();
    }, 5000);
    
    // Pause auto-slide on hover
    const sliderContainer = document.querySelector('.projects-slider');
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalCards;
            slideToCard();
        }, 5000);
    });
    
    // Function to slide to current card
    function slideToCard() {
        updateActiveCard();
        updateProgressBar();
        
        // Calculate scroll position based on card width and current index
        const cardWidth = cards[0].offsetWidth + parseFloat(getComputedStyle(cards[0]).marginRight);
        wrapper.scrollTo({
            left: cardWidth * currentIndex,
            behavior: 'smooth'
        });
    }
    
    // Update active class for current card
    function updateActiveCard() {
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }
    
    // Update progress bar
    function updateProgressBar() {
        const progress = (currentIndex / (totalCards - 1)) * 100;
        progressBar.style.transform = `translateX(${progress}%)`;
    }
}

// Skills Animation
function initSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    if (!skillBars.length) return;
    
    // Create Intersection Observer to trigger animation when skills come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const percentage = skillBar.getAttribute('data-percentage');
                const fillBar = skillBar.querySelector('.skill-bar-fill');
                
                // Set width via CSS variable for the animation
                fillBar.style.setProperty('--percent', `${percentage}%`);
                skillBar.classList.add('animated');
                
                // Unobserve after animation is triggered
                observer.unobserve(skillBar);
            }
        });
    }, {
        threshold: 0.2 // Trigger when at least 20% of the element is visible
    });
    
    // Observe each skill bar
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Smooth Scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerOffset = 100; // Offset for fixed header
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Add parallax effect to section backgrounds
document.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.projects-showcase, .skills-section');
    
    sections.forEach(section => {
        const scrollPosition = window.pageYOffset;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        // Check if section is in viewport
        if (scrollPosition > sectionTop - window.innerHeight && 
            scrollPosition < sectionTop + sectionHeight) {
            
            const parallaxSpeed = 0.5;
            const yPos = (scrollPosition - sectionTop) * parallaxSpeed;
            
            // Apply subtle parallax effect
            section.style.backgroundPosition = `center ${yPos}px`;
        }
    });
});

// Add scroll animations for elements entering viewport
function animateOnScroll() {
    const elementsToAnimate = document.querySelectorAll('.project-card, .skill-category, .section-header');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elementsToAnimate.forEach(element => {
        // Add base animation class
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
}

// Initialize animations on scroll
window.addEventListener('load', () => {
    animateOnScroll();
});