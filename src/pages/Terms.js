export function Terms() {
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
                <h1 style="margin-bottom: 2rem;">Terms & Conditions</h1>
                <p class="text-muted" style="margin-bottom: 2rem;">Last updated: January 2025</p>

                <div style="line-height: 1.6;">
                    <h3>1. Acceptance of Terms</h3>
                    <p>By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>
                    
                    <h3 style="margin-top: 2rem;">2. Use License</h3>
                    <p>Permission is granted to temporarily download one copy of the materials (information or software) on Social Monkey's website for personal, non-commercial transitory viewing only.</p>

                    <h3 style="margin-top: 2rem;">3. Disclaimer</h3>
                    <p>The materials on Social Monkey's website are provided on an 'as is' basis. Social Monkey makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.</p>
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
