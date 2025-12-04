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
              <i class="fas fa-sparkles" style="color: var(--accent);"></i> New: AI Video Generation
            </span>
          </div>
          
          <h1>
            Supercharge Your Socials with <br>
            <span class="text-gradient">Artificial Intelligence</span>
          </h1>
          
          <p class="hero-subtitle">
            Create, schedule, and optimize content for all your channels in seconds.
            Join 10,000+ creators using Social Monkey.
          </p>
    
          <div class="flex-center" style="gap: 1rem; flex-wrap: wrap;">
            <a href="/register" class="btn btn-primary pulse-glow" data-link>
              Start Creating Free <i class="fas fa-arrow-right"></i>
            </a>
            <a href="#demo" class="btn btn-secondary">
              <i class="fas fa-play"></i> Watch Demo
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
              <p>Generate posts in seconds.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-calendar-alt"></i></div>
              <h3>Smart Scheduling</h3>
              <p>Auto-schedule posts.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-chart-line"></i></div>
              <h3>Analytics</h3>
              <p>Track your growth.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="container text-center">
            <p>&copy; 2024 Social Monkey. All rights reserved.</p>
        </div>
      </footer>
    `;
    return div;
}
