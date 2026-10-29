import Store from '../store.js';
import Router from '../router.js';
import { formatRupiah, showToast, escapeHtml } from '../utils.js';

export async function render(params) {
    const orderId = params?.orderId || Router.getParams()?.orderId || '';

    if (!orderId) {
        return `
            <div class="container mt-5 mb-5" style="max-width: 600px;">
                <div class="card p-4 text-center">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h2 class="text-xl font-bold mb-2">Parameter Pesanan Tidak Ditemukan</h2>
                    <p class="text-muted mb-4">Link ini membutuhkan parameter No. Pesanan yang valid dari notifikasi WhatsApp.</p>
                    <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
                </div>
            </div>
        `;
    }

    const order = await Store.getOrder(orderId);
    if (!order) {
        return `
            <div class="container mt-5 mb-5" style="max-width: 600px;">
                <div class="card p-4 text-center">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <h2 class="text-xl font-bold mb-2">Pesanan Tidak Ditemukan</h2>
                    <p class="text-muted mb-4">Pesanan dengan nomor <strong>#${escapeHtml(orderId)}</strong> tidak ditemukan di database.</p>
                    <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
                </div>
            </div>
        `;
    }

    // Ambil data pembeli jika ada
    let buyerName = 'Pembeli';
    let buyerPhone = '';
    if (order.buyerId) {
        const buyerData = await Store.getUser(order.buyerId);
        if (buyerData) {
            buyerName = buyerData.name || buyerName;
            buyerPhone = buyerData.phone || '';
        }
    }
    // Jika ada nomor kontak di alamat
    if (!buyerPhone && order.address) {
        const match = order.address.match(/(?:08|62)\d{8,13}/);
        if (match) buyerPhone = match[0];
    }

    const itemListHtml = (order.items || []).map((it, idx) => `
        <div class="flex justify-between items-center py-2 border-b text-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9;">
            <div>
                <span class="font-semibold text-gray-800">${idx + 1}. ${escapeHtml(it.name)}</span>
                <span class="text-muted text-xs block">(${it.qty}x @ ${formatRupiah(it.price)})</span>
            </div>
            <div class="font-bold text-gray-700">
                ${formatRupiah(it.price * it.qty)}
            </div>
        </div>
    `).join('');

    const hasPreviousQris = !!order.qrisNominalImage;

    return `
        <div class="container mt-4 mb-5" style="max-width: 640px;">
            <div class="card shadow-md" style="border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; background: #ffffff;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 1.5rem; text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 0.25rem;">🏪</div>
                    <h1 class="text-xl font-bold" style="margin: 0; color: #ffffff;">TerasMOWI — Kirim QRIS Nominal</h1>
                    <p style="margin: 0.25rem 0 0; font-size: 0.85rem; opacity: 0.9;">Kirim gambar QRIS dengan nominal tagihan pas ke WhatsApp pembeli</p>
                </div>

                <div class="card-body p-4" style="padding: 1.5rem;">
                    <!-- Rincian Pesanan -->
                    <div style="background: #f8fafc; border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem; border: 1px solid #e2e8f0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                            <span class="text-xs text-muted font-bold uppercase tracking-wider">No. Pesanan</span>
                            <span class="font-bold text-primary" style="font-family: monospace; font-size: 1rem;">#${escapeHtml(order.id)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;">
                            <span class="text-muted">👤 Pembeli:</span>
                            <span class="font-semibold text-gray-800">${escapeHtml(buyerName)} ${buyerPhone ? `(${escapeHtml(buyerPhone)})` : ''}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.875rem;">
                            <span class="text-muted">📍 Pengiriman:</span>
                            <span class="font-semibold text-gray-800 text-right" style="max-width: 65%;">${escapeHtml(order.address || '-')}</span>
                        </div>

                        <!-- Item list -->
                        <div class="mt-2 pt-2" style="border-top: 1px dashed #cbd5e1;">
                            ${itemListHtml}
                        </div>
                    </div>

                    <!-- Highlight Total Bayar -->
                    <div style="background: #ecfdf5; border: 2px dashed #10b981; border-radius: 12px; padding: 1rem; text-align: center; margin-bottom: 1.5rem;">
                        <div class="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-1">TOTAL NOMINAL YANG HARUS DIBAYAR</div>
                        <div style="font-size: 2rem; font-weight: 800; color: #047857; letter-spacing: -0.5px;">
                            ${formatRupiah(order.totalPrice)}
                        </div>
                        <div class="text-xs text-emerald-600 mt-1">
                            💡 Buat kode QRIS di m-Banking / aplikasi pembayaran Anda sebesar nominal di atas
                        </div>
                    </div>

                    ${hasPreviousQris ? `
                        <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 0.75rem; margin-bottom: 1.25rem; font-size: 0.85rem; color: #92400e;">
                            ℹ️ <strong>Perhatian:</strong> QRIS nominal sudah pernah dikirimkan sebelumnya untuk pesanan ini. Mengirim ulang akan memperbarui dan mengirimkan QRIS baru ke WhatsApp pembeli dan tim TerasMOWI.
                        </div>
                    ` : ''}

                    <!-- Form Upload QRIS -->
                    <div class="mb-4">
                        <label class="block font-bold text-sm text-gray-700 mb-2" style="display: block; margin-bottom: 0.5rem;">
                            📸 Pilih / Foto Gambar QRIS dengan Nominal:
                        </label>
                        
                        <div id="drop-area" style="border: 2px dashed #94a3b8; border-radius: 12px; padding: 1.5rem; text-align: center; cursor: pointer; background: #f8fafc; transition: all 0.2s;">
                            <input type="file" id="input-qris-image" accept="image/*" style="display: none;">
                            <div id="placeholder-upload">
                                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📷</div>
                                <div class="font-bold text-sm text-gray-700">Klik di sini untuk Memilih atau Foto QRIS</div>
                                <div class="text-xs text-muted mt-1">Format JPG, PNG (Maks 5 MB)</div>
                            </div>
                            <div id="preview-container" style="display: none; margin-top: 0.5rem;">
                                <img id="preview-image" src="" alt="Preview QRIS" style="max-height: 260px; max-width: 100%; border-radius: 8px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
                                <div class="text-xs text-emerald-600 font-bold mt-2">✓ Gambar siap dikirim</div>
                                <button type="button" id="btn-reselect" class="btn btn-sm btn-outline mt-2 text-xs" style="padding: 4px 10px;">Ganti Gambar</button>
                            </div>
                        </div>
                    </div>

                    <!-- Tombol Aksi -->
                    <button type="button" id="btn-submit-qris" class="btn btn-primary btn-block py-3 text-base font-bold" style="width: 100%; border-radius: 10px; background: #10b981; border-color: #10b981;" disabled>
                        🚀 Kirim QRIS ke Pembeli & Tim TerasMOWI
                    </button>

                    <div id="status-result" class="mt-4 text-center text-sm" style="display: none;"></div>
                </div>
            </div>
        </div>
    `;
}

export async function afterRender(params) {
    const orderId = params?.orderId || Router.getParams()?.orderId || '';
    if (!orderId) return;

    const order = await Store.getOrder(orderId);
    if (!order) return;

    const dropArea = document.getElementById('drop-area');
    const inputQris = document.getElementById('input-qris-image');
    const placeholder = document.getElementById('placeholder-upload');
    const previewContainer = document.getElementById('preview-container');
    const previewImg = document.getElementById('preview-image');
    const btnReselect = document.getElementById('btn-reselect');
    const btnSubmit = document.getElementById('btn-submit-qris');
    const statusResult = document.getElementById('status-result');

    let compressedBase64 = null;

    dropArea?.addEventListener('click', (e) => {
        if (e.target !== btnReselect) {
            inputQris.click();
        }
    });

    btnReselect?.addEventListener('click', (e) => {
        e.stopPropagation();
        inputQris.click();
    });

    // Helper resize image to max 900px and compress to jpeg
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const maxDim = 900;

                    if (width > maxDim || height > maxDim) {
                        if (width > height) {
                            height = Math.round((height * maxDim) / width);
                            width = maxDim;
                        } else {
                            width = Math.round((width * maxDim) / height);
                            height = maxDim;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const base64 = canvas.toDataURL('image/jpeg', 0.85);
                    resolve(base64);
                };
                img.onerror = reject;
                img.src = event.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    inputQris?.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            showToast('Memproses gambar...', 'info');
            compressedBase64 = await compressImage(file);

            previewImg.src = compressedBase64;
            placeholder.style.display = 'none';
            previewContainer.style.display = 'block';
            btnSubmit.disabled = false;
            btnSubmit.style.opacity = '1';
        } catch (err) {
            console.error('Error reading image:', err);
            showToast('Gagal memproses gambar. Gunakan format JPG/PNG.', 'error');
        }
    });

    btnSubmit?.addEventListener('click', async () => {
        if (!compressedBase64) {
            showToast('Silakan pilih gambar QRIS terlebih dahulu', 'warning');
            return;
        }

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<span style="display:inline-block; animation:spin 1s linear infinite; margin-right:8px;">⏳</span> Mengirim notifikasi WA...`;

        try {
            // 1. Simpan ke Firestore
            await Store.updateOrder(orderId, {
                qrisNominalImage: compressedBase64,
                qrisNominalSentAt: new Date().toISOString()
            });

            // 2. Ambil data pembeli
            let buyerName = 'Pembeli';
            let buyerPhone = '';
            if (order.buyerId) {
                const buyerData = await Store.getUser(order.buyerId);
                if (buyerData) {
                    buyerName = buyerData.name || buyerName;
                    buyerPhone = buyerData.phone || '';
                }
            }
            if (!buyerPhone && order.address) {
                const match = order.address.match(/(?:08|62)\d{8,13}/);
                if (match) buyerPhone = match[0];
            }

            const formatWAPhone = (rawPhone) => {
                let p = String(rawPhone || '').replace(/\D/g, '');
                if (p.startsWith('0')) p = '62' + p.slice(1);
                if (!p.startsWith('62')) p = '62' + p;
                return p;
            };

            const EVOLUTION_URL = 'https://wa.cilebut-one.cloud';
            const EVOLUTION_APIKEY = 'cilebut-ONE.server:2026';
            const EVOLUTION_INSTANCE = 'umkm-kemnaker';

            const cleanBase64 = compressedBase64.includes(',') ? compressedBase64.split(',')[1] : compressedBase64;
            const totalPriceFormatted = formatRupiah(order.totalPrice);

            const sendTextWithTimeout = async (targetPhone, textMessage) => {
                const p = formatWAPhone(targetPhone);
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), 15000);
                try {
                    const res = await fetch(`${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': EVOLUTION_APIKEY
                        },
                        body: JSON.stringify({
                            number: p,
                            textMessage: {
                                text: textMessage
                            }
                        }),
                        signal: controller.signal
                    });
                    clearTimeout(timer);
                    return res;
                } catch (e) {
                    clearTimeout(timer);
                    console.warn(`Gagal mengirim WA text ke ${p}:`, e);
                    return null;
                }
            };

            const sleep = (ms) => new Promise(r => setTimeout(r, ms));

            // A. Kirim notifikasi teks resmi dengan tautan QRIS ke WhatsApp Pembeli
            if (buyerPhone) {
                const buyerMessage = 
`📱 *QRIS PEMBAYARAN - TERASMOWI*
━━━━━━━━━━━━━━━━━━━━
📋 *No. Pesanan:* ${orderId}
💰 *Total Tagihan Pas:* *${totalPriceFormatted}*

Halo Kak *${buyerName}*, kode QRIS tagihan pas untuk pesanan Kakak telah siap.

Silakan klik tautan resmi di bawah ini untuk melihat dan scan kode QRIS:
👉 https://umkm-kemnaker.vercel.app/#/bayar-qris?orderId=${orderId}

Setelah melakukan pembayaran via m-Banking atau E-Wallet, pesanan Kakak akan segera diantar.

Pantau status pesanan Kakak:
🔗 https://umkm-kemnaker.vercel.app/#/orders

Terima kasih banyak sudah jajan di TerasMOWI! 🙏`;

                await sendTextWithTimeout(buyerPhone, buyerMessage);
                await sleep(1500);
            }

            // B. Kirim notifikasi konfirmasi teks ke 3 Nomor Tim TerasMOWI
            const terasMOWIPhones = ['6285781335527', '6281289004462', '6289658107313'];
            const teamMessage = 
`✅ *QRIS NOMINAL BERHASIL DIKIRIM KE PEMBELI!*
━━━━━━━━━━━━━━━━━━━━
📋 *No. Pesanan:* ${orderId}
👤 *Pembeli:* ${buyerName} ${buyerPhone ? `(${buyerPhone})` : ''}
💰 *Total Nominal:* *${totalPriceFormatted}*

Tautan QRIS Pembeli:
👉 https://umkm-kemnaker.vercel.app/#/bayar-qris?orderId=${orderId}

Mohon pantau mutasi m-banking & siapkan pesanannya! 👍
Pantau pesanan di dashboard:
🔗 https://umkm-kemnaker.vercel.app/#/dashboard`;

            for (const phone of terasMOWIPhones) {
                await sendTextWithTimeout(phone, teamMessage);
                await sleep(1500);
            }

            showToast('QRIS nominal berhasil dikirim ke Pembeli & Tim!', 'success');
            btnSubmit.innerHTML = `✅ Berhasil Terkirim!`;
            btnSubmit.style.background = '#059669';

            statusResult.style.display = 'block';
            statusResult.innerHTML = `
                <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 10px; padding: 1rem; color: #047857;">
                    <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">🎉</div>
                    <strong>Sukses Terkirim!</strong><br>
                    Notifikasi teks & tautan QRIS nominal telah berhasil dikirimkan ke WhatsApp pembeli <strong>${escapeHtml(buyerName)}</strong> dan 3 nomor WhatsApp tim TerasMOWI.
                </div>
            `;
        } catch (err) {
            console.error('Error sending QRIS:', err);
            showToast('Terjadi kesalahan: ' + err.message, 'error');
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = `🚀 Kirim QRIS ke Pembeli & Tim TerasMOWI`;
        }
    });
}
