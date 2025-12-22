export function Landing() {
  const div = document.createElement('div');
  div.innerHTML = `
      <!-- Navigation -->
      <nav class="navbar" id="navbar">
        <div class="container nav-content">
          <a href="/" class="logo" data-link>
            <i class="fas fa-robot text-gradient"></i> Social Monkey
          </a>
          <div class="nav-links" id="navLinks">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Testimonials</a>
            <a href="/login" class="btn btn-ghost" data-link>Sign In</a>
            <a href="/register" class="btn btn-primary" data-link>Start Free <i class="fas fa-arrow-right"></i></a>
          </div>
          <button class="mobile-menu-btn" id="mobileMenuBtn">
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </nav>
    
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-bg-glow"></div>
        <div class="hero-shapes">
          <div class="hero-shape hero-shape-1"></div>
          <div class="hero-shape hero-shape-2"></div>
          <div class="hero-shape hero-shape-3"></div>
        </div>
        <div class="container">
          <div class="animate-float">
            <span class="badge">
              <i class="fas fa-sparkles"></i> AI-Powered Social Media Automation
            </span>
          </div>
          
          <h1>
            Dominate Social Media<br>
            <span class="text-gradient-animated">With Cosmic Intelligence</span>
          </h1>
          
          <p class="hero-subtitle">
            Create viral content, schedule posts across all platforms, and grow your audience 10x faster with AI. Join 25,000+ creators already using Social Monkey.
          </p>
    
          <div class="flex-center" style="gap: 1rem; flex-wrap: wrap; animation: fadeInUp 0.8s ease-out 0.4s both;">
            <a href="/register" class="btn btn-primary pulse-glow" data-link>
              Start Creating Free <i class="fas fa-arrow-right"></i>
            </a>
            <a href="#features" class="btn btn-secondary">
              <i class="fas fa-play-circle"></i> Watch Demo
            </a>
          </div>
          
          <div style="margin-top: 3rem; animation: fadeInUp 0.8s ease-out 0.6s both;">
            <p style="font-size: 0.9rem; margin-bottom: 1rem;">Trusted by teams at</p>
            <div class="flex-center" style="gap: 3rem; opacity: 0.5; flex-wrap: wrap;">
              <i class="fab fa-google" style="font-size: 2rem;"></i>
              <i class="fab fa-microsoft" style="font-size: 2rem;"></i>
              <i class="fab fa-spotify" style="font-size: 2rem;"></i>
              <i class="fab fa-slack" style="font-size: 2rem;"></i>
              <i class="fab fa-amazon" style="font-size: 2rem;"></i>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item">
              <h3 class="text-gradient">25K+</h3>
              <p>Active Creators</p>
            </div>
            <div class="stat-item">
              <h3 class="text-gradient">2M+</h3>
              <p>Posts Generated</p>
            </div>
            <div class="stat-item">
              <h3 class="text-gradient">500M+</h3>
              <p>Impressions</p>
            </div>
            <div class="stat-item">
              <h3 class="text-gradient">4.9★</h3>
              <p>User Rating</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" style="padding: 6rem 0;">
        <div class="container">
          <div class="text-center section-header">
            <span class="badge"><i class="fas fa-bolt"></i> Powerful Features</span>
            <h2 style="margin-top: 1rem;">Everything you need to<br><span class="text-gradient">dominate social media</span></h2>
            <p style="max-width: 600px; margin: 1rem auto 0;">From content creation to analytics, we've got you covered with AI-powered tools that save hours every week.</p>
          </div>
          <div class="grid-3">
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-robot"></i></div>
              <h3>AI Content Writer</h3>
              <p>Generate viral posts, threads, and articles in seconds. Our AI understands your brand voice and creates engaging content.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-calendar-alt"></i></div>
              <h3>Smart Scheduling</h3>
              <p>Auto-schedule posts for optimal engagement times. Our AI learns when your audience is most active.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-chart-line"></i></div>
              <h3>Advanced Analytics</h3>
              <p>Track growth, engagement, and ROI across all platforms with beautiful, actionable insights.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-images"></i></div>
              <h3>AI Image Generation</h3>
              <p>Create stunning visuals for your posts with Stability AI. No design skills needed.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-share-alt"></i></div>
              <h3>Multi-Platform Posting</h3>
              <p>Publish to Twitter, LinkedIn, Instagram, TikTok, Facebook, and Threads from one dashboard.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-sync"></i></div>
              <h3>Content Repurposing</h3>
              <p>Turn one piece of content into 10+ posts optimized for each platform automatically.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section id="pricing" class="pricing-section">
        <div class="container">
          <div class="text-center section-header">
            <span class="badge"><i class="fas fa-tag"></i> Simple Pricing</span>
            <h2 style="margin-top: 1rem;">Choose your <span class="text-gradient">growth plan</span></h2>
            <p style="max-width: 600px; margin: 1rem auto 0;">Start creating viral content today. Upgrade anytime as you grow.</p>
          </div>
          <div class="pricing-grid">
            <!-- Starter Plan -->
            <div class="pricing-card">
              <h3>🚀 Starter</h3>
              <div class="price">$9<span>/month</span></div>
              <ul class="features-list">
                <li><i class="fas fa-check"></i> 50 AI social posts / month</li>
                <li><i class="fas fa-check"></i> Instagram, X (Twitter), Facebook, LinkedIn</li>
                <li><i class="fas fa-check"></i> Image generation (basic)</li>
                <li><i class="fas fa-check"></i> Manual posting</li>
                <li><i class="fas fa-check"></i> Email support</li>
              </ul>
              <p style="font-size: 0.85rem; color: var(--primary); margin-bottom: 1rem;">👉 Best for individuals</p>
              <a href="/register" class="btn btn-secondary" style="width: 100%;" data-link>Get Started</a>
            </div>
            <!-- Pro Plan (Most Popular) -->
            <div class="pricing-card popular">
              <span class="pricing-badge">🔥 Most Popular</span>
              <h3>Pro</h3>
              <div class="price">$29<span>/month</span></div>
              <ul class="features-list">
                <li><i class="fas fa-check"></i> 300 AI social posts / month</li>
                <li><i class="fas fa-check"></i> Instagram, X, Facebook, LinkedIn, Threads</li>
                <li><i class="fas fa-check"></i> Image generation (HD)</li>
                <li><i class="fas fa-check"></i> Post scheduling (calendar-based)</li>
                <li><i class="fas fa-check"></i> Content repurposing</li>
                <li><i class="fas fa-check"></i> Analytics dashboard</li>
                <li><i class="fas fa-check"></i> Priority support</li>
              </ul>
              <p style="font-size: 0.85rem; color: var(--primary); margin-bottom: 1rem;">👉 Best for creators & agencies</p>
              <a href="/register" class="btn btn-primary" style="width: 100%;" data-link>Start Free Trial</a>
            </div>
            <!-- Business Plan -->
            <div class="pricing-card">
              <h3>👑 Business</h3>
              <div class="price">$79<span>/month</span></div>
              <ul class="features-list">
                <li><i class="fas fa-check"></i> Unlimited AI posts</li>
                <li><i class="fas fa-check"></i> All platforms + future integrations</li>
                <li><i class="fas fa-check"></i> Advanced analytics</li>
                <li><i class="fas fa-check"></i> Team access</li>
                <li><i class="fas fa-check"></i> API access</li>
                <li><i class="fas fa-check"></i> Dedicated support</li>
              </ul>
              <p style="font-size: 0.85rem; color: var(--primary); margin-bottom: 1rem;">👉 Best for businesses</p>
              <a href="/contact" class="btn btn-secondary" style="width: 100%;" data-link>Contact Sales</a>
            </div>
          </div>
          <!-- Paddle Trust Text -->
          <div class="text-center" style="margin-top: 2rem;">
            <p style="font-size: 0.9rem; opacity: 0.8;">
              <i class="fas fa-lock" style="margin-right: 0.5rem;"></i>
              Payments are securely processed by Paddle.<br>
              Taxes and VAT are handled automatically.
            </p>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section id="testimonials" class="testimonials-section">
        <div class="container">
          <div class="text-center section-header">
            <span class="badge"><i class="fas fa-heart"></i> Loved by Creators</span>
            <h2 style="margin-top: 1rem;">Join thousands of <span class="text-gradient">happy users</span></h2>
          </div>
          <div class="testimonials-grid">
            <div class="testimonial-card">
              <p class="testimonial-text">"Social Monkey has completely transformed my content workflow. I went from spending 4 hours a day on social media to just 30 minutes. My engagement is up 300%!"</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">S</div>
                <div class="testimonial-info">
                  <h4>Sarah Chen</h4>
                  <p>Founder, TechStart</p>
                </div>
              </div>
            </div>
            <div class="testimonial-card">
              <p class="testimonial-text">"The AI writes better content than I could ever create manually. It understands my brand perfectly and saves me hours every week. Absolutely love it!"</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">M</div>
                <div class="testimonial-info">
                  <h4>Marcus Johnson</h4>
                  <p>Content Creator, 500K followers</p>
                </div>
              </div>
            </div>
            <div class="testimonial-card">
              <p class="testimonial-text">"Game changer for our agency. We manage 50+ client accounts with Social Monkey. The ROI has been incredible - 10x what we pay for the tool."</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">E</div>
                <div class="testimonial-info">
                  <h4>Emily Rodriguez</h4>
                  <p>CEO, Digital First Agency</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section style="padding: 6rem 0;">
        <div class="container">
          <div class="glass-panel text-center" style="padding: 4rem 2rem; max-width: 800px; margin: 0 auto;">
            <h2>Ready to <span class="text-gradient">10x your social media?</span></h2>
            <p style="max-width: 500px; margin: 1rem auto 2rem;">Join 25,000+ creators and businesses using Social Monkey to dominate social media.</p>
            <a href="/register" class="btn btn-primary btn-lg" data-link>
              Start Your Free Trial <i class="fas fa-arrow-right"></i>
            </a>
            <p style="font-size: 0.85rem; margin-top: 1rem; margin-bottom: 0;">No credit card required • Cancel anytime</p>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div>
                    <a href="/" class="logo" style="margin-bottom: 1rem;" data-link>
                        <i class="fas fa-robot text-gradient"></i> Social Monkey
                    </a>
                    <p style="max-width: 300px;">The AI-powered platform for creators and businesses who want to dominate social media.</p>
                    <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                      <a href="#" style="font-size: 1.25rem;"><i class="fab fa-twitter"></i></a>
                      <a href="#" style="font-size: 1.25rem;"><i class="fab fa-linkedin"></i></a>
                      <a href="#" style="font-size: 1.25rem;"><i class="fab fa-instagram"></i></a>
                      <a href="#" style="font-size: 1.25rem;"><i class="fab fa-tiktok"></i></a>
                    </div>
                </div>
                <div>
                    <h4>Product</h4>
                    <ul>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#pricing">Pricing</a></li>
                        <li><a href="#">Integrations</a></li>
                        <li><a href="#">API</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Resources</h4>
                    <ul>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Tutorials</a></li>
                        <li><a href="#">Community</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Company</h4>
                    <ul>
                        <li><a href="/contact" data-link>Contact</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="/privacy" data-link>Privacy Policy</a></li>
                        <li><a href="/terms" data-link>Terms & Conditions</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p style="margin: 0;">&copy; 2025 Social Monkey. All rights reserved.</p>
            </div>
        </div>
      </footer>
    `;

  // Navbar scroll effect
  const navbar = div.querySelector('#navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const mobileMenuBtn = div.querySelector('#mobileMenuBtn');
  const navLinks = div.querySelector('#navLinks');
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });

  return div;
}
