const fs = require('fs');
const path = require('path');

// Read component files
const navbar = fs.readFileSync(path.join(__dirname, 'components', 'navbar.html'), 'utf8');
const footer = fs.readFileSync(path.join(__dirname, 'components', 'footer.html'), 'utf8');
const head = fs.readFileSync(path.join(__dirname, 'components', 'head.html'), 'utf8');

// Read the main HTML files
const files = ['index.html', 'about.html', 'events.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace component placeholders with actual content
    content = content.replace('<div id="navbar"></div>', navbar);
    content = content.replace('<div id="footer"></div>', footer);
    content = content.replace('<div id="head-content"></div>', head);
    
    // Write to dist folder
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }
    fs.writeFileSync(path.join('dist', file), content);
});

// Copy other necessary files
const filesToCopy = [
    'styles.css',
    'js/navigation.js',
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