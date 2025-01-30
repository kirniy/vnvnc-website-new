// Cache for loaded pages
const pageCache = new Map();

// Main content container
const mainContent = document.querySelector('main');

// Function to cleanup page-specific effects
function cleanupPageEffects() {
    // Clear any existing intervals
    if (window._flipboardInterval) {
        clearInterval(window._flipboardInterval);
        window._flipboardInterval = null;
    }
}

// Function to update page content without reloading
function updatePage(url) {
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
        e.preventDefault();
        const url = new URL(link.href);
        updatePage(url.pathname);
    }
});

// Function to load page content
async function loadPage(url) {
    try {
        // Show loading state
        mainContent.style.opacity = '0';
        
        // Cleanup previous page effects
        cleanupPageEffects();
        
        // Try to get page from cache first
        let content = pageCache.get(url);
        let doc;
        
        if (!content) {
            const response = await fetch(url);
            const html = await response.text();
            
            // Create a temporary container to parse the HTML
            const parser = new DOMParser();
            doc = parser.parseFromString(html, 'text/html');
            
            // Get the main content
            content = doc.querySelector('main').innerHTML;
            
            // Cache the content and document
            pageCache.set(url, { content, doc });
        } else {
            doc = content.doc;
            content = content.content;
        }

        // For about page, setup background and scripts
        if (url.includes('about.html')) {
            // Add background
            const background = doc.querySelector('.fixed.inset-0.overflow-hidden');
            if (background) {
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
            
            // Get and apply page-specific scripts in correct order
            console.log('About page detected, starting script loading process...');
            const scripts = Array.from(doc.querySelectorAll('script')).filter(script => 
                !script.src && (
                    script.textContent.includes('FlipBoard') ||
                    script.textContent.includes('phrases') ||
                    script.textContent.includes('class FlipLetter')
                )
            );
            console.log('Found scripts:', scripts.length);

            // First, load variables
            console.log('Loading variables...');
            const variableScript = document.createElement('script');
            variableScript.textContent = `
                console.log('Defining variables: phrases, STATIC_SIZE, MAX_SIZE');
                if (typeof window.phrases === 'undefined') {
                    window.phrases = [
                        "место твоей силы",
                        "база честного движа",
                        "дом крутых людей",
                        "мир твоей свободы",
                        "территория вайба",
                        "танцы до рассвета",
                        "место твоих выходных",
                        "дом ночных авантюр",
                        "база крутого саунда",
                        "зона твоей ночи",
                        "просто база",
                        "винка ехала"
                    ];
                }
                if (typeof window.STATIC_SIZE === 'undefined') {
                    window.STATIC_SIZE = 19;
                }
                if (typeof window.MAX_SIZE === 'undefined') {
                    window.MAX_SIZE = 25;
                }
                console.log('Variables defined:', { 
                    STATIC_SIZE: window.STATIC_SIZE, 
                    MAX_SIZE: window.MAX_SIZE, 
                    phrasesCount: window.phrases.length 
                });
            `;
            document.body.appendChild(variableScript);

            // Then load classes
            console.log('Loading class definitions...');
            const classScripts = scripts.filter(script => 
                script.textContent.includes('class FlipLetter') ||
                script.textContent.includes('class FlipBoard')
            );
            console.log('Found class scripts:', classScripts.length);

            // Create a single script with all class definitions
            const combinedClassScript = document.createElement('script');
            combinedClassScript.textContent = `
                console.log('Defining FlipLetter and FlipBoard classes...');
                if (typeof window.FlipLetter === 'undefined') {
                    window.FlipLetter = class {
                        constructor(container) {
                            this.element = document.createElement('div');
                            this.element.className = 'flip-letter empty';
                            this.topHalf = document.createElement('div');
                            this.bottomHalf = document.createElement('div');
                            this.topHalf.className = 'top';
                            this.bottomHalf.className = 'bottom';
                            this.element.appendChild(this.topHalf);
                            this.element.appendChild(this.bottomHalf);
                            container.appendChild(this.element);

                            // Initialize with empty state (just empty space, no dash)
                            this.topHalf.textContent = ' ';
                            this.bottomHalf.textContent = ' ';
                        }

                        show() {
                            this.element.classList.remove('hidden-cell');
                        }

                        hide() {
                            this.element.classList.add('hidden-cell');
                        }

                        flip(to) {
                            return new Promise(resolve => {
                                const isEmpty = to === ' ' || to === '';
                                
                                if (isEmpty) {
                                    this.element.classList.add('empty');
                                    this.topHalf.textContent = ' ';
                                    this.bottomHalf.textContent = ' ';
                                    resolve();
                                    return;
                                }

                                this.element.classList.remove('empty');
                                this.element.classList.add('flipping');
                                
                                setTimeout(() => {
                                    this.topHalf.textContent = to;
                                    this.bottomHalf.textContent = to;
                                    
                                    setTimeout(() => {
                                        this.element.classList.remove('flipping');
                                        resolve();
                                    }, 100);
                                }, 100);
                            });
                        }
                    }
                }

                if (typeof window.FlipBoard === 'undefined') {
                    window.FlipBoard = class {
                        constructor(container) {
                            this.container = container;
                            this.letters = [];
                            this.visibleCells = window.STATIC_SIZE;
                            this.currentText = '';
                            
                            // Create letter cells
                            for (let i = 0; i < window.MAX_SIZE; i++) {
                                const letter = new window.FlipLetter(container);
                                this.letters.push(letter);
                                if (i >= this.visibleCells) {
                                    letter.hide();
                                }
                            }
                        }
                        
                        async setText(text) {
                            const paddedText = text
                                .toLowerCase()
                                .padEnd(this.visibleCells, ' ');
                            
                            // Flip letters with a slight cascade effect
                            const flipPromises = [];
                            for (let i = 0; i < this.visibleCells; i++) {
                                if (this.currentText[i] !== paddedText[i]) {
                                    const delay = i * 35;
                                    flipPromises.push(
                                        new Promise(resolve => {
                                            setTimeout(() => {
                                                this.letters[i].flip(paddedText[i]).then(resolve);
                                            }, delay);
                                        })
                                    );
                                }
                            }
                            
                            await Promise.all(flipPromises);
                            this.currentText = paddedText;
                        }
                    }
                }
                console.log('Classes defined:', { 
                    FlipLetterDefined: typeof window.FlipLetter !== 'undefined',
                    FlipBoardDefined: typeof window.FlipBoard !== 'undefined'
                });
            `;
            document.body.appendChild(combinedClassScript);
        }
        
        // Update the page content
        mainContent.innerHTML = content;
        
        // For about page, initialize flipboard
        if (url.includes('about.html')) {
            // Initialize flipboard with a slight delay to ensure scripts are loaded
            setTimeout(() => {
                console.log('Starting flipboard initialization...');
                const container = document.getElementById('rotating-text');
                console.log('Rotating text container:', container);
                console.log('FlipBoard class available:', typeof window.FlipBoard !== 'undefined');
                
                if (container && !container.querySelector('.flip-board') && window.FlipBoard) {
                    console.log('Container found and FlipBoard available');
                    
                    // First, ensure we have all required variables
                    console.log('Checking required variables:', {
                        STATIC_SIZE: typeof window.STATIC_SIZE,
                        phrases: typeof window.phrases,
                        STATIC_SIZE_value: window.STATIC_SIZE,
                        phrases_length: window.phrases?.length
                    });
                    
                    if (typeof window.STATIC_SIZE === 'undefined' || !window.phrases) {
                        console.error('Required variables for flipboard not found');
                        return;
                    }

                    try {
                        console.log('Creating new FlipBoard instance...');
                        const board = new window.FlipBoard(container);
                        console.log('FlipBoard instance created');
                        
                        // Initialize with empty state
                        console.log('Initializing with empty state...');
                        board.setText(' '.repeat(window.STATIC_SIZE)).then(() => {
                            console.log('Empty state set, starting text rotation...');
                            const updateText = async function() {
                                if (!window._flipboardIndex) window._flipboardIndex = 0;
                                console.log('Updating text to:', window.phrases[window._flipboardIndex]);
                                await board.setText(window.phrases[window._flipboardIndex]);
                                window._flipboardIndex = (window._flipboardIndex + 1) % window.phrases.length;
                                setTimeout(updateText, 3000);
                            };
                            setTimeout(updateText, 1000);
                        }).catch(error => {
                            console.error('Error initializing flipboard text:', error);
                        });
                    } catch (error) {
                        console.error('Error creating FlipBoard instance:', error);
                    }
                } else {
                    console.error('Failed to initialize flipboard:', {
                        containerExists: !!container,
                        hasExistingFlipBoard: container?.querySelector('.flip-board') !== null,
                        flipBoardClassExists: typeof window.FlipBoard !== 'undefined'
                    });
                }
            }, 500);
        }
        
        // Show content with fade effect
        setTimeout(() => {
            mainContent.style.opacity = '1';
        }, 300);
        
    } catch (error) {
        console.error('Error loading page:', error);
    }
}

// Function to initialize page-specific scripts
function initializePageScripts() {
    // VK Gallery on about page
    const vkGallery = document.getElementById('vk-gallery');
    if (vkGallery) {
        initializeVKGallery();
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    if (event.state?.path) {
        loadPage(event.state.path);
    }
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
    initializePageScripts();
}); 