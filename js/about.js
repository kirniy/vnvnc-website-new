console.log('📜 Loading about.js script');

// Flipboard variables
if (typeof window.phrases === 'undefined') {
    console.log('  - Initializing phrases');
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

console.log('📊 Initialized flipboard variables:', {
    phrasesCount: window.phrases.length,
    STATIC_SIZE: window.STATIC_SIZE,
    MAX_SIZE: window.MAX_SIZE
});

// FlipLetter class
if (typeof window.FlipLetter === 'undefined') {
    console.log('  - Defining FlipLetter class');
    window.FlipLetter = class {
        constructor(container) {
            console.log('  - Creating new FlipLetter');
            this.element = document.createElement('div');
            this.element.className = 'flip-letter empty';
            this.topHalf = document.createElement('div');
            this.bottomHalf = document.createElement('div');
            this.topHalf.className = 'top';
            this.bottomHalf.className = 'bottom';
            this.element.appendChild(this.topHalf);
            this.element.appendChild(this.bottomHalf);
            container.appendChild(this.element);

            // Initialize with empty state
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
    };
}

// FlipBoard class
if (typeof window.FlipBoard === 'undefined') {
    console.log('  - Defining FlipBoard class');
    window.FlipBoard = class {
        constructor(container) {
            console.log('🎲 Creating new FlipBoard');
            this.container = container;
            this.letters = [];
            this.visibleCells = window.STATIC_SIZE;
            this.currentText = '';
            
            console.log('  - Creating letter cells:', window.MAX_SIZE);
            for (let i = 0; i < window.MAX_SIZE; i++) {
                const letter = new window.FlipLetter(container);
                this.letters.push(letter);
                if (i >= this.visibleCells) {
                    letter.hide();
                }
            }
            console.log('  - FlipBoard initialization complete');
        }
        
        async setText(text) {
            console.log('📝 Setting text:', text);
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
            console.log('  - Text set complete');
        }
    };
}

// Initialize flipboard
function initializeFlipboard() {
    console.log('🎬 Initializing flipboard...');
    
    // Clear any existing intervals/timeouts
    if (window._flipboardInterval) {
        clearInterval(window._flipboardInterval);
        window._flipboardInterval = null;
    }
    if (window._flipboardTimeout) {
        clearTimeout(window._flipboardTimeout);
        window._flipboardTimeout = null;
    }
    
    const container = document.getElementById('rotating-text');
    console.log('  - Container found:', !!container);
    
    if (container && !container.querySelector('.flip-board')) {
        console.log('  - Creating new board instance');
        const board = new window.FlipBoard(container);
        
        console.log('  - Setting initial empty state');
        board.setText(' '.repeat(window.STATIC_SIZE)).then(() => {
            console.log('  - Starting text rotation');
            const updateText = async function() {
                if (!document.getElementById('rotating-text')) {
                    console.log('❌ Flipboard container removed, stopping rotation');
                    if (window._flipboardTimeout) {
                        clearTimeout(window._flipboardTimeout);
                        window._flipboardTimeout = null;
                    }
                    return;
                }
                
                if (!window._flipboardIndex) window._flipboardIndex = 0;
                console.log('  - Updating to phrase:', window.phrases[window._flipboardIndex]);
                await board.setText(window.phrases[window._flipboardIndex]);
                window._flipboardIndex = (window._flipboardIndex + 1) % window.phrases.length;
                window._flipboardTimeout = setTimeout(updateText, 3000);
            };
            window._flipboardTimeout = setTimeout(updateText, 1000);
        });
    } else {
        console.log('❌ Could not initialize flipboard:', {
            containerExists: !!container,
            hasExistingBoard: container?.querySelector('.flip-board') !== null
        });
    }
}

// Export the initialization function for navigation.js to use
window.initializeFlipboard = initializeFlipboard;

// Cleanup function for border beam
window.cleanupAboutPage = function() {
    console.log('🧹 Cleaning up about page effects...');
    
    // Clear flipboard intervals/timeouts
    if (window._flipboardInterval) {
        clearInterval(window._flipboardInterval);
        window._flipboardInterval = null;
    }
    if (window._flipboardTimeout) {
        clearTimeout(window._flipboardTimeout);
        window._flipboardTimeout = null;
    }
    
    // Clean up border beam
    if (window.borderBeam) {
        window.borderBeam.destroy();
        window.borderBeam = null;
    }
};

// Initialize when the script loads if we're on the about page
console.log('🔄 Checking document state:', document.readyState);
if (window.location.pathname.includes('about.html')) {
    if (document.readyState === 'loading') {
        console.log('  - Document still loading, adding event listener');
        document.addEventListener('DOMContentLoaded', initializeFlipboard);
    } else {
        console.log('  - Document ready, initializing immediately');
        initializeFlipboard();
    }
} 