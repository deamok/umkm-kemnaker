import re

with open('app/pages/productDetail.js', 'r') as f:
    content = f.read()

fetch_before = '''    document.querySelectorAll('.seller-link').forEach(el => {
        el.addEventListener('click', () => {
            Router.navigate('/lapak/' + el.dataset.sellerid);
        });
    });

    updateQtyDisplay();
}'''
fetch_after = '''    document.querySelectorAll('.seller-link').forEach(el => {
        el.addEventListener('click', () => {
            Router.navigate('/lapak/' + el.dataset.sellerid);
        });
    });

    // Load other products
    const otherProductsContainer = document.getElementById('other-products-container');
    const otherProductsScroll = document.getElementById('other-products-scroll');
    
    if (otherProductsContainer && otherProductsScroll) {
        Store.getProductsBySeller(product.sellerId).then(sellerProducts => {
            // Filter out the current product
            const otherProducts = sellerProducts.filter(p => p.id !== productId);
            
            if (otherProducts.length > 0) {
                otherProductsContainer.style.display = 'block';
                
                // Render products
                const html = otherProducts.map(p => `
                    <div class="flex-none w-[130px] md:w-[150px] bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onclick="window.location.hash = '/product/${p.id}'" style="scroll-snap-align: start;">
                        <div class="h-[110px] bg-gray-50 flex items-center justify-center p-2">
                            ${p.imageUrl ? 
                                `<img src="${p.imageUrl}" alt="${escapeHtml(p.name)}" class="w-full h-full object-contain mix-blend-multiply drop-shadow-sm">` : 
                                `<i data-lucide="image" class="w-8 h-8 text-gray-300"></i>`
                            }
                        </div>
                        <div class="p-2 md:p-3 border-t border-gray-50">
                            <h4 class="font-semibold text-gray-800 text-[11px] md:text-xs truncate mb-1" title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</h4>
                            <p class="text-primary font-bold text-xs">${formatRupiah(p.price)}</p>
                        </div>
                    </div>
                `).join('');
                
                otherProductsScroll.innerHTML = html;
                
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }
        });
    }

    updateQtyDisplay();
}'''
content = content.replace(fetch_before, fetch_after)

with open('app/pages/productDetail.js', 'w') as f:
    f.write(content)
