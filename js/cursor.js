// cursor.js - Custom Cursor Effects for AI/ML Portfolio

document.addEventListener('DOMContentLoaded', () => {
    // Initialize custom cursor
    initCustomCursor();
});

function initCustomCursor() {
    const cursor = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    if (!cursor || !cursorOutline) return;
    
    // Update cursor position on mouse move
    document.addEventListener('mousemove', (e) => {
        // Get mouse position
        const posX = e.clientX;
        const posY = e.clientY;
        
        // Animate cursor dot to follow mouse exactly
        cursor.style.transform = `translate(${posX}px, ${posY}px)`;
        
        // Animate cursor outline with slight delay for smooth effect
        cursorOutline.animate({
            transform: `translate(${posX}px, ${posY}px)`
        }, { 
            duration: 500, 
            fill: 'forwards',
            easing: 'ease-out' 
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseout', () => {
        cursor.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    });
    
    document.addEventListener('mouseover', () => {
        cursor.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    });
    
    // Add special effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .card, .project-card, [data-tilt]');
    
    interactiveElements.forEach(el => {
        // Enlarge cursor on hover
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursor.style.width = '6px';
            cursor.style.height = '6px';
        });
        
        // Return to normal size on mouse leave
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursor.style.width = '8px';
            cursor.style.height = '8px';
        });
        
        // Add click effect
        el.addEventListener('mousedown', () => {
            cursorOutline.style.width = '35px';
            cursorOutline.style.height = '35px';
        });
        
        el.addEventListener('mouseup', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
        });
    });
    
    // Special effect for text elements
    const textElements = document.querySelectorAll('h1, h2, h3, p');
    
    textElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.backgroundColor = 'rgba(110, 68, 255, 0.1)';
            cursorOutline.style.borderWidth = '1px';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.borderWidth = '2px';
        });
    });
}