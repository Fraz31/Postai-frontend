/**
 * Social Monkey Dashboard Logic
 * Full SaaS Version - API Integrated
 */

// Configuration - REPLACE WITH YOUR REAL PADDLE VALUES
const PADDLE_CLIENT_TOKEN = 'test_token';
const PADDLE_PRICE_IDS = {
    starter: 'pri_starter_123',
    pro: 'pri_pro_456',
    business: 'pri_business_789'
};

// Handle generic backend URL from config or fallback
let API_BASE = window.API_BASE || window.BACKEND_URL || 'https://postai-backend-z2yu.onrender.com';
// Remove trailing /api if present, because our calls include /api
API_BASE = API_BASE.replace(/\/api\/?$/, '');

document.addEventListener('DOMContentLoaded', () => {
    // Check Auth
    const token = localStorage.getItem('socialmonkey_token');
    if (!token) {
        window.location.href = 'index.html#account';
        return;
    }

    // Initialize Paddle
    if (window.Paddle) {
        Paddle.Environment.set('sandbox'); // Set to 'production' for live
        Paddle.Initialize({
            token: PADDLE_CLIENT_TOKEN,
            eventCallback: function (data) {
                // Refresh subscription info on successful checkout
                if (data.name === 'checkout.completed') {
                    loadSubscriptionInfo();
                    showToast('Subscription updated successfully!', 'success');
                }
            }
        });
    }

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.logout) {
            window.logout();
        } else {
            localStorage.removeItem('socialmonkey_token');
            window.location.href = 'index.html';
        }
    });

    // Initialize Dashboard
    initDashboard();
    setupDashboardListeners();
});

async function initDashboard() {
    await loadUserProfile(); // Load profile first to get connections
    loadDashboardData();     // Load stats/recent posts
    loadContentLibrary();    // Load full library
    loadSubscriptionInfo();  // Load plan info
    createCharts();          // Render charts

    // Set active tab from URL hash or default to overview
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'create', 'library', 'analytics', 'settings'].includes(hash)) {
        switchTab(hash);
    } else {
        switchTab('overview');
    }
}

// --- API Helpers ---
async function apiCall(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('socialmonkey_token');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    try {
        const fetchOptions = {
            method,
            headers,
        };
        if (body) fetchOptions.body = JSON.stringify(body);

        const response = await fetch(`${API_BASE}${endpoint}`, fetchOptions);
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired
                localStorage.removeItem('socialmonkey_token');
                window.location.href = 'index.html#account';
                return null;
            }
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        showToast(error.message, 'error');
        throw error;
    }
}

// --- Data Loading ---

async function loadUserProfile() {
    try {
        const data = await apiCall('/api/auth/me');
        if (data && data.user) {
            updateSettingsUI(data.user);
        }
    } catch (e) {
        console.warn('Failed to load profile');
    }
}

async function loadDashboardData() {
    try {
        // Fetch recent posts for stats
        const data = await apiCall('/api/posts?limit=100'); // Fetch enough for basic client-side stats
        const posts = data.posts || [];

        // Update Stats
        document.getElementById('totalPosts').textContent = data.total || posts.length;

        // Mock engagement stats since backend doesn't store them yet
        const totalEngagement = posts.reduce((sum, p) => sum + (p.metadata?.engagement || Math.floor(Math.random() * 50)), 0);
        document.getElementById('totalEngagement').textContent = totalEngagement.toLocaleString();

        const platforms = new Set(posts.flatMap(item => item.platforms || []));
        document.getElementById('platformsUsed').textContent = platforms.size;

        // Recent Activity (Top 3)
        const recentList = document.getElementById('recentContentList');
        if (recentList) {
            if (posts.length === 0) {
                recentList.innerHTML = '<p class="text-muted">No recent activity.</p>';
            } else {
                recentList.innerHTML = posts.slice(0, 3).map((item, index) => renderContentItem(item, index, true)).join('');
            }
        }
    } catch (e) {
        console.error('Error loading dashboard data:', e);
    }
}

async function loadContentLibrary() {
    const listEl = document.getElementById('fullContentList');
    if (!listEl) return;

    try {
        const data = await apiCall('/api/posts?limit=50');
        const posts = data.posts || [];

        if (posts.length === 0) {
            listEl.innerHTML = '<div class="text-center" style="padding: 3rem;"><i class="fas fa-ghost" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i><p>No content yet. Go create something!</p></div>';
            return;
        }

        // Store posts globally/locally for filtering search
        window.allPosts = posts;
        renderLibrary(posts);

    } catch (e) {
        listEl.innerHTML = '<p class="text-center text-danger">Failed to load library.</p>';
    }
}

function renderLibrary(posts) {
    const listEl = document.getElementById('fullContentList');
    listEl.innerHTML = posts.map((item, index) => renderContentItem(item, index)).join('');
}

async function loadSubscriptionInfo() {
    try {
        const data = await apiCall('/api/subscription/me');
        if (!data || !data.subscription) return;

        const { plan, status, limits, dailyCredits } = data.subscription;
        window.currentPlan = plan; // Store for upgrade logic

        // Update UI
        const planNameEl = document.getElementById('currentPlanName');
        if (planNameEl) {
            const planEmoji = { starter: '🚀', pro: '🔥', business: '👑' };
            planNameEl.textContent = `${planEmoji[plan] || ''} ${plan}`;
        }

        const statusEl = document.getElementById('subscriptionStatus');
        if (statusEl) {
            statusEl.textContent = status;
            statusEl.className = 'badge';
            if (status === 'active') {
                statusEl.style.background = 'rgba(0,255,136,0.2)';
                statusEl.style.color = '#00ff88';
            } else {
                statusEl.style.background = 'rgba(255,100,100,0.2)';
                statusEl.style.color = '#ff6464';
            }
        }

        const usedPosts = dailyCredits?.used || 0;
        const limitPosts = limits?.postsPerMonth || 50;
        const isUnlimited = !Number.isFinite(limitPosts);

        const postsUsedEl = document.getElementById('postsUsed');
        if (postsUsedEl) {
            postsUsedEl.textContent = isUnlimited ? `${usedPosts} / ∞` : `${usedPosts} / ${limitPosts}`;
        }

        const progressBar = document.getElementById('usageProgressBar');
        if (progressBar) {
            if (isUnlimited) {
                progressBar.style.width = '100%';
                progressBar.style.background = 'linear-gradient(135deg, #00ff88, #00d4aa)';
            } else {
                const percentage = Math.min((usedPosts / limitPosts) * 100, 100);
                progressBar.style.width = `${percentage}%`;
                if (percentage > 90) progressBar.style.background = '#ff6464';
            }
        }

    } catch (e) {
        console.warn('Subscription load error');
    }
}

// --- Actions & Rendering ---

function renderContentItem(item, index, compact = false) {
    // Handle both old localStorage format and new DB format
    // DB format: { _id, content, platform, status, imageUrl, ... }
    const id = item._id || index;
    const contentText = item.content || item.prompt || '';
    const platforms = Array.isArray(item.platform) ? item.platform : [item.platform].filter(Boolean);
    const date = new Date(item.createdAt || item.created || Date.now()).toLocaleDateString();

    return `
        <div class="glass-panel" style="margin-bottom: 1rem; padding: ${compact ? '1rem' : '1.5rem'}; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255,255,255,0.05);">
            <div class="flex-between" style="align-items: flex-start;">
                <div style="flex: 1;">
                    <div class="flex-center" style="justify-content: flex-start; gap: 1rem; margin-bottom: 0.5rem;">
                        <span class="badge" style="background: rgba(139, 92, 246, 0.2); color: var(--primary); padding: 0.2rem 0.6rem; border-radius: 0.5rem; font-size: 0.75rem; text-transform: uppercase;">${item.contentType || 'Post'}</span>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">${date}</span>
                    </div>
                    <p style="margin-bottom: 1rem; color: var(--text-main); font-size: 0.95rem; line-height: 1.5; white-space: pre-wrap;">${contentText.substring(0, 150)}${contentText.length > 150 ? '...' : ''}</p>
                    
                    ${item.imageUrl ? `<img src="${item.imageUrl}" style="max-height: 100px; border-radius: 0.5rem; margin-bottom: 1rem; display: block;">` : ''}

                    <div style="display: flex; gap: 0.5rem;">
                        ${platforms.map(p => `<i class="fab fa-${p}" style="color: var(--text-muted);"></i>`).join('')}
                    </div>
                </div>
                <div style="display: flex; gap: 0.5rem; margin-left: 1rem;">
                    <button class="btn btn-secondary" onclick="copyContent('${id}')" title="Copy" style="padding: 0.5rem; width: 32px; height: 32px;">
                        <i class="fas fa-copy"></i>
                    </button>
                    ${!compact ? `
                    <button class="btn btn-secondary" onclick="deleteContent('${id}')" title="Delete" style="padding: 0.5rem; width: 32px; height: 32px; color: var(--secondary);">
                        <i class="fas fa-trash"></i>
                    </button>` : ''}
                </div>
            </div>
        </div>
    `;
}

// --- Interactions ---

// 1. Create Content
const dashForm = document.getElementById('dashboardContentForm');
if (dashForm) {
    dashForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const contentType = document.getElementById('dashContentType').value;
        const prompt = document.getElementById('dashPrompt').value;
        const platforms = Array.from(document.querySelectorAll('input[name="dashPlatform"]:checked')).map(cb => cb.value);

        if (!prompt || platforms.length === 0) {
            showToast('Please fill in prompt and select at least one platform', 'error');
            return;
        }

        setDashLoading(true);

        try {
            // 1. Generate Content
            const genRes = await apiCall('/api/generate', 'POST', {
                contentType,
                prompt,
                platforms,
                generateImage: contentType === 'post' || contentType === 'caption' // Generate image contextually
            });

            if (genRes.success) {
                // Show result
                const content = genRes.content;
                document.getElementById('dashResultContent').textContent = content;
                window.lastGeneratedContent = { ...genRes, prompt }; // Store for saving
                document.getElementById('dashResultBox').style.display = 'block';

                showToast('Content generated successfully!', 'success');

                // Auto-save to DB as a draft/created post
                await apiCall('/api/posts', 'POST', {
                    content: content,
                    platform: platforms[0], // Primary platform
                    status: 'draft',
                    contentType: contentType,
                    imageUrl: genRes.meta?.imageUrl,
                    metadata: genRes.meta
                });

                // Refresh library
                loadContentLibrary();
                loadDashboardData();
            }

        } catch (err) {
            // Already handled in apiCall
        } finally {
            setDashLoading(false);
        }
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

// 2. Settings & Integrations
function updateSettingsUI(user) {
    // Name/Email
    const nameInput = document.getElementById('settingsName');
    const emailInput = document.getElementById('settingsEmail');
    if (nameInput) nameInput.value = user.name || 'User'; // Fallback if name not in schema yet
    if (emailInput) emailInput.value = user.email;

    // API Key
    const keyInput = document.getElementById('settingsOpenaiKey');
    if (keyInput && user.apiKeys?.openai) {
        keyInput.value = user.apiKeys.openai; // Or mask it
        keyInput.placeholder = '••••••••••••••••';
    }

    // Social Connections
    updateSocialStatus('twitter', user.socialAccounts?.twitter?.connected);
    updateSocialStatus('linkedin', user.socialAccounts?.linkedin?.connected);
}

function updateSocialStatus(platform, isConnected) {
    const statusEl = document.getElementById(`status-${platform}`);
    const btnEl = document.getElementById(`btn-${platform}`);

    if (isConnected) {
        if (statusEl) {
            statusEl.textContent = 'Connected';
            statusEl.style.color = '#00ff88';
            statusEl.style.opacity = '1';
        }
        if (btnEl) {
            btnEl.textContent = 'Disconnect';
            btnEl.className = 'btn btn-secondary btn-sm';
            btnEl.onclick = () => disconnectSocial(platform);
        }
    } else {
        if (statusEl) {
            statusEl.textContent = 'Not Connected';
            statusEl.style.color = 'var(--text-muted)';
            statusEl.style.opacity = '0.7';
        }
        if (btnEl) {
            btnEl.textContent = 'Connect';
            btnEl.onclick = () => connectSocial(platform);
        }
    }
}

window.connectSocial = async (platform) => {
    // Since we don't have OAuth, prompt for Access Token
    const token = prompt(`Enter your ${platform} Access Token (Manual Connection):`);
    if (!token) return;

    try {
        await apiCall('/api/auth/connection', 'POST', {
            platform: platform,
            token: token
        });
        showToast(`${platform} connected successfully!`, 'success');
        loadUserProfile(); // Refresh UI
    } catch (e) {
        // Error handled
    }
};

window.disconnectSocial = async (platform) => {
    // For now, disonnecting isn't explicitly in API, but we can overwrite with empty token?
    // Or add a disconnect endpoint. For MVP, we'll confirm and then say "feature pending" or similar
    // Actually, let's just re-prompt to overwrite for now, or assume Connected is permanent in this MVP phase
    if (confirm('Disconnecting will remove this account. Continue?')) {
        // Calling with empty token might not work depending on backend validator.
        // Let's just prompt user that this is a placeholder.
        alert('Disconnect feature coming soon. You can overwrite the token by clicking Connect again.');
    }
};

window.saveApiKey = async () => {
    const key = document.getElementById('settingsOpenaiKey').value;
    if (!key) {
        showToast('Please enter an API key', 'error');
        return;
    }

    try {
        await apiCall('/api/auth/connection', 'POST', {
            platform: 'openai',
            token: key
        });
        showToast('OpenAI API Key saved!', 'success');
    } catch (e) {
        // Error handled
    }
};

// 3. Navigation
function switchTab(tabId) {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.tab === tabId) link.classList.add('active');
    });

    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.style.display = 'none';
    });
    const activeTab = document.getElementById(`tab-${tabId}`);
    if (activeTab) {
        activeTab.style.display = 'block';
        activeTab.querySelectorAll('.glass-panel, .stat-card').forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = 'slideIn 0.4s ease-out forwards';
        });
    }

    const titles = {
        overview: 'Dashboard',
        create: 'Create Content',
        library: 'Content Library',
        analytics: 'Analytics',
        settings: 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[tabId] || 'Dashboard';
    history.pushState(null, null, `#${tabId}`);
}

// 4. Global Actions
window.switchTab = switchTab;

window.copyContent = (id) => {
    // Find content
    const item = window.allPosts?.find(p => p._id === id) || {};
    const text = item.content || item.prompt || document.getElementById('dashResultContent')?.textContent;

    if (text) {
        navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
    }
};

window.copyDashResult = () => {
    const text = document.getElementById('dashResultContent').textContent;
    navigator.clipboard.writeText(text);
    showToast('Copied!', 'success');
};

window.deleteContent = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
        await apiCall(`/api/posts/${id}`, 'DELETE');
        showToast('Post deleted', 'info');
        loadContentLibrary();
        loadDashboardData();
    } catch (e) {
        // Error handled
    }
};

window.upgradePlan = (plan) => {
    // Open Paddle Checkout
    // Map plan name (e.g. 'pro') to price ID
    const priceId = PADDLE_PRICE_IDS[plan];
    if (!priceId) {
        showToast('Invalid plan selected', 'error');
        return;
    }

    // Need email to pre-fill?
    const userEmail = document.getElementById('settingsEmail')?.value;

    Paddle.Checkout.open({
        items: [{ priceId: priceId, quantity: 1 }],
        customer: { email: userEmail },
        settings: {
            displayMode: 'overlay',
            theme: 'dark'
        }
    });
};

// Search
document.getElementById('searchContent')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const posts = window.allPosts || [];

    const filtered = posts.filter(item =>
        (item.content || '').toLowerCase().includes(query) ||
        (item.prompt || '').toLowerCase().includes(query)
    );
    renderLibrary(filtered);
});

// 5. Charts
function createCharts() {
    // Performance Chart
    const ctxPerf = document.getElementById('performanceChart')?.getContext('2d');
    if (ctxPerf) {
        new Chart(ctxPerf, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Engagement',
                    data: [12, 19, 3, 5, 2, 3, 15], // Placeholder data
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    }

    // Platform Chart
    const ctxPlat = document.getElementById('platformChart')?.getContext('2d');
    if (ctxPlat) {
        new Chart(ctxPlat, {
            type: 'doughnut',
            data: {
                labels: ['Twitter', 'LinkedIn', 'Instagram'],
                datasets: [{
                    data: [55, 30, 15], // Placeholder data
                    backgroundColor: ['#1DA1F2', '#0077B5', '#E1306C'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
            }
        });
    }
}
