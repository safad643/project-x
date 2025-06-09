document.addEventListener('DOMContentLoaded', () => {
    console.log("Subscriptions.js loaded");
    
    // Mobile menu toggle
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

    // Get DOM elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const subscriptionCards = document.querySelectorAll('.subscription-card');
    const profileSubscriptionItems = document.querySelectorAll('.subscription-item');
    const emptyState = document.getElementById('empty-state');
    const modal = document.querySelector('.subscription-modal');
    const modalBackdrop = document.querySelector('.subscription-modal-backdrop');
    const closeModalBtn = document.querySelector('.modal-close-btn');

    console.log("Modal elements found:", {
        modal: !!modal,
        modalBackdrop: !!modalBackdrop,
        closeModalBtn: !!closeModalBtn
    });

    // Simple function to open modal
    function openModal() {
        modal.classList.add('active');
        modalBackdrop.classList.add('active');
    }
    
    // Simple function to close modal
    function closeModal() {
        modal.classList.remove('active');
        modalBackdrop.classList.remove('active');
    }
    
    // Add click event listeners to subscription cards
    subscriptionCards.forEach(card => {
        card.addEventListener('click', () => {
            console.log("Card clicked");
            openModal();
        });
    });
    
    // Close modal when clicking close button or backdrop
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }

    // Subscription Filtering
    if (filterButtons && filterButtons.length && subscriptionCards && subscriptionCards.length && emptyState) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                let visibleCount = 0;
                
                // Filter the subscription cards
                subscriptionCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-status') === filter) {
                        card.style.display = 'flex';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Show or hide empty state
                if (visibleCount === 0) {
                    emptyState.classList.remove('hidden');
                    
                    // Update empty state message based on filter
                    const emptyStateHeading = emptyState.querySelector('h3');
                    const emptyStateText = emptyState.querySelector('p');
                    
                    if (filter === 'active') {
                        emptyStateHeading.textContent = 'No active subscriptions';
                        emptyStateText.textContent = 'You don\'t have any active subscriptions yet.';
                    } else if (filter === 'expired') {
                        emptyStateHeading.textContent = 'No expired subscriptions';
                        emptyStateText.textContent = 'You don\'t have any expired subscriptions yet.';
                    } else {
                        emptyStateHeading.textContent = 'No subscriptions found';
                        emptyStateText.textContent = 'You don\'t have any subscriptions yet.';
                    }
                } else {
                    emptyState.classList.add('hidden');
                }
            });
        });
    }

    // Modal buttons functionality
    const contactAdminBtn = document.querySelector('.btn-contact-creator');
    
    if (contactAdminBtn) {
        contactAdminBtn.addEventListener('click', () => {
            // In a real app, this would open a messaging interface or email
            alert('Contact admin functionality would be implemented here.');
            // Don't close the modal so user can continue viewing details
        });
    }

    // Add click handlers to profile subscription items (if on profile page)
    if (profileSubscriptionItems && profileSubscriptionItems.length) {
        console.log(`Adding click handlers to ${profileSubscriptionItems.length} profile subscription items`);
        
        profileSubscriptionItems.forEach(item => {
            item.addEventListener('click', () => {
                console.log("Profile subscription item clicked");
                
                // Get item details
                const subscriptionName = item.querySelector('h4').textContent;
                const subscriptionPlan = item.querySelector('.subscription-plan')?.textContent || '';
                const statusEl = item.querySelector('.subscription-status');
                const status = statusEl && statusEl.classList.contains('active') ? 'active' : 'expired';
                const amount = item.querySelector('.subscription-cost')?.textContent || '$0.00/month';
                
                // Generate room name from subscription name if needed
                const roomName = subscriptionName + " Room";
                
                // Update modal title
                document.querySelector('.modal-title').textContent = subscriptionName;
                
                // Update modal room details
                const roomNameEl = document.getElementById('room-name');
                if (roomNameEl) roomNameEl.textContent = roomName;
                
                const roomStatusEl = document.getElementById('room-status');
                if (roomStatusEl) {
                    roomStatusEl.textContent = status === 'active' ? 'Active' : 'Expired';
                    roomStatusEl.className = `status-badge ${status}`;
                }
                
                const userShareEl = document.getElementById('user-share');
                if (userShareEl) userShareEl.textContent = amount;
                
                // Show the modal
                openModal();
            });
        });
    }

    // Fix for iOS 100vh issue
    function setVhProperty() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Set on initial load
    setVhProperty();

    // Update on resize and orientation change
    window.addEventListener('resize', setVhProperty);
    window.addEventListener('orientationchange', setVhProperty);
}); 