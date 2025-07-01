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

// Animate-on-scroll for landing page and dashboard (including new preview-ai-section)
function handleAnimateOnScroll() {
    const animatedEls = document.querySelectorAll('.animate-on-scroll');
    animatedEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
            el.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', handleAnimateOnScroll);
window.addEventListener('DOMContentLoaded', handleAnimateOnScroll);

// Sidebar navigation toggling for dashboard.html
function setupDashboardSidebarNav() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-target]');
    const sections = document.querySelectorAll('.dashboard-section');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            sections.forEach(sec => {
                if (sec.id === targetId) {
                    sec.style.display = '';
                } else {
                    sec.style.display = 'none';
                }
            });
            // Update active state
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    // Show the first section by default
    if (sections.length) {
        sections.forEach((sec, i) => {
            sec.style.display = i === 0 ? '' : 'none';
        });
    }
}
if (document.body.classList.contains('dashboard-body')) {
    window.addEventListener('DOMContentLoaded', setupDashboardSidebarNav);
}

// Generated Ad Copy (Raw) block logic
function setupGeneratedOutputBlock() {
  const dummyJson = {
    "platform": "facebook",
    "headline": "Transform Your Fitness Journey with Smart AI Coaching",
    "description": "Discover personalized workout plans, real-time form correction, and motivation that adapts to your progress.",
    "cta": "Start Free Trial",
    "target_audience": "Fitness enthusiasts aged 25–40",
    "campaign_goal": "conversion",
    "language": "en",
    "generated_at": "2025-01-15T10:30:00Z"
  };
  const codeBlock = document.getElementById('generatedOutputCode');
  if (codeBlock) {
    codeBlock.textContent = JSON.stringify(dummyJson, null, 2);
  }
  // Copy to Clipboard
  const copyBtn = document.getElementById('copyRawJsonBtn');
  if (copyBtn && codeBlock) {
    copyBtn.addEventListener('click', function() {
      navigator.clipboard.writeText(codeBlock.textContent).then(() => {
        copyBtn.classList.add('copied');
        copyBtn.title = 'Copied!';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.title = 'Copy to Clipboard';
        }, 1200);
      });
    });
  }
  // Download JSON
  const downloadBtn = document.getElementById('downloadRawJsonBtn');
  if (downloadBtn && codeBlock) {
    downloadBtn.addEventListener('click', function() {
      const blob = new Blob([codeBlock.textContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-ad.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    });
  }
}
window.addEventListener('DOMContentLoaded', setupGeneratedOutputBlock);

// Live Preview dynamic update logic
function setupLivePreviewDynamic() {
  const platformSelect = document.getElementById('platformSelect');
  const productDesc = document.getElementById('productDescription');
  const campaignGoal = document.getElementById('campaignGoal');
  const languageSelect = document.getElementById('languageSelect');
  const targetAudience = document.getElementById('targetAudience');

  // Live Preview elements
  const preview = document.getElementById('live-preview');
  if (!preview) return;
  const platformName = preview.querySelector('.live-preview-platform');
  const headline = preview.querySelector('.live-preview-headline');
  const description = preview.querySelector('.live-preview-description');
  const ctaBtn = preview.querySelector('.live-preview-cta-btn');
  const brandIcon = preview.querySelector('.live-preview-profile-img i');

  // Platform branding (icon and color)
  const platformData = {
    facebook: { name: 'Facebook', icon: 'fa-user-circle', color: '#1877f2' },
    instagram: { name: 'Instagram', icon: 'fa-instagram', color: '#e1306c' },
    tiktok: { name: 'TikTok', icon: 'fa-music', color: '#000' },
    pinterest: { name: 'Pinterest', icon: 'fa-pinterest', color: '#e60023' },
    linkedin: { name: 'LinkedIn', icon: 'fa-linkedin-in', color: '#0077b5' },
    twitter: { name: 'Twitter', icon: 'fa-x-twitter', color: '#1da1f2' },
    default: { name: 'Facebook', icon: 'fa-user-circle', color: '#1877f2' }
  };

  // CTA text by campaign goal
  const ctaByGoal = {
    awareness: 'Learn More',
    engagement: 'Join the Conversation',
    conversion: 'Shop Now',
    traffic: 'Visit Site',
    leads: 'Subscribe',
    default: 'Learn More'
  };

  // Headline generator
  function getHeadline(platform, goal) {
    if (goal && platform) {
      return `Achieve ${goal.charAt(0).toUpperCase() + goal.slice(1)} with AI on ${platform}`;
    }
    if (platform) {
      return `Achieve Your Goal with AI on ${platform}`;
    }
    return 'Achieve Your Goal with AI';
  }

  function updatePreview() {
    // Platform
    const platformVal = platformSelect && platformSelect.value ? platformSelect.value : 'facebook';
    const platformInfo = platformData[platformVal] || platformData.default;
    platformName.textContent = platformInfo.name;
    platformName.style.color = platformInfo.color;
    // Icon
    if (brandIcon) {
      brandIcon.className = `fas ${platformInfo.icon}`;
      brandIcon.style.color = platformInfo.color;
    }
    // Headline
    const goalVal = campaignGoal && campaignGoal.value ? campaignGoal.options[campaignGoal.selectedIndex].text : '';
    headline.textContent = getHeadline(platformInfo.name, goalVal.toLowerCase());
    // Description
    description.textContent = productDesc && productDesc.value.trim()
      ? productDesc.value.trim()
      : 'This is where your AI-generated ad description will be displayed. The text will be optimized for the selected platform and target audience.';
    // CTA
    const ctaVal = campaignGoal && campaignGoal.value ? campaignGoal.value : 'default';
    ctaBtn.textContent = ctaByGoal[ctaVal] || ctaByGoal.default;
  }

  // Listen for input/change events
  [platformSelect, productDesc, campaignGoal, languageSelect, targetAudience].forEach(el => {
    if (el) {
      el.addEventListener('input', updatePreview);
      el.addEventListener('change', updatePreview);
    }
  });

  // Initial render
  updatePreview();
}
window.addEventListener('DOMContentLoaded', setupLivePreviewDynamic);

// Smooth scroll for landing page nav links
function setupSmoothScrollNav() {
  const navLinks = document.querySelectorAll('.navbar .nav-links a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        e.preventDefault();
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Optional: highlight nav item briefly
        link.classList.add('nav-scroll-active');
        setTimeout(() => link.classList.remove('nav-scroll-active'), 500);
      }
    });
  });
}
if (document.querySelector('.navbar')) {
  window.addEventListener('DOMContentLoaded', setupSmoothScrollNav);
}

// Enhance Generate Ad Copy flow with loading simulation
function setupGenerateAdLoading() {
  const generateBtn = document.getElementById('generateAdBtn');
  const codeBlock = document.getElementById('generatedOutputCode');
  const copyBtn = document.getElementById('copyRawJsonBtn');
  const downloadBtn = document.getElementById('downloadRawJsonBtn');
  if (!generateBtn || !codeBlock) return;

  const dummyJson = {
    "platform": "facebook",
    "headline": "Transform Your Fitness Journey with Smart AI Coaching",
    "description": "Discover personalized workout plans, real-time form correction, and motivation that adapts to your progress.",
    "cta": "Start Free Trial",
    "target_audience": "Fitness enthusiasts aged 25–40",
    "campaign_goal": "conversion",
    "language": "en",
    "generated_at": "2025-01-15T10:30:00Z"
  };

  generateBtn.addEventListener('click', function(e) {
    e.preventDefault();
    // Hide buttons
    if (copyBtn) copyBtn.style.visibility = 'hidden';
    if (downloadBtn) downloadBtn.style.visibility = 'hidden';
    // Show loader
    codeBlock.innerHTML = '<div class="ad-loader"><span class="ad-spinner"></span>MarkezardAI is generating your ad copy…</div>';
    // After 2 seconds, show JSON and buttons
    setTimeout(() => {
      codeBlock.textContent = JSON.stringify(dummyJson, null, 2);
      if (copyBtn) copyBtn.style.visibility = 'visible';
      if (downloadBtn) downloadBtn.style.visibility = 'visible';
    }, 2000);
  });
}
window.addEventListener('DOMContentLoaded', setupGenerateAdLoading);

// Site Integration + Analyzer logic
function setupSiteIntegrationAnalyzer() {
  const form = document.getElementById('integrationForm');
  const platform = document.getElementById('integrationPlatform');
  const url = document.getElementById('integrationUrl');
  const btn = document.getElementById('analyzeBtn');
  const loader = document.getElementById('scanLoader');
  const result = document.getElementById('analysis-result');
  if (!form || !platform || !url || !btn || !loader || !result) return;

  function validate() {
    btn.disabled = !(platform.value && url.value.trim());
  }
  platform.addEventListener('change', validate);
  url.addEventListener('input', validate);
  validate();

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Hide result, show loader
    result.style.display = 'none';
    loader.style.display = 'flex';
    loader.innerHTML = `<span class='scan-spinner'></span>Scanning <span style='color:#fff;'>${url.value}</span> for marketing opportunities...`;
    // Simulate scan
    setTimeout(() => {
      loader.style.display = 'none';
      // Dummy analysis result
      result.innerHTML = `
        <div class='analysis-result-title'>Analysis Report</div>
        <div><strong>Products found:</strong> 6</div>
        <ul class='analysis-result-list'>
          <li>2 products missing descriptions</li>
          <li>No consistent CTA across homepage banners</li>
          <li>Product titles are too long</li>
        </ul>
        <div class='analysis-result-recommendation'>Recommendation: Generate ad copy using best-performing product</div>
      `;
      result.style.display = 'flex';
      result.style.opacity = '0';
      setTimeout(() => { result.style.opacity = '1'; }, 50);
    }, 2500);
  });
}
window.addEventListener('DOMContentLoaded', setupSiteIntegrationAnalyzer); 