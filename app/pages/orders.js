import Store from '../store.js';
import Auth from '../auth.js';
import Router from '../router.js';
import { showToast, timeAgo, formatIndonesianDate, formatRupiah, escapeHtml } from '../utils.js';

export async function render(params) {
    if (!Auth.isLoggedIn()) {
        setTimeout(() => Router.navigate('/login'), 0);
        return `<div class="container text-center mt-5"><p>Mengarahkan ke halaman login...</p></div>`;
    }

    const user = await Auth.getCurrentUser();
    const orders = await Store.getOrders(user.id);

    const renderBuyerOrderRow = async (order, index) => {
        const sellerLapak = await Store.getLapak(order.sellerId);
        const seller = await Store.getUser(order.sellerId);
        const sellerName = sellerLapak?.name || seller?.warungName || seller?.name || 'Lapak tidak diketahui';

        const statusMap = {
            'pending': 'menunggu',
            'processing': 'proses',
            'shipped': 'kirim',
            'completed': 'selesai',
            'cancelled': 'dibatalkan'
        };
        const displayStatus = statusMap[order.status] || order.status;

        const savedDate = order.estimatedDelivery || '';
        const formattedSavedDate = savedDate ? formatIndonesianDate(savedDate, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';

        const paymentMethodLabel = {
            'transfer': 'Transfer Bank',
            'qris': 'QRIS',
            'cod': 'COD'
        }[order.paymentMethod] || order.paymentMethod || '-';

        return `
            <tr class="border-b hover:bg-gray-100 transition-colors cursor-pointer" onclick="this.nextElementSibling.classList.toggle('hidden')">
                <td class="font-semibold text-sm text-center" style="padding: 6px;">${index + 1}</td>
                <td class="text-left" style="padding: 6px;">
                    <div class="font-semibold text-primary text-sm">#${order.id}</div>
                    <div class="text-sm text-muted">${timeAgo(order.createdAt)}</div>
                </td>
                <td class="font-semibold text-sm text-left" style="padding: 6px;">${escapeHtml(sellerName)}</td>
                <td class="font-bold text-primary text-sm text-right" style="padding: 6px; padding-right: 12px;">${formatRupiah(order.totalPrice)}</td>
                <td class="text-center" style="padding: 6px;">
                    <span class="badge px-2 py-1 text-sm font-semibold capitalize text-secondary border border-gray-200 bg-gray-100" style="font-size: 14px; border-radius: var(--radius-full);">${displayStatus}</span>
                </td>
                <td class="text-center" style="padding: 6px;">
                    <button class="btn btn-sm btn-outline text-sm">Detail <i data-lucide="chevron-down" class="w-4 h-4 inline"></i></button>
                </td>
            </tr>
            <tr class="hidden bg-gray-50 border-b">
                <td colspan="6" style="padding: 0;">
                    <div style="position: sticky; left: 0; width: calc(100vw - 56px); max-width: 100%; box-sizing: border-box; padding: 6px; padding-left: 0;">
                        <div class="card p-3 md:p-4 border bg-white shadow-sm flex flex-col md:flex-row gap-4 text-sm" style="text-align: left; width: 100%; box-sizing: border-box; overflow: hidden;">
                            <div class="flex-1">
                                <h4 class="font-bold text-sm mb-2 text-gray-700">Daftar Item:</h4>
                                <ul class="list-disc pl-4 text-sm space-y-1 mb-2">
                                    ${order.items.map(i => `<li>${i.qty}x ${escapeHtml(i.name)} - ${formatRupiah(i.price)}</li>`).join('')}
                                </ul>
                                <div class="font-bold text-sm mt-2 text-primary border-t pt-2 border-gray-100 mb-3">Total: ${formatRupiah(order.totalPrice)}</div>
                                
                                <h4 class="font-bold text-sm mb-2 text-gray-700">Pembayaran:</h4>
                                <div class="text-sm space-y-1">
                                    <div><span class="text-gray-500">Metode:</span> <span class="font-semibold px-2 py-0.5 rounded-full border border-gray-200 bg-gray-50">${paymentMethodLabel}</span></div>
                                    ${((order.paymentMethod === 'transfer' || order.paymentMethod === 'qris') && order.paymentProof) ? `
                                        <div class="mt-2">
                                            <div class="text-gray-500 mb-1">Bukti Bayar:</div>
                                            <a href="${order.paymentProof}" target="_blank" class="inline-block" title="Klik untuk memperbesar">
                                                <img src="${order.paymentProof}" class="border rounded-md shadow-sm cursor-pointer hover:opacity-90 transition-opacity" style="max-height: 120px; max-width: 100%; object-fit: contain; background: #f9fafb;">
                                            </a>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                            <div class="flex-1" style="min-width: 250px;">
                                <h4 class="font-bold text-sm mb-2 text-gray-700">Aksi & Pengiriman:</h4>
                                ${order.estimatedDelivery ? `
                                    <div class="mb-3 p-2 rounded-lg text-sm" style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px;">
                                        <div class="font-semibold" style="color: #15803d;">Estimasi Tiba:</div>
                                        <div class="font-bold" style="color: #166534;">${formattedSavedDate} ${order.deliveryTime ? `(${order.deliveryTime})` : ''}</div>
                                    </div>
                                ` : `
                                    <div class="mb-3 p-2 rounded-lg text-sm bg-gray-50 border border-gray-200 text-gray-600">
                                        Waktu pengiriman belum diatur oleh penjual
                                    </div>
                                `}

                                <div class="flex flex-wrap gap-2 mt-3">
                                    ${order.status === 'shipped' ? `<button class="btn btn-sm btn-primary btn-confirm-order text-sm px-3 py-1.5" data-id="${order.id}">Konfirmasi Diterima</button>` : ''}
                                    ${order.status === 'pending' ? `<button class="btn btn-sm btn-danger btn-cancel-order text-sm px-3 py-1.5" data-id="${order.id}">Batalkan Pesanan</button>` : ''}
                                    <button class="btn-chat-seller-order btn btn-sm btn-outline text-sm px-3 py-1.5 flex items-center gap-1" 
                                            data-sellerid="${order.sellerId}" data-sellername="${escapeHtml(sellerName)}" data-buyerid="${order.buyerId}">
                                        <i data-lucide="message-square" class="w-4 h-4 inline"></i> Chat Penjual
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    };

    return `
        <div class="orders-page container mt-6 mb-10 fade-in">
            <h1 class="text-2xl font-heading font-bold mb-5 flex items-center"><i data-lucide="package" class="mr-2 text-primary w-6 h-6"></i> Pesanan Saya</h1>
            
            ${orders.length > 0 ? `
                <div class="border rounded-lg" style="overflow-x: auto; max-width: 100%; -webkit-overflow-scrolling: touch;">
                    <table class="w-full table-fixed text-left border-collapse text-sm font-sans" style="min-width: 700px;">
                        <thead class="border-b">
                            <tr>
                                <th class="text-sm font-semibold text-gray-700 text-center" style="width: 5%; padding: 6px; background-color: #f8fafc;">No.</th>
                                <th class="text-sm font-semibold text-gray-700 text-left" style="width: 30%; padding: 6px; background-color: #eff6ff;">ID & Waktu</th>
                                <th class="text-sm font-semibold text-gray-700 text-left" style="width: 15%; padding: 6px; background-color: #f0fdf4;">Penjual</th>
                                <th class="text-sm font-semibold text-gray-700 text-right" style="width: 20%; padding: 6px; padding-right: 12px; background-color: #fefce8;">Total Pesanan</th>
                                <th class="text-sm font-semibold text-gray-700 text-center" style="width: 15%; padding: 6px; background-color: #faf5ff;">Status</th>
                                <th class="text-sm font-semibold text-gray-700 text-center" style="width: 15%; padding: 6px; background-color: #fff1f2;">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(await Promise.all(orders.sort((a,b)=>b.createdAt-a.createdAt).map((order, index) => renderBuyerOrderRow(order, index)))).join('')}
                        </tbody>
                    </table>
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
                Router.handleRoute();
            }
        });
    });

    document.querySelectorAll('.btn-cancel-order').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if(confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
                const id = e.target.closest('button').dataset.id;
                await Store.updateOrderStatus(id, 'cancelled');
                showToast('Pesanan dibatalkan.', 'info');
                Router.handleRoute();
            }
        });
    });

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
