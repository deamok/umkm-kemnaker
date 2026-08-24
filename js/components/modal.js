export function showModal({title, content, confirmText = 'Ya', cancelText = 'Batal', onConfirm, showCancel = true}) {
  let container = document.getElementById('modal-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'modal-container';
    document.body.appendChild(container);
  }
  
  container.innerHTML = `
    <div class="modal-overlay" id="modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(3px);z-index:9998;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease-out;">
      <div class="modal-content scale-in" style="background:white;border-radius:12px;width:90%;max-width:450px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);overflow:hidden;animation:modalScale 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
        <div class="modal-header" style="padding:16px 20px;border-bottom:1px solid #f3f4f6;display:flex;justify-content:space-between;align-items:center;">
          <h3 style="margin:0;font-size:1.25rem;color:#111827;">${title}</h3>
          <button class="btn btn-icon modal-close-btn" style="background:none;border:none;cursor:pointer;color:#6b7280;padding:4px;border-radius:4px;"><i data-lucide="x"></i></button>
        </div>
        <div class="modal-body" style="padding:20px;color:#4b5563;font-size:1rem;line-height:1.5;">${content}</div>
        <div class="modal-footer" style="padding:16px 20px;border-top:1px solid #f3f4f6;display:flex;justify-content:flex-end;gap:12px;background:#f9fafb;">
          ${showCancel ? `<button class="btn btn-secondary" id="modal-cancel" style="padding:8px 16px;border:1px solid #d1d5db;background:white;color:#374151;border-radius:6px;cursor:pointer;font-weight:500;transition:background 0.2s;">${cancelText}</button>` : ''}
          <button class="btn btn-primary" id="modal-confirm" style="padding:8px 16px;border:none;background:#6c5ce7;color:white;border-radius:6px;cursor:pointer;font-weight:500;transition:background 0.2s;">${confirmText}</button>
        </div>
      </div>
    </div>
  `;
  
  if (!document.getElementById('modal-styles')) {
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.innerHTML = `
      @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      @keyframes modalScale { from { transform:scale(0.9); opacity:0; } to { transform:scale(1); opacity:1; } }
      #modal-cancel:hover { background: #f3f4f6 !important; }
      #modal-confirm:hover { background: #5b4bc4 !important; }
      .modal-close-btn:hover { background: #f3f4f6 !important; color: #111827 !important; }
    `;
    document.head.appendChild(style);
  }

  if (window.lucide) lucide.createIcons({nodes: [container]});
  
  // Event listeners
  container.querySelector('#modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
  });
  container.querySelector('.modal-close-btn')?.addEventListener('click', closeModal);
  container.querySelector('#modal-cancel')?.addEventListener('click', closeModal);
  container.querySelector('#modal-confirm')?.addEventListener('click', () => {
    if (onConfirm) onConfirm();
    closeModal();
  });
}

export function closeModal() {
  const container = document.getElementById('modal-container');
  if (container) container.innerHTML = '';
}
