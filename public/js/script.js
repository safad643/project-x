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
    if (themeSwitch) {
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
    }

    // Tab switching functionality with smooth sliding
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const formTabs = document.querySelector('.form-tabs');
    const formsSlider = document.querySelector('.forms-slider');
    
    // Switch to login tab
    if (loginTab && registerTab && formTabs && formsSlider) {
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
    }

    // Handle feature card clicks on mobile
    const featureCards = document.querySelectorAll('.feature-card');
    const featureOverlay = document.querySelector('.feature-overlay');
    
    // All feature descriptions are now visible by default on mobile
    // No click handling needed for toggling visibility
    
    // Form validation
  
    
  
    
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