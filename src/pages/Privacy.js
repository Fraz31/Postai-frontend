export function Privacy() {
    const div = document.createElement('div');
    div.innerHTML = `
        <nav class="navbar">
            <div class="container nav-content">
                <a href="/" class="logo" data-link>
                    <i class="fas fa-robot text-gradient"></i> Social Monkey
                </a>
                <div class="nav-links">
                    <a href="/" data-link>Back to Home</a>
                </div>
            </div>
        </nav>

        <div class="container" style="padding-top: 8rem; min-height: 80vh;">
            <div class="glass-panel" style="padding: 3rem;">
                <h1 style="margin-bottom: 2rem;">Privacy Policy</h1>
                <p class="text-muted" style="margin-bottom: 2rem;">Last updated: January 2025</p>

                <div style="line-height: 1.6;">
                    <h3>1. Information We Collect</h3>
                    <p>We collect information you provide directly to us, such as when you create an account, subscribe, or contact us.</p>
                    
                    <h3 style="margin-top: 2rem;">2. How We Use Your Information</h3>
                    <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect Social Monkey and our users.</p>

                    <h3 style="margin-top: 2rem;">3. Data Security</h3>
                    <p>We implement appropriate technical and organizational measures to protect the security of your personal data.</p>
                </div>
            </div>
        </div>

        <footer class="footer">
            <div class="container text-center">
                <p>&copy; 2025 Social Monkey. All rights reserved.</p>
            </div>
        </footer>
    `;
    return div;
}
