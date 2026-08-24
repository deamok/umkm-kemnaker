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
    <a href="#/chats" class="navbar-icon-link" title="Chat">
      <i data-lucide="message-square"></i>
    </a>
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
        <a href="#/chats" class="navbar-dropdown-item">
          <i data-lucide="message-square"></i> Chat Saya
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
          <div class="flex align-center gap-2">
            <span class="navbar-top-desktop-text">Khusus Pegawai Kemnaker - Jajan Tanpa Ongkir!</span>
            <span class="navbar-top-mobile-text">Jajan Tanpa Ongkir!</span>
          </div>
          <div class="flex gap-4 align-center">
            <span class="navbar-top-link flex align-center gap-1" style="font-weight: 500;">
              <i data-lucide="phone" style="width:13px; height:13px;"></i> Hotline: 085781335527
            </span>
            <a href="#/orders" class="navbar-top-link">Lacak Pesanan</a>
            <button id="theme-toggle-btn" class="navbar-icon-link" title="Ganti Tema" style="background:none;border:none;cursor:pointer;color:white;display:flex;align-items:center;padding:0;">
              <i data-lucide="sun" id="theme-icon-sun" style="display:none;width:16px;height:16px;"></i>
              <i data-lucide="moon" id="theme-icon-moon" style="width:16px;height:16px;"></i>
            </button>
            <button id="mobile-menu-btn" class="navbar-mobile-toggle" style="color:white;background:none;border:none;cursor:pointer;padding:0;">
              <i data-lucide="menu" style="width:18px;height:18px;"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Middle Header -->
      <div class="navbar-middle-header container flex-between align-center py-4 relative" style="position: relative; gap: 1rem;">
        <!-- Logo -->
        <a href="#/" style="display:flex; align-items:center; flex-shrink: 0;">
          <img src="img/umkm.png" alt="UMKM Kemnaker" style="height: 38px; width: auto; mix-blend-mode: multiply;">
        </a>

        <!-- Desktop Search (Hidden on Mobile) -->
        <form id="nav-search-form" class="navbar-search desktop-only" style="flex:1; max-width:600px; border:2px solid var(--accent-primary); border-radius:var(--radius-md); overflow:hidden;">
          <input type="text" id="nav-search-input" placeholder="Cari jajanan or camilan..." style="flex:1; border:none; font-size: 14px; padding:0.75rem 1rem; outline:none; background:transparent; color:var(--text-primary); min-width:0;">
          <button type="submit" style="background:none; color:var(--accent-primary); border:none; padding:0 1rem; cursor:pointer; display:flex; align-items:center; justify-content:center;"><i data-lucide="search" style="width:20px; height:20px;"></i></button>
        </form>
        
        <!-- Actions -->
        <div class="navbar-actions" style="flex-shrink: 0; margin-left: auto; justify-content: flex-end; gap: 1rem; display: flex; align-items: center;">
          <!-- Mobile Search Button -->
          <button id="mobile-search-toggle" class="navbar-icon-link mobile-only" style="background:none; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center;" title="Cari">
            <i data-lucide="search"></i>
          </button>
          ${authMenu}
        </div>

        <!-- Mobile Search Pop-up (Hidden by Default) -->
        <div id="mobile-search-popup" style="display:none; position: absolute; top: 100%; left: 0; width: 100%; padding: 10px; background: var(--bg-primary); box-shadow: var(--shadow-md); z-index: 100; border-bottom: 1px solid var(--border-glass);">
          <form id="nav-search-form-popup" style="display:flex; border:2px solid var(--accent-primary); border-radius:var(--radius-md); overflow:hidden;">
            <input type="text" id="nav-search-input-popup" placeholder="Cari jajanan or camilan..." style="flex:1; border:none; font-size: 14px; padding:0.6rem 1rem; outline:none; background:transparent; color:var(--text-primary); min-width:0;">
            <button type="submit" style="background:none; color:var(--accent-primary); border:none; padding:0 1rem; cursor:pointer; display:flex; align-items:center; justify-content:center;"><i data-lucide="search" style="width:20px; height:20px;"></i></button>
          </form>
        </div>
      </div>
      
      <!-- Bottom Header -->
      <div style="background:var(--bg-primary); border-top:1px solid var(--border-glass); border-bottom:1px solid var(--border-glass);">
        <div class="container flex align-center" style="height: 50px;">
          <div class="navbar-menu" style="display:flex; gap: 2rem; font-weight:500;">
            <a href="#/" class="navbar-link ${isActive('/')}" style="color:var(--text-primary); text-transform:uppercase; font-size:14px;">Beranda</a>
            <a href="#/products" class="navbar-link ${isActive('/products')}" style="color:var(--text-primary); text-transform:uppercase; font-size:14px;">Produk</a>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div id="mobile-menu" class="navbar-mobile-menu">
        <form id="nav-search-form-mobile" class="navbar-search" style="margin-bottom:var(--space-md);">
          <i data-lucide="search" style="width:18px;height:18px;color:var(--text-muted);"></i>
          <input type="text" id="nav-search-input-mobile" class="navbar-search-input" placeholder="Cari jajanan or camilan...">
        </form>
        <a href="#/" class="navbar-mobile-link ${isActive('/')}">Beranda</a>
        <a href="#/products" class="navbar-mobile-link ${isActive('/products')}">Produk</a>
        ${user ? `
          <a href="#/dashboard" class="navbar-mobile-link">Dashboard</a>
          <a href="#/orders" class="navbar-mobile-link">Pesanan</a>
          <a href="#/chats" class="navbar-mobile-link">Chat</a>
          <a href="#/profile" class="navbar-mobile-link">Profil</a>
        ` : ''}
        <div style="border-top:1px solid var(--border-glass); padding-top:var(--space-md); margin-top:var(--space-md); font-size:var(--text-sm); color:var(--text-secondary); display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="phone" style="width:14px; height:14px; color:var(--accent-primary);"></i>
          <span>Hotline: 085781335527</span>
        </div>
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

  // Mobile search toggle
  const mobileSearchBtn = document.getElementById('mobile-search-toggle');
  const mobileSearchPopup = document.getElementById('mobile-search-popup');
  const mobileSearchInput = document.getElementById('nav-search-input-popup');

  if (mobileSearchBtn && mobileSearchPopup) {
    mobileSearchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileSearchPopup.style.display === 'none') {
        mobileSearchPopup.style.display = 'block';
        if (mobileSearchInput) mobileSearchInput.focus();
      } else {
        mobileSearchPopup.style.display = 'none';
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileSearchPopup.style.display === 'block' && !mobileSearchPopup.contains(e.target) && e.target !== mobileSearchBtn) {
        mobileSearchPopup.style.display = 'none';
      }
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
  document.getElementById('nav-search-form-popup')?.addEventListener('submit', (e) => handleSearch(e, 'nav-search-input-popup'));
  document.getElementById('nav-search-form-mobile')?.addEventListener('submit', (e) => handleSearch(e, 'nav-search-input-mobile'));
}
