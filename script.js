/**
 * Social Monkey Frontend Logic
 * Complete MVP with all features working
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
    token: localStorage.getItem('socialmonkey_token'),
    theme: localStorage.getItem('theme') || 'light'
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🐵 Social Monkey initialized!');
    initTheme();
    loadUser();
    checkBackendStatus();
    setupEventListeners();
});

// Theme Management
function initTheme() {
    if (state.theme === 'dark') {
        document.body.classList.add('dark-mode');
        const toggle = document.getElementById('themeToggle');
        if (toggle) toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', state.theme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.innerHTML = state.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

// Auth & User Management
async function loadUser() {
    if (!state.token) return;

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
    const statusEl = document.getElementById('loginStatus');
    if (statusEl) statusEl.textContent = 'Signing in...';

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
        localStorage.setItem('socialmonkey_token', state.token);

        updateUI(state.user);
        showToast('Welcome to Social Monkey! 🐵', 'success');

        if (statusEl) statusEl.textContent = `Signed in as ${data.user.email}`;
    } catch (error) {
        showToast('Unable to sign in. Please try again.', 'error');
        if (statusEl) statusEl.textContent = 'Sign in failed';
    }
}

function logout() {
    state.token = null;
    state.user = null;
    localStorage.removeItem('socialmonkey_token');
    updateUI(null);
    showToast('Signed out successfully', 'info');
}

function updateUI(user) {
    // Update Subscription Badge
    const badge = document.getElementById('subscriptionBadge');
    if (badge) {
        const plan = user?.subscriptionPlan || 'free';
        badge.className = `badge badge-${plan}`;
        badge.textContent = plan.toUpperCase();
    }

    // Update Pricing Buttons
    updatePricingButtons(user?.subscriptionPlan || 'free');
}

function updatePricingButtons(plan) {
    const plans = ['free', 'pro', 'premium'];
    plans.forEach(p => {
        const btn = document.getElementById(`${p}PlanButton`);
        if (btn) {
            btn.disabled = plan === p;
            btn.textContent = plan === p ? 'Current Plan' : `Upgrade to ${p.charAt(0).toUpperCase() + p.slice(1)}`;
        }
    });
}

// Content Generation
async function generateContent(e) {
    e.preventDefault();

    if (!state.token) {
        showToast('Please sign in to generate content', 'error');
        // Scroll to account section
        document.getElementById('account')?.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    const form = e.target;
    const contentType = document.getElementById('contentType')?.value;
    const prompt = document.getElementById('prompt')?.value;
    const platforms = Array.from(document.querySelectorAll('input[name="platform"]:checked')).map(cb => cb.value);
    const schedule = document.getElementById('schedulePost')?.checked;
    const scheduledTime = document.getElementById('scheduleTime')?.value;

    if (!prompt || platforms.length === 0) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    setLoading(true);

    try {
        const res = await fetch(`${CONFIG.BACKEND_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify({
                contentType,
                prompt,
                platforms,
                schedule,
                scheduledTime
            }),
            signal: AbortSignal.timeout(30000)
        });

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error('Session expired. Please sign in again.');
            }
            throw new Error(`Generation failed: ${res.statusText}`);
        }

        const result = await res.json();
        displayResult(result);
        showToast('Content generated successfully! 🎉', 'success');

        // Clear form
        form.reset();
    } catch (error) {
        console.error('Generation error:', error);
        showToast(error.message || 'Failed to generate content', 'error');
    } finally {
        setLoading(false);
    }
}

function displayResult(data) {
    const resultBox = document.getElementById('resultBox');
    const resultContent = document.getElementById('resultContent');

    if (resultBox && resultContent) {
        resultBox.style.display = 'block';
        resultContent.textContent = JSON.stringify(data, null, 2);
        resultBox.scrollIntoView({ behavior: 'smooth' });
    }
}

// Payments
async function createCheckout(variantId, plan) {
    if (!state.token) {
        showToast('Please sign in first to upgrade', 'error');
        document.getElementById('account')?.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    try {
        const res = await fetch(`${CONFIG.BACKEND_URL}/payments/create-checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify({ variantId })
        });

        if (!res.ok) throw new Error('Checkout failed');

        const data = await res.json();
        window.location.href = data.url;
    } catch (error) {
        showToast('Payment setup failed. Please try again.', 'error');
    }
}

// Utilities
async function checkBackendStatus() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    if (!statusDot || !statusText) return;

    try {
        const res = await fetch(CONFIG.BACKEND_URL, { signal: AbortSignal.timeout(5000) });

        if (res.ok) {
            statusDot.className = 'status-dot connected';
            statusText.textContent = 'System Operational';
        } else {
            throw new Error('Backend error');
        }
    } catch {
        statusDot.className = 'status-dot error';
        statusText.textContent = 'Backend Offline';
    }
}

function setLoading(isLoading) {
    const btn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    if (btn) btn.disabled = isLoading;
    if (btnText) btnText.textContent = isLoading ? 'Generating...' : 'Generate Content';
    if (btnSpinner) btnSpinner.style.display = isLoading ? 'inline-block' : 'none';
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `message ${type}`;
    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;padding:1rem 1.5rem;border-radius:0.5rem;box-shadow:0 10px 15px rgba(0,0,0,0.1);animation:slideIn 0.3s ease;';
    toast.textContent = message;

    // Color based on type
    const colors = {
        success: { bg: '#d1fae5', text: '#065f46' },
        error: { bg: '#fee2e2', text: '#991b1b' },
        info: { bg: '#dbeafe', text: '#1e40af' }
    };

    const c = colors[type] || colors.info;
    toast.style.background = c.bg;
    toast.style.color = c.text;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail')?.value;
            if (email) login(email);
        });
    }

    // Content form
    const contentForm = document.getElementById('contentForm');
    if (contentForm) {
        contentForm.addEventListener('submit', generateContent);
    }

    // Schedule toggle
    const scheduleCheckbox = document.getElementById('schedulePost');
    const scheduleTime = document.getElementById('scheduleTime');
    if (scheduleCheckbox && scheduleTime) {
        scheduleCheckbox.addEventListener('change', (e) => {
            scheduleTime.style.display = e.target.checked ? 'block' : 'none';
        });
    }

    // Pricing buttons
    const proPlanBtn = document.getElementById('proPlanButton');
    const premiumPlanBtn = document.getElementById('premiumPlanButton');

    if (proPlanBtn) {
        proPlanBtn.addEventListener('click', () => {
            createCheckout(CONFIG.LEMONSQUEEZY_PRO, 'pro');
        });
    }

    if (premiumPlanBtn) {
        premiumPlanBtn.addEventListener('click', () => {
            createCheckout(CONFIG.LEMONSQUEEZY_PREMIUM, 'premium');
        });
    }

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Make functions available globally if needed
window.logout = logout;
window.createCheckout = createCheckout;
