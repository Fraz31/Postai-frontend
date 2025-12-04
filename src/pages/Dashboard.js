import { store } from '../store.js';
import { api } from '../api.js';

export function Dashboard() {
    const div = document.createElement('div');
    div.className = 'dashboard-layout';

    const user = store.state.user || { email: 'User' };

    div.innerHTML = `
        <!-- Sidebar -->
        <aside class="sidebar">
            <a href="/" class="logo" style="padding-left: 1rem;" data-link>
                <i class="fas fa-robot text-gradient"></i> Social Monkey
            </a>

            <nav class="sidebar-nav">
                <a href="#" class="sidebar-link active" data-tab="overview">
                    <i class="fas fa-home"></i> Overview
                </a>
                <a href="#" class="sidebar-link" data-tab="create">
                    <i class="fas fa-wand-magic-sparkles"></i> Create New
                </a>
                <a href="#" class="sidebar-link" data-tab="calendar">
                    <i class="fas fa-calendar-alt"></i> Calendar
                </a>
                <a href="#" class="sidebar-link" data-tab="library">
                    <i class="fas fa-layer-group"></i> Library
                </a>
                <a href="#" class="sidebar-link" data-tab="analytics">
                    <i class="fas fa-chart-pie"></i> Analytics
                </a>
                <a href="#" class="sidebar-link" data-tab="settings">
                    <i class="fas fa-cog"></i> Settings
                </a>
            </nav>

            <div style="margin-top: auto;">
                <button id="logoutBtn" class="sidebar-link" style="color: var(--secondary); background: none; border: none; width: 100%; text-align: left; cursor: pointer;">
                    <i class="fas fa-sign-out-alt"></i> Sign Out
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="flex-between" style="margin-bottom: 3rem;">
                <div>
                    <h1 id="pageTitle">Dashboard</h1>
                    <p id="pageSubtitle">Welcome back, ${user.email}</p>
                </div>
                <div class="flex-center" style="gap: 1rem;">
                    <button class="btn btn-secondary" style="padding: 0.5rem; border-radius: 50%; width: 40px; height: 40px;">
                        <i class="fas fa-bell"></i>
                    </button>
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-weight: 700;">
                        ${user.email[0].toUpperCase()}
                    </div>
                </div>
            </header>

            <div id="tab-content">
                <!-- Content injected here -->
            </div>
        </main>
    `;

    // Tab Logic
    const tabs = {
        overview: renderOverview,
        create: renderCreate,
        calendar: renderCalendar,
        library: renderLibrary,
        analytics: renderAnalytics,
        settings: renderSettings
    };

    let currentTab = 'overview';

    async function switchTab(tabName) {
        currentTab = tabName;

        // Update Sidebar
        div.querySelectorAll('.sidebar-link').forEach(l => {
            l.classList.remove('active');
            if (l.dataset.tab === tabName) l.classList.add('active');
        });

        // Update Content
        const contentContainer = div.querySelector('#tab-content');
        contentContainer.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

        try {
            contentContainer.innerHTML = await tabs[tabName]();

            // Post-render hooks
            if (tabName === 'create') attachCreateListeners(div);
            if (tabName === 'analytics') initCharts(div);
            if (tabName === 'library') attachLibraryListeners(div);
        } catch (error) {
            contentContainer.innerHTML = `<div class="text-center text-danger">Error loading tab: ${error.message}</div>`;
        }
    }

    // Event Listeners
    div.querySelectorAll('.sidebar-link[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(link.dataset.tab);
        });
    });

    div.querySelector('#logoutBtn').addEventListener('click', () => {
        store.logout();
    });

    // Initial Render
    switchTab('overview');

    return div;
}

// --- Tab Renderers ---

async function renderOverview() {
    return `
        <div class="grid-3" style="margin-bottom: 3rem;">
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-file-alt text-gradient"></i></div>
                <div><h2>12</h2><p>Total Posts</p></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-chart-bar text-gradient"></i></div>
                <div><h2>1.2k</h2><p>Engagement</p></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-share-alt text-gradient"></i></div>
                <div><h2>5</h2><p>Platforms</p></div>
            </div>
        </div>
        <div class="glass-panel" style="padding: 2rem;">
            <h3>Quick Actions</h3>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button class="btn btn-primary" onclick="document.querySelector('[data-tab=create]').click()">Create Post</button>
                <button class="btn btn-secondary" onclick="document.querySelector('[data-tab=calendar]').click()">View Calendar</button>
            </div>
        </div>
    `;
}

async function renderCreate() {
    return `
        <div class="generator-card" style="max-width: 800px; margin: 0 auto;">
            <form id="createForm">
                <div class="form-group">
                    <label class="form-label">Content Type</label>
                    <select id="contentType" class="form-control">
                        <option value="post">Social Media Post</option>
                        <option value="thread">Twitter Thread</option>
                        <option value="carousel">Instagram Carousel</option>
                        <option value="article">LinkedIn Article</option>
                        <option value="caption">Caption</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Prompt</label>
                    <textarea id="prompt" class="form-control" rows="5" required placeholder="What should this post be about?"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Target Platforms</label>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <label><input type="checkbox" value="twitter" checked> Twitter</label>
                        <label><input type="checkbox" value="linkedin"> LinkedIn</label>
                        <label><input type="checkbox" value="instagram"> Instagram</label>
                        <label><input type="checkbox" value="facebook"> Facebook</label>
                        <label><input type="checkbox" value="tiktok"> TikTok</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="checkbox" id="generateImage"> 
                        <span>Generate AI Image (Stability AI) <i class="fas fa-image text-gradient"></i></span>
                    </label>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Generate Content</button>
            </form>
            <div id="result" style="display: none; margin-top: 2rem;" class="glass-panel">
                <h4 style="margin-bottom: 1rem;">Generated Result</h4>
                <pre id="resultText" style="white-space: pre-wrap; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 0.5rem;"></pre>
                
                <div id="imageResult" style="display: none; margin-top: 1rem;">
                    <p class="text-muted">Generated Image:</p>
                    <div style="width: 100%; height: 300px; background: #111; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem;">
                        <i class="fas fa-image" style="font-size: 3rem; color: var(--text-muted);"></i>
                        <span style="margin-left: 1rem; color: var(--text-muted);">Image Placeholder</span>
                    </div>
                </div>

                <div style="margin-top: 1rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button id="copyBtn" class="btn btn-secondary">Copy</button>
                    <button id="saveBtn" class="btn btn-primary">Save to Library</button>
                    <button id="repurposeBtn" class="btn btn-secondary"><i class="fas fa-sync"></i> Repurpose</button>
                </div>
            </div>
        </div>
    `;
}

function attachCreateListeners(div) {
    const form = div.querySelector('#createForm');
    if (!form) return;

    let lastResult = null;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const prompt = div.querySelector('#prompt').value;
        const type = div.querySelector('#contentType').value;
        const platforms = Array.from(div.querySelectorAll('input[type=checkbox]:checked:not(#generateImage)')).map(cb => cb.value);
        const genImage = div.querySelector('#generateImage').checked;
        const btn = form.querySelector('button[type=submit]');

        try {
            btn.textContent = 'Generating...';
            btn.disabled = true;

            const res = await api.generate({ prompt, contentType: type, platforms });
            lastResult = res; // Store for saving

            div.querySelector('#result').style.display = 'block';
            div.querySelector('#resultText').textContent = res.content;

            if (genImage) {
                div.querySelector('#imageResult').style.display = 'block';
            } else {
                div.querySelector('#imageResult').style.display = 'none';
            }

        } catch (error) {
            alert(error.message);
        } finally {
            btn.textContent = 'Generate Content';
            btn.disabled = false;
        }
    });

    div.querySelector('#copyBtn').addEventListener('click', () => {
        if (lastResult) {
            navigator.clipboard.writeText(lastResult.content);
            alert('Copied!');
        }
    });

    div.querySelector('#saveBtn').addEventListener('click', async () => {
        if (lastResult) {
            try {
                await api.createPost({
                    content: lastResult.content,
                    platform: lastResult.platforms[0] || 'twitter',
                    status: 'draft'
                });
                alert('Saved to Library!');
            } catch (error) {
                console.error(error);
                alert('Failed to save: ' + error.message);
            }
        }
    });

    div.querySelector('#repurposeBtn').addEventListener('click', () => {
        alert('Repurposing feature coming soon! This will adapt your content for other platforms.');
    });
}

async function renderCalendar() {
    const days = Array.from({ length: 35 }, (_, i) => i + 1);
    const today = new Date().getDate();

    return `
        <div class="glass-panel" style="padding: 2rem;">
            <div class="flex-between" style="margin-bottom: 2rem;">
                <h3>Content Calendar</h3>
                <button class="btn btn-primary">New Schedule</button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--border-light); border: 1px solid var(--border-light); border-radius: 1rem; overflow: hidden;">
                ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `
                    <div style="padding: 1rem; background: var(--bg-card); text-align: center; font-weight: bold;">${d}</div>
                `).join('')}
                ${days.map(d => {
        const isToday = d === today;
        const hasEvent = d % 3 === 0;
        return `
                    <div style="padding: 1rem; background: var(--bg-card); min-height: 100px; position: relative;">
                        <span style="${isToday ? 'background: var(--primary); color: white; padding: 0.2rem 0.5rem; border-radius: 50%;' : ''}">${d <= 31 ? d : ''}</span>
                        ${hasEvent && d <= 31 ? `
                            <div style="margin-top: 0.5rem; font-size: 0.7rem; background: rgba(139, 92, 246, 0.2); color: var(--primary); padding: 0.2rem; border-radius: 0.2rem;">
                                <i class="fab fa-twitter"></i> 10:00 AM
                            </div>
                        ` : ''}
                    </div>
                `;
    }).join('')}
            </div>
        </div>
    `;
}

async function renderLibrary() {
    try {
        const data = await api.getPosts();
        const posts = data.posts || [];

        if (posts.length === 0) {
            return `<div class="glass-panel" style="padding: 2rem; text-align: center;"><h3>Library</h3><p>No posts yet.</p></div>`;
        }

        return `
            <div class="glass-panel" style="padding: 2rem;">
                <h3>Content Library</h3>
                <div style="margin-top: 2rem; display: grid; gap: 1rem;">
                    ${posts.map(post => `
                        <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 1rem; border: 1px solid var(--border-light);">
                            <div class="flex-between">
                                <span class="badge" style="background: rgba(139, 92, 246, 0.2); color: var(--primary); padding: 0.2rem 0.6rem; border-radius: 0.5rem;">${post.platform || 'General'}</span>
                                <small class="text-muted">${new Date(post.createdAt).toLocaleDateString()}</small>
                            </div>
                            <p style="margin: 1rem 0;">${post.content.substring(0, 150)}...</p>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Edit</button>
                                <button class="btn btn-secondary delete-post-btn" data-id="${post._id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; color: var(--secondary);">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-danger">Failed to load library: ${error.message}</div>`;
    }
}

function attachLibraryListeners(div) {
    div.querySelectorAll('.delete-post-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (confirm('Delete this post?')) {
                try {
                    await api.deletePost(btn.dataset.id);
                    document.querySelector('[data-tab=library]').click();
                } catch (error) {
                    alert(error.message);
                }
            }
        });
    });
}

async function renderAnalytics() {
    return `
        <div class="grid-3" style="grid-template-columns: 2fr 1fr; margin-bottom: 2rem;">
            <div class="glass-panel" style="padding: 2rem;">
                <h3>Engagement Growth</h3>
                <canvas id="perfChart"></canvas>
            </div>
            <div class="glass-panel" style="padding: 2rem;">
                <h3>Platform Split</h3>
                <canvas id="platChart"></canvas>
            </div>
        </div>
        <div class="glass-panel" style="padding: 2rem;">
            <h3>Top Performing Posts</h3>
            <p class="text-muted">Coming soon...</p>
        </div>
    `;
}

function initCharts(div) {
    const perfCtx = div.querySelector('#perfChart');
    const platCtx = div.querySelector('#platChart');

    if (perfCtx) {
        new Chart(perfCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Impressions',
                    data: [120, 190, 300, 500, 200, 300, 450],
                    borderColor: '#8b5cf6',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(139, 92, 246, 0.1)'
                }]
            },
            options: { responsive: true, plugins: { legend: { labels: { color: '#fff' } } }, scales: { y: { ticks: { color: '#aaa' } }, x: { ticks: { color: '#aaa' } } } }
        });
    }

    if (platCtx) {
        new Chart(platCtx, {
            type: 'doughnut',
            data: {
                labels: ['Twitter', 'LinkedIn', 'Instagram', 'Facebook'],
                datasets: [{
                    data: [40, 30, 20, 10],
                    backgroundColor: ['#1DA1F2', '#0A66C2', '#E4405F', '#1877F2'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, plugins: { legend: { labels: { color: '#fff' } } } }
        });
    }
}

async function renderSettings() {
    return `
        <div class="glass-panel" style="max-width: 600px; margin: 0 auto; padding: 3rem;">
            <h3>Settings</h3>
            <form>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" value="${store.state.user?.email}" disabled>
                </div>
                <div class="form-group">
                    <label class="form-label">New Password</label>
                    <input type="password" class="form-control">
                </div>
                <button class="btn btn-primary">Save Changes</button>
            </form>
        </div>
    `;
}
