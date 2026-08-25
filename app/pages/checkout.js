import Store from '../store.js';
import Auth from '../auth.js';
import Router from '../router.js';
import { formatRupiah, showToast } from '../utils.js';

export async function render(params) {
    if (!Auth.isLoggedIn()) {
        setTimeout(() => Router.navigate('/login'), 0);
        return `<div class="container text-center mt-5"><p>Mengarahkan ke halaman login...</p></div>`;
    }

    const cart = Store.getCart();
    if (cart.length === 0) {
        setTimeout(() => Router.navigate('/cart'), 0);
        return `<div class="container text-center mt-5"><p>Keranjang kosong. Mengarahkan...</p></div>`;
    }

    const user = await Auth.getCurrentUser();
    const firstCartItem = cart[0];
    const firstProduct = await Store.getProduct(firstCartItem.productId);
    const sellerId = firstProduct.sellerId;
    const seller = await Store.getUser(sellerId) || { name: 'Penjual', phone: '-', address: '-' };
    const sellerLapak = await Store.getLapak(sellerId) || {};
    const userUnit = user.eselon2 || user.eselon1 || '';

    // Determine which payment methods are enabled (fallback to showing all if none are set)
    const hasPaymentSettings = sellerLapak && (sellerLapak.paymentTransfer || sellerLapak.paymentQris || sellerLapak.paymentCod);
    const showTransfer = !hasPaymentSettings || (sellerLapak && sellerLapak.paymentTransfer);
    const showQris = !hasPaymentSettings || (sellerLapak && sellerLapak.paymentQris);
    const showCod = !hasPaymentSettings || (sellerLapak && sellerLapak.paymentCod);

    // Pick default method
    let defaultMethod = 'transfer';
    if (!showTransfer) {
        if (showQris) defaultMethod = 'qris';
        else if (showCod) defaultMethod = 'cod';
    }
    
    let cartHtml = '';
    let total = 0;
    let itemNumber = 0;

    for (const item of cart) {
        const product = await Store.getProduct(item.productId);
        if (product) {
            itemNumber++;
            const subtotal = product.price * item.qty;
            total += subtotal;
            cartHtml += `
                <div class="cart-summary-row flex flex-between text-sm" style="padding: 2px 0; margin-bottom: 2px; line-height: 1.2;">
                    <div class="flex" style="gap: 6px; align-items: flex-start;">
                        <span class="text-gray-800 font-semibold">${itemNumber}.</span>
                        <div class="flex flex-col">
                            <span class="product-name font-semibold text-gray-800">${product.name}</span>
                            <span class="text-xs text-muted" style="margin-top: 1px;">${item.qty} x ${formatRupiah(product.price)}</span>
                        </div>
                    </div>
                    <span class="font-semibold text-gray-800 text-right" style="margin-left: auto; align-self: flex-start; padding-top: 1px;">${formatRupiah(subtotal)}</span>
                </div>
            `;
        }
    }

    return `
        <style>
            .checkout-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
            @media (min-width: 768px) {
                .checkout-grid {
                    grid-template-columns: 2fr 1fr;
                }
            }
            @media (max-width: 767px) {
                .checkout-page.container {
                    padding-left: 0.75rem !important;
                    padding-right: 0.75rem !important;
                    margin-top: 1rem !important;
                }
                .checkout-section .card-body {
                    padding: 1rem !important;
                }
                .bank-details-grid {
                    grid-template-columns: max-content 10px 1fr !important;
                }
            }
        </style>
        <div class="checkout-page container mt-4 mb-5 fade-in">
            <h1 class="text-2xl font-heading font-bold mb-4 flex flex-center"><i data-lucide="package" class="mr-2 text-primary"></i> Checkout</h1>
            
            <div class="checkout-grid">
                <div class="checkout-left gap-4" style="display: flex; flex-direction: column; gap: 1rem;">
                    <!-- Ringkasan Pesanan (Order Summary) - Now First! -->
                    <div class="card checkout-section">
                        <div class="card-body">
                            <h2 class="text-xl font-heading mb-4 flex flex-center" style="margin: 0 0 1rem 0;"><span style="vertical-align:middle;">Ringkasan Pesanan</span></h2>
                            <div class="cart-summary" style="margin-bottom: 4px; padding: 0 !important; position: static !important;">
                                ${cartHtml}
                            </div>
                            <div style="border-top: 1px solid var(--border-glass); margin: 4px 0; padding-top: 4px;"></div>
                            <div class="flex flex-between text-sm" style="margin-bottom: 2px;">
                                <span class="text-muted">Subtotal</span>
                                <span class="font-semibold text-gray-800">${formatRupiah(total)}</span>
                            </div>
                            <div class="flex flex-between text-sm" style="margin-bottom: 4px;">
                                <span class="text-muted">Ongkir</span>
                                <span class="text-success font-semibold">Gratis</span>
                            </div>
                            <div class="flex flex-between text-base font-bold cart-summary-total" style="border-top: 1px dashed var(--border-glass); padding-top: 4px; margin-top: 4px;">
                                <span>Total</span>
                                <span class="text-primary">${formatRupiah(total)}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Lokasi Pengiriman (Shipping Location) - Now Second! -->
                    <div class="card checkout-section">
                        <div class="card-body">
                            <div class="flex justify-between align-center mb-4 pb-2 border-b" style="display: flex; justify-content: space-between; align-items: center;">
                                <h2 class="text-xl font-heading font-bold text-gray-800 flex flex-center mb-0" style="margin: 0;"><span style="vertical-align:middle;">Lokasi Pengiriman</span></h2>
                                <button type="button" id="btn-edit-address" class="btn btn-sm btn-outline px-3 py-1.5 font-semibold text-xs flex align-center" style="border-radius: var(--radius-sm);"><i data-lucide="edit" class="w-3.5 h-3.5 mr-1 inline" style="display:inline-block; vertical-align:middle;"></i> <span style="vertical-align:middle;">Edit</span></button>
                            </div>

                            <!-- Radio buttons (Always visible so user can choose method) -->
                            <div class="form-group mb-4 pb-3 border-b border-gray-100">
                                <label class="form-label font-bold text-sm block mb-2" style="color: var(--accent-primary);">Metode Penerimaan</label>
                                <div class="flex flex-col gap-2">
                                    <label class="flex align-center gap-2 cursor-pointer font-semibold text-sm">
                                        <input type="radio" name="delivery_method" value="antar" checked style="width: 1.1rem; height: 1.1rem; cursor: pointer;"> Antar ke Ruangan
                                    </label>
                                    <label class="flex align-center gap-2 cursor-pointer font-semibold text-sm">
                                        <input type="radio" name="delivery_method" value="ambil" style="width: 1.1rem; height: 1.1rem; cursor: pointer;"> Ambil Sendiri (di Ruangan Penjual)
                                    </label>
                                </div>
                            </div>

                            <!-- View Container (Read-Only) -->
                            <div id="address-view-container" class="flex flex-col gap-3" 
                                 data-user-name="${user.name}" 
                                 data-user-phone="${user.phone || ''}" 
                                 data-user-address="${user.address || ''}"
                                 data-seller-name="${seller.name}" 
                                 data-seller-phone="${seller.phone || ''}" 
                                 data-seller-address="${seller.address || ''}">
                                <!-- Info will be dynamically inserted here by JavaScript based on selected radio -->
                            </div>

                            <!-- Edit Container (Hidden by default) -->
                            <div id="address-edit-container" class="hidden pt-2">
                                <form id="checkout-address-form" class="flex flex-col gap-3">
                                    <div class="form-group" style="margin: 0;">
                                        <label class="text-xs font-semibold block mb-1">Nama Penerima</label>
                                        <input type="text" id="checkout-name" class="form-input p-2 border rounded text-sm bg-white" style="width: 100%;" value="${user.name}" required>
                                    </div>
                                    <div class="form-group" style="margin: 0;">
                                        <label class="text-xs font-semibold block mb-1">No. HP / WhatsApp (Aktif)</label>
                                        <input type="tel" id="checkout-phone" class="form-input p-2 border rounded text-sm bg-white" style="width: 100%;" value="${user.phone || ''}" required placeholder="Misal: 081234567890">
                                    </div>
                                    
                                    <div class="form-group" style="margin: 0;">
                                        <label class="text-xs font-semibold block mb-1">Unit Eselon / Bagian Ruangan</label>
                                        <input type="text" id="checkout-unit" class="form-input p-2 border rounded text-sm bg-white" style="width: 100%;" required placeholder="Bagian PEP Sekretariat Barenbang" value="${userUnit}">
                                    </div>
                                    <div class="form-group" style="margin: 0;">
                                        <label class="text-xs font-semibold block mb-1">Gedung</label>
                                        <select id="checkout-building" class="form-select p-2 border rounded text-sm bg-white cursor-pointer" style="width: 100%;" required>
                                            <option value="A">Gedung A</option>
                                            <option value="B">Gedung B</option>
                                        </select>
                                    </div>
                                    <div class="form-group" style="margin: 0;">
                                        <label class="text-xs font-semibold block mb-1">Lantai</label>
                                        <select id="checkout-floor" class="form-select p-2 border rounded text-sm bg-white cursor-pointer" style="width: 100%;" required>
                                            ${[1,2,3,4,5,6,7,8].map(l => `<option value="${l}">Lantai ${l}</option>`).join('')}
                                        </select>
                                    </div>
                                    
                                    <div class="flex gap-2 justify-end mt-2">
                                        <button type="button" id="btn-cancel-edit-address" class="btn btn-sm btn-outline py-1.5 px-3">Batal</button>
                                        <button type="button" id="btn-save-address" class="btn btn-sm btn-primary py-1.5 px-4 font-semibold text-white">Selesai</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Metode Pembayaran (Payment Method) - Now Third! -->
                    <div class="card checkout-section">
                        <div class="card-body">
                            <h2 class="text-xl font-heading mb-4 checkout-section-title flex flex-center">Metode Pembayaran</h2>
                            
                            <!-- Hidden values or data attributes for JS to read -->
                            <div class="grid grid-3 gap-4" id="payment-options-grid" data-default-method="${defaultMethod}">
                                ${showTransfer ? `
                                <div class="payment-option card p-4 cursor-pointer border-2 rounded text-center ${defaultMethod === 'transfer' ? 'selected border-primary bg-blue-50' : 'border-gray-200'}" data-method="transfer">
                                    <i data-lucide="credit-card" class="mx-auto mb-2 text-primary w-8 h-8"></i>
                                    <div class="font-semibold text-sm">Transfer Bank</div>
                                </div>
                                ` : ''}
                                
                                ${showQris ? `
                                <div class="payment-option card p-4 cursor-pointer border-2 rounded text-center ${defaultMethod === 'qris' ? 'selected border-primary bg-blue-50' : 'border-gray-200'}" data-method="qris">
                                    <i data-lucide="qr-code" class="mx-auto mb-2 text-primary w-8 h-8"></i>
                                    <div class="font-semibold text-sm">QRIS</div>
                                </div>
                                ` : ''}
                                
                                ${showCod ? `
                                <div class="payment-option card p-4 cursor-pointer border-2 rounded text-center ${defaultMethod === 'cod' ? 'selected border-primary bg-blue-50' : 'border-gray-200'}" data-method="cod">
                                    <i data-lucide="banknote" class="mx-auto mb-2 text-primary w-8 h-8"></i>
                                    <div class="font-semibold text-sm">COD</div>
                                </div>
                                ` : ''}
                            </div>

                            <!-- Detail Pembayaran Container -->
                            <div id="payment-details-container" class="mt-4 text-sm animate-fade-in" style="padding: 0 !important; border: none !important; background: transparent !important;"
                                 data-bank-name="${sellerLapak.bankName || ''}"
                                 data-bank-no="${sellerLapak.bankAccNo || ''}"
                                 data-bank-user="${sellerLapak.bankAccName || ''}"
                                 data-qris-image="${sellerLapak.qrisImage || ''}">
                                <!-- Will be filled dynamically by afterRender -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Side - Sticky Action Box -->
                <div class="checkout-right">
                    <div class="card sticky top-24">
                        <div class="card-body text-center p-5">
                            <div class="text-muted text-sm font-semibold mb-2">Total Pembayaran</div>
                            <div class="text-3xl font-bold text-primary mb-4" style="font-size: 2rem;">${formatRupiah(total)}</div>
                            <button id="btn-buat-pesanan" class="btn btn-primary btn-block btn-lg flex flex-center justify-center py-3 text-white font-semibold hover:shadow-lg transition-all" style="width: 100%;">
                                Buat Pesanan <i data-lucide="arrow-right" class="ml-2 w-5 h-5 inline" style="display:inline-block; vertical-align:middle;"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function afterRender(params) {
    if (window.lucide) window.lucide.createIcons();

    const user = await Auth.getCurrentUser();
    const cart = Store.getCart();
    
    // Load seller information
    let seller = { name: 'Penjual', phone: '-', address: '-' };
    if (cart.length > 0) {
        const firstProduct = await Store.getProduct(cart[0].productId);
        if (firstProduct) {
            const sellerUser = await Store.getUser(firstProduct.sellerId);
            if (sellerUser) {
                seller = sellerUser;
            }
        }
    }

    const viewContainer = document.getElementById('address-view-container');
    const editContainer = document.getElementById('address-edit-container');
    const btnEditAddress = document.getElementById('btn-edit-address');
    const btnCancelEditAddress = document.getElementById('btn-cancel-edit-address');
    const btnSaveAddress = document.getElementById('btn-save-address');

    // Read attributes from container
    const sName = viewContainer?.dataset.sellerName || 'Penjual';
    const sPhone = viewContainer?.dataset.sellerPhone || '-';
    const sAddress = viewContainer?.dataset.sellerAddress || 'Gedung Kemenaker (Hubungi Penjual)';

    const updateAddressView = () => {
        const method = document.querySelector('input[name="delivery_method"]:checked')?.value || 'antar';
        if (!viewContainer || !editContainer || !btnEditAddress) return;

        // Reset to view mode
        editContainer.classList.add('hidden');
        viewContainer.classList.remove('hidden');

        if (method === 'antar') {
            const name = document.getElementById('checkout-name').value.trim();
            const phone = document.getElementById('checkout-phone').value.trim();
            const building = document.getElementById('checkout-building').value;
            const floor = document.getElementById('checkout-floor').value;
            const unit = document.getElementById('checkout-unit').value.trim();

            // Default to profile address, but if edited, construct the new one
            let displayAddress = viewContainer.dataset.userAddress || '';
            if (name !== viewContainer.dataset.userName || phone !== viewContainer.dataset.userPhone || unit !== '') {
                displayAddress = `${unit}, Gedung ${building}, Lantai ${floor}`;
            }

            viewContainer.innerHTML = `
                <div>
                    <span class="font-bold text-xs block text-gray-500 mb-0.5">Nama Penerima</span>
                    <div class="p-2.5 border rounded-md bg-gray-50 text-gray-800 text-sm font-semibold">${name || '<em class="text-muted text-xs">Belum diisi</em>'}</div>
                </div>
                <div>
                    <span class="font-bold text-xs block text-gray-500 mb-0.5">No. HP / WhatsApp</span>
                    <div class="p-2.5 border rounded-md bg-gray-50 text-gray-800 text-sm font-semibold">${phone || '<em class="text-muted text-xs">Belum diisi</em>'}</div>
                </div>
                <div>
                    <span class="font-bold text-xs block text-gray-500 mb-0.5">Pengiriman</span>
                    <div class="p-2.5 border rounded-md bg-gray-50 text-gray-800 text-sm font-semibold" style="min-height: 50px; white-space: pre-wrap;">${displayAddress || '<em class="text-muted text-xs">Belum diisi</em>'}</div>
                </div>
            `;
            btnEditAddress.style.display = 'block';
        } else {
            // Option "ambil"
            viewContainer.innerHTML = `
                <div>
                    <span class="font-bold text-xs block text-gray-500 mb-0.5">Nama Pemilik Warung</span>
                    <div class="p-2.5 border rounded-md bg-gray-50 text-gray-800 text-sm font-semibold">${sName}</div>
                </div>
                <div>
                    <span class="font-bold text-xs block text-gray-500 mb-0.5">No. HP / WhatsApp</span>
                    <div class="p-2.5 border rounded-md bg-gray-50 text-gray-800 text-sm font-semibold">${sPhone}</div>
                </div>
                <div>
                    <span class="font-bold text-xs block text-gray-500 mb-0.5">Pengambilan</span>
                    <div class="p-2.5 border rounded-md bg-gray-50 text-gray-800 text-sm font-semibold" style="min-height: 50px; white-space: pre-wrap;">${sAddress}</div>
                </div>
            `;
            btnEditAddress.style.display = 'none';
        }
    };

    // Toggle logic
    btnEditAddress?.addEventListener('click', () => {
        viewContainer?.classList.add('hidden');
        editContainer?.classList.remove('hidden');
        if (btnEditAddress) btnEditAddress.style.display = 'none';
    });

    btnCancelEditAddress?.addEventListener('click', () => {
        editContainer?.classList.add('hidden');
        viewContainer?.classList.remove('hidden');
        if (btnEditAddress) btnEditAddress.style.display = 'block';
    });

    btnSaveAddress?.addEventListener('click', () => {
        const name = document.getElementById('checkout-name').value.trim();
        const phone = document.getElementById('checkout-phone').value.trim();
        const unit = document.getElementById('checkout-unit').value.trim();

        if (!name || !phone || !unit) {
            showToast('Harap lengkapi nama, No HP, dan Unit Kerja penerima', 'error');
            return;
        }

        updateAddressView();
    });

    // Listen to delivery method changes
    document.querySelectorAll('input[name="delivery_method"]').forEach(radio => {
        radio.addEventListener('change', updateAddressView);
    });

    // Initialize initial view
    updateAddressView();

    const updatePaymentDetails = (method) => {
        const detailsContainer = document.getElementById('payment-details-container');
        if (!detailsContainer) return;

        const bankName = detailsContainer.dataset.bankName;
        const bankNo = detailsContainer.dataset.bankNo;
        const bankUser = detailsContainer.dataset.bankUser;
        const qrisImage = detailsContainer.dataset.qrisImage;

        if (method === 'transfer') {
            detailsContainer.innerHTML = `
                <div class="font-semibold text-gray-800 mb-2"><i data-lucide="info" class="w-4 h-4 mr-1 inline" style="vertical-align:middle;"></i> <span style="vertical-align:middle;">Informasi Rekening Penjual:</span></div>
                <div class="bank-details-grid text-sm font-semibold text-gray-700" style="display: grid; grid-template-columns: max-content 15px 1fr; gap: 6px 0; align-items: center; font-family: inherit;">
                    <div style="white-space: nowrap;">Nama Bank</div>
                    <div>:</div>
                    <div class="text-gray-800" style="white-space: nowrap;">${bankName || '-'}</div>

                    <div style="white-space: nowrap;">No. Rekening</div>
                    <div>:</div>
                    <div class="text-gray-800" style="white-space: nowrap;">${bankNo || '-'}</div>

                    <div style="white-space: nowrap;">Nama Nasabah</div>
                    <div>:</div>
                    <div class="text-gray-800" style="white-space: nowrap;">${bankUser || '-'}</div>
                </div>
            `;
        } else if (method === 'qris') {
            detailsContainer.innerHTML = `
                <div class="font-semibold text-gray-800 mb-2"><i data-lucide="info" class="w-4 h-4 mr-1 inline" style="vertical-align:middle;"></i> <span style="vertical-align:middle;">Barcode QRIS Penjual:</span></div>
                <div class="text-center pt-2">
                    ${qrisImage ? `
                        <img src="${qrisImage}" alt="QRIS Penjual" style="max-width: 220px; border: 1.5px solid #e2e8f0; border-radius: 8px; margin: 0 auto; box-shadow: var(--shadow-sm);">
                        <p class="text-xs text-muted mt-2">Scan kode QRIS di atas untuk melakukan pembayaran secara instan.</p>
                    ` : `
                        <div class="p-4 text-center text-muted text-xs font-semibold">Gambar QRIS tidak tersedia. Hubungi penjual saat pengambilan.</div>
                    `}
                </div>
            `;
        } else {
            // COD
            detailsContainer.innerHTML = `
                <div class="font-semibold text-gray-800 mb-1"><i data-lucide="info" class="w-4 h-4 mr-1 inline" style="vertical-align:middle;"></i> <span style="vertical-align:middle;">Bayar di Tempat (COD):</span></div>
                <p class="text-xs text-muted">Pembayaran tunai dilakukan secara langsung ketika pesanan Anda diserahkan/diambil di ruangan.</p>
            `;
        }
        if (window.lucide) window.lucide.createIcons();
    };

    const optionsGrid = document.getElementById('payment-options-grid');
    let selectedMethod = optionsGrid?.dataset.defaultMethod || 'transfer';

    // Initialize payment details
    updatePaymentDetails(selectedMethod);

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
            updatePaymentDetails(selectedMethod);
        });
    });

    const showProofUploadModal = (onUploaded, onCancel) => {
        let modalContainer = document.getElementById('proof-modal-container');
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = 'proof-modal-container';
            document.body.appendChild(modalContainer);
        }

        modalContainer.innerHTML = `
            <div class="modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(3px);z-index:9999;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease-out;">
                <div class="modal-content scale-in text-left" style="background:white;border-radius:12px;width:90%;max-width:450px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);overflow:hidden;padding: 20px;">
                    <h3 class="text-lg font-bold text-gray-900 mb-3" style="font-family: var(--font-heading);">Unggah Bukti Pembayaran</h3>
                    <p class="text-sm text-gray-600 mb-4">Silakan unggah bukti transfer bank atau QRIS Anda sebelum melanjutkan pesanan.</p>
                    
                    <div style="margin-bottom: 15px;">
                        <input type="file" id="payment-proof-file" accept="image/*" class="form-input p-2 border rounded text-sm bg-white" style="width: 100%; cursor: pointer;" required>
                        <div id="payment-proof-preview-container" style="display: none; margin-top: 12px; text-align: center;">
                            <img id="payment-proof-preview" style="max-width: 100%; max-height: 180px; object-fit: contain; border-radius: 6px; border: 1px solid var(--border-glass);" />
                        </div>
                    </div>
                    
                    <div class="flex justify-end gap-3" style="border-top: 1px solid #f3f4f6; padding-top: 12px; display: flex; justify-content: flex-end; gap: 8px;">
                        <button type="button" id="btn-cancel-proof" class="btn btn-secondary" style="padding: 6px 12px; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">Batal</button>
                        <button type="button" id="btn-submit-proof" class="btn btn-primary" style="padding: 6px 12px; border: none; background: var(--accent-primary); color: white; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">Kirim & Buat Pesanan</button>
                    </div>
                </div>
            </div>
        `;

        let base64Proof = '';

        const fileInput = modalContainer.querySelector('#payment-proof-file');
        const previewContainer = modalContainer.querySelector('#payment-proof-preview-container');
        const previewImage = modalContainer.querySelector('#payment-proof-preview');
        const btnCancel = modalContainer.querySelector('#btn-cancel-proof');
        const btnSubmit = modalContainer.querySelector('#btn-submit-proof');

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    base64Proof = event.target.result;
                    previewImage.src = base64Proof;
                    previewContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });

        const close = () => {
            modalContainer.innerHTML = '';
        };

        btnCancel.addEventListener('click', () => {
            close();
            if (onCancel) onCancel();
        });

        btnSubmit.addEventListener('click', () => {
            if (!base64Proof) {
                showToast('Harap pilih file bukti pembayaran terlebih dahulu', 'error');
                return;
            }
            close();
            if (onUploaded) onUploaded(base64Proof);
        });
    };

    const btnSubmit = document.getElementById('btn-buat-pesanan');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', async () => {
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

            const viewContainer = document.getElementById('address-view-container');
            const uAddress = viewContainer?.dataset.userAddress || '';

            // Validation for "antar" method (only if there is no profile address, or if they tried to customize/edit it)
            if (deliveryType === 'antar' && !uAddress && (!name || !phone || !unit)) {
                showToast('Harap lengkapi nama, No HP, dan Unit Kerja penerima', 'error');
                return;
            }

            let fullAddress = '';
            if (deliveryType === 'antar') {
                if (name === viewContainer?.dataset.userName && 
                    phone === viewContainer?.dataset.userPhone && 
                    uAddress !== '') {
                    fullAddress = `Antar ke Ruangan (Alamat Profil): ${uAddress}`;
                } else {
                    fullAddress = `${unit}, Gedung ${building}, Lantai ${floor}`;
                }
            } else {
                fullAddress = `Ambil Sendiri (Ruangan Penjual: ${seller.name}, HP: ${seller.phone || '-'}, Alamat: ${seller.address || 'Gedung Kemenaker'})`;
            }

            const sellerItems = {};

            // Group by seller
            for (const cartItem of cart) {
                const product = await Store.getProduct(cartItem.productId);
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
            }

            // Kirim notifikasi WhatsApp ke penjual via Evolution API (melalui nginx proxy)
            const sendWANotification = async (sellerPhone, sellerName, orderId, items, totalPrice, buyerName, deliveryInfo, paymentMethodLabel) => {
                try {
                    const EVOLUTION_URL = '';  // Kosong = pakai proxy nginx /wa-api/
                    const EVOLUTION_APIKEY = 'cilebut-ONE.server:2026';
                    const EVOLUTION_INSTANCE = 'umkm_vercel-app';

                    // Format nomor: hilangkan 0 di awal, tambah 62
                    let phone = String(sellerPhone).replace(/\D/g, '');
                    if (phone.startsWith('0')) phone = '62' + phone.slice(1);
                    if (!phone.startsWith('62')) phone = '62' + phone;

                    const itemList = items.map((it, i) => `  ${i+1}. ${it.name} (${it.qty}x) — Rp ${it.price.toLocaleString('id-ID')}`).join('\n');
                    const message = 
`🛒 *PESANAN BARU MASUK!*
━━━━━━━━━━━━━━━━━━━━
📋 *No. Pesanan:* ${orderId}
👤 *Pembeli:* ${buyerName}
📦 *Pengiriman:* ${deliveryInfo}
💳 *Pembayaran:* ${paymentMethodLabel}

🧾 *Detail Pesanan:*
${itemList}

💰 *Total: Rp ${totalPrice.toLocaleString('id-ID')}*
━━━━━━━━━━━━━━━━━━━━
Silakan cek & proses pesanan di:
🔗 https://yuuk-jajan.cilebut-one.cloud/#/dashboard`;

                    const res = await fetch(`/wa-api/message/sendText/${EVOLUTION_INSTANCE}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': EVOLUTION_APIKEY
                        },
                        body: JSON.stringify({ number: phone, textMessage: { text: message } })
                    });
                    const resData = await res.json().catch(() => ({}));
                    console.log('Evolution API Response (Checkout):', res.status, resData);
                } catch (err) {
                    console.warn('WA notification gagal (non-critical):', err.message);
                }
            };

            const executeCreateOrders = async (paymentProof = null) => {
                // Generate custom order ID in format SO.YYYY-MM.NNNN
                const orders = await Store.getAllOrders();
                const now = new Date();
                const yyyy = now.getFullYear();
                const mm = String(now.getMonth() + 1).padStart(2, '0');
                const prefix = `SO.${yyyy}-${mm}.`;
                
                // Find all existing orders starting with "SO." to keep a global running serial number
                const allSoOrders = orders.filter(o => o.id && o.id.startsWith('SO.'));
                let nextNum = 1;
                if (allSoOrders.length > 0) {
                    const nums = allSoOrders.map(o => {
                        const parts = o.id.split('.');
                        const numStr = parts[parts.length - 1];
                        const parsed = parseInt(numStr, 10);
                        return isNaN(parsed) ? 0 : parsed;
                    });
                    nextNum = Math.max(...nums) + 1;
                }

                const paymentLabels = { transfer: 'Transfer Bank', qris: 'QRIS', cod: 'COD / Bayar di Tempat' };
                const paymentMethodLabel = paymentLabels[selectedMethod] || selectedMethod;

                let serialOffset = 0;
                for (const sellerId of Object.keys(sellerItems)) {
                    const currentSerial = nextNum + serialOffset;
                    const nextNumStr = String(currentSerial).padStart(4, '0');
                    const customOrderId = `${prefix}${nextNumStr}`;
                    serialOffset++;

                    const items = sellerItems[sellerId];
                    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                    
                    await Store.addOrder({
                        id: customOrderId,
                        buyerId: user.id,
                        sellerId: sellerId,
                        items: items,
                        totalPrice: totalPrice,
                        address: fullAddress,
                        paymentMethod: selectedMethod,
                        paymentProof: paymentProof,
                        orderDate: now.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }),
                        status: 'pending'
                    });

                    // Kirim notifikasi WA ke penjual (non-blocking)
                    let sellerPhone = null;
                    let sellerName = 'Penjual';

                    const sellerData = await Store.getUser(sellerId);
                    if (sellerData?.phone) {
                        sellerPhone = sellerData.phone;
                        sellerName = sellerData.name || sellerName;
                    } else {
                        const lapakData = await Store.getLapak(sellerId);
                        if (lapakData?.phone) {
                            sellerPhone = lapakData.phone;
                            sellerName = lapakData.name || sellerName;
                        }
                    }

                    if (sellerPhone) {
                        sendWANotification(
                            sellerPhone,
                            sellerName,
                            customOrderId,
                            items,
                            totalPrice,
                            user.name,
                            fullAddress,
                            paymentMethodLabel
                        );
                    } else {
                        console.warn('⚠️ Tidak dapat mengirim WA: Nomor HP penjual tidak ditemukan untuk sellerId:', sellerId);
                    }
                }

                Store.clearCart();
                showToast('Pesanan berhasil dibuat!', 'success');
                Router.navigate('/orders');
            };

            if (selectedMethod === 'transfer' || selectedMethod === 'qris') {
                // Show modal for proof upload
                showProofUploadModal(
                    (base64Proof) => {
                        // Success callback
                        executeCreateOrders(base64Proof);
                    },
                    () => {
                        // Cancel callback
                        showToast('Pembuatan pesanan dibatalkan', 'info');
                    }
                );
            } else {
                // COD - proceed immediately
                await executeCreateOrders();
            }
        });
    }
}
