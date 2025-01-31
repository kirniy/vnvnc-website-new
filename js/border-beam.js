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
            after:[offset-anchor:calc(var(--anchor)*1%)_50%]
            after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]
            ${this.className}
        `.replace(/\s+/g, ' ').trim();

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