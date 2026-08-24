import Store from '../store.js';
import Auth from '../auth.js';
import Router from '../router.js';
import { renderProductCard } from '../components/productCard.js';
import { getCategoryEmoji, getCategoryLabel, escapeHtml, timeAgo } from '../utils.js';

export async function render() {
    const allProducts = await Store.getProducts();
    const products = allProducts.slice(0, 8);
    const lapaks = await Store.getAllLapaks();

    let lapaksHtml = '';
    let idx = 0;
    for (const lapak of lapaks) {
        idx++;
        const seller = await Store.getUser(lapak.userId);
        const sellerProducts = await Store.getProductsBySeller(lapak.userId);
        lapaksHtml += `
        <div class="card lapak-card slide-up delay-${idx}" data-userid="${lapak.userId}" style="cursor:pointer;">
            <div style="height:120px;background:${lapak.banner || 'var(--gradient-hero)'};border-radius:var(--radius-lg) var(--radius-lg) 0 0;display:flex;align-items:center;justify-content:center;">
                <span style="font-size:2.5rem;">${seller?.avatar || '🏪'}</span>
            </div>
            <div class="card-body text-center">
                <h3 class="font-heading font-bold mb-1">${escapeHtml(lapak.name)}</h3>
                <p class="text-secondary" style="font-size:var(--text-sm);">${sellerProducts.length} produk</p>
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
                        <h1 class="hero-title" style="font-size:3rem; font-weight:700; color:var(--text-primary); line-height:1.2; margin-bottom:1.5rem;">Dukung Usaha Teman<br>Satu Kantor di <span style="color:var(--accent-primary);">yukk jajan..!</span></h1>
                        <p class="hero-subtitle" style="color:var(--text-secondary); margin-bottom:2rem; font-size:1.1rem; max-width:500px;">Wadah jualan khusus pegawai Kemnaker (Gedung A & B). Temukan makanan, kue, jamu tradisional buatan sendiri. Gratis ongkir karena transaksi selesai di kantor!</p>
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

            <!-- Categories Section -->
            <section class="section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">Kategori Pilihan</h2>
                    </div>
                    <div class="category-grid">
                        ${['makanan', 'minuman', 'kerajinan', 'lainnya'].map((cat, i) => `
                            <div class="category-card card slide-up delay-${i + 1}" data-category="${cat}">
                                <div class="card-body text-center">
                                    <span class="category-icon">${getCategoryEmoji(cat)}</span>
                                    <h3 class="category-name">${getCategoryLabel(cat)}</h3>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>

            <!-- Featured Products -->
            <section class="section">
                <div class="container">
                    <div class="section-header">
                        <div>
                            <h2 class="section-title">Produk Terbaru</h2>
                            <p class="text-secondary mt-1">Pilihan produk segar dari berbagai lapak.</p>
                        </div>
                        <a href="#/products" class="btn btn-outline btn-sm">
                            Lihat Semua <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>
                        </a>
                    </div>
                    <div class="product-grid grid grid-4">
                        ${products.map(p => renderProductCard(p)).join('')}
                    </div>
                </div>
            </section>

            <!-- Popular Lapak -->
            <section class="section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">Lapak Populer</h2>
                    </div>
                    <div class="grid-3">
                        ${lapaksHtml}
                    </div>
                </div>
            </section>

            <!-- CTA Banner -->
            <section class="section">
                <div class="container">
                    <div class="card slide-up" style="background:var(--gradient-hero);border:none;padding:var(--space-3xl);text-align:center;">
                        <h2 class="font-heading" style="font-size:var(--text-3xl);color:white;margin-bottom:var(--space-md);">Mulai Jualan Sekarang!</h2>
                        <p style="color:rgba(255,255,255,0.8);max-width:500px;margin:0 auto var(--space-xl);">Buka lapak gratis dan mulai jual produk UMKM kamu ke seluruh Indonesia.</p>
                        <button class="btn btn-secondary btn-lg" id="btn-cta-sell" style="background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.3);">
                            <i data-lucide="rocket" style="width:20px;height:20px;"></i> Buka Lapak Sekarang
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
