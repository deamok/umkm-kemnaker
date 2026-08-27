import re

with open('app/pages/productDetail.js', 'r') as f:
    content = f.read()

bad_structure = '''                        <i data-lucide="chevron-right" class="text-gray-400"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="other-products-container" class="mt-8 mb-8" style="display: none;">
            <h3 class="text-sm md:text-base font-bold mb-3 px-2 text-gray-700">Produk Lain dari Warung Ini</h3>
            <div id="other-products-scroll" class="flex gap-4 overflow-x-auto pb-4 px-2" style="-webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory;">
                <!-- Other products will be injected here -->
            </div>
        </div>
    `;'''

good_structure = '''                        <i data-lucide="chevron-right" class="text-gray-400"></i>
                    </div>
                </div>
            </div>
            
            <div id="other-products-container" class="mt-12 pt-8 border-t border-gray-100" style="display: none;">
                <h3 class="text-sm md:text-base font-bold mb-4 text-gray-700">Produk Lain dari Warung Ini</h3>
                <div id="other-products-scroll" class="flex gap-4 overflow-x-auto pb-4" style="-webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory;">
                    <!-- Other products will be injected here -->
                </div>
            </div>
        </div>
    `;'''

content = content.replace(bad_structure, good_structure)

with open('app/pages/productDetail.js', 'w') as f:
    f.write(content)
