/**
 * Client-Side Router
 */
import { store } from './store.js';

const routes = {
    '/': () => import('./pages/Landing.js').then(m => m.Landing()),
    '/login': () => import('./pages/Login.js').then(m => m.Login()),
    '/register': () => import('./pages/Register.js').then(m => m.Register()),
    '/dashboard': () => import('./pages/Dashboard.js').then(m => m.Dashboard()),
    '/contact': () => import('./pages/Contact.js').then(m => m.Contact()),
    '/privacy': () => import('./pages/Privacy.js').then(m => m.Privacy()),
    '/terms': () => import('./pages/Terms.js').then(m => m.Terms()),
};

export class Router {
    constructor() {
        this.app = document.getElementById('app');
        this.init();
    }

    init() {
        // Handle back/forward
        window.addEventListener('popstate', () => this.handleRoute());

        // Handle links
        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigateTo(e.target.href);
            }
        });

        this.handleRoute();
    }

    navigateTo(url) {
        history.pushState(null, null, url);
        this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.pathname;

        // Protected routes check
        if (path.startsWith('/dashboard') && !store.isAuthenticated()) {
            this.navigateTo('/login');
            return;
        }

        // Redirect logged in users from auth pages
        if ((path === '/login' || path === '/register') && store.isAuthenticated()) {
            this.navigateTo('/dashboard');
            return;
        }

        const route = routes[path] || routes['/'];

        try {
            const component = await route();
            this.app.innerHTML = '';
            this.app.appendChild(component);
        } catch (error) {
            console.error('Route error:', error);
            this.app.innerHTML = '<h1>404 - Page Not Found</h1>';
        }
    }
}
