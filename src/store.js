/**
 * State management for Social Monkey frontend
 * Simple reactive store for user session and app state
 */

class Store {
    constructor() {
        this.state = {
            user: null,
            token: null,
            isAuthenticated: false
        };

        // Initialize from localStorage
        this.init();
    }

    init() {
        const token = localStorage.getItem('postai_token') || localStorage.getItem('postai_access_token');
        const userStr = localStorage.getItem('postai_user');

        if (token) {
            this.state.token = token;
            this.state.isAuthenticated = true;
        }

        if (userStr) {
            try {
                this.state.user = JSON.parse(userStr);
            } catch (e) {
                console.error('Failed to parse user from localStorage');
            }
        }
    }

    setToken(token) {
        this.state.token = token;
        this.state.isAuthenticated = !!token;
        if (token) {
            localStorage.setItem('postai_token', token);
            localStorage.setItem('postai_access_token', token);
        } else {
            localStorage.removeItem('postai_token');
            localStorage.removeItem('postai_access_token');
        }
    }

    setUser(user) {
        this.state.user = user;
        if (user) {
            localStorage.setItem('postai_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('postai_user');
        }
    }

    getToken() {
        return this.state.token || localStorage.getItem('postai_token') || localStorage.getItem('postai_access_token');
    }

    getUser() {
        if (this.state.user) return this.state.user;

        const userStr = localStorage.getItem('postai_user');
        if (userStr) {
            try {
                this.state.user = JSON.parse(userStr);
                return this.state.user;
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    isAuthenticated() {
        return !!(this.state.token || localStorage.getItem('postai_token'));
    }

    logout() {
        this.state.user = null;
        this.state.token = null;
        this.state.isAuthenticated = false;

        localStorage.removeItem('postai_token');
        localStorage.removeItem('postai_access_token');
        localStorage.removeItem('postai_refresh_token');
        localStorage.removeItem('postai_user');

        // Redirect to login
        window.location.href = '/login';
    }

    // Subscribe to state changes (simple implementation)
    subscribe(callback) {
        // Could implement reactive state here if needed
        callback(this.state);
    }
}

export const store = new Store();
