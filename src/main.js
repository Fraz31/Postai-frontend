/**
 * Social Monkey - Main Entry Point
 * Initializes the SPA router
 */
import { Router } from './router.js';

// Initialize the router when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Router();
});
