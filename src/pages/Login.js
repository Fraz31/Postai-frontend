import { api } from '../api.js';
import { store } from '../store.js';

export function Login() {
    const div = document.createElement('div');
    div.className = 'container flex-center';
    div.style.cssText = 'min-height: 100vh; position: relative;';

    div.innerHTML = `
        <!-- Decorative background shapes -->
        <div class="hero-shapes" style="position: fixed; inset: 0; z-index: -1;">
          <div class="hero-shape hero-shape-1" style="width: 400px; height: 400px; top: 20%; left: -10%;"></div>
          <div class="hero-shape hero-shape-2" style="width: 300px; height: 300px; bottom: 10%; right: -5%;"></div>
        </div>
        
        <div class="generator-card" style="max-width: 420px; width: 100%; padding: 3rem;">
            <div class="text-center mb-4">
                <a href="/" class="logo" style="justify-content: center; margin-bottom: 2rem; font-size: 1.75rem;" data-link>
                    <i class="fas fa-robot text-gradient" style="font-size: 2rem;"></i> Social Monkey
                </a>
                <h2 style="margin-bottom: 0.5rem;">Welcome Back</h2>
                <p style="margin-bottom: 0;">Sign in to continue to your dashboard</p>
            </div>
            
            <form id="loginForm" style="margin-top: 2rem;">
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <div style="position: relative;">
                        <input type="email" id="email" class="form-control" required placeholder="name@example.com" style="padding-left: 3rem;">
                        <i class="fas fa-envelope" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" style="display: flex; justify-content: space-between;">
                        Password
                        <a href="#" class="text-gradient" style="font-size: 0.85rem;">Forgot password?</a>
                    </label>
                    <div style="position: relative;">
                        <input type="password" id="password" class="form-control" placeholder="Enter your password" style="padding-left: 3rem; padding-right: 3rem;">
                        <i class="fas fa-lock" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                        <button type="button" id="togglePassword" style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer;">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" id="remember" style="width: 16px; height: 16px; accent-color: var(--primary);">
                    <label for="remember" style="font-size: 0.9rem; color: var(--text-muted); cursor: pointer;">Remember me</label>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 1rem;">
                    <i class="fas fa-sign-in-alt"></i> Sign In
                </button>
            </form>
            
            <div style="margin-top: 2rem;">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="flex: 1; height: 1px; background: var(--border-light);"></div>
                    <span style="color: var(--text-muted); font-size: 0.85rem;">or continue with</span>
                    <div style="flex: 1; height: 1px; background: var(--border-light);"></div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem;">
                    <button class="btn btn-secondary" style="justify-content: center; padding: 0.75rem;">
                        <i class="fab fa-google"></i>
                    </button>
                    <button class="btn btn-secondary" style="justify-content: center; padding: 0.75rem;">
                        <i class="fab fa-apple"></i>
                    </button>
                    <button class="btn btn-secondary" style="justify-content: center; padding: 0.75rem;">
                        <i class="fab fa-github"></i>
                    </button>
                </div>
            </div>
            
            <p class="text-center" style="margin-top: 2rem; margin-bottom: 0; font-size: 0.95rem;">
                Don't have an account? <a href="/register" class="text-gradient" style="font-weight: 600;" data-link>Sign Up Free</a>
            </p>
        </div>
    `;

    // Password toggle
    div.querySelector('#togglePassword').addEventListener('click', () => {
        const passwordInput = div.querySelector('#password');
        const icon = div.querySelector('#togglePassword i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });

    div.querySelector('#loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = div.querySelector('#email').value;
        const btn = div.querySelector('button[type="submit"]');

        try {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            btn.disabled = true;

            const data = await api.login(email);
            store.setToken(data.token);
            store.setUser(data.user);

            window.location.href = '/dashboard';
        } catch (error) {
            alert(error.message);
        } finally {
            btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            btn.disabled = false;
        }
    });

    return div;
}
