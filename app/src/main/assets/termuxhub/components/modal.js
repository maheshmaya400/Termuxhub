/*
 * TermuxHub Modal Dialog Component
 * Mounts overlays dynamically into #modal-container
 */

window.ModalComponent = {
    show: function(title, message, confirmLabel = "Yes", cancelLabel = "Cancel", onConfirm, onCancel) {
        const container = document.getElementById('modal-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="modal-overlay" id="generic-modal-overlay">
                <div class="modal-card">
                    <h3 class="modal-headline">${title}</h3>
                    <p class="modal-message">${message}</p>
                    <div class="modal-actions">
                        <button class="btn btn-glass" id="btn-modal-cancel" style="padding:12px;">${cancelLabel}</button>
                        <button class="btn btn-primary" id="btn-modal-confirm" style="padding:12px;">${confirmLabel}</button>
                    </div>
                </div>
            </div>
        `;
        
        const overlay = document.getElementById('generic-modal-overlay');
        setTimeout(() => overlay.classList.add('active'), 10);
        
        // Cancel Action
        document.getElementById('btn-modal-cancel').addEventListener('click', function() {
            overlay.classList.remove('active');
            setTimeout(() => {
                container.innerHTML = '';
                if (typeof onCancel === 'function') onCancel();
            }, 300);
        });
        
        // Confirm Action
        document.getElementById('btn-modal-confirm').addEventListener('click', function() {
            overlay.classList.remove('active');
            setTimeout(() => {
                container.innerHTML = '';
                if (typeof onConfirm === 'function') onConfirm();
            }, 300);
        });
    }
};
