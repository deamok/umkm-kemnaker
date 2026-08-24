import Store from '../store.js';
import { timeAgo, escapeHtml } from '../utils.js';
import { renderProductCard } from '../components/productCard.js';

export async function render(params) {
    const userId = params.id;
    const lapak = await Store.getLapak(userId);
    const seller = await Store.getUser(userId);

    if (!lapak || !seller) {
        return `
            <div class="container mt-10 text-center fade-in">
                <i data-lucide="store" class="mx-auto text-muted mb-4" style="width: 5rem; height: 5rem;"></i>
                <h2 class="text-3xl font-bold font-heading">Lapak tidak ditemukan</h2>
                <p class="text-muted mt-2">Lapak yang Anda cari tidak ada atau telah dihapus.</p>
                <a href="#/" class="btn btn-primary mt-6 inline-block px-6 py-2 card">Kembali ke Beranda</a>
            </div>
        `;
    }

    const products = await Store.getProductsBySeller(userId);

    let bannerStyle = `background: linear-gradient(135deg, var(--color-primary), var(--color-accent))`;
    if (lapak.banner) {
        if (lapak.banner.startsWith('data:image') || lapak.banner.startsWith('http')) {
            bannerStyle = `background: url('${lapak.banner}') center/cover`;
        } else {
            bannerStyle = `background: ${lapak.banner}`;
        }
    }

    return `
        <div class="lapak-page fade-in pb-10">
            <div class="lapak-header relative">
                <div class="lapak-banner h-48 md:h-64 bg-cover bg-center" style="width: 100%; ${bannerStyle}" ></div>
                <div class="container relative px-4" style="margin-top: -4rem; padding-bottom: 2rem;">
                    <div class="card backdrop-blur-md p-6 border text-center" style="display: flex; flex-direction: column; align-items: center; gap: 1rem; position: relative; z-index: 10; overflow: visible;">
                        <div class="lapak-detail-avatar bg-white" style="width: 8rem; height: 8rem; border-radius: 50%; border: 4px solid white; box-shadow: var(--shadow-sm); overflow: hidden; display: flex; justify-content: center; align-items: center; margin-top: -3rem; background: white;">
                            ${seller.avatar && seller.avatar.startsWith('data:image') ? `<img src="${seller.avatar}" style="width:100%; height:100%; object-fit: cover;">` : `<span style="font-size:4rem;">${seller.avatar || '🏪'}</span>`}
                        </div>
                        <div class="lapak-detail-info" style="width: 100%;">
                            <h1 class="lapak-name font-heading font-bold" style="font-size: 1.8rem; margin-bottom: 0.5rem;">${escapeHtml(lapak.name)}</h1>
                            <p class="lapak-desc text-muted" style="max-width: 600px; margin: 0 auto;">${escapeHtml(lapak.description || 'Tidak ada deskripsi')}</p>
                            
                            ${(lapak.eselon1 || lapak.bagian || lapak.gedung) ? `
                                <div class="lapak-location-details text-xs text-muted mt-2" style="background: var(--bg-tertiary); padding: 0.5rem 1rem; border-radius: var(--radius-md); display: inline-block; max-width: 500px; margin: 0.5rem auto 0 auto; border: 1px solid var(--border-glass);">
                                    <div style="font-weight: 600; color: var(--accent-primary); margin-bottom: 2px;">
                                        <i data-lucide="map-pin" style="width:12px; height:12px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>
                                        <span style="vertical-align:middle;">Lokasi Kantor Penjual</span>
                                    </div>
                                    <div class="text-[11px]">
                                        ${lapak.eselon1 ? `<span>${escapeHtml(lapak.eselon1)}</span>` : ''} 
                                        ${lapak.eselon2 ? `<span> &bull; ${escapeHtml(lapak.eselon2)}</span>` : ''} 
                                        ${lapak.bagian ? `<span> &bull; ${escapeHtml(lapak.bagian)}</span>` : ''}
                                    </div>
                                    ${(lapak.gedung || lapak.lantai) ? `
                                        <div class="text-[11px] font-semibold mt-0.5 text-secondary">
                                            ${lapak.gedung ? `<span>Gedung: ${escapeHtml(lapak.gedung)}</span>` : ''} 
                                            ${lapak.lantai ? `<span style="margin-left: 6px;">Lantai: ${escapeHtml(lapak.lantai)}</span>` : ''}
                                        </div>
                                    ` : ''}
                                </div>
                            ` : ''}

                            <div class="lapak-stats flex flex-wrap justify-center gap-6 mt-4 text-sm font-medium text-secondary">
                                <div style="display: flex; align-items: center;"><i data-lucide="box" style="width:18px;height:18px;margin-right:4px;" class="text-primary"></i> ${products.length} Produk</div>
                                <div style="display: flex; align-items: center;"><i data-lucide="clock" style="width:18px;height:18px;margin-right:4px;" class="text-primary"></i> Bergabung ${timeAgo(lapak.createdAt)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container lapak-products px-4">
                <h2 class="text-2xl font-heading font-bold mb-5 flex flex-center"><i data-lucide="grid" class="mr-2 text-primary"></i> Produk dari ${lapak.name}</h2>
                
                ${products.length > 0 ? `
                    <div class="product-grid grid grid-4 gap-4">
                        ${products.map(p => renderProductCard(p, seller)).join('')}
                    </div>
                ` : `
                    <div class="empty-state text-center py-16 card border border-dashed">
                        <i data-lucide="package" class="mx-auto text-muted mb-4" style="width: 4rem; height: 4rem;"></i>
                        <h3 class="text-xl font-bold text-secondary">Belum ada produk</h3>
                        <p class="text-muted mt-2">Lapak ini belum menambahkan produk apapun.</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

export function afterRender(params) {
    if (window.lucide) window.lucide.createIcons();
}
