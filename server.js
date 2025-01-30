const express = require('express');
const path = require('path');
const app = express();

// Serve static files from root directory
app.use(express.static(__dirname));

// Handle component requests
app.get('/components/*', (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

// Handle all routes to support SPA-like navigation
app.get('*', (req, res) => {
    // If it's a specific page request, serve that page
    if (req.path.endsWith('.html')) {
        res.sendFile(path.join(__dirname, req.path));
    } else {
        // Default to index.html
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Press Ctrl+C to stop the server`);
}); 