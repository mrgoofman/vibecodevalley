/**
 * Vibecode Valley - Main JavaScript
 * Handles email form submissions
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Get both signup forms
    const heroForm = document.getElementById('hero-signup-form');
    const footerForm = document.getElementById('footer-signup-form');

    // Setup hero form
    if (heroForm) {
        setupForm(heroForm, 'hero-email', 'hero-message', 'hero');
    }

    // Setup footer form
    if (footerForm) {
        setupForm(footerForm, 'footer-email', 'footer-message', 'footer');
    }
});

/**
 * Setup form submission handler
 * @param {HTMLFormElement} form - The form element
 * @param {string} emailInputId - ID of the email input field
 * @param {string} messageId - ID of the message display element
 * @param {string} source - Source identifier ('hero' or 'footer')
 */
function setupForm(form, emailInputId, messageId, source) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const emailInput = document.getElementById(emailInputId);
        const messageDiv = document.getElementById(messageId);
        const submitButton = form.querySelector('button[type="submit"]');

        // Get email value
        const email = emailInput.value.trim();

        // Basic validation
        if (!email) {
            showMessage(messageDiv, 'Please enter your email address.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage(messageDiv, 'Please enter a valid email address.', 'error');
            return;
        }

        // Disable submit button
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Joining...';

        try {
            // Create form data
            const formData = new FormData();
            formData.append('email', email);
            formData.append('source', source);

            // Submit to API
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                showMessage(messageDiv, data.message, 'success');
                emailInput.value = ''; // Clear the input

                // Track conversion (if you want to add analytics later)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'signup', {
                        'event_category': 'waitlist',
                        'event_label': source
                    });
                }
            } else {
                showMessage(messageDiv, data.message, 'error');
            }

        } catch (error) {
            console.error('Subscription error:', error);
            showMessage(messageDiv, 'Something went wrong. Please try again later.', 'error');
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

/**
 * Display a message to the user
 * @param {HTMLElement} messageDiv - The message display element
 * @param {string} message - The message text
 * @param {string} type - Message type ('success' or 'error')
 */
function showMessage(messageDiv, message, type) {
    messageDiv.textContent = message;
    messageDiv.className = 'form-message ' + type;
    messageDiv.style.display = 'block';

    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Smooth scroll to section (if you want to add navigation later)
 */
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Add scroll animations (optional enhancement)
 */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// Optional: Initialize scroll animations on load
// Uncomment if you want fade-in animations for sections
// initScrollAnimations();
