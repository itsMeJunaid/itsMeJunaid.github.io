document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Disable button & show loading
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                let response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    this.reset();
                    showFormMessage('success', 'Your message has been sent successfully!');
                } else {
                    showFormMessage('error', 'Error sending message. Please try again.');
                }
            } catch (error) {
                showFormMessage('error', 'Network error. Please try again.');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        // Set initial state
        answer.style.maxHeight = "0px";
        answer.style.opacity = "0";
        answer.style.overflow = "hidden";
        answer.style.transition = "max-height 0.3s ease-out, opacity 0.3s ease-out";

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items before opening the new one
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = "0px";
                    otherAnswer.style.opacity = "0";
                }
            });

            // Toggle current item
            item.classList.toggle('active');

            if (!isActive) {
                answer.style.maxHeight = answer.scrollHeight + "px";
                answer.style.opacity = "1";
            } else {
                answer.style.maxHeight = "0px";
                answer.style.opacity = "0";
            }
        });
    });
});

// Show form message (success/error)
function showFormMessage(type, message) {
    const formMessage = document.getElementById('form-message');
    formMessage.innerHTML = `<div class="form-message ${type}">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <p>${message}</p>
    </div>`;

    setTimeout(() => {
        formMessage.innerHTML = ''; // Clear message after 5 seconds
    }, 5000);
}
