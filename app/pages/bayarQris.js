import Store from '../store.js';
import Router from '../router.js';
import { formatRupiah, escapeHtml } from '../utils.js';

export async function render(params) {
    const orderId = params?.orderId || Router.getParams()?.orderId || '';

    if (!orderId) {
        return `
            <div class="container mt-5 mb-5" style="max-width: 540px;">
                <div class="card p-4 text-center shadow-md" style="border-radius: 16px;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h2 class="text-xl font-bold mb-2">Parameter Pesanan Tidak Ditemukan</h2>
                    <p class="text-muted mb-4">Link ini membutuhkan No. Pesanan yang valid dari WhatsApp.</p>
                    <a href="#/orders" class="btn btn-primary">Ke Halaman Pesanan</a>
                </div>
            </div>
        `;
    }

    const order = await Store.getOrder(orderId);
    if (!order) {
        return `
            <div class="container mt-5 mb-5" style="max-width: 540px;">
                <div class="card p-4 text-center shadow-md" style="border-radius: 16px;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <h2 class="text-xl font-bold mb-2">Pesanan Tidak Ditemukan</h2>
                    <p class="text-muted mb-4">Pesanan <strong>#${escapeHtml(orderId)}</strong> tidak ditemukan.</p>
                    <a href="#/orders" class="btn btn-primary">Ke Halaman Pesanan</a>
                </div>
            </div>
        `;
    }

    const qrisImage = order.qrisNominalImage || '';
    const itemListHtml = (order.items || []).map((it, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 0; border-bottom: 1px dashed #e2e8f0; font-size: 0.875rem;">
            <div>
                <span class="font-semibold text-gray-800">${idx + 1}. ${escapeHtml(it.name)}</span>
                <span class="text-muted text-xs block">${it.qty}x @ ${formatRupiah(it.price)}</span>
            </div>
            <div class="font-bold text-gray-700">
                ${formatRupiah(it.price * it.qty)}
            </div>
        </div>
    `).join('');

    return `
        <div class="container mt-3 mb-5" style="max-width: 540px;">
            <div class="card shadow-lg" style="border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; background: #ffffff;">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 1.5rem 1rem; text-align: center;">
                    <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">📱</div>
                    <h1 class="text-xl font-bold" style="margin: 0; color: #ffffff;">QRIS Pembayaran TerasMOWI</h1>
                    <p style="margin: 0.35rem 0 0; font-size: 0.85rem; opacity: 0.95;">Silakan scan QRIS di bawah ini dengan m-Banking atau E-Wallet Anda</p>
                </div>

                <div class="card-body p-4" style="padding: 1.5rem 1.25rem;">

                    <!-- Tagihan Nominal Pas -->
                    <div style="background: #ecfdf5; border: 2px dashed #10b981; border-radius: 14px; padding: 1rem; text-align: center; margin-bottom: 1.5rem;">
                        <div style="font-size: 0.75rem; color: #047857; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem;">
                            TOTAL TAGIHAN NOMINAL PAS
                        </div>
                        <div style="font-size: 2.25rem; font-weight: 800; color: #065f46; letter-spacing: -0.5px; line-height: 1.2;">
                            ${formatRupiah(order.totalPrice)}
                        </div>
                        <div style="font-size: 0.8rem; color: #047857; margin-top: 0.35rem;">
                            📋 No. Pesanan: <strong>#${escapeHtml(order.id)}</strong>
                        </div>
                    </div>

                    <!-- Gambar QRIS -->
                    ${qrisImage ? `
                        <div style="text-align: center; margin-bottom: 1.5rem;">
                            <div style="display: inline-block; padding: 10px; background: white; border-radius: 16px; border: 1px solid #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                                <img id="qris-image-view" src="${qrisImage}" alt="QRIS Tagihan Pas" style="max-height: 340px; max-width: 100%; border-radius: 10px; display: block; margin: 0 auto; object-fit: contain;">
                            </div>
                            <div style="margin-top: 1rem; display: flex; justify-content: center; gap: 0.75rem;">
                                <a id="btn-download-qris" href="${qrisImage}" download="QRIS_${escapeHtml(order.id)}.jpg" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 600;">
                                    📥 Unduh Gambar QRIS
                                </a>
                            </div>
                        </div>
                    ` : `
                        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 1.25rem; text-align: center; margin-bottom: 1.5rem; color: #92400e;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">⏳</div>
                            <strong>Gambar QRIS Sedang Diproses Penjual</strong>
                            <p style="font-size: 0.85rem; margin-top: 0.25rem;">Penjual sedang membuatkan kode QRIS nominal pas untuk pesanan ini. Silakan refresh halaman ini sebentar lagi.</p>
                        </div>
                    `}

                    <!-- Panduan Cara Bayar -->
                    <div style="background: #f8fafc; border-radius: 12px; padding: 1rem; border: 1px solid #e2e8f0; margin-bottom: 1.5rem; font-size: 0.85rem;">
                        <h4 style="font-weight: 700; margin-bottom: 0.5rem; color: #334155;">Cara Pembayaran:</h4>
                        <ol style="margin: 0; padding-left: 1.2rem; color: #475569; line-height: 1.6;">
                            <li>Buka aplikasi m-Banking (BCA, Mandiri, BRI, BNI) atau E-Wallet (GoPay, OVO, Dana, ShopeePay).</li>
                            <li>Pilih menu <strong>Scan / Bayar QRIS</strong>.</li>
                            <li>Arahkan kamera ke kode QRIS di atas (atau pilih dari galeri jika sudah diunduh).</li>
                            <li>Pastikan nama penerima <strong>TerasMOWI</strong> dan nominal pas <strong>${formatRupiah(order.totalPrice)}</strong>.</li>
                            <li>Selesaikan pembayaran. Pesanan Anda akan segera disiapkan!</li>
                        </ol>
                    </div>

                    <!-- Rincian Pesanan -->
                    <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem;">
                        <div class="font-bold text-gray-700 text-sm mb-2" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem;">
                            🧾 Rincian Pesanan:
                        </div>
                        ${itemListHtml}
                        <div style="margin-top: 0.75rem; font-size: 0.85rem; color: #64748b;">
                            📍 <strong>Pengantaran:</strong> ${escapeHtml(order.address || '-')}
                        </div>
                    </div>

                    <!-- Tombol Navigasi -->
                    <div style="text-align: center; display: flex; flex-direction: column; gap: 0.5rem;">
                        <a href="#/orders" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.75rem; font-weight: 600;">
                            Lihat Semua Pesanan Saya
                        </a>
                        <a href="#/" class="btn btn-outline" style="width: 100%; justify-content: center;">
                            Kembali ke Beranda
                        </a>
                    </div>

                </div>
            </div>
        </div>
    `;
}

export async function afterRender() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
