import Store from '../store.js';
import Auth from '../auth.js';
import Router from '../router.js';
import { formatRupiah, escapeHtml, getCategoryEmoji } from '../utils.js';

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
    
    let cartItemsHtml = '';
    for (const item of cartItems) {
        const product = await Store.getProduct(item.productId);
        if (!product) {
            cartItemsHtml += `
                <div class="cart-item card p-4 mb-4 flex flex-center flex-between bg-glass">
                    <div class="text-danger font-medium">Produk tidak tersedia</div>
                    <button class="btn btn-icon text-danger hover:bg-red-100 p-2 btn-remove" style="border-radius: var(--radius-full);" data-id="${item.productId}">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            `;
            continue;
        }

        const itemTotal = product.price * item.qty;
        subtotal += itemTotal;

        let bgGradient = 'linear-gradient(135deg, #636e72, #b2bec3)';
        if (product.category === 'makanan') bgGradient = 'linear-gradient(135deg, #e17055, #fdcb6e)';
        if (product.category === 'minuman') bgGradient = 'linear-gradient(135deg, #00cec9, #55efc4)';
        if (product.category === 'kerajinan') bgGradient = 'linear-gradient(135deg, #6c5ce7, #a29bfe)';

        const isStockInsufficient = item.qty > product.stock;

        cartItemsHtml += `
            <div class="cart-item card p-4 mb-4 flex flex-col sm:flex-row gap-4 flex-center slide-up ${isStockInsufficient ? 'border-red-400 bg-red-50' : ''}">
                <div class="card overflow-hidden flex-shrink-0 relative cursor-pointer" style="width: 6rem; height: 6rem;" onclick="window.location.hash='#/product/${product.id}'">
                    ${product.image && product.image.startsWith('data:image') ? 
                        `<img src="${product.image}" class="object-cover" style="width: 100%; height: 100%;">` : 
                        `<div class="flex flex-center justify-center text-3xl" style="width: 100%; height: 100%; background: ${bgGradient}" >${product.image || getCategoryEmoji(product.category)}</div>`
                    }
                </div>
                
                <div class="flex-grow">
                    <a href="#/product/${product.id}" class="font-bold text-lg hover:text-primary transition-colors">${escapeHtml(product.name)}</a>
                    <div class="text-accent font-semibold">${formatRupiah(product.price)}</div>
                    ${isStockInsufficient ? `<p class="text-danger text-sm mt-1">Stok hanya tersisa ${product.stock}</p>` : ''}
                </div>
                
                <div class="flex flex-center gap-6">
                    <div class="cart-qty flex flex-center border card">
                        <button class="px-3 py-1 text-secondary btn-qty-change" data-id="${product.id}" data-change="-1">-</button>
                        <span class="px-3 py-1 font-medium min-w-[2rem] text-center">${item.qty}</span>
                        <button class="px-3 py-1 text-secondary btn-qty-change" data-id="${product.id}" data-change="1" ${item.qty >= product.stock ? 'disabled class="opacity-50"' : ''}>+</button>
                    </div>
                    
                    <div class="font-bold text-right min-w-[6rem] hidden sm:block">
                        ${formatRupiah(itemTotal)}
                    </div>
                    
                    <button class="btn btn-icon text-muted hover:text-red-500 p-2 transition-colors btn-remove" style="border-radius: var(--radius-full);" data-id="${product.id}">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `;
    }

    const ongkir = 0; // Free for MVP
    const total = subtotal + ongkir;

    return `
        <div class="cart-page container py-8 fade-in">
            <h1 class="text-3xl font-bold mb-5 flex flex-center gap-2">
                <i data-lucide="shopping-cart" class="w-8 h-8 text-primary"></i> Keranjang Belanja
            </h1>
            
            <div class="grid grid-3 gap-8">
                <!-- Cart Items -->
                <div class="lg:col-span-2 cart-items">
                    ${cartItemsHtml}
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
                        
                        <button class="btn btn-primary btn-block py-3 text-lg font-bold shadow-primary/30" id="btn-checkout">
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
                let newQty = cartItem.qty + change;
                const minQty = product.minOrder || 1;
                
                if (newQty < minQty) newQty = minQty; // Minimum order
                if (newQty > product.stock) newQty = product.stock; // Maximum stock
                
                if (newQty !== cartItem.qty) {
                    Store.updateCartQty(productId, newQty);
                    // Re-render the page manually
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
                
                // Update cart badge
                const cartBadge = document.getElementById('cart-badge');
                if (cartBadge) {
                    const count = Store.getCartCount();
                    cartBadge.textContent = count;
                    cartBadge.style.display = count > 0 ? 'flex' : 'none';
                }

                // Re-render
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
        // Check stocks
        const cartItems = Store.getCart();
        let hasError = false;
        
        for (const item of cartItems) {
            const product = await Store.getProduct(item.productId);
            if (!product || item.qty > product.stock) {
                hasError = true;
                break;
            }
        }
        
        if (hasError) {
            alert('Beberapa produk memiliki stok tidak mencukupi atau tidak tersedia. Silakan periksa keranjang Anda.');
            return;
        }
        
        Router.navigate('/checkout');
    });
}
