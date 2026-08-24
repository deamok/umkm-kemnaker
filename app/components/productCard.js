import { formatRupiah, truncate, getCategoryLabel, getCategoryEmoji, escapeHtml } from '../utils.js';
import Store from '../store.js';

export function renderProductCard(product, seller) {

  const gradients = {
    makanan: 'linear-gradient(135deg, #fef3c7, #fee2e2)',
    minuman: 'linear-gradient(135deg, #ccfbf1, #dbeafe)',
    kerajinan: 'linear-gradient(135deg, #ede9fe, #fae8ff)',
    lainnya: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)'
  };

  const bg = gradients[product.category] || gradients.lainnya;
  const emoji = product.image || getCategoryEmoji(product.category);

  const isBase64 = product.image && product.image.startsWith('data:image');
  const imageHtml = isBase64 
    ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">`
    : `<span class="product-emoji">${emoji}</span>`;

  const statusBadge = product.status === 'po' 
    ? `<span class="card-badge" style="background-color: var(--warning); color: white; right: 10px; top: 10px;">PRE-ORDER</span>` 
    : '';

  return `
    <div class="product-card card" onclick="window.location.hash='#/product/${product.id}'" style="position: relative;">
      <div class="product-image-placeholder" style="background:${isBase64 ? '#fff' : bg}; overflow: hidden;">
        ${imageHtml}
      </div>
      ${statusBadge}
      <div class="product-info">
        <h3 class="product-name" style="margin-bottom: 4px;">${truncate(product.name, 30)}</h3>
        <div class="flex justify-between items-center mb-2" style="display: flex; justify-content: space-between; align-items: center;">
          <p class="product-price" style="margin-bottom: 0;">${formatRupiah(product.price)} <span style="font-size: 0.75rem; color: #6b7280; font-weight: normal;">/ ${escapeHtml(product.unit || 'pcs')}</span></p>
          <span style="font-size: 0.65rem; color: #9ca3af;">Terjual ${product.sold || 0}</span>
        </div>
        <div class="product-seller" style="margin-bottom: 0;">
          <i data-lucide="store" style="width:14px;height:14px;"></i>
          <span>${seller?.warungName || seller?.name || 'Anonim'}</span>
        </div>
      </div>
    </div>
  `;
}
