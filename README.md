# VNVNC Website

Modern, interactive website for VNVNC club in Saint Petersburg.

## Features

- Interactive wave background animation
- Dynamic typing effect with smooth transitions
- Physics-based spinning animations for interactive elements
- Responsive design with glass morphism effects
- SPA-like navigation with smooth transitions

## Project Structure

```
waves-vnvnc/
├── index.html              # Main landing page with hero section, events showcase
├── about.html             # About page with flipboard animation and video
├── events.html            # Events listing page with timeline
│
├── components/            # Reusable UI components
│   ├── head.html         # Common head section with meta tags and CSS imports
│   ├── navbar.html       # Navigation bar with glass-morphism design
│   └── footer.html       # Common footer with social links and copyright
│
├── js/                   # JavaScript modules
│   ├── navigation.js     # Handles SPA-like navigation and page transitions
│   ├── components.js     # Component loading and initialization
│   ├── wavy-background.js # Wave animation implementation
│   └── about.js         # About page specific animations (flipboard, etc.)
│
├── assets/               # Static assets
│   ├── cocktail1.png    # Images for animations
│   ├── disco-ball.png   # Spinning animation elements
│   ├── metal-margarita-cocktail.png
│   └── promo-video-vnvnc.mp4  # Background video for about page
│
├── styles.css           # Global styles and animations
├── server.js           # Development server
└── package.json        # Dependencies and scripts
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
node server.js
```

The site will be available at http://localhost:3001

## Dependencies

- simplex-noise: For wave animation generation
- express: Development server
- DaisyUI: UI component library
- TailwindCSS: Utility-first CSS framework

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

The project uses a modular approach with reusable components. Key features:

- Wave Background: Implemented using Canvas and simplex-noise
- Typing Effect: Custom implementation with smooth transitions
- Physics Animations: Interactive elements with realistic physics
- Component System: Dynamic loading with caching

## Deployment

The site is deployed using Netlify with automatic deployments from the main branch.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC License