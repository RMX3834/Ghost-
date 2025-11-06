// Enhanced JavaScript for GHOST TOP UP Clone

class GhostTopUp {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.dots = document.querySelectorAll('.carousel-dot');
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.init();
    }

    init() {
        this.setupCarousel();
        this.setupScrollAnimations();
        this.setupMobileMenu();
        this.setupProductInteractions();
        this.setupNotifications();
        this.setupPerformanceOptimizations();
    }

    // Enhanced Carousel Functionality
    setupCarousel() {
        if (this.slides.length === 0) return;

        // Touch/swipe support
        let startX = 0;
        let endX = 0;

        const carousel = document.querySelector('.carousel');
        if (carousel) {
            carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            carousel.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                this.handleSwipe();
            });

            carousel.addEventListener('mousedown', (e) => {
                startX = e.clientX;
            });

            carousel.addEventListener('mouseup', (e) => {
                endX = e.clientX;
                this.handleSwipe();
            });
        }

        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoPlay();
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        // Start autoplay
        this.startAutoPlay();
        
        // Pause on hover
        const carouselContainer = document.querySelector('.banner-section');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
            carouselContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }

    handleSwipe() {
        const threshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
            this.resetAutoPlay();
        }
    }

    goToSlide(n) {
        // Remove active class from all slides and dots
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        // Ensure n is within bounds
        if (n >= this.totalSlides) this.currentSlide = 0;
        if (n < 0) this.currentSlide = this.totalSlides - 1;
        else this.currentSlide = n;

        // Add active class to current slide and dot
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }

    nextSlide() {
        this.currentSlide++;
        if (this.currentSlide >= this.totalSlides) this.currentSlide = 0;
        this.goToSlide(this.currentSlide);
    }

    prevSlide() {
        this.currentSlide--;
        if (this.currentSlide < 0) this.currentSlide = this.totalSlides - 1;
        this.goToSlide(this.currentSlide);
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all product cards and order items
        document.querySelectorAll('.product-card, .order-item').forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(element);
        });
    }

    // Mobile Menu
    setupMobileMenu() {
        const createMobileMenu = () => {
            if (window.innerWidth <= 768) {
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && !document.querySelector('.mobile-menu-toggle')) {
                    const toggleButton = document.createElement('button');
                    toggleButton.className = 'mobile-menu-toggle';
                    toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
                    toggleButton.style.cssText = `
                        background: none;
                        border: none;
                        color: white;
                        font-size: 1.5rem;
                        cursor: pointer;
                        display: block;
                    `;
                    
                    const headerContent = document.querySelector('.header-content');
                    headerContent.appendChild(toggleButton);

                    toggleButton.addEventListener('click', () => {
                        navMenu.classList.toggle('mobile-active');
                    });
                }
            }
        };

        createMobileMenu();
        window.addEventListener('resize', createMobileMenu);
    }

    // Product Interactions
    setupProductInteractions() {
        document.querySelectorAll('.product-card').forEach(card => {
            // Click to view product
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.showProductDetails(card);
            });

            // Hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });

            // Add ripple effect on click
            card.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(243, 156, 18, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add CSS for ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    showProductDetails(card) {
        const productName = card.querySelector('h3').textContent;
        const productImage = card.querySelector('img').src;
        const productPrice = card.querySelector('.price').textContent;

        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            position: relative;
        `;

        modalContent.innerHTML = `
            <button class="close-modal" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            <img src="${productImage}" alt="${productName}" style="width: 100%; max-width: 200px; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #2c3e50; margin-bottom: 10px;">${productName}</h2>
            <p style="color: #f39c12; font-size: 1.2rem; font-weight: 600; margin-bottom: 20px;">${productPrice}</p>
            <button class="btn-primary" onclick="window.open('https://wa.me/+8801628948415?text=I'm interested in ${productName}', '_blank')">Order Now</button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close modal functionality
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
            }, 300);
        };

        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Add fadeOut animation
        const fadeOutStyle = document.createElement('style');
        fadeOutStyle.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: scale(1); }
                to { opacity: 0; transform: scale(0.8); }
            }
        `;
        document.head.appendChild(fadeOutStyle);
    }

    // Notifications System
    setupNotifications() {
        // Show welcome notification
        setTimeout(() => {
            this.showNotification('Welcome to GHOST TOP UP!', 'success');
        }, 2000);

        // Periodic notifications
        setInterval(() => {
            if (Math.random() > 0.8) { // 20% chance every interval
                const notifications = [
                    'New offers available! Check them out!',
                    'Limited time discount on gaming products!',
                    'Subscribe to our YouTube for tutorials!',
                    'Download our app for faster ordering!'
                ];
                const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
                this.showNotification(randomNotification, 'info');
            }
        }, 30000); // Every 30 seconds
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
            max-width: 300px;
            cursor: pointer;
        `;

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);

        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.remove();
        });

        document.body.appendChild(notification);

        // Add slideOutRight animation
        if (!document.querySelector('#notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Lazy loading for images
        const images = document.querySelectorAll('img[src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Preload critical resources
        const criticalImages = [
            'images/banners/banner1.jpg',
            'images/products/friday_offer.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
}

// Utility Functions
const utils = {
    // Format currency
    formatCurrency: (amount, currency = '৳') => {
        return `${currency}${amount.toLocaleString()}`;
    },

    // Get random element from array
    randomElement: (array) => {
        return array[Math.floor(Math.random() * array.length)];
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GhostTopUp();
    
    // Add loading complete class
    document.body.classList.add('loaded');
    
    // Setup additional event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll-to-top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #f39c12, #e67e22);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(243, 156, 18, 0.3);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(scrollToTopBtn);

    // Show/hide scroll to top button
    window.addEventListener('scroll', utils.throttle(() => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    }, 250));

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add hover effect to scroll button
    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.transform = 'translateY(-3px)';
        scrollToTopBtn.style.boxShadow = '0 8px 20px rgba(243, 156, 18, 0.4)';
    });

    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.transform = '';
        scrollToTopBtn.style.boxShadow = '0 5px 15px rgba(243, 156, 18, 0.3)';
    });
}

// Service Worker Registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here for PWA features
        console.log('Service Worker support detected');
    });
}