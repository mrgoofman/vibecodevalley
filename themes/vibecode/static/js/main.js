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

/**
 * Track scroll depth for analytics
 * Fires events at 25%, 50%, 75%, and 100% scroll depth
 */
(function initScrollDepthTracking() {
    const scrollDepths = {
        '25': false,
        '50': false,
        '75': false,
        '100': false
    };

    function trackScrollDepth() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || window.pageYOffset;
        const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

        // Check each depth threshold
        Object.keys(scrollDepths).forEach(depth => {
            if (scrollPercent >= parseInt(depth) && !scrollDepths[depth]) {
                scrollDepths[depth] = true;

                // Send to Google Analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth', {
                        'event_category': 'engagement',
                        'event_label': depth + '%',
                        'value': parseInt(depth)
                    });
                }

                console.log('Scroll depth tracked:', depth + '%');
            }
        });
    }

    // Throttle scroll events for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(trackScrollDepth, 100);
    });

    // Track on page load (in case user refreshes mid-page)
    window.addEventListener('load', trackScrollDepth);
})();

/**
 * Show/hide header CTA button based on scroll position
 */
(function initHeaderCTA() {
    const headerCTA = document.getElementById('header-cta');

    if (!headerCTA) return;

    function checkScroll() {
        const heroSection = document.querySelector('.hero');
        const ctaSection = document.querySelector('.section-cta');
        if (!heroSection) return;

        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;

        // Show CTA after hero section
        const showCTA = window.scrollY > heroBottom;

        // Hide CTA when reaching CTA section
        let hideCTA = false;
        if (ctaSection) {
            const ctaSectionTop = ctaSection.offsetTop;
            hideCTA = scrollPosition > ctaSectionTop;
        }

        if (showCTA && !hideCTA) {
            headerCTA.classList.add('visible');
        } else {
            headerCTA.classList.remove('visible');
        }
    }

    // Check on scroll
    window.addEventListener('scroll', checkScroll);

    // Check on load
    window.addEventListener('load', checkScroll);
})();

/**
 * Scroll to CTA section function
 */
function scrollToFooter() {
    const ctaSection = document.querySelector('.section-cta');
    if (ctaSection) {
        ctaSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Focus on email input after scroll
        setTimeout(() => {
            const emailInput = document.getElementById('footer-email');
            if (emailInput) {
                emailInput.focus();
            }
        }, 800);
    }
}
