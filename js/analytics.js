/**
 * Vercel Web Analytics
 * 
 * This script initializes Vercel Web Analytics for the portfolio site.
 * It uses the recommended approach for static HTML sites.
 * 
 * Documentation: https://vercel.com/docs/analytics/quickstart
 */

(function() {
    'use strict';
    
    // Initialize Vercel Analytics queue
    window.va = window.va || function () { 
        (window.vaq = window.vaq || []).push(arguments); 
    };
    
    // Create and inject the analytics script
    const script = document.createElement('script');
    script.defer = true;
    script.src = '/_vercel/insights/script.js';
    
    // Append script to head or body
    const target = document.head || document.body;
    if (target) {
        target.appendChild(script);
    }
    
    // Log initialization (only in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Vercel Analytics initialized (development mode)');
    }
})();
