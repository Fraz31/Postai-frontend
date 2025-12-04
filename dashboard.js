/**
 * Social Monkey Dashboard Logic
 * Handles SPA navigation, data loading, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check Auth
    const token = localStorage.getItem('socialmonkey_token');
    if (!token) {
        window.location.href = 'index.html#account';
        return;
    }

    // Initialize
    initDashboard();
    setupDashboardListeners();
});

function initDashboard() {
    loadDashboardData();
    loadContentLibrary();
    createCharts();

    // Set active tab from URL hash or default to overview
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'create', 'library', 'analytics', 'settings'].includes(hash)) {
        switchTab(hash);
    } else {
        switchTab('overview');
    }
}

// --- Navigation ---
function switchTab(tabId) {
    // Update Sidebar
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.tab === tabId) link.classList.add('active');
    });

    // Update Content
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.style.display = 'none';
    });
    const activeTab = document.getElementById(`tab-${tabId}`);
    if (activeTab) {
        activeTab.style.display = 'block';
        // Trigger animations for elements inside
        activeTab.querySelectorAll('.glass-panel, .stat-card').forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; /* trigger reflow */
            el.style.animation = 'slideIn 0.4s ease-out forwards';
        });
    }

    // Update Header
    const titles = {
        overview: 'Dashboard',
        create: 'Create Content',
        library: 'Content Library',
        analytics: 'Analytics',
        settings: 'Settings'
    };
    const subtitles = {
        overview: 'Welcome back to your command center.',
        create: 'Generate magic with AI.',
        library: 'Manage your generated posts.',
        analytics: 'Track your growth and performance.',
        settings: 'Manage your account and preferences.'
    };

    document.getElementById('pageTitle').textContent = titles[tabId];
    document.getElementById('pageSubtitle').textContent = subtitles[tabId];

    // Update URL hash without scrolling
    history.pushState(null, null, `#${tabId}`);
}

// --- Data Loading ---
function loadDashboardData() {
    const content = JSON.parse(localStorage.getItem('socialmonkey_content') || '[]');

    // Update Stats
    document.getElementById('totalPosts').textContent = content.length;
    document.getElementById('totalEngagement').textContent = content.reduce((sum, item) => sum + (item.engagement || 0), 0).toLocaleString();
    const platforms = new Set(content.flatMap(item => item.platforms || []));
    document.getElementById('platformsUsed').textContent = platforms.size;

    // Recent Activity (Top 3)
    const recentList = document.getElementById('recentContentList');
    if (recentList) {
        if (content.length === 0) {
            recentList.innerHTML = '<p class="text-muted">No recent activity.</p>';
        } else {
            recentList.innerHTML = content.slice(0, 3).map((item, index) => renderContentItem(item, index, true)).join('');
        }
    }
}

function loadContentLibrary() {
    const content = JSON.parse(localStorage.getItem('socialmonkey_content') || '[]');
    const listEl = document.getElementById('fullContentList');

    if (!listEl) return;

    if (content.length === 0) {
        listEl.innerHTML = '<div class="text-center" style="padding: 3rem;"><i class="fas fa-ghost" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i><p>No content yet. Go create something!</p></div>';
        return;
    }

    listEl.innerHTML = content.map((item, index) => renderContentItem(item, index)).join('');
}

function renderContentItem(item, index, compact = false) {
    return `
        <div class="glass-panel" style="margin-bottom: 1rem; padding: ${compact ? '1rem' : '1.5rem'}; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255,255,255,0.05);">
            <div class="flex-between" style="align-items: flex-start;">
                <div style="flex: 1;">
                    <div class="flex-center" style="justify-content: flex-start; gap: 1rem; margin-bottom: 0.5rem;">
                        <span class="badge" style="background: rgba(139, 92, 246, 0.2); color: var(--primary); padding: 0.2rem 0.6rem; border-radius: 0.5rem; font-size: 0.75rem; text-transform: uppercase;">${item.contentType || 'Post'}</span>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">${new Date(item.created || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <p style="margin-bottom: 1rem; color: var(--text-main); font-size: 0.95rem; line-height: 1.5;">${item.prompt.substring(0, 100)}${item.prompt.length > 100 ? '...' : ''}</p>
                    <div style="display: flex; gap: 0.5rem;">
                        ${(item.platforms || []).map(p => `<i class="fab fa-${p}" style="color: var(--text-muted);"></i>`).join('')}
                    </div>
                </div>
                <div style="display: flex; gap: 0.5rem; margin-left: 1rem;">
                    <button class="btn btn-secondary" onclick="copyContent(${index})" title="Copy" style="padding: 0.5rem; width: 32px; height: 32px;">
                        <i class="fas fa-copy"></i>
                    </button>
                    ${!compact ? `
                    <button class="btn btn-secondary" onclick="deleteContent(${index})" title="Delete" style="padding: 0.5rem; width: 32px; height: 32px; color: var(--secondary);">
                        <i class="fas fa-trash"></i>
                    </button>` : ''}
                </div>
            </div>
        </div>
    `;
}

// --- Interactions ---

// Dashboard Create Form
const dashForm = document.getElementById('dashboardContentForm');
if (dashForm) {
    dashForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reuse logic from script.js generateContent but adapted for dashboard IDs
        const contentType = document.getElementById('dashContentType').value;
        const prompt = document.getElementById('dashPrompt').value;
        const platforms = Array.from(document.querySelectorAll('input[name="dashPlatform"]:checked')).map(cb => cb.value);

        if (!prompt || platforms.length === 0) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        setDashLoading(true);

        // Simulate API call (using the same logic as script.js would, but we can call the global function if we refactored, 
        // but let's just implement the demo logic here for robustness since script.js might be scoped)

        setTimeout(() => {
            const mockResult = `🐵 Generated ${contentType} for ${platforms.join(', ')}:\n\n${prompt}\n\n#SocialMonkey #AI`;

            document.getElementById('dashResultContent').textContent = mockResult;
            document.getElementById('dashResultBox').style.display = 'block';

            // Save
            const newItem = { contentType, prompt, platforms, result: mockResult, created: new Date().toISOString() };
            const library = JSON.parse(localStorage.getItem('socialmonkey_content') || '[]');
            library.unshift(newItem);
            localStorage.setItem('socialmonkey_content', JSON.stringify(library));

            // Refresh data
            loadDashboardData();
            loadContentLibrary();

            showToast('Content generated!', 'success');
            setDashLoading(false);
        }, 1500);
    });
}

function setDashLoading(isLoading) {
    const btn = document.getElementById('dashSubmitBtn');
    const txt = document.getElementById('dashBtnText');
    const spin = document.getElementById('dashBtnSpinner');

    if (btn) btn.disabled = isLoading;
    if (txt) txt.textContent = isLoading ? 'Generating...' : 'Generate Content';
    if (spin) spin.style.display = isLoading ? 'inline-block' : 'none';
}

function copyDashResult() {
    const text = document.getElementById('dashResultContent').textContent;
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
}

// Settings Form
const settingsForm = document.getElementById('settingsForm');
if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('settingsName').value;
        showToast(`Profile updated for ${name}!`, 'success');
    });
}

// Search
document.getElementById('searchContent')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const content = JSON.parse(localStorage.getItem('socialmonkey_content') || '[]');
    const filtered = content.filter(item =>
        item.prompt.toLowerCase().includes(query) ||
        item.contentType.toLowerCase().includes(query)
    );

    const listEl = document.getElementById('fullContentList');
    if (filtered.length === 0) {
        listEl.innerHTML = '<p class="text-center text-muted">No matches found.</p>';
    } else {
        listEl.innerHTML = filtered.map((item, index) => renderContentItem(item, index)).join('');
    }
});

// --- Listeners ---
function setupDashboardListeners() {
    // Sidebar Navigation
    document.querySelectorAll('.sidebar-link[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(link.dataset.tab);
        });
    });
}

// Make global for onclick handlers
window.switchTab = switchTab;
window.copyContent = (index) => {
    const content = JSON.parse(localStorage.getItem('socialmonkey_content') || '[]');
    navigator.clipboard.writeText(content[index].result || content[index].prompt);
    showToast('Copied!', 'success');
};
window.deleteContent = (index) => {
    if (confirm('Delete this item?')) {
        const content = JSON.parse(localStorage.getItem('socialmonkey_content') || '[]');
        content.splice(index, 1);
        localStorage.setItem('socialmonkey_content', JSON.stringify(content));
        loadDashboardData();
        loadContentLibrary();
        showToast('Deleted.', 'info');
    }
};
