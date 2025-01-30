// Cache for loaded pages
const pageCache = new Map();

// Main content container
const mainContent = document.querySelector('main');

// Function to cleanup page-specific effects
function cleanupPageEffects() {
    console.log('🧹 Cleaning up page effects...');
    if (window._flipboardInterval) {
        console.log('  - Clearing flipboard interval');
        clearInterval(window._flipboardInterval);
        window._flipboardInterval = null;
    }
    if (window._animationLoopRunning) {
        console.log('  - Stopping animation loop');
        window._animationLoopRunning = false;
    }
    if (window.bottleSpinner || window.cocktailSpinner) {
        console.log('  - Cleaning up spinners');
        window.bottleSpinner = null;
        window.cocktailSpinner = null;
    }
    if (window.wavyBackground) {
        console.log('  - Cleaning up wavy background');
        window.wavyBackground.destroy();
        window.wavyBackground = null;
    }
    console.log('✅ Cleanup complete');
}

// Function to reinitialize animations
function reinitializeAnimations() {
    console.log('🎬 Reinitializing animations...');
    console.log('  - SpinningObject available:', typeof SpinningObject !== 'undefined');
    
    // Reinitialize spinning objects
    if (typeof SpinningObject !== 'undefined') {
        const bottle = document.getElementById('bottle');
        const cocktail = document.getElementById('cocktail');
        
        console.log('  - Found elements:', { 
            bottle: !!bottle, 
            cocktail: !!cocktail 
        });
        
        if (bottle) {
            console.log('  - Creating bottle spinner');
            window.bottleSpinner = new SpinningObject(bottle, -15);
        }
        if (cocktail) {
            console.log('  - Creating cocktail spinner');
            window.cocktailSpinner = new SpinningObject(cocktail, 15);
        }

        // Restart animation loop if needed
        if ((window.bottleSpinner || window.cocktailSpinner) && !window._animationLoopRunning) {
            console.log('  - Starting animation loop');
            window._animationLoopRunning = true;
            
            function animate() {
                if (window.bottleSpinner) window.bottleSpinner.update();
                if (window.cocktailSpinner) window.cocktailSpinner.update();
                if (window._animationLoopRunning) {
                    requestAnimationFrame(animate);
                }
            }
            animate();

            // Reattach mouse movement handler
            console.log('  - Attaching mouse movement handler');
            document.addEventListener('mousemove', (e) => {
                if (window.bottleSpinner) window.bottleSpinner.applyForce(e.clientX, e.clientY);
                if (window.cocktailSpinner) window.cocktailSpinner.applyForce(e.clientX, e.clientY);
            });

            // Update positions on scroll
            console.log('  - Attaching scroll handler');
            window.addEventListener('scroll', () => {
                if (window.bottleSpinner && bottle) {
                    window.bottleSpinner.rect = bottle.getBoundingClientRect();
                    window.bottleSpinner.centerX = window.bottleSpinner.rect.left + window.bottleSpinner.rect.width / 2;
                    window.bottleSpinner.centerY = window.bottleSpinner.rect.top + window.bottleSpinner.rect.height / 2;
                }
                if (window.cocktailSpinner && cocktail) {
                    window.cocktailSpinner.rect = cocktail.getBoundingClientRect();
                    window.cocktailSpinner.centerX = window.cocktailSpinner.rect.left + window.cocktailSpinner.rect.width / 2;
                    window.cocktailSpinner.centerY = window.cocktailSpinner.rect.top + window.cocktailSpinner.rect.height / 2;
                }
            });
        }
    }
    console.log('✅ Animation initialization complete');
}

// Function to update page content without reloading
function updatePage(url) {
    console.log('📄 Updating page state for:', url);
    // Update URL without page reload
    window.history.pushState({}, '', url);
    
    // Update active nav link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === url) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Handle navigation
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.href.startsWith(window.location.origin)) {
        console.log('🔗 Navigation click detected:', link.href);
        e.preventDefault();
        const url = new URL(link.href);
        loadPage(url.pathname);
    }
});

// Function to load page content
async function loadPage(url) {
    console.log('📥 Loading page:', url);
    
    // Prevent double loading
    if (window._isLoading) {
        console.log('⚠️ Page load already in progress, skipping');
        return;
    }
    window._isLoading = true;
    
    try {
        // Show loading state
        mainContent.style.opacity = '0';
        
        // Cleanup previous page effects
        cleanupPageEffects();
        
        // Try to get page from cache first
        let content = pageCache.get(url);
        let doc;
        
        if (!content) {
            console.log('  - Fetching new page content');
            // Use index.html for root path
            const fetchUrl = url === '/' ? '/index.html' : url;
            const response = await fetch(fetchUrl);
            const html = await response.text();
            
            // Create a temporary container to parse the HTML
            const parser = new DOMParser();
            doc = parser.parseFromString(html, 'text/html');
            
            // Get the main content
            content = doc.querySelector('main').innerHTML;
            
            // Cache the content and document
            pageCache.set(url, { content, doc });
        } else {
            console.log('  - Using cached page content');
            doc = content.doc;
            content = content.content;
        }

        // For about page, setup background and scripts
        if (url.includes('about.html')) {
            console.log('  - Setting up about page');
            // Add background
            const background = doc.querySelector('.fixed.inset-0.overflow-hidden');
            if (background) {
                const existingBackground = document.querySelector('.fixed.inset-0.overflow-hidden');
                if (existingBackground) existingBackground.remove();
                document.body.insertBefore(background.cloneNode(true), document.body.firstChild);
            }
            
            // Get and apply page-specific styles
            const pageStyles = doc.querySelector('style');
            if (pageStyles) {
                const existingPageStyles = document.getElementById('page-specific-styles');
                if (existingPageStyles) existingPageStyles.remove();
                
                pageStyles.id = 'page-specific-styles';
                document.head.appendChild(pageStyles.cloneNode(true));
            }
            
            // Clear any existing flipboard intervals
            if (window._flipboardInterval) {
                clearInterval(window._flipboardInterval);
                window._flipboardInterval = null;
            }
            if (window._flipboardTimeout) {
                clearTimeout(window._flipboardTimeout);
                window._flipboardTimeout = null;
            }
        }
        
        // Update the page content
        console.log('  - Updating page content');
        mainContent.innerHTML = content;

        // Update URL and navigation state
        updatePage(url);
        
        // Reinitialize animations for the new content
        console.log('  - Starting reinitialization timeout');
        setTimeout(() => {
            // Initialize flipboard first if on about page
            if (url.includes('about.html') && typeof initializeFlipboard === 'function') {
                console.log('  - Initializing flipboard');
                initializeFlipboard();
            }
            
            // Then initialize animations
            reinitializeAnimations();
            mainContent.style.opacity = '1';
            
            console.log('✅ Page load complete');
            window._isLoading = false;
        }, 300);
        
    } catch (error) {
        console.error('❌ Error loading page:', error);
        mainContent.style.opacity = '1';
        window._isLoading = false;
    }
}

// Function to initialize page-specific scripts
function initializePageScripts() {
    console.log('🔧 Initializing page-specific scripts');
    const currentPath = window.location.pathname;
    
    // About page initialization
    if (currentPath.includes('about.html') && typeof initializeFlipboard === 'function') {
        console.log('  - Found about page, initializing flipboard');
        initializeFlipboard();
    }
    
    // Initialize animations for all pages
    reinitializeAnimations();
}

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    console.log('◀️ Browser navigation detected');
    loadPage(window.location.pathname);
});

// Add smooth navigation to all internal links
document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (link && link.href.startsWith(window.location.origin)) {
        event.preventDefault();
        loadPage(link.getAttribute('href'));
    }
});

// Add transition styles
document.head.insertAdjacentHTML('beforeend', `
    <style>
        main {
            transition: opacity 0.3s ease-in-out;
        }
    </style>
`);

// Initialize page-specific scripts on first load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initial page load');
    initializePageScripts();
}); 