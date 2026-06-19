/*
 * TermuxHub Tool Card (Row) Component
 */

window.ToolCardComponent = {
    render: function(tool) {
        // Render simple chevron indicator
        const actionHtml = `
            <div class="tool-card-action">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </div>
        `;

        return `
            <div class="tool-card testTag_tool_card_${tool.id}" data-tool-id="${tool.id}">
                <div class="tool-card-main">
                    <span class="tool-card-title">${tool.name}</span>
                    <span class="tool-card-excerpt">${tool.command ? tool.command : 'Inspect repository metadata'}</span>
                </div>
                ${actionHtml}
            </div>
        `;
    },
    
    bindEvents: function(onCardClick) {
        document.querySelectorAll('.tool-card[data-tool-id]').forEach(el => {
            el.addEventListener('click', function() {
                const toolId = this.getAttribute('data-tool-id');
                if (toolId && typeof onCardClick === 'function') {
                    onCardClick(toolId);
                }
            });
        });
    }
};
