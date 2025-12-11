/**
 * API wrapper for Social Monkey frontend
 * Wraps the services API with simplified methods for pages
 */

const API_BASE_URL = window.BACKEND_URL || 'https://postai-backend-q8u9.onrender.com/api';

class ApiClient {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    getToken() {
        return localStorage.getItem('postai_token') || localStorage.getItem('postai_access_token');
    }

    async request(path, options = {}) {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        const response = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers,
            credentials: 'include'
        });

        if (response.status === 401) {
            // Try refresh token
            const refreshed = await this.refreshToken();
            if (refreshed) {
                // Retry with new token
                headers['Authorization'] = `Bearer ${this.getToken()}`;
                const retryResponse = await fetch(`${this.baseUrl}${path}`, {
                    ...options,
                    headers,
                    credentials: 'include'
                });
                return retryResponse.json();
            } else {
                // Redirect to login
                window.location.href = '/login';
                throw new Error('Unauthorized');
            }
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Request failed');
        }

        return data;
    }

    async refreshToken() {
        const refreshToken = localStorage.getItem('postai_refresh_token');
        if (!refreshToken) return false;

        try {
            const response = await fetch(`${this.baseUrl}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.accessToken) {
                    localStorage.setItem('postai_token', data.accessToken);
                    localStorage.setItem('postai_access_token', data.accessToken);
                    if (data.refreshToken) {
                        localStorage.setItem('postai_refresh_token', data.refreshToken);
                    }
                    return true;
                }
            }
        } catch (e) {
            console.error('Token refresh failed:', e);
        }

        return false;
    }

    // Auth endpoints
    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (data.accessToken || data.token) {
            localStorage.setItem('postai_token', data.accessToken || data.token);
            localStorage.setItem('postai_access_token', data.accessToken || data.token);
            if (data.refreshToken) {
                localStorage.setItem('postai_refresh_token', data.refreshToken);
            }
        }

        return data;
    }

    async register(email, password) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (data.accessToken || data.token) {
            localStorage.setItem('postai_token', data.accessToken || data.token);
            localStorage.setItem('postai_access_token', data.accessToken || data.token);
            if (data.refreshToken) {
                localStorage.setItem('postai_refresh_token', data.refreshToken);
            }
        }

        return data;
    }

    async getMe() {
        return this.request('/auth/me', { method: 'GET' });
    }

    // Content generation
    async generate(payload) {
        return this.request('/generate', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    async enrich(payload) {
        return this.request('/enrich', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    // Posts endpoints
    async getPosts() {
        return this.request('/posts', { method: 'GET' });
    }

    async createPost(payload) {
        return this.request('/posts', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    async updatePost(id, payload) {
        return this.request(`/posts/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(payload)
        });
    }

    async deletePost(id) {
        return this.request(`/posts/${id}`, { method: 'DELETE' });
    }

    // Schedules endpoints
    async getSchedules() {
        return this.request('/schedules', { method: 'GET' });
    }

    async createSchedule(payload) {
        return this.request('/schedules', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    async deleteSchedule(id) {
        return this.request(`/schedules/${id}`, { method: 'DELETE' });
    }

    // Subscription endpoints
    async getSubscription() {
        return this.request('/subscription', { method: 'GET' });
    }

    async createCheckout(variantId) {
        return this.request('/subscription/checkout', {
            method: 'POST',
            body: JSON.stringify({ variantId })
        });
    }
}

export const api = new ApiClient();
