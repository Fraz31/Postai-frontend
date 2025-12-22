import { store } from '../store.js';
import { api } from '../api.js';

export function Dashboard() {
    const div = document.createElement('div');
    div.className = 'dashboard-layout';

    const user = store.state.user || { email: 'User' };
    const firstName = user.email.split('@')[0];

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

            <div style="margin-top: auto; padding-top: 2rem; border-top: 1px solid var(--border-light);">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; padding: 0 1rem;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-weight: 700;">
                        ${user.email[0].toUpperCase()}
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <p style="font-size: 0.9rem; font-weight: 600; margin: 0; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${firstName}</p>
                        <p style="font-size: 0.75rem; margin: 0;">${user.email}</p>
                    </div>
                </div>
                <button id="logoutBtn" class="sidebar-link" style="color: var(--secondary); background: none; border: none; width: 100%; text-align: left; cursor: pointer;">
                    <i class="fas fa-sign-out-alt"></i> Sign Out
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="flex-between" style="margin-bottom: 3rem;">
                <div>
                    <h1 id="pageTitle" style="font-size: 2rem; margin-bottom: 0.25rem;">Dashboard</h1>
                    <p id="pageSubtitle" style="margin: 0;">Welcome back, ${firstName}! Let's create something amazing.</p>
                </div>
                <div class="flex-center" style="gap: 1rem;">
                    <button class="btn btn-secondary notification-btn" style="padding: 0.75rem; border-radius: 50%; width: 44px; height: 44px;">
                        <i class="fas fa-bell"></i>
                        <span class="notification-badge">3</span>
                    </button>
                    <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer;" title="${user.email}">
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
        contentContainer.innerHTML = '<div class="flex-center" style="padding: 4rem;"><div class="spinner"></div></div>';

        try {
            contentContainer.innerHTML = await tabs[tabName]();
            if (tabName === 'create') attachCreateListeners(div);
            if (tabName === 'analytics') initCharts(div);
            if (tabName === 'schedule') attachScheduleListeners(div);
            if (tabName === 'connections') attachConnectionListeners(div);
        } catch (error) {
            contentContainer.innerHTML = `<div class="glass-panel" style="padding: 2rem; text-align: center; color: var(--error);"><i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i><p>Error: ${error.message}</p></div>`;
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
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-file-alt text-gradient"></i></div>
                <div>
                    <h2 style="font-size: 2.5rem; margin-bottom: 0;">12</h2>
                    <p style="margin: 0; font-size: 0.9rem;">Posts Created</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-chart-bar text-gradient"></i></div>
                <div>
                    <h2 style="font-size: 2.5rem; margin-bottom: 0;">1.2k</h2>
                    <p style="margin: 0; font-size: 0.9rem;">Total Engagement</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-share-alt text-gradient"></i></div>
                <div>
                    <h2 style="font-size: 2.5rem; margin-bottom: 0;">5</h2>
                    <p style="margin: 0; font-size: 0.9rem;">Connected Platforms</p>
                </div>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            <div class="glass-panel" style="padding: 2rem;">
                <div class="flex-between" style="margin-bottom: 1.5rem;">
                    <h3><i class="fas fa-bolt text-gradient" style="margin-right: 0.5rem;"></i> Quick Actions</h3>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                    <button class="btn btn-primary" onclick="document.querySelector('[data-tab=create]').click()">
                        <i class="fas fa-plus"></i> Create Post
                    </button>
                    <button class="btn btn-secondary" onclick="document.querySelector('[data-tab=schedule]').click()">
                        <i class="fas fa-calendar"></i> Schedule
                    </button>
                    <button class="btn btn-secondary" onclick="document.querySelector('[data-tab=connections]').click()">
                        <i class="fas fa-plug"></i> Connect Account
                    </button>
                    <button class="btn btn-secondary" onclick="document.querySelector('[data-tab=analytics]').click()">
                        <i class="fas fa-chart-line"></i> View Analytics
                    </button>
                </div>
            </div>
            
            <div class="glass-panel" style="padding: 2rem;">
                <h3><i class="fas fa-history text-gradient" style="margin-right: 0.5rem;"></i> Recent Activity</h3>
                <div style="margin-top: 1.5rem;">
                    <div style="display: flex; gap: 1rem; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-light);">
                        <i class="fab fa-twitter" style="color: #1DA1F2;"></i>
                        <div style="flex: 1;">
                            <p style="margin: 0; font-size: 0.9rem;">Post published</p>
                            <p style="margin: 0; font-size: 0.75rem;">2 hours ago</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 1rem; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-light);">
                        <i class="fab fa-linkedin" style="color: #0A66C2;"></i>
                        <div style="flex: 1;">
                            <p style="margin: 0; font-size: 0.9rem;">Content scheduled</p>
                            <p style="margin: 0; font-size: 0.75rem;">5 hours ago</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 1rem; align-items: center; padding: 0.75rem 0;">
                        <i class="fas fa-wand-magic-sparkles" style="color: var(--primary);"></i>
                        <div style="flex: 1;">
                            <p style="margin: 0; font-size: 0.9rem;">AI generated 3 posts</p>
                            <p style="margin: 0; font-size: 0.75rem;">Yesterday</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function renderCreate() {
    return `
        <div class="generator-card" style="max-width: 900px; margin: 0 auto;">
            <div style="margin-bottom: 2rem; text-align: center;">
                <h3><i class="fas fa-wand-magic-sparkles text-gradient" style="margin-right: 0.5rem;"></i> AI Content Generator</h3>
                <p style="margin: 0; color: var(--text-muted);">Create engaging content for any platform in seconds</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
                <!-- Form Side -->
                <form id="createForm">
                    <div class="form-group">
                        <label class="form-label">Content Type</label>
                        <select id="contentType" class="form-control">
                            <option value="post">Social Media Post</option>
                            <option value="thread">Twitter/X Thread</option>
                            <option value="carousel">Instagram Carousel</option>
                            <option value="article">LinkedIn Article</option>
                            <option value="caption">Caption Only</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Topic or Context</label>
                        <textarea id="prompt" class="form-control" rows="5" required placeholder="e.g., Launching our new AI feature that helps users write faster..."></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tone</label>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <label class="btn btn-secondary" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;"><input type="radio" name="tone" value="professional" checked style="display: none;"> Professional</label>
                            <label class="btn btn-secondary" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;"><input type="radio" name="tone" value="casual" style="display: none;"> Casual</label>
                            <label class="btn btn-secondary" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;"><input type="radio" name="tone" value="excited" style="display: none;"> Excited</label>
                            <label class="btn btn-secondary" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;"><input type="radio" name="tone" value="witty" style="display: none;"> Witty</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                            <input type="checkbox" id="generateImage" style="accent-color: var(--primary); width: 18px; height: 18px;">
                            <span class="form-label" style="margin: 0;">Generate AI Image</span>
                            <span class="badge" style="margin: 0; padding: 0.25rem 0.75rem; font-size: 0.75rem;"><i class="fas fa-sparkles"></i> DALL-E 3</span>
                        </label>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.75rem;"><i class="fas fa-wand-magic-sparkles"></i> Generate Magic</button>
                </form>

                <!-- Preview Side -->
                <div>
                    <div id="emptyState" style="text-align: center; padding: 3rem; border: 2px dashed var(--border-light); border-radius: 1rem; color: var(--text-muted);">
                        <i class="fas fa-magic" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p>Your generated content will appear here</p>
                    </div>

                    <div id="result" style="display: none;">
                        <div class="glass-panel" style="padding: 0; overflow: hidden; border: 1px solid var(--border-light);">
                            <!-- Mock Social Header -->
                            <div style="padding: 1rem; border-bottom: 1px solid var(--border-light); display: flex; align-items: center; gap: 0.75rem;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary));"></div>
                                <div>
                                    <div style="font-weight: 600; font-size: 0.9rem;">Social Monkey</div>
                                    <div style="font-size: 0.75rem; color: var(--text-muted);">Just now • <i class="fas fa-globe"></i></div>
                                </div>
                                <i class="fas fa-ellipsis-h" style="margin-left: auto; color: var(--text-muted);"></i>
                            </div>
                            
                            <!-- Content -->
                            <div style="padding: 1.5rem;">
                                <div id="resultText" style="white-space: pre-wrap; font-size: 0.95rem; line-height: 1.6; color: var(--text-main);"></div>
                                <div id="imageResult" style="display: none; margin-top: 1rem; border-radius: 0.5rem; overflow: hidden;">
                                    <img id="generatedImage" src="" style="width: 100%; height: auto; display: block;" alt="AI Generated">
                                </div>
                            </div>

                            <!-- Mock Social Actions -->
                            <div style="padding: 0.75rem 1.5rem; border-top: 1px solid var(--border-light); display: flex; justify-content: space-between; color: var(--text-muted); font-size: 1.2rem;">
                                <i class="far fa-heart"></i>
                                <i class="far fa-comment"></i>
                                <i class="fas fa-retweet"></i>
                                <i class="far fa-share-square"></i>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
                            <button id="saveBtn" class="btn btn-primary" style="justify-content: center;"><i class="fas fa-save"></i> Save Draft</button>
                            <button id="scheduleBtn" class="btn btn-secondary" style="justify-content: center;"><i class="fas fa-calendar-plus"></i> Schedule</button>
                            <button id="copyBtn" class="btn btn-secondary" style="grid-column: span 2; justify-content: center;"><i class="fas fa-copy"></i> Copy Text</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function attachCreateListeners(div) {
    const form = div.querySelector('#createForm');
    if (!form) return;
    let lastResult = null;

    // Tone selection
    div.querySelectorAll('input[name="tone"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            div.querySelectorAll('.btn-secondary').forEach(btn => {
                if (btn.querySelector('input[name="tone"]')) {
                    btn.classList.remove('active');
                    btn.style.borderColor = 'var(--border-light)';
                }
            });
            e.target.closest('.btn').classList.add('active');
            e.target.closest('.btn').style.borderColor = 'var(--primary)';
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const prompt = div.querySelector('#prompt').value;
        const type = div.querySelector('#contentType').value;
        const genImage = div.querySelector('#generateImage').checked;
        const btn = form.querySelector('button[type=submit]');

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Weaving Magic...';
        btn.disabled = true;

        const emptyState = div.querySelector('#emptyState');
        emptyState.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div class="spinner" style="margin: 0 auto 1rem; width: 50px; height: 50px; border-width: 4px; border-top-color: var(--accent);"></div>
                <p class="text-gradient-animated" style="font-weight: 600; font-size: 1.1rem;">Consulting the Cosmic Intelligence...</p>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Crafting your ${type}...</p>
            </div>
        `;
        emptyState.style.opacity = '1';

        try {
            const res = await api.generate({ prompt, contentType: type, generateImage: genImage });

            lastResult = res;
            emptyState.style.display = 'none';
            div.querySelector('#result').style.display = 'block';

            // Typewriter effect for text
            const resultText = div.querySelector('#resultText');
            resultText.textContent = '';
            let i = 0;
            const text = res.content || res.text;
            const speed = 10;

            function typeWriter() {
                if (i < text.length) {
                    resultText.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                }
            }
            typeWriter();

            if (res.meta && res.meta.imageUrl) {
                div.querySelector('#imageResult').style.display = 'block';
                div.querySelector('#generatedImage').src = res.meta.imageUrl;
            } else {
                div.querySelector('#imageResult').style.display = 'none';
            }
        } catch (error) {
            alert(error.message);
            emptyState.innerHTML = `
                <i class="fas fa-magic" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Your generated content will appear here</p>
            `;
            emptyState.style.opacity = '1';
        } finally {
            btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate Magic';
            btn.disabled = false;
        }
    });

    div.querySelector('#copyBtn').addEventListener('click', () => {
        if (lastResult) {
            navigator.clipboard.writeText(lastResult.content || lastResult.text);
            const btn = div.querySelector('#copyBtn');
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => btn.innerHTML = original, 2000);
        }
    });

    div.querySelector('#saveBtn').addEventListener('click', async () => {
        if (lastResult) {
            try {
                const btn = div.querySelector('#saveBtn');
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                await api.createPost({ content: lastResult.content || lastResult.text, platform: 'twitter', status: 'draft' });
                btn.innerHTML = '<i class="fas fa-check"></i> Saved to Library';
                setTimeout(() => btn.innerHTML = '<i class="fas fa-save"></i> Save Draft', 2000);
            } catch (e) {
                alert(e.message);
            }
        }
    });

    div.querySelector('#scheduleBtn').addEventListener('click', () => { document.querySelector('[data-tab=schedule]').click(); });
}

async function renderSchedule() {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push('');
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    while (days.length < 42) days.push('');

    // Mock events for demo if no real events
    const demoEvents = {
        [currentDay]: [{ type: 'twitter', count: 2 }],
        [currentDay + 2]: [{ type: 'linkedin', count: 1 }],
        [currentDay + 5]: [{ type: 'instagram', count: 1 }, { type: 'twitter', count: 1 }]
    };

    return `
        <div style="display: grid; grid-template-columns: 3fr 1fr; gap: 2rem;">
            <div class="glass-panel" style="padding: 2rem;">
                <div class="flex-between" style="margin-bottom: 1.5rem;">
                    <h3><i class="fas fa-calendar text-gradient" style="margin-right: 0.5rem;"></i> ${currentMonth} ${today.getFullYear()}</h3>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary" style="padding: 0.5rem 1rem;"><i class="fas fa-chevron-left"></i></button>
                        <button class="btn btn-secondary" style="padding: 0.5rem 1rem;"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--border-light); border: 1px solid var(--border-light); border-radius: 1rem; overflow: hidden;">
                    ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div style="padding: 0.75rem; background: rgba(139,92,246,0.1); text-align: center; font-weight: 600; font-size: 0.85rem;">${d}</div>`).join('')}
                    ${days.map(d => {
        const events = demoEvents[d] || [];
        return `<div style="padding: 0.5rem; background: var(--bg-card); min-height: 100px; ${d === currentDay ? 'background: rgba(139,92,246,0.05);' : ''}">
                            ${d ? `<span style="${d === currentDay ? 'background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 4px 8px; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center;' : 'color: var(--text-muted);'} font-size: 0.85rem;">${d}</span>` : ''}
                            <div style="display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.5rem;">
                                ${events.map(e => `
                                    <div style="padding: 0.25rem 0.5rem; background: rgba(255,255,255,0.05); border-radius: 0.25rem; font-size: 0.7rem; display: flex; align-items: center; gap: 0.25rem;">
                                        <i class="fab fa-${e.type}" style="color: ${e.type === 'twitter' ? '#1DA1F2' : e.type === 'linkedin' ? '#0A66C2' : '#E4405F'};"></i>
                                        <span>${e.count} post${e.count > 1 ? 's' : ''}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>`;
    }).join('')}
                </div>
            </div>

            <div class="glass-panel" style="padding: 2rem; height: fit-content;">
                <h3><i class="fas fa-calendar-plus text-gradient" style="margin-right: 0.5rem;"></i> Quick Schedule</h3>
                <form id="scheduleForm" style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem;">
                    <div class="form-group" style="margin: 0;"><label class="form-label">Date</label><input type="date" class="form-control" id="scheduleDate" required></div>
                    <div class="form-group" style="margin: 0;"><label class="form-label">Time</label><input type="time" class="form-control" id="scheduleTime" required></div>
                    <div class="form-group" style="margin: 0;"><label class="form-label">Platform</label><select class="form-control" id="schedulePlatform"><option>Twitter</option><option>LinkedIn</option><option>Instagram</option><option>Facebook</option></select></div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;"><i class="fas fa-calendar-check"></i> Schedule Post</button>
                </form>
            </div>
        </div>
    `;
}

function attachScheduleListeners(div) {
    div.querySelector('#scheduleForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type=submit]');
        btn.innerHTML = '<i class="fas fa-check"></i> Scheduled!';
        setTimeout(() => btn.innerHTML = '<i class="fas fa-calendar-check"></i> Schedule', 2000);
    });
}

async function renderLibrary() {
    try {
        const data = await api.getPosts();
        const posts = data.posts || [];
        if (posts.length === 0) return `
            <div class="glass-panel" style="padding: 4rem; text-align: center;">
                <i class="fas fa-folder-open" style="font-size: 4rem; color: var(--text-muted); margin-bottom: 1.5rem;"></i>
                <h3>Your Library is Empty</h3>
                <p>Start creating content to build your library!</p>
                <button class="btn btn-primary" onclick="document.querySelector('[data-tab=create]').click()"><i class="fas fa-plus"></i> Create Your First Post</button>
            </div>`;
        return `
            <div class="glass-panel" style="padding: 2rem;">
                <div class="flex-between" style="margin-bottom: 1.5rem;">
                    <h3><i class="fas fa-layer-group text-gradient" style="margin-right: 0.5rem;"></i> Content Library</h3>
                    <span class="badge">${posts.length} posts</span>
                </div>
                <div style="display: grid; gap: 1rem;">
                    ${posts.map(p => `
                        <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 0.75rem; border: 1px solid var(--border-light); transition: all 0.2s;" onmouseover="this.style.borderColor='var(--border-hover)'" onmouseout="this.style.borderColor='var(--border-light)'">
                            <div class="flex-between" style="margin-bottom: 0.5rem;">
                                <small style="color: var(--text-muted);"><i class="fas fa-clock"></i> ${new Date(p.createdAt).toLocaleDateString()}</small>
                                <span class="badge" style="padding: 0.25rem 0.75rem; font-size: 0.7rem; background: ${p.status === 'draft' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}; color: ${p.status === 'draft' ? 'var(--warning)' : 'var(--success)'};">${p.status}</span>
                            </div>
                            <p style="margin: 0; line-height: 1.6;">${p.content.substring(0, 150)}${p.content.length > 150 ? '...' : ''}</p>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    } catch (e) {
        return `<div class="glass-panel" style="padding: 2rem; text-align: center; color: var(--error);"><i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i><p>Error loading library: ${e.message}</p></div>`;
    }
}

async function renderAnalytics() {
    return `
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin-bottom: 2rem;">
            <div class="glass-panel" style="padding: 2rem;">
                <h3><i class="fas fa-chart-line text-gradient" style="margin-right: 0.5rem;"></i> Engagement Over Time</h3>
                <canvas id="perfChart" style="margin-top: 1rem;"></canvas>
            </div>
            <div class="glass-panel" style="padding: 2rem;">
                <h3><i class="fas fa-chart-pie text-gradient" style="margin-right: 0.5rem;"></i> Platform Distribution</h3>
                <canvas id="platChart" style="margin-top: 1rem;"></canvas>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem;">
            <div class="stat-card" style="flex-direction: column; text-align: center; padding: 1.5rem;">
                <i class="fas fa-eye text-gradient" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                <h3 style="font-size: 1.75rem; margin-bottom: 0;">24.5K</h3>
                <p style="margin: 0; font-size: 0.85rem;">Total Views</p>
            </div>
            <div class="stat-card" style="flex-direction: column; text-align: center; padding: 1.5rem;">
                <i class="fas fa-heart text-gradient" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                <h3 style="font-size: 1.75rem; margin-bottom: 0;">1.2K</h3>
                <p style="margin: 0; font-size: 0.85rem;">Total Likes</p>
            </div>
            <div class="stat-card" style="flex-direction: column; text-align: center; padding: 1.5rem;">
                <i class="fas fa-retweet text-gradient" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                <h3 style="font-size: 1.75rem; margin-bottom: 0;">342</h3>
                <p style="margin: 0; font-size: 0.85rem;">Shares</p>
            </div>
            <div class="stat-card" style="flex-direction: column; text-align: center; padding: 1.5rem;">
                <i class="fas fa-comment text-gradient" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                <h3 style="font-size: 1.75rem; margin-bottom: 0;">89</h3>
                <p style="margin: 0; font-size: 0.85rem;">Comments</p>
            </div>
        </div>
        <div class="glass-panel" style="padding: 2rem;">
            <h3><i class="fas fa-trophy text-gradient" style="margin-right: 0.5rem;"></i> Top Performing Content</h3>
            <p style="margin-bottom: 0;">Posts that generated the most engagement this month.</p>
            <div style="margin-top: 1.5rem; display: grid; gap: 1rem;">
                <div style="display: flex; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem;">
                    <span style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">#1</span>
                    <div style="flex: 1;"><p style="margin: 0; font-size: 0.9rem;">"5 AI tools that will 10x your productivity..."</p></div>
                    <span style="color: var(--success);"><i class="fas fa-arrow-up"></i> 2.4K</span>
                </div>
                <div style="display: flex; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem;">
                    <span style="font-size: 1.5rem; font-weight: 700; color: var(--secondary);">#2</span>
                    <div style="flex: 1;"><p style="margin: 0; font-size: 0.9rem;">"The future of social media marketing is..."</p></div>
                    <span style="color: var(--success);"><i class="fas fa-arrow-up"></i> 1.8K</span>
                </div>
            </div>
        </div>
    `;
}

function initCharts(div) {
    const perfCtx = div.querySelector('#perfChart');
    if (perfCtx) new Chart(perfCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Views',
                data: [120, 190, 300, 500, 200, 300, 450],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139,92,246,0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Engagement',
                data: [50, 80, 150, 200, 100, 180, 220],
                borderColor: '#f43f5e',
                backgroundColor: 'rgba(244,63,94,0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { labels: { color: '#94a3b8' } } },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
            }
        }
    });
    const platCtx = div.querySelector('#platChart');
    if (platCtx) new Chart(platCtx, {
        type: 'doughnut',
        data: {
            labels: ['Twitter', 'LinkedIn', 'Instagram', 'Facebook'],
            datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: ['#1DA1F2', '#0A66C2', '#E4405F', '#1877F2'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { labels: { color: '#94a3b8' } } }
        }
    });
}

async function renderConnections() {
    const platforms = [
        { id: 'openai', name: 'OpenAI API', icon: 'fas fa-robot', color: '#10a37f', connected: false, placeholder: 'sk-...' },
        { id: 'twitter', name: 'Twitter/X', icon: 'fab fa-twitter', color: '#1DA1F2', connected: false, placeholder: 'Enter API Key / Bearer Token' },
        { id: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0A66C2', connected: false, placeholder: 'Enter Access Token' },
        { id: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', color: '#E4405F', connected: false, placeholder: 'Enter Access Token' },
        { id: 'facebook', name: 'Facebook', icon: 'fab fa-facebook', color: '#1877F2', connected: false, placeholder: 'Enter Page Access Token' },
        { id: 'tiktok', name: 'TikTok', icon: 'fab fa-tiktok', color: '#ffffff', connected: false, placeholder: 'Enter Access Token' },
    ];

    // In a real app, we would fetch connected status from backend
    // const { user } = store.state;
    // const connected = user.socialAccounts || {};

    return `
        <div class="glass-panel" style="padding: 2rem; max-width: 700px;">
            <h3><i class="fas fa-plug text-gradient" style="margin-right: 0.5rem;"></i> Connected Accounts</h3>
            <p style="margin-bottom: 2rem;">Link your social media accounts to publish directly from Social Monkey. <br><small class="text-muted">For this MVP, please provide your Access Tokens directly.</small></p>
            
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${platforms.map(p => `
                    <div class="connection-card" id="card-${p.id}" style="padding: 1.25rem; background: rgba(255,255,255,0.03); border-radius: 0.75rem; border: 1px solid var(--border-light);">
                        <div class="flex-between">
                            <div class="flex-center" style="gap: 1rem;">
                                <i class="${p.icon}" style="font-size: 1.75rem; color: ${p.color};"></i>
                                <div>
                                    <span style="font-weight: 600;">${p.name}</span>
                                    <span class="status-text" style="display: block; font-size: 0.8rem; color: var(--text-muted);">Not Connected</span>
                                </div>
                            </div>
                            <button class="btn btn-primary toggle-connect" data-id="${p.id}" style="padding: 0.5rem 1.25rem;">
                                <i class="fas fa-plus"></i> Connect
                            </button>
                        </div>
                        
                        <div class="connect-form" id="form-${p.id}" style="display: none; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-light);">
                            <div class="form-group">
                                <label class="form-label" style="font-size: 0.85rem;">${p.placeholder}</label>
                                <input type="password" class="form-control" id="input-${p.id}" placeholder="Paste your token here...">
                            </div>
                            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                                <button class="btn btn-ghost cancel-connect" data-id="${p.id}" style="font-size: 0.9rem;">Cancel</button>
                                <button class="btn btn-primary save-connect" data-id="${p.id}" style="font-size: 0.9rem;">Save Token</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function attachConnectionListeners(div) {
    div.querySelectorAll('.toggle-connect').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('button').dataset.id;
            div.querySelector(`#form-${id}`).style.display = 'block';
            e.target.closest('button').style.display = 'none';
        });
    });

    div.querySelectorAll('.cancel-connect').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('button').dataset.id;
            div.querySelector(`#form-${id}`).style.display = 'none';
            div.querySelector(`#card-${id} .toggle-connect`).style.display = 'inline-flex';
        });
    });

    div.querySelectorAll('.save-connect').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.closest('button').dataset.id;
            const token = div.querySelector(`#input-${id}`).value;

            if (!token) return alert('Please enter a token');

            const btnEl = e.target.closest('button');
            const originalText = btnEl.innerHTML;
            btnEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

            try {
                await api.saveConnection(id, token);

                div.querySelector(`#form-${id}`).style.display = 'none';
                const card = div.querySelector(`#card-${id}`);
                card.style.borderColor = 'var(--success)';
                card.querySelector('.status-text').innerHTML = '<span style="color: var(--success);"><i class="fas fa-check-circle"></i> Connected</span>';
                card.querySelector('.toggle-connect').style.display = 'inline-flex';
                card.querySelector('.toggle-connect').innerHTML = '<i class="fas fa-cog"></i> Manage';
                card.querySelector('.toggle-connect').classList.replace('btn-primary', 'btn-ghost');

                // Update user state locally if needed
                if (store.state.user) {
                    if (id === 'openai') {
                        if (!store.state.user.apiKeys) store.state.user.apiKeys = {};
                        store.state.user.apiKeys.openai = token;
                    } else {
                        if (!store.state.user.socialAccounts) store.state.user.socialAccounts = {};
                        if (!store.state.user.socialAccounts[id]) store.state.user.socialAccounts[id] = {};
                        store.state.user.socialAccounts[id].connected = true;
                    }
                }

                alert(`Successfully connected to ${id}!`);
            } catch (err) {
                alert('Failed to connect: ' + err.message);
            } finally {
                btnEl.innerHTML = originalText;
            }
        });
    });
}

async function renderSettings() {
    const user = store.state.user || { email: 'user@example.com' };
    return `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 900px;">
            <div class="glass-panel" style="padding: 2rem;">
                <h3><i class="fas fa-user text-gradient" style="margin-right: 0.5rem;"></i> Profile Settings</h3>
                <form style="margin-top: 1.5rem;">
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" value="${user.email}" disabled style="opacity: 0.7;">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Display Name</label>
                        <input type="text" class="form-control" placeholder="Your name">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Bio</label>
                        <textarea class="form-control" rows="3" placeholder="Tell us about yourself..."></textarea>
                    </div>
                    <button type="button" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button>
                </form>
            </div>
            <div class="glass-panel" style="padding: 2rem;">
                <h3><i class="fas fa-lock text-gradient" style="margin-right: 0.5rem;"></i> Security</h3>
                <form style="margin-top: 1.5rem;">
                    <div class="form-group">
                        <label class="form-label">Current Password</label>
                        <input type="password" class="form-control" placeholder="Enter current password">
                    </div>
                    <div class="form-group">
                        <label class="form-label">New Password</label>
                        <input type="password" class="form-control" placeholder="Enter new password">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Confirm New Password</label>
                        <input type="password" class="form-control" placeholder="Confirm new password">
                    </div>
                    <button type="button" class="btn btn-primary"><i class="fas fa-key"></i> Update Password</button>
                </form>
            </div>
        </div>
        <div class="glass-panel" style="padding: 2rem; max-width: 900px; margin-top: 2rem;">
            <h3><i class="fas fa-bell text-gradient" style="margin-right: 0.5rem;"></i> Notifications</h3>
            <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
                <label style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem; cursor: pointer;">
                    <span>Email notifications for scheduled posts</span>
                    <input type="checkbox" checked style="width: 20px; height: 20px; accent-color: var(--primary);">
                </label>
                <label style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem; cursor: pointer;">
                    <span>Weekly analytics report</span>
                    <input type="checkbox" checked style="width: 20px; height: 20px; accent-color: var(--primary);">
                </label>
                <label style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem; cursor: pointer;">
                    <span>Product updates and tips</span>
                    <input type="checkbox" style="width: 20px; height: 20px; accent-color: var(--primary);">
                </label>
            </div>
        </div>
    `;
}

async function renderHelp() {
    return `
        <div style="max-width: 800px;">
            <div class="glass-panel" style="padding: 2rem; margin-bottom: 2rem;">
                <h3><i class="fas fa-search text-gradient" style="margin-right: 0.5rem;"></i> How can we help?</h3>
                <div style="position: relative; margin-top: 1.5rem;">
                    <input type="text" class="form-control" placeholder="Search for help..." style="padding-left: 3rem;">
                    <i class="fas fa-search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                </div>
            </div>
            
            <div class="glass-panel" style="padding: 2rem; margin-bottom: 2rem;">
                <h3><i class="fas fa-question-circle text-gradient" style="margin-right: 0.5rem;"></i> Frequently Asked Questions</h3>
                <div style="margin-top: 1.5rem;">
                    <details style="margin-bottom: 1rem; padding: 1.25rem; background: rgba(255,255,255,0.03); border-radius: 0.75rem; border: 1px solid var(--border-light);">
                        <summary style="cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.75rem;"><i class="fas fa-chevron-right" style="font-size: 0.8rem; transition: transform 0.2s;"></i>Content not generating?</summary>
                        <p style="margin-top: 1rem; padding-left: 1.5rem;">Make sure your prompt is clear and descriptive. Try adding more context about your topic, audience, and desired tone. If the issue persists, check your internet connection or try again later.</p>
                    </details>
                    <details style="margin-bottom: 1rem; padding: 1.25rem; background: rgba(255,255,255,0.03); border-radius: 0.75rem; border: 1px solid var(--border-light);">
                        <summary style="cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.75rem;"><i class="fas fa-chevron-right" style="font-size: 0.8rem;"></i>How do I schedule a post?</summary>
                        <p style="margin-top: 1rem; padding-left: 1.5rem;">Go to the "Schedule" tab, select a date and time, choose your platform, and click "Schedule". Make sure your account is connected first in the Connections tab.</p>
                    </details>
                    <details style="margin-bottom: 1rem; padding: 1.25rem; background: rgba(255,255,255,0.03); border-radius: 0.75rem; border: 1px solid var(--border-light);">
                        <summary style="cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.75rem;"><i class="fas fa-chevron-right" style="font-size: 0.8rem;"></i>How do I connect my social accounts?</summary>
                        <p style="margin-top: 1rem; padding-left: 1.5rem;">Go to "Connections" and click "Connect" next to the platform you want to link. You'll be redirected to authorize Social Monkey to post on your behalf.</p>
                    </details>
                    <details style="margin-bottom: 1rem; padding: 1.25rem; background: rgba(255,255,255,0.03); border-radius: 0.75rem; border: 1px solid var(--border-light);">
                        <summary style="cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.75rem;"><i class="fas fa-chevron-right" style="font-size: 0.8rem;"></i>How does the AI image generation work?</summary>
                        <p style="margin-top: 1rem; padding-left: 1.5rem;">Our AI image generation uses Stability AI to create custom visuals based on your post content. Simply check the "Generate AI Image" option when creating content. This feature is available on Pro and Business plans.</p>
                    </details>
                </div>
            </div>
            
            <div class="glass-panel" style="padding: 2rem; background: linear-gradient(135deg, rgba(139,92,246,0.1), rgba(244,63,94,0.1));">
                <div class="flex-between" style="flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <h4 style="margin-bottom: 0.5rem;">Still need help?</h4>
                        <p style="margin: 0;">Our support team is available 24/7 to assist you.</p>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <a href="mailto:support@socialmonkey.ai" class="btn btn-secondary"><i class="fas fa-envelope"></i> Email Support</a>
                        <button class="btn btn-primary"><i class="fas fa-comments"></i> Live Chat</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
