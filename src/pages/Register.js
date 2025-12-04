import { api } from '../api.js';
import { store } from '../store.js';

export function Register() {
    const div = document.createElement('div');
    div.className = 'container flex-center';
    div.style.minHeight = '100vh';

    div.innerHTML = `
        <div class="generator-card" style="max-width: 400px; width: 100%;">
            <div class="text-center mb-4">
                <a href="/" class="logo" style="justify-content: center; margin-bottom: 2rem;" data-link>
                    <i class="fas fa-robot text-gradient"></i> Social Monkey
                </a>
                <h2>Create Account</h2>
                <p>Start your free trial today</p>
            </div>
            <form id="registerForm">
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" id="email" class="form-control" required placeholder="name@example.com">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Get Started</button>
            </form>
            <p class="text-center mt-4">
                Already have an account? <a href="/login" class="text-gradient" data-link>Sign In</a>
            </p>
        </div>
    `;

    div.querySelector('#registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = div.querySelector('#email').value;
        const btn = div.querySelector('button');

        try {
            btn.textContent = 'Creating...';
            btn.disabled = true;

            // Using login endpoint as it handles creation too
            const data = await api.login(email);
            store.setToken(data.token);
            store.setUser(data.user);

            window.location.href = '/dashboard';
        } catch (error) {
            alert(error.message);
        } finally {
            btn.textContent = 'Get Started';
            btn.disabled = false;
        }
    });

    return div;
}
