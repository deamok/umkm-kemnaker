import Store from '../store.js';
import Auth from '../auth.js';
import Router from '../router.js';
import { formatRupiah, escapeHtml } from '../utils.js';

export async function render() {
    if (!Auth.isLoggedIn()) {
        return `
            <div class="container py-20 text-center fade-in">
                <div class="text-6xl mb-4 text-muted"><i data-lucide="shopping-cart" class="mx-auto" style="width: 4rem; height: 4rem;"></i></div>
                <h2 class="text-2xl font-bold mb-4">Anda belum login</h2>
                <p class="text-muted mb-5">Silakan login untuk melihat keranjang belanja Anda.</p>
                <a href="#/login" class="btn btn-primary">Login Sekarang</a>
            </div>
        `;
    }

    const cartItems = Store.getCart();

    if (cartItems.length === 0) {
        return `
            <div class="container py-20 text-center fade-in">
                <div class="empty-state-icon text-6xl mb-4">🛒</div>
                <h2 class="text-2xl font-bold mb-4">Keranjang Kosong</h2>
                <p class="text-muted mb-5">Anda belum menambahkan produk apapun ke keranjang.</p>
                <a href="#/products" class="btn btn-primary">Mulai Belanja</a>
            </div>
        `;
    }

    let subtotal = 0;
    let cartRowsHtml = '';
    let rowNum = 1;

    for (const item of cartItems) {
        const product = await Store.getProduct(item.productId);
        if (!product) {
            cartRowsHtml += `
                <tr>
                    <td colspan="6" class="text-center text-danger py-3 text-sm">
                        Produk tidak tersedia
                        <button class="btn btn-sm btn-danger ml-2 btn-remove" data-id="${item.productId}">Hapus</button>
                    </td>
                </tr>
            `;
            continue;
        }

        const isPreOrder = product.status === 'po';
        const itemTotal = product.price * item.qty;
        subtotal += itemTotal;
        const isStockInsufficient = !isPreOrder && item.qty > product.stock;

        cartRowsHtml += `
            <tr class="${isStockInsufficient ? 'bg-red-50' : ''}" style="border-bottom: 1px solid var(--border-glass);">
                <td class="py-3 px-3 text-center text-sm text-muted">${rowNum++}</td>
                <td class="py-3 px-3">
                    <a href="#/product/${product.id}" class="font-semibold hover:text-primary transition-colors" style="color: var(--text-primary);">${escapeHtml(product.name)}</a>
                    ${isPreOrder ? '<span class="text-xs font-semibold ml-1" style="color:#d97706;">(Pre-Order)</span>' : ''}
                    ${isStockInsufficient ? `<div class="text-danger text-xs mt-0.5">Stok hanya tersisa ${product.stock}</div>` : ''}
                </td>
                <td class="py-3 px-3 text-right text-sm" style="white-space:nowrap;">${formatRupiah(product.price)}</td>
                <td class="py-3 px-3 text-center">
                    <div class="cart-qty flex flex-center border card" style="display:inline-flex; border-radius: 6px; overflow:hidden;">
                        <button class="px-2 py-1 text-secondary btn-qty-change" style="font-size:1rem; line-height:1;" data-id="${product.id}" data-change="-1">−</button>
                        <span class="px-3 py-1 font-medium" style="min-width:2rem; text-align:center;">${item.qty}</span>
                        <button class="px-2 py-1 text-secondary btn-qty-change" style="font-size:1rem; line-height:1;" data-id="${product.id}" data-change="1" ${(!isPreOrder && item.qty >= product.stock) ? 'disabled style="opacity:0.4;"' : ''}>+</button>
                    </div>
                </td>
                <td class="py-3 px-3 text-right font-bold" style="white-space:nowrap; color: var(--accent-primary);">${formatRupiah(itemTotal)}</td>
                <td class="py-3 px-3 text-center">
                    <button class="btn btn-icon text-muted hover:text-red-500 p-1 transition-colors btn-remove" style="border-radius: var(--radius-full);" data-id="${product.id}">
                        <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    const total = subtotal;

    return `
        <div class="cart-page container py-8 fade-in">
            <h1 class="text-3xl font-bold mb-5 flex flex-center gap-2">
                <i data-lucide="shopping-cart" class="w-8 h-8 text-primary"></i> Keranjang Belanja
            </h1>
            
            <div class="grid grid-3 gap-8">
                <!-- Cart Table -->
                <div class="lg:col-span-2 cart-items" style="min-width: 0; max-width: 100%;">
                    <div class="card border" style="overflow-x: auto; width: 100%; -webkit-overflow-scrolling: touch;">
                        <table style="width:100%; min-width: 650px; border-collapse: collapse; font-size: 0.9rem;">
                            <thead>
                                <tr style="background: var(--bg-secondary); border-bottom: 2px solid var(--border-glass);">
                                    <th class="py-3 px-3 text-center text-muted font-semibold" style="width:40px;">No</th>
                                    <th class="py-3 px-3 text-left text-muted font-semibold">Nama Produk</th>
                                    <th class="py-3 px-3 text-right text-muted font-semibold" style="white-space:nowrap;">Harga Satuan</th>
                                    <th class="py-3 px-3 text-center text-muted font-semibold">Jumlah</th>
                                    <th class="py-3 px-3 text-right text-muted font-semibold">Subtotal</th>
                                    <th class="py-3 px-3" style="width:50px;"></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${cartRowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Cart Summary -->
                <div class="lg:col-span-1">
                    <div class="card p-5 sticky top-24 border-t-4 border-t-primary">
                        <h3 class="text-xl font-bold mb-4">Ringkasan Belanja</h3>
                        
                        <div class="gap-3 mb-5 text-sm">
                            <div class="flex flex-between cart-summary-row">
                                <span class="text-secondary">Total Harga (${cartItems.length} barang)</span>
                                <span class="font-semibold">${formatRupiah(subtotal)}</span>
                            </div>
                            <div class="flex flex-between cart-summary-row">
                                <span class="text-secondary">Ongkos Kirim</span>
                                <span class="font-semibold text-success">Gratis</span>
                            </div>
                        </div>
                        
                        <div class="border-t pt-4 mb-5">
                            <div class="flex flex-between cart-summary-total">
                                <span class="font-bold text-lg">Total Belanja</span>
                                <span class="font-bold text-2xl text-accent">${formatRupiah(total)}</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary btn-block py-3 text-lg font-bold" id="btn-checkout">
                            Beli Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function afterRender() {
    if (window.lucide) {
        window.lucide.createIcons();
    }

    if (!Auth.isLoggedIn() || Store.getCart().length === 0) return;

    // Handle quantity changes
    document.querySelectorAll('.btn-qty-change').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const productId = e.currentTarget.dataset.id;
            const change = parseInt(e.currentTarget.dataset.change);
            
            const cartItem = Store.getCart().find(item => item.productId === productId);
            if (cartItem) {
                const product = await Store.getProduct(productId);
                const isPreOrder = product.status === 'po';
                let newQty = cartItem.qty + change;
                const minQty = product.minOrder || 1;
                
                if (newQty < minQty) newQty = minQty;
                if (!isPreOrder && newQty > product.stock) newQty = product.stock;
                
                if (newQty !== cartItem.qty) {
                    Store.updateCartQty(productId, newQty);
                    const appDiv = document.getElementById('app');
                    if (appDiv) {
                        import('./cart.js').then(async module => {
                            appDiv.innerHTML = await module.render();
                            module.afterRender();
                        });
                    }
                }
            }
        });
    });

    // Handle remove
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.id;
            if (confirm('Hapus produk ini dari keranjang?')) {
                Store.removeFromCart(productId);
                
                const cartBadge = document.getElementById('cart-badge');
                if (cartBadge) {
                    const count = Store.getCartCount();
                    cartBadge.textContent = count;
                    cartBadge.style.display = count > 0 ? 'flex' : 'none';
                }

                const appDiv = document.getElementById('app');
                if (appDiv) {
                    import('./cart.js').then(async module => {
                        appDiv.innerHTML = await module.render();
                        module.afterRender();
                    });
                }
            }
        });
    });

    // Handle checkout
    document.getElementById('btn-checkout')?.addEventListener('click', async () => {
        const cartItems = Store.getCart();
        let hasError = false;
        
        for (const item of cartItems) {
            const product = await Store.getProduct(item.productId);
            if (!product) { hasError = true; break; }
            // Pre-order: skip stock check
            if (product.status !== 'po' && item.qty > product.stock) {
                hasError = true;
                break;
            }
        }
        
        if (hasError) {
            alert('Beberapa produk tidak tersedia atau stok tidak mencukupi. Silakan periksa keranjang Anda.');
            return;
        }
        
        Router.navigate('/checkout');
    });
}
