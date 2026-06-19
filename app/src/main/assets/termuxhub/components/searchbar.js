/*
 * TermuxHub Search Bar Component
 */

window.SearchbarComponent = {
    render: function(placeholder = "Search commands or keywords...", inputId = "search-input-field") {
        return `
            <div class="searchbar-wrapper">
                <input type="text" id="${inputId}" class="searchbar-input testTag_global_search_input" placeholder="${placeholder}" autocomplete="off" spellcheck="false">
                <span class="searchbar-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </span>
            </div>
        `;
    },
    
    bindEvents: function(inputId, onTyping) {
        const inputElement = document.getElementById(inputId);
        if (inputElement && typeof onTyping === 'function') {
            inputElement.addEventListener('input', function(e) {
                onTyping(e.target.value);
            });
        }
    }
};
