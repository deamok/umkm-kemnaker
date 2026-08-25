import Auth from '../auth.js';
import Store from '../store.js';
import Router from '../router.js';
import { showToast } from '../utils.js';
import { showModal } from '../components/modal.js';

export function render() {
    return `
        <div class="auth-page min-h-[80vh] flex flex-center py-12 px-4 sm:px-6 lg:px-8 fade-in">
            <div class="auth-card card p-6" style="width: 100%; max-width: 21rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-md);">
                <div class="text-center" style="margin-bottom: 25px;">
                    <h2 class="auth-title text-3xl font-extrabold text-gray-800" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                        Masuk ke <img src="img/umkm.png" alt="UMKM Kemnaker" style="height: 2.25rem; width: auto; vertical-align: middle;">
                    </h2>
                    <p class="text-muted" style="margin: 0; padding: 0; font-size: 14px;">Selamat datang kembali!</p>
                </div>

                <div id="login-error" class="form-error hidden mb-4 p-3 bg-red-100 text-red-700 rounded text-sm"></div>

                <form id="login-form" style="display: flex; flex-direction: column; gap: 1rem;">
                    <div class="form-group" style="margin: 0;">
                        <label for="email" class="form-label block text-sm font-bold text-primary" style="margin-bottom: 2px; color: var(--accent-primary);">Email</label>
                        <input type="email" id="email" required class="form-input px-3 py-2 border rounded-md focus:ring-primary focus:border-primary" style="width: 100%;" placeholder="contoh@email.com">
                    </div>

                    <div class="form-group" style="margin: 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                            <label for="password" class="form-label block text-sm font-bold text-primary" style="margin-bottom: 0; color: var(--accent-primary);">Password</label>
                            <a href="javascript:void(0)" id="btn-forgot-password" class="hover:underline font-medium" style="color: #888888; font-size: 14px;">Lupa Password?</a>
                        </div>
                        <input type="password" id="password" required class="form-input px-3 py-2 border rounded-md focus:ring-primary focus:border-primary" style="width: 100%;" placeholder="••••••••">
                    </div>

                    <button type="submit" class="btn btn-primary btn-block py-2.5 px-4 border border-transparent rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" style="width: 100%; margin-top: 0.5rem;">
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

export function afterRender(params) {
    // Check if it's a reset password link first
    const hash = window.location.hash;
    const isResetLink = hash.includes('?reset=') || (params && params.reset);

    if (Auth.isLoggedIn() && !isResetLink) {
        Router.navigate('/');
        return;
    }

    const form = document.getElementById('login-form');
    const errorDiv = document.getElementById('login-error');
    const forgotBtn = document.getElementById('btn-forgot-password');

    // Handle Reset Password Link
    if (hash.includes('?reset=')) {
        (async () => {
            const queryParams = new URLSearchParams(hash.split('?')[1]);
            const userId = queryParams.get('reset');
            const token = queryParams.get('token');
            
            if (userId && token) {
                const user = await Store.getUser(userId);
                
                if (user && user.resetToken === token) {
                    setTimeout(() => {
                        showModal({
                            title: 'Atur Ulang Kata Sandi',
                            content: `
                                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                    <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4;">Silakan masukkan kata sandi baru Anda.</p>
                                    <div class="form-group" style="margin: 0;">
                                        <label class="form-label font-bold text-sm block" style="margin-bottom: 4px; color: var(--accent-primary);">Kata Sandi Baru</label>
                                        <input type="password" id="reset-new-password" class="form-input" style="width: 100%; border: 1px solid var(--border-glass); padding: 0.75rem 1rem; border-radius: var(--radius-md);" placeholder="Minimal 6 karakter" required>
                                    </div>
                                    <div class="form-group" style="margin: 0;">
                                        <label class="form-label font-bold text-sm block" style="margin-bottom: 4px; color: var(--accent-primary);">Konfirmasi Sandi Baru</label>
                                        <input type="password" id="reset-confirm-password" class="form-input" style="width: 100%; border: 1px solid var(--border-glass); padding: 0.75rem 1rem; border-radius: var(--radius-md);" placeholder="Ketik ulang sandi baru" required>
                                    </div>
                                </div>
                            `,
                            confirmText: 'Simpan Sandi Baru',
                            cancelText: 'Batal',
                            onConfirm: async () => {
                                const newPw = document.getElementById('reset-new-password')?.value;
                                const confirmPw = document.getElementById('reset-confirm-password')?.value;
                                
                                if (!newPw || newPw.length < 6) {
                                    showToast('Kata sandi baru minimal 6 karakter', 'error');
                                    return;
                                }
                                if (newPw !== confirmPw) {
                                    showToast('Konfirmasi sandi tidak cocok. Silakan ulangi.', 'error');
                                    return;
                                }
                                
                                await Store.updateUser(userId, { password: newPw, resetToken: null });
                                showToast('Kata sandi berhasil diubah! Silakan login.', 'success');
                                window.location.hash = '#/login';
                            }
                        });
                    }, 300);
                } else {
                    showToast('Tautan atur ulang kata sandi tidak valid atau sudah digunakan.', 'error');
                    window.location.hash = '#/login';
                }
            }
        })();
    }

    // Handle Forgot Password Modal
    if (forgotBtn) {
        forgotBtn.addEventListener('click', () => {
            showModal({
                title: 'Lupa Kata Sandi?',
                content: `
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4;">Masukkan alamat email Anda di bawah ini.</p>
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label font-bold text-sm block" style="margin-bottom: 4px; color: var(--accent-primary);">Alamat Email</label>
                            <input type="email" id="forgot-email" class="form-input" style="width: 100%; border: 1px solid var(--border-glass); padding: 0.75rem 1rem; border-radius: var(--radius-md);" placeholder="contoh@email.com" required>
                        </div>
                    </div>
                `,
                confirmText: 'Kirim Tautan via Whatsapp',
                cancelText: 'Batal',
                onConfirm: async () => {
                    const email = document.getElementById('forgot-email')?.value;
                    if (!email || !email.includes('@')) {
                        showToast('Silakan masukkan alamat email yang valid.', 'error');
                        return;
                    }
                    
                    const user = await Store.getUserByEmail(email);
                    if (!user) {
                        showModal({
                            title: 'Peringatan',
                            content: '<p class="text-center py-2">Alamat email belun terdaftar.</p>',
                            confirmText: 'OK',
                            cancelText: '',
                            onConfirm: () => {}
                        });
                        return;
                    }

                    const phone = user.phone || '';
                    if (!phone || phone.length < 4) {
                        showToast('Nomor HP tidak valid di database.', 'error');
                        return;
                    }

                    const last2 = phone.slice(-2);
                    const maskedPhone = 'x'.repeat(phone.length - 2) + last2;

                    showModal({
                        title: 'Verifikasi Nomor HP',
                        content: `
                            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4;">Nomor HP terdaftar: <strong>${maskedPhone}</strong></p>
                                <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4;">Silakan masukkan 4 digit terakhir nomor HP Anda untuk verifikasi.</p>
                                <div class="form-group" style="margin: 0;">
                                    <input type="text" id="verify-phone-digits" class="form-input text-center" style="width: 100%; letter-spacing: 4px; font-size: 1.2rem; border: 1px solid var(--border-glass); padding: 0.75rem 1rem; border-radius: var(--radius-md);" placeholder="XXXX" maxlength="4" required>
                                </div>
                            </div>
                        `,
                        confirmText: 'Verifikasi',
                        cancelText: 'Batal',
                        onConfirm: async () => {
                            const inputDigits = document.getElementById('verify-phone-digits')?.value;
                            const actualLast4 = phone.slice(-4);

                            if (inputDigits === actualLast4) {
                                showToast(`Tautan atur ulang kata sandi telah dikirim ke: ${phone}`, 'success');
                                
                                try {
                                    let waPhone = phone.replace(/\D/g, '');
                                    if (waPhone.startsWith('0')) waPhone = '62' + waPhone.substring(1);
                                    if (!waPhone.startsWith('62')) waPhone = '62' + waPhone;
                                    
                                    const resetToken = Math.random().toString(36).substring(2, 15);
                                    await Store.updateUser(user.id, { resetToken: resetToken });
                                    
                                    const resetLink = `https://yuuk-jajan.cilebut-one.cloud/#/login?reset=${user.id}&token=${resetToken}`;
                                    const text = `Halo Kak *${user.name}*,\n\nSilakan klik tautan berikut untuk mengubah kata sandi akun e-lapak Anda:\n\n${resetLink}\n\nAbaikan pesan ini jika Anda tidak merasa meminta reset kata sandi.`;
                                    
                                    const res = await fetch(`/wa-api/message/sendText/umkm_vercel-app`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'apikey': 'cqpj5ch0avno6u7w0z67b'
                                        },
                                        body: JSON.stringify({ number: waPhone, textMessage: { text: text } })
                                    });
                                    const resData = await res.json().catch(() => ({}));
                                    console.log('Evolution API Response (Forgot Password):', res.status, JSON.stringify(resData));
                                } catch(err) {
                                    console.error('Gagal kirim WA forgot password:', err);
                                }
                            } else {
                                showModal({
                                    title: 'Peringatan',
                                    content: '<p class="text-center py-2 text-danger font-semibold">Nomer HP tidak sesuai.</p>',
                                    confirmText: 'OK',
                                    cancelText: '',
                                    onConfirm: () => {}
                                });
                            }
                        }
                    });
                }
            });
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (!email || !password) {
            errorDiv.textContent = 'Harap isi semua kolom.';
            errorDiv.classList.remove('hidden');
            return;
        }

        const result = await Auth.login(email, password);
        
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
