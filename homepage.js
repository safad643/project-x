document.addEventListener('DOMContentLoaded', function() {
    // Set proper height variables for mobile browsers
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    
    // Theme toggling
    initThemeToggle();
    
    // Mobile menu toggle
    initMobileNavigation();
    
    // Subscription filters
    initSubscriptionFilters();
    
    // Testimonial slider
    initTestimonialSlider();
    
    // Add scroll animations
    initScrollAnimations();
    
    // Update viewport height variable on resize
    window.addEventListener('resize', () => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    });
});

// Theme toggle functionality
function initThemeToggle() {
    const themeSwitch = document.getElementById('theme-switch');
    const mobileThemeSwitch = document.getElementById('mobile-theme-switch');
    const htmlElement = document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    // Check for saved theme preference or use OS preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Check if user prefers dark mode
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            applyTheme('dark');
        }
    }
    
    // Apply theme function to handle all theme changes
    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        // Update meta theme color for mobile
        if (metaThemeColor) {
            metaThemeColor.content = theme === 'dark' ? '#1a202c' : '#5461FF';
        }
    }
    
    // Theme toggle click event
    if (themeSwitch) {
        themeSwitch.addEventListener('click', toggleTheme);
    }
    
    // Mobile theme toggle click event
    if (mobileThemeSwitch) {
        mobileThemeSwitch.addEventListener('click', toggleTheme);
    }
    
    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        
        // Add animation effect on theme change
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
    }
}

// Mobile navigation functionality
function initMobileNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const closeMobileNav = document.querySelector('.close-mobile-nav');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    
    if (mobileMenuToggle && mobileNav && mobileNavBackdrop) {
        // Toggle mobile menu
        function toggleMobileMenu(open = null) {
            const isActive = mobileNav.classList.contains('active');
            const shouldOpen = open !== null ? open : !isActive;
            
            if (!shouldOpen) {
                // Close menu
                mobileNav.classList.remove('active');
                mobileNavBackdrop.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
                
                // Change icon to bars
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            } else {
                // Open menu
                mobileNav.classList.add('active');
                mobileNavBackdrop.classList.add('active');
                mobileMenuToggle.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Change icon to times
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-times';
                }
            }
        }
        
        // Toggle menu on button click
        mobileMenuToggle.addEventListener('click', () => toggleMobileMenu());
        
        // Close menu when close button is clicked
        if (closeMobileNav) {
            closeMobileNav.addEventListener('click', () => toggleMobileMenu(false));
        }
        
        // Close menu when backdrop is clicked
        mobileNavBackdrop.addEventListener('click', () => toggleMobileMenu(false));
        
        // Close menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => toggleMobileMenu(false));
        });
        
        // Close menu when ESC key is pressed
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                toggleMobileMenu(false);
            }
        });
        
        // Close menu when window is resized to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
                toggleMobileMenu(false);
            }
        });
    }
}

// Subscription filters functionality
function initSubscriptionFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const subscriptionCards = document.querySelectorAll('.subscription-card');
    
    if (filterBtns.length && subscriptionCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter subscription cards
                subscriptionCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        
                        // Add animation
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}

// Testimonial slider functionality
function initTestimonialSlider() {
    const testimonialSlider = document.querySelector('.testimonials-slider');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialDots = document.querySelectorAll('.dot');
    
    if (testimonialSlider && testimonialCards.length && testimonialDots.length) {
        let currentSlide = 0;
        
        // For desktop, we'll handle manual navigation with dots
        // For mobile, the cards are stacked vertically
        
        function goToSlide(index) {
            // Only apply horizontal slider on desktop
            if (window.innerWidth > 768) {
                // Update current slide
                currentSlide = index;
                
                // Calculate the percentage to translate
                const slidePercentage = index * (100 / testimonialCards.length);
                
                // Update slider position
                testimonialSlider.style.transform = `translateX(-${slidePercentage}%)`;
                
                // Update dots
                testimonialDots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
        }
        
        // Add click event to dots
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        // Auto-advance slider every 5 seconds on desktop
        let sliderInterval;
        function startSliderInterval() {
            if (window.innerWidth > 768) {
                sliderInterval = setInterval(() => {
                    currentSlide = (currentSlide + 1) % testimonialCards.length;
                    goToSlide(currentSlide);
                }, 5000);
            }
        }
        
        startSliderInterval();
        
        // Reset slider on window resize
        window.addEventListener('resize', () => {
            // Clear the interval
            if (sliderInterval) {
                clearInterval(sliderInterval);
            }
            
            // Reset transform when switching to mobile
            if (window.innerWidth <= 768) {
                testimonialSlider.style.transform = 'none';
                testimonialCards.forEach(card => {
                    card.style.opacity = '1';
                });
            } else {
                goToSlide(currentSlide);
                startSliderInterval();
            }
        });
    }
}

// Scroll animations
function initScrollAnimations() {
    // Add animation to elements when they come into view
    const animatedElements = document.querySelectorAll('.subscription-card, .step-card, .testimonial-card');
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Unobserve element after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the element is visible
    });
    
    // Observe all elements
    animatedElements.forEach(element => {
        observer.observe(element);
        // Add initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Add animation to elements once they're visible
    document.addEventListener('scroll', () => {
        animatedElements.forEach(element => {
            if (element.classList.contains('animate')) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }, { passive: true });
}

// Helper function to create ripple effect on buttons
function createRipple(e) {
    const button = e.currentTarget;
    
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');
    
    // Remove existing ripple
    const ripple = button.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

// Add ripple effect to all buttons
const buttons = document.querySelectorAll('.btn, .filter-btn');
buttons.forEach(button => {
    button.addEventListener('click', createRipple);
}); 