// Function to load HTML components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;

        // If this is the navbar, handle active state
        if (elementId === 'navbar') {
            updateActiveNavLink(window.location.pathname);
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}

// Function to load head content
async function loadHeadContent() {
    try {
        const response = await fetch('/components/head.html');
        const html = await response.text();
        document.getElementById('head-content').innerHTML = html;
    } catch (error) {
        console.error('Error loading head content:', error);
    }
}

// Load all components when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadHeadContent();
    loadComponent('navbar', '/components/navbar.html');
    loadComponent('footer', '/components/footer.html');
}); 