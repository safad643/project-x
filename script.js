document.addEventListener('DOMContentLoaded', function() {
    // Theme toggling
    const themeSwitch = document.getElementById('theme-switch');
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
    themeSwitch.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        
        // Add animation effect on theme change
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
    });

    // Tab switching functionality with smooth sliding
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const formTabs = document.querySelector('.form-tabs');
    const formsSlider = document.querySelector('.forms-slider');
    
    // Switch to login tab
    loginTab.addEventListener('click', function() {
        switchTab('login');
    });

    // Switch to register tab
    registerTab.addEventListener('click', function() {
        switchTab('register');
    });
    
    function switchTab(tabName) {
        if (tabName === 'login') {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginTab.setAttribute('aria-selected', 'true');
            registerTab.setAttribute('aria-selected', 'false');
            
            // Smooth sliding effect
            formsSlider.classList.remove('register');
            formTabs.classList.remove('register');
        } else {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerTab.setAttribute('aria-selected', 'true');
            loginTab.setAttribute('aria-selected', 'false');
            
            // Smooth sliding effect
            formsSlider.classList.add('register');
            formTabs.classList.add('register');
        }
    }

    // Handle feature card clicks on mobile
    const featureCards = document.querySelectorAll('.feature-card');
    const featureOverlay = document.querySelector('.feature-overlay');
    
    // All feature descriptions are now visible by default on mobile
    // No click handling needed for toggling visibility
    
    // Form validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select');
        
        // Add touch-friendly events for mobile
        inputs.forEach(input => {
            // Add ID to inputs for error message association
            if (!input.id) {
                input.id = `input-${Math.random().toString(36).substring(2, 9)}`;
            }
            
            input.addEventListener('focus', function() {
                // Only add this effect on non-mobile devices
                if (window.innerWidth > 768) {
                    this.parentElement.style.transform = 'translateY(-3px)';
                    this.parentElement.style.transition = 'transform 0.3s ease';
                }
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
                
                // Validate on blur for better mobile UX
                if (this.value.trim() === '' && this.required) {
                    showError(this, 'This field is required');
                } else {
                    clearError(this);
                }
            });
            
            // Special handling for password fields
            if (input.type === 'password' && form.id === 'register-form') {
                input.addEventListener('input', function() {
                    const passwords = form.querySelectorAll('input[type="password"]');
                    
                    // If this is the first password field
                    if (this === passwords[0]) {
                        if (this.value.trim() !== '' && !isStrongPassword(this.value)) {
                            showError(this, 'Password must be at least 8 characters');
                        } else {
                            clearError(this);
                        }
                    } 
                    // If this is confirm password field
                    else if (passwords[0].value.trim() !== '' && this.value.trim() !== '' && 
                           passwords[0].value !== this.value) {
                        showError(this, 'Passwords do not match');
                    } else {
                        clearError(this);
                    }
                });
            }
            
            // Email validation on input
            if (input.type === 'email') {
                input.addEventListener('input', function() {
                    if (this.value.trim() !== '' && !isValidEmail(this.value)) {
                        showError(this, 'Please enter a valid email');
                    } else {
                        clearError(this);
                    }
                });
            }
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.value.trim() === '') {
                    isValid = false;
                    showError(input, 'This field is required');
                } else {
                    clearError(input);
                    
                    // Email validation
                    if (input.type === 'email' && !isValidEmail(input.value)) {
                        isValid = false;
                        showError(input, 'Please enter a valid email');
                    }
                    
                    // Password validation (on register form)
                    if (form.id === 'register-form' && input.type === 'password') {
                        // Password strength check
                        if (input === form.querySelectorAll('input[type="password"]')[0] && !isStrongPassword(input.value)) {
                            isValid = false;
                            showError(input, 'Password must be at least 8 characters');
                        }
                        
                        // Confirm password
                        const passwords = form.querySelectorAll('input[type="password"]');
                        if (passwords.length > 1 && passwords[0].value !== passwords[1].value) {
                            isValid = false;
                            showError(passwords[1], 'Passwords do not match');
                        }
                    }
                }
            });
            
            if (isValid) {
                // Add success animation
                const submitBtn = form.querySelector('.btn');
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                submitBtn.style.backgroundColor = 'var(--success-color)';
                
                // Show loading state
                submitBtn.disabled = true;
                
                // Here you would normally submit the form or make an API call
                setTimeout(() => {
                    // Simulate successful submission
                    document.body.classList.add('submission-success');
                    
                    setTimeout(() => {
                        alert(form.id === 'login-form' ? 'Login successful!' : 'Registration successful!');
                        form.reset();
                        submitBtn.innerHTML = form.id === 'login-form' ? 'Login' : 'Create Account';
                        submitBtn.style.backgroundColor = '';
                        submitBtn.disabled = false;
                        document.body.classList.remove('submission-success');
                    }, 500);
                }, 1000);
            } else {
                // Scroll to the first error on mobile
                if (window.innerWidth <= 768) {
                    const firstError = form.querySelector('.error-message');
                    if (firstError) {
                        firstError.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
        });
    });
    
    // Helper functions
    function showError(input, message) {
        // Remove any existing error
        clearError(input);
        
        // Create and add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const parentDiv = input.parentElement;
        parentDiv.appendChild(errorDiv);
        
        // Highlight input
        input.style.borderColor = 'var(--danger-color)';
        
        // Add aria attributes for accessibility
        input.setAttribute('aria-invalid', 'true');
        errorDiv.id = `error-for-${input.id}`;
        input.setAttribute('aria-describedby', errorDiv.id);
    }
    
    function clearError(input) {
        const parentDiv = input.parentElement;
        const errorDiv = parentDiv.querySelector('.error-message');
        
        if (errorDiv) {
            parentDiv.removeChild(errorDiv);
        }
        
        input.style.borderColor = '';
        input.removeAttribute('aria-invalid');
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isStrongPassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return password.length >= 8; // Simplified for demo, but you can use strongRegex instead
    }
    
    // Add subscription filter functionality (for demo)
    const subscriptionSelect = document.querySelector('select');
    if (subscriptionSelect) {
        subscriptionSelect.addEventListener('change', function() {
            console.log('User interested in:', this.value);
            // You would typically use this value to customize the user experience
        });
    }
    
    // Fix for iOS 100vh issue
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    
    // Handle visibility change for mobile browsers
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            setVH();
        }
    });
    
    // Add touch ripple effect for mobile
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', createRipple);
        button.addEventListener('click', createRipple);
    });
    
    function createRipple(e) {
        if (this.classList.contains('ripple-btn') || this.id === 'theme-switch') {
            return; // Skip if already has ripple effect or is theme button
        }
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        
        const x = e.type === 'touchstart' 
            ? e.touches[0].clientX - rect.left - size / 2 
            : e.clientX - rect.left - size / 2;
        const y = e.type === 'touchstart' 
            ? e.touches[0].clientY - rect.top - size / 2 
            : e.clientY - rect.top - size / 2;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Add about site button functionality
    const aboutSiteBtn = document.getElementById('about-site-btn');
    const closeInfoBtn = document.getElementById('close-info-btn');
    const infoContainer = document.querySelector('.info-container');
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (aboutSiteBtn && closeInfoBtn && infoContainer) {
        // Show info container when about site button is clicked
        aboutSiteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            infoContainer.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling behind the overlay
            themeToggle.style.display = 'none'; // Hide theme toggle button
        });
        
        // Hide info container when close button is clicked
        closeInfoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            infoContainer.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            themeToggle.style.display = ''; // Show theme toggle button again
        });
    }
}); 