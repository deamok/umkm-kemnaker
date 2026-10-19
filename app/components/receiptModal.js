import Store from '../store.js';
import Auth from '../auth.js';
import { formatRupiah, formatIndonesianDate, parseFlexibleDate, showToast, escapeHtml } from '../utils.js';

/**
 * Menampilkan Modal Nota / Struk Pembelian Sesuai Template Resmi
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

    const sellerName = sellerLapak?.name || seller?.warungName || seller?.name || 'TerasMOWI';
    const sellerPhone = sellerLapak?.phone || seller?.phone || '';
    
    // Susun alamat penjual
    const sellerLocationParts = [
        sellerLapak?.bagian || seller?.bagian,
        sellerLapak?.gedung || seller?.gedung,
        sellerLapak?.lantai ? `Lantai ${sellerLapak.lantai}` : (seller?.lantai ? `Lantai ${seller.lantai}` : ''),
        sellerLapak?.ruangan || seller?.ruangan
    ].filter(Boolean);
    const sellerLocation = sellerLocationParts.length > 0 
        ? sellerLocationParts.join(' ') 
        : (sellerLapak?.address || seller?.address || '');

    const buyerName = buyer?.name || 'Pelanggan';
    const buyerPhone = buyer?.phone || '';
    const buyerAddress = order.address || buyer?.address || '';

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
    const statusTextMap = {
        'pending': 'Menunggu',
        'processing': 'Diproses',
        'shipped': 'Dikirim',
        'completed': 'Selesai',
        'cancelled': 'Dibatalkan'
    };
    const statusText = statusTextMap[order.status] || order.status || 'Selesai';

    // Format Metode Pembayaran
    const paymentLabel = {
        'transfer': 'Transfer Bank',
        'qris': 'QRIS',
        'cod': 'COD (Bayar di Tempat)'
    }[order.paymentMethod] || order.paymentMethod || 'QRIS';

    // Siapkan teks nota untuk WhatsApp / Clipboard
    const waItemsList = (order.items || []).map((it, idx) => {
        const itemSubtotal = (it.price || 0) * (it.qty || 1);
        return `${idx + 1}. ${it.name} (${it.qty}x) = ${formatRupiah(itemSubtotal)}`;
    }).join('\n');

    const rawWaText = `*BUKTI TRANSAKSI PEMBELIAN*
*Lapak UMKM Pegawai Kemnaker*
----------------------------------------
Nama Warung: *${sellerName}*
${sellerLocation ? `Alamat: ${sellerLocation}\n` : ''}${sellerPhone ? `No. Telp: ${sellerPhone}\n` : ''}----------------------------------------
No. Pesanan / Nota : *#${order.id}*
Tanggal : ${formattedDate} (${formattedTime} WIB)
Status Pesanan : *${statusText}*
Metode Bayar : *${paymentLabel}*
----------------------------------------
*Pelanggan:*
${buyerName}
${buyerAddress ? `${buyerAddress}\n` : ''}${buyerPhone ? `${buyerPhone}\n` : ''}----------------------------------------
*Rincian Belanja:*
${waItemsList}
----------------------------------------
Subtotal Belanja : ${formatRupiah(order.totalPrice || 0)}
Ongkos Kirim (Internal Kemnaker) : GRATIS
*Total Pembayaran : ${formatRupiah(order.totalPrice || 0)}*
----------------------------------------
_Terima kasih atas pesanan Anda!_
_Lapak UMKM Pegawai Kemnaker • Jajan Tanpa Mikir Ongkir_`;

    // Pastikan container ada di DOM
    let container = document.getElementById('receipt-modal-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'receipt-modal-container';
        document.body.appendChild(container);
    }

    container.innerHTML = `
        <div id="receipt-modal-overlay" class="receipt-overlay" style="position:fixed;inset:0;background:rgba(15,23,42,0.65);backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:12px;overflow-y:auto;">
            <div class="receipt-modal-card" style="background:#ffffff;border-radius:12px;width:100%;max-width:680px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);overflow:hidden;display:flex;flex-direction:column;max-height:94vh;animation:modalScale 0.2s ease-out;">
                
                <!-- Action Bar (Sticky Top) - NO PRINT -->
                <div class="receipt-action-bar no-print" style="padding:12px 20px;background:#f8fafc;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-weight:700;font-size:0.95rem;color:#1e293b;display:flex;align-items:center;gap:6px;">
                            <i data-lucide="receipt" style="width:18px;height:18px;color:#2563eb;"></i> Bukti Transaksi
                        </span>
                    </div>
                    <div style="display:flex;align-items:center;gap:6px;">
                        <button id="btn-print-receipt" class="btn btn-sm btn-primary" style="padding:6px 14px;font-size:0.85rem;background:#2563eb;color:#ffffff;border:none;border-radius:6px;display:flex;align-items:center;gap:6px;cursor:pointer;">
                            <i data-lucide="printer" style="width:15px;height:15px;"></i> Cetak / PDF
                        </button>
                        <button id="btn-share-receipt" class="btn btn-sm" style="padding:6px 14px;font-size:0.85rem;background:#22c55e;color:#ffffff;border:none;border-radius:6px;display:flex;align-items:center;gap:6px;cursor:pointer;">
                            <i data-lucide="share-2" style="width:15px;height:15px;"></i> WA
                        </button>
                        <button id="btn-copy-receipt" class="btn btn-sm btn-outline" style="padding:6px 10px;font-size:0.85rem;border:1px solid #cbd5e1;background:#ffffff;color:#475569;border-radius:6px;cursor:pointer;" title="Salin Teks Nota">
                            <i data-lucide="copy" style="width:15px;height:15px;"></i>
                        </button>
                        <button id="btn-close-receipt" class="btn-icon" style="background:transparent;border:none;color:#64748b;padding:6px;cursor:pointer;border-radius:6px;display:flex;align-items:center;justify-content:center;" title="Tutup">
                            <i data-lucide="x" style="width:20px;height:20px;"></i>
                        </button>
                    </div>
                </div>

                <!-- Printable Area: Exactly Matching the Requested Invoice Layout -->
                <div id="receipt-printable-area" style="padding:40px 48px;overflow-y:auto;color:#1e293b;background:#ffffff;font-family:'Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.5;">
                    
                    <!-- Header: Logo & Title Centered -->
                    <div style="text-align:center;margin-bottom:28px;">
                        <div style="display:flex;justify-content:center;margin-bottom:12px;">
                            <img src="img/umkm.png" alt="UMKM Kemnaker" style="max-height:48px;width:auto;mix-blend-mode:multiply;" onerror="this.style.display='none'">
                        </div>
                        <h1 style="font-size:1.15rem;font-weight:800;letter-spacing:0.04em;color:#1e293b;margin:0;text-transform:uppercase;">BUKTI TRANSAKSI PEMBELIAN</h1>
                    </div>

                    <!-- Top Section: Warung & Pelanggan (Left) + Meta Box (Right) -->
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:24px;margin-bottom:28px;flex-wrap:wrap;">
                        
                        <!-- Left Side: Nama Warung, Alamat, No Telp & Pelanggan -->
                        <div style="flex:1;min-width:240px;font-size:0.875rem;color:#334155;">
                            <div>
                                <span style="color:#475569;">Nama Warung:</span> <strong>${escapeHtml(sellerName)}</strong>
                            </div>
                            ${sellerLocation ? `
                                <div style="margin-top:2px;">
                                    <span style="color:#475569;">Alamat:</span> ${escapeHtml(sellerLocation)}
                                </div>
                            ` : ''}
                            ${sellerPhone ? `
                                <div style="margin-top:2px;">
                                    <span style="color:#475569;">No. Telp:</span> ${escapeHtml(sellerPhone)}
                                </div>
                            ` : ''}

                            <!-- Pelanggan Block -->
                            <div style="margin-top:20px;">
                                <div style="color:#475569;margin-bottom:2px;">Pelanggan:</div>
                                <div style="font-weight:700;color:#0f172a;font-size:0.95rem;">${escapeHtml(buyerName)}</div>
                                ${buyerAddress ? `<div style="color:#334155;margin-top:1px;">${escapeHtml(buyerAddress)}</div>` : ''}
                                ${buyerPhone ? `<div style="color:#334155;margin-top:1px;">${escapeHtml(buyerPhone)}</div>` : ''}
                            </div>
                        </div>

                        <!-- Right Side: Bordered Meta Box -->
                        <div style="border:1px solid #1e293b;padding:12px 16px;min-width:260px;font-size:0.875rem;color:#1e293b;background:#ffffff;">
                            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                                <span>No. Pesanan / Nota</span>
                                <span>: <strong>#${order.id}</strong></span>
                            </div>
                            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                                <span>Tanggal</span>
                                <span>: ${formattedDate}</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                                <span>Status Pesanan</span>
                                <span>: ${statusText}</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;">
                                <span>Metode Bayar</span>
                                <span>: ${paymentLabel}</span>
                            </div>
                        </div>

                    </div>

                    <!-- Table of Items -->
                    <div style="border-top:1px solid #1e293b;margin-bottom:28px;">
                        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
                            <thead>
                                <tr style="border-bottom:1.5px solid #1e293b;color:#1e293b;">
                                    <th style="padding:10px 4px;text-align:left;font-weight:700;font-size:0.85rem;letter-spacing:0.04em;width:55%;">ITEM</th>
                                    <th style="padding:10px 4px;text-align:center;font-weight:700;font-size:0.85rem;letter-spacing:0.04em;width:15%;">QTY</th>
                                    <th style="padding:10px 4px;text-align:right;font-weight:700;font-size:0.85rem;letter-spacing:0.04em;width:30%;">SUBTOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(order.items || []).map(item => `
                                    <tr style="border-bottom:1px solid #e2e8f0;">
                                        <td style="padding:12px 4px;vertical-align:middle;">
                                            <div style="font-weight:700;color:#1e293b;font-size:0.95rem;">${escapeHtml(item.name)}</div>
                                            <div style="font-size:0.825rem;color:#64748b;margin-top:2px;">@ ${formatRupiah(item.price || 0)}</div>
                                        </td>
                                        <td style="padding:12px 4px;text-align:center;vertical-align:middle;font-weight:700;color:#1e293b;font-size:0.95rem;">
                                            ${item.qty || 1}
                                        </td>
                                        <td style="padding:12px 4px;text-align:right;vertical-align:middle;font-weight:700;color:#1e293b;font-size:0.95rem;">
                                            ${formatRupiah((item.price || 0) * (item.qty || 1))}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                            <tfoot>
                                <!-- Subtotal Belanja -->
                                <tr style="border-bottom:1px solid #e2e8f0;">
                                    <td colspan="2" style="padding:12px 4px;font-weight:600;color:#1e293b;">Subtotal Belanja</td>
                                    <td style="padding:12px 4px;text-align:right;font-weight:700;color:#1e293b;">${formatRupiah(order.totalPrice || 0)}</td>
                                </tr>
                                <!-- Ongkos Kirim -->
                                <tr style="border-bottom:1px solid #e2e8f0;">
                                    <td colspan="2" style="padding:12px 4px;font-weight:600;color:#1e293b;">Ongkos Kirim (Internal Kemnaker)</td>
                                    <td style="padding:12px 4px;text-align:right;font-weight:700;color:#1e293b;">GRATIS</td>
                                </tr>
                                <!-- Total Pembayaran -->
                                <tr style="border-bottom:1.5px solid #1e293b;">
                                    <td colspan="2" style="padding:14px 4px;font-weight:700;color:#1e293b;font-size:1rem;">Total Pembayaran</td>
                                    <td style="padding:14px 4px;text-align:right;font-weight:800;color:#2563eb;font-size:1.05rem;">${formatRupiah(order.totalPrice || 0)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <!-- Footer: Line & Centered Gratitude Text -->
                    <div style="margin-top:40px;border-top:1px solid #1e293b;padding-top:16px;text-align:center;color:#1e293b;">
                        <div style="font-weight:700;font-size:0.925rem;margin-bottom:3px;">Terima kasih atas pesanan Anda!</div>
                        <div style="font-size:0.825rem;color:#64748b;">Lapak UMKM Pegawai Kemnaker • Jajan Tanpa Mikir Ongkir</div>
                    </div>

                </div>

                <!-- Footer Modal (No Print) -->
                <div class="no-print" style="padding:12px 20px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;justify-content:flex-end;align-items:center;gap:10px;">
                    <button id="btn-close-bottom" class="btn btn-secondary btn-sm" style="padding:7px 16px;border-radius:6px;border:1px solid #cbd5e1;background:#ffffff;color:#334155;cursor:pointer;font-weight:600;">
                        Tutup
                    </button>
                    <button id="btn-print-bottom" class="btn btn-primary btn-sm" style="padding:7px 18px;border-radius:6px;background:#2563eb;color:#ffffff;border:none;cursor:pointer;font-weight:600;display:flex;align-items:center;gap:6px;">
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
                from { transform: scale(0.96); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @media print {
                /* Sembunyikan semua elemen selain nota */
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
                    padding: 15mm 20mm !important;
                    margin: 0 !important;
                    background: white !important;
                    color: #1e293b !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                .no-print {
                    display: none !important;
                }
                @page {
                    size: A4 portrait;
                    margin: 0;
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
