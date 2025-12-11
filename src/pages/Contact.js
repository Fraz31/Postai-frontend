export function Contact() {
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
            <div class="glass-panel" style="max-width: 600px; margin: 0 auto; padding: 3rem;">
                <h2 style="margin-bottom: 1.5rem;">Contact Us</h2>
                <p style="margin-bottom: 2rem; color: var(--text-muted);">Have questions? We'd love to hear from you.</p>
                
                <form id="contactForm">
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Message</label>
                        <textarea class="form-control" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Send Message</button>
                </form>
            </div>
        </div>

        <footer class="footer">
            <div class="container text-center">
                <p>&copy; 2025 Social Monkey. All rights reserved.</p>
            </div>
        </footer>
    `;

    div.querySelector('#contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Message sent! We will get back to you shortly.');
        window.location.href = '/';
    });

    return div;
}
