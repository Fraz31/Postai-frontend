/**
 * Social Monkey Frontend Logic
 * Cosmic Intelligence Theme Update
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
    theme: 'dark' // Enforce dark theme for Cosmic design
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🐵 Social Monkey initialized!');
    loadUser();
    checkBackendStatus();
    setupEventListeners();
    setupScrollEffects();
});

// Scroll Effects
function setupScrollEffects() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .pricing-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
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
    // Show loading state on button if possible, or toast
    showToast('Signing in...', 'info');

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

        // Redirect to dashboard if on index
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        }

    } catch (error) {
        showToast('Unable to sign in. Please try again.', 'error');
    }
}

function logout() {
    state.token = null;
    state.user = null;
    localStorage.removeItem('socialmonkey_token');
    updateUI(null);
    showToast('Signed out successfully', 'info');
    window.location.href = 'index.html';
}

function updateUI(user) {
    // Update UI elements based on user state if needed
    // For now, mostly handled by redirection to dashboard
}

// Content Generation
async function generateContent(e) {
    e.preventDefault();

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

    // Demo Mode Logic
    if (!state.token) {
        const demoCount = parseInt(localStorage.getItem('socialmonkey_demo_count') || '0');

        if (demoCount >= 3) {
            showToast('Demo limit reached! Sign up to continue.', 'info');
            document.getElementById('account')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const mockResult = {
                content: `🐵 Here's a demo ${contentType} for ${platforms.join(', ')}:\n\n${prompt}\n\n✨ This is generated content that would appear based on your prompt!\n\n${platforms.map(p => `#${p}`).join(' ')}`,
                platforms: platforms,
                demo: true
            };

            displayResult(mockResult);
            saveToContentLibrary({ contentType, prompt, platforms, result: mockResult.content, created: new Date().toISOString() });

            localStorage.setItem('socialmonkey_demo_count', (demoCount + 1).toString());
            showToast(`Demo ${demoCount + 1}/3 used.`, 'success');

            setLoading(false);
            form.reset();
        }, 2000);
        return;
    }

    // Regular generation
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
            if (res.status === 401) throw new Error('Session expired. Please sign in again.');
            throw new Error(`Generation failed: ${res.statusText}`);
        }

        const result = await res.json();
        displayResult(result);
        saveToContentLibrary({ contentType, prompt, platforms, result: JSON.stringify(result), created: new Date().toISOString() });
        showToast('Content generated successfully! 🎉', 'success');

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
        resultContent.textContent = data.content || JSON.stringify(data, null, 2);
        resultBox.scrollIntoView({ behavior: 'smooth' });
    }
}

function saveToContentLibrary(content) {
    const library = JSON.parse(localStorage.getItem('socialmonkey_content') || '[]');
    library.unshift(content);
    localStorage.setItem('socialmonkey_content', JSON.stringify(library.slice(0, 50)));
}

// Utilities
async function checkBackendStatus() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    if (!statusDot || !statusText) return;

    try {
        const res = await fetch(CONFIG.BACKEND_URL, { signal: AbortSignal.timeout(5000) });

        if (res.ok) {
            statusDot.style.background = '#10b981'; // Success green
            statusDot.style.boxShadow = '0 0 10px #10b981';
            statusText.textContent = 'System Operational';
        } else {
            throw new Error('Backend error');
        }
    } catch {
        statusDot.style.background = '#ef4444'; // Error red
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
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 1rem 1.5rem;
        border-radius: 1rem;
        background: rgba(15, 23, 42, 0.9);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideIn 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
        font-family: 'Plus Jakarta Sans', sans-serif;
    `;

    // Icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';

    toast.innerHTML = `<i class="fas fa-${icon}" style="color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'}"></i> ${message}`;

    document.body.appendChild(toast);

    // Add keyframes if not exists
    if (!document.getElementById('toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function setupEventListeners() {
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

    // Smooth scroll
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

// Global exports
window.logout = logout;
