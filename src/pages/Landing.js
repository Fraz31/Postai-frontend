export function Landing() {
  const div = document.createElement('div');
  div.innerHTML = `
      <!-- Navigation -->
      <nav class="navbar">
        <div class="container nav-content">
          <a href="/" class="logo" data-link>
            <i class="fas fa-robot text-gradient"></i> Social Monkey
          </a>
          <div class="nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="/login" class="btn btn-secondary" data-link>Sign In</a>
            <a href="/register" class="btn btn-primary" data-link>Get Started</a>
          </div>
        </div>
      </nav>
    
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-bg-glow"></div>
        <div class="container">
          <div class="animate-float">
            <span class="btn btn-secondary" style="margin-bottom: 2rem; padding: 0.5rem 1rem; font-size: 0.8rem; border-radius: 2rem;">
              <i class="fas fa-calendar-check" style="color: var(--accent);"></i> New: Multi-Platform Scheduling
            </span>
          </div>
          
          <h1>
            Dominate Social Media with <br>
            <span class="text-gradient">Cosmic Intelligence</span>
          </h1>
          
          <p class="hero-subtitle">
            Create, schedule, and optimize content for all your channels in seconds.
            Join 10,000+ creators using Social Monkey.
          </p>
    
          <div class="flex-center" style="gap: 1rem; flex-wrap: wrap;">
            <a href="/register" class="btn btn-primary pulse-glow" data-link>
              Start Creating Free <i class="fas fa-arrow-right"></i>
            </a>
            <a href="#features" class="btn btn-secondary">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" style="padding: 6rem 0;">
        <div class="container">
          <div class="text-center" style="margin-bottom: 4rem;">
            <h2>Everything you need</h2>
          </div>
          <div class="grid-3">
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-robot"></i></div>
              <h3>AI Writer</h3>
              <p>Generate posts, threads, and articles in seconds.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-calendar-alt"></i></div>
              <h3>Smart Scheduling</h3>
              <p>Auto-schedule posts for optimal times.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-chart-line"></i></div>
              <h3>Analytics</h3>
              <p>Track your growth and engagement.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
            <div class="grid-3" style="margin-bottom: 2rem;">
                <div>
                    <a href="/" class="logo" style="margin-bottom: 1rem;" data-link>
                        <i class="fas fa-robot text-gradient"></i> Social Monkey
                    </a>
                    <p class="text-muted">The future of social media automation.</p>
                </div>
                <div>
                    <h4>Product</h4>
                    <ul style="list-style: none; padding: 0;">
                        <li><a href="#features" style="color: var(--text-muted);">Features</a></li>
                        <li><a href="#pricing" style="color: var(--text-muted);">Pricing</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Company</h4>
                    <ul style="list-style: none; padding: 0;">
                        <li><a href="/contact" style="color: var(--text-muted);" data-link>Contact</a></li>
                        <li><a href="/privacy" style="color: var(--text-muted);" data-link>Privacy Policy</a></li>
                        <li><a href="/terms" style="color: var(--text-muted);" data-link>Terms & Conditions</a></li>
                    </ul>
                </div>
            </div>
            <div class="text-center" style="border-top: 1px solid var(--border-light); padding-top: 2rem;">
                <p>&copy; 2025 Social Monkey. All rights reserved.</p>
            </div>
        </div>
      </footer>
    `;
  return div;
}
