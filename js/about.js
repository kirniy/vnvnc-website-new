// Flipboard variables
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
window.STATIC_SIZE = 19;
window.MAX_SIZE = 25;

// FlipLetter class
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

// FlipBoard class
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
};

// Initialize flipboard
function initializeFlipboard() {
    const container = document.getElementById('rotating-text');
    if (container && !container.querySelector('.flip-board')) {
        const board = new window.FlipBoard(container);
        
        // Initialize with empty state
        board.setText(' '.repeat(window.STATIC_SIZE)).then(() => {
            const updateText = async function() {
                if (!window._flipboardIndex) window._flipboardIndex = 0;
                await board.setText(window.phrases[window._flipboardIndex]);
                window._flipboardIndex = (window._flipboardIndex + 1) % window.phrases.length;
                setTimeout(updateText, 3000);
            };
            setTimeout(updateText, 1000);
        });
    }
}

// Initialize when the script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFlipboard);
} else {
    initializeFlipboard();
} 