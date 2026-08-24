export function renderFooter() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          
          <div>
            <a href="#/" class="navbar-brand" style="display:inline-block;margin-bottom:var(--space-md);">
              <img src="img/logo.png" alt="yukk jajan..!" style="height: 60px; width: auto; mix-blend-mode: multiply;">
            </a>
            <p class="text-secondary" style="line-height:1.7;margin-bottom:var(--space-lg);">Wadah khusus bagi pegawai Kemnaker dan keluarga untuk berjualan hasil olahan sendiri. Dari pegawai, oleh pegawai, untuk pegawai.</p>
          </div>

          <div>
            <h3 class="footer-title">Navigasi</h3>
            <a href="#/" class="footer-link">Beranda</a>
            <a href="#/products" class="footer-link">Semua Jajanan</a>
            <a href="#/register" class="footer-link">Daftar Akun</a>
            <a href="#/login" class="footer-link">Masuk</a>
          </div>

          <div>
            <h3 class="footer-title">Kategori Populer</h3>
            <a href="#/products?category=makanan" class="footer-link">🍜 Makanan Berat</a>
            <a href="#/products?category=minuman" class="footer-link">🥤 Minuman Segar</a>
            <a href="#/products?category=camilan" class="footer-link">🍪 Camilan / Kue</a>
            <a href="#/products?category=kesehatan" class="footer-link">🌿 Jamu / Kesehatan</a>
          </div>

          <div>
            <h3 class="footer-title">Lokasi COD</h3>
            <div class="footer-link flex align-center gap-2">
              <i data-lucide="building" style="width:16px;height:16px;"></i>
              <span>Gedung A & B Kemnaker</span>
            </div>
            <div class="footer-link flex align-center gap-2">
              <i data-lucide="map-pin" style="width:16px;height:16px;"></i>
              <span>Jl. Gatot Subroto Kav. 51, Jakarta Selatan</span>
            </div>
          </div>

        </div>
        <div class="footer-bottom">
          deamok &copy; ${new Date().getFullYear()} yukk jajan..!! All rights reserved.
        </div>
      </div>
    </footer>
  `;
}
