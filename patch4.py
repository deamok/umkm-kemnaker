import re

with open('app/pages/productDetail.js', 'r') as f:
    content = f.read()

# Fix 1: Image property and emoji fallback
html_before = '''                        <div class="h-[110px] bg-gray-50 flex items-center justify-center p-2">
                            ${p.imageUrl ? 
                                `<img src="${p.imageUrl}" alt="${escapeHtml(p.name)}" class="w-full h-full object-contain mix-blend-multiply drop-shadow-sm">` : 
                                `<i data-lucide="image" class="w-8 h-8 text-gray-300"></i>`
                            }
                        </div>'''

html_after = '''                        <div class="h-[110px] bg-gray-50 flex items-center justify-center p-2 overflow-hidden rounded-t-lg">
                            ${p.image && p.image.startsWith('data:image') ? 
                                `<img src="${p.image}" alt="${escapeHtml(p.name)}" class="w-full h-full object-contain mix-blend-multiply drop-shadow-sm">` : 
                                `<span class="text-5xl opacity-80">${p.image || getCategoryEmoji(p.category)}</span>`
                            }
                        </div>'''
content = content.replace(html_before, html_after)


# Fix 2: Prevent horizontal scrolling of the whole page
scroll_before = '''            <div id="other-products-container" class="mt-12 pt-8 border-t border-gray-100" style="display: none;">
                <h3 class="text-sm md:text-base font-bold mb-4 text-gray-700">Produk Lain dari Warung Ini</h3>
                <div id="other-products-scroll" class="flex gap-4 overflow-x-auto pb-4" style="-webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory;">
                    <!-- Other products will be injected here -->
                </div>
            </div>'''

scroll_after = '''            <div id="other-products-container" class="mt-12 pt-8 border-t border-gray-100 w-full" style="display: none; max-width: 100%; overflow: hidden;">
                <h3 class="text-sm md:text-base font-bold mb-4 text-gray-700">Produk Lain dari Warung Ini</h3>
                <div id="other-products-scroll" class="flex gap-4 overflow-x-auto pb-4 w-full" style="-webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory; max-width: 100%;">
                    <!-- Other products will be injected here -->
                </div>
            </div>'''
content = content.replace(scroll_before, scroll_after)

with open('app/pages/productDetail.js', 'w') as f:
    f.write(content)
