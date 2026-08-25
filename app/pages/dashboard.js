import Store from '../store.js';
import Auth from '../auth.js';
import Router from '../router.js';
import { formatRupiah, showToast, timeAgo, generateId } from '../utils.js';

const eselonData = {
    "Setjen": [
        "Biro Perencanaan dan Manajemen Kinerja",
        "Biro Keuangan & BMN",
        "Biro OSDM",
        "Biro Hukum",
        "Biro Kerja Sama Luar Negeri dan Humas"
    ],
    "Ditjen Binalavotas": [
        "Sekretariat Direktorat Jenderal",
        "Direktorat Bina Standardisasi Kompetensi dan Program Pelatihan",
        "Direktorat Bina Kelembagaan Pelatihan Vokasi",
        "Direktorat Bina Penyelenggaraan Pelatihan Vokasi dan Pemagangan",
        "Direktorat Bina Peningkatan Produktivitas",
        "Direktorat Bina Instruktur dan Tenaga Pelatihan"
    ],
    "Ditjen Binapenta & PKK": [
        "Sekretariat Direktorat Jenderal",
        "Direktorat Bina Penempatan Tenaga Kerja",
        "Direktorat Bina Penempatan Tenaga Kerja Khusus",
        "Direktorat Bina Perluasan Kesempatan Kerja",
        "Direktorat Pengendalian Penggunaan Tenaga Kerja Asing",
        "Direktorat Bina Pengantar Kerja"
    ],
    "Binwasnaker & K3": [
        "Sekretariat Direktorat Jenderal",
        "Direktorat Bina Sistem Pengawasan Ketenagakerjaan",
        "Direktorat Bina Kelembagaan Keselamatan dan Kesehatan Kerja",
        "Direktorat Bina Pemeriksaaan Norma Ketenagakerjaan",
        "Direktorat Bina Pengujian Keselamatan dan Kesehatan Kerja",
        "Direktorat Bina Pengawas Ketenagakerjaan dan Penguji Keselamatan dan Kesehatan Kerja"
    ],
    "PHI & Jamsos": [
        "Sekretariat Direktorat Jenderal",
        "Direktorat Hubungan Kerja dan Pengupahan",
        "Direktorat Jaminan Sosial Tenaga Kerja dan Fasilitasi Kesejahteraan Pekerja",
        "Direktorat Kelembagaan dan Pencegahan Perselisihan Hubungan Industrial",
        "Direktorat Penyelesaian Perselisihan Hubungan Industrial",
        "Direktorat Bina Mediator Hubungan Industrial"
    ],
    "Itjen": [
        "Sekretariat Inspektorat Jenderal",
        "Inspektorat I",
        "Inspektorat II",
        "Inspektorat III",
        "Inspektorat IV"
    ],
    "Barenbang": [
        "Sekretariat Badan",
        "Pusat Perencanaan Ketenagakerjaan",
        "Pusat Data dan Informasi Ketenagakerjaan",
        "Pusat Penelitian dan Pengembangan Ketenagakerjaan"
    ]
};

export async function render(params) {
    if (!Auth.isLoggedIn()) {
        setTimeout(() => Router.navigate('/login'), 0);
        return `<div class="container text-center mt-5"><p>Mengarahkan ke halaman login...</p></div>`;
    }

    const user = await Auth.getCurrentUser();
    const lapak = await Store.getLapak(user.id);

    if (!lapak) {
        return `
            <div class="dashboard-page container mt-6 mb-10 fade-in mx-auto" style="max-width: 28rem;">
                <div class="card border-0">
                    <div class="card-body p-5 text-center">
                        <div class="flex justify-center mx-auto mb-4" style="max-width: 150px; display: flex; justify-content: center; align-items: center;">
                            <img src="img/umkm.png" alt="UMKM Kemnaker" style="max-height: 50px; width: auto; mix-blend-mode: multiply;">
                        </div>
                        <h1 class="text-2xl font-heading font-bold mb-2">Buka Warung Anda</h1>
                        <p class="text-muted mb-5">Mulai pasarkan produk kreasi Anda ke seluruh pegawai Kemnaker sekarang juga!</p>
                        
                        <form id="form-create-lapak" class="text-left gap-4" style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <div class="form-group" style="margin: 0;">
                                <label class="form-label font-semibold">Nama Warung</label>
                                <input type="text" id="lapak-name" class="form-input p-3 border card focus:ring-2 focus:ring-primary/50" style="width: 100%;" required placeholder="Contoh: Kedai Makmur">
                            </div>
                            <div class="form-group" style="margin: 0;">
                                <label class="form-label font-semibold">Deskripsi Warung</label>
                                <textarea id="lapak-desc" class="form-textarea p-3 border card focus:ring-2 focus:ring-primary/50" style="width: 100%;" required rows="3" placeholder="Ceritakan tentang toko Anda..."></textarea>
                            </div>
                            <div class="form-group" style="margin: 0;">
                                <label class="form-label font-semibold">Unit Eselon I</label>
                                <select id="lapak-eselon1" class="form-select p-3 border rounded focus:ring-2 focus:ring-primary/50" style="width: 100%; cursor: pointer;" required>
                                    <option value="">-- Pilih Unit Eselon I --</option>
                                    <option value="Setjen">Setjen</option>
                                    <option value="Ditjen Binalavotas">Ditjen Binalavotas</option>
                                    <option value="Ditjen Binapenta & PKK">Ditjen Binapenta & PKK</option>
                                    <option value="Binwasnaker & K3">Binwasnaker & K3</option>
                                    <option value="PHI & Jamsos">PHI & Jamsos</option>
                                    <option value="Itjen">Itjen</option>
                                    <option value="Barenbang">Barenbang</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin: 0;">
                                <label class="form-label font-semibold">Unit Eselon II</label>
                                <select id="lapak-eselon2" class="form-select p-3 border rounded focus:ring-2 focus:ring-primary/50" style="width: 100%; cursor: pointer;" required>
                                    <option value="">-- Pilih Eselon I Terlebih Dahulu --</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin: 0;">
                                <label class="form-label font-semibold">Bagian / Divisi</label>
                                <input type="text" id="lapak-bagian" class="form-input p-3 border card focus:ring-2 focus:ring-primary/50" style="width: 100%;" placeholder="Contoh: Bagian Umum" required>
                            </div>
                            <div class="grid grid-2 gap-4">
                                <div class="form-group" style="margin: 0;">
                                    <label class="form-label font-semibold">Gedung</label>
                                    <select id="lapak-gedung" class="form-select p-3 border rounded focus:ring-2 focus:ring-primary/50" style="width: 100%; cursor: pointer;" required>
                                        <option value="">-- Pilih Gedung --</option>
                                        <option value="Gedung A">Gedung A</option>
                                        <option value="Gedung B">Gedung B</option>
                                    </select>
                                </div>
                                <div class="form-group" style="margin: 0;">
                                    <label class="form-label font-semibold">Lantai</label>
                                    <select id="lapak-lantai" class="form-select p-3 border rounded focus:ring-2 focus:ring-primary/50" style="width: 100%; cursor: pointer;" required>
                                        <option value="">-- Pilih Lantai --</option>
                                        <option value="Lantai 1">Lantai 1</option>
                                        <option value="Lantai 2">Lantai 2</option>
                                        <option value="Lantai 3">Lantai 3</option>
                                        <option value="Lantai 4">Lantai 4</option>
                                        <option value="Lantai 5">Lantai 5</option>
                                        <option value="Lantai 6">Lantai 6</option>
                                        <option value="Lantai 7">Lantai 7</option>
                                        <option value="Lantai 8">Lantai 8</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block btn-lg py-3 font-bold text-white hover:shadow-lg transition-all mt-4" style="width: 100%;">
                                Buka Warung Sekarang
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    const products = await Store.getProductsBySeller(user.id);
    const orders = await Store.getSellerOrders(user.id);
    const completedOrders = orders.filter(o => o.status === 'completed');
    const pendingOrders = orders.filter(o => o.status === 'pending');
    
    const totalIncome = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    const renderProductRow = (p) => `
        <div class="product-list-item card border flex flex-col hover:shadow-md transition-shadow overflow-hidden bg-white h-full" style="display: flex; flex-direction: column;">
            <div class="flex flex-center justify-center text-4xl flex-shrink-0 bg-gray-50 border-b border-gray-100 relative" style="height: 140px; overflow: hidden; width: 100%; display: flex; justify-content: center; align-items: center;">
                ${p.image && p.image.startsWith('data:image') ? `<img src="${p.image}" style="width: 100%; height: 100%; object-fit: cover;">` : (p.image || '📦')}
            </div>
            <div class="p-3 text-center flex-grow flex flex-col justify-between" style="display: flex; flex-direction: column;">
                <div>
                    <div class="mb-1">
                        <span class="badge ${p.status === 'po' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-green-100 text-green-700 border-green-200'} text-[10px] px-2 py-0.5 border font-semibold" style="border-radius: var(--radius-full);">${p.status === 'po' ? 'Pre-Order' : 'Ready Stock'}</span>
                    </div>
                    <div class="font-bold text-gray-800 mb-0.5" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.2;">${p.name}</div>
                    <div class="font-bold text-md mb-1.5" style="color: #1e3a8a;">${formatRupiah(p.price)}</div>
                    <div class="text-[11px] text-muted mb-2 bg-gray-50 py-1 rounded-md border border-gray-100 flex flex-col">
                        <div style="margin-bottom: 2px;">Stok: <span class="font-bold ${p.stock > 0 ? 'text-green-600' : 'text-red-600'}">${p.stock}</span></div>
                        <div class="flex justify-center items-center text-gray-500">
                            <span>Terjual: ${p.sold || 0}</span>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2 justify-center border-t border-gray-100 pt-2" style="width: 100%;">
                    <button class="btn btn-sm btn-outline btn-edit-product flex-1 border-blue-200 text-accent hover:bg-blue-50 transition-colors" data-id="${p.id}" style="padding: 0.25rem;"><i data-lucide="edit-2" class="w-3.5 h-3.5 mx-auto"></i></button>
                    <button class="btn btn-sm btn-outline btn-delete-product flex-1 border-red-200 text-danger hover:bg-red-50 transition-colors" data-id="${p.id}" style="padding: 0.25rem;"><i data-lucide="trash-2" class="w-3.5 h-3.5 mx-auto"></i></button>
                </div>
            </div>
        </div>
    `;

    const renderSellerOrderCard = async (order) => {
        const buyer = await Store.getUser(order.buyerId) || { name: 'Pembeli' };

        // Format tanggal yang sudah tersimpan sebelumnya jika ada
        const savedDate = order.estimatedDelivery || '';
        const formattedSavedDate = savedDate ? new Date(savedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';

        // Tombol aksi pesanan
        const processBtnDisabled = (order.status === 'pending' && (!savedDate || !order.deliveryTime)) ? 'disabled' : '';

        return `
            <div class="order-card card mb-4 overflow-hidden border">
                <div class="p-4 border-b flex flex-col flex-row flex-between items-start md:items-center gap-2">
                    <div>
                        <div class="font-semibold">${buyer.name}</div>
                        <div class="text-xs text-muted">ID: #${order.id.substring(0,8)} • ${timeAgo(order.createdAt)}</div>
                    </div>
                    <div class="badge px-3 py-1 text-xs font-semibold capitalize text-secondary" style="border-radius: var(--radius-full);">${order.status}</div>
                </div>
                <div class="p-4">
                    <div class="text-sm space-y-1 mb-3">
                        ${order.items.map(i => `<div>${i.qty}x ${i.name} - ${formatRupiah(i.price)}</div>`).join('')}
                    </div>
                    <div class="font-bold text-lg mb-4 text-primary">${formatRupiah(order.totalPrice)}</div>

                    ${order.status === 'pending' ? `
                    <div class="mb-4 p-3 rounded-lg border border-blue-100 bg-blue-50" style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
                        <label class="block text-xs font-semibold text-blue-700 mb-1" style="color: #1d4ed8;">
                            📦 Barang akan mendarat di meja pelanggan pada:
                        </label>
                        ${(savedDate && order.deliveryTime) ? `
                            <div class="font-bold text-blue-800 text-sm" style="color: #1e40af;">${formattedSavedDate} (${order.deliveryTime})</div>
                        ` : `
                            <div class="flex flex-row gap-2 mb-2" style="display: flex; gap: 8px;">
                                <input type="date" 
                                    class="delivery-date-input form-input border rounded-md px-3 py-2 text-sm" 
                                    data-order-id="${order.id}"
                                    value="${savedDate || ''}"
                                    min="${new Date().toISOString().split('T')[0]}"
                                    style="border: 1px solid #93c5fd; border-radius: 6px; padding: 6px 10px; font-size: 13px; cursor: pointer; flex: 1; background: white;">
                                <select class="delivery-time-input form-input border rounded-md px-2 py-2 text-sm"
                                        data-order-id="${order.id}"
                                        style="border: 1px solid #93c5fd; border-radius: 6px; padding: 6px 5px; font-size: 13px; cursor: pointer; flex: 1; background: white;">
                                    <option value="" disabled selected>Pilih Waktu</option>
                                    <option value="Sebelum Maksi" ${order.deliveryTime === 'Sebelum Maksi' ? 'selected' : ''}>Sebelum Maksi</option>
                                    <option value="Setelah Maksi" ${order.deliveryTime === 'Setelah Maksi' ? 'selected' : ''}>Setelah Maksi</option>
                                </select>
                            </div>
                            <p class="text-xs text-blue-600 mt-1" style="color: #2563eb;">⚠️ Pilih tanggal dan waktu untuk mengaktifkan tombol Proses Pesanan.</p>
                        `}
                    </div>
                    ` : order.estimatedDelivery ? `
                    <div class="mb-3 p-2 rounded-lg" style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
                        <span class="text-xs font-semibold" style="color: #15803d;">📦 Estimasi tiba: </span>
                        <span class="text-xs font-bold" style="color: #166534;">${formattedSavedDate} (${order.deliveryTime || '-'})</span>
                    </div>
                    ` : ''}

                    <div class="flex flex-wrap gap-2">
                        ${order.status === 'pending' ? `<button class="btn btn-sm btn-primary btn-update-status" data-id="${order.id}" data-status="processing" ${processBtnDisabled} style="${processBtnDisabled ? 'opacity:0.4;cursor:not-allowed;' : ''}">Proses Pesanan</button>` : ''}
                        ${order.status === 'processing' ? `<button class="btn btn-sm btn-primary btn-update-status" data-id="${order.id}" data-status="shipped">Kirim Pesanan</button>` : ''}
                        ${order.status === 'shipped' ? `<button class="btn btn-sm btn-success btn-update-status" data-id="${order.id}" data-status="completed">Tandai Selesai</button>` : ''}
                        ${(order.status === 'pending' || order.status === 'processing') ? `<button class="btn btn-sm btn-danger btn-update-status" data-id="${order.id}" data-status="cancelled">Batalkan</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    };

    return `
        <div class="dashboard-page container mt-4 mb-10 fade-in">
            <div class="dashboard-header flex flex-col flex-row flex-between flex-center mb-5 p-5 card border">
                <div>
                    <h1 class="text-2xl font-heading font-bold">Dashboard Penjual</h1>
                    <p class="text-muted text-sm mt-1">Kelola warung <span class="font-semibold">${lapak.name}</span> Anda</p>
                </div>
                <a href="#/lapak/${user.id}" class="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white mt-4 md:mt-0 transition-colors">Lihat Warung <i data-lucide="external-link" class="w-4 h-4 ml-1 inline"></i></a>
            </div>

            <div class="dashboard-stats grid grid-2 grid-4 gap-4 mb-5">
                <div class="stat-card p-5 card border text-center">
                    <div class="text-muted text-sm font-semibold mb-1">Total Produk</div>
                    <div class="stat-value text-3xl font-bold">${products.length}</div>
                </div>
                <div class="stat-card p-5 card border text-center">
                    <div class="text-muted text-sm font-semibold mb-1">Total Pesanan</div>
                    <div class="stat-value text-3xl font-bold">${orders.length}</div>
                </div>
                <div class="stat-card p-5 card border text-center">
                    <div class="text-muted text-sm font-semibold mb-1">Pendapatan</div>
                    <div class="stat-value text-xl font-bold text-success mt-2">${formatRupiah(totalIncome)}</div>
                </div>
                <div class="stat-card p-5 card border text-center">
                    <div class="text-muted text-sm font-semibold mb-1">Pesanan Baru</div>
                    <div class="stat-value text-3xl font-bold text-accent">${pendingOrders.length}</div>
                </div>
            </div>

            <div class="card border-0 card overflow-hidden">
                <div class="tabs flex border-b px-2 pt-2 gap-2 overflow-x-auto">
                    <button class="tab active px-4 py-3 font-semibold text-secondary rounded-t-lg border-b-2 border-primary" data-target="tab-products">Produk Saya</button>
                    <button class="tab px-4 py-3 font-semibold text-secondary rounded-t-lg border-b-2 border-transparent" data-target="tab-orders">Pesanan Masuk <span class="bg-primary text-white text-xs px-2 py-0.5 ml-1" style="border-radius: var(--radius-full);">${pendingOrders.length}</span></button>
                    <button class="tab px-4 py-3 font-semibold text-secondary rounded-t-lg border-b-2 border-transparent" data-target="tab-settings">Pengaturan</button>
                </div>

                <div class="card-body p-5" style="min-height: 400px;">
                    <!-- Tab Produk -->
                    <div id="tab-products" class="tab-content block">
                        <div class="flex justify-between align-center mb-6 border-b border-gray-100 pb-4" style="display: flex; justify-content: space-between; align-items: center;">
                            <h2 class="text-2xl font-heading font-bold text-gray-800">Katalog Produk</h2>
                            <button id="btn-show-add-product" class="btn btn-primary px-4 py-2 font-semibold shadow-sm hover:shadow-md transition-all flex align-center"><i data-lucide="plus" class="w-5 h-5 mr-2"></i> Tambah Produk</button>
                        </div>

                        <!-- Product Form (Hidden by default) -->
                        <div id="product-form-container" class="hidden p-5 card border mb-5 slide-up">
                            <h3 id="product-form-title" class="font-bold text-lg mb-4">Tambah Produk Baru</h3>
                            <form id="product-form" class="gap-4">
                                <input type="hidden" id="prod-id">
                                <div class="grid grid-2 gap-4">
                                    <div class="form-group">
                                        <label class="form-label">Nama Produk</label>
                                        <input type="text" id="prod-name" class="form-input p-2 border rounded" style="width: 100%;" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Harga (Rp)</label>
                                        <input type="number" id="prod-price" class="form-input p-2 border rounded" style="width: 100%;" required min="0">
                                    </div>
                                </div>
                                <div class="grid grid-4 gap-4 mb-3">
                                    <div class="form-group">
                                        <label class="form-label">Kategori</label>
                                        <select id="prod-category" class="form-select p-2 border rounded" style="width: 100%;" required>
                                            <option value="makanan">Makanan</option>
                                            <option value="minuman">Minuman</option>
                                            <option value="camilan">Camilan / Kue</option>
                                            <option value="kesehatan">Jamu / Kesehatan</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Satuan</label>
                                        <input type="text" id="prod-unit" class="form-input p-2 border rounded" style="width: 100%;" placeholder="Pcs, Porsi, dll" value="Pcs" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Min. Order</label>
                                        <input type="number" id="prod-min-order" class="form-input p-2 border rounded" style="width: 100%;" value="1" required min="1">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Status</label>
                                        <select id="prod-status" class="form-select p-2 border rounded" style="width: 100%;" required>
                                            <option value="ready">Ready Stock</option>
                                            <option value="po">Pre-Order (PO)</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="grid grid-2 gap-4">
                                    <div class="form-group">
                                        <label class="form-label">Stok Tersedia</label>
                                        <input type="number" id="prod-stock" class="form-input p-2 border rounded" style="width: 100%;" required min="0">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Gambar Produk</label>
                                        <input type="file" id="prod-image" class="form-input p-2 border rounded" style="width: 100%;" accept="image/*">
                                        <small class="text-muted">Kosongkan jika tidak ingin mengubah gambar saat edit.</small>
                                        <input type="hidden" id="prod-image-base64">
                                    </div>
                                </div>
                                <div class="form-group mt-3">
                                    <label class="form-label">Deskripsi</label>
                                    <textarea id="prod-desc" class="form-textarea p-2 border rounded" style="width: 100%;" required rows="3"></textarea>
                                </div>
                                <div class="flex gap-2 justify-end mt-4">
                                    <button type="button" id="btn-cancel-product" class="btn btn-outline">Batal</button>
                                    <button type="submit" class="btn btn-primary px-6">Simpan</button>
                                </div>
                            </form>
                        </div>

                        <div class="products-list dashboard-products-list">
                            ${products.length > 0 ? products.map(renderProductRow).join('') : '<div style="grid-column: 1 / -1;"><p class="text-center text-muted py-10 bg-gray-50 border border-dashed rounded-lg">Belum ada produk. Silakan tambah produk baru.</p></div>'}
                        </div>
                    </div>

                    <!-- Tab Pesanan -->
                    <div id="tab-orders" class="tab-content hidden">
                        <h2 class="text-xl font-heading font-bold mb-5">Pesanan Masuk</h2>
                        ${orders.length > 0 ? 
                            `<div class="grid md:grid-cols-2 gap-4">${(await Promise.all(orders.sort((a,b)=>b.createdAt-a.createdAt).map(renderSellerOrderCard))).join('')}</div>` : 
                            '<p class="text-center text-muted py-8">Belum ada pesanan.</p>'
                        }
                    </div>

                    <!-- Tab Pengaturan -->
                    <div id="tab-settings" class="tab-content hidden">
                        <div class="flex justify-between align-center mb-5 pb-2 border-b" style="display: flex; justify-content: space-between; align-items: center; max-width: 36rem;">
                            <h2 class="text-xl font-heading font-bold text-gray-800" style="margin: 0;">Pengaturan Warung</h2>
                            <button type="button" id="btn-edit-warung" class="btn btn-sm btn-primary px-4 py-1.5 font-semibold text-xs text-white" style="border-radius: var(--radius-sm);"><i data-lucide="edit" class="w-3.5 h-3.5 mr-1.5 inline"></i>Edit Warung</button>
                        </div>
                        
                        <!-- Read-only View Container -->
                        <div id="warung-view-container" class="p-3 card border flex flex-col gap-2" style="max-width: 36rem; display: flex; flex-direction: column; gap: 0.25rem;">
                            <div class="form-group" style="margin: 0;">
                                <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; padding-top: 0.5rem; color: var(--accent-primary);">Nama Warung</label>
                                <div class="p-1.5 border rounded-md bg-gray-50 text-gray-800 font-medium">${lapak.name}</div>
                            </div>
                            
                            <div class="form-group" style="margin: 0;">
                                <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; padding-top: 0.5rem; color: var(--accent-primary);">Deskripsi Warung</label>
                                <div class="p-1.5 border rounded-md bg-gray-50 text-gray-800 font-medium" style="min-height: 80px; white-space: pre-wrap;">${lapak.description}</div>
                            </div>

                            <div class="form-group" style="margin: 0;">
                                <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; padding-top: 0.5rem; color: var(--accent-primary);">Unit Kerja</label>
                                <div class="p-1.5 border rounded-md bg-gray-50 text-gray-800 font-medium">
                                    ${(() => {
                                        const parts = [lapak.bagian, lapak.eselon2].filter(Boolean).join(' ');
                                        const full = parts && lapak.eselon1 ? `${parts}, ${lapak.eselon1}` : (parts || lapak.eselon1 || '');
                                        return full || '<em class="text-muted text-xs">Belum diisi</em>';
                                    })()}
                                </div>
                            </div>

                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
                                <div class="form-group" style="margin: 0;">
                                    <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; padding-top: 0.5rem; color: var(--accent-primary);">Gedung</label>
                                    <div class="p-1.5 border rounded-md bg-gray-50 text-gray-800 font-medium">${lapak.gedung || '<em class="text-muted text-xs">Belum diisi</em>'}</div>
                                </div>
                                <div class="form-group" style="margin: 0;">
                                    <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; padding-top: 0.5rem; color: var(--accent-primary);">Lantai</label>
                                    <div class="p-1.5 border rounded-md bg-gray-50 text-gray-800 font-medium">${lapak.lantai || '<em class="text-muted text-xs">Belum diisi</em>'}</div>
                                </div>
                            </div>

                            <div class="border-t border-gray-100 pt-2" style="margin-top: 0.25rem;">
                                <label class="form-label font-bold text-sm block mb-3" style="padding-top: 0.5rem; color: var(--accent-primary);">Metode Pembayaran yang Diterima</label>
                                
                                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                                    ${lapak.paymentTransfer ? `
                                        <div class="p-1.5 border rounded-md bg-gray-50">
                                            <div class="font-semibold text-gray-800 mb-2 flex align-center"><i data-lucide="wallet" class="w-4 h-4 mr-2 text-primary" style="display:inline-block; vertical-align:middle;"></i> <span style="vertical-align:middle;">Transfer Bank</span></div>
                                            <div class="text-sm bank-info-grid">
                                                <div><span class="text-muted block text-[11px]">Bank</span> <strong class="text-gray-800">${lapak.bankName}</strong></div>
                                                <div><span class="text-muted block text-[11px]">No. Rekening</span> <strong class="text-gray-800">${lapak.bankAccNo}</strong></div>
                                                <div><span class="text-muted block text-[11px]">Nama Nasabah</span> <strong class="text-gray-800">${lapak.bankAccName}</strong></div>
                                            </div>
                                        </div>
                                    ` : ''}

                                    ${lapak.paymentQris ? `
                                        <div class="p-1.5 border rounded-md bg-gray-50">
                                            <div class="font-semibold text-gray-800 mb-2 flex align-center" style="padding-top: 0.5rem;"><i data-lucide="qr-code" class="w-4 h-4 mr-2 text-primary" style="display:inline-block; vertical-align:middle;"></i> <span style="vertical-align:middle;">QRIS</span></div>
                                            <div style="padding-left: 1rem;">
                                                <img src="${lapak.qrisImage}" style="max-height: 150px; width: auto; border: 1px solid var(--border-glass); border-radius: var(--radius-sm); margin-top: 0.25rem;">
                                            </div>
                                        </div>
                                    ` : ''}

                                    ${lapak.paymentCod ? `
                                        <div class="p-1.5 border rounded-md bg-gray-50">
                                            <div class="font-semibold text-gray-800 flex align-center"><i data-lucide="hand-coins" class="w-4 h-4 mr-2 text-primary" style="display:inline-block; vertical-align:middle;"></i> <span style="vertical-align:middle;">Cash on Delivery (COD) / Bayar di Tempat</span></div>
                                        </div>
                                    ` : ''}

                                    ${(!lapak.paymentTransfer && !lapak.paymentQris && !lapak.paymentCod) ? `
                                        <div class="text-center text-muted py-3 bg-gray-50 border border-dashed rounded-md">Belum menyetel metode pembayaran.</div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>

                        <!-- Edit Mode Container (Hidden by default) -->
                        <div id="warung-edit-container" class="hidden">
                            <form id="form-update-lapak" class="p-5 card border" style="max-width: 36rem; display: flex; flex-direction: column; gap: 1rem;">
                                <div class="form-group" style="margin: 0;">
                                    <label class="form-label font-semibold" style="margin-bottom: 4px; display: block;">Nama Warung</label>
                                    <input type="text" id="setting-lapak-name" class="form-input p-2.5 border rounded" style="width: 100%;" value="${lapak.name}" required>
                                </div>
                                
                                <div class="form-group" style="margin: 0;">
                                    <label class="form-label font-semibold" style="margin-bottom: 4px; display: block;">Deskripsi Warung</label>
                                    <textarea id="setting-lapak-desc" class="form-textarea p-2.5 border rounded" style="width: 100%;" required rows="4">${lapak.description}</textarea>
                                </div>

                                <div class="form-group" style="margin: 0;">
                                    <label class="form-label font-semibold" style="margin-bottom: 4px; display: block;">Unit Eselon I</label>
                                    <select id="setting-lapak-eselon1" class="form-select p-2.5 border rounded" style="width: 100%; cursor: pointer;" required>
                                        <option value="">-- Pilih Unit Eselon I --</option>
                                        <option value="Setjen" ${lapak.eselon1 === 'Setjen' ? 'selected' : ''}>Setjen</option>
                                        <option value="Ditjen Binalavotas" ${lapak.eselon1 === 'Ditjen Binalavotas' ? 'selected' : ''}>Ditjen Binalavotas</option>
                                        <option value="Ditjen Binapenta & PKK" ${lapak.eselon1 === 'Ditjen Binapenta & PKK' ? 'selected' : ''}>Ditjen Binapenta & PKK</option>
                                        <option value="Binwasnaker & K3" ${lapak.eselon1 === 'Binwasnaker & K3' ? 'selected' : ''}>Binwasnaker & K3</option>
                                        <option value="PHI & Jamsos" ${lapak.eselon1 === 'PHI & Jamsos' ? 'selected' : ''}>PHI & Jamsos</option>
                                        <option value="Itjen" ${lapak.eselon1 === 'Itjen' ? 'selected' : ''}>Itjen</option>
                                        <option value="Barenbang" ${lapak.eselon1 === 'Barenbang' ? 'selected' : ''}>Barenbang</option>
                                    </select>
                                </div>

                                <div class="form-group" style="margin: 0;">
                                    <label class="form-label font-semibold" style="margin-bottom: 4px; display: block;">Unit Eselon II</label>
                                    <select id="setting-lapak-eselon2" class="form-select p-2.5 border rounded" style="width: 100%; cursor: pointer;" required>
                                        <option value="">-- Pilih Eselon I Terlebih Dahulu --</option>
                                    </select>
                                    <input type="hidden" id="saved-setting-eselon2" value="${lapak.eselon2 || ''}">
                                </div>

                                <div class="form-group" style="margin: 0;">
                                    <label class="form-label font-semibold" style="margin-bottom: 4px; display: block;">Bagian / Divisi</label>
                                    <input type="text" id="setting-lapak-bagian" class="form-input p-2.5 border rounded" style="width: 100%;" value="${lapak.bagian || ''}" placeholder="Contoh: Bagian Umum" required>
                                </div>

                                <div class="grid grid-2 gap-4">
                                    <div class="form-group" style="margin: 0;">
                                        <label class="form-label font-semibold" style="margin-bottom: 4px; display: block;">Gedung</label>
                                        <select id="setting-lapak-gedung" class="form-select p-2.5 border rounded" style="width: 100%; cursor: pointer;" required>
                                            <option value="">-- Pilih Gedung --</option>
                                            <option value="Gedung A" ${lapak.gedung === 'Gedung A' ? 'selected' : ''}>Gedung A</option>
                                            <option value="Gedung B" ${lapak.gedung === 'Gedung B' ? 'selected' : ''}>Gedung B</option>
                                        </select>
                                    </div>
                                    <div class="form-group" style="margin: 0;">
                                        <label class="form-label font-semibold" style="margin-bottom: 4px; display: block;">Lantai</label>
                                        <select id="setting-lapak-lantai" class="form-select p-2.5 border rounded" style="width: 100%; cursor: pointer;" required>
                                            <option value="">-- Pilih Lantai --</option>
                                            <option value="Lantai 1" ${lapak.lantai === 'Lantai 1' ? 'selected' : ''}>Lantai 1</option>
                                            <option value="Lantai 2" ${lapak.lantai === 'Lantai 2' ? 'selected' : ''}>Lantai 2</option>
                                            <option value="Lantai 3" ${lapak.lantai === 'Lantai 3' ? 'selected' : ''}>Lantai 3</option>
                                            <option value="Lantai 4" ${lapak.lantai === 'Lantai 4' ? 'selected' : ''}>Lantai 4</option>
                                            <option value="Lantai 5" ${lapak.lantai === 'Lantai 5' ? 'selected' : ''}>Lantai 5</option>
                                            <option value="Lantai 6" ${lapak.lantai === 'Lantai 6' ? 'selected' : ''}>Lantai 6</option>
                                            <option value="Lantai 7" ${lapak.lantai === 'Lantai 7' ? 'selected' : ''}>Lantai 7</option>
                                            <option value="Lantai 8" ${lapak.lantai === 'Lantai 8' ? 'selected' : ''}>Lantai 8</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="border-t border-gray-100 pt-2" style="margin-top: 0.25rem;">
                                    <label class="form-label font-bold text-sm block mb-3" style="padding-top: 0.5rem; color: var(--accent-primary);">Metode Pembayaran yang Diterima</label>
                                    
                                    <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                                        
                                        <!-- 1. Transfer Bank -->
                                        <div class="p-1.5 border rounded-md" style="background: var(--bg-primary);">
                                            <label class="flex items-center gap-2 font-semibold cursor-pointer" style="margin-bottom: 0;">
                                                <input type="checkbox" id="pay-transfer" ${lapak.paymentTransfer ? 'checked' : ''} style="width: 1.1rem; height: 1.1rem; cursor: pointer;">
                                                <span>Transfer Bank</span>
                                            </label>
                                            
                                            <!-- Transfer Details -->
                                            <div id="transfer-details-container" style="display: ${lapak.paymentTransfer ? 'flex' : 'none'}; flex-direction: column; gap: 0.5rem; margin-top: 0.75rem;">
                                                <div class="grid grid-2 gap-3">
                                                    <div class="form-group" style="margin: 0;">
                                                        <label class="text-xs font-semibold block mb-1">Nama Bank</label>
                                                        <input type="text" id="pay-bank-name" class="form-input p-2 border rounded text-sm bg-white" style="width:100%;" placeholder="Contoh: Mandiri, BCA" value="${lapak.bankName || ''}">
                                                    </div>
                                                    <div class="form-group" style="margin: 0;">
                                                        <label class="text-xs font-semibold block mb-1">No. Rekening</label>
                                                        <input type="text" id="pay-bank-no" class="form-input p-2 border rounded text-sm bg-white" style="width:100%;" placeholder="Contoh: 1234567890" value="${lapak.bankAccNo || ''}">
                                                    </div>
                                                </div>
                                                <div class="form-group" style="margin: 0;">
                                                    <label class="text-xs font-semibold block mb-1">Nama Pemilik Rekening (Nasabah)</label>
                                                    <input type="text" id="pay-bank-holder" class="form-input p-2 border rounded text-sm bg-white" style="width:100%;" placeholder="Nama lengkap sesuai buku tabungan" value="${lapak.bankAccName || ''}">
                                                </div>
                                            </div>
                                        </div>

                                        <!-- 2. QRIS -->
                                        <div class="p-1.5 border rounded-md" style="background: var(--bg-primary);">
                                            <label class="flex items-center gap-2 font-semibold cursor-pointer" style="margin-bottom: 0;">
                                                <input type="checkbox" id="pay-qris" ${lapak.paymentQris ? 'checked' : ''} style="width: 1.1rem; height: 1.1rem; cursor: pointer;">
                                                <span>QRIS</span>
                                            </label>
                                            
                                            <!-- QRIS Details -->
                                            <div id="qris-details-container" style="display: ${lapak.paymentQris ? 'block' : 'none'}; margin-top: 0.75rem;">
                                                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                                    <label class="text-xs font-semibold block mb-1">Upload Kode QRIS (Gambar)</label>
                                                    <input type="file" id="pay-qris-file" class="form-input p-2 border rounded text-sm bg-white" style="width: 100%;" accept="image/*">
                                                    <input type="hidden" id="pay-qris-base64" value="${lapak.qrisImage || ''}">
                                                    <div id="qris-preview-container" class="mt-2 ${lapak.qrisImage ? '' : 'hidden'}">
                                                        <p class="text-xs text-muted mb-1">Pratinjau Kode QRIS:</p>
                                                        <img id="qris-preview-img" src="${lapak.qrisImage || ''}" style="max-height: 150px; width: auto; border: 1px solid var(--border-glass); border-radius: var(--radius-sm);">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- 3. COD -->
                                        <div class="p-1.5 border rounded-md" style="background: var(--bg-primary);">
                                            <label class="flex items-center gap-2 font-semibold cursor-pointer" style="margin-bottom: 0;">
                                                <input type="checkbox" id="pay-cod" ${lapak.paymentCod ? 'checked' : ''} style="width: 1.1rem; height: 1.1rem; cursor: pointer;">
                                                <span>Cash on Delivery (COD) / Bayar di Tempat</span>
                                            </label>
                                        </div>

                                    </div>
                                </div>
                                
                                <div class="flex gap-2 justify-end mt-4">
                                    <button type="button" id="btn-cancel-edit-warung" class="btn btn-outline py-2 px-4">Batal</button>
                                    <button type="submit" class="btn btn-primary px-6 py-2.5 font-bold text-white shadow-sm hover:shadow-md transition-all">Simpan</button>
                                </div>
                            </form>
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
    
    // Create Lapak handler
    const formCreate = document.getElementById('form-create-lapak');
    if (formCreate) {
        // Eselon dynamic select logic for Create Lapak
        const eselon1Select = document.getElementById('lapak-eselon1');
        const eselon2Select = document.getElementById('lapak-eselon2');
        if (eselon1Select && eselon2Select) {
            eselon1Select.addEventListener('change', () => {
                const selected1 = eselon1Select.value;
                eselon2Select.innerHTML = '<option value="">-- Pilih Unit Eselon II --</option>';
                if (selected1 && eselonData[selected1]) {
                    eselonData[selected1].forEach(opt => {
                        const optionEl = document.createElement('option');
                        optionEl.value = opt;
                        optionEl.textContent = opt;
                        eselon2Select.appendChild(optionEl);
                    });
                } else {
                    eselon2Select.innerHTML = '<option value="">-- Pilih Eselon I Terlebih Dahulu --</option>';
                }
            });
        }

        formCreate.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('lapak-name').value.trim();
            const desc = document.getElementById('lapak-desc').value.trim();
            const eselon1 = document.getElementById('lapak-eselon1').value;
            const eselon2 = document.getElementById('lapak-eselon2').value;
            const bagian = document.getElementById('lapak-bagian').value.trim();
            const gedung = document.getElementById('lapak-gedung').value.trim();
            const lantai = document.getElementById('lapak-lantai').value.trim();
            
            await Store.createLapak({ 
                userId: user.id, 
                name, 
                description: desc,
                eselon1,
                eselon2,
                bagian,
                gedung,
                lantai
            });
            showToast('Warung berhasil dibuat!', 'success');
            Router.navigate('/dashboard');
        });
        return; // Stop if rendering create form
    }

    // Tabs logic
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active', 'card', 'border-primary');
                t.classList.add('hover:bg-gray-200', 'border-transparent');
            });
            contents.forEach(c => c.classList.add('hidden'));
            
            tab.classList.add('active', 'card', 'border-primary');
            tab.classList.remove('hover:bg-gray-200', 'border-transparent');
            document.getElementById(tab.dataset.target).classList.remove('hidden');
        });
    });

    // Product Form logic
    const formContainer = document.getElementById('product-form-container');
    const form = document.getElementById('product-form');
    
    // Image upload handler
    const fileInput = document.getElementById('prod-image');
    const base64Input = document.getElementById('prod-image-base64');
    fileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                base64Input.value = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('btn-show-add-product')?.addEventListener('click', () => {
        form.reset();
        document.getElementById('prod-id').value = '';
        base64Input.value = '';
        document.getElementById('product-form-title').textContent = 'Tambah Produk Baru';
        formContainer.classList.remove('hidden');
    });

    document.getElementById('btn-cancel-product')?.addEventListener('click', () => {
        formContainer.classList.add('hidden');
    });

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('prod-id').value;
        const productData = {
            name: document.getElementById('prod-name').value,
            price: parseInt(document.getElementById('prod-price').value),
            category: document.getElementById('prod-category').value,
            unit: document.getElementById('prod-unit').value,
            minOrder: parseInt(document.getElementById('prod-min-order').value) || 1,
            status: document.getElementById('prod-status').value,
            stock: parseInt(document.getElementById('prod-stock').value),
            description: document.getElementById('prod-desc').value,
            sellerId: user.id
        };

        if (base64Input.value) {
            productData.image = base64Input.value;
        } else if (!id) {
            // Default image placeholder if new product and no image uploaded
            productData.image = '📦';
        }

        if (id) {
            await Store.updateProduct(id, productData);
            showToast('Produk diperbarui!', 'success');
        } else {
            await Store.addProduct(productData);
            showToast('Produk ditambahkan!', 'success');
        }
        Router.handleRoute(); // Force re-render of current view
    });

    // Edit/Delete handlers
    document.querySelectorAll('.btn-edit-product').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.closest('button').dataset.id;
            const p = await Store.getProduct(id);
            if (p) {
                document.getElementById('prod-id').value = p.id;
                document.getElementById('prod-name').value = p.name;
                document.getElementById('prod-price').value = p.price;
                document.getElementById('prod-category').value = p.category;
                document.getElementById('prod-unit').value = p.unit || 'Pcs';
                document.getElementById('prod-min-order').value = p.minOrder || 1;
                document.getElementById('prod-status').value = p.status || 'ready';
                document.getElementById('prod-stock').value = p.stock;
                document.getElementById('prod-desc').value = p.description;
                base64Input.value = p.image || ''; // Store current image
                fileInput.value = ''; // Clear file input
                
                document.getElementById('product-form-title').textContent = 'Edit Produk';
                formContainer.classList.remove('hidden');
                formContainer.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    document.querySelectorAll('.btn-delete-product').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if(confirm('Yakin ingin menghapus produk ini?')) {
                const id = e.target.closest('button').dataset.id;
                await Store.deleteProduct(id);
                showToast('Produk dihapus', 'success');
                Router.handleRoute(); // Force re-render of current view
            }
        });
    });

    // Handler date & time picker - aktifkan tombol Proses Pesanan ketika KEDUANYA dipilih
    const checkDeliveryInputs = async (orderId, card) => {
        const dateInput = card.querySelector('.delivery-date-input');
        const timeInput = card.querySelector('.delivery-time-input');
        
        const selectedDate = dateInput?.value;
        const selectedTime = timeInput?.value;
        
        if (selectedDate && selectedTime) {
            // Simpan estimatedDelivery dan deliveryTime ke Firestore
            await Store.updateOrderStatus(orderId, 'pending'); // keep status same
            const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js");
            const { db } = await import('../firebase-init.js');
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, { estimatedDelivery: selectedDate, deliveryTime: selectedTime });

            // Aktifkan tombol Proses Pesanan pada kartu yang sama
            const processBtn = card.querySelector('.btn-update-status[data-status="processing"]');
            if (processBtn) {
                processBtn.removeAttribute('disabled');
                processBtn.style.opacity = '1';
                processBtn.style.cursor = 'pointer';
            }
            
            // Tampilkan tanggal & waktu yang dipilih
            const formattedDate = new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            
            // Sembunyikan input dan tampilkan hasil
            const container = dateInput.closest('.flex');
            if (container) {
                container.insertAdjacentHTML('afterend', `<div class="font-bold text-blue-800 text-sm mt-1" style="color: #1e40af;">${formattedDate} (${selectedTime})</div>`);
                container.style.display = 'none';
            }
            const hint = card.querySelector('.text-blue-600');
            if (hint) hint.style.display = 'none';
        }
    };

    document.querySelectorAll('.delivery-date-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const card = e.target.closest('.order-card');
            if (card) checkDeliveryInputs(e.target.dataset.orderId, card);
        });
    });
    
    document.querySelectorAll('.delivery-time-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const card = e.target.closest('.order-card');
            if (card) checkDeliveryInputs(e.target.dataset.orderId, card);
        });
    });

    // Order status updates
    document.querySelectorAll('.btn-update-status').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const button = e.target.closest('button');
            if (button.disabled) return; // Abaikan jika tombol disabled
            const id = button.dataset.id;
            const status = button.dataset.status;
            if(confirm(`Ubah status pesanan menjadi ${status}?`)) {
                await Store.updateOrderStatus(id, status);
                
                try {
                    const order = await Store.getOrder(id);
                    if (order && order.buyerId) {
                        const buyer = await Store.getUser(order.buyerId);
                        if (buyer && buyer.phone) {
                            let phone = buyer.phone.replace(/\D/g, '');
                            if (phone.startsWith('0')) phone = '62' + phone.substring(1);
                            if (!phone.startsWith('62')) phone = '62' + phone;
                            
                            const lapak = await Store.getLapak(order.sellerId);
                            const warungName = lapak ? lapak.name : 'kami';
                            
                            let text = '';
                            if (status === 'processing') {
                                const estDate = order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'yang ditentukan';
                                text = `Halo Kak ${buyer.name}, terima kasih untuk orderannya.\nPesanan makanan/ minuman Kakak di warung ${warungName} saat ini sedang kami proses dan dipersiapkan.\nSkedul mendarat di meja kakak tanggal ${estDate}`;
                            } else if (status === 'shipped') {
                                const waktu = (order.deliveryTime || 'segera').toLowerCase();
                                text = `Halo Kak ${buyer.name}, pesanan Kakak saat ini sedang dikirim ke meja Kakak, Insya Allah ${waktu} sudah bisa Kakak terima.`;
                            } else if (status === 'completed') {
                                text = `Halo Kak ${buyer.name}, pesanan Kakak di warung ${warungName} saat ini telah selesai ✅ \nTerima kasih sudah jajan di yuuk-jajan.cilebut-one.cloud`;
                            } else if (status === 'cancelled') {
                                text = `Maaf Kak ${buyer.name}, pesanan Anda saat ini telah DIBATALKAN ❌.`;
                            }
                            
                            if (text) {
                                const res = await fetch(`/wa-api/message/sendText/umkm_vercel-app`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'apikey': 'cilebut-ONE.server:2026'
                                    },
                                    body: JSON.stringify({ number: phone, textMessage: { text: text } })
                                });
                                const resData = await res.json().catch(() => ({}));
                                console.log('Evolution API Response (Dashboard Status Update):', res.status, resData);
                            }
                        } else {
                            console.warn('⚠️ Tidak dapat mengirim WA: Nomor HP pembeli tidak ditemukan atau kosong.');
                        }
                    }
                } catch(err) {
                    console.error("Gagal mengirim WA (Evolution API):", err);
                }

                showToast('Status pesanan diperbarui', 'success');
                Router.handleRoute(); // Force a re-render so the UI updates
            }
        });
    });

    // Toggle Edit/View mode for Warung Settings
    const btnEditWarung = document.getElementById('btn-edit-warung');
    const btnCancelEditWarung = document.getElementById('btn-cancel-edit-warung');
    const warungViewContainer = document.getElementById('warung-view-container');
    const warungEditContainer = document.getElementById('warung-edit-container');

    if (btnEditWarung && btnCancelEditWarung && warungViewContainer && warungEditContainer) {
        btnEditWarung.addEventListener('click', () => {
            warungViewContainer.classList.add('hidden');
            warungEditContainer.classList.remove('hidden');
            btnEditWarung.style.display = 'none';
        });

        btnCancelEditWarung.addEventListener('click', () => {
            warungEditContainer.classList.add('hidden');
            warungViewContainer.classList.remove('hidden');
            btnEditWarung.style.display = 'block';
        });
    }

    // Toggle Payment details
    const payTransferCheck = document.getElementById('pay-transfer');
    const transferDetails = document.getElementById('transfer-details-container');
    payTransferCheck?.addEventListener('change', () => {
        if (transferDetails) {
            transferDetails.style.display = payTransferCheck.checked ? 'flex' : 'none';
        }
    });

    const payQrisCheck = document.getElementById('pay-qris');
    const qrisDetails = document.getElementById('qris-details-container');
    payQrisCheck?.addEventListener('change', () => {
        if (qrisDetails) {
            qrisDetails.style.display = payQrisCheck.checked ? 'block' : 'none';
        }
    });

    // QRIS Image upload handler
    const qrisFileInput = document.getElementById('pay-qris-file');
    const qrisBase64Input = document.getElementById('pay-qris-base64');
    const qrisPreviewContainer = document.getElementById('qris-preview-container');
    const qrisPreviewImg = document.getElementById('qris-preview-img');

    qrisFileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Data = e.target.result;
                if (qrisBase64Input) qrisBase64Input.value = base64Data;
                if (qrisPreviewImg) {
                    qrisPreviewImg.src = base64Data;
                    qrisPreviewContainer?.classList.remove('hidden');
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // Eselon dynamic select logic for Settings Lapak
    const settingEselon1Select = document.getElementById('setting-lapak-eselon1');
    const settingEselon2Select = document.getElementById('setting-lapak-eselon2');
    const settingSavedEselon2 = document.getElementById('saved-setting-eselon2')?.value;

    if (settingEselon1Select && settingEselon2Select) {
        settingEselon1Select.addEventListener('change', () => {
            const selected1 = settingEselon1Select.value;
            settingEselon2Select.innerHTML = '<option value="">-- Pilih Unit Eselon II --</option>';
            if (selected1 && eselonData[selected1]) {
                eselonData[selected1].forEach(opt => {
                    const optionEl = document.createElement('option');
                    optionEl.value = opt;
                    optionEl.textContent = opt;
                    if (opt === settingSavedEselon2) {
                        optionEl.selected = true;
                    }
                    settingEselon2Select.appendChild(optionEl);
                });
            } else {
                settingEselon2Select.innerHTML = '<option value="">-- Pilih Eselon I Terlebih Dahulu --</option>';
            }
        });
        // Trigger on load
        settingEselon1Select.dispatchEvent(new Event('change'));
    }

    // Lapak settings update
    document.getElementById('form-update-lapak')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("form-update-lapak submit event fired!");
        try {
            const name = document.getElementById('setting-lapak-name').value;
            const desc = document.getElementById('setting-lapak-desc').value;
            const eselon1 = document.getElementById('setting-lapak-eselon1').value;
            const eselon2 = document.getElementById('setting-lapak-eselon2').value;
            const bagian = document.getElementById('setting-lapak-bagian').value.trim();
            const gedung = document.getElementById('setting-lapak-gedung').value.trim();
            const lantai = document.getElementById('setting-lapak-lantai').value.trim();
            
            console.log("Name:", name, "Desc:", desc);
            
            const paymentTransfer = document.getElementById('pay-transfer')?.checked || false;
            const bankName = document.getElementById('pay-bank-name')?.value.trim() || '';
            const bankAccNo = document.getElementById('pay-bank-no')?.value.trim() || '';
            const bankAccName = document.getElementById('pay-bank-holder')?.value.trim() || '';
            
            const paymentQris = document.getElementById('pay-qris')?.checked || false;
            const qrisImage = document.getElementById('pay-qris-base64')?.value || '';
            
            const paymentCod = document.getElementById('pay-cod')?.checked || false;

            console.log("Payment settings to save:", { paymentTransfer, bankName, bankAccNo, bankAccName, paymentQris, qrisImage, paymentCod });

            // Validation for Transfer
            if (paymentTransfer && (!bankName || !bankAccNo || !bankAccName)) {
                showToast('Harap lengkapi data rekening Bank untuk metode Transfer.', 'error');
                return;
            }

            // Validation for QRIS
            if (paymentQris && !qrisImage) {
                showToast('Harap upload gambar kode QRIS Anda.', 'error');
                return;
            }

            // Must select at least one method
            if (!paymentTransfer && !paymentQris && !paymentCod) {
                showToast('Pilih minimal satu metode pembayaran.', 'error');
                return;
            }

            console.log("Calling Store.updateLapak with userId:", user.id);
            await Store.updateLapak(user.id, { 
                name, 
                description: desc,
                eselon1,
                eselon2,
                bagian,
                gedung,
                lantai,
                paymentTransfer,
                bankName,
                bankAccNo,
                bankAccName,
                paymentQris,
                qrisImage,
                paymentCod
            });
            console.log("Store.updateLapak completed successfully!");
            showToast('Pengaturan disimpan', 'success');
            
            // In-place DOM update instead of full page router reload
            const updatedLapak = await Store.getLapak(user.id);
            if (updatedLapak) {
                // Update read-only details container HTML
                const viewContainer = document.getElementById('warung-view-container');
                if (viewContainer) {
                    viewContainer.innerHTML = `
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; padding-top: 0.5rem; color: var(--accent-primary);">Nama Warung</label>
                            <div class="p-1.5 border rounded-md bg-gray-50 text-gray-800 font-medium">${updatedLapak.name}</div>
                        </div>
                        
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; padding-top: 0.5rem; color: var(--accent-primary);">Deskripsi Warung</label>
                            <div class="p-1.5 border rounded-md bg-gray-50 text-gray-800 font-medium" style="min-height: 80px; white-space: pre-wrap;">${updatedLapak.description}</div>
                        </div>

                        <div class="form-group" style="margin: 0;">
                            <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; padding-top: 0.5rem; color: var(--accent-primary);">Unit Kerja</label>
                            <div class="p-1.5 border rounded-md bg-gray-50 text-gray-800 font-medium">
                                ${(() => {
                                    const parts = [updatedLapak.bagian, updatedLapak.eselon2].filter(Boolean).join(' ');
                                    const full = parts && updatedLapak.eselon1 ? `${parts}, ${updatedLapak.eselon1}` : (parts || updatedLapak.eselon1 || '');
                                    return full || '<em class="text-muted text-xs">Belum diisi</em>';
                                })()}
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
                            <div class="form-group" style="margin: 0;">
                                <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; padding-top: 0.5rem; color: var(--accent-primary);">Gedung</label>
                                <div class="p-1.5 border rounded-md bg-gray-50 text-gray-800 font-medium">${updatedLapak.gedung || '<em class="text-muted text-xs">Belum diisi</em>'}</div>
                            </div>
                            <div class="form-group" style="margin: 0;">
                                <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; padding-top: 0.5rem; color: var(--accent-primary);">Lantai</label>
                                <div class="p-1.5 border rounded-md bg-gray-50 text-gray-800 font-medium">${updatedLapak.lantai || '<em class="text-muted text-xs">Belum diisi</em>'}</div>
                            </div>
                        </div>

                        <div class="border-t border-gray-100 pt-2" style="margin-top: 0.25rem;">
                            <label class="form-label font-bold text-sm block mb-3" style="padding-top: 0.5rem; color: var(--accent-primary);">Metode Pembayaran yang Diterima</label>
                            
                            <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                                ${updatedLapak.paymentTransfer ? `
                                    <div class="p-1.5 border rounded-md bg-gray-50">
                                        <div class="font-semibold text-gray-800 mb-2 flex align-center"><i data-lucide="wallet" class="w-4 h-4 mr-2 text-primary" style="display:inline-block; vertical-align:middle;"></i> <span style="vertical-align:middle;">Transfer Bank</span></div>
                                        <div class="text-sm bank-info-grid">
                                            <div><span class="text-muted block text-[11px]">Bank</span> <strong class="text-gray-800">${updatedLapak.bankName}</strong></div>
                                            <div><span class="text-muted block text-[11px]">No. Rekening</span> <strong class="text-gray-800">${updatedLapak.bankAccNo}</strong></div>
                                            <div><span class="text-muted block text-[11px]">Nama Nasabah</span> <strong class="text-gray-800">${updatedLapak.bankAccName}</strong></div>
                                        </div>
                                    </div>
                                ` : ''}

                                ${updatedLapak.paymentQris ? `
                                    <div class="p-1.5 border rounded-md bg-gray-50">
                                        <div class="font-semibold text-gray-800 mb-2 flex align-center" style="padding-top: 0.5rem;"><i data-lucide="qr-code" class="w-4 h-4 mr-2 text-primary" style="display:inline-block; vertical-align:middle;"></i> <span style="vertical-align:middle;">QRIS</span></div>
                                        <div style="padding-left: 1rem;">
                                            <img src="${updatedLapak.qrisImage}" style="max-height: 150px; width: auto; border: 1px solid var(--border-glass); border-radius: var(--radius-sm); margin-top: 0.25rem;">
                                        </div>
                                    </div>
                                ` : ''}

                                ${updatedLapak.paymentCod ? `
                                    <div class="p-1.5 border rounded-md bg-gray-50">
                                        <div class="font-semibold text-gray-800 flex align-center"><i data-lucide="hand-coins" class="w-4 h-4 mr-2 text-primary" style="display:inline-block; vertical-align:middle;"></i> <span style="vertical-align:middle;">Cash on Delivery (COD) / Bayar di Tempat</span></div>
                                    </div>
                                ` : ''}

                                ${(!updatedLapak.paymentTransfer && !updatedLapak.paymentQris && !updatedLapak.paymentCod) ? `
                                    <div class="text-center text-muted py-3 bg-gray-50 border border-dashed rounded-md">Belum menyetel metode pembayaran.</div>
                                ` : ''}
                            </div>
                        </div>
                    `;

                    // Re-create icons for new elements
                    if (window.lucide) window.lucide.createIcons();
                }

                // Update the dashboard header warung name inline
                const headerWarungName = document.querySelector('.dashboard-header span.font-semibold');
                if (headerWarungName) {
                    headerWarungName.textContent = updatedLapak.name;
                }
            }

            // Hide edit form and show updated view
            if (warungEditContainer && warungViewContainer && btnEditWarung) {
                warungEditContainer.classList.add('hidden');
                warungViewContainer.classList.remove('hidden');
                btnEditWarung.style.display = 'block';
            }
        } catch (err) {
            console.error("Error in update settings form submission:", err);
            showToast('Gagal menyimpan: ' + err.message, 'error');
        }
    });
}
