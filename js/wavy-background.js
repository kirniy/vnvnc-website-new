import { createNoise3D } from '/node_modules/simplex-noise/dist/esm/simplex-noise.js';

class WavyBackground {
    constructor(options = {}) {
        this.colors = options.colors || [
            "#38bdf8",
            "#818cf8",
            "#c084fc",
            "#e879f9",
            "#22d3ee",
        ];
        this.waveWidth = options.waveWidth || 50;
        this.backgroundFill = options.backgroundFill || "black";
        this.blur = options.blur || 10;
        this.speed = options.speed || "fast";
        this.waveOpacity = options.waveOpacity || 0.5;
        
        this.noise = createNoise3D();
        this.canvas = null;
        this.ctx = null;
        this.w = 0;
        this.h = 0;
        this.nt = 0;
        this.animationId = null;
        
        this.init();
    }

    getSpeed() {
        return this.speed === "slow" ? 0.001 : 0.002;
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set initial styles
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '0';
        this.canvas.style.top = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        
        const updateDimensions = () => {
            const container = document.getElementById('wavy-background-container');
            if (!container) return;
            
            const rect = container.getBoundingClientRect();
            this.w = this.canvas.width = rect.width;
            this.h = this.canvas.height = rect.height;
            this.ctx.filter = `blur(${this.blur}px)`;
        };
        
        updateDimensions();
        
        const resizeObserver = new ResizeObserver(() => {
            updateDimensions();
        });
        
        resizeObserver.observe(this.canvas);
        this.render();

        if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
            this.canvas.style.filter = `blur(${this.blur}px)`;
        }

        return this.canvas;
    }

    drawWave(n) {
        this.nt += this.getSpeed();
        
        for (let i = 0; i < n; i++) {
            this.ctx.beginPath();
            this.ctx.lineWidth = this.waveWidth;
            this.ctx.strokeStyle = this.colors[i % this.colors.length];
            
            // Simple wave drawing with fixed step size
            for (let x = 0; x < this.w; x += 5) {
                const y = this.noise(x / 800, 0.3 * i, this.nt) * 100;
                if (x === 0) {
                    this.ctx.moveTo(x, y + this.h * 0.2);
                } else {
                    this.ctx.lineTo(x, y + this.h * 0.2);
                }
            }
            
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    render = () => {
        if (!this.ctx) return;
        
        this.ctx.fillStyle = this.backgroundFill;
        this.ctx.globalAlpha = this.waveOpacity;
        this.ctx.fillRect(0, 0, this.w, this.h);
        
        this.drawWave(5);
        
        this.animationId = requestAnimationFrame(this.render);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.canvas.remove();
    }
}

export { WavyBackground }; 