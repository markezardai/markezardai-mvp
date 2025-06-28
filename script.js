/**
 * MarkezardAI Dashboard - Interactive JavaScript
 * Handles all animations, interactions, and user experience features
 */

class MarkezardDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.setupAnimationObserver();
        this.setupSidebarToggle();
        this.setupCopyToClipboard();
        this.setupDownloadJSON();
        this.setupScrollToTop();
        this.setupFormInteractions();
        this.setupPerformanceOptimizations();
    }

    /**
     * Animation Observer - Triggers animations on scroll
     */
    setupAnimationObserver() {
        const observerOptions = {
            threshold: 0.4, // 40% visibility
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once triggered
                }
            });
        }, observerOptions);

        // Observe all elements with animate-on-scroll class
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));
    }

    /**
     * Sidebar Toggle - Mobile navigation
     */
    setupSidebarToggle() {
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.dashboard-sidebar');
        const body = document.body;

        if (!sidebarToggle || !sidebar) return;

        // Toggle sidebar
        sidebarToggle.addEventListener('click', () => {
            const isOpen = sidebar.classList.contains('open');
            
            if (isOpen) {
                this.closeSidebar(sidebar, body);
            } else {
                this.openSidebar(sidebar, body);
            }
        });

        // Close sidebar when clicking on links (mobile)
        const sidebarLinks = sidebar.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeSidebar(sidebar, body);
                }
            });
        });

        // Close sidebar when clicking outside (mobile)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target) &&
                sidebar.classList.contains('open')) {
                this.closeSidebar(sidebar, body);
            }
        });
    }

    openSidebar(sidebar, body) {
        sidebar.classList.add('open');
        body.style.overflow = 'hidden'; // Prevent background scroll
        sidebarToggle.setAttribute('aria-expanded', 'true');
        
        // Add backdrop blur effect
        const backdrop = document.createElement('div');
        backdrop.className = 'sidebar-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 998;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        body.appendChild(backdrop);
        setTimeout(() => backdrop.style.opacity = '1', 10);
    }

    closeSidebar(sidebar, body) {
        sidebar.classList.remove('open');
        body.style.overflow = '';
        sidebarToggle.setAttribute('aria-expanded', 'false');
        
        // Remove backdrop
        const backdrop = document.querySelector('.sidebar-backdrop');
        if (backdrop) {
            backdrop.style.opacity = '0';
            setTimeout(() => backdrop.remove(), 300);
        }
    }

    /**
     * Copy to Clipboard functionality
     */
    setupCopyToClipboard() {
        const copyButtons = document.querySelectorAll('.btn-copy');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const codeBlock = button.closest('.code-output').querySelector('.output-code');
                const codeText = codeBlock.textContent || codeBlock.innerText;
                
                try {
                    await navigator.clipboard.writeText(codeText);
                    this.showCopySuccess(button);
                } catch (err) {
                    // Fallback for older browsers
                    this.fallbackCopyToClipboard(codeText, button);
                }
            });
        });
    }

    async fallbackCopyToClipboard(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess(button);
        } catch (err) {
            this.showCopyError(button);
        } finally {
            textArea.remove();
        }
    }

    showCopySuccess(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.style.background = 'rgba(0, 255, 0, 0.1)';
        button.style.borderColor = 'rgba(0, 255, 0, 0.3)';
        button.style.color = '#00ff00';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.style.borderColor = '';
            button.style.color = '';
        }, 2000);
    }

    showCopyError(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-times"></i> Failed!';
        button.style.background = 'rgba(255, 0, 0, 0.1)';
        button.style.borderColor = 'rgba(255, 0, 0, 0.3)';
        button.style.color = '#ff0000';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.style.borderColor = '';
            button.style.color = '';
        }, 2000);
    }

    /**
     * Download JSON functionality
     */
    setupDownloadJSON() {
        const downloadButtons = document.querySelectorAll('.btn-download');
        
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.generateAndDownloadJSON();
            });
        });
    }

    generateAndDownloadJSON() {
        // Collect form data
        const formData = this.collectFormData();
        
        // Create JSON object
        const jsonData = {
            campaign: {
                ...formData,
                generatedAt: new Date().toISOString(),
                platform: 'MarkezardAI Dashboard'
            }
        };
        
        // Convert to JSON string
        const jsonString = JSON.stringify(jsonData, null, 2);
        
        // Create and trigger download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `markezard-campaign-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show success feedback
        this.showDownloadSuccess();
    }

    collectFormData() {
        const form = document.querySelector('.builder-form');
        const formData = {};
        
        if (form) {
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.name || input.id) {
                    const key = input.name || input.id;
                    formData[key] = input.value;
                }
            });
        }
        
        return formData;
    }

    showDownloadSuccess() {
        const downloadButton = document.querySelector('.btn-download');
        if (!downloadButton) return;
        
        const originalText = downloadButton.innerHTML;
        downloadButton.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
        downloadButton.style.background = 'rgba(0, 240, 255, 0.2)';
        
        setTimeout(() => {
            downloadButton.innerHTML = originalText;
            downloadButton.style.background = '';
        }, 2000);
    }

    /**
     * Scroll to Top functionality
     */
    setupScrollToTop() {
        // Create back to top button if it doesn't exist
        if (!document.querySelector('.back-to-top')) {
            this.createBackToTopButton();
        }
        
        const backToTopBtn = document.querySelector('.back-to-top');
        if (!backToTopBtn) return;
        
        // Show/hide button based on scroll position
        let ticking = false;
        
        const updateBackToTopVisibility = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateBackToTopVisibility);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // Smooth scroll to top
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.smoothScrollToTop();
        });
    }

    createBackToTopButton() {
        const button = document.createElement('button');
        button.className = 'back-to-top';
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
        button.setAttribute('aria-label', 'Back to top');
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00f0ff, #3ecfff);
            border: none;
            color: #0f1117;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index: 1000;
            box-shadow: 0 4px 16px rgba(0, 240, 255, 0.3);
        `;
        
        document.body.appendChild(button);
        
        // Add CSS for visible state
        const style = document.createElement('style');
        style.textContent = `
            .back-to-top.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            .back-to-top:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(0, 240, 255, 0.4);
            }
        `;
        document.head.appendChild(style);
    }

    smoothScrollToTop() {
        const scrollToTop = () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScroll > 0) {
                window.requestAnimationFrame(scrollToTop);
                window.scrollTo(0, currentScroll - currentScroll / 8);
            }
        };
        
        scrollToTop();
    }

    /**
     * Form Interactions
     */
    setupFormInteractions() {
        // Auto-resize textareas
        const textareas = document.querySelectorAll('.form-textarea');
        textareas.forEach(textarea => {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
        });
        
        // Form validation feedback
        const form = document.querySelector('.builder-form');
        if (form) {
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            });
        }
        
        // Generate button functionality
        const generateBtn = document.querySelector('.btn-generate');
        if (generateBtn) {
            generateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleGenerateClick();
            });
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const isValid = value.length > 0;
        
        if (!isValid) {
            field.style.borderBottomColor = 'rgba(255, 0, 0, 0.5)';
        } else {
            field.style.borderBottomColor = 'rgba(0, 240, 255, 0.2)';
        }
        
        return isValid;
    }

    handleGenerateClick() {
        const generateBtn = document.querySelector('.btn-generate');
        const originalText = generateBtn.innerHTML;
        
        // Show loading state
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        generateBtn.disabled = true;
        
        // Simulate generation process
        setTimeout(() => {
            // Update preview with form data
            this.updatePreview();
            
            // Show success state
            generateBtn.innerHTML = '<i class="fas fa-check"></i> Generated!';
            generateBtn.style.background = 'linear-gradient(135deg, #00ff00, #00cc00)';
            
            setTimeout(() => {
                generateBtn.innerHTML = originalText;
                generateBtn.style.background = '';
                generateBtn.disabled = false;
            }, 2000);
        }, 2000);
    }

    updatePreview() {
        const headlineInput = document.querySelector('#campaign-headline');
        const descriptionInput = document.querySelector('#campaign-description');
        const ctaInput = document.querySelector('#campaign-cta');
        
        const previewHeadline = document.querySelector('.preview-headline');
        const previewDescription = document.querySelector('.preview-description');
        const previewCtaBtn = document.querySelector('.preview-cta-btn');
        
        if (headlineInput && previewHeadline) {
            previewHeadline.textContent = headlineInput.value || 'Your compelling headline here';
        }
        
        if (descriptionInput && previewDescription) {
            previewDescription.textContent = descriptionInput.value || 'Your engaging description here';
        }
        
        if (ctaInput && previewCtaBtn) {
            previewCtaBtn.textContent = ctaInput.value || 'Learn More';
        }
    }

    /**
     * Performance Optimizations
     */
    setupPerformanceOptimizations() {
        // Throttle scroll events
        let scrollTimeout;
        const originalScrollHandler = window.onscroll;
        
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                if (originalScrollHandler) {
                    originalScrollHandler();
                }
            }, 16); // ~60fps
        }, { passive: true });
        
        // Lazy load images (if any)
        this.setupLazyLoading();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    preloadCriticalResources() {
        // Preload critical CSS and fonts
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MarkezardDashboard();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkezardDashboard;
} 