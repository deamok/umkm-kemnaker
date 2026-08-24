import Store from '../store.js';
import Auth from '../auth.js';
import Router from '../router.js';
import { renderProductCard } from '../components/productCard.js';
import { getCategoryEmoji, getCategoryLabel, escapeHtml, timeAgo } from '../utils.js';

export async function render() {
    const allProducts = await Store.getProducts();
    const products = allProducts.slice(0, 8);
    const lapaks = await Store.getAllLapaks();
    const allOrders = await Store.getAllOrders();
    const allUsers = await Store.getUsers();
    
    // Calculate total sold products
    const totalSold = allProducts.reduce((sum, p) => sum + (p.sold || 0), 0);
    
    // Generate unique random light colors for 5 cards
    const lightColors = ['#fef3c7', '#d1fae5', '#dbeafe', '#fce7f3', '#f3e8ff', '#e0e7ff', '#ffedd5', '#ecfdf5', '#fefce8', '#ccfbf1'];
    const shuffledColors = lightColors.sort(() => 0.5 - Math.random()).slice(0, 5);

    let lapaksHtml = '';
    let idx = 0;
    for (const lapak of lapaks) {
        idx++;
        const seller = await Store.getUser(lapak.userId);
        const sellerProducts = await Store.getProductsBySeller(lapak.userId);
        let bannerStyle = 'var(--gradient-hero)';
        if (lapak.banner) {
            if (lapak.banner.startsWith('data:image') || lapak.banner.startsWith('http')) {
                bannerStyle = `url('${lapak.banner}') center/cover`;
            } else {
                bannerStyle = lapak.banner; // fallback if it's just a color or something else
            }
        }

        let avatarHtml = '<span style="font-size:1.8rem;">🏪</span>';
        if (seller?.avatar) {
            if (seller.avatar.startsWith('data:image') || seller.avatar.startsWith('http')) {
                avatarHtml = `<img src="${seller.avatar}" style="width: 2.5rem; height: 2.5rem; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: var(--shadow-sm);">`;
            } else {
                avatarHtml = `<span style="font-size:1.8rem;">${seller.avatar}</span>`;
            }
        }

        lapaksHtml += `
        <div class="card lapak-card slide-up delay-${idx}" data-userid="${lapak.userId}" style="cursor:pointer; overflow: hidden; box-shadow: var(--shadow-sm);">
            <div style="height:80px; background:${bannerStyle}; display:flex; align-items:center; justify-content:center;">
                ${avatarHtml}
            </div>
            <div class="card-body text-center" style="padding: 0.6rem 0.5rem 0.75rem;">
                <h3 class="font-heading font-bold mb-0" style="font-size:0.8rem; color:var(--text-primary); line-height:1.3; word-break:break-word;">${escapeHtml(lapak.name)}</h3>
                <p class="text-secondary" style="font-size:0.7rem; margin-top:2px;">${sellerProducts.length} produk</p>
            </div>
        </div>
        `;
    }

    return `
        <div class="page-home fade-in">
            <!-- Hero Section -->
            <section class="hero" style="background: #ffffff; padding: 4rem 0; border-bottom: 1px solid var(--border-glass);">
                <div class="container flex-between align-center" style="gap: 2rem; flex-wrap: wrap;">
                    <div class="hero-content slide-up" style="flex: 1; min-width: 300px;">
                        <span style="color:var(--accent-primary); font-weight:600; text-transform:uppercase; font-size:14px; letter-spacing:1px; margin-bottom:1rem; display:block;">Pasar Digital Pegawai Kemnaker</span>
                        <h1 class="hero-title" style="font-weight:700; color:var(--text-primary); line-height:1.2; margin-bottom:1.5rem;">Dukung Usaha Teman <br class="hide-mobile">Satu Kantor di <img src="img/umkm.png" alt="UMKM Kemnaker" style="height: 1.2em; width: auto; mix-blend-mode: multiply; display: inline-block; vertical-align: middle; margin-left: 0.2rem;"></h1>
                        <p class="hero-subtitle" style="color:var(--text-secondary); margin-bottom:2rem; font-size:1.1rem; max-width:500px;">Tempatnya mencari produk UMKM hasil kreasi pegawai Kemnaker. Temukan aneka makanan, minuman dan jajanan yang bisa menjadi teman kerja di kantor atau dibawa pulang buat yang tercinta di rumah. Gratis ongkir karena transaksi selesai di kantor!</p>
                        <div class="hero-cta" style="display:flex; gap:1rem;">
                            <a href="#/products" class="btn btn-primary btn-lg" style="background:var(--accent-primary); border:none; border-radius:var(--radius-full); padding:0.75rem 2rem;">
                                Belanja Sekarang
                            </a>
                        </div>
                    </div>
                    <div class="hero-image slide-up delay-2" style="flex: 1; min-width: 300px; display:flex; justify-content:center;">
                        <img src="img/hero.jpg" alt="Pegawai Kemnaker Jajan" style="width:100%; max-width:550px; border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); object-fit:cover; aspect-ratio:4/3;">
                    </div>
                </div>
            </section>

            <!-- Statistik Section -->
            <section class="section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">Statistik Marketplace</h2>
                    </div>
                    <div class="dashboard-stats grid grid-2 grid-5 gap-4 mb-5">
                        <div class="stat-card p-5 card border text-center slide-up delay-1" style="background-color: ${shuffledColors[0]}; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px; box-shadow: var(--shadow-sm); border-radius: var(--radius-md);">
                            <div class="text-muted text-sm font-semibold mb-1" style="color: var(--text-secondary);">Total Produk</div>
                            <div class="stat-value text-3xl font-bold" style="color: var(--accent-primary); font-size: 2rem;">${allProducts.length}</div>
                        </div>
                        <div class="stat-card p-5 card border text-center slide-up delay-2" style="background-color: ${shuffledColors[1]}; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px; box-shadow: var(--shadow-sm); border-radius: var(--radius-md);">
                            <div class="text-muted text-sm font-semibold mb-1" style="color: var(--text-secondary);">Produk Terjual</div>
                            <div class="stat-value text-3xl font-bold" style="color: var(--accent-primary); font-size: 2rem;">${totalSold}</div>
                        </div>
                        <div class="stat-card p-5 card border text-center slide-up delay-3" style="background-color: ${shuffledColors[2]}; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px; box-shadow: var(--shadow-sm); border-radius: var(--radius-md);">
                            <div class="text-muted text-sm font-semibold mb-1" style="color: var(--text-secondary);">Total Transaksi</div>
                            <div class="stat-value text-3xl font-bold" style="color: var(--accent-primary); font-size: 2rem;">${allOrders.length}</div>
                        </div>
                        <div class="stat-card p-5 card border text-center slide-up delay-4" style="background-color: ${shuffledColors[3]}; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px; box-shadow: var(--shadow-sm); border-radius: var(--radius-md);">
                            <div class="text-muted text-sm font-semibold mb-1" style="color: var(--text-secondary);">Jumlah Pengguna</div>
                            <div class="stat-value text-3xl font-bold" style="color: var(--accent-primary); font-size: 2rem;">${allUsers.length}</div>
                        </div>
                        <div class="stat-card p-5 card border text-center slide-up delay-5" style="background-color: ${shuffledColors[4]}; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px; box-shadow: var(--shadow-sm); border-radius: var(--radius-md);">
                            <div class="text-muted text-sm font-semibold mb-1" style="color: var(--text-secondary);">Jumlah Warung</div>
                            <div class="stat-value text-3xl font-bold" style="color: var(--accent-primary); font-size: 2rem;">${lapaks.length}</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Featured Products -->
            <section class="section">
                <div class="container">
                    <div class="section-header">
                        <div>
                            <h2 class="section-title">Produk Terbaru</h2>
                            <p class="text-secondary mt-1">Pilihan produk segar dari berbagai warung.</p>
                        </div>
                        <a href="#/products" class="btn btn-outline btn-sm">
                            Lihat Semua <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>
                        </a>
                    </div>
                    <div class="product-grid grid grid-4">
                        ${(await Promise.all(products.map(async p => {
                            const seller = await Store.getLapak(p.sellerId) || await Store.getUser(p.sellerId);
                            return renderProductCard(p, seller);
                        }))).join('')}
                    </div>
                </div>
            </section>

            <!-- Warung Terdaftar -->
            <section class="section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">Warung Terdaftar</h2>
                    </div>
                    <div class="grid grid-6">
                        ${lapaksHtml}
                    </div>
                </div>
            </section>

            <!-- CTA Banner -->
            <section class="section">
                <div class="container">
                    <div class="card slide-up" style="background:var(--gradient-hero);border:none;padding:var(--space-3xl);text-align:center;">
                        <h2 class="font-heading" style="font-size:var(--text-3xl);color:white;margin-bottom:var(--space-md);">Mulai Jualan Sekarang!</h2>
                        <p style="color:rgba(255,255,255,0.8);max-width:500px;margin:0 auto var(--space-xl);">Buka warung gratis dan mulai jual serta pasarkan produk UMKM-mu ke seluruh rekan pegawai Kemnaker.</p>
                        <button class="btn btn-secondary btn-lg" id="btn-cta-sell" style="background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.3);">
                            <i data-lucide="rocket" style="width:20px;height:20px;"></i> Buka Warung-mu Sekarang
                        </button>
                    </div>
                </div>
            </section>
        </div>
    `;
}

export function afterRender() {
    document.getElementById('btn-explore')?.addEventListener('click', () => {
        Router.navigate('/products');
    });

    const handleOpenStore = () => {
        Router.navigate(Auth.isLoggedIn() ? '/dashboard' : '/register');
    };

    document.getElementById('btn-open-store')?.addEventListener('click', handleOpenStore);
    document.getElementById('btn-cta-sell')?.addEventListener('click', handleOpenStore);

    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            Router.navigate('/products?category=' + card.dataset.category);
        });
    });

    // Lapak cards
    document.querySelectorAll('.lapak-card').forEach(card => {
        card.addEventListener('click', () => {
            Router.navigate('/lapak/' + card.dataset.userid);
        });
    });

    if (window.lucide) lucide.createIcons();
}
