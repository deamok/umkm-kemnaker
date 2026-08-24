import Store from '../store.js';
import Auth from '../auth.js';
import Router from '../router.js';
import { showToast, timeAgo } from '../utils.js';

export async function render(params) {
    if (!Auth.isLoggedIn()) {
        setTimeout(() => Router.navigate('/login'), 0);
        return `<div class="container text-center mt-5"><p>Mengarahkan ke halaman login...</p></div>`;
    }

    const user = await Auth.getCurrentUser();
    const orders = await Store.getOrders(user.id);

    const renderOrderCard = async (order) => {
        const statusMap = {
            'pending': { label: 'menunggu..', class: 'bg-yellow-100 text-yellow-800 border-yellow-200', bannerBg: '#d1fae5', bannerColor: '#065f46', bannerBorder: '#bbf7d0' },
            'processing': { label: 'Diproses', class: 'bg-blue-100 text-blue-800 border-blue-200', bannerBg: '#d1fae5', bannerColor: '#065f46', bannerBorder: '#bbf7d0' },
            'shipped': { label: 'Dikirim', class: 'bg-teal-100 text-teal-800 border-teal-200', bannerBg: '#d1fae5', bannerColor: '#065f46', bannerBorder: '#bbf7d0' },
            'completed': { label: 'Selesai', class: 'bg-green-100 text-green-800 border-green-200', bannerBg: '#d1fae5', bannerColor: '#065f46', bannerBorder: '#bbf7d0' },
            'cancelled': { label: 'transaksi dibatalkan penjual', class: 'bg-red-100 text-red-800 border-red-200', bannerBg: '#fee2e2', bannerColor: '#b91c1c', bannerBorder: '#fecaca' }
        };

        const statusInfo = statusMap[order.status] || statusMap['pending'];
        const seller = await Store.getLapak(order.sellerId);
        const sellerName = seller ? seller.name : 'Lapak tidak diketahui';

        // Date format: hari, dd/mm/yy ; hh:mm:ss
        const dateObj = new Date(order.createdAt);
        const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const dayName = dayNames[dateObj.getDay()];
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const yy = String(dateObj.getFullYear()).substring(2);
        const hh = String(dateObj.getHours()).padStart(2, '0');
        const min = String(dateObj.getMinutes()).padStart(2, '0');
        const ss = String(dateObj.getSeconds()).padStart(2, '0');
        const orderDateStr = `${dayName}, ${dd}/${mm}/${yy} ; ${hh}:${min}:${ss}`;

        const paymentMethodLabel = {
            'transfer': 'Transfer Bank',
            'qris': 'QRIS',
            'cod': 'COD (Bayar di Tempat)'
        }[order.paymentMethod] || order.paymentMethod || '-';

        let paymentStatusHtml = '';
        if (order.status === 'cancelled') {
            if (order.paymentMethod === 'transfer' || order.paymentMethod === 'qris') {
                paymentStatusHtml = `
                    <div class="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm">
                        <div class="flex items-center justify-between" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                            <div>
                                <span class="text-muted text-xs block">Metode Pembayaran</span>
                                <span class="font-bold text-gray-800">${paymentMethodLabel}</span>
                            </div>
                            <div class="text-right">
                                <span class="text-muted text-xs block">Status Pembayaran</span>
                                <span class="badge bg-red-100 text-red-800 border-red-200 border px-2 py-0.5 text-xs font-bold" style="border-radius: 4px;">dana akan ditransfer balik oleh penjual</span>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                paymentStatusHtml = `
                    <div class="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm">
                        <div class="flex items-center justify-between" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                            <div>
                                <span class="text-muted text-xs block">Metode Pembayaran</span>
                                <span class="font-bold text-gray-800">${paymentMethodLabel}</span>
                            </div>
                            <div class="text-right">
                                <span class="text-muted text-xs block">Status Pembayaran</span>
                                <span class="badge bg-red-100 text-red-800 border-red-200 border px-2 py-0.5 text-xs font-bold" style="border-radius: 4px;">- dibatalkan -</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        } else if (order.paymentMethod === 'transfer' || order.paymentMethod === 'qris') {
            paymentStatusHtml = `
                <div class="mt-3 p-3 bg-green-50 border border-green-200 rounded-md text-sm">
                    <div class="flex items-center justify-between" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                        <div>
                            <span class="text-muted text-xs block">Metode Pembayaran</span>
                            <span class="font-bold text-gray-800">${paymentMethodLabel}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-muted text-xs block">Status Pembayaran</span>
                            <span class="badge bg-green-100 text-green-800 border-green-200 border px-2 py-0.5 text-xs font-bold" style="border-radius: 4px;">LUNAS</span>
                        </div>
                    </div>
                    ${order.paymentProof ? `
                        <div class="mt-3 border-t border-green-100 pt-3">
                            <span class="text-xs text-muted block mb-1 font-semibold">Bukti Pembayaran:</span>
                            <div style="text-align: left;">
                                <img src="${order.paymentProof}" alt="Bukti Pembayaran" style="max-height: 180px; max-width: 100%; border-radius: 6px; border: 1px solid #c2f0c2; object-fit: contain; background: white;" />
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            if (order.status === 'completed') {
                paymentStatusHtml = `
                    <div class="mt-3 p-3 bg-green-50 border border-green-200 rounded-md text-sm">
                        <div class="flex items-center justify-between" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                            <div>
                                <span class="text-muted text-xs block">Metode Pembayaran</span>
                                <span class="font-bold text-gray-800">${paymentMethodLabel}</span>
                            </div>
                            <div class="text-right">
                                <span class="text-muted text-xs block">Status Pembayaran</span>
                                <span class="badge bg-green-100 text-green-800 border-green-200 border px-2 py-0.5 text-xs font-bold" style="border-radius: 4px;">LUNAS</span>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                paymentStatusHtml = `
                    <div class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
                        <div class="flex items-center justify-between" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                            <div>
                                <span class="text-muted text-xs block">Metode Pembayaran</span>
                                <span class="font-bold text-gray-800">${paymentMethodLabel}</span>
                            </div>
                            <div class="text-right">
                                <span class="text-muted text-xs block">Status Pembayaran</span>
                                <span class="badge bg-yellow-100 text-yellow-800 border-yellow-200 border px-2 py-0.5 text-xs font-bold" style="border-radius: 4px;">menunggu...</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        let actionHtml = '';
        if (order.status === 'shipped') {
            actionHtml = `<button class="btn btn-sm btn-primary btn-confirm-order md:w-auto" style="width: 100%;" data-id="${order.id}">Konfirmasi Diterima</button>`;
        } else if (order.status === 'pending') {
            actionHtml = `<button class="btn btn-sm btn-danger btn-cancel-order md:w-auto" style="width: 100%;" data-id="${order.id}">Batalkan Pesanan</button>`;
        }

        return `
            <div class="order-card card mb-4 overflow-hidden border hover:shadow-md transition-shadow">
                <div class="order-header p-4 border-b flex flex-col gap-1">
                    <div class="order-id font-mono font-semibold text-secondary" style="white-space: nowrap; font-size: 10pt;">Order ID: ${order.id}</div>
                    <div class="text-muted" style="font-size: 10pt;">${orderDateStr}</div>
                    ${order.estimatedDelivery ? `
                    <div class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 font-semibold flex flex-col gap-1">
                        <span>📦 Barang akan mendarat di meja:</span>
                        <span class="text-blue-900 font-bold">${new Date(order.estimatedDelivery).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} ${order.deliveryTime ? `(${order.deliveryTime})` : ''}</span>
                    </div>
                    ` : ''}
                </div>
                
                <!-- Status Pemesanan Box di bawah tanggal (selebar halaman/card, background dinamis, tinggi otomatis) -->
                <div style="background-color: ${statusInfo.bannerBg || '#d1fae5'}; color: ${statusInfo.bannerColor || '#065f46'}; padding: 10px 16px; font-weight: 700; text-align: center; font-size: 12pt; border-bottom: 1px solid ${statusInfo.bannerBorder || '#bbf7d0'}; width: 100%; line-height: normal;">
                    ${statusInfo.label}
                </div>

                <div class="order-body p-4">
                    <!-- Nama Warung dan tombol chat -->
                    <div class="text-sm font-semibold text-secondary mb-3" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                        <span>Nama warung : ${sellerName}</span>
                        <button class="btn-chat-seller-order flex items-center gap-1 text-xs font-semibold border border-primary text-primary hover:bg-primary hover:text-white transition-colors" 
                                style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 6px; cursor: pointer; background: none; font-size: 12px; color: var(--accent-primary); border: 1px solid var(--accent-primary);"
                                data-sellerid="${order.sellerId}" data-sellername="${sellerName}" data-buyerid="${order.buyerId}">
                            <i data-lucide="message-square" style="width: 13px; height: 13px;"></i>
                            Chat Penjual
                        </button>
                    </div>
                    
                    <!-- Tabel mepet kiri, lebar disesuaikan dengan isi (1 baris / nowrap), lebar boleh melewati layar -->
                    <div style="overflow-x: auto; margin-top: 0.5rem; margin-bottom: 0.5rem; width: 100%;">
                        <table class="text-sm text-left text-gray-700" style="width: max-content; border-collapse: collapse; margin-left: 0; padding-left: 0;">
                            <thead>
                                <tr style="border-bottom: 1px solid #e5e7eb;">
                                    <th style="padding: 8px 12px 8px 0; text-align: left; white-space: nowrap;">No.</th>
                                    <th style="padding: 8px 12px; text-align: left; white-space: nowrap;">Produk</th>
                                    <th style="padding: 8px 12px; text-align: center; white-space: nowrap;">Qty</th>
                                    <th style="padding: 8px 12px; text-align: right; white-space: nowrap;">Harga</th>
                                    <th style="padding: 8px 12px; text-align: right; white-space: nowrap;">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.items.map((item, index) => {
                                    const itemSubtotal = item.price * item.qty;
                                    return `
                                        <tr style="border-bottom: 1px solid #f3f4f6;">
                                            <td style="padding: 8px 12px 8px 0; text-align: left; white-space: nowrap;">${index + 1}.</td>
                                            <td style="padding: 8px 12px; text-align: left; white-space: nowrap;">${item.name}</td>
                                            <td style="padding: 8px 12px; text-align: center; white-space: nowrap;">${item.qty}</td>
                                            <td style="padding: 8px 12px; text-align: right; white-space: nowrap;">Rp ${item.price.toLocaleString('id-ID')}</td>
                                            <td style="padding: 8px 12px; text-align: right; font-weight: 600; white-space: nowrap;">Rp ${itemSubtotal.toLocaleString('id-ID')}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Posisi Total Bayar di bawah tabel -->
                    <div style="display: flex; justify-content: flex-start; align-items: center; gap: 8px; margin-top: 12px; margin-bottom: 12px;">
                        <span class="text-sm text-muted">Total Bayar:</span>
                        <span class="text-lg font-bold text-primary">Rp ${order.totalPrice.toLocaleString('id-ID')}</span>
                    </div>

                    ${paymentStatusHtml}
                </div>

                ${actionHtml ? `
                <div class="order-footer p-4 border-t flex justify-end">
                    ${actionHtml}
                </div>
                ` : ''}
            </div>
        `;
    };

    return `
        <div class="orders-page container mt-6 mb-10 fade-in">
            <h1 class="text-2xl font-heading font-bold mb-5 flex flex-center"><i data-lucide="package" class="mr-2 text-primary w-6 h-6"></i> Pesanan Saya</h1>
            
            <div class="mx-auto" style="max-width: 48rem;">
                ${orders.length > 0 ? `
                    <div class="order-list">
                        ${(await Promise.all(orders.sort((a,b) => b.createdAt - a.createdAt).map(o => renderOrderCard(o)))).join('')}
                    </div>
                ` : `
                    <div class="empty-state text-center py-16 card border">
                        <div class="flex flex-center justify-center mx-auto mb-4" style="width: 5rem; height: 5rem; border-radius: var(--radius-full);">
                            <i data-lucide="shopping-bag" class="w-10 h-10 text-muted"></i>
                        </div>
                        <h3 class="text-xl font-bold text-secondary">Belum ada pesanan</h3>
                        <p class="text-muted mt-2 mb-5">Anda belum pernah melakukan pemesanan.</p>
                        <a href="#/" class="btn btn-primary px-6 py-2 card inline-flex flex-center">Mulai Belanja <i data-lucide="arrow-right" class="ml-2 w-4 h-4"></i></a>
                    </div>
                `}
            </div>
        </div>
    `;
}

export async function afterRender(params) {
    if (window.lucide) window.lucide.createIcons();

    document.querySelectorAll('.btn-confirm-order').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if(confirm('Apakah Anda yakin telah menerima pesanan ini dengan baik?')) {
                const id = e.target.closest('button').dataset.id;
                await Store.updateOrderStatus(id, 'completed');
                showToast('Pesanan telah diselesaikan!', 'success');
                Router.handleRoute(); // Force a refresh of the page
            }
        });
    });

    document.querySelectorAll('.btn-cancel-order').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if(confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
                const id = e.target.closest('button').dataset.id;
                await Store.updateOrderStatus(id, 'cancelled');
                showToast('Pesanan dibatalkan.', 'info');
                Router.handleRoute(); // Force a refresh of the page
            }
        });
    });

    // Handler tombol Chat Penjual dari halaman pesanan
    document.querySelectorAll('.btn-chat-seller-order').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const button = e.target.closest('button');
            const sellerId = button.dataset.sellerid;
            const sellerName = button.dataset.sellername;

            const currentUser = await Auth.getCurrentUser();
            if (!currentUser) {
                showToast('Silakan login terlebih dahulu.', 'error');
                Router.navigate('/login');
                return;
            }
            if (currentUser.id === sellerId) {
                showToast('Anda tidak bisa chat dengan diri sendiri.', 'info');
                return;
            }

            button.disabled = true;
            button.innerHTML = '<i data-lucide="loader" style="width:13px;height:13px;"></i> Membuka...';
            if (window.lucide) window.lucide.createIcons();

            try {
                const chatId = await Store.getOrCreateChatRoom(
                    currentUser.id,
                    currentUser.name,
                    sellerId,
                    sellerName
                );
                Router.navigate('/chat/' + chatId);
            } catch (err) {
                console.error(err);
                showToast('Gagal membuka chat, coba lagi.', 'error');
                button.disabled = false;
                button.innerHTML = '<i data-lucide="message-square" style="width:13px;height:13px;"></i> Chat Penjual';
                if (window.lucide) window.lucide.createIcons();
            }
        });
    });
}
