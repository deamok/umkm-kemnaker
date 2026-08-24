import Store from '../store.js';
import Auth from '../auth.js';
import Router from '../router.js';
import { formatRupiah, showToast, timeAgo, generateId } from '../utils.js';

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
                        <div class="flex flex-center justify-center mx-auto mb-4 text-primary" style="width: 5rem; height: 5rem; background-color: rgba(var(--accent-primary-rgb), 0.1); border-radius: var(--radius-full);">
                            <i data-lucide="store" class="w-10 h-10"></i>
                        </div>
                        <h1 class="text-2xl font-heading font-bold mb-2">Buka Lapak Anda</h1>
                        <p class="text-muted mb-5">Mulai jualan produk UMKM Anda ke ribuan pembeli sekarang juga!</p>
                        
                        <form id="form-create-lapak" class="text-left gap-4">
                            <div class="form-group">
                                <label class="form-label font-semibold">Nama Lapak</label>
                                <input type="text" id="lapak-name" class="form-input p-3 border card focus:ring-2 focus:ring-primary/50" style="width: 100%;" required placeholder="Contoh: Kedai Makmur">
                            </div>
                            <div class="form-group">
                                <label class="form-label font-semibold">Deskripsi Lapak</label>
                                <textarea id="lapak-desc" class="form-textarea p-3 border card focus:ring-2 focus:ring-primary/50" style="width: 100%;" required rows="3" placeholder="Ceritakan tentang toko Anda..."></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block btn-lg py-3 card font-bold text-white hover:shadow-lg transition-all mt-4" style="width: 100%;">
                                Buka Lapak Sekarang
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
        <div class="product-list-item p-4 card border flex flex-col flex-row flex-center gap-4 mb-3 hover:shadow-md transition-shadow">
            <div class="card flex flex-center justify-center text-3xl flex-shrink-0" style="width: 4rem; height: 4rem;">${p.image || '📦'}</div>
            <div class="flex-grow text-center md:text-left">
                <div class="font-semibold text-lg">${p.name}</div>
                <div class="text-primary font-bold">${formatRupiah(p.price)}</div>
                <div class="text-sm text-muted mt-1 flex flex-center justify-center md:justify-start gap-3">
                    <span class="badge badge-${p.category} text-xs px-2 py-0.5 capitalize border" style="border-radius: var(--radius-full);">${p.category}</span>
                    <span>Stok: <span class="font-semibold ${p.stock > 0 ? 'text-green-600' : 'text-red-600'}">${p.stock}</span></span>
                </div>
            </div>
            <div class="flex gap-2 md:w-auto mt-3 md:mt-0" style="width: 100%;">
                <button class="btn btn-sm btn-outline btn-edit-product flex-1 md:flex-none border-blue-200 text-accent" data-id="${p.id}"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
                <button class="btn btn-sm btn-outline btn-delete-product flex-1 md:flex-none border-red-200 text-danger" data-id="${p.id}"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </div>
        </div>
    `;

    const renderSellerOrderCard = async (order) => {
        const buyer = await Store.getUser(order.buyerId) || { name: 'Pembeli' };
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
                    
                    <div class="flex flex-wrap gap-2">
                        ${order.status === 'pending' ? `<button class="btn btn-sm btn-primary btn-update-status" data-id="${order.id}" data-status="processing">Proses Pesanan</button>` : ''}
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
                    <p class="text-muted text-sm mt-1">Kelola lapak <span class="font-semibold">${lapak.name}</span> Anda</p>
                </div>
                <a href="#/lapak/${user.id}" class="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white mt-4 md:mt-0 transition-colors">Lihat Lapak <i data-lucide="external-link" class="w-4 h-4 ml-1 inline"></i></a>
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
                        <div class="flex flex-between flex-center mb-5">
                            <h2 class="text-xl font-heading font-bold">Katalog Produk</h2>
                            <button id="btn-show-add-product" class="btn btn-primary btn-sm flex flex-center"><i data-lucide="plus" class="w-4 h-4 mr-1"></i> Tambah</button>
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

                        <div class="products-list">
                            ${products.length > 0 ? products.map(renderProductRow).join('') : '<p class="text-center text-muted py-8">Belum ada produk. Silakan tambah produk baru.</p>'}
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
                        <h2 class="text-xl font-heading font-bold mb-5">Pengaturan Lapak</h2>
                        <form id="form-update-lapak" class="p-5 card border" style="max-width: 36rem;">
                            <div class="form-group mb-4">
                                <label class="form-label font-semibold">Nama Lapak</label>
                                <input type="text" id="setting-lapak-name" class="form-input p-2 border rounded" style="width: 100%;" value="${lapak.name}" required>
                            </div>
                            <div class="form-group mb-5">
                                <label class="form-label font-semibold">Deskripsi Lapak</label>
                                <textarea id="setting-lapak-desc" class="form-textarea p-2 border rounded" style="width: 100%;" required rows="4">${lapak.description}</textarea>
                            </div>
                            <button type="submit" class="btn btn-primary px-6">Simpan Perubahan</button>
                        </form>
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
        formCreate.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('lapak-name').value;
            const desc = document.getElementById('lapak-desc').value;
            await Store.createLapak({ userId: user.id, name, description: desc });
            showToast('Lapak berhasil dibuat!', 'success');
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
        Router.navigate('/dashboard');
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
                Router.navigate('/dashboard');
            }
        });
    });

    // Order status updates
    document.querySelectorAll('.btn-update-status').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.closest('button').dataset.id;
            const status = e.target.closest('button').dataset.status;
            if(confirm(`Ubah status pesanan menjadi ${status}?`)) {
                await Store.updateOrderStatus(id, status);
                showToast('Status pesanan diperbarui', 'success');
                Router.navigate('/dashboard');
            }
        });
    });

    // Lapak settings update
    document.getElementById('form-update-lapak')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('setting-lapak-name').value;
        const desc = document.getElementById('setting-lapak-desc').value;
        await Store.updateLapak(user.id, { name, description: desc });
        showToast('Pengaturan disimpan', 'success');
        Router.navigate('/dashboard');
    });
}
