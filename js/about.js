document.addEventListener('DOMContentLoaded', () => {
    // Cube Rotation Controls
    const cube = document.querySelector('.cube');
    const rotateCubeBtn = document.getElementById('rotate-cube');
    const stopCubeBtn = document.getElementById('stop-cube');
    let cubeRotationInterval;

    rotateCubeBtn.addEventListener('click', () => {
        // Randomly rotate the cube
        const randomX = Math.floor(Math.random() * 360);
        const randomY = Math.floor(Math.random() * 360);
        cube.style.transform = `rotateX(${randomX}deg) rotateY(${randomY}deg)`;
    });

    stopCubeBtn.addEventListener('click', () => {
        // Stop rotation
        cube.style.animation = 'none';
    });

    // Animated Timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // Floating Icons Interaction
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2)';
        });

        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1)';
        });
    });

    // Skill Progress Bar Animation
    const progressBars = document.querySelectorAll('.progress');
    const observerProgressOptions = {
        threshold: 0.5
    };

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const percentage = progressBar.style.width;
                progressBar.style.width = '0';
                setTimeout(() => {
                    progressBar.style.width = percentage;
                }, 100);
            }
        });
    }, observerProgressOptions);

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
});