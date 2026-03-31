/**
 * Portfolio Website - JavaScript Functionality
 */

// ============================
// DOM Elements
// ============================

const themeToggle = document.getElementById('themeToggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const projectsGrid = document.getElementById('projectsGrid');

// ============================
// Theme Toggle
// ============================

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    const isDarkMode = savedTheme === 'dark';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    } else {
        document.body.classList.remove('dark-mode');
        updateThemeIcon(false);
    }
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    updateThemeIcon(isDarkMode);
    localStorage.setItem('portfolio-theme', isDarkMode ? 'dark' : 'light');
});

// Update theme icon
function updateThemeIcon(isDarkMode) {
    const icon = themeToggle.querySelector('i');
    if (isDarkMode) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ============================
// Mobile Menu
// ============================

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ============================
// Scroll Animations
// ============================

// Add fade-in animation to sections on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Observe project cards
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });
    }, 500);
});

// ============================
// Smooth Scroll for Navigation
// ============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================
// Navbar Shadow on Scroll
// ============================

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-sm)';
    }
});

// ============================
// Form Handling
// ============================

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Validate form
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email', 'error');
        return;
    }
    
    // Show success message (since we can't actually send emails from frontend)
    showNotification('Message sent! I\'ll get back to you soon.', 'success');
    
    // Log to console for debugging
    console.log('Form submitted:', { name, email, message });
    
    // Reset form
    contactForm.reset();
});

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 0.5rem;
        z-index: 2000;
        animation: slideInRight 300ms ease;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 300ms ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ============================
// Dynamic Project Loading
// ============================

async function loadProjects() {
    try {
        // Fetch projects data
        const response = await fetch('data/projects.json');
        const projects = await response.json();
        
        // Populate projects grid
        projectsGrid.innerHTML = '';
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
            
            // Observe project card for animation
            observer.observe(projectCard);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        
        // Fallback if JSON can't be loaded
        projectsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">
                <p>Projects are loading. Please check back soon!</p>
            </div>
        `;
    }
}

// Create project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const techStack = project.tech
        .map(tech => `<span class="tech-tag">${tech}</span>`)
        .join('');
    
    card.innerHTML = `
        <img src="${project.screenshot}" alt="${project.title}" class="project-image" onerror="this.src='assets/images/placeholder.jpg'">
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <div class="project-description">
                <p>${project.description}</p>
            </div>
            <div class="project-tech">
                ${techStack}
            </div>
            <div class="project-buttons">
                <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
                    <i class="fab fa-github"></i> GitHub
                </a>
                <a href="${project.liveDemoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// ============================
// Keyboard Navigation
// ============================

document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ============================
// Accessibility: Focus visible
// ============================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('tab-focus');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('tab-focus');
});

// ============================
// Initialize on Load
// ============================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initializeTheme();
    
    // Load projects
    loadProjects();
    
    // Add smooth scroll behavior polyfill for older browsers
    if (!('scrollBehavior' in document.documentElement.style)) {
        console.log('Smooth scroll not supported, using fallback');
    }
});

// ============================
// Utility Functions
// ============================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add print styles for resume download
window.addEventListener('beforeprint', () => {
    document.querySelector('.navbar').style.display = 'none';
    document.querySelector('.contact-form').style.display = 'none';
});

window.addEventListener('afterprint', () => {
    location.reload();
});

// Error handling for external resources
window.addEventListener('error', (e) => {
    if (e.filename && e.filename.includes('external')) {
        console.warn('External resource failed to load:', e.filename);
    }
}, true);
