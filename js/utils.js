export function formatRupiah(number) {
  return 'Rp ' + Number(number).toLocaleString('id-ID');
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function timeAgo(dateStr) {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  const intervals = [
    {label: 'tahun', seconds: 31536000},
    {label: 'bulan', seconds: 2592000},
    {label: 'minggu', seconds: 604800},
    {label: 'hari', seconds: 86400},
    {label: 'jam', seconds: 3600},
    {label: 'menit', seconds: 60}
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count} ${interval.label} lalu`;
  }
  return 'Baru saja';
}

export function truncate(str, len = 50) {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
}

export function showToast(message, type = 'info') {
  // Dispatches custom event that toast component listens to
  window.dispatchEvent(new CustomEvent('show-toast', {detail: {message, type}}));
}

export function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function getStatusLabel(status) {
  const labels = {
    pending: 'Menunggu Pembayaran',
    processing: 'Diproses',
    shipped: 'Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan'
  };
  return labels[status] || status;
}

export function getStatusClass(status) {
  return `order-status ${status}`;
}

export function getCategoryLabel(category) {
  const labels = {
    makanan: 'Makanan',
    minuman: 'Minuman',
    kerajinan: 'Kerajinan',
    lainnya: 'Lainnya'
  };
  return labels[category] || category;
}

export function getCategoryEmoji(category) {
  const emojis = {
    makanan: '🍜',
    minuman: '🥤',
    kerajinan: '🎨',
    lainnya: '📦'
  };
  return emojis[category] || '📦';
}
