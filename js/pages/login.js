import Auth from '../auth.js';
import Router from '../router.js';
import { showToast } from '../utils.js';

export function render() {
    return `
        <div class="auth-page min-h-[80vh] flex flex-center py-12 px-4 sm:px-6 lg:px-8 fade-in">
            <div class="auth-card card p-5" style="width: 100%; max-width: 28rem;">
                <div class="text-center mb-5">
                    <div class="text-5xl mb-4">🛍️</div>
                    <h2 class="auth-title text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Masuk ke e-Lapak</h2>
                    <p class="text-muted mt-2">Selamat datang kembali!</p>
                </div>

                <div id="login-error" class="form-error hidden mb-4 p-3 bg-red-100 text-red-700 rounded text-sm"></div>

                <form id="login-form" class="gap-4">
                    <div class="form-group">
                        <label for="email" class="form-label block text-sm font-medium text-secondary mb-1">Email</label>
                        <input type="email" id="email" required class="form-input px-3 py-2 border rounded-md focus:ring-primary focus:border-primary" style="width: 100%;" placeholder="contoh@email.com">
                    </div>

                    <div class="form-group">
                        <label for="password" class="form-label block text-sm font-medium text-secondary mb-1">Password</label>
                        <input type="password" id="password" required class="form-input px-3 py-2 border rounded-md focus:ring-primary focus:border-primary" style="width: 100%;" placeholder="••••••••">
                    </div>

                    <button type="submit" class="btn btn-primary btn-block py-2 px-4 border border-transparent rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" style="width: 100%;">
                        Masuk
                    </button>
                </form>

                <div class="auth-footer mt-6 text-center">
                    <p class="text-sm text-muted">Belum punya akun? <a href="#/register" class="font-medium text-primary hover:text-primary-dark hover:underline">Daftar di sini</a></p>
                </div>
            </div>
        </div>
    `;
}

export function afterRender() {
    if (Auth.isLoggedIn()) {
        Router.navigate('/');
        return;
    }

    const form = document.getElementById('login-form');
    const errorDiv = document.getElementById('login-error');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (!email || !password) {
            errorDiv.textContent = 'Harap isi semua kolom.';
            errorDiv.classList.remove('hidden');
            return;
        }

        const result = Auth.login(email, password);
        
        if (result.error) {
            errorDiv.textContent = result.error;
            errorDiv.classList.remove('hidden');
        } else {
            errorDiv.classList.add('hidden');
            showToast('Login berhasil!', 'success');
            Router.navigate('/');
        }
    });
}
