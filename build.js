const fs = require('fs');
const path = require('path');

// Read component files
const navbar = fs.readFileSync(path.join(__dirname, 'components', 'navbar.html'), 'utf8');
const footer = fs.readFileSync(path.join(__dirname, 'components', 'footer.html'), 'utf8');
const head = fs.readFileSync(path.join(__dirname, 'components', 'head.html'), 'utf8');

// Read the main HTML files
const files = ['index.html', 'about.html', 'events.html'];

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Create node_modules in dist for simplex-noise
if (!fs.existsSync('dist/node_modules')) {
    fs.mkdirSync('dist/node_modules', { recursive: true });
}

// Copy simplex-noise module
const simplexNoisePath = path.join('node_modules', 'simplex-noise');
if (fs.existsSync(simplexNoisePath)) {
    fs.cpSync(simplexNoisePath, path.join('dist', 'node_modules', 'simplex-noise'), { recursive: true });
}

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace component placeholders with actual content
    content = content.replace(/<div id="navbar"[^>]*>.*?<\/div>/s, navbar);
    content = content.replace(/<div id="footer"[^>]*>.*?<\/div>/s, footer);
    content = content.replace(/<div id="head-content"[^>]*>.*?<\/div>/s, head);
    
    // Remove the components.js script since we're inlining components
    content = content.replace(/<script src="js\/components\.js"><\/script>/g, '');
    
    // Write to dist folder
    fs.writeFileSync(path.join('dist', file), content);
});

// Copy other necessary files
const filesToCopy = [
    'styles.css',
    'js/navigation.js',
    'js/about.js',
    'js/wavy-background.js',
    'js/spinning.js',
    'js/border-beam.js',
    'assets/cocktail1.png',
    'assets/disco-ball.png',
    'assets/metal-margarita-cocktail.png',
    'assets/promo-video-vnvnc.mp4'
];

filesToCopy.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    const targetPath = path.join('dist', file);
    const targetDir = path.dirname(targetPath);
    
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    
    fs.copyFileSync(file, targetPath);
});

// Copy package.json and package-lock.json for Netlify
['package.json', 'package-lock.json'].forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join('dist', file));
    }
}); 