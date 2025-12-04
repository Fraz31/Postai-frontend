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
                    <i class="fas fa-wand-magic-sparkles"></i> Create
                </a>
                <a href="#" class="sidebar-link" data-tab="schedule">
                    <i class="fas fa-calendar-alt"></i> Schedule
                </a>
                <a href="#" class="sidebar-link" data-tab="library">
                    <i class="fas fa-layer-group"></i> Library
                </a>
                <a href="#" class="sidebar-link" data-tab="analytics">
                    <i class="fas fa-chart-pie"></i> Analytics
                </a>
                <a href="#" class="sidebar-link" data-tab="connections">
                    <i class="fas fa-plug"></i> Connections
                </a>
                <a href="#" class="sidebar-link" data-tab="settings">
                    <i class="fas fa-cog"></i> Settings
                </a>
                <a href="#" class="sidebar-link" data-tab="help">
                    <i class="fas fa-question-circle"></i> Help
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

            <div id="tab-content"></div>
        </main>
    `;

    const tabs = {
        overview: renderOverview,
        create: renderCreate,
        schedule: renderSchedule,
        library: renderLibrary,
        analytics: renderAnalytics,
        connections: renderConnections,
        settings: renderSettings,
        help: renderHelp
    };

    async function switchTab(tabName) {
        div.querySelectorAll('.sidebar-link').forEach(l => {
            l.classList.remove('active');
            if (l.dataset.tab === tabName) l.classList.add('active');
        });

        const contentContainer = div.querySelector('#tab-content');
        contentContainer.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin"></i></div>';

        try {
            contentContainer.innerHTML = await tabs[tabName]();
            if (tabName === 'create') attachCreateListeners(div);
            if (tabName === 'analytics') initCharts(div);
            if (tabName === 'schedule') attachScheduleListeners(div);
        } catch (error) {
            contentContainer.innerHTML = `<div class="text-danger">Error: ${error.message}</div>`;
        }
    }

    div.querySelectorAll('.sidebar-link[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(link.dataset.tab);
        });
    });

    div.querySelector('#logoutBtn').addEventListener('click', () => store.logout());
    switchTab('overview');
    return div;
}

// --- Tab Renderers ---

async function renderOverview() {
    return `
        <div class="grid-3" style="margin-bottom: 3rem;">
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-file-alt text-gradient"></i></div><div><h2>12</h2><p>Posts</p></div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-chart-bar text-gradient"></i></div><div><h2>1.2k</h2><p>Engagement</p></div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-share-alt text-gradient"></i></div><div><h2>5</h2><p>Platforms</p></div></div>
        </div>
        <div class="glass-panel" style="padding: 2rem;">
            <h3>Quick Actions</h3>
            <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="document.querySelector('[data-tab=create]').click()"><i class="fas fa-plus"></i> Create Post</button>
                <button class="btn btn-secondary" onclick="document.querySelector('[data-tab=schedule]').click()"><i class="fas fa-calendar"></i> Schedule</button>
                <button class="btn btn-secondary" onclick="document.querySelector('[data-tab=connections]').click()"><i class="fas fa-plug"></i> Connect Accounts</button>
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
                        <option value="thread">Twitter/X Thread</option>
                        <option value="carousel">Instagram Carousel</option>
                        <option value="reel">Instagram/TikTok Reel Script</option>
                        <option value="article">LinkedIn Article</option>
                        <option value="story">Story (IG/FB)</option>
                        <option value="caption">Caption Only</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">What's your post about?</label>
                    <textarea id="prompt" class="form-control" rows="4" required placeholder="Describe your topic, key points, or paste content to repurpose..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Target Platforms</label>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <label><input type="checkbox" value="twitter" checked> Twitter/X</label>
                        <label><input type="checkbox" value="linkedin"> LinkedIn</label>
                        <label><input type="checkbox" value="instagram"> Instagram</label>
                        <label><input type="checkbox" value="facebook"> Facebook</label>
                        <label><input type="checkbox" value="tiktok"> TikTok</label>
                        <label><input type="checkbox" value="threads"> Threads</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="generateImage"> Generate AI Image (Stability AI) <i class="fas fa-image text-gradient"></i>
                    </label>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;"><i class="fas fa-wand-magic-sparkles"></i> Generate Content</button>
            </form>
            <div id="result" style="display: none; margin-top: 2rem;" class="glass-panel">
                <h4>Generated Result</h4>
                <pre id="resultText" style="white-space: pre-wrap; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 0.5rem;"></pre>
                <div id="imageResult" style="display: none; margin: 1rem 0; text-align: center;">
                    <p class="text-muted">AI Generated Image:</p>
                    <div style="width: 100%; height: 250px; background: #111; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem;"><i class="fas fa-image" style="font-size: 2rem; color: var(--text-muted);"></i></div>
                </div>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button id="copyBtn" class="btn btn-secondary"><i class="fas fa-copy"></i> Copy</button>
                    <button id="saveBtn" class="btn btn-primary"><i class="fas fa-save"></i> Save</button>
                    <button id="scheduleBtn" class="btn btn-secondary"><i class="fas fa-calendar-plus"></i> Schedule</button>
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

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        btn.disabled = true;

        try {
            const res = await api.generate({ prompt, contentType: type, platforms });
            lastResult = res;
            div.querySelector('#result').style.display = 'block';
            div.querySelector('#resultText').textContent = res.content;
            div.querySelector('#imageResult').style.display = genImage ? 'block' : 'none';
        } catch (error) {
            alert(error.message);
        } finally {
            btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate Content';
            btn.disabled = false;
        }
    });

    div.querySelector('#copyBtn').addEventListener('click', () => { if (lastResult) { navigator.clipboard.writeText(lastResult.content); alert('Copied!'); } });
    div.querySelector('#saveBtn').addEventListener('click', async () => { if (lastResult) { try { await api.createPost({ content: lastResult.content, platform: 'twitter', status: 'draft' }); alert('Saved!'); } catch (e) { alert(e.message); } } });
    div.querySelector('#scheduleBtn').addEventListener('click', () => { document.querySelector('[data-tab=schedule]').click(); });
    div.querySelector('#repurposeBtn').addEventListener('click', () => { alert('Repurposing: Automatically adapt this content for other platforms. Coming soon!'); });
}

async function renderSchedule() {
    const days = Array.from({ length: 35 }, (_, i) => i + 1);
    const today = new Date().getDate();
    return `
        <div class="glass-panel" style="padding: 2rem; margin-bottom: 2rem;">
            <h3>Schedule a Post</h3>
            <form id="scheduleForm" style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 1rem; align-items: end; margin-top: 1rem;">
                <div class="form-group" style="margin: 0;"><label class="form-label">Date</label><input type="date" class="form-control" id="scheduleDate" required></div>
                <div class="form-group" style="margin: 0;"><label class="form-label">Time</label><input type="time" class="form-control" id="scheduleTime" required></div>
                <div class="form-group" style="margin: 0;"><label class="form-label">Platform</label><select class="form-control" id="schedulePlatform"><option>Twitter</option><option>LinkedIn</option><option>Instagram</option></select></div>
                <button type="submit" class="btn btn-primary"><i class="fas fa-calendar-check"></i> Schedule</button>
            </form>
        </div>
        <div class="glass-panel" style="padding: 2rem;">
            <h3>Calendar</h3>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--border-light); border: 1px solid var(--border-light); border-radius: 1rem; overflow: hidden; margin-top: 1rem;">
                ${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => `<div style="padding: 0.5rem; background: var(--bg-card); text-align: center; font-weight: bold;">${d}</div>`).join('')}
                ${days.map(d => `<div style="padding: 0.5rem; background: var(--bg-card); min-height: 60px;"><span style="${d === today ? 'background: var(--primary); color: white; padding: 2px 6px; border-radius: 50%;' : ''}">${d <= 31 ? d : ''}</span>${d % 5 === 0 && d <= 31 ? `<div style="font-size: 0.6rem; margin-top: 0.3rem; color: var(--primary);"><i class="fab fa-twitter"></i></div>` : ''}</div>`).join('')}
            </div>
        </div>
    `;
}

function attachScheduleListeners(div) {
    div.querySelector('#scheduleForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Post scheduled successfully!');
    });
}

async function renderLibrary() {
    try {
        const data = await api.getPosts();
        const posts = data.posts || [];
        if (posts.length === 0) return `<div class="glass-panel" style="padding: 2rem; text-align: center;"><h3>Library</h3><p>No posts yet. Start creating!</p></div>`;
        return `<div class="glass-panel" style="padding: 2rem;"><h3>Content Library</h3><div style="margin-top: 1rem;">${posts.map(p => `<div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid var(--border-light);"><small class="text-muted">${new Date(p.createdAt).toLocaleDateString()}</small><p style="margin: 0.5rem 0;">${p.content.substring(0, 100)}...</p></div>`).join('')}</div></div>`;
    } catch (e) { return `<div class="text-danger">Error loading library</div>`; }
}

async function renderAnalytics() {
    return `
        <div class="grid-3" style="grid-template-columns: 2fr 1fr; margin-bottom: 2rem;">
            <div class="glass-panel" style="padding: 2rem;"><h3>Engagement</h3><canvas id="perfChart"></canvas></div>
            <div class="glass-panel" style="padding: 2rem;"><h3>Platforms</h3><canvas id="platChart"></canvas></div>
        </div>
        <div class="glass-panel" style="padding: 2rem;"><h3>Top Performing Content</h3><p class="text-muted">Track your best posts here.</p></div>
    `;
}

function initCharts(div) {
    const perfCtx = div.querySelector('#perfChart');
    if (perfCtx) new Chart(perfCtx, { type: 'line', data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Views', data: [120, 190, 300, 500, 200, 300, 450], borderColor: '#8b5cf6', tension: 0.4, fill: true, backgroundColor: 'rgba(139,92,246,0.1)' }] }, options: { responsive: true } });
    const platCtx = div.querySelector('#platChart');
    if (platCtx) new Chart(platCtx, { type: 'doughnut', data: { labels: ['Twitter', 'LinkedIn', 'Instagram', 'Facebook'], datasets: [{ data: [40, 30, 20, 10], backgroundColor: ['#1DA1F2', '#0A66C2', '#E4405F', '#1877F2'], borderWidth: 0 }] }, options: { responsive: true } });
}

async function renderConnections() {
    return `
        <div class="glass-panel" style="padding: 2rem; max-width: 600px;">
            <h3>Connect Your Accounts</h3>
            <p class="text-muted" style="margin-bottom: 2rem;">Link your social media accounts to publish directly from Social Monkey.</p>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div class="flex-between" style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem;"><div class="flex-center" style="gap: 1rem;"><i class="fab fa-twitter" style="font-size: 1.5rem; color: #1DA1F2;"></i><span>Twitter/X</span></div><button class="btn btn-secondary">Connect</button></div>
                <div class="flex-between" style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem;"><div class="flex-center" style="gap: 1rem;"><i class="fab fa-linkedin" style="font-size: 1.5rem; color: #0A66C2;"></i><span>LinkedIn</span></div><button class="btn btn-secondary">Connect</button></div>
                <div class="flex-between" style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem;"><div class="flex-center" style="gap: 1rem;"><i class="fab fa-instagram" style="font-size: 1.5rem; color: #E4405F;"></i><span>Instagram</span></div><button class="btn btn-secondary">Connect</button></div>
                <div class="flex-between" style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem;"><div class="flex-center" style="gap: 1rem;"><i class="fab fa-facebook" style="font-size: 1.5rem; color: #1877F2;"></i><span>Facebook</span></div><button class="btn btn-secondary">Connect</button></div>
                <div class="flex-between" style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem;"><div class="flex-center" style="gap: 1rem;"><i class="fab fa-tiktok" style="font-size: 1.5rem;"></i><span>TikTok</span></div><button class="btn btn-secondary">Connect</button></div>
            </div>
        </div>
    `;
}

async function renderSettings() {
    return `<div class="glass-panel" style="max-width: 600px; padding: 2rem;"><h3>Settings</h3><form><div class="form-group"><label class="form-label">Email</label><input type="email" class="form-control" value="${store.state.user?.email}" disabled></div><div class="form-group"><label class="form-label">New Password</label><input type="password" class="form-control"></div><button class="btn btn-primary">Save</button></form></div>`;
}

async function renderHelp() {
    return `
        <div class="glass-panel" style="padding: 2rem; max-width: 800px;">
            <h3><i class="fas fa-question-circle text-gradient"></i> Help & Troubleshooting</h3>
            <div style="margin-top: 2rem;">
                <details style="margin-bottom: 1rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem;">
                    <summary style="cursor: pointer; font-weight: bold;">Content not generating?</summary>
                    <p style="margin-top: 1rem; color: var(--text-muted);">Make sure your prompt is clear and descriptive. Try adding more context. If the issue persists, check your internet connection or try again later.</p>
                </details>
                <details style="margin-bottom: 1rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem;">
                    <summary style="cursor: pointer; font-weight: bold;">How do I schedule a post?</summary>
                    <p style="margin-top: 1rem; color: var(--text-muted);">Go to the "Schedule" tab, select a date and time, choose your platform, and click "Schedule". Make sure your account is connected first.</p>
                </details>
                <details style="margin-bottom: 1rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem;">
                    <summary style="cursor: pointer; font-weight: bold;">How do I connect my social accounts?</summary>
                    <p style="margin-top: 1rem; color: var(--text-muted);">Go to "Connections" and click "Connect" next to the platform you want to link. You'll be redirected to authorize Social Monkey.</p>
                </details>
                <details style="margin-bottom: 1rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem;">
                    <summary style="cursor: pointer; font-weight: bold;">Image generation not working?</summary>
                    <p style="margin-top: 1rem; color: var(--text-muted);">AI image generation uses Stability AI. Ensure you have an active subscription. If issues persist, contact support.</p>
                </details>
            </div>
            <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(139,92,246,0.1), rgba(244,63,94,0.1)); border-radius: 0.5rem;">
                <h4>Still need help?</h4>
                <p class="text-muted">Contact us at <a href="mailto:support@socialmonkey.ai" class="text-gradient">support@socialmonkey.ai</a></p>
            </div>
        </div>
    `;
}
