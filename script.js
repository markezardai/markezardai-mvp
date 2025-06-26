// MarkezardAI Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // 1. Scroll-to-section functionality
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 2. Animate on scroll using IntersectionObserver
    const animateElements = document.querySelectorAll('[class*="animate-"]');
    
    if (animateElements.length > 0) {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: Stop observing after animation
                    // animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animateElements.forEach(el => {
            animationObserver.observe(el);
        });
    }

    // 3. CTA button pulse effect
    const ctaButton = document.querySelector('.btn-get-started');
    
    if (ctaButton) {
        let pulseInterval;
        
        const startPulse = () => {
            pulseInterval = setInterval(() => {
                ctaButton.classList.add('pulse-active');
                setTimeout(() => {
                    ctaButton.classList.remove('pulse-active');
                }, 600);
            }, 4000); // Pulse every 4 seconds
        };

        const stopPulse = () => {
            if (pulseInterval) {
                clearInterval(pulseInterval);
            }
        };

        // Start pulse on page load
        startPulse();

        // Stop pulse on hover, restart on mouse leave
        ctaButton.addEventListener('mouseenter', stopPulse);
        ctaButton.addEventListener('mouseleave', startPulse);
    }

    // 4. Back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);

    // Show/hide back to top button
    const toggleBackToTop = () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    // Back to top click handler
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Listen for scroll events
    window.addEventListener('scroll', toggleBackToTop);

    // 5. Mobile navigation toggle
    const navbar = document.querySelector('.navbar');
    const navLinksContainer = document.querySelector('.nav-links');
    
    // Create mobile menu button if not exists
    if (navbar && navLinksContainer) {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
        mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
        
        // Insert mobile button before nav links
        navbar.insertBefore(mobileMenuBtn, navLinksContainer);

        // Mobile menu toggle functionality
        const toggleMobileMenu = () => {
            navLinksContainer.classList.toggle('mobile-open');
            mobileMenuBtn.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.classList.toggle('menu-open');
        };

        mobileMenuBtn.addEventListener('click', toggleMobileMenu);

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('mobile-open')) {
                    toggleMobileMenu();
                }
            });
        });

        // Close mobile menu on window resize (if desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navLinksContainer.classList.contains('mobile-open')) {
                toggleMobileMenu();
            }
        });
    }

    // 6. Additional smooth scroll for any anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not(.nav-links a)');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // 7. Performance optimization: Throttle scroll events
    let ticking = false;
    
    function updateOnScroll() {
        toggleBackToTop();
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }

    // Replace scroll listener with throttled version
    window.removeEventListener('scroll', toggleBackToTop);
    window.addEventListener('scroll', requestTick);

    // 8. Initialize animations on page load
    const initAnimations = () => {
        // Trigger initial animations for elements already in viewport
        animateElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isInViewport) {
                el.classList.add('visible');
            }
        });
    };

    // Run after a short delay to ensure proper rendering
    setTimeout(initAnimations, 100);
});

// Add CSS for back-to-top button and mobile menu (if not in styles.css)
const additionalStyles = `
<style>
.back-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #00ffff, #a259ff);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 18px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(0,255,255,0.3);
}

.back-to-top.visible {
    opacity: 1;
    visibility: visible;
}

.back-to-top:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 25px rgba(0,255,255,0.4);
}

.mobile-menu-btn {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    z-index: 1001;
}

.mobile-menu-btn span {
    width: 25px;
    height: 3px;
    background: #00ffff;
    margin: 3px 0;
    transition: 0.3s;
    border-radius: 2px;
}

.mobile-menu-btn.active span:nth-child(1) {
    transform: rotate(-45deg) translate(-5px, 6px);
}

.mobile-menu-btn.active span:nth-child(2) {
    opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
    transform: rotate(45deg) translate(-5px, -6px);
}

@media (max-width: 768px) {
    .mobile-menu-btn {
        display: flex;
    }
    
    .nav-links {
        position: fixed;
        top: 0;
        right: -100%;
        width: 250px;
        height: 100vh;
        background: rgba(14,14,16,0.95);
        backdrop-filter: blur(10px);
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: right 0.3s ease;
        z-index: 1000;
    }
    
    .nav-links.mobile-open {
        right: 0;
    }
    
    body.menu-open {
        overflow: hidden;
    }
}

.pulse-active {
    animation: pulseGlow 0.6s ease-out !important;
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles); 