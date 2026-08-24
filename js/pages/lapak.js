import Store from '../store.js';
import { timeAgo } from '../utils.js';
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

    const bannerStyle = lapak.banner ? `background: ${lapak.banner}` : `background: linear-gradient(135deg, var(--color-primary), var(--color-accent))`;

    return `
        <div class="lapak-page fade-in pb-10">
            <div class="lapak-header relative">
                <div class="lapak-banner h-48 md:h-64 bg-cover bg-center" style="width: 100%; ${bannerStyle}" ></div>
                <div class="container relative -mt-16 mb-5 px-4">
                    <div class="flex flex-col flex-row flex-center md:items-end flex-wrap gap-4 card backdrop-blur-md p-5 border text-center md:text-left">
                        <div class="lapak-avatar flex-center text-6xl border-4 border-white flex-shrink-0 mx-auto md:mx-0 overflow-hidden flex justify-center flex-center bg-white" style="width: 8rem; height: 8rem; border-radius: var(--radius-full);">
                            ${seller.avatar && seller.avatar.startsWith('data:image') ? `<img src="${seller.avatar}" class="object-cover w-full h-full" style="width:100%;height:100%;">` : seller.avatar || '🏪'}
                        </div>
                        <div class="lapak-info flex-grow">
                            <h1 class="lapak-name text-3xl font-heading font-bold">${lapak.name}</h1>
                            <p class="lapak-desc text-muted text-md mt-2" style="max-width: 48rem;">${lapak.description || 'Tidak ada deskripsi'}</p>
                            <div class="lapak-stats flex flex-wrap justify-center md:justify-start gap-6 mt-4 text-sm font-medium text-secondary">
                                <div class="flex flex-center"><i data-lucide="box" class="w-5 h-5 mr-2 text-primary"></i> ${products.length} Produk</div>
                                <div class="flex flex-center"><i data-lucide="clock" class="w-5 h-5 mr-2 text-primary"></i> Bergabung ${timeAgo(lapak.createdAt)}</div>
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
