export function initToastContainer() {
  if (!document.getElementById('toast-container')) {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
    document.body.appendChild(container);
  }
  
  // Listen for custom event
  window.addEventListener('show-toast', (e) => {
    const {message, type} = e.detail;
    showToastNotification(message, type);
  });
}

export function showToastNotification(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6'
  };
  const color = colors[type] || colors.info;
  
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    background: white;
    border-left: 4px solid ${color};
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 12px 16px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 250px;
    max-width: 350px;
    pointer-events: auto;
    animation: slideInRight 0.3s ease-out forwards;
    transition: opacity 0.3s ease, transform 0.3s ease;
  `;
  
  toast.innerHTML = `
    <div class="toast-content" style="display:flex;align-items:center;gap:12px;">
      <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}" style="color:${color};width:20px;height:20px;flex-shrink:0;"></i>
      <span style="font-weight:500;color:#374151;font-size:0.9rem;line-height:1.4;">${message}</span>
    </div>
    <button class="toast-close" style="background:none;border:none;cursor:pointer;color:#9ca3af;padding:4px;margin-left:12px;" onclick="this.parentElement.style.opacity='0';this.parentElement.style.transform='translateX(100%)';setTimeout(()=>this.parentElement.remove(),300)">
      <i data-lucide="x" style="width:16px;height:16px;"></i>
    </button>
  `;
  
  container.appendChild(toast);
  
  if (window.lucide) lucide.createIcons({nodes: [toast]});
  
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => { if (toast.parentElement) toast.remove(); }, 300);
    }
  }, duration);
}

// Inject keyframes globally
if (!document.getElementById('toast-keyframes')) {
  const style = document.createElement('style');
  style.id = 'toast-keyframes';
  style.innerHTML = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}
