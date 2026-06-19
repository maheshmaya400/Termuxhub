/*
 * TermuxHub Navigation Bar Component
 */

window.NavbarComponent = {
    render: function(activeTabId) {
        const tabs = [
            { id: 'home', label: 'Hub', icon: '🚀' },
            { id: 'favorites', label: 'Favorites', icon: '⭐' },
            { id: 'settings', label: 'Settings', icon: '⚙️' },
            { id: 'about', label: 'About', icon: 'ℹ️' }
        ];

        let html = '<div class="navbar-wrapper">';
        
        tabs.forEach(tab => {
            const isActive = tab.id === activeTabId ? 'active' : '';
            html += `
                <div class="nav-item ${isActive} testTag_nav_${tab.id}" data-nav="${tab.id}">
                    <div class="nav-item-icon-container">
                        <span class="nav-item-icon">${tab.icon}</span>
                    </div>
                    <span>${tab.label}</span>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    },
    
    bindEvents: function(onTabClick) {
        document.querySelectorAll('.nav-item').forEach(el => {
            el.addEventListener('click', function() {
                const tabId = this.getAttribute('data-nav');
                if (tabId && typeof onTabClick === 'function') {
                    onTabClick(tabId);
                }
            });
        });
    }
};
