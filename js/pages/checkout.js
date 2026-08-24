import Store from '../store.js';
import Auth from '../auth.js';
import Router from '../router.js';
import { formatRupiah, showToast } from '../utils.js';

export function render(params) {
    if (!Auth.isLoggedIn()) {
        setTimeout(() => Router.navigate('/login'), 0);
        return `<div class="container text-center mt-5"><p>Mengarahkan ke halaman login...</p></div>`;
    }

    const cart = Store.getCart();
    if (cart.length === 0) {
        setTimeout(() => Router.navigate('/cart'), 0);
        return `<div class="container text-center mt-5"><p>Keranjang kosong. Mengarahkan...</p></div>`;
    }

    const user = Auth.getCurrentUser();
    
    let cartHtml = '';
    let total = 0;

    cart.forEach(item => {
        const product = Store.getProduct(item.productId);
        if (product) {
            const subtotal = product.price * item.qty;
            total += subtotal;
            cartHtml += `
                <div class="cart-summary-row flex flex-between mb-2">
                    <div>
                        <span class="product-name text-sm font-semibold">${product.name}</span>
                        <div class="text-xs text-muted">${item.qty} x ${formatRupiah(product.price)}</div>
                    </div>
                    <div class="font-semibold">${formatRupiah(subtotal)}</div>
                </div>
            `;
        }
    });

    return `
        <div class="checkout-page container mt-4 mb-5 fade-in">
            <h1 class="text-2xl font-heading font-bold mb-4 flex flex-center"><i data-lucide="package" class="mr-2 text-primary"></i> Checkout</h1>
            
            <div class="grid md:grid-2 gap-6" style="grid-template-columns: 2fr 1fr;">
                <div class="checkout-left gap-4">
                    <div class="card checkout-section">
                        <div class="card-body">
                            <h2 class="text-xl font-heading mb-4 checkout-section-title flex flex-center"><i data-lucide="map-pin" class="mr-2"></i> Lokasi Pengantaran / Pengambilan</h2>
                            <form id="checkout-address-form" class="gap-4">
                                <div class="form-group mb-4">
                                    <label class="form-label font-bold mb-2">Metode Penerimaan</label>
                                    <div class="flex gap-4">
                                        <label class="flex align-center gap-2 cursor-pointer">
                                            <input type="radio" name="delivery_method" value="antar" checked> Antar ke Ruangan
                                        </label>
                                        <label class="flex align-center gap-2 cursor-pointer">
                                            <input type="radio" name="delivery_method" value="ambil"> Ambil Sendiri (di Ruangan Penjual)
                                        </label>
                                    </div>
                                </div>
                                
                                <div id="delivery-details">
                                    <div class="form-group mb-3">
                                        <label class="form-label">Nama Pemesan</label>
                                        <input type="text" id="checkout-name" class="form-input p-2 border rounded" style="width: 100%;" value="${user.name}" required>
                                    </div>
                                    <div class="form-group mb-3">
                                        <label class="form-label">No. HP / WhatsApp (Aktif)</label>
                                        <input type="tel" id="checkout-phone" class="form-input p-2 border rounded" style="width: 100%;" value="${user.phone || ''}" required placeholder="Misal: 081234567890">
                                    </div>
                                    <div class="grid grid-2 gap-4 mb-3">
                                        <div class="form-group">
                                            <label class="form-label">Gedung</label>
                                            <select id="checkout-building" class="form-select p-2 border rounded" style="width: 100%;" required>
                                                <option value="A">Gedung A</option>
                                                <option value="B">Gedung B</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">Lantai</label>
                                            <select id="checkout-floor" class="form-select p-2 border rounded" style="width: 100%;" required>
                                                ${[1,2,3,4,5,6,7,8].map(l => `<option value="${l}">Lantai ${l}</option>`).join('')}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group mb-3">
                                        <label class="form-label">Unit Eselon / Bagian Ruangan</label>
                                        <input type="text" id="checkout-unit" class="form-input p-2 border rounded" style="width: 100%;" required placeholder="Misal: Ditjen Binapenta / Bagian Umum">
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div class="card checkout-section">
                        <div class="card-body">
                            <h2 class="text-xl font-heading mb-4 checkout-section-title flex flex-center"><i data-lucide="credit-card" class="mr-2"></i> Metode Pembayaran</h2>
                            <div class="grid grid-3 gap-4">
                                <div class="payment-option card p-4 cursor-pointer border-2 rounded text-center selected border-primary bg-glass" data-method="transfer">
                                    <i data-lucide="credit-card" class="mx-auto mb-2 text-primary w-8 h-8"></i>
                                    <div class="font-semibold">Transfer Bank</div>
                                    <div class="text-xs text-muted mt-1">Ke rekening penjual</div>
                                </div>
                                <div class="payment-option card p-4 cursor-pointer border-2 rounded text-center" data-method="qris">
                                    <i data-lucide="qr-code" class="mx-auto mb-2 text-primary w-8 h-8"></i>
                                    <div class="font-semibold">QRIS</div>
                                    <div class="text-xs text-muted mt-1">Scan barcode otomatis</div>
                                </div>
                                <div class="payment-option card p-4 cursor-pointer border-2 rounded text-center" data-method="cod">
                                    <i data-lucide="banknote" class="mx-auto mb-2 text-primary w-8 h-8"></i>
                                    <div class="font-semibold">COD</div>
                                    <div class="text-xs text-muted mt-1">Tunai saat bertemu</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="checkout-right">
                    <div class="card sticky top-24">
                        <div class="card-body">
                            <h2 class="text-xl font-heading mb-4 flex flex-center"><i data-lucide="shopping-bag" class="mr-2"></i> Ringkasan Pesanan</h2>
                            <div class="cart-summary mb-4">
                                ${cartHtml}
                            </div>
                            <hr class="my-4">
                            <div class="flex flex-between mb-2">
                                <span class="text-muted">Subtotal</span>
                                <span>${formatRupiah(total)}</span>
                            </div>
                            <div class="flex flex-between mb-4">
                                <span class="text-muted">Ongkir</span>
                                <span class="text-success font-semibold">Gratis</span>
                            </div>
                            <div class="flex flex-between mb-5 text-xl font-bold cart-summary-total">
                                <span>Total</span>
                                <span class="text-primary">${formatRupiah(total)}</span>
                            </div>
                            
                            <button id="btn-buat-pesanan" class="btn btn-primary btn-block btn-lg flex flex-center justify-center py-3 card text-white font-semibold hover:shadow-lg transition-all" style="width: 100%;">
                                Buat Pesanan <i data-lucide="arrow-right" class="ml-2 w-5 h-5 inline"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function afterRender(params) {
    if (window.lucide) window.lucide.createIcons();

    let selectedMethod = 'transfer';
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    paymentOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            paymentOptions.forEach(o => {
                o.classList.remove('selected', 'border-primary', 'bg-blue-50');
                o.classList.add('border-gray-200');
            });
            opt.classList.remove('border-gray-200');
            opt.classList.add('selected', 'border-primary', 'bg-blue-50');
            selectedMethod = opt.dataset.method;
        });
    });

    const btnSubmit = document.getElementById('btn-buat-pesanan');
    if (!btnSubmit) return;

    btnSubmit.addEventListener('click', () => {
        const methodRadios = document.getElementsByName('delivery_method');
        let deliveryType = 'antar';
        for (let r of methodRadios) {
            if (r.checked) deliveryType = r.value;
        }
        
        const name = document.getElementById('checkout-name').value.trim();
        const phone = document.getElementById('checkout-phone').value.trim();
        const building = document.getElementById('checkout-building').value;
        const floor = document.getElementById('checkout-floor').value;
        const unit = document.getElementById('checkout-unit').value.trim();

        if (!name || !phone || !unit) {
            showToast('Harap lengkapi nama, No HP, dan Unit Kerja', 'error');
            return;
        }

        const user = Auth.getCurrentUser();
        const fullAddress = deliveryType === 'antar' 
            ? `Antar ke Ruangan: Gedung ${building}, Lantai ${floor}, ${unit}`
            : `Ambil Sendiri (Pemesan: Gedung ${building} Lt.${floor} ${unit})`;

        const cart = Store.getCart();
        const sellerItems = {};

        // Group by seller
        cart.forEach(cartItem => {
            const product = Store.getProduct(cartItem.productId);
            if (product) {
                if (!sellerItems[product.sellerId]) {
                    sellerItems[product.sellerId] = [];
                }
                sellerItems[product.sellerId].push({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    qty: cartItem.qty,
                    image: product.image
                });
            }
        });

        // Create orders
        Object.keys(sellerItems).forEach(sellerId => {
            const items = sellerItems[sellerId];
            const totalPrice = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
            
            Store.createOrder({
                buyerId: user.id,
                sellerId: sellerId,
                items: items,
                totalPrice: totalPrice,
                address: fullAddress,
                paymentMethod: selectedMethod,
                status: 'pending'
            });
        });

        Store.clearCart();
        showToast('Pesanan berhasil dibuat!', 'success');
        Router.navigate('/orders');
    });
}
