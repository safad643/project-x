document.addEventListener('DOMContentLoaded', () => {
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    const desktopNavLinks = document.querySelectorAll('.desktop-nav a');

    // Map links by their href for easy matching
    const linkMap = [
        { mobile: null, desktop: null, href: '/homepage-view', text: 'Home' },
        { mobile: null, desktop: null, href: '/subscriptions-view', text: 'Subscriptions' },
        { mobile: null, desktop: null, href: '/rooms-view', text: 'Rooms' },
        { mobile: null, desktop: null, href: '#', text: 'My Rooms' },
        { mobile: null, desktop: null, href: '/contact-view', text: 'Contact' },
        { mobile: null, desktop: null, href: '/profile-view', text: 'Profile' } // Only in desktop
    ];

    // Associate mobile and desktop links with the map
    mobileNavLinks.forEach(mobileLink => {
        const text = mobileLink.textContent.trim();
        const mapItem = linkMap.find(item => item.text === text);
        if (mapItem) mapItem.mobile = mobileLink;
    });

    desktopNavLinks.forEach(desktopLink => {
        const text = desktopLink.textContent.trim();
        const mapItem = linkMap.find(item => item.text === text);
        if (mapItem) mapItem.desktop = desktopLink;
    });

    // Function to handle click and sync active class
    const handleLinkClick = (clickedLink, isMobile) => {
        // Prevent default to control navigation
        clickedLink.preventDefault();
        
        // Debug: Log clicked link
        console.log('Clicked:', clickedLink.target.textContent, 'from', isMobile ? 'mobile' : 'desktop');

        // Find matching link in linkMap
        const clickedText = clickedLink.target.textContent.trim();
        const mapItem = linkMap.find(item => item.text === clickedText);

        if (mapItem) {
            // Remove active class from all links
            linkMap.forEach(item => {
                if (item.mobile) item.mobile.classList.remove('active');
                if (item.desktop) item.desktop.classList.remove('active');
            });

            // Add active class to corresponding mobile and desktop links
            if (mapItem.mobile) mapItem.mobile.classList.add('active');
            if (mapItem.desktop) mapItem.desktop.classList.add('active');

            // Redirect to the link's href
            const href = clickedLink.target.getAttribute('href');
            if (href && href !== '#') {
                console.log('Redirecting to:', href);
                window.location.href = href;
            } else {
                console.log('No valid href for link:', clickedText);
            }
        }
    };

    // Add click event listeners to mobile and desktop links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => handleLinkClick(e, true));
    });

    desktopNavLinks.forEach(link => {
        link.addEventListener('click', (e) => handleLinkClick(e, false));
    });

    // Set initial active state based on current URL
    const currentPath = window.location.pathname;
    const currentMapItem = linkMap.find(item => item.href === currentPath);
    if (currentMapItem) {
        if (currentMapItem.mobile) currentMapItem.mobile.classList.add('active');
        if (currentMapItem.desktop) currentMapItem.desktop.classList.add('active');
    }
});