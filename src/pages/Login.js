import { api } from '../api.js';
import { store } from '../store.js';

export function Login() {
    const div = document.createElement('div');
    div.className = 'container flex-center';
    div.style.minHeight = '100vh';

    div.innerHTML = `
        <div class="generator-card" style="max-width: 400px; width: 100%;">
            <div class="text-center mb-4">
                <a href="/" class="logo" style="justify-content: center; margin-bottom: 2rem;" data-link>
                    <i class="fas fa-robot text-gradient"></i> Social Monkey
                </a>
                <h2>Welcome Back</h2>
                <p>Sign in to your account</p>
            </div>
            <form id="loginForm">
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" id="email" class="form-control" required placeholder="name@example.com">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Sign In</button>
            </form>
            <p class="text-center mt-4">
                Don't have an account? <a href="/register" class="text-gradient" data-link>Sign Up</a>
            </p>
        </div>
    `;

    div.querySelector('#loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = div.querySelector('#email').value;
        const btn = div.querySelector('button');

        try {
            btn.textContent = 'Loading...';
            btn.disabled = true;

            const data = await api.login(email);
            store.setToken(data.token);
            store.setUser(data.user);

            window.location.href = '/dashboard'; // Force reload to init dashboard state or use router
            // history.pushState(null, null, '/dashboard');
            // new Router().handleRoute(); // This is tricky without global router instance. 
            // Better to use window.location for full state reset or export router instance.
        } catch (error) {
            alert(error.message);
        } finally {
            btn.textContent = 'Sign In';
            btn.disabled = false;
        }
    });

    return div;
}
