/**
 * PostAI Frontend Logic
 * Handles UI interactions, API calls, and State Management
 */

// Configuration
const CONFIG = {
    BACKEND_URL: window.BACKEND_URL || 'https://postai-backend-q8u9.onrender.com/api',
    LEMONSQUEEZY_PRO: window.LEMONSQUEEZY_PRO_VARIANT_ID || 'YOUR_PRO_VARIANT_ID',
    LEMONSQUEEZY_PREMIUM: window.LEMONSQUEEZY_PREMIUM_VARIANT_ID || 'YOUR_PREMIUM_VARIANT_ID'
};

// State
const state = {
    user: null,
    token: localStorage.getItem('postai_token'),
    theme: localStorage.getItem('theme') || 'light'
};

// DOM Elements
const elements = {
    themeToggle: document.getElementById('themeToggle'),
    loginForm: document.getElementById('loginForm'),
    contentForm: document.getElementById('contentForm'),
    subscriptionBadge: document.getElementById('subscriptionBadge'),
    statusDot: document.getElementById('statusDot'),
    statusText: document.getElementById('statusText'),
    resultBox: document.getElementById('resultBox'),
    resultContent: document.getElementById('resultContent'),
    submitBtn: document.getElementById('submitBtn'),
    btnText: document.getElementById('btnText'),
    btnSpinner: document.getElementById('btnSpinner')
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadUser();
    checkBackendStatus();
    setupEventListeners();
});

// Theme Management
function initTheme() {
    if (state.theme === 'dark') {
        document.body.classList.add('dark-mode');
        elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', state.theme);
    elements.themeToggle.innerHTML = state.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Auth & User Management
async function loadUser() {
    if (!state.token) return updateUI(null);

    try {
        const res = await fetch(`${CONFIG.BACKEND_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${state.token}` }
        });

        if (res.ok) {
            const data = await res.json();
            state.user = data.user;
            updateUI(state.user);
        } else {
            logout();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
    }
}

async function login(email) {
    try {
        const res = await fetch(`${CONFIG.BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!res.ok) throw new Error('Login failed');

        const data = await res.json();
        state.token = data.token;
        state.user = data.user;
        localStorage.setItem('postai_token', state.token);

        updateUI(state.user);
        showToast('Successfully logged in!', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function logout() {
    state.token = null;
    state.user = null;
    localStorage.removeItem('postai_token');
    updateUI(null);
}

function updateUI(user) {
    // Update Subscription Badge
    if (elements.subscriptionBadge) {
        const plan = user?.subscriptionPlan || 'free';
        elements.subscriptionBadge.className = `badge badge-${plan}`;
        elements.subscriptionBadge.textContent = plan.toUpperCase();
    }

    // Update Login Form visibility
    if (elements.loginForm) {
        const container = elements.loginForm.closest('.generator-card');
        if (user) {
            container.innerHTML = `
                <div class="text-center">
                    <h3>Welcome back, ${user.email}</h3>
                    <p class="text-gray">Current Plan: <span class="badge badge-${user.subscriptionPlan}">${user.subscriptionPlan.toUpperCase()}</span></p>
                    <button onclick="logout()" class="btn btn-secondary">Sign Out</button>
                </div>
            `;
        }
    }
}

// Content Generation
async function generateContent(e) {
    e.preventDefault();
    if (!state.token) return showToast('Please sign in to generate content', 'error');

    const formData = new FormData(elements.contentForm);
    const data = Object.fromEntries(formData.entries());

    // Get platforms as array
    const platforms = Array.from(document.querySelectorAll('input[name="platform"]:checked')).map(cb => cb.value);
    if (platforms.length === 0) return showToast('Select at least one platform', 'error');

    setLoading(true);

    try {
        const res = await fetch(`${CONFIG.BACKEND_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify({
                ...data,
                platforms,
                schedule: document.getElementById('schedulePost').checked,
                scheduledTime: document.getElementById('scheduleTime').value
            })
        });

        if (!res.ok) throw new Error('Generation failed');

        const result = await res.json();
        displayResult(result);
        showToast('Content generated successfully!', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        setLoading(false);
    }
}

function displayResult(data) {
    elements.resultBox.classList.add('show');
    elements.resultContent.textContent = JSON.stringify(data, null, 2);
    elements.resultBox.scrollIntoView({ behavior: 'smooth' });
}

// Utilities
async function checkBackendStatus() {
    try {
        const res = await fetch(CONFIG.BACKEND_URL);
        if (res.ok) {
            elements.statusDot.className = 'status-dot connected';
            elements.statusText.textContent = 'System Operational';
        }
    } catch {
        elements.statusDot.className = 'status-dot error';
        elements.statusText.textContent = 'Backend Offline';
    }
}

function setLoading(isLoading) {
    elements.submitBtn.disabled = isLoading;
    elements.btnText.textContent = isLoading ? 'Generating...' : 'Generate Content';
    elements.btnSpinner.style.display = isLoading ? 'inline-block' : 'none';
}

function showToast(message, type = 'info') {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `message ${type}`;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function setupEventListeners() {
    elements.themeToggle?.addEventListener('click', toggleTheme);

    elements.loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        login(email);
    });

    elements.contentForm?.addEventListener('submit', generateContent);

    // Schedule toggle
    const scheduleCheckbox = document.getElementById('schedulePost');
    if (scheduleCheckbox) {
        scheduleCheckbox.addEventListener('change', (e) => {
            document.getElementById('scheduleTime').style.display = e.target.checked ? 'block' : 'none';
        });
    }
}
