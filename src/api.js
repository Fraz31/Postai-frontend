/**
 * API Client
 */
import { store } from './store.js';

const BASE_URL = 'https://postai-backend-q8u9.onrender.com/api';

async function request(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (store.state.token) {
        headers['Authorization'] = `Bearer ${store.state.token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        store.logout();
        return;
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API Error');
    }

    return data;
}

export const api = {
    login: (email) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email }) }),
    register: (email) => request('/auth/register', { method: 'POST', body: JSON.stringify({ email }) }), // Assuming register is same as login for now or separate
    getMe: () => request('/auth/me'),
    generate: (data) => request('/generate', { method: 'POST', body: JSON.stringify(data) }),
    // Add posts/schedules when backend is fixed
};
