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
const contactSubmitButton = contactForm?.querySelector('button[type="submit"]');
const projectsGrid = document.getElementById('projectsGrid');
const DEFAULT_PROJECT_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0" x2="1" y1="0" y2="1"%3E%3Cstop offset="0%25" stop-color="%230f172a"/%3E%3Cstop offset="100%25" stop-color="%232563eb"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="1200" height="675" rx="24" fill="url(%23g)"/%3E%3Ctext x="50%25" y="48%25" text-anchor="middle" font-family="Arial,sans-serif" font-size="56" font-weight="700" fill="white"%3EProject Preview%3C/text%3E%3Ctext x="50%25" y="58%25" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" fill="rgba(255,255,255,0.85)"%3EScreenshot coming soon%3C/text%3E%3C/svg%3E';

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
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        updateThemeIcon(isDarkMode);
        localStorage.setItem('portfolio-theme', isDarkMode ? 'dark' : 'light');
    });
}

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

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

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

// Project cards are observed as they are rendered in loadProjects().

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
let isNavbarTicking = false;

function updateNavbarShadow() {
    if (!navbar) return;
    navbar.style.boxShadow = window.scrollY > 10 ? 'var(--shadow-md)' : 'var(--shadow-sm)';
    isNavbarTicking = false;
}

window.addEventListener('scroll', () => {
    if (!isNavbarTicking) {
        window.requestAnimationFrame(updateNavbarShadow);
        isNavbarTicking = true;
    }
}, { passive: true });

// ============================
// Form Handling
// ============================

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email', 'error');
            return;
        }

        setFormSubmittingState(true);

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Form submission failed.');
            }

            showNotification('Message sent successfully. I\'ll get back to you soon.', 'success');
            contactForm.reset();
        } catch (error) {
            console.error('Contact form error:', error);
            showNotification('Unable to send message right now. Please try again or email me directly.', 'error');
        } finally {
            setFormSubmittingState(false);
        }
    });
}

function setFormSubmittingState(isSubmitting) {
    if (!contactSubmitButton) return;
    contactSubmitButton.disabled = isSubmitting;
    contactSubmitButton.textContent = isSubmitting ? 'Sending...' : 'Send Message';
}

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
    if (!projectsGrid) return;

    try {
        const response = await fetch('data/projects.json');

        if (!response.ok) {
            throw new Error(`Failed to load projects: ${response.status}`);
        }

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

    const imageSrc = project.screenshot || DEFAULT_PROJECT_IMAGE;
    const hasGithubUrl = project.githubUrl && !project.githubUrl.includes('yourusername');
    const hasLiveDemoUrl = project.liveDemoUrl && !project.liveDemoUrl.includes('example.com');

    card.innerHTML = `
        <img src="${imageSrc}" alt="${project.title} preview" class="project-image" loading="lazy" decoding="async">
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <div class="project-description">
                <p>${project.description}</p>
            </div>
            <div class="project-tech">
                ${techStack}
            </div>
            <div class="project-buttons">
                ${hasGithubUrl ? `
                <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
                    <i class="fab fa-github"></i> GitHub
                </a>` : `
                <span class="btn btn-secondary btn-disabled" aria-disabled="true">
                    <i class="fab fa-github"></i> Private
                </span>`}
                ${hasLiveDemoUrl ? `
                <a href="${project.liveDemoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>` : `
                <span class="btn btn-primary btn-disabled" aria-disabled="true">
                    <i class="fas fa-clock"></i> Coming Soon!
                </span>`}
            </div>
        </div>
    `;

    const projectImage = card.querySelector('.project-image');
    if (projectImage) {
        projectImage.addEventListener('error', () => {
            projectImage.src = DEFAULT_PROJECT_IMAGE;
        }, { once: true });
    }

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
