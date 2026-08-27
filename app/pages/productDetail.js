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
        <div style="overflow-x: hidden; width: 100%;">
            <div class="product-detail container py-10 fade-in">
                <div class="grid grid-2" style="gap: 3rem; align-items: start;">
                    <!-- Image Side -->
                    <div class="product-detail-image-container bg-white border border-gray-200 p-8 flex items-center justify-center rounded-xl" style="position: relative; overflow: hidden;">
                        ${product.status === 'po' ? `
                            <div style="position: absolute; top: 0; right: 0; width: 150px; height: 150px; overflow: hidden; z-index: 10;">
                                <div class="bg-orange-500 text-white font-bold text-center py-2 shadow-md" style="position: absolute; top: 32px; right: -35px; width: 170px; transform: rotate(45deg);">PRE-ORDER</div>
                            </div>
                        ` : `
                            <div style="position: absolute; top: 0; right: 0; width: 150px; height: 150px; overflow: hidden; z-index: 10;">
                                <div class="bg-green-500 text-white font-bold text-center py-2 shadow-md" style="position: absolute; top: 32px; right: -35px; width: 170px; transform: rotate(45deg);">READY</div>
                            </div>
                        `}
                        ${product.image && product.image.startsWith('data:image') ? 
                            `<img src="${product.image}" alt="${escapeHtml(product.name)}" class="object-contain" style="max-width: 100%; max-height: 100%; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));">` :
                            `<div class="product-image-placeholder flex flex-center justify-center w-full h-full rounded-lg" style="background: ${bgGradient}" >
                                <span class="product-emoji text-9xl">${product.image || getCategoryEmoji(product.category)}</span>
                            </div>`
                        }
                    </div>

                    <!-- Info Side -->
                    <div class="product-detail-info flex flex-col justify-start">
                        <h1 class="product-detail-name text-4xl font-semibold text-gray-800 mb-2">${escapeHtml(product.name)}</h1>
                        
                        <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <span>(${product.sold || 0} terjual)</span>
                        </div>

                        <div class="product-detail-desc prose text-gray-600 mb-6 text-md leading-relaxed">
                            <p class="whitespace-pre-line">${escapeHtml(product.description)}</p>
                        </div>

                        <div class="product-detail-price text-3xl font-semibold text-gray-800 mb-6">
                            ${formatRupiah(product.price)} <span class="text-xl font-normal text-gray-500">/ ${escapeHtml(product.unit || 'pcs')}</span>
                        </div>

                        <div class="border-t border-gray-200 w-full mb-6"></div>

                        <div class="flex items-center gap-3 mb-8">
                            <div class="flex items-center justify-center border border-gray-300 rounded-md overflow-hidden h-10 bg-white" style="width: fit-content;">
                                <button id="btn-qty-minus" class="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors border-r border-gray-200 select-none">
                                    <i data-lucide="minus" class="w-4 h-4"></i>
                                </button>
                                <div class="flex items-center justify-center relative cursor-ns-resize select-none h-full bg-gray-50" id="qty-scroll-area" title="Gulir atau geser atas/bawah untuk mengubah" style="width: 3.5rem;">
                                    <input type="number" id="input-qty" value="${product.minOrder || 1}" min="${product.minOrder || 1}" ${product.status === 'po' ? '' : `max="${product.stock}"`} class="w-full h-full text-center outline-none font-bold text-gray-800 text-[12pt] bg-transparent pointer-events-none" style="appearance: none; -moz-appearance: textfield; margin: 0;" readonly>
                                </div>
                                <button id="btn-qty-plus" class="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors border-l border-gray-200 select-none">
                                    <i data-lucide="plus" class="w-4 h-4"></i>
                                </button>
                            </div>
                            
                            <button class="flex items-center justify-center w-10 h-10 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" id="btn-add-cart" title="Tambahkan ke Keranjang">
                                <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                            </button>

                            <button class="flex items-center justify-center w-10 h-10 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" id="btn-buy-now" title="Beli Langsung">
                                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                            </button>

                            <button class="flex items-center justify-center w-10 h-10 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" id="btn-chat-seller" data-sellerid="${product.sellerId}" data-sellername="${escapeHtml(sellerName)}" title="Tanya Penjual">
                                <i data-lucide="headset" class="w-5 h-5"></i>
                            </button>
                            
                            <button class="flex items-center justify-center w-10 h-10 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Favorit">
                                <i data-lucide="heart" class="w-5 h-5"></i>
                            </button>
                        </div>

                        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 seller-link cursor-pointer mt-auto" data-sellerid="${product.sellerId}">
                            <div class="flex-grow">
                                <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Penjual UMKM</p>
                                <p class="font-bold text-gray-800">${escapeHtml(sellerName)}</p>
                            </div>
                            <i data-lucide="chevron-right" class="text-gray-400"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div id="other-products-container" class="container pb-10" style="display: none;">
                <div class="border-t border-gray-100 pt-8">
                    <h3 class="text-sm font-bold mb-4 text-gray-700">Produk Lain dari Warung Ini</h3>
                    <div id="other-products-scroll" class="flex gap-1 pb-3" style="overflow-x: auto; -webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory;">
                        <!-- Other products will be injected here -->
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
    const scrollArea = document.getElementById('qty-scroll-area');

    const isPreOrder = product.status === 'po';
    const minQty = product.minOrder || 1;
    let qty = minQty;

    const updateQtyDisplay = () => {
        inputQty.value = qty;
    };

    updateQtyDisplay(); // Initialize

    if (scrollArea) {
        // Desktop wheel scroll
        scrollArea.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) { // Gulir atas -> Tambah
                if (isPreOrder || qty < product.stock) {
                    qty++;
                    updateQtyDisplay();
                }
            } else if (e.deltaY > 0) { // Gulir bawah -> Kurang
                if (qty > minQty) {
                    qty--;
                    updateQtyDisplay();
                }
            }
        });

        // Mobile touch swipe
        let touchStartY = 0;
        scrollArea.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            // Hanya stop propagation, biarkan default agar tidak merusak scroll halaman secara ekstrem, 
            // tapi cegah scroll bawaan browser untuk elemen ini
            if(e.cancelable) e.preventDefault();
        }, { passive: false });

        scrollArea.addEventListener('touchmove', (e) => {
            if(e.cancelable) e.preventDefault();
            const touchCurrentY = e.touches[0].clientY;
            const diff = touchStartY - touchCurrentY;
            
            // Sensitivitas gulir
            if (diff > 12) {
                if (isPreOrder || qty < product.stock) {
                    qty++;
                    updateQtyDisplay();
                }
                touchStartY = touchCurrentY; // reset start point untuk iterasi berlanjut
            } else if (diff < -12) {
                if (qty > minQty) {
                    qty--;
                    updateQtyDisplay();
                }
                touchStartY = touchCurrentY;
            }
        }, { passive: false });
    }

    if (btnMinus) {
        btnMinus.addEventListener('click', () => {
            if (qty > minQty) {
                qty--;
                updateQtyDisplay();
            }
        });
    }

    if (btnPlus) {
        btnPlus.addEventListener('click', () => {
            if (isPreOrder || qty < product.stock) {
                qty++;
                updateQtyDisplay();
            }
        });
    }

    const handleAddToCart = (redirect = false) => {
        if (!Auth.isLoggedIn()) {
            showToast('Silakan login terlebih dahulu.', 'error');
            Router.navigate('/login');
            return;
        }

        // Pre-order: abaikan cek stok
        if (!isPreOrder && product.stock < qty) {
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

    // Handler tombol Tanya Penjual
    const btnChatSeller = document.getElementById('btn-chat-seller');
    btnChatSeller?.addEventListener('click', async () => {
        if (!Auth.isLoggedIn()) {
            showToast('Silakan login terlebih dahulu.', 'error');
            Router.navigate('/login');
            return;
        }

        const currentUser = await Auth.getCurrentUser();
        if (currentUser.id === product.sellerId) {
            showToast('Anda tidak bisa chat dengan diri sendiri.', 'info');
            return;
        }

        const seller = await Store.getUser(product.sellerId);
        const sellerLapak = await Store.getLapak(product.sellerId);
        const sellerDisplayName = sellerLapak?.name || seller?.name || 'Penjual';

        btnChatSeller.disabled = true;
        btnChatSeller.innerHTML = '<i data-lucide="loader" class="w-5 h-5"></i> Menghubungkan...';

        try {
            const chatId = await Store.getOrCreateChatRoom(
                currentUser.id,
                currentUser.name,
                product.sellerId,
                sellerDisplayName
            );
            Router.navigate('/chat/' + chatId);
        } catch (err) {
            console.error(err);
            showToast('Gagal membuka chat, coba lagi.', 'error');
            btnChatSeller.disabled = false;
            btnChatSeller.innerHTML = '<i data-lucide="message-square" class="w-5 h-5"></i> Tanya Penjual';
            if (window.lucide) window.lucide.createIcons();
        }
    });

    document.querySelectorAll('.seller-link').forEach(el => {
        el.addEventListener('click', () => {
            Router.navigate('/lapak/' + el.dataset.sellerid);
        });
    });

    // Load other products
    const otherProductsContainer = document.getElementById('other-products-container');
    const otherProductsScroll = document.getElementById('other-products-scroll');
    
    if (otherProductsContainer && otherProductsScroll) {
        Store.getProductsBySeller(product.sellerId).then(sellerProducts => {
            // Filter out the current product
            const otherProducts = sellerProducts.filter(p => p.id !== productId);
            
            if (otherProducts.length > 0) {
                otherProductsContainer.style.display = 'block';
                
                // Render products
                const html = otherProducts.map(p => `
                    <div class="flex-none bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onclick="window.location.hash = '/product/${p.id}'" style="scroll-snap-align: start; width: 225px; border: 1.5px solid #e5e7eb;">
                        <div class="bg-gray-50 flex items-center justify-center overflow-hidden" style="width: 100%; aspect-ratio: 1 / 1;">
                            ${p.image && p.image.startsWith('data:image') ? 
                                `<img src="${p.image}" alt="${escapeHtml(p.name)}" style="width: 100%; height: 100%; object-fit: contain;">` : 
                                `<span style="font-size: 3rem; opacity: 0.8;">${p.image || getCategoryEmoji(p.category)}</span>`
                            }
                        </div>
                        <div style="padding: 5px 7px; border-top: 1px solid #f3f4f6;">
                            <h4 class="font-semibold text-gray-800 truncate" style="font-size: 10px; margin-bottom: 2px;" title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</h4>
                            <p class="text-primary font-bold" style="font-size: 10px;">${formatRupiah(p.price)}</p>
                        </div>
                    </div>
                `).join('');
                
                otherProductsScroll.innerHTML = html;
                
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }
        });
    }

    updateQtyDisplay();
}
