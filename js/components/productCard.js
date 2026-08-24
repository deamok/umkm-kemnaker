import { formatRupiah, truncate, getCategoryLabel, getCategoryEmoji } from '../utils.js';
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
      <span class="card-badge badge-${product.category}" style="${product.status === 'po' ? 'top: 40px;' : ''}">${getCategoryLabel(product.category)}</span>
      <div class="product-info">
        <h3 class="product-name">${truncate(product.name, 30)}</h3>
        <p class="product-price">${formatRupiah(product.price)}</p>
        <div class="product-seller">
          <i data-lucide="store" style="width:14px;height:14px;"></i>
          <span>${seller?.warungName || seller?.name || 'Anonim'}</span>
        </div>
      </div>
    </div>
  `;
}
