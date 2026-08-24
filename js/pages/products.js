import Store from '../store.js';
import { renderProductCard } from '../components/productCard.js';
import { debounce } from '../utils.js';

export async function render(params) {
    // Initial parse of URL for search/category
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const initialQuery = urlParams.get('q') || '';
    const initialCategory = urlParams.get('category') || 'all';

    return `
        <div class="page-products container py-8 fade-in">
            <div class="flex flex-col flex-row flex-between flex-center mb-5 gap-4">
                <h1 class="text-3xl font-bold">Katalog Produk</h1>
                <div class="search-bar md:w-96 relative" style="width: 100%;">
                    <i data-lucide="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5"></i>
                    <input type="text" id="product-search" class="search-input pl-10 pr-4 py-2 border focus:ring-2 focus:ring-primary focus:outline-none" style="width: 100%; border-radius: var(--radius-full);" placeholder="Cari produk..." value="${initialQuery}">
                </div>
            </div>

            <div class="flex flex-col flex-row flex-between flex-center mb-5 gap-4">
                <div class="filter-bar flex flex-wrap gap-2" id="category-filters">
                    ${['all', 'makanan', 'minuman', 'kerajinan', 'lainnya'].map(cat => `
                        <button class="filter-chip px-4 py-1 border text-sm transition-colors ${initialCategory === cat ? 'bg-primary text-white border-primary active' : 'card text-secondary hover:bg-gray-100'}" style="border-radius: var(--radius-full);" data-category="${cat}">
                            ${cat === 'all' ? 'Semua' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    `).join('')}
                </div>
                <div class="sort-dropdown">
                    <select id="product-sort" class="form-select border rounded-md px-3 py-1.5 text-sm focus:ring-primary focus:border-primary">
                        <option value="newest">Terbaru</option>
                        <option value="price-asc">Harga Terendah</option>
                        <option value="price-desc">Harga Tertinggi</option>
                        <option value="name-asc">Nama A-Z</option>
                    </select>
                </div>
            </div>

            <div id="product-grid-container" class="" style="min-height: 400px;">
                <!-- Grid will be rendered here via JS -->
            </div>
        </div>
    `;
}

export async function afterRender(params) {
    if (window.lucide) {
        window.lucide.createIcons();
    }

    const searchInput = document.getElementById('product-search');
    const filterChips = document.querySelectorAll('.filter-chip');
    const sortSelect = document.getElementById('product-sort');
    const gridContainer = document.getElementById('product-grid-container');

    // Parse initial state from DOM
    let currentQuery = searchInput.value.toLowerCase();
    let currentCategory = document.querySelector('.filter-chip.active')?.dataset.category || 'all';
    let currentSort = sortSelect.value;

    const updateGrid = async () => {
        let products = [];
        
        // Filtering
        if (currentQuery) {
            products = await Store.searchProducts(currentQuery);
            if (currentCategory !== 'all') {
                products = products.filter(p => p.category === currentCategory);
            }
        } else if (currentCategory !== 'all') {
            products = await Store.getProductsByCategory(currentCategory);
        } else {
            products = await Store.getProducts();
        }

        // Sorting
        products.sort((a, b) => {
            if (currentSort === 'newest') {
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            }
            if (currentSort === 'price-asc') return a.price - b.price;
            if (currentSort === 'price-desc') return b.price - a.price;
            if (currentSort === 'name-asc') return a.name.localeCompare(b.name);
            return 0;
        });

        // Rendering
        if (products.length === 0) {
            gridContainer.innerHTML = `
                <div class="empty-state py-20 text-center text-muted">
                    <div class="text-6xl mb-4">🔍</div>
                    <h3 class="text-xl font-medium mb-2">Produk tidak ditemukan</h3>
                    <p>Coba gunakan kata kunci lain atau ubah filter kategori.</p>
                </div>
            `;
        } else {
            let cardsHtml = '';
            for (const p of products) {
                const seller = await Store.getUser(p.sellerId);
                cardsHtml += renderProductCard(p, seller);
            }
            gridContainer.innerHTML = `
                <div class="product-grid grid grid-4 fade-in">
                    ${cardsHtml}
                </div>
            `;
        }

        // Re-init lucide icons in the newly rendered HTML
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 0);
        }
    };

    // Event Listeners
    const handleSearch = debounce((e) => {
        currentQuery = e.target.value.toLowerCase();
        updateGrid();
    }, 300);

    searchInput.addEventListener('input', handleSearch);

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Update active state visually
            filterChips.forEach(c => {
                c.classList.remove('bg-primary', 'text-white', 'border-primary', 'active');
                c.classList.add('card', 'text-secondary');
            });
            chip.classList.remove('card', 'text-secondary');
            chip.classList.add('bg-primary', 'text-white', 'border-primary', 'active');
            
            currentCategory = chip.dataset.category;
            updateGrid();
        });
    });

    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        updateGrid();
    });

    // Initial render
    updateGrid();
}
