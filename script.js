// MarkezardAI Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // 1. Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // 2. IntersectionObserver for scroll-reveal animations
    const animatedSelectors = [
        '.animate-slideFadeIn',
        '.animate-floatIcon',
        '.animate-floatBlob',
        '.animate-iconBounce',
        '.animate-fadeInDown'
    ];
    const animatedElements = document.querySelectorAll(animatedSelectors.join(','));
    if (animatedElements.length > 0) {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }

    // 3. CTA Button Pulse
    const ctaButton = document.querySelector('.btn-get-started');
    if (ctaButton) {
        let pulseInterval;
        const startPulse = () => {
            pulseInterval = setInterval(() => {
                if (!ctaButton.matches(':hover')) {
                    ctaButton.classList.add('pulse-active');
                    setTimeout(() => {
                        ctaButton.classList.remove('pulse-active');
                    }, 600);
                }
            }, 4000);
        };
        const stopPulse = () => {
            if (pulseInterval) clearInterval(pulseInterval);
        };
        startPulse();
        ctaButton.addEventListener('mouseenter', stopPulse);
        ctaButton.addEventListener('mouseleave', startPulse);
    }

    // 4. Back-to-Top Button
    let backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTopBtn);
    }
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    function toggleBackToTop() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    // 5. Mobile Navigation
    const navbar = document.querySelector('.navbar-glass');
    const navLinksContainer = document.querySelector('.nav-links');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const navLinks = document.querySelectorAll('.nav-links a');
    function toggleMobileMenu() {
        navLinksContainer.classList.toggle('mobile-open');
        hamburgerBtn.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }
    if (hamburgerBtn && navLinksContainer && mobileNavOverlay) {
        hamburgerBtn.addEventListener('click', toggleMobileMenu);
        mobileNavOverlay.addEventListener('click', toggleMobileMenu);
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('mobile-open')) {
                    toggleMobileMenu();
                }
            });
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900 && navLinksContainer.classList.contains('mobile-open')) {
                toggleMobileMenu();
            }
        });
    }

    // 6. Throttle scroll-based animations and animate nav background
    let ticking = false;
    function onScroll() {
        toggleBackToTop();
        // Animate navbar background on scroll
        if (navbar) {
            if (window.scrollY > 24) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        ticking = false;
    }
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }
    window.addEventListener('scroll', requestTick);

    // Accessibility: ARIA for hamburger
    if (hamburgerBtn) {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.addEventListener('click', function() {
            const expanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            hamburgerBtn.setAttribute('aria-expanded', String(!expanded));
        });
    }

    // Initial state
    onScroll();

    // Animate nav items on load
    document.querySelectorAll('.nav-links a').forEach((el, i) => {
        el.classList.add('animate-fadeInDown', `animate-delay-${i+1}`);
    });
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