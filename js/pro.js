document.addEventListener('DOMContentLoaded', () => {
    const projectsWrapper = document.querySelector('.projects-wrapper');
    const projectCards = document.querySelectorAll('.project-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const progressBar = document.querySelector('.progress-bar');

    let currentIndex = 0;
    const totalProjects = projectCards.length;

    function updateProjectDisplay() {
        // Reset all project cards
        projectCards.forEach(card => {
            card.classList.remove('active');
        });

        // Set current and adjacent cards
        projectCards[currentIndex].classList.add('active');
        
        // Calculate transform based on current index
        const transformValue = -currentIndex * 100;
        projectsWrapper.style.transform = `translateX(${transformValue}%)`;

        // Update progress bar
        updateProgressBar();
    }

    function updateProgressBar() {
        const progress = (currentIndex / (totalProjects - 1)) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function nextProject() {
        currentIndex = (currentIndex + 1) % totalProjects;
        updateProjectDisplay();
    }

    function prevProject() {
        currentIndex = (currentIndex - 1 + totalProjects) % totalProjects;
        updateProjectDisplay();
    }

    // Auto-advance projects
    function autoAdvance() {
        nextProject();
    }

    // Event Listeners
    nextBtn.addEventListener('click', nextProject);
    prevBtn.addEventListener('click', prevProject);

    // Auto-advance every 5 seconds
    let autoAdvanceInterval = setInterval(autoAdvance, 5000);

    // Reset interval on hover to prevent unwanted advances
    projectsWrapper.addEventListener('mouseenter', () => {
        clearInterval(autoAdvanceInterval);
    });

    projectsWrapper.addEventListener('mouseleave', () => {
        autoAdvanceInterval = setInterval(autoAdvance, 5000);
    });

    // Initial display
    updateProjectDisplay();
});

document.addEventListener('DOMContentLoaded', () => {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    // Intersection Observer for skill bars
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const skillBarObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const percentage = skillBar.getAttribute('data-percentage');
                const fillBar = skillBar.querySelector('.skill-bar-fill');
                
                // Set the width of the fill bar
                fillBar.style.setProperty('--percentage', `${percentage}%`);
                fillBar.style.width = `${percentage}%`;
                
                // Remove the observer after animation
                observer.unobserve(skillBar);
            }
        });
    }, observerOptions);

    // Observe each skill bar
    skillBars.forEach(skillBar => {
        skillBarObserver.observe(skillBar);
    });

    // Optional: Add hover and interaction effects
    skillBars.forEach(skillBar => {
        skillBar.addEventListener('mouseenter', () => {
            skillBar.classList.add('hover-active');
        });

        skillBar.addEventListener('mouseleave', () => {
            skillBar.classList.remove('hover-active');
        });
    });
});