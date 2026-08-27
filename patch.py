import re

with open('app/pages/productDetail.js', 'r') as f:
    content = f.read()

# 1. Add - and + buttons
html_before = '''<div class="flex items-center justify-center border border-gray-300 rounded-md overflow-hidden bg-gray-100 h-10 w-12 relative cursor-ns-resize select-none" id="qty-scroll-area" title="Gulir atau geser atas/bawah untuk mengubah">
                            <input type="number" id="input-qty" value="${product.minOrder || 1}" min="${product.minOrder || 1}" ${product.status === 'po' ? '' : `max="${product.stock}"`} class="w-full h-full text-center outline-none font-bold text-gray-800 text-[12pt] bg-transparent pointer-events-none" style="appearance: none; -moz-appearance: textfield; margin: 0;" readonly>
                        </div>'''

html_after = '''<div class="flex items-center justify-center border border-gray-300 rounded-md overflow-hidden h-10 bg-white" style="width: fit-content;">
                            <button id="btn-qty-minus" class="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors border-r border-gray-200 select-none">
                                <i data-lucide="minus" class="w-4 h-4"></i>
                            </button>
                            <div class="flex items-center justify-center relative cursor-ns-resize select-none h-full bg-gray-50" id="qty-scroll-area" title="Gulir atau geser atas/bawah untuk mengubah" style="width: 3.5rem;">
                                <input type="number" id="input-qty" value="${product.minOrder || 1}" min="${product.minOrder || 1}" ${product.status === 'po' ? '' : `max="${product.stock}"`} class="w-full h-full text-center outline-none font-bold text-gray-800 text-[12pt] bg-transparent pointer-events-none" style="appearance: none; -moz-appearance: textfield; margin: 0;" readonly>
                            </div>
                            <button id="btn-qty-plus" class="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors border-l border-gray-200 select-none">
                                <i data-lucide="plus" class="w-4 h-4"></i>
                            </button>
                        </div>'''
content = content.replace(html_before, html_after)

# 2. Add other products container
container_before = '''                </div>
            </div>
        </div>
    `;'''
container_after = '''                </div>
            </div>
        </div>
        
        <div id="other-products-container" class="mt-8 mb-8" style="display: none;">
            <h3 class="text-sm md:text-base font-bold mb-3 px-2 text-gray-700">Produk Lain dari Warung Ini</h3>
            <div id="other-products-scroll" class="flex gap-4 overflow-x-auto pb-4 px-2" style="-webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory;">
                <!-- Other products will be injected here -->
            </div>
        </div>
    `;'''
content = content.replace(container_before, container_after)


# 3. Add event listeners
listeners_before = '''    const handleAddToCart = (redirect = false) => {'''
listeners_after = '''    if (btnMinus) {
        btnMinus.addEventListener('click', () => {
            if (qty > minQty) {
                qty--;
                updateQtyDisplay();
            }
        });
    }

    if (btnPlus) {
        btnPlus.addEventListener('click', () => {
            if (isPreOrder || qty < product.stock) {
                qty++;
                updateQtyDisplay();
            }
        });
    }

    const handleAddToCart = (redirect = false) => {'''
content = content.replace(listeners_before, listeners_after)

# 4. Add fetch products loop
fetch_before = '''    document.querySelectorAll('.seller-link').forEach(el => {
        el.addEventListener('click', () => {
            Router.navigate('/lapak/' + el.dataset.sellerid);
        });
    });
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
