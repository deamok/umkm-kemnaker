import Router from './router.js';
import Store from './store.js';
import { initToastContainer } from './components/toast.js';
import { renderNavbar, initNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';

// Import all page modules
import * as HomePage from './pages/home.js';
import * as LoginPage from './pages/login.js';
import * as RegisterPage from './pages/register.js';
import * as ProductsPage from './pages/products.js';
import * as ProductDetailPage from './pages/productDetail.js';
import * as CartPage from './pages/cart.js';
import * as CheckoutPage from './pages/checkout.js';
import * as LapakPage from './pages/lapak.js';
import * as DashboardPage from './pages/dashboard.js';
import * as OrdersPage from './pages/orders.js';
import * as ProfilePage from './pages/profile.js';

// Initialize Store and Global Components
Store.init();
initToastContainer();

// Helper to create complete route renders
function createRoute(page) {
  return {
    render: async (params) => {
      const pageHtml = await page.render(params);
      const navbarHtml = await renderNavbar();
      return `
        ${navbarHtml}
        <main id="main-content">
          ${pageHtml}
        </main>
        ${renderFooter()}
      `;
    },
    afterRender: async (params) => {
      initNavbar();
      if (page.afterRender) await page.afterRender(params);
      // Ensure lucide icons are rendered
      if (window.lucide) lucide.createIcons();
    }
  };
}

// Define routes mapping
const routes = {
  '/': createRoute(HomePage),
  '/login': createRoute(LoginPage),
  '/register': createRoute(RegisterPage),
  '/products': createRoute(ProductsPage),
  '/product/:id': createRoute(ProductDetailPage),
  '/cart': createRoute(CartPage),
  '/checkout': createRoute(CheckoutPage),
  '/lapak/:id': createRoute(LapakPage),
  '/dashboard': createRoute(DashboardPage),
  '/orders': createRoute(OrdersPage),
  '/profile': createRoute(ProfilePage),
};

// Start router
Router.init(routes, 'app');
