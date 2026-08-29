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

export function parseFlexibleDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;
  if (typeof dateStr !== 'string') dateStr = String(dateStr);
  dateStr = dateStr.trim();
  if (!dateStr) return null;

  // 1. Check standard YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = dateStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const d = new Date(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10) - 1, parseInt(isoMatch[3], 10));
    if (!isNaN(d.getTime())) return d;
  }

  // 2. Check DD/MM/YYYY or MM/DD/YYYY or DD-MM-YYYY
  const slashMatch = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (slashMatch) {
    const num1 = parseInt(slashMatch[1], 10);
    const num2 = parseInt(slashMatch[2], 10);
    const year = parseInt(slashMatch[3], 10);

    // If num1 > 12, it MUST be day (DD/MM/YYYY)
    if (num1 > 12) {
      const d = new Date(year, num2 - 1, num1);
      if (!isNaN(d.getTime())) return d;
    }
    // If num2 > 12, it MUST be day (MM/DD/YYYY)
    else if (num2 > 12) {
      const d = new Date(year, num1 - 1, num2);
      if (!isNaN(d.getTime())) return d;
    } else {
      // Both <= 12. Default to DD/MM/YYYY (Indonesian standard)
      const d = new Date(year, num2 - 1, num1);
      if (!isNaN(d.getTime())) return d;
    }
  }

  // 3. Native fallback
  const native = new Date(dateStr);
  return isNaN(native.getTime()) ? null : native;
}

export function formatIndonesianDate(dateInput, options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) {
  const d = parseFlexibleDate(dateInput);
  if (!d) return dateInput || '-';
  try {
    return d.toLocaleDateString('id-ID', options);
  } catch(e) {
    return dateInput || '-';
  }
}

export function toISODateString(dateInput) {
  const d = parseFlexibleDate(dateInput);
  if (!d) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

