// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initMobileNav();
    initContactForm();
    fixViewportHeight();
    handleResponsiveLayout();
    initHeroSection();
    
    // Add animation classes with delay to ensure CSS has loaded
    setTimeout(() => {
        document.querySelectorAll('.creator-card, .contact-item').forEach(item => {
            item.style.opacity = '1';
        });
    }, 100);
    
    // Listen for window resize to adjust layout
    window.addEventListener('resize', () => {
        handleResponsiveLayout();
        fixViewportHeight();
    });
});

// Fix for 100vh on mobile
function fixViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initialize hero section elements
function initHeroSection() {
    const heroSection = document.querySelector('.contact-hero-section');
    const heroHeader = document.querySelector('.contact-hero-section .section-header h1');
    const heroParagraph = document.querySelector('.contact-hero-section .section-header p');
    const heroButton = document.querySelector('.btn-hero');
    const decorations = document.querySelectorAll('.contact-hero-decoration');
    
    if (heroSection) {
        // Ensure smooth theme transitions
        heroSection.classList.add('theme-transition');
        
        // Initial state for animations
        if (heroHeader) {
            heroHeader.style.opacity = '0';
            heroHeader.style.transform = 'translateY(-20px)';
        }
        
        if (heroParagraph) {
            heroParagraph.style.opacity = '0';
            heroParagraph.style.transform = 'translateY(-15px)';
        }
        
        if (heroButton) {
            heroButton.style.opacity = '0';
            heroButton.style.transform = 'translateY(-10px) scale(0.95)';
        }
        
        // Setup animation for decorations with random delays
        decorations.forEach((decoration, index) => {
            decoration.style.opacity = '0';
            decoration.style.transform = 'scale(0.8) rotate(-5deg)';
            decoration.style.transition = `opacity 1.2s ease, transform 1.2s ease`;
            
            // Add slightly random animation delays for organic feel
            const randomDelay = 200 + (index * 100);
            setTimeout(() => {
                decoration.style.opacity = '1';
                decoration.style.transform = 'scale(1) rotate(0)';
            }, randomDelay);
        });
        
        // Staggered animations for content
        setTimeout(() => {
            if (heroHeader) {
                heroHeader.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                heroHeader.style.opacity = '1';
                heroHeader.style.transform = 'translateY(0)';
            }
            
            // Reveal paragraph with delay
            setTimeout(() => {
                if (heroParagraph) {
                    heroParagraph.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                    heroParagraph.style.opacity = '1';
                    heroParagraph.style.transform = 'translateY(0)';
                }
                
                // Reveal button with more delay and bounce effect
                setTimeout(() => {
                    if (heroButton) {
                        heroButton.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        heroButton.style.opacity = '1';
                        heroButton.style.transform = 'translateY(0) scale(1)';
                    }
                }, 250);
            }, 200);
        }, 100);
        
        // Add mouse movement parallax effect for decorations
        if (window.innerWidth > 768) {
            heroSection.addEventListener('mousemove', (e) => {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                decorations.forEach((decoration, index) => {
                    // Different movement amount for each decoration
                    const moveX = (mouseX - 0.5) * (10 + index * 5);
                    const moveY = (mouseY - 0.5) * (10 + index * 5);
                    
                    decoration.style.transform = `translate(${moveX}px, ${moveY}px) scale(1)`;
                });
            });
            
            // Reset positions when mouse leaves
            heroSection.addEventListener('mouseleave', () => {
                decorations.forEach(decoration => {
                    decoration.style.transform = 'translate(0, 0) scale(1)';
                    decoration.style.transition = 'transform 0.5s ease';
                });
            });
        }
    }
}

// Adjust layout based on screen size
function handleResponsiveLayout() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (window.innerWidth <= 768) {
        // On mobile, the toggle should be hidden (shown in mobile menu)
        if (themeToggle) {
            themeToggle.style.display = 'none';
        }
    } else {
        // On desktop, position the toggle appropriately
        if (themeToggle) {
            themeToggle.style.display = 'flex';
        }
    }
}

// Theme toggle functionality
function initThemeToggle() {
    const themeSwitch = document.getElementById('theme-switch');
    const mobileThemeSwitch = document.getElementById('mobile-theme-switch');
    
    // Check for saved theme preference or use device preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    // If we have a saved theme, use it
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        // If no saved theme but device prefers dark, use dark
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Function to toggle theme
    function toggleTheme() {
        // Add transition class to smooth theme change
        document.body.classList.add('theme-transition');
        
        // Toggle theme
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Remove transition class after animation completes
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
    }
    
    // Add click event to theme toggles
    if (themeSwitch) {
        themeSwitch.addEventListener('click', toggleTheme);
    }
    
    if (mobileThemeSwitch) {
        mobileThemeSwitch.addEventListener('click', toggleTheme);
    }
}

// Mobile navigation
function initMobileNav() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const closeNavBtn = document.querySelector('.close-mobile-nav');
    const mobileNav = document.querySelector('.mobile-nav');
    const backdrop = document.querySelector('.mobile-nav-backdrop');
    
    function openMobileNav() {
        mobileNav.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeMobileNav() {
        mobileNav.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    if (menuToggle) {
        menuToggle.addEventListener('click', openMobileNav);
    }
    
    if (closeNavBtn) {
        closeNavBtn.addEventListener('click', closeMobileNav);
    }
    
    if (backdrop) {
        backdrop.addEventListener('click', closeMobileNav);
    }
    
    // Close mobile nav when clicking on a link (for better UX)
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Here you would normally send the data to your server
            // For demonstration, we'll just log it and show a success message
            console.log('Form submitted:', { name, email, message });
            
            // Show success state
            document.body.classList.add('submission-success');
            
            // Reset form after submission
            contactForm.reset();
            
            // Show success message (you could add a better UI for this)
            alert('Thank you for your message! We will get back to you soon.');
            
            // Remove success state after a delay
            setTimeout(() => {
                document.body.classList.remove('submission-success');
            }, 3000);
        });
    }
}

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    const target = e.target;
    
    if (target.classList.contains('btn') || 
        target.classList.contains('social-icon') || 
        target.closest('.btn') || 
        target.closest('.social-icon')) {
        
        const element = target.classList.contains('btn') || target.classList.contains('social-icon') 
            ? target 
            : target.closest('.btn') || target.closest('.social-icon');
        
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}); 