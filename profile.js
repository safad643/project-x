// Profile Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Toggle Mobile Navigation
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
    const closeMobileNav = document.querySelector('.close-mobile-nav');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileNav.classList.add('active');
            mobileNavBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeMobileNav) {
        closeMobileNav.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            mobileNavBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (mobileNavBackdrop) {
        mobileNavBackdrop.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            mobileNavBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Theme Toggle Functionality
    const themeSwitch = document.getElementById('theme-toggle-input');
    const mobileThemeSwitch = document.getElementById('mobile-theme-switch');
    const htmlElement = document.documentElement;
    
    // Check if dark mode is already active
    if (htmlElement.getAttribute('data-theme') === 'dark') {
        themeSwitch.checked = true;
    }

    function toggleTheme() {
        if (htmlElement.getAttribute('data-theme') === 'dark') {
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('change', toggleTheme);
    }

    if (mobileThemeSwitch) {
        mobileThemeSwitch.addEventListener('click', toggleTheme);
    }

    // Profile Picture Upload
    const photoUpload = document.getElementById('photo-upload');
    const profileImage = document.getElementById('profile-image');

    if (photoUpload && profileImage) {
        photoUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImage.src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Account Info Edit Toggle
    const editButtons = document.querySelectorAll('.btn-edit');
    const cancelButtons = document.querySelectorAll('.btn-cancel');

    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const formElement = document.getElementById(targetId);
            const displayElement = document.getElementById(targetId.replace('form', 'display'));
            
            if (formElement && displayElement) {
                formElement.classList.remove('hidden');
                displayElement.classList.add('hidden');
            }
        });
    });

    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const formElement = document.getElementById(targetId);
            const displayElement = document.getElementById(targetId.replace('form', 'display'));
            
            if (formElement && displayElement) {
                formElement.classList.add('hidden');
                displayElement.classList.remove('hidden');
            }
        });
    });

    // Form Submission Handling
    const accountInfoForm = document.getElementById('account-info-form');
    
    if (accountInfoForm) {
        accountInfoForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Here you would normally send the data to your server
            // This is just a simulation for the demo
            
            // Get form data
            const formData = new FormData(this);
            const fullName = formData.get('fullname');
            const email = formData.get('email');
            const phone = formData.get('phone');
            
            // Update the display fields with new values
            const nameDisplay = document.querySelector('#account-info-display .info-row:nth-child(1) .info-value');
            const emailDisplay = document.querySelector('#account-info-display .info-row:nth-child(2) .info-value');
            const phoneDisplay = document.querySelector('#account-info-display .info-row:nth-child(3) .info-value');
            
            if (nameDisplay && fullName) nameDisplay.textContent = fullName;
            if (emailDisplay && email) emailDisplay.textContent = email;
            if (phoneDisplay && phone) phoneDisplay.textContent = phone;
            
            // Also update the header info
            const profileUsername = document.querySelector('.profile-username');
            const profileEmail = document.querySelector('.profile-email');
            
            if (profileUsername && fullName) profileUsername.textContent = fullName;
            if (profileEmail && email) profileEmail.textContent = email;
            
            // Hide the form and show the display
            this.classList.add('hidden');
            document.getElementById('account-info-display').classList.remove('hidden');
            
            // Show success message (you can enhance this)
            showNotification('Account information updated successfully!');
        });
    }

    // Edit Profile Button
    const editProfileBtn = document.querySelector('.btn-edit-profile');
    
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            const accountInfoEditBtn = document.querySelector('.btn-edit[data-target="account-info-form"]');
            if (accountInfoEditBtn) {
                accountInfoEditBtn.click();
            }
        });
    }

    // Simple notification system
    function showNotification(message) {
        // Check if notification container exists, if not create it
        let notificationContainer = document.getElementById('notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.bottom = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '9999';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.backgroundColor = 'var(--card-bg)';
        notification.style.color = 'var(--text-color)';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = 'var(--shadow)';
        notification.style.marginBottom = '10px';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.justifyContent = 'space-between';
        notification.style.animation = 'slideIn 0.3s forwards';
        
        // Success icon
        const icon = document.createElement('i');
        icon.className = 'fas fa-check-circle';
        icon.style.color = 'var(--success-color)';
        icon.style.marginRight = '10px';
        icon.style.fontSize = '1.2rem';
        
        // Message text
        const text = document.createElement('span');
        text.textContent = message;
        
        // Close button
        const closeBtn = document.createElement('i');
        closeBtn.className = 'fas fa-times';
        closeBtn.style.marginLeft = '15px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.color = 'var(--secondary-color)';
        closeBtn.onclick = function() {
            notification.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        };
        
        // Add elements to notification
        notification.appendChild(icon);
        notification.appendChild(text);
        notification.appendChild(closeBtn);
        
        // Add notification to container
        notificationContainer.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s forwards';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
    
    // Add animations to <style> element
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(styleElement);
}); 