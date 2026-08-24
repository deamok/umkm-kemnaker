import Store from '../store.js';
import Auth from '../auth.js';
import Router from '../router.js';
import { showToast, timeAgo } from '../utils.js';

export async function render(params) {
    if (!Auth.isLoggedIn()) {
        setTimeout(() => Router.navigate('/login'), 0);
        return `<div class="container text-center mt-5"><p>Mengarahkan ke halaman login...</p></div>`;
    }

    const user = await Auth.getCurrentUser();
    const lapak = await Store.getLapak(user.id);

    return `
        <div class="profile-page container mt-6 mb-10 fade-in mx-auto" style="max-width: 56rem;">
            <h1 class="text-2xl font-heading font-bold mb-5 px-2">Profil Saya</h1>
            
            <div class="grid grid-3 gap-6">
                <!-- Sidebar -->
                <div class="md:col-span-1 gap-4">
                    <div class="card border card overflow-hidden">
                        <div class="bg-gradient-to-br from-primary to-accent" style="height: 6rem;"></div>
                        <div class="card-body p-5 text-center -mt-12 relative">
                            <div class="profile-avatar-large mx-auto flex-center text-5xl border-4 border-white mb-3 overflow-hidden bg-white flex items-center justify-center" style="width: 6rem; height: 6rem; border-radius: var(--radius-full);">
                                ${user.avatar && user.avatar.startsWith('data:image') 
                                    ? `<img src="${user.avatar}" class="object-cover" style="width: 100%; height: 100%;">` 
                                    : user.avatar || '👤'}
                            </div>
                            <h2 class="profile-name text-xl font-bold font-heading">${user.name}</h2>
                            <p class="text-muted text-sm mb-4">${user.email}</p>
                            <div class="badge text-secondary px-3 py-1 text-xs font-semibold mx-auto inline-block" style="border-radius: var(--radius-full);">
                                Bergabung ${timeAgo(user.createdAt || Date.now())}
                            </div>
                        </div>
                    </div>

                    <div class="card border card p-4">
                        <h3 class="font-bold mb-3 flex flex-center"><i data-lucide="store" class="w-4 h-4 mr-2 text-primary"></i> Lapak Saya</h3>
                        ${lapak ? `
                            <div class="p-3 card border mb-3">
                                <div class="font-semibold">${lapak.name}</div>
                                <div class="text-xs text-muted truncate mt-1">${lapak.description}</div>
                            </div>
                            <a href="#/dashboard" class="btn btn-outline btn-block border-primary text-primary hover:bg-primary hover:text-white transition-colors">Kelola Lapak</a>
                        ` : `
                            <div class="text-center py-4 text-sm text-muted">Anda belum memiliki lapak.</div>
                            <a href="#/dashboard" class="btn btn-primary btn-block">Buka Lapak Sekarang</a>
                        `}
                    </div>

                    <div class="card border card p-4">
                        <h3 class="font-bold mb-3 flex flex-center"><i data-lucide="settings" class="w-4 h-4 mr-2 text-muted"></i> Akun</h3>
                        <button id="btn-logout" class="btn btn-danger btn-block bg-glass text-danger border-red-200 hover:bg-red-600 hover:text-white transition-colors">
                            <i data-lucide="log-out" class="w-4 h-4 mr-2 inline"></i> Keluar
                        </button>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="md:col-span-2">
                    <div class="card border card">
                        <div class="card-body p-5 md:p-8">
                            <h2 class="text-xl font-heading font-bold mb-5 pb-4 border-b flex flex-center">
                                <i data-lucide="user" class="mr-2 text-primary"></i> Edit Profil
                            </h2>
                            
                            <form id="profile-form" class="space-y-5">
                                <div class="grid grid-2 gap-5">
                                    <div class="form-group">
                                        <label class="form-label font-semibold text-sm text-secondary">Nama Lengkap</label>
                                        <input type="text" id="profile-name" class="form-input p-2.5 border card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" style="width: 100%;" value="${user.name}" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label font-semibold text-sm text-secondary">Email (Readonly)</label>
                                        <input type="email" class="form-input p-2.5 border card text-muted cursor-not-allowed" style="width: 100%;" value="${user.email}" readonly>
                                    </div>
                                </div>

                                <div class="grid grid-2 gap-5">
                                    <div class="form-group">
                                        <label class="form-label font-semibold text-sm text-secondary">No. Handphone</label>
                                        <input type="tel" id="profile-phone" class="form-input p-2.5 border card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" style="width: 100%;" value="${user.phone || ''}">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label font-semibold text-sm text-secondary">Foto Profil</label>
                                        <input type="file" id="profile-avatar-file" accept="image/*" class="form-input p-1 border card focus:border-primary transition-all" style="width: 100%;">
                                        <input type="hidden" id="profile-avatar-base64">
                                        <small class="text-muted">Kosongkan jika tak ingin mengubah foto</small>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label font-semibold text-sm text-secondary">Nama Warung / Lapak</label>
                                    <input type="text" id="profile-warung" class="form-input p-2.5 border card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" style="width: 100%;" placeholder="Contoh: Kopi Kekinian Bu Sari" value="${user.warungName || lapak?.name || ''}">
                                </div>

                                <div class="form-group">
                                    <label class="form-label font-semibold text-sm text-secondary">Alamat Lengkap</label>
                                    <textarea id="profile-address" class="form-textarea p-3 border card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" style="width: 100%;" rows="2" placeholder="Masukkan alamat lengkap pengiriman...">${user.address || ''}</textarea>
                                </div>

                                <div class="grid grid-2 gap-5 mt-4 border-t pt-4">
                                    <div class="form-group">
                                        <label class="form-label font-semibold text-sm text-secondary">Unit Eselon I</label>
                                        <select id="profile-eselon1" class="form-select p-2.5 border card focus:border-primary transition-all" style="width: 100%;">
                                            <option value="">-- Pilih Unit Eselon I --</option>
                                            <option value="Sekretariat Jenderal" ${user.eselon1 === 'Sekretariat Jenderal' ? 'selected' : ''}>Sekretariat Jenderal</option>
                                            <option value="Binalavotas" ${user.eselon1 === 'Binalavotas' ? 'selected' : ''}>Binalavotas</option>
                                            <option value="Binapenta" ${user.eselon1 === 'Binapenta' ? 'selected' : ''}>Binapenta</option>
                                            <option value="Barenbang" ${user.eselon1 === 'Barenbang' ? 'selected' : ''}>Barenbang</option>
                                            <option value="Pengawasan & K3" ${user.eselon1 === 'Pengawasan & K3' ? 'selected' : ''}>Pengawasan & K3</option>
                                            <option value="Inspektorat Jendral" ${user.eselon1 === 'Inspektorat Jendral' ? 'selected' : ''}>Inspektorat Jendral</option>
                                            <option value="PHI Jamsos" ${user.eselon1 === 'PHI Jamsos' ? 'selected' : ''}>PHI Jamsos</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label font-semibold text-sm text-secondary">Unit Eselon II</label>
                                        <input type="text" id="profile-eselon2" class="form-input p-2.5 border card focus:border-primary transition-all" style="width: 100%;" placeholder="Contoh: Pusdatin" value="${user.eselon2 || ''}">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label font-semibold text-sm text-secondary">Bagian / Divisi</label>
                                    <input type="text" id="profile-bagian" class="form-input p-2.5 border card focus:border-primary transition-all" style="width: 100%;" placeholder="Contoh: Bagian Umum" value="${user.bagian || ''}">
                                </div>

                                <div class="pt-4 flex justify-end">
                                    <button type="submit" class="btn btn-primary px-8 py-2.5 hover:shadow-lg transition-all font-semibold">
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function afterRender(params) {
    if (window.lucide) window.lucide.createIcons();
    
    const user = Auth.getCurrentUser();
    const fileInput = document.getElementById('profile-avatar-file');
    const base64Input = document.getElementById('profile-avatar-base64');
    
    fileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                base64Input.value = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('profile-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let newAvatar = base64Input?.value;
        if (!newAvatar && user.avatar) {
            newAvatar = user.avatar; // Keep old avatar if no new file is uploaded
        }

        const updates = {
            name: document.getElementById('profile-name').value.trim(),
            phone: document.getElementById('profile-phone').value.trim(),
            avatar: newAvatar || '👤',
            warungName: document.getElementById('profile-warung').value.trim(),
            address: document.getElementById('profile-address').value.trim(),
            eselon1: document.getElementById('profile-eselon1').value,
            eselon2: document.getElementById('profile-eselon2').value.trim(),
            bagian: document.getElementById('profile-bagian').value.trim()
        };

        if (!updates.name) {
            showToast('Nama tidak boleh kosong', 'error');
            return;
        }

        Auth.updateProfile(updates);
        showToast('Profil berhasil diperbarui!', 'success');
        // Re-render to show new avatar/name
        Router.navigate('/profile');
    });

    document.getElementById('btn-logout')?.addEventListener('click', () => {
        if(confirm('Apakah Anda yakin ingin keluar?')) {
            Auth.logout();
            showToast('Anda telah keluar', 'success');
            Router.navigate('/');
        }
    });
}
