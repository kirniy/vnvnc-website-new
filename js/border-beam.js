class BorderBeam {
    constructor(options = {}) {
        this.size = options.size || 200;
        this.duration = options.duration || 15;
        this.anchor = options.anchor || 90;
        this.borderWidth = options.borderWidth || 1.5;
        this.colorFrom = options.colorFrom || "#ffaa40";
        this.colorTo = options.colorTo || "#9c40ff";
        this.delay = options.delay || 0;
        this.className = options.className || '';
        
        this.element = this.createBeamElement();
    }

    createBeamElement() {
        const beam = document.createElement('div');
        
        // Set CSS custom properties
        beam.style.setProperty('--size', this.size);
        beam.style.setProperty('--duration', this.duration);
        beam.style.setProperty('--anchor', this.anchor);
        beam.style.setProperty('--border-width', this.borderWidth);
        beam.style.setProperty('--color-from', this.colorFrom);
        beam.style.setProperty('--color-to', this.colorTo);
        beam.style.setProperty('--delay', `-${this.delay}s`);

        // Add classes
        beam.className = `
            pointer-events-none absolute inset-0 rounded-[inherit]
            [border:calc(var(--border-width)*1px)_solid_transparent]
            ![mask-clip:padding-box,border-box]
            ![mask-composite:intersect]
            [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]
            after:absolute
            after:aspect-square
            after:w-[calc(var(--size)*1px)]
            after:animate-border-beam
            after:[animation-delay:var(--delay)]
            after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)]
            after:[motion-path:path('M0,0 L100,0 L100,100 L0,100 L0,0')]
            after:[motion-offset:0%]
            after:[motion-rotation:0deg]
            ${this.className}
        `.replace(/\s+/g, ' ').trim();

        // Add keyframe animation style
        const style = document.createElement('style');
        style.textContent = `
            @keyframes border-beam {
                0% { motion-offset: 0%; }
                100% { motion-offset: 100%; }
            }
        `;
        document.head.appendChild(style);

        return beam;
    }

    mount(container) {
        if (container) {
            container.appendChild(this.element);
        }
    }

    destroy() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

export { BorderBeam }; 