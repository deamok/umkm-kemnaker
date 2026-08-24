import Auth from '../auth.js';
import Store from '../store.js';

export async function renderNavbar() {
  const user = await Auth.getCurrentUser();
  const cartCount = user ? Store.getCartCount() : 0;
  const currentHash = window.location.hash.slice(1) || '/';

  const isActive = (path) => {
    if (path === '/') return currentHash === '/' ? 'active' : '';
    return currentHash.startsWith(path) ? 'active' : '';
  };

  const authMenu = user ? `
    <a href="#/cart" class="navbar-icon-link" title="Keranjang">
      <i data-lucide="shopping-cart"></i>
      ${cartCount > 0 ? `<span class="navbar-cart-badge">${cartCount}</span>` : ''}
    </a>
    <div class="navbar-user-container">
      <button class="navbar-avatar-btn flex flex-center gap-2" id="user-menu-btn" style="background: none; border: none; cursor: pointer;">
        <span class="navbar-avatar overflow-hidden flex flex-center justify-center bg-white" style="width: 32px; height: 32px; border-radius: 50%;">
          ${user.avatar && user.avatar.startsWith('data:image') ? `<img src="${user.avatar}" class="object-cover w-full h-full" style="width:100%;height:100%;">` : user.avatar || '👤'}
        </span>
        <span class="navbar-username font-semibold">${user.name.split(' ')[0]}</span>
        <i data-lucide="chevron-down" style="width:14px;height:14px;opacity:0.5;"></i>
      </button>
      <div class="navbar-dropdown" id="user-dropdown">
        <a href="#/profile" class="navbar-dropdown-item">
          <i data-lucide="user"></i> Profil Saya
        </a>
        <a href="#/dashboard" class="navbar-dropdown-item">
          <i data-lucide="layout-dashboard"></i> Dashboard
        </a>
        <a href="#/orders" class="navbar-dropdown-item">
          <i data-lucide="package"></i> Pesanan Saya
        </a>
        <div class="navbar-dropdown-divider"></div>
        <button class="navbar-dropdown-item navbar-logout" id="logout-btn">
          <i data-lucide="log-out"></i> Keluar
        </button>
      </div>
    </div>
  ` : `
    <a href="#/login" class="btn btn-outline btn-sm">Masuk</a>
    <a href="#/register" class="btn btn-primary btn-sm">Daftar</a>
  `;

  return `
    <nav class="navbar" style="position:static; padding:0; background:var(--bg-secondary);">
      <!-- Top Bar -->
      <div style="background:var(--accent-primary); color:white; padding: 0.5rem 0; font-size:13px;">
        <div class="container flex-between align-center">
          <div>Khusus Pegawai Kemnaker - Jajan Tanpa Ongkir!</div>
          <div class="flex gap-4">
            <a href="#/orders">Lacak Pesanan</a>
            <a href="#/lapak">Buka Lapak</a>
          </div>
        </div>
      </div>
      
      <!-- Middle Header -->
      <div class="container flex-between align-center py-4" style="height: 90px; padding: 1rem var(--space-md);">
        <!-- Logo -->
        <a href="#/" class="navbar-brand" style="flex: 1; display:flex; align-items:center;">
          <img src="img/logo.png" alt="yukk jajan..!" style="height: 50px; width: auto; mix-blend-mode: multiply;">
        </a>
        
        <!-- Search -->
        <form id="nav-search-form" class="navbar-search" style="flex: 2; display:flex; max-width:600px; border:2px solid var(--accent-primary); border-radius:var(--radius-md); overflow:hidden;">
          <input type="text" id="nav-search-input" placeholder="Cari camilan, kopi, kue..." style="flex:1; border:none; padding:0.75rem 1rem; outline:none;">
          <button type="submit" style="background:var(--accent-primary); color:white; border:none; padding:0 1.5rem; cursor:pointer;"><i data-lucide="search"></i></button>
        </form>
        
        <!-- Actions -->
        <div class="navbar-actions" style="flex: 1; justify-content: flex-end; gap: 1.5rem;">
          <button id="theme-toggle-btn" class="navbar-icon-link" title="Ganti Tema" style="background:none;border:none;cursor:pointer;color:var(--text-primary);">
            <i data-lucide="sun" id="theme-icon-sun" style="display:none;"></i>
            <i data-lucide="moon" id="theme-icon-moon"></i>
          </button>
          ${authMenu}
          <button id="mobile-menu-btn" class="navbar-mobile-toggle" style="color:var(--text-primary);">
            <i data-lucide="menu"></i>
          </button>
        </div>
      </div>
      
      <!-- Bottom Header -->
      <div style="background:var(--bg-primary); border-top:1px solid var(--border-glass); border-bottom:1px solid var(--border-glass);">
        <div class="container flex align-center" style="height: 50px;">
          <div class="navbar-menu" style="display:flex; gap: 2rem; font-weight:500;">
            <a href="#/" class="navbar-link ${isActive('/')}" style="color:var(--text-primary); text-transform:uppercase; font-size:14px;">Beranda</a>
            <a href="#/products" class="navbar-link ${isActive('/products')}" style="color:var(--text-primary); text-transform:uppercase; font-size:14px;">Produk</a>
            <a href="#/lapak" class="navbar-link" style="color:var(--text-primary); text-transform:uppercase; font-size:14px;">Lapak UMKM</a>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div id="mobile-menu" class="navbar-mobile-menu">
        <form id="nav-search-form-mobile" class="navbar-search" style="margin-bottom:var(--space-md);">
          <i data-lucide="search" style="width:18px;height:18px;color:var(--text-muted);"></i>
          <input type="text" id="nav-search-input-mobile" class="navbar-search-input" placeholder="Cari produk...">
        </form>
        <a href="#/" class="navbar-mobile-link ${isActive('/')}">Beranda</a>
        <a href="#/products" class="navbar-mobile-link ${isActive('/products')}">Produk</a>
        ${user ? `
          <a href="#/dashboard" class="navbar-mobile-link">Dashboard</a>
          <a href="#/orders" class="navbar-mobile-link">Pesanan</a>
          <a href="#/profile" class="navbar-mobile-link">Profil</a>
        ` : ''}
      </div>
    </nav>
  `;
}

export function initNavbar() {
  const menuBtn = document.getElementById('user-menu-btn');
  const dropdown = document.getElementById('user-dropdown');
  const logoutBtn = document.getElementById('logout-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const iconSun = document.getElementById('theme-icon-sun');
  const iconMoon = document.getElementById('theme-icon-moon');

  // Theme toggle logic
  if (themeToggleBtn) {
    const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('elapak_theme', theme);
      if (theme === 'light') {
        if (iconSun) iconSun.style.display = 'block';
        if (iconMoon) iconMoon.style.display = 'none';
      } else {
        if (iconSun) iconSun.style.display = 'none';
        if (iconMoon) iconMoon.style.display = 'block';
      }
    };

    // Set initial icon state based on current theme
    const currentTheme = localStorage.getItem('elapak_theme') || 'light';
    applyTheme(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
    });
  }

  if (menuBtn && dropdown) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });
    document.addEventListener('click', () => {
      dropdown.classList.remove('show');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      Auth.logout();
      window.location.hash = '#/';
      window.location.reload();
    });
  }

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('show');
      mobileMenuBtn.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
      if (window.lucide) lucide.createIcons();
    });

    document.querySelectorAll('.navbar-mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('show');
        mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
        if (window.lucide) lucide.createIcons();
      });
    });
  }

  const handleSearch = (e, inputId) => {
    e.preventDefault();
    const query = document.getElementById(inputId)?.value.trim();
    if (query) {
      window.location.hash = `#/products?q=${encodeURIComponent(query)}`;
    }
  };

  document.getElementById('nav-search-form')?.addEventListener('submit', (e) => handleSearch(e, 'nav-search-input'));
  document.getElementById('nav-search-form-mobile')?.addEventListener('submit', (e) => handleSearch(e, 'nav-search-input-mobile'));
}
