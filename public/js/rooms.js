document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const createRoomBtn = document.getElementById('create-room-btn');
    const emptyCreateBtn = document.getElementById('empty-create-room-btn');
    const createRoomModal = document.getElementById('create-room-modal');
    const createRoomBackdrop = document.getElementById('create-room-backdrop');
    const closeModalBtn = document.querySelector('.modal-close-btn');
    const cancelRoomBtn = document.getElementById('cancel-room-btn');
    const submitRoomBtn = document.getElementById('submit-room-btn');
    const successToast = document.getElementById('success-toast');
    const roomForm = document.getElementById('create-room-form');
    const roomCards = document.querySelectorAll('.room-card');
    const emptyState = document.getElementById('empty-state');
    const roomsGridSection = document.querySelector('.rooms-grid-section');



    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
    const closeMobileNav = document.querySelector('.close-mobile-nav');

    if (mobileMenuToggle && mobileNav && mobileNavBackdrop && closeMobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileNav.classList.add('active');
            mobileNavBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        function closeMobileMenu() {
            mobileNav.classList.remove('active');
            mobileNavBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        }

        mobileNavBackdrop.addEventListener('click', closeMobileMenu);
        closeMobileNav.addEventListener('click', closeMobileMenu);
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('mobile-theme-switch');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.setAttribute('data-theme', 
                document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
            );
            
            // Save theme preference
            localStorage.setItem('theme', document.documentElement.getAttribute('data-theme'));
        });
        
        // Apply saved theme on load
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            const toggleInput = themeToggle.querySelector('input');
            if (savedTheme === 'dark' && toggleInput) {
                toggleInput.checked = true;
            }
        }
    }


    
    // Required fields and their error messages
    const requiredFields = {
        'subscription-type': 'Please select a subscription type',
        'max-members': 'Please specify maximum members',
        'price-per-member': 'Please enter a price per member'
    };
    
    // Additional validation rules
    const validationRules = {
        'max-members': {
            min: 2,
            max: 10,
            message: 'Members must be between 2 and 10'
        },
        'price-per-member': {
            min: 0.01,
            message: 'Price must be greater than zero'
        }
    };
    
    // Setup form groups and error containers
    function setupFormGroups() {
        const inputs = roomForm.querySelectorAll('.input-group');
        inputs.forEach(inputGroup => {
            // Create a form group wrapper
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            
            // Create error message container
            const errorContainer = document.createElement('div');
            errorContainer.className = 'error-message-container';
            
            // Get the input field
            const input = inputGroup.querySelector('input, select, textarea');
            if (!input) return;
            
            // Create error message element
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.id = `error-${input.id}`;
            errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i><span></span>`;
            
            // Add to containers
            errorContainer.appendChild(errorMessage);
            
            // Replace input group with form group structure
            inputGroup.parentNode.insertBefore(formGroup, inputGroup);
            formGroup.appendChild(inputGroup);
            formGroup.appendChild(errorContainer);
        });
    }
    
    // Initialization function
    function initialize() {
        setupFormGroups();
        initializeRooms();
    }
    
    // Show/hide empty state based on whether there are visible rooms
    function checkEmptyState() {
        const visibleRooms = document.querySelectorAll('.room-card:not(.hidden)');
        if (visibleRooms.length === 0) {
            emptyState.classList.remove('hidden');
            roomsGridSection.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            roomsGridSection.classList.remove('hidden');
        }
    }
    
    // Initialize - ensure only open rooms are displayed
    function initializeRooms() {
        roomCards.forEach(card => {
            // Only show open rooms
            if (card.dataset.status !== 'open') {
                card.classList.add('hidden');
            }
        });
        checkEmptyState();
    }
    
    // Modal functions with improved animations
    function openModal() {
        // First show the backdrop with a fade-in
        createRoomBackdrop.classList.add('active');
        
        // Then after a short delay, animate in the modal
        setTimeout(() => {
            createRoomModal.classList.add('active');
        }, 100);
        
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeModal() {
        // First animate out the modal
        createRoomModal.classList.remove('active');
        
        // Then after a delay matching the transition time, hide the backdrop
        setTimeout(() => {
            createRoomBackdrop.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        }, 300);
        
        // Reset form
        roomForm.reset();
        
        // Clear any validation messages
        clearAllErrors();
    }
    
    // Show error message
    function showError(input, message) {
        // Get the error message element
        const errorElement = document.getElementById(`error-${input.id}`);
        if (!errorElement) return;
        
        // Add error class to input group
        input.closest('.input-group').classList.add('error');
        
        // Set error message
        const messageSpan = errorElement.querySelector('span');
        if (messageSpan) {
            messageSpan.textContent = message;
        }
        
        // Show error message
        errorElement.classList.add('visible');
    }
    
    // Clear error message for specific input
    function clearError(input) {
        // Get the error message element
        const errorElement = document.getElementById(`error-${input.id}`);
        if (!errorElement) return;
        
        // Remove error class from input group
        input.closest('.input-group').classList.remove('error');
        
        // Hide error message
        errorElement.classList.remove('visible');
    }
    
    // Clear all error messages
    function clearAllErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.classList.remove('visible');
        });
        
        const errorInputs = document.querySelectorAll('.input-group.error');
        errorInputs.forEach(input => {
            input.classList.remove('error');
        });
    }
    
    // Validate form
    function validateForm() {
        let isValid = true;
        const inputs = roomForm.querySelectorAll('input, select, textarea');
        
        // Clear all errors first
        clearAllErrors();
        
        inputs.forEach(input => {
            const fieldName = input.name;
            const value = input.value.trim();
            
            // Skip validation for optional fields (description)
            if (fieldName === 'room-description') {
                return;
            }
            
            // Required field validation
            if (requiredFields[fieldName] && value === '') {
                isValid = false;
                showError(input, requiredFields[fieldName]);
                return;
            }
            
            // Skip additional validation if empty (already handled by required check)
            if (value === '') return;
            
            // Additional validation rules
            if (validationRules[fieldName]) {
                const rules = validationRules[fieldName];
                const numValue = parseFloat(value);
                
                if (rules.min !== undefined && numValue < rules.min) {
                    isValid = false;
                    showError(input, rules.message);
                } else if (rules.max !== undefined && numValue > rules.max) {
                    isValid = false;
                    showError(input, rules.message);
                }
            }
        });
        
        return isValid;
    }
    
    // Show success toast notification with improved animation
    function showSuccessToast() {
        successToast.classList.add('active');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            successToast.classList.remove('active');
        }, 3000);
    }
    
    // Submit form with loading animation
    function submitForm() {
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        const originalText = submitRoomBtn.innerHTML;
        submitRoomBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
        submitRoomBtn.disabled = true;
        
        // Simulate API call (replace with actual API call in the future)
        setTimeout(() => {
            // Reset button
            submitRoomBtn.innerHTML = originalText;
            submitRoomBtn.disabled = false;
            
            // Close modal
            closeModal();
            
            // Show success message
            showSuccessToast();
            
        }, 1500); // Simulate 1.5s delay for API call
    }
    
    // Event Listeners
    
    // Open modal
    if (createRoomBtn) {
        createRoomBtn.addEventListener('click', openModal);
    }
    
    // Open modal from empty state
    if (emptyCreateBtn) {
        emptyCreateBtn.addEventListener('click', openModal);
    }
    
    // Close modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Close modal on backdrop click
    if (createRoomBackdrop) {
        createRoomBackdrop.addEventListener('click', closeModal);
    }
    
    // Cancel button
    if (cancelRoomBtn) {
        cancelRoomBtn.addEventListener('click', closeModal);
    }
    
    // Submit form
    if (submitRoomBtn) {
        submitRoomBtn.addEventListener('click', submitForm);
    }
    
    // Prevent form submission and use our custom handler
    if (roomForm) {
        roomForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm();
        });
    }
    
    // Add better hover interactions to room cards
    roomCards.forEach(card => {
        // Add hover effect to join button when hovering over the card
        card.addEventListener('mouseenter', function() {
            const joinBtn = this.querySelector('.join-btn');
            if (joinBtn) {
                joinBtn.classList.add('hover-effect');
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const joinBtn = this.querySelector('.join-btn');
            if (joinBtn) {
                joinBtn.classList.remove('hover-effect');
            }
        });
        
        // Handle join button click
        const joinBtn = card.querySelector('.join-btn');
        if (joinBtn) {
            joinBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent card click
                // Future join room functionality can be implemented here
                console.log('Join room clicked');
            });
        }
    });
    
    // Input validation on blur
    function setupInputValidation() {
        const formInputs = roomForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                const fieldName = this.name;
                const value = this.value.trim();
                
                // Skip validation for optional fields
                if (fieldName === 'room-description') {
                    return;
                }
                
                // Required field validation
                if (requiredFields[fieldName] && value === '') {
                    showError(this, requiredFields[fieldName]);
                    return;
                }
                
                // Clear error if field is not empty
                if (value !== '') {
                    // Additional validation rules
                    if (validationRules[fieldName]) {
                        const rules = validationRules[fieldName];
                        const numValue = parseFloat(value);
                        
                        if (rules.min !== undefined && numValue < rules.min) {
                            showError(this, rules.message);
                        } else if (rules.max !== undefined && numValue > rules.max) {
                            showError(this, rules.message);
                        } else {
                            clearError(this);
                        }
                    } else {
                        clearError(this);
                    }
                }
            });
            
            // Clear error when user starts typing
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && createRoomModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Initialize the form
    initialize();
    setupInputValidation();
}); 