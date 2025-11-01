// SIX7ONE8 RESPITE Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    showFieldError(field, 'This field is required');
                } else {
                    clearFieldError(field);
                }
            });
            
            // Email validation
            const emailField = document.getElementById('email');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    showFieldError(emailField, 'Please enter a valid email address');
                }
            }
            
            // Phone validation
            const phoneField = document.getElementById('phone');
            if (phoneField && phoneField.value) {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                const cleanPhone = phoneField.value.replace(/[\s\-\(\)\.]/g, '');
                if (cleanPhone.length < 10) {
                    isValid = false;
                    showFieldError(phoneField, 'Please enter a valid phone number');
                }
            }
            
            if (isValid) {
                // Create email body with form data
                const formData = new FormData(contactForm);
                let emailBody = "New Contact Form Submission from SIX7ONE8 RESPITE Website:\n\n";
                
                for (let [key, value] of formData.entries()) {
                    if (value.trim()) {
                        emailBody += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}\n`;
                    }
                }
                
                // Create mailto link
                const subject = encodeURIComponent("New Contact Form - SIX7ONE8 RESPITE");
                const body = encodeURIComponent(emailBody);
                const mailtoLink = `mailto:SIX7ONE8@ICLOUD.COM?subject=${subject}&body=${body}`;
                
                // Open email client
                window.location.href = mailtoLink;
                
                // Show success message
                showSuccessMessage();
                
                // Reset form after a delay
                setTimeout(() => {
                    contactForm.reset();
                }, 2000);
            } else {
                // Scroll to first error
                const firstError = contactForm.querySelector('.form-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
        
        // Real-time validation for email and phone
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('blur', validateEmail);
        }
        
        const phoneField = document.getElementById('phone');
        if (phoneField) {
            phoneField.addEventListener('input', formatPhone);
            phoneField.addEventListener('blur', validatePhone);
        }
    }
    
    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .feature, .team-member, .faq-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // FAQ Toggle (if on about page)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        if (question) {
            question.style.cursor = 'pointer';
            question.addEventListener('click', function() {
                const answer = item.querySelector('p');
                if (answer) {
                    const isVisible = answer.style.display !== 'none';
                    answer.style.display = isVisible ? 'none' : 'block';
                    question.style.color = isVisible ? '#2c5aa0' : '#28a745';
                }
            });
        }
    });
});

// Helper functions for form validation
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('span');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.display = 'block';
    errorElement.style.marginTop = '0.25rem';
    
    field.style.borderColor = '#dc3545';
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.form-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.style.borderColor = '';
}

function validateEmail() {
    const emailField = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailField.value && !emailRegex.test(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
    } else {
        clearFieldError(emailField);
    }
}

function formatPhone() {
    const phoneField = document.getElementById('phone');
    let value = phoneField.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
    }
    
    phoneField.value = value;
}

function validatePhone() {
    const phoneField = document.getElementById('phone');
    const cleanPhone = phoneField.value.replace(/\D/g, '');
    
    if (phoneField.value && cleanPhone.length < 10) {
        showFieldError(phoneField, 'Please enter a valid 10-digit phone number');
    } else {
        clearFieldError(phoneField);
    }
}

function showSuccessMessage() {
    // Create success message overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        margin: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
    messageBox.innerHTML = `
        <div style="color: #28a745; font-size: 3rem; margin-bottom: 1rem;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3 style="color: #1e293b; margin-bottom: 1rem;">Email Client Opening!</h3>
        <p style="margin-bottom: 1.5rem; color: #666;">Your email client should open with your message pre-filled. Please send the email to complete your inquiry to SIX7ONE8 RESPITE.</p>
        <button onclick="this.closest('.success-overlay').remove()" 
                style="background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 600;">
            Close
        </button>
    `;
    
    overlay.className = 'success-overlay';
    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.remove();
        }
    }, 5000);
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

// Phone number click tracking (for analytics)
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="tel:"]') || e.target.closest('a[href^="tel:"]')) {
        // In a real implementation, you might track this event
        console.log('Phone number clicked');
    }
});

// Scroll to top functionality
let scrollToTopBtn;

function createScrollToTopButton() {
    scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2c5aa0;
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 4px 15px rgba(44, 90, 160, 0.3);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(scrollToTopBtn);
}

window.addEventListener('scroll', function() {
    if (!scrollToTopBtn) {
        createScrollToTopButton();
    }
    
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

// Preload images for better performance
function preloadImages() {
    const imageUrls = [
        // Add any actual image URLs here when you have them
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Call preload on page load
window.addEventListener('load', preloadImages);

// Service worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed');
        });
    });
}