import Store from '../store.js';
import Auth from '../auth.js';
import Router from '../router.js';
import { formatRupiah, getCategoryLabel, getCategoryEmoji, showToast, escapeHtml } from '../utils.js';

export async function render(params) {
    const productId = params.id;
    const product = await Store.getProduct(productId);

    if (!product) {
        return `
            <div class="container py-20 text-center">
                <div class="text-6xl mb-4">😢</div>
                <h2 class="text-3xl font-bold mb-4">Produk Tidak Ditemukan</h2>
                <button class="btn btn-primary" onclick="window.history.back()">Kembali</button>
            </div>
        `;
    }

    const seller = await Store.getUser(product.sellerId);
    const lapak = await Store.getLapak(product.sellerId);
    const sellerName = lapak?.name || seller?.warungName || seller?.name || 'Penjual Tidak Dikenal';
    
    // Determine background based on category
    let bgGradient = 'linear-gradient(135deg, #636e72, #b2bec3)';
    if (product.category === 'makanan') bgGradient = 'linear-gradient(135deg, #e17055, #fdcb6e)';
    if (product.category === 'minuman') bgGradient = 'linear-gradient(135deg, #00cec9, #55efc4)';
    if (product.category === 'kerajinan') bgGradient = 'linear-gradient(135deg, #6c5ce7, #a29bfe)';

    return `
        <div class="product-detail container py-10 fade-in">
            <div class="grid md:grid-cols-2 gap-10">
                <!-- Image Side -->
                <div class="product-detail-image-container relative card overflow-hidden aspect-square">
                    ${product.image && product.image.startsWith('data:image') ? 
                        `<img src="${product.image}" alt="${escapeHtml(product.name)}" class="object-cover" style="width: 100%; height: 100%;">` :
                        `<div class="product-image-placeholder flex flex-center justify-center" style="width: 100%; height: 100%; background: ${bgGradient}" >
                            <span class="product-emoji text-9xl">${product.image || getCategoryEmoji(product.category)}</span>
                        </div>`
                    }
                    ${product.status === 'po' ? `<span class="card-badge" style="background-color: var(--warning); color: white; right: 10px; top: 10px; font-size: 1rem; padding: 0.5rem 1rem;">PRE-ORDER</span>` : ''}
                </div>

                <!-- Info Side -->
                <div class="product-detail-info flex flex-col justify-center">
                    <div class="mb-4">
                        <span class="badge badge-${product.category} inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider border mb-2" style="border-radius: var(--radius-full);">
                            ${getCategoryEmoji(product.category)} ${getCategoryLabel(product.category)}
                        </span>
                        <h1 class="product-detail-name text-4xl font-bold mb-2">${escapeHtml(product.name)}</h1>
                        <div class="product-detail-price text-3xl font-bold text-accent mb-2">
                            ${formatRupiah(product.price)} <span class="text-xl text-secondary font-normal">/ ${escapeHtml(product.unit || 'Pcs')}</span>
                        </div>
                    </div>

                    <div class="product-detail-desc prose text-secondary mb-5">
                        <p class="whitespace-pre-line">${escapeHtml(product.description)}</p>
                    </div>

                    <div class="border-t border-b py-4 mb-5">
                        <div class="flex flex-center gap-4 cursor-pointer p-2 card transition-colors seller-link" data-sellerid="${product.sellerId}">
                            <div class="w-12 h-12 flex flex-center justify-center overflow-hidden flex-shrink-0" style="border-radius: var(--radius-full);">
                                ${seller?.avatar ? `<img src="${seller.avatar}" class="object-cover" style="width: 100%; height: 100%;">` : `<i data-lucide="store" class="text-muted"></i>`}
                            </div>
                            <div>
                                <p class="text-sm text-muted">Dijual oleh</p>
                                <p class="font-semibold">${escapeHtml(sellerName)}</p>
                            </div>
                            <div class="ml-auto text-primary">
                                <i data-lucide="chevron-right"></i>
                            </div>
                        </div>
                    </div>

                    <div class="mb-5 flex flex-center gap-4">
                        <span class="text-sm font-medium text-secondary">Jumlah:</span>
                        <div class="product-qty-selector flex flex-center border card overflow-hidden">
                            <button class="px-3 py-1 transition text-secondary" id="btn-qty-minus">-</button>
                            <input type="number" id="input-qty" value="${product.minOrder || 1}" min="${product.minOrder || 1}" max="${product.stock}" class="text-center py-1 outline-none font-medium" style="width: 4rem;" readonly>
                            <button class="px-3 py-1 transition text-secondary" id="btn-qty-plus">+</button>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-sm text-muted">Stok: ${product.stock} tersedia</span>
                            ${(product.minOrder || 1) > 1 ? `<span class="text-xs font-semibold text-warning mt-1">Min. order: ${product.minOrder} ${product.unit}</span>` : ''}
                        </div>
                    </div>

                    <div class="product-detail-actions flex gap-4 mt-auto">
                        <button class="btn btn-outline flex-1 py-3 border-2 border-primary text-primary hover:bg-primary-50 card font-bold flex flex-center gap-2" id="btn-add-cart">
                            <i data-lucide="shopping-cart"></i> Tambah ke Keranjang
                        </button>
                        <button class="btn btn-primary flex-1 py-3 bg-primary hover:bg-primary-dark text-white card font-bold shadow-primary/30" id="btn-buy-now">
                            Beli Langsung
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function afterRender(params) {
    if (window.lucide) {
        window.lucide.createIcons();
    }

    const productId = params.id;
    const product = await Store.getProduct(productId);
    if (!product) return;

    const inputQty = document.getElementById('input-qty');
    const btnMinus = document.getElementById('btn-qty-minus');
    const btnPlus = document.getElementById('btn-qty-plus');
    const btnAddCart = document.getElementById('btn-add-cart');
    const btnBuyNow = document.getElementById('btn-buy-now');

    const minQty = product.minOrder || 1;
    let qty = minQty;

    const updateQtyDisplay = () => {
        inputQty.value = qty;
        btnMinus.disabled = qty <= minQty;
        btnMinus.classList.toggle('opacity-50', qty <= minQty);
        btnPlus.disabled = qty >= product.stock;
        btnPlus.classList.toggle('opacity-50', qty >= product.stock);
    };

    updateQtyDisplay(); // Initialize styling

    btnMinus?.addEventListener('click', () => {
        if (qty > minQty) {
            qty--;
            updateQtyDisplay();
        }
    });

    btnPlus?.addEventListener('click', () => {
        if (qty < product.stock) {
            qty++;
            updateQtyDisplay();
        }
    });

    const handleAddToCart = (redirect = false) => {
        if (!Auth.isLoggedIn()) {
            showToast('Silakan login terlebih dahulu.', 'error');
            Router.navigate('/login');
            return;
        }

        if (product.stock < qty) {
            showToast('Stok tidak mencukupi!', 'error');
            return;
        }

        Store.addToCart(productId, qty);
        showToast('Produk ditambahkan ke keranjang!', 'success');
        
        // Update header cart count manually if needed, or rely on App level events
        const cartBadge = document.getElementById('cart-badge');
        if (cartBadge) {
            const count = Store.getCartCount();
            cartBadge.textContent = count;
            cartBadge.style.display = count > 0 ? 'flex' : 'none';
        }

        if (redirect) {
            Router.navigate('/cart');
        }
    };

    btnAddCart?.addEventListener('click', () => handleAddToCart(false));
    btnBuyNow?.addEventListener('click', () => handleAddToCart(true));

    document.querySelectorAll('.seller-link').forEach(el => {
        el.addEventListener('click', () => {
            Router.navigate('/lapak/' + el.dataset.sellerid);
        });
    });

    updateQtyDisplay();
}
