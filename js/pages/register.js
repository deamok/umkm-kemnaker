import Auth from '../auth.js';
import Router from '../router.js';
import { showToast } from '../utils.js';

export function render() {
    return `
        <div class="auth-page min-h-[80vh] flex flex-center py-12 px-4 sm:px-6 lg:px-8 fade-in">
            <div class="auth-card card p-5" style="width: 100%; max-width: 28rem;">
                <div class="text-center mb-5">
                    <div class="text-5xl mb-4">🚀</div>
                    <h2 class="auth-title text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Daftar Akun Baru</h2>
                    <p class="text-muted mt-2">Mulai perjalanan UMKM Anda sekarang</p>
                </div>

                <div id="register-error" class="form-error hidden mb-4 p-3 bg-red-100 text-red-700 rounded text-sm"></div>

                <form id="register-form" class="gap-4">
                    <div class="form-group">
                        <label for="reg-name" class="form-label block text-sm font-medium text-secondary mb-1">Nama Lengkap</label>
                        <input type="text" id="reg-name" required class="form-input px-3 py-2 border rounded-md focus:ring-primary focus:border-primary" style="width: 100%;">
                    </div>
                    
                    <div class="form-group">
                        <label for="reg-email" class="form-label block text-sm font-medium text-secondary mb-1">Email</label>
                        <input type="email" id="reg-email" required class="form-input px-3 py-2 border rounded-md focus:ring-primary focus:border-primary" style="width: 100%;">
                    </div>

                    <div class="form-group">
                        <label for="reg-phone" class="form-label block text-sm font-medium text-secondary mb-1">No. Handphone</label>
                        <input type="tel" id="reg-phone" required class="form-input px-3 py-2 border rounded-md focus:ring-primary focus:border-primary" style="width: 100%;">
                    </div>

                    <div class="form-group">
                        <label for="reg-password" class="form-label block text-sm font-medium text-secondary mb-1">Password</label>
                        <input type="password" id="reg-password" required minlength="6" class="form-input px-3 py-2 border rounded-md focus:ring-primary focus:border-primary" style="width: 100%;">
                    </div>
                    
                    <div class="form-group">
                        <label for="reg-confirm" class="form-label block text-sm font-medium text-secondary mb-1">Konfirmasi Password</label>
                        <input type="password" id="reg-confirm" required class="form-input px-3 py-2 border rounded-md focus:ring-primary focus:border-primary" style="width: 100%;">
                    </div>

                    <button type="submit" class="btn btn-primary btn-block py-2 px-4 mt-6 border border-transparent rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" style="width: 100%;">
                        Daftar
                    </button>
                </form>

                <div class="auth-footer mt-6 text-center">
                    <p class="text-sm text-muted">Sudah punya akun? <a href="#/login" class="font-medium text-primary hover:text-primary-dark hover:underline">Masuk di sini</a></p>
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

    const form = document.getElementById('register-form');
    const errorDiv = document.getElementById('register-error');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const phone = document.getElementById('reg-phone').value;
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        
        if (password !== confirm) {
            errorDiv.textContent = 'Konfirmasi password tidak cocok.';
            errorDiv.classList.remove('hidden');
            return;
        }

        if (password.length < 6) {
            errorDiv.textContent = 'Password minimal 6 karakter.';
            errorDiv.classList.remove('hidden');
            return;
        }

        const result = Auth.register({ name, email, password, phone });
        
        if (result.error) {
            errorDiv.textContent = result.error;
            errorDiv.classList.remove('hidden');
        } else {
            errorDiv.classList.add('hidden');
            showToast('Registrasi berhasil!', 'success');
            Router.navigate('/');
        }
    });
}
