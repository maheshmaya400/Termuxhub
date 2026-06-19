/*
 * TermuxHub - Primary JavaScript Controller (SPA Engine)
 * Author: Maya
 * Tagline: Learn • Install • Build
 */

// Global App State
const AppState = {
    activeScreen: 'splash',
    navStack: [],
    categories: [],
    tools: [],
    currentCategoryId: null,
    currentToolId: null,
    searchQuery: '',
    userData: null,
    
    // Tracking active async call callbacks
    aiCallbacks: {}
};

// Embedded Fallback Templates (Ensures app is 100% offline-ready and unbreakable in any WebView setup)
const BackupTemplates = {
    splash: `
        <div class="screen no-navbar active" id="view-splash">
            <div class="splash-bg splash-content">
                <div class="brand-icon-wrapper">
                    <div class="brand-icon-halo"></div>
                    <svg class="brand-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#7C4DFF" stroke-width="2" stroke-dasharray="10 5" opacity="0.6"/>
                        <circle cx="50" cy="50" r="34" fill="none" stroke="#00E5FF" stroke-width="1.5" stroke-dasharray="35 15"/>
                        <circle cx="50" cy="50" r="24" fill="rgba(124, 77, 255, 0.2)" />
                        <path d="M38 38 L48 50 L38 62 M51 60 L64 60" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <h1 class="brand-title glow-text">TermuxHub</h1>
                <p class="brand-tagline">Learn • Install • Build</p>
                <div class="brand-footer">Built with ❤️ by Maya</div>
            </div>
        </div>
    `,
    
    disclaimer: `
        <div class="screen no-navbar" id="view-disclaimer">
            <div class="splash-bg" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 0;">
                <div class="disclaimer-card" style="margin-top: auto; margin-bottom: auto;">
                    <div class="disclaimer-header">
                        <span class="warning-icon">⚠️</span>
                        <h2 class="disclaimer-title">Educational Use Only</h2>
                    </div>
                    <div class="disclaimer-scroller">
                        <p class="disclaimer-paragraph">
                            Welcome to <strong>TermuxHub</strong>. This platform is designed solely as an educational directory for understanding Unix commands, terminal administration, and local package workflows.
                        </p>
                        <ul class="disclaimer-bullets">
                            <li>This app is for learning Termux, Linux, open-source tools, and safe command usage.</li>
                            <li>Use commands only on systems and devices you own or have explicit permission to test.</li>
                            <li>Networking, OSINT, Information Gathering, and Web Security Learning are strictly educational categories.</li>
                            <li>Do not use this app for illegal or harmful activities.</li>
                        </ul>
                    </div>
                    <label class="disclaimer-acceptance" id="disclaimer-trigger">
                        <input type="checkbox" id="chk-accept">
                        <span>I have read and understood.</span>
                    </label>
                    <button id="btn-accept" class="btn btn-primary" disabled>I Understand</button>
                </div>
                <div class="brand-footer" style="text-align: center; padding-bottom: 8px;">Built with ❤️ by Maya</div>
            </div>
        </div>
    `,
    
    login: `
        <div class="screen no-navbar" id="view-login">
            <div class="splash-bg" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 0;">
                <div class="login-title-wrapper">
                    <div class="brand-icon-wrapper" style="margin: 0 auto 16px auto;">
                        <div class="brand-icon-halo"></div>
                        <svg class="brand-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="38" fill="none" stroke="#7C4DFF" stroke-width="2" stroke-dasharray="10 5" opacity="0.6"/>
                            <circle cx="50" cy="50" r="30" fill="none" stroke="#00E5FF" stroke-width="1.5" stroke-dasharray="25 15"/>
                            <path d="M40 40 L48 50 L40 60 M51 58 L62 58" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h2 class="brand-title" style="font-size: 2.1rem; margin-bottom: 4px;">TermuxHub</h2>
                    <p class="brand-tagline" style="font-size: 0.85rem; letter-spacing: 2px;">Access Directory</p>
                </div>
                <div class="login-options">
                    <button id="btn-login-google" class="btn btn-google">Continuing with Google</button>
                    <div class="or-divider">Or</div>
                    <button id="btn-login-guest" class="btn btn-guest">Continue as Guest</button>
                </div>
                <div class="brand-footer" style="text-align: center; padding-bottom: 8px;">Built with ❤️ by Maya</div>
            </div>
        </div>
    `,
    
    home: `
        <div class="screen" id="view-home">
            <div class="screen-header">
                <div class="header-meta">
                    <span class="header-label">Learn • Install • Build</span>
                    <h2 class="header-heading">TermuxHub</h2>
                </div>
                <div class="header-action" id="header-search-trigger">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
            </div>
            <div class="screen-scroller">
                <div id="home-search-container"></div>
                <div id="fdroid-notice-banner" class="category-card" style="flex-direction: row; align-items: center; border-color: var(--secondary); background: rgba(0, 229, 255, 0.05); margin-bottom: 24px; padding: 16px;">
                    <div class="category-badge" style="background: rgba(0, 229, 255, 0.1); width: 40px; height: 40px; font-size: 1.3rem;">📲</div>
                    <div style="flex-grow: 1; min-width: 0; padding-left: 14px;">
                        <h4 style="font-size: 0.9rem; font-weight: 800; color: var(--secondary)">Install Termux correctly</h4>
                        <p style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.3; margin-top:2px;">Google Play updates are discontinued. Download solely from <strong>F-Droid</strong>.</p>
                    </div>
                    <span style="font-size: 1rem; color: var(--secondary)">➜</span>
                </div>
                <h3 class="copiable-label" style="margin-bottom: 16px; font-size: 0.85rem;">Learning Modules</h3>
                <div class="categories-grid" id="categories-list-target"></div>
                <div style="margin-top: 24px;">
                    <h3 class="copiable-label" style="margin-bottom: 12px; font-size: 0.85rem;">Quick Panels</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
                        <div class="tool-card" id="subpanel-favorites" style="padding: 12px 16px;">
                            <div style="display: flex; align-items: center; gap: 10px;"><span>⭐</span><span style="font-size: 0.85rem; font-weight: 700;">Favorites</span></div>
                        </div>
                        <div class="tool-card" id="subpanel-recent" style="padding: 12px 16px;">
                            <div style="display: flex; align-items: center; gap: 10px;"><span>🕒</span><span style="font-size: 0.85rem; font-weight: 700;">Recent</span></div>
                        </div>
                    </div>
                </div>
                <div class="brand-footer" style="text-align: center;">Built with ❤️ by Maya</div>
            </div>
        </div>
    `,
    
    category: `
        <div class="screen" id="view-category">
            <div class="back-navigation">
                <button class="btn-back"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                <span class="nav-title" id="category-view-title">Category</span>
            </div>
            <div class="screen-scroller">
                <div id="category-warning-banner" class="warning-banner hidden">
                    <span class="warning-icon">⚠️</span>
                    <div class="warning-text" id="category-warning-text">Security configurations overview.</div>
                </div>
                <div id="category-search-container"></div>
                <h3 class="copiable-label" style="margin-bottom: 16px; font-size: 0.85rem;" id="category-list-label">Available Commands</h3>
                <div class="tools-list" id="category-tools-list-target"></div>
                <div class="brand-footer" style="text-align: center;">Built with ❤️ by Maya</div>
            </div>
        </div>
    `,
    
    tool: `
        <div class="screen" id="view-tool">
            <div class="back-navigation">
                <button class="btn-back"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                <span class="nav-title" id="tool-view-title">Command Tool</span>
            </div>
            <div class="screen-scroller">
                <div class="tool-detail-badge" id="tool-view-category-badge">🚀 Getting Started</div>
                <h2 class="tool-detail-name" id="tool-view-name">Update Packages</h2>
                <p class="tool-detail-desc" id="tool-view-desc">Standard update descriptor.</p>
                <div class="copiable-section" id="tool-command-card-wrapper">
                    <span class="copiable-label">Utility syntax</span>
                    <div class="terminal-box">
                        <div class="terminal-header">
                            <div class="terminal-dot red"></div><div class="terminal-dot yellow"></div><div class="terminal-dot green"></div>
                        </div>
                        <div class="terminal-snippet">
                            <span class="terminal-indicator">$</span>
                            <code class="terminal-command" id="tool-view-command">pkg update</code>
                        </div>
                        <button class="btn-copy" id="btn-copy-command">Copy syntax</button>
                    </div>
                </div>
                <div id="tool-warning-banner" class="warning-banner hidden" style="margin-top: 16px; margin-bottom: 24px;">
                    <span class="warning-icon">🛡️</span><div class="warning-text" id="tool-warning-text">Review code carefully.</div>
                </div>
                <div class="info-section hidden" id="tool-extra-guidance-card">
                    <h4 class="info-title" id="tool-guidance-title">How To Run</h4>
                    <div class="info-content" id="tool-guidance-content">Command parameters.</div>
                </div>
                <div class="tool-actions-toolbar">
                    <button class="btn-favorite-action" id="btn-favorite-toggle">Add to Favorites</button>
                </div>
                <div class="ai-explainer-section">
                    <div class="ai-header-bar">
                        <h4 class="ai-title">Gemini Explainer</h4>
                        <span class="ai-badge">Flash 3.5 AI</span>
                    </div>
                    <p class="ai-description">Ask Gemini to translate parameters, supply usage details or troubleshooting.</p>
                    <div class="ai-prompt-box">
                        <input type="text" id="ai-custom-prompt-input" class="ai-input" placeholder="e.g. Explain this command line-by-line...">
                        <button class="btn-ai-send" id="btn-ask-ai">Ask</button>
                    </div>
                    <div class="ai-response-box" id="ai-response-viewport">
                        <div class="ai-response-text" id="ai-response-text-container">Awaiting prompt.</div>
                    </div>
                </div>
                <div class="brand-footer" style="text-align: center;">Built with ❤️ by Maya</div>
            </div>
        </div>
    `,
    
    favorites: `
        <div class="screen" id="view-favorites">
            <div class="screen-header">
                <div class="header-meta">
                    <span class="header-label">Your Bookmarks</span>
                    <h2 class="header-heading">Favorites</h2>
                </div>
                <div class="header-action" id="btn-clear-favorites">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </div>
            </div>
            <div class="screen-scroller">
                <div id="favorites-search-container"></div>
                <div class="tools-list" id="favorites-list-target"></div>
                <div class="empty-state hidden" id="favorites-empty-view">
                    <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--text-muted); opacity:0.35;"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"></polygon></svg>
                    <p class="empty-text">No bookmarked commands yet. Save from any command screen for offline access.</p>
                </div>
                <div class="brand-footer" style="text-align: center;">Built with ❤️ by Maya</div>
            </div>
        </div>
    `,
    
    settings: `
        <div class="screen" id="view-settings">
            <div class="screen-header">
                <div class="header-meta">
                    <span class="header-label">Configurations</span>
                    <h2 class="header-heading">Settings</h2>
                </div>
            </div>
            <div class="screen-scroller">
                <div class="profile-card" id="user-profile-widget">
                    <div class="profile-fallback" id="profile-pic-container">U</div>
                    <div class="profile-details">
                        <span class="profile-name" id="profile-name-label">Guest Navigator</span>
                        <span class="profile-email" id="profile-email-label">Offline sandbox session</span>
                    </div>
                </div>
                <span class="settings-group-title">Preferences</span>
                <div class="settings-group">
                    <div class="settings-row">
                        <div class="settings-info"><span class="settings-label">Dark Mode First</span><span class="settings-desc">Keep terminal interface cards optimized.</span></div>
                        <label class="switch"><input type="checkbox" checked disabled><span class="slider"></span></label>
                    </div>
                    <div class="settings-row">
                        <div class="settings-info"><span class="settings-label">Security Alerts</span><span class="settings-desc">Notify before high-risk commands.</span></div>
                        <label class="switch"><input type="checkbox" id="cfg-notifications" checked><span class="slider"></span></label>
                    </div>
                    <div class="settings-row">
                        <div class="settings-info"><span class="settings-label">Google Search Grounding</span><span class="settings-desc">Enables Gemini real-time web references.</span></div>
                        <label class="switch"><input type="checkbox" id="cfg-grounding" checked><span class="slider"></span></label>
                    </div>
                </div>
                <span class="settings-group-title">Storage Synchronization</span>
                <div class="settings-group">
                    <div class="settings-row" style="cursor:default;">
                        <div class="settings-info"><span class="settings-label">Sync status</span><span class="settings-desc" id="sync-status-text">Using local sandbox storage.</span></div>
                        <div id="sync-indicator-dot" style="width:12px; height:12px; border-radius:50%; background:#FFB300;"></div>
                    </div>
                    <div class="settings-row" id="row-clear-cache">
                        <div class="settings-info"><span class="settings-label">Clear local cache</span><span class="settings-desc">Wipe cached recently viewed logs.</span></div>
                        <span style="color:var(--secondary); font-size:0.8rem; font-weight:700;">RESET</span>
                    </div>
                </div>
                <button id="btn-settings-action" class="btn btn-glass" style="color: #FF5F56; border-color: rgba(255, 95, 86, 0.2); margin-top:24px;">Sign Out Session</button>
                <div class="brand-footer" style="text-align: center;">Built with ❤️ by Maya</div>
            </div>
        </div>
    `,
    
    about: `
        <div class="screen" id="view-about">
            <div class="screen-header">
                <div class="header-meta"><span class="header-label">Details</span><h2 class="header-heading">About</h2></div>
            </div>
            <div class="screen-scroller">
                <div class="about-hero-card">
                    <div class="about-logo-wrapper">
                        <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="none" stroke="#7C4DFF" stroke-width="2"/><circle cx="50" cy="50" r="28" fill="none" stroke="#00E5FF" stroke-width="1.5" stroke-dasharray="15 5"/><path d="M42 42 L50 50 L42 58 M52 56 L62 56" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/></svg>
                    </div>
                    <h3 class="about-app-name">TermuxHub</h3><span class="about-app-tagline">Learn • Install • Build</span>
                    <p class="about-info-text">TermuxHub is an Android companion handbook to help learn terminal tools safely on mobile.</p>
                </div>
                <div class="brand-footer" style="text-align: center;">Built with ❤️ by Maya</div>
            </div>
        </div>
    `
};

// Start routing and compile lists on launch
window.addEventListener('DOMContentLoaded', async () => {
    try {
        await initApplication();
    } catch (e) {
        console.error("Boot sequence failure:", e);
        showToast("Initialization error, starting local sandbox failover.", "error");
    }
});

async function initApplication() {
    // 1. Fetch Categories and Tools databases
    AppState.categories = await fetchJson('data/categories.json', []);
    AppState.tools = await fetchJson('data/tools.json', []);
    
    // 2. Wire and parse pages templates inside DOM
    await mountApplicationScreens();
    
    // 3. Initialize Firebase Auth modules and load databases references
    AuthModule.init((user) => {
        onUserLoginStateChanged(user);
    });
}

// Loads relative local JSON collections
async function fetchJson(path, fallbackValue) {
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error();
        return await res.json();
    } catch {
        console.warn(`Local JSON read failed for ${path}. Using native memory registers.`);
        return fallbackValue;
    }
}

// Renders page templates into #app-container sequentially
async function mountApplicationScreens() {
    const appContainer = document.getElementById('app-container');
    appContainer.innerHTML = ''; // Wipe loader
    
    const pages = ['splash', 'disclaimer', 'login', 'home', 'category', 'tool', 'favorites', 'settings', 'about'];
    
    for (let page of pages) {
        let htmlContent = "";
        try {
            const response = await fetch(`pages/${page}.html`);
            if (response.ok) {
                htmlContent = await response.text();
            } else {
                throw new Error();
            }
        } catch {
            htmlContent = BackupTemplates[page];
        }
        
        // Append as temporary DOM wrapper
        const dummy = document.createElement('div');
        dummy.innerHTML = htmlContent;
        const actualScreenNode = dummy.firstElementChild;
        appContainer.appendChild(actualScreenNode);
    }
    
    // Render dynamic static navbar component as children of the app-container
    const navDiv = document.createElement('div');
    navDiv.id = 'bottom-navbar-component';
    navDiv.innerHTML = NavbarComponent.render('home');
    appContainer.appendChild(navDiv);
    
    // Bind navigation buttons inside navbar
    NavbarComponent.bindEvents((tabId) => {
        navigateTo(tabId);
    });
    
    // Initiate onboarding flow delays
    runOnboardingSplashTimer();
}

function runOnboardingSplashTimer() {
    setTimeout(() => {
        const hasAccepted = localStorage.getItem('termuxhub_accepted_disclaimer');
        if (hasAccepted === 'true') {
            const hasUserSession = localStorage.getItem('termux_mock_user') || AuthModule.currentUser;
            if (hasUserSession) {
                navigateTo('home');
            } else {
                navigateTo('login');
            }
        } else {
            navigateTo('disclaimer');
        }
    }, 2800); // Perfect cinematic onboarding pause
}

// Central UI router navigate transitions
function navigateTo(screenId, direction = 'forward') {
    const destinationView = document.getElementById(`view-${screenId}`);
    if (!destinationView) {
        console.error(`Navigation fault. Destination screenId '${screenId}' does not belong to active registers.`);
        return;
    }
    
    // Toggle active markers on ALL matching screens
    document.querySelectorAll('.screen').forEach(el => {
        el.classList.remove('active');
    });
    destinationView.classList.add('active');
    
    AppState.activeScreen = screenId;
    
    // Toggle bottom navbar visibility (hidden on Splash, login, disclaimer page scopes)
    const navBarNode = document.getElementById('bottom-navbar-component');
    if (screenId === 'splash' || screenId === 'login' || screenId === 'disclaimer') {
        navBarNode.classList.add('hidden');
    } else {
        navBarNode.classList.remove('hidden');
        
        // Match active tabs visually inside Navbar
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.remove('active');
            const dataTab = el.getAttribute('data-nav');
            if (dataTab === screenId) {
                el.classList.add('active');
            }
        });
    }
    
    // Invoke screen context drawing systems
    onScreenRendered(screenId);
}

// Coordinates rendering events after sliding views
function onScreenRendered(screenId) {
    if (screenId === 'disclaimer') {
        configureDisclaimerHandlers();
    }
    else if (screenId === 'login') {
        configureLoginHandlers();
    }
    else if (screenId === 'home') {
        drawMainHomeScreen();
    }
    else if (screenId === 'category') {
        drawCategoryScreen();
    }
    else if (screenId === 'tool') {
        drawToolScreen();
    }
    else if (screenId === 'favorites') {
        drawFavoritesScreen();
    }
    else if (screenId === 'settings') {
        drawSettingsScreen();
    }
}

// -------------------------------------
// SCREEN LOGIC IMPLEMENTATIONS
// -------------------------------------

function configureDisclaimerHandlers() {
    const chk = document.getElementById('chk-accept');
    const btn = document.getElementById('btn-accept');
    
    if (chk && btn) {
        chk.addEventListener('change', function() {
            btn.disabled = !this.checked;
        });
        
        btn.addEventListener('click', function() {
            localStorage.setItem('termuxhub_accepted_disclaimer', 'true');
            navigateTo('login');
        });
    }
}

function configureLoginHandlers() {
    const btnGoogle = document.getElementById('btn-login-google');
    const btnGuest = document.getElementById('btn-login-guest');
    
    if (btnGoogle) {
        btnGoogle.onclick = async () => {
            showToast("Connecting with Google...", "info");
            try {
                const user = await AuthModule.signInWithGoogle();
                if (user) {
                    showToast(`Logged in successfully!`, "success");
                    navigateTo('home');
                }
            } catch (e) {
                showToast("Google authentication failed. Continuing offline as Guest.", "error");
                await AuthModule.signInAsGuest();
                navigateTo('home');
            }
        };
    }
    
    if (btnGuest) {
        btnGuest.onclick = async () => {
            showToast("Opening guest playground...", "success");
            await AuthModule.signInAsGuest();
            navigateTo('home');
        };
    }
}

async function onUserLoginStateChanged(user) {
    const uid = user ? user.uid : null;
    await FirestoreModule.loadUserData(uid);
    
    if (AppState.activeScreen === 'settings') {
        drawSettingsScreen();
    }
}

function drawMainHomeScreen() {
    // 1. Mount Home Search Container
    const searchTarget = document.getElementById('home-search-container');
    if (searchTarget) {
        searchTarget.innerHTML = SearchbarComponent.render("Search all commands...");
        SearchbarComponent.bindEvents("search-input-field", (query) => {
            AppState.searchQuery = query;
            runGlobalHomeFiltering();
        });
    }
    
    // 2. Render Categories items in Grid
    renderCategoriesGrid();
    
    // 3. Bind Quick Panels click actions
    const panelFav = document.getElementById('subpanel-favorites');
    const panelRec = document.getElementById('subpanel-recent');
    
    if (panelFav) {
        panelFav.onclick = () => navigateTo('favorites');
    }
    if (panelRec) {
        panelRec.onclick = () => {
            // Just filter home by recent or navigate there
            showToast("Opening recently viewed list...", "info");
            navigateTo('favorites'); // Fallback list shares favorites screen or setting screens
        };
    }
    
    // Bind F-Droid banner to website
    const fdroid = document.getElementById('fdroid-notice-banner');
    if (fdroid) {
        fdroid.onclick = () => {
            window.open('https://f-droid.org/packages/com.termux/', '_blank');
        };
    }
}

function renderCategoriesGrid() {
    const target = document.getElementById('categories-list-target');
    if (!target) return;
    
    target.innerHTML = '';
    AppState.categories.forEach(cat => {
        // Find matching count
        const toolCount = AppState.tools.filter(t => t.categoryId === cat.id).length;
        
        const dummy = document.createElement('div');
        dummy.innerHTML = CategoryCardComponent.render(cat, toolCount);
        const cardNode = dummy.firstElementChild;
        target.appendChild(cardNode);
    });
    
    // Bind click listeners on loaded card nodes
    CategoryCardComponent.bindEvents((catId) => {
        AppState.currentCategoryId = catId;
        navigateTo('category');
    });
}

function runGlobalHomeFiltering() {
    const query = AppState.searchQuery.trim().toLowerCase();
    const target = document.getElementById('categories-list-target');
    if (!target) return;
    
    if (!query) {
        renderCategoriesGrid();
        return;
    }
    
    // Filter tools matching query and render lists instead of category grid
    const filteredTools = AppState.tools.filter(t => {
        return t.name.toLowerCase().includes(query) || 
               (t.command && t.command.toLowerCase().includes(query)) ||
               t.description.toLowerCase().includes(query);
    });
    
    if (filteredTools.length === 0) {
        target.innerHTML = `
            <div class="empty-state" style="grid-column: span 2; padding: 24px;">
                <span class="empty-icon">🔍</span>
                <p class="empty-text">No command matches your coordinates. Try another keyword!</p>
            </div>
        `;
        return;
    }
    
    target.innerHTML = '';
    filteredTools.forEach(tool => {
        const dummy = document.createElement('div');
        dummy.innerHTML = ToolCardComponent.render(tool);
        const cardNode = dummy.firstElementChild;
        target.appendChild(cardNode);
    });
    
    ToolCardComponent.bindEvents((toolId) => {
        AppState.currentToolId = toolId;
        navigateTo('tool');
    });
}

function drawCategoryScreen() {
    const catId = AppState.currentCategoryId;
    const category = AppState.categories.find(c => c.id === catId);
    if (!category) return;
    
    // Title
    document.getElementById('category-view-title').innerText = `${category.icon} ${category.name}`;
    
    // Warning banner toggling
    const warningBanner = document.getElementById('category-warning-banner');
    const warningText = document.getElementById('category-warning-text');
    
    if (category.warning) {
        warningBanner.classList.remove('hidden');
        warningText.innerText = category.warning;
    } else {
        warningBanner.classList.add('hidden');
    }
    
    // Searchbar
    const searchTarget = document.getElementById('category-search-container');
    if (searchTarget) {
        searchTarget.innerHTML = SearchbarComponent.render(`Search in ${category.name}...`, "category-search-input");
        SearchbarComponent.bindEvents("category-search-input", (value) => {
            filterCategoryToolsList(value);
        });
    }
    
    // Tools list
    renderCategoryToolsList("");
    
    // Wire back button
    document.querySelector('.testTag_category_back_button').onclick = () => {
        navigateTo('home');
    };
}

function renderCategoryToolsList(queryFilter = "") {
    const catId = AppState.currentCategoryId;
    const target = document.getElementById('category-tools-list-target');
    if (!target) return;
    
    const query = queryFilter.trim().toLowerCase();
    const catTools = AppState.tools.filter(t => t.categoryId === catId && 
        (query === "" || t.name.toLowerCase().includes(query) || (t.command && t.command.toLowerCase().includes(query)))
    );
    
    if (catTools.length === 0) {
        target.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📂</span>
                <p class="empty-text">No tools matches the search query details.</p>
            </div>
        `;
        return;
    }
    
    target.innerHTML = '';
    catTools.forEach(tool => {
        const dummy = document.createElement('div');
        dummy.innerHTML = ToolCardComponent.render(tool);
        const cardNode = dummy.firstElementChild;
        target.appendChild(cardNode);
    });
    
    ToolCardComponent.bindEvents((toolId) => {
        AppState.currentToolId = toolId;
        navigateTo('tool');
    });
}

function filterCategoryToolsList(value) {
    renderCategoryToolsList(value);
}

function drawToolScreen() {
    const toolId = AppState.currentToolId;
    const tool = AppState.tools.find(t => t.id === toolId);
    if (!tool) return;
    
    const cat = AppState.categories.find(c => c.id === tool.categoryId);
    
    // Populate parameters
    document.getElementById('tool-view-title').innerText = tool.name;
    document.getElementById('tool-view-category-badge').innerText = `${cat ? cat.icon : '🛠️'} ${cat ? cat.name : 'Unknown'}`;
    document.getElementById('tool-view-name').innerText = tool.name;
    document.getElementById('tool-view-desc').innerText = tool.description;
    
    // Command terminal configuration
    const cmdField = document.getElementById('tool-view-command');
    const cardWrapper = document.getElementById('tool-command-card-wrapper');
    
    if (tool.command) {
        cardWrapper.style.display = 'block';
        cmdField.innerText = tool.command;
    } else {
        // This is a dynamic placeholder or code repo only
        cardWrapper.style.display = 'none';
    }
    
    // Warning blocks
    const warnBanner = document.getElementById('tool-warning-banner');
    const warnText = document.getElementById('tool-warning-text');
    if (tool.warning) {
        warnBanner.classList.remove('hidden');
        warnText.innerText = tool.warning;
    } else {
        warnBanner.classList.add('hidden');
    }
    
    // Extra Guidance configs
    const docCard = document.getElementById('tool-extra-guidance-card');
    const docTitle = document.getElementById('tool-guidance-title');
    const docContent = document.getElementById('tool-guidance-content');
    
    if (tool.howToPlay) {
        docCard.classList.remove('hidden');
        docTitle.innerText = "🎮 Game Operation Rules";
        docContent.innerText = tool.howToPlay;
    } else if (tool.repository) {
        docCard.classList.remove('hidden');
        docTitle.innerText = "🔗 Trusted Repository Coordinates";
        docContent.innerHTML = `
            GitHub link: <a href="${tool.repository}" target="_blank" style="color:var(--secondary); text-decoration:underline; font-weight:700;">${tool.repository}</a><br><br>
            Clone directly in Termux using git command triggers loaded below!
        `;
    } else {
        docCard.classList.add('hidden');
    }
    
    // Render Favorite state bookmark
    updateFavoriteToggleButtonState();
    
    // Bind active triggers
    document.getElementById('btn-copy-command').onclick = () => {
        copyCommandToClipboard(tool.command);
    };
    
    document.getElementById('btn-favorite-toggle').onclick = async () => {
        const uid = AuthModule.currentUser ? AuthModule.currentUser.uid : null;
        const list = await FirestoreModule.toggleFavorite(uid, tool.id);
        const isFav = list.includes(tool.id);
        
        showToast(isFav ? "Saved to Favorites!" : "Removed from bookmarks.", "success");
        updateFavoriteToggleButtonState();
    };
    
    // Recents update register
    const userUid = AuthModule.currentUser ? AuthModule.currentUser.uid : null;
    FirestoreModule.addRecentView(userUid, tool.id);
    
    // Clean up inline AI response cards
    document.getElementById('ai-response-viewport').style.display = 'none';
    document.getElementById('ai-custom-prompt-input').value = "";
    
    // Ask Gemini click registrations
    document.getElementById('btn-ask-ai').onclick = () => {
        triggerGeminiInferenceCall(tool);
    };
    
    // Keyboard return key trigger
    document.getElementById('ai-custom-prompt-input').onkeydown = (e) => {
        if (e.key === 'Enter') {
            triggerGeminiInferenceCall(tool);
        }
    };
    
    // Wire back button
    document.querySelector('.testTag_tool_back_button').onclick = () => {
        // Safely navigate back to prior category screeen or fallback
        if (AppState.currentCategoryId) {
            navigateTo('category');
        } else {
            navigateTo('home');
        }
    };
}

function updateFavoriteToggleButtonState() {
    const toolId = AppState.currentToolId;
    const isBookmarked = FirestoreModule.userDataCache.favorites.includes(toolId);
    const btn = document.getElementById('btn-favorite-toggle');
    const label = document.getElementById('btn-favorite-label');
    
    if (isBookmarked) {
        btn.classList.add('active');
        label.innerText = 'Inside Favorites';
    } else {
        btn.classList.remove('active');
        label.innerText = 'Add to Favorites';
    }
}

function copyCommandToClipboard(text) {
    if (!text) return;
    
    // Create standard mock element to execute legacy copying inside Webview container cleanly
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'absolute';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    
    try {
        document.execCommand('copy');
        showToast("Syntax copied to clipboard!", "success");
    } catch {
        showToast("Copy failure, please write manual selection.", "error");
    }
    document.body.removeChild(area);
}

// -------------------------------------
// INTELLIGENT GEMINI WORK HORSE PIPELINES
// -------------------------------------

function triggerGeminiInferenceCall(tool) {
    const inputField = document.getElementById('ai-custom-prompt-input');
    const viewPort = document.getElementById('ai-response-viewport');
    const textContainer = document.getElementById('ai-response-text-container');
    
    const userPrompt = inputField.value.trim();
    
    // Base prompts compiling
    const toolContext = `Tool Name: "${tool.name}", Description: "${tool.description}", Command Syntax: "${tool.command || "N/A"}"`;
    const finalPrompt = userPrompt !== "" 
        ? `${toolContext}. User queries: "${userPrompt}"` 
        : `Please explain this tool briefly: "${toolContext}". Break down individual parameters and suggest a common custom bash pipeline.`;
        
    // Reset view
    viewPort.style.display = 'block';
    textContainer.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px; color:var(--secondary)">
            <div class="spinner" style="width:20px; height:20px; border-width:2px;"></div>
            <span>Grounding coordinates via Gemini Flash...</span>
        </div>
    `;
    
    // Generate unique callback tracker ID
    const callbackId = "callback_" + Math.random().toString(36).substring(2, 11);
    const useSearch = document.getElementById('cfg-grounding') ? document.getElementById('cfg-grounding').checked : true;
    
    // Register tracker response
    AppState.aiCallbacks[callbackId] = {
        onSuccess: (text) => {
            displayMarkdownText(textContainer, text);
        },
        onError: (err) => {
            textContainer.innerHTML = `<span style="color:#FF5F56;">Failover execution trace: ${err}</span>`;
        }
    };
    
    // Call Android Javascript Bridge if configured
    if (window.GeminiBridge && typeof window.GeminiBridge.askGemini === 'function') {
        window.GeminiBridge.askGemini(finalPrompt, useSearch, callbackId);
    } else {
        // Fallback simulation when running inside standard PWA sandbox or Acode outside the APK
        console.warn("Native GeminiBridge missing. Launching offline sandbox generation simulation.");
        setTimeout(() => {
            const simulatedSummary = `
### Simulated Explanation for **${tool.name}**
This is a standard Termux learning environment. Because you are testing TermuxHub outside the Android container (e.g. inside a generic desktop browser), native Google-grounded inferences are mocked.

**Core Instruction Syntaxes:**
\`\`\`bash
$ ${tool.command || "git clone " + tool.repository}
\`\`\`

**Breakdown parameters:**
- \`pkg\`: Central android termux package manager query.
- \`install\`: Command option to unpack remote binaries safely.
- \`-y\`: Declares automatic affirmative answers to download size prompts.

*Sync the app into AI Studio APK container to unlock direct live conversations.*
            `;
            const cb = AppState.aiCallbacks[callbackId];
            if (cb) {
                cb.onSuccess(simulatedSummary);
                delete AppState.aiCallbacks[callbackId];
            }
        }, 1500);
    }
}

// Standard parsing helper to format Markdown basics beautifully inside DOM
function displayMarkdownText(container, rawText) {
    // Escape standard markdown highlights or tags
    let html = rawText;
    
    // Code blocks formatting
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
    
    // Inline code blocks formatting
    html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    
    // Headlines
    html = html.replace(/^### (.*$)/gim, '<h4 style="color:var(--secondary); font-size:1.1rem; margin:16px 0 8px 0; font-weight:800;">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 style="color:var(--secondary); font-size:1.2rem; margin:20px 0 10px 0; font-weight:800;">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 style="color:var(--secondary); font-size:1.3rem; margin:24px 0 12px 0; font-weight:800;">$1</h2>');
    
    // Bold styles
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:white; font-weight:700;">$1</strong>');
    
    // Bullet list conversions
    html = html.replace(/^\s*-\s+(.*)/gim, '<li style="margin-left:14px; font-size:0.85rem; color:var(--text-muted); margin-bottom:4px;">$1</li>');
    
    // Newlines mapping to paragraph partitions
    const paragraphs = html.split('\n\n').map(p => {
        if (p.trim().startsWith('<pre') || p.trim().startsWith('<h') || p.trim().startsWith('<li')) {
            return p;
        }
        return `<p style="margin-bottom:10px; font-size:0.85rem; line-height:1.5;">${p}</p>`;
    });
    
    container.innerHTML = paragraphs.join('');
}

// Global Callback receiver mapped to Android container WebView execution
window.onGeminiResponse = function(callbackId, textResponse, errorResponse) {
    const cb = AppState.aiCallbacks[callbackId];
    if (cb) {
        if (errorResponse) {
            cb.onError(errorResponse);
        } else {
            cb.onSuccess(textResponse);
        }
        delete AppState.aiCallbacks[callbackId];
    }
};

function drawFavoritesScreen() {
    // Render searchbar
    const searchTarget = document.getElementById('favorites-search-container');
    if (searchTarget) {
        searchTarget.innerHTML = SearchbarComponent.render("Search bookmarked commands...", "fav-search-input");
        SearchbarComponent.bindEvents("fav-search-input", (value) => {
            renderFavoritesList(value);
        });
    }
    
    renderFavoritesList("");
    
    // Handle Clear Button Click
    document.getElementById('btn-clear-favorites').onclick = () => {
        const uid = AuthModule.currentUser ? AuthModule.currentUser.uid : null;
        if (FirestoreModule.userDataCache.favorites.length === 0) {
            showToast("No bookmarks collected to wipe.", "error");
            return;
        }
        
        ModalComponent.show(
            "Wipe Favorites",
            "Are you completely sure you want to clear your bookmarked learning commands repository? This action cannot be undone.",
            "Wipe All", "Dismiss",
            async () => {
                await FirestoreModule.clearFavorites(uid);
                showToast("Favorites catalog wiped.", "success");
                drawFavoritesScreen();
            }
        );
    };
}

function renderFavoritesList(queryFilter = "") {
    const favsIds = FirestoreModule.userDataCache.favorites;
    const target = document.getElementById('favorites-list-target');
    const emptyView = document.getElementById('favorites-empty-view');
    
    if (!target) return;
    
    const query = queryFilter.trim().toLowerCase();
    const favTools = AppState.tools.filter(t => favsIds.includes(t.id) && 
        (query === "" || t.name.toLowerCase().includes(query) || (t.command && t.command.toLowerCase().includes(query)))
    );
    
    if (favTools.length === 0) {
        target.innerHTML = '';
        emptyView.classList.remove('hidden');
        return;
    }
    
    emptyView.classList.add('hidden');
    target.innerHTML = '';
    favTools.forEach(tool => {
        const dummy = document.createElement('div');
        dummy.innerHTML = ToolCardComponent.render(tool);
        const cardNode = dummy.firstElementChild;
        target.appendChild(cardNode);
    });
    
    ToolCardComponent.bindEvents((toolId) => {
        AppState.currentToolId = toolId;
        navigateTo('tool');
    });
}

function drawSettingsScreen() {
    const user = AuthModule.currentUser;
    const profilePic = document.getElementById('profile-pic-container');
    const nameLabel = document.getElementById('profile-name-label');
    const emailLabel = document.getElementById('profile-email-label');
    const actionBtn = document.getElementById('btn-settings-action');
    
    // Toggles mapping
    const toggleNotifications = document.getElementById('cfg-notifications');
    const toggleGrounding = document.getElementById('cfg-grounding');
    
    // Assign preferences bindings
    const cachedSettings = FirestoreModule.userDataCache.settings;
    if (toggleNotifications && toggleGrounding) {
        toggleNotifications.checked = cachedSettings.notifications !== false;
        toggleGrounding.checked = cachedSettings.grounding !== false;
        
        toggleNotifications.onchange = (e) => {
            const uid = user ? user.uid : null;
            FirestoreModule.updateSettings(uid, 'notifications', e.target.checked);
            showToast("Preferences written.", "success");
        };
        
        toggleGrounding.onchange = (e) => {
            const uid = user ? user.uid : null;
            FirestoreModule.updateSettings(uid, 'grounding', e.target.checked);
            showToast("Search Grounding toggled.", "success");
        };
    }
    
    // Sync states info
    const syncText = document.getElementById('sync-status-text');
    const syncDot = document.getElementById('sync-indicator-dot');
    
    if (useFirebase && user && user.uid !== "guest_session_anonymous") {
        syncText.innerText = "Synced with Google Cloud Firestore.";
        syncDot.style.backgroundColor = "#27C93F"; // Active green
    } else {
        syncText.innerText = "Offline sandbox mode (LocalStorage active)";
        syncDot.style.backgroundColor = "#FFB300"; // Caution alert yellow
    }
    
    // Profile widget mapping
    if (user) {
        if (user.photoURL && profilePic) {
            profilePic.innerHTML = `<img src="${user.photoURL}" class="profile-avatar" alt="Avatar">`;
            profilePic.classList.remove('profile-fallback');
        } else if (profilePic) {
            profilePic.innerText = user.displayName.substring(0, 1).toUpperCase();
            profilePic.classList.add('profile-fallback');
        }
        
        nameLabel.innerText = user.displayName;
        emailLabel.innerText = user.email;
        
        actionBtn.innerText = "Sign Out Session";
        actionBtn.style.color = "#FF5F56";
        actionBtn.style.borderColor = "rgba(255, 95, 86, 0.2)";
        
        actionBtn.onclick = () => {
            ModalComponent.show(
                "Sign Out",
                "Are you sure you want to end your signed-in cloud workspace parameters and return to the disclaimer page?",
                "Sign Out", "Stay",
                async () => {
                    await AuthModule.signOut();
                    showToast("Session terminated.", "info");
                    navigateTo('login');
                }
            );
        };
    } else {
        // Safe failover representation when running without login
        nameLabel.innerText = "Guest Voyager";
        emailLabel.innerText = "Offline learning mode";
        if (profilePic) {
            profilePic.innerText = "G";
        }
        actionBtn.innerText = "Access Dashboard";
        actionBtn.style.color = "var(--secondary)";
        actionBtn.style.borderColor = "rgba(0, 229, 255, 0.2)";
        actionBtn.onclick = () => navigateTo('login');
    }
    
    // Row Clear local cache
    document.getElementById('row-clear-cache').onclick = () => {
        const uid = user ? user.uid : null;
        ModalComponent.show(
            "Wipe Recents History",
            "Wipes cached terminal logs and recently viewed commands list history records. Your bookmarks will stay safe.",
            "Wipe Logs", "Dismiss",
            async () => {
                await FirestoreModule.clearRecentlyViewed(uid);
                showToast("Recently viewed registry cleared.", "success");
            }
        );
    };
}

// -------------------------------------
// GLOBAL TOASTS SYSTEM
// -------------------------------------
function showToast(message, type = "info") {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span style="font-size:1.1rem">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Trigger sliding animation frame delays
    setTimeout(() => toast.classList.add('show'), 50);
    
    // Wipe element completely
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 400);
    }, 2800);
}
