const Router = {
  routes: {},
  appElement: null,
  currentRoute: null,
  
  init(routes, appElementId = 'app') {
    this.routes = routes; // { pattern: { render(params), afterRender(params) } }
    this.appElement = document.getElementById(appElementId);
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  },
  
  async handleRoute() {
    let hash = window.location.hash.slice(1) || '/';
    // Remove query params from hash for matching
    const queryIndex = hash.indexOf('?');
    let queryString = '';
    if (queryIndex !== -1) {
      queryString = hash.substring(queryIndex + 1);
      hash = hash.substring(0, queryIndex);
    }
    
    let matchedRoute = null;
    let params = {};
    
    // Try exact match first
    if (this.routes[hash]) {
      matchedRoute = this.routes[hash];
    } else {
      // Try pattern matching (e.g. /product/:id)
      for (const [pattern, route] of Object.entries(this.routes)) {
        const paramNames = [];
        const regexStr = pattern.replace(/:([\w]+)/g, (_, name) => {
          paramNames.push(name);
          return '([^/]+)';
        });
        const regex = new RegExp('^' + regexStr + '$');
        const match = hash.match(regex);
        if (match) {
          matchedRoute = route;
          paramNames.forEach((name, i) => params[name] = match[i + 1]);
          break;
        }
      }
    }
    
    if (matchedRoute) {
      this.currentRoute = hash;
      // Scroll to top
      window.scrollTo(0, 0);
      
      if (this.appElement) {
        // Show loading spinner
        this.appElement.innerHTML = `
          <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;">
              <div class="text-center fade-in">
                  <div style="font-size:3rem;margin-bottom:1rem;animation:pulse 2s infinite;">🔄</div>
                  <p style="color:var(--text-secondary);">Mengambil data dari Cloud...</p>
              </div>
          </div>
        `;
        
        try {
          const html = await matchedRoute.render(params);
          this.appElement.innerHTML = html;
          // After render callback
          if (matchedRoute.afterRender) {
            const queryParams = Object.fromEntries(new URLSearchParams(queryString));
            // Allow afterRender to also be async if needed
            await matchedRoute.afterRender({...params, ...queryParams});
          }
          // Re-initialize Lucide icons
          if (window.lucide) window.lucide.createIcons();
        } catch (error) {
          console.error("Error rendering page:", error);
          this.appElement.innerHTML = `
            <div class="container mt-10 text-center">
              <h2>Terjadi Kesalahan</h2>
              <p>${error.message}</p>
              <button onclick="window.location.reload()" class="btn btn-primary mt-4">Coba Lagi</button>
            </div>
          `;
        }
      }
    } else {
      if (this.appElement) {
        this.appElement.innerHTML = '<div class="container" style="padding-top:120px;text-align:center"><h1>404</h1><p class="text-muted" style="color:#6b7280;margin-top:16px;">Halaman tidak ditemukan</p><a href="#/" style="display:inline-block;margin-top:24px;padding:10px 20px;background:#6c5ce7;color:white;text-decoration:none;border-radius:8px;">Kembali ke Beranda</a></div>';
      }
    }
  },
  
  navigate(path) {
    window.location.hash = path;
  },
  
  getParams() { 
    const queryStr = window.location.hash.split('?')[1] || '';
    return Object.fromEntries(new URLSearchParams(queryStr));
  },
  
  getCurrentRoute() { 
    return this.currentRoute; 
  }
};

export default Router;
