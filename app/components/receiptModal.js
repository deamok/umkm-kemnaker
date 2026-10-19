import Store from '../store.js';
import Auth from '../auth.js';
import { formatRupiah, formatIndonesianDate, parseFlexibleDate, showToast, escapeHtml } from '../utils.js';

/**
 * Menampilkan Modal Nota / Struk Pembelian
 * @param {string|object} orderOrId - ID pesanan atau objek pesanan
 */
export async function showReceiptModal(orderOrId) {
    let order = null;
    if (typeof orderOrId === 'string') {
        order = await Store.getOrder(orderOrId);
    } else {
        order = orderOrId;
    }

    if (!order) {
        showToast('Data pesanan tidak ditemukan.', 'error');
        return;
    }

    // Ambil data penjual dan pembeli
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;

    const [seller, sellerLapak, buyer] = await Promise.all([
        sellerId ? Store.getUser(sellerId).catch(() => null) : null,
        sellerId ? Store.getLapak(sellerId).catch(() => null) : null,
        buyerId ? Store.getUser(buyerId).catch(() => null) : null
    ]);

    const sellerName = sellerLapak?.name || seller?.warungName || seller?.name || 'Warung Digital UMKM';
    const sellerPhone = sellerLapak?.phone || seller?.phone || '';
    const sellerLocation = [
        sellerLapak?.gedung || seller?.gedung,
        sellerLapak?.lantai ? `Lantai ${sellerLapak.lantai}` : (seller?.lantai ? `Lantai ${seller.lantai}` : ''),
        sellerLapak?.ruangan || seller?.ruangan || sellerLapak?.bagian || seller?.bagian
    ].filter(Boolean).join(', ');

    const buyerName = buyer?.name || 'Pembeli';
    const buyerPhone = buyer?.phone || '';
    const buyerAddress = order.address || buyer?.address || '-';

    // Format tanggal & waktu
    let orderDateObj = null;
    if (order.createdAt) {
        orderDateObj = new Date(order.createdAt);
    } else if (order.orderDate) {
        orderDateObj = parseFlexibleDate(order.orderDate);
    }
    if (!orderDateObj || isNaN(orderDateObj.getTime())) {
        orderDateObj = new Date();
    }

    const formattedDate = orderDateObj.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const formattedTime = orderDateObj.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Format Status
    const statusMap = {
        'pending': { text: 'Menunggu', color: '#f59e0b', bg: '#fef3c7' },
        'processing': { text: 'Diproses', color: '#3b82f6', bg: '#dbeafe' },
        'shipped': { text: 'Dikirim', color: '#8b5cf6', bg: '#ede9fe' },
        'completed': { text: 'Selesai', color: '#10b981', bg: '#d1fae5' },
        'cancelled': { text: 'Dibatalkan', color: '#ef4444', bg: '#fee2e2' }
    };
    const statusInfo = statusMap[order.status] || { text: order.status || 'Pesanan', color: '#6b7280', bg: '#f3f4f6' };

    // Format Metode Pembayaran
    const paymentLabel = {
        'transfer': 'Transfer Bank',
        'qris': 'QRIS',
        'cod': 'COD (Bayar di Tempat)'
    }[order.paymentMethod] || order.paymentMethod || 'Tunai';

    // Info Estimasi Pengiriman jika ada
    const savedDeliveryDate = order.estimatedDelivery ? formatIndonesianDate(order.estimatedDelivery, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';
    const deliverySchedule = savedDeliveryDate ? `${savedDeliveryDate} ${order.deliveryTime ? `(${order.deliveryTime})` : ''}` : '';

    // Siapkan teks nota untuk WhatsApp / Clipboard
    const waItemsList = (order.items || []).map((it, idx) => {
        const itemSubtotal = (it.price || 0) * (it.qty || 1);
        return `${idx + 1}. ${it.name} (${it.qty}x) = ${formatRupiah(itemSubtotal)}`;
    }).join('\n');

    const rawWaText = `*NOTA PEMBELIAN - UMKM KEMNAKER*
----------------------------------------
No. Nota: *#${order.id}*
Tanggal: ${formattedDate} (${formattedTime} WIB)
Toko: *${sellerName}*
----------------------------------------
*Data Pemesan:*
Nama: ${buyerName}
Alamat/Lokasi: ${buyerAddress}
----------------------------------------
*Rincian Belanja:*
${waItemsList}

*Total Belanja:* *${formatRupiah(order.totalPrice || 0)}*
Metode Bayar: ${paymentLabel}
Status: *${statusInfo.text.toUpperCase()}*
${deliverySchedule ? `Jadwal Tiba: ${deliverySchedule}\n` : ''}----------------------------------------
_Terima kasih telah berbelanja di UMKM Kemnaker!_`;

    // Pastikan container ada di DOM
    let container = document.getElementById('receipt-modal-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'receipt-modal-container';
        document.body.appendChild(container);
    }

    container.innerHTML = `
        <div id="receipt-modal-overlay" class="receipt-overlay" style="position:fixed;inset:0;background:rgba(15,23,42,0.65);backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:12px;overflow-y:auto;">
            <div class="receipt-modal-card" style="background:#ffffff;border-radius:16px;width:100%;max-width:540px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);overflow:hidden;display:flex;flex-direction:column;max-height:92vh;animation:modalScale 0.25s cubic-bezier(0.16, 1, 0.3, 1);">
                
                <!-- Action Bar (Sticky Top) - NO PRINT -->
                <div class="receipt-action-bar no-print" style="padding:12px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-weight:700;font-size:0.95rem;color:#1e293b;display:flex;align-items:center;gap:6px;">
                            <i data-lucide="receipt" style="width:18px;height:18px;color:#2563eb;"></i> Nota Transaksi
                        </span>
                    </div>
                    <div style="display:flex;align-items:center;gap:6px;">
                        <button id="btn-print-receipt" class="btn btn-sm btn-primary" style="padding:6px 12px;font-size:0.85rem;background:#2563eb;color:#ffffff;border:none;border-radius:8px;display:flex;align-items:center;gap:5px;cursor:pointer;">
                            <i data-lucide="printer" style="width:15px;height:15px;"></i> Cetak / PDF
                        </button>
                        <button id="btn-share-receipt" class="btn btn-sm" style="padding:6px 12px;font-size:0.85rem;background:#22c55e;color:#ffffff;border:none;border-radius:8px;display:flex;align-items:center;gap:5px;cursor:pointer;">
                            <i data-lucide="share-2" style="width:15px;height:15px;"></i> WA
                        </button>
                        <button id="btn-copy-receipt" class="btn btn-sm btn-outline" style="padding:6px 10px;font-size:0.85rem;border:1px solid #cbd5e1;background:#ffffff;color:#475569;border-radius:8px;cursor:pointer;" title="Salin Teks Nota">
                            <i data-lucide="copy" style="width:15px;height:15px;"></i>
                        </button>
                        <button id="btn-close-receipt" class="btn-icon" style="background:transparent;border:none;color:#64748b;padding:6px;cursor:pointer;border-radius:6px;display:flex;align-items:center;justify-content:center;" title="Tutup">
                            <i data-lucide="x" style="width:20px;height:20px;"></i>
                        </button>
                    </div>
                </div>

                <!-- Printable Area -->
                <div id="receipt-printable-area" style="padding:24px 28px;overflow-y:auto;color:#1e293b;background:#ffffff;font-family:'Inter',system-ui,-apple-system,sans-serif;">
                    
                    <!-- Header Nota -->
                    <div style="text-align:center;border-bottom:2px dashed #cbd5e1;padding-bottom:16px;margin-bottom:16px;">
                        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:6px;">
                            <img src="img/umkm.png" alt="UMKM Kemnaker" style="max-height:36px;width:auto;mix-blend-mode:multiply;" onerror="this.style.display='none'">
                        </div>
                        <h2 style="margin:4px 0 2px 0;font-size:1.25rem;font-weight:800;letter-spacing:-0.02em;color:#0f172a;">${escapeHtml(sellerName)}</h2>
                        ${sellerLocation ? `<div style="font-size:0.8rem;color:#64748b;margin-bottom:2px;">📍 ${escapeHtml(sellerLocation)}</div>` : ''}
                        ${sellerPhone ? `<div style="font-size:0.8rem;color:#64748b;">📞 WA: ${escapeHtml(sellerPhone)}</div>` : ''}
                        <div style="margin-top:8px;display:inline-block;padding:2px 10px;background:#f1f5f9;border-radius:999px;font-size:0.75rem;font-weight:700;letter-spacing:0.05em;color:#475569;text-transform:uppercase;">
                            BUKTI TRANSAKSI PEMBELIAN
                        </div>
                    </div>

                    <!-- Meta Info Grid -->
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.825rem;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #f1f5f9;">
                        <div>
                            <div style="color:#64748b;font-size:0.75rem;margin-bottom:2px;">NO. PESANAN / NOTA</div>
                            <div style="font-weight:700;color:#2563eb;font-family:monospace;font-size:0.9rem;">#${order.id}</div>
                            
                            <div style="color:#64748b;font-size:0.75rem;margin-top:8px;margin-bottom:2px;">TANGGAL & WAKTU</div>
                            <div style="font-weight:600;color:#334155;">${formattedDate}</div>
                            <div style="font-size:0.75rem;color:#64748b;">${formattedTime} WIB</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="color:#64748b;font-size:0.75rem;margin-bottom:2px;">STATUS PESANAN</div>
                            <div>
                                <span style="display:inline-block;padding:2px 8px;border-radius:6px;font-size:0.75rem;font-weight:700;color:${statusInfo.color};background:${statusInfo.bg};text-transform:capitalize;">
                                    ${statusInfo.text}
                                </span>
                            </div>

                            <div style="color:#64748b;font-size:0.75rem;margin-top:8px;margin-bottom:2px;">METODE BAYAR</div>
                            <div style="font-weight:600;color:#334155;">${paymentLabel}</div>
                        </div>
                    </div>

                    <!-- Data Pembeli & Tujuan -->
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:10px 14px;margin-bottom:16px;font-size:0.825rem;">
                        <div style="font-size:0.72rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px;">
                            Tujuan Pengantaran / Pembeli:
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                            <div>
                                <div style="font-weight:700;color:#0f172a;font-size:0.875rem;">${escapeHtml(buyerName)}</div>
                                <div style="color:#475569;margin-top:2px;">📍 ${escapeHtml(buyerAddress)}</div>
                            </div>
                            ${buyerPhone ? `<div style="color:#64748b;white-space:nowrap;font-size:0.78rem;">📞 ${escapeHtml(buyerPhone)}</div>` : ''}
                        </div>
                        ${deliverySchedule ? `
                            <div style="margin-top:8px;padding-top:6px;border-top:1px dashed #cbd5e1;display:flex;align-items:center;gap:6px;color:#15803d;font-weight:600;font-size:0.8rem;">
                                <span>🚚 Estimasi Tiba:</span> <span>${escapeHtml(deliverySchedule)}</span>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Tabel Item -->
                    <div style="margin-bottom:16px;">
                        <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
                            <thead>
                                <tr style="border-bottom:2px solid #e2e8f0;text-align:left;color:#475569;font-size:0.75rem;text-transform:uppercase;">
                                    <th style="padding:6px 0;width:55%;">Item</th>
                                    <th style="padding:6px 0;text-align:center;width:15%;">Qty</th>
                                    <th style="padding:6px 0;text-align:right;width:30%;">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(order.items || []).map(item => `
                                    <tr style="border-bottom:1px solid #f1f5f9;">
                                        <td style="padding:8px 0;vertical-align:top;">
                                            <div style="font-weight:600;color:#1e293b;">${escapeHtml(item.name)}</div>
                                            <div style="font-size:0.75rem;color:#64748b;">@ ${formatRupiah(item.price || 0)}</div>
                                        </td>
                                        <td style="padding:8px 0;text-align:center;vertical-align:top;font-weight:600;color:#334155;">
                                            ${item.qty || 1}
                                        </td>
                                        <td style="padding:8px 0;text-align:right;vertical-align:top;font-weight:700;color:#0f172a;">
                                            ${formatRupiah((item.price || 0) * (item.qty || 1))}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Total Perhitungan -->
                    <div style="border-top:2px dashed #cbd5e1;padding-top:12px;margin-bottom:20px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;font-size:0.825rem;color:#64748b;">
                            <span>Subtotal Belanja</span>
                            <span>${formatRupiah(order.totalPrice || 0)}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:0.825rem;color:#15803d;">
                            <span>Ongkos Kirim (Internal Kemnaker)</span>
                            <span style="font-weight:700;">GRATIS</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid #e2e8f0;font-size:1.1rem;font-weight:800;color:#0f172a;">
                            <span>Total Pembayaran</span>
                            <span style="color:#2563eb;">${formatRupiah(order.totalPrice || 0)}</span>
                        </div>
                    </div>

                    <!-- Footer Nota -->
                    <div style="text-align:center;padding-top:12px;border-top:1px dashed #cbd5e1;color:#64748b;font-size:0.75rem;line-height:1.4;">
                        <div style="font-weight:600;color:#334155;margin-bottom:2px;">Terima kasih atas pesanan Anda! 🙏</div>
                        <div>Lapak UMKM Pegawai Kemnaker • Jajan Tanpa Mikir Ongkir</div>
                    </div>
                </div>

                <!-- Footer Modal (No Print) -->
                <div class="no-print" style="padding:12px 20px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;justify-content:flex-end;align-items:center;gap:10px;">
                    <button id="btn-close-bottom" class="btn btn-secondary btn-sm" style="padding:7px 16px;border-radius:8px;border:1px solid #cbd5e1;background:#ffffff;color:#334155;cursor:pointer;font-weight:600;">
                        Tutup
                    </button>
                    <button id="btn-print-bottom" class="btn btn-primary btn-sm" style="padding:7px 18px;border-radius:8px;background:#2563eb;color:#ffffff;border:none;cursor:pointer;font-weight:600;display:flex;align-items:center;gap:6px;">
                        <i data-lucide="printer" style="width:16px;height:16px;"></i> Cetak Nota
                    </button>
                </div>

            </div>
        </div>
    `;

    // Inject CSS khusus print & animasi jika belum ada
    if (!document.getElementById('receipt-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'receipt-modal-styles';
        style.innerHTML = `
            @keyframes modalScale {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @media print {
                /* Sembunyikan semua elemen di luar area nota */
                body * {
                    visibility: hidden !important;
                }
                #receipt-modal-container,
                #receipt-modal-container #receipt-modal-overlay,
                #receipt-printable-area,
                #receipt-printable-area * {
                    visibility: visible !important;
                }
                #receipt-modal-overlay {
                    position: static !important;
                    background: transparent !important;
                    backdrop-filter: none !important;
                    padding: 0 !important;
                    display: block !important;
                    overflow: visible !important;
                }
                .receipt-modal-card {
                    box-shadow: none !important;
                    border: none !important;
                    border-radius: 0 !important;
                    max-width: 100% !important;
                    width: 100% !important;
                    max-height: none !important;
                    overflow: visible !important;
                }
                #receipt-printable-area {
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    background: white !important;
                    color: black !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                .no-print {
                    display: none !important;
                }
                @page {
                    size: auto;
                    margin: 10mm;
                }
            }
        `;
        document.head.appendChild(style);
    }

    if (window.lucide) {
        window.lucide.createIcons({ nodes: [container] });
    }

    // Fungsi tutup modal
    const closeReceipt = () => {
        container.innerHTML = '';
    };

    // Event listener: Tutup saat klik luar
    container.querySelector('#receipt-modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'receipt-modal-overlay') closeReceipt();
    });

    container.querySelector('#btn-close-receipt')?.addEventListener('click', closeReceipt);
    container.querySelector('#btn-close-bottom')?.addEventListener('click', closeReceipt);

    // Event listener: Cetak
    const handlePrint = () => {
        window.print();
    };
    container.querySelector('#btn-print-receipt')?.addEventListener('click', handlePrint);
    container.querySelector('#btn-print-bottom')?.addEventListener('click', handlePrint);

    // Event listener: Salin Teks Nota
    container.querySelector('#btn-copy-receipt')?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(rawWaText);
            showToast('Teks nota berhasil disalin ke clipboard!', 'success');
        } catch (err) {
            // Fallback copy
            const textarea = document.createElement('textarea');
            textarea.value = rawWaText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('Teks nota berhasil disalin!', 'success');
        }
    });

    // Event listener: Kirim / Buka WhatsApp
    container.querySelector('#btn-share-receipt')?.addEventListener('click', () => {
        const encoded = encodeURIComponent(rawWaText);
        const currentUserId = localStorage.getItem('elapak_current_user');
        let targetPhone = (currentUserId === buyerId) ? sellerPhone : buyerPhone;
        if (!targetPhone) targetPhone = buyerPhone || sellerPhone || '';

        let p = String(targetPhone || '').replace(/\D/g, '');
        if (p.startsWith('0')) p = '62' + p.slice(1);
        if (p && !p.startsWith('62')) p = '62' + p;

        if (p) {
            window.open(`https://wa.me/${p}?text=${encoded}`, '_blank');
        } else {
            window.open(`https://wa.me/?text=${encoded}`, '_blank');
        }
    });
}
