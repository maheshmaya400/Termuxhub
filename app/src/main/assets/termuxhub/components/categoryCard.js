/*
 * TermuxHub Category Card Component
 */

window.CategoryCardComponent = {
    render: function(category, toolCount = 0) {
        return `
            <div class="category-card testTag_category_card_${category.id}" data-category-id="${category.id}">
                <div class="category-badge">${category.icon}</div>
                <div class="category-name">${category.name}</div>
                <div class="category-info">${toolCount} command${toolCount !== 1 ? 's' : ''} available</div>
            </div>
        `;
    },
    
    bindEvents: function(onCardClick) {
        document.querySelectorAll('.category-card[data-category-id]').forEach(el => {
            el.addEventListener('click', function() {
                const categoryId = this.getAttribute('data-category-id');
                if (categoryId && typeof onCardClick === 'function') {
                    onCardClick(categoryId);
                }
            });
        });
    }
};
