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
            'pending': { label: 'Menunggu', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
            'processing': { label: 'Diproses', class: 'bg-blue-100 text-blue-800 border-blue-200' },
            'shipped': { label: 'Dikirim', class: 'bg-teal-100 text-teal-800 border-teal-200' },
            'completed': { label: 'Selesai', class: 'bg-green-100 text-green-800 border-green-200' },
            'cancelled': { label: 'Dibatalkan', class: 'bg-red-100 text-red-800 border-red-200' }
        };

        const statusInfo = statusMap[order.status] || statusMap['pending'];
        const seller = await Store.getLapak(order.sellerId);
        const sellerName = seller ? seller.name : 'Lapak tidak diketahui';

        const itemsHtml = order.items.map(item => `
            <div class="flex flex-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div class="w-12 h-12 rounded flex-center text-2xl flex-shrink-0">${item.image || '📦'}</div>
                <div class="flex-grow">
                    <div class="font-medium text-sm">${item.name}</div>
                    <div class="text-xs text-muted">${item.qty} x Rp ${item.price.toLocaleString('id-ID')}</div>
                </div>
            </div>
        `).join('');

        let actionHtml = '';
        if (order.status === 'shipped') {
            actionHtml = `<button class="btn btn-sm btn-primary btn-confirm-order md:w-auto mt-3 md:mt-0" style="width: 100%;" data-id="${order.id}">Konfirmasi Diterima</button>`;
        } else if (order.status === 'pending') {
            actionHtml = `<button class="btn btn-sm btn-danger btn-cancel-order md:w-auto mt-3 md:mt-0" style="width: 100%;" data-id="${order.id}">Batalkan Pesanan</button>`;
        }

        return `
            <div class="order-card card mb-4 overflow-hidden border hover:shadow-md transition-shadow">
                <div class="order-header p-4 border-b flex flex-col flex-row md:flex-between md:items-center gap-2">
                    <div>
                        <div class="text-xs text-muted mb-1 flex flex-center"><i data-lucide="clock" class="w-3 h-3 mr-1"></i> ${timeAgo(order.createdAt)}</div>
                        <div class="order-id font-mono text-sm font-semibold text-secondary">Order ID: #${order.id.substring(0, 8)}</div>
                    </div>
                    <span class="badge border px-3 py-1 text-xs font-semibold ${statusInfo.class}" style="border-radius: var(--radius-full);">${statusInfo.label}</span>
                </div>
                
                <div class="order-body p-4">
                    <div class="text-sm font-semibold text-secondary mb-3 flex flex-center"><i data-lucide="store" class="w-4 h-4 mr-1 text-primary"></i> ${sellerName}</div>
                    <div class="order-items mb-2">
                        ${itemsHtml}
                    </div>
                </div>

                <div class="order-footer p-4 border-t flex flex-col flex-row md:flex-between flex-center">
                    <div class="text-left md:w-auto mb-2 md:mb-0" style="width: 100%;">
                        <span class="text-sm text-muted">Total Pembayaran:</span>
                        <div class="text-lg font-bold text-primary">Rp ${order.totalPrice.toLocaleString('id-ID')}</div>
                    </div>
                    ${actionHtml}
                </div>
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
                Router.navigate('/orders'); 
            }
        });
    });

    document.querySelectorAll('.btn-cancel-order').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if(confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
                const id = e.target.closest('button').dataset.id;
                await Store.updateOrderStatus(id, 'cancelled');
                showToast('Pesanan dibatalkan.', 'info');
                Router.navigate('/orders');
            }
        });
    });
}
