import Store from '../store.js';
import Auth from '../auth.js';
import Router from '../router.js';
import { showToast, timeAgo } from '../utils.js';
import { showModal } from '../components/modal.js';

const eselonData = {
    "Setjen": [
        "Biro Perencanaan dan Manajemen Kinerja",
        "Biro Keuangan & BMN",
        "Biro OSDM",
        "Biro Hukum",
        "Biro Kerja Sama Luar Negeri dan Humas"
    ],
    "Ditjen Binalavotas": [
        "Sekretariat Direktorat Jenderal",
        "Direktorat Bina Standardisasi Kompetensi dan Program Pelatihan",
        "Direktorat Bina Kelembagaan Pelatihan Vokasi",
        "Direktorat Bina Penyelenggaraan Pelatihan Vokasi dan Pemagangan",
        "Direktorat Bina Peningkatan Produktivitas",
        "Direktorat Bina Instruktur dan Tenaga Pelatihan"
    ],
    "Ditjen Binapenta & PKK": [
        "Sekretariat Direktorat Jenderal",
        "Direktorat Bina Penempatan Tenaga Kerja",
        "Direktorat Bina Penempatan Tenaga Kerja Khusus",
        "Direktorat Bina Perluasan Kesempatan Kerja",
        "Direktorat Pengendalian Penggunaan Tenaga Kerja Asing",
        "Direktorat Bina Pengantar Kerja"
    ],
    "Binwasnaker & K3": [
        "Sekretariat Direktorat Jenderal",
        "Direktorat Bina Sistem Pengawasan Ketenagakerjaan",
        "Direktorat Bina Kelembagaan Keselamatan dan Kesehatan Kerja",
        "Direktorat Bina Pemeriksaaan Norma Ketenagakerjaan",
        "Direktorat Bina Pengujian Keselamatan dan Kesehatan Kerja",
        "Direktorat Bina Pengawas Ketenagakerjaan dan Penguji Keselamatan dan Kesehatan Kerja"
    ],
    "PHI & Jamsos": [
        "Sekretariat Direktorat Jenderal",
        "Direktorat Hubungan Kerja dan Pengupahan",
        "Direktorat Jaminan Sosial Tenaga Kerja dan Fasilitasi Kesejahteraan Pekerja",
        "Direktorat Kelembagaan dan Pencegahan Perselisihan Hubungan Industrial",
        "Direktorat Penyelesaian Perselisihan Hubungan Industrial",
        "Direktorat Bina Mediator Hubungan Industrial"
    ],
    "Itjen": [
        "Sekretariat Inspektorat Jenderal",
        "Inspektorat I",
        "Inspektorat II",
        "Inspektorat III",
        "Inspektorat IV"
    ],
    "Barenbang": [
        "Sekretariat Badan",
        "Pusat Perencanaan Ketenagakerjaan",
        "Pusat Data dan Informasi Ketenagakerjaan",
        "Pusat Penelitian dan Pengembangan Ketenagakerjaan"
    ]
};

export async function render(params) {
    if (!Auth.isLoggedIn()) {
        setTimeout(() => Router.navigate('/login'), 0);
        return `<div class="container text-center mt-5"><p>Mengarahkan ke halaman login...</p></div>`;
    }

    const user = await Auth.getCurrentUser();
    const lapak = await Store.getLapak(user.id);
    const hasLapak = !!lapak;

    // Right side content HTML based on whether user has a store/lapak or not
    let rightContentHtml = '';

    if (!hasLapak) {
        rightContentHtml = `
            <div class="card border" style="border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); flex-grow: 1; display: flex; flex-direction: column;">
                <div class="card-body p-6 md:p-8" style="flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
                    <!-- View Mode Container -->
                    <div id="profile-view-container">
                        <h2 class="text-2xl font-heading font-bold pb-4 border-b flex align-center text-gray-800" style="margin-bottom: 2.25rem;">
                            <i data-lucide="user" class="w-6 h-6 mr-3 text-primary"></i> Detail Profil
                        </h2>
                        
                        <div style="display: flex; flex-direction: column; gap: 0;">
                            <div>
                                <span class="font-bold text-sm block" style="margin-bottom: 1px; color: var(--accent-primary);">Nama Lengkap</span>
                                <div class="p-3 border rounded-md bg-gray-50 text-gray-800 font-medium">${user.name}</div>
                            </div>
                            
                            <div>
                                <span class="font-bold text-sm block" style="margin-bottom: 1px; color: var(--accent-primary);">Email</span>
                                <div class="p-3 border rounded-md bg-gray-50 text-gray-800 font-medium">${user.email}</div>
                            </div>
                            
                            <div>
                                <span class="font-bold text-sm block" style="margin-bottom: 1px; color: var(--accent-primary);">No. Handphone</span>
                                <div class="p-3 border rounded-md bg-gray-50 text-gray-800 font-medium">${user.phone || '<em class="text-muted text-xs">Belum diisi</em>'}</div>
                            </div>
                            
                            <div>
                                <span class="font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">Alamat Pengiriman</span>
                                <div class="p-3 border rounded-md bg-gray-50 text-gray-800 font-medium" style="min-height: 80px; white-space: pre-wrap;">${user.address || '<em class="text-muted text-xs">Belum diisi</em>'}</div>
                            </div>
                            
                            <div class="pt-6 mt-2 border-t border-gray-100 flex justify-end gap-3">
                                <button type="button" id="btn-change-password" class="btn btn-outline px-6 py-3 rounded-md shadow-sm hover:shadow-md transition-all font-bold flex align-center">
                                    <i data-lucide="key" class="w-5 h-5 mr-2"></i> Ubah Sandi
                                </button>
                                <button type="button" id="btn-edit-profile" class="btn btn-primary px-8 py-3 rounded-md shadow-sm hover:shadow-md transition-all font-bold text-white flex align-center">
                                    <i data-lucide="user-pen" class="w-5 h-5 mr-2"></i> Edit Profil
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Edit Mode Container (Hidden by default) -->
                    <div id="profile-edit-container" style="display: none;">
                        <h2 class="text-2xl font-heading font-bold pb-4 border-b flex align-center text-gray-800" style="margin-bottom: 2.25rem;">
                            <i data-lucide="user-cog" class="w-6 h-6 mr-3 text-primary"></i> Edit Profil
                        </h2>
                        
                        <form id="profile-form-simplified" style="display: flex; flex-direction: column; gap: 0;">
                            <div class="form-group">
                                <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">Nama Lengkap</label>
                                <input type="text" id="profile-name" class="form-input p-3 border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-md bg-gray-50 hover:bg-white focus:bg-white" style="width: 100%;" value="${user.name}" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">Email (Readonly)</label>
                                <input type="email" class="form-input p-3 border text-muted cursor-not-allowed bg-gray-100 rounded-md" style="width: 100%;" value="${user.email}" readonly>
                            </div>

                            <div class="form-group">
                                <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">No. Handphone</label>
                                <input type="tel" id="profile-phone" class="form-input p-3 border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-md bg-gray-50 hover:bg-white focus:bg-white" style="width: 100%;" value="${user.phone || ''}">
                            </div>

                            <div class="form-group">
                                <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">Alamat Lengkap Pengiriman</label>
                                <textarea id="profile-address" class="form-textarea p-3 border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-md bg-gray-50 hover:bg-white focus:bg-white" style="width: 100%;" rows="3" placeholder="Contoh: Gedung A, Lantai 3, Ruang Rapat Utama...">${user.address || ''}</textarea>
                            </div>

                            <div class="pt-6 mt-2 border-t border-gray-100 flex justify-end gap-3">
                                <button type="button" id="btn-cancel-edit" class="btn btn-outline px-6 py-3 rounded-md transition-all font-bold">
                                    Batal
                                </button>
                                <button type="submit" class="btn btn-primary px-8 py-3 rounded-md shadow-sm hover:shadow-md transition-all font-bold text-white flex align-center">
                                    <i data-lucide="save" class="w-5 h-5 mr-2"></i> Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    } else {
        rightContentHtml = `
            <div class="card border" style="border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); flex-grow: 1; display: flex; flex-direction: column;">
                <div class="card-body p-6 md:p-8" style="flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
                    
                    <!-- View Mode Container -->
                    <div id="profile-view-container">
                        <h2 class="text-2xl font-heading font-bold pb-4 border-b flex align-center text-gray-800" style="margin-bottom: 2.25rem;">
                            <i data-lucide="user" class="w-6 h-6 mr-3 text-primary"></i> Detail Profil
                        </h2>
                        
                        <div style="display: flex; flex-direction: column; gap: 0;">
                            <div>
                                <span class="font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">Nama Lengkap</span>
                                <div class="p-3 border rounded-md bg-gray-50 text-gray-800 font-medium">${user.name}</div>
                            </div>
                            
                            <div>
                                <span class="font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">Email</span>
                                <div class="p-3 border rounded-md bg-gray-50 text-gray-800 font-medium">${user.email}</div>
                            </div>
                            
                            <div>
                                <span class="font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">No. Handphone</span>
                                <div class="p-3 border rounded-md bg-gray-50 text-gray-800 font-medium">${user.phone || '<em class="text-muted text-xs">Belum diisi</em>'}</div>
                            </div>

                            <div>
                                <span class="font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">Nama Warung / Lapak</span>
                                <div class="p-3 border rounded-md bg-gray-50 text-gray-800 font-medium">${user.warungName || lapak?.name || '<em class="text-muted text-xs">Belum diisi</em>'}</div>
                            </div>
                            <div>
                                <span class="font-bold text-sm block" style="margin-bottom: 6px; color: var(--accent-primary);">Unit Kerja :</span>
                                <div style="display: flex; flex-direction: column; gap: 0.35rem; padding-left: 0.75rem; border-left: 2px solid var(--accent-primary);">
                                    <div class="border rounded-md bg-gray-50 text-gray-800 font-medium" style="padding: 0.5rem 0.75rem; font-size: 0.9rem;">${user.bagian || '<em class="text-muted text-xs">Belum diisi</em>'}</div>
                                    <div class="border rounded-md bg-gray-50 text-gray-800 font-medium" style="padding: 0.5rem 0.75rem; font-size: 0.9rem;">${user.eselon2 || '<em class="text-muted text-xs">Belum diisi</em>'}</div>
                                    <div class="border rounded-md bg-gray-50 text-gray-800 font-medium" style="padding: 0.5rem 0.75rem; font-size: 0.9rem;">${user.eselon1 || '<em class="text-muted text-xs">Belum diisi</em>'}</div>
                                </div>
                            </div>
                            
                            <div class="pt-6 mt-2 border-t border-gray-100 flex justify-end gap-3">
                                <button type="button" id="btn-change-password-seller" class="btn btn-outline px-6 py-3 rounded-md shadow-sm hover:shadow-md transition-all font-bold flex align-center">
                                    <i data-lucide="key" class="w-5 h-5 mr-2"></i> Ubah Sandi
                                </button>
                                <button type="button" id="btn-edit-profile" class="btn btn-primary px-8 py-3 rounded-md shadow-sm hover:shadow-md transition-all font-bold text-white flex align-center">
                                    <i data-lucide="user-pen" class="w-5 h-5 mr-2"></i> Edit Profil
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Edit Mode Container (Hidden by default) -->
                    <div id="profile-edit-container" style="display: none;">
                        <h2 class="text-2xl font-heading font-bold pb-4 border-b flex align-center text-gray-800" style="margin-bottom: 2.25rem;">
                            <i data-lucide="user-cog" class="w-6 h-6 mr-3 text-primary"></i> Edit Profil
                        </h2>
                        
                        <form id="profile-form-full" style="display: flex; flex-direction: column; gap: 0;">
                            <div class="form-group">
                                <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">Nama Lengkap</label>
                                <input type="text" id="profile-name" class="form-input p-3 border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-md bg-gray-50 hover:bg-white focus:bg-white" style="width: 100%;" value="${user.name}" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">Email (Readonly)</label>
                                <input type="email" class="form-input p-3 border text-muted cursor-not-allowed bg-gray-100 rounded-md" style="width: 100%;" value="${user.email}" readonly>
                            </div>

                            <div class="form-group">
                                <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">No. Handphone</label>
                                <input type="tel" id="profile-phone" class="form-input p-3 border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-md bg-gray-50 hover:bg-white focus:bg-white" style="width: 100%;" value="${user.phone || ''}">
                            </div>

                            <div class="form-group mt-2">
                                <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">Nama Warung / Lapak</label>
                                <input type="text" id="profile-warung" class="form-input p-3 border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-md bg-gray-50 hover:bg-white focus:bg-white" style="width: 100%;" placeholder="Contoh: Kopi Kekinian Bu Sari" value="${user.warungName || lapak?.name || ''}">
                            </div>

                            <div class="form-group">
                                <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">Alamat Lengkap Pengiriman</label>
                                <textarea id="profile-address" class="form-textarea p-3 border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-md bg-gray-50 hover:bg-white focus:bg-white" style="width: 100%;" rows="3" placeholder="Contoh: Gedung A, Lantai 3, Ruang Rapat Utama...">${user.address || ''}</textarea>
                            </div>

                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;" class="mt-2 border-t border-gray-100 pt-6">
                                <div class="form-group">
                                    <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">Unit Eselon I</label>
                                    <select id="profile-eselon1" class="form-select p-3 border focus:border-primary transition-all rounded-md bg-gray-50 hover:bg-white focus:bg-white cursor-pointer" style="width: 100%;">
                                        <option value="">-- Pilih Unit Eselon I --</option>
                                        <option value="Setjen" ${user.eselon1 === 'Setjen' ? 'selected' : ''}>Setjen</option>
                                        <option value="Ditjen Binalavotas" ${user.eselon1 === 'Ditjen Binalavotas' ? 'selected' : ''}>Ditjen Binalavotas</option>
                                        <option value="Ditjen Binapenta & PKK" ${user.eselon1 === 'Ditjen Binapenta & PKK' ? 'selected' : ''}>Ditjen Binapenta & PKK</option>
                                        <option value="Binwasnaker & K3" ${user.eselon1 === 'Binwasnaker & K3' ? 'selected' : ''}>Binwasnaker & K3</option>
                                        <option value="PHI & Jamsos" ${user.eselon1 === 'PHI & Jamsos' ? 'selected' : ''}>PHI & Jamsos</option>
                                        <option value="Itjen" ${user.eselon1 === 'Itjen' ? 'selected' : ''}>Itjen</option>
                                        <option value="Barenbang" ${user.eselon1 === 'Barenbang' ? 'selected' : ''}>Barenbang</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">Unit Eselon II</label>
                                    <select id="profile-eselon2" class="form-select p-3 border focus:border-primary transition-all rounded-md bg-gray-50 hover:bg-white focus:bg-white cursor-pointer" style="width: 100%;">
                                        <option value="">-- Pilih Eselon I Terlebih Dahulu --</option>
                                    </select>
                                    <input type="hidden" id="saved-eselon2" value="${user.eselon2 || ''}">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label font-bold text-sm block" style="margin-bottom: 2px; color: var(--accent-primary);">Bagian / Divisi</label>
                                <input type="text" id="profile-bagian" class="form-input p-3 border focus:border-primary transition-all rounded-md bg-gray-50 hover:bg-white focus:bg-white" style="width: 100%;" placeholder="Contoh: Bagian Umum" value="${user.bagian || ''}">
                            </div>

                            <div class="pt-6 mt-2 border-t border-gray-100 flex justify-end gap-3">
                                <button type="button" id="btn-cancel-edit" class="btn btn-outline px-6 py-3 rounded-md transition-all font-bold">
                                    Batal
                                </button>
                                <button type="submit" class="btn btn-primary px-8 py-3 rounded-md shadow-sm hover:shadow-md transition-all font-bold text-white flex align-center">
                                    <i data-lucide="save" class="w-5 h-5 mr-2"></i> Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="profile-page container mt-8 mb-12 fade-in mx-auto" style="max-width: 64rem;">
            <h1 class="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent" style="text-align: center; margin-bottom: 3.5rem;">Profil Saya</h1>
            
            <div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">
                <!-- Sidebar (Left Side) -->
                <div style="flex: 1; min-width: 280px; max-width: 340px; display: flex; flex-direction: column; gap: 1.5rem; margin: 0 auto; align-self: flex-start;">
                    <div class="card border overflow-hidden" style="border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); display: flex; flex-direction: column;">
                        <div class="card-body p-4 text-center relative" style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 0.25rem; width: 100%;">
                            <div style="width: 100%; display: flex; flex-direction: column; align-items: center;">
                                <div class="profile-avatar-large border-4 border-white mb-2 bg-white flex-center" style="width: 6.5rem; height: 6.5rem; border-radius: 50%; overflow: hidden; box-shadow: var(--shadow-md); margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                                    ${user.avatar && user.avatar.startsWith('data:image') 
                                        ? `<img src="${user.avatar}" class="object-cover" style="width: 100%; height: 100%; object-fit: cover;">` 
                                        : `<div style="font-size: 2.75rem; line-height: 1; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">${user.avatar || '👤'}</div>`}
                                </div>
                                
                                <!-- Add/Edit Avatar Menu -->
                                <div style="margin-top: 0.25rem; margin-bottom: 0.75rem; display: flex; justify-content: center;">
                                    <label for="profile-avatar-file" class="btn btn-outline btn-sm cursor-pointer" style="display: inline-flex; align-items: center; gap: 0.4rem; border-radius: var(--radius-full); padding: 0.3rem 0.8rem; font-size: 0.75rem; border: 1px solid var(--border-glass); background: var(--bg-secondary); transition: all 0.2s;">
                                        <i data-lucide="camera" style="width: 12px; height: 12px;"></i>
                                        <span id="avatar-btn-text" style="font-size: 0.75rem;">${user.avatar && user.avatar !== '👤' ? 'Ubah Foto Profil' : 'Tambah Foto Profil'}</span>
                                    </label>
                                    <input type="file" id="profile-avatar-file" accept="image/*" style="display: none;">
                                    <input type="hidden" id="profile-avatar-base64">
                                </div>

                                <h2 class="text-xl font-bold font-heading mb-0.5 text-gray-800" style="margin-bottom: 0.15rem;">${user.name}</h2>
                                <p class="text-muted text-xs mb-3" style="margin-bottom: 0.5rem;">${user.email}</p>
                                <div class="badge bg-blue-50 text-primary px-3 py-1 text-xs font-semibold mx-auto inline-block" style="border-radius: 20px; font-size: 0.7rem; margin-bottom: 0.25rem;">
                                    Bergabung ${timeAgo(user.createdAt || Date.now())}
                                </div>
                            </div>
                            
                            <div style="border-top: 1px solid var(--border-glass); padding-top: 0.75rem; margin-top: 0.25rem; width: 100%;">
                                <button id="btn-logout" class="btn btn-block bg-red-50 text-red-600 border border-red-100 hover:bg-red-500 hover:text-white transition-all py-2 font-semibold" style="border-radius: var(--radius-md); font-size: 0.85rem; padding: 0.45rem 1rem;">
                                    <i data-lucide="log-out" class="w-4 h-4 mr-2 inline"></i> Keluar Akun
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="card border p-5" style="border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);">
                        <h3 class="font-bold mb-4 flex align-center text-gray-800"><i data-lucide="store" class="w-5 h-5 mr-2 text-primary"></i> Lapak Saya</h3>
                        ${lapak ? `
                            <div class="p-4 border mb-4" style="border-radius: var(--radius-md); background: var(--bg-tertiary);">
                                <div class="font-semibold text-lg text-gray-800">${lapak.name}</div>
                                <div class="text-sm text-muted mt-1" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${lapak.description}</div>
                            </div>
                            <a href="#/dashboard" class="btn btn-outline btn-block border-primary text-primary hover:bg-primary hover:text-white transition-colors py-2.5">Kelola Lapak</a>
                        ` : `
                            <div class="text-center py-5 text-sm text-muted bg-gray-50 rounded-md mb-4 border border-dashed border-gray-200">Anda belum memiliki lapak.</div>
                            <a href="#/dashboard" class="btn btn-primary btn-block py-2.5 shadow-sm">Buka Lapak Sekarang</a>
                        `}
                    </div>
                </div>

                <!-- Main Content (Right Side) -->
                <div style="flex: 2; min-width: 320px; display: flex; flex-direction: column;">
                    ${rightContentHtml}
                </div>
            </div>
        </div>
    `;
}

export async function afterRender(params) {
    if (window.lucide) window.lucide.createIcons();
    
    const user = await Auth.getCurrentUser();
    const fileInput = document.getElementById('profile-avatar-file');
    const base64Input = document.getElementById('profile-avatar-base64');
    
    fileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64Data = e.target.result;
                base64Input.value = base64Data;
                
                showToast('Memperbarui foto profil...', 'info');
                
                // Get all profile details
                const currentUser = await Auth.getCurrentUser();
                const updates = {
                    name: currentUser.name,
                    phone: currentUser.phone || '',
                    avatar: base64Data,
                    warungName: currentUser.warungName || '',
                    address: currentUser.address || '',
                    eselon1: currentUser.eselon1 || '',
                    eselon2: currentUser.eselon2 || '',
                    bagian: currentUser.bagian || ''
                };
                
                await Auth.updateProfile(updates);
                showToast('Foto profil berhasil diperbarui!', 'success');
                await Router.handleRoute();
            };
            reader.readAsDataURL(file);
        }
    });

    // Toggle view / edit mode for non-lapak users
    const btnEditProfile = document.getElementById('btn-edit-profile');
    const btnCancelEdit = document.getElementById('btn-cancel-edit');
    const viewContainer = document.getElementById('profile-view-container');
    const editContainer = document.getElementById('profile-edit-container');

    if (btnEditProfile && btnCancelEdit && viewContainer && editContainer) {
        btnEditProfile.addEventListener('click', () => {
            viewContainer.style.display = 'none';
            editContainer.style.display = 'block';
        });

        btnCancelEdit.addEventListener('click', () => {
            editContainer.style.display = 'none';
            viewContainer.style.display = 'block';
        });
    }
    
    // Change password logic
    const handlePasswordChange = () => {
        showModal({
            title: 'Ubah Kata Sandi',
            content: `
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <div class="form-group" style="margin: 0;">
                        <label class="form-label font-bold text-sm block" style="margin-bottom: 4px; color: var(--accent-primary);">Kata Sandi Lama</label>
                        <input type="password" id="old-password" class="form-input" style="width: 100%; border: 1px solid var(--border-glass); padding: 0.75rem 1rem; border-radius: var(--radius-md);" placeholder="Masukkan kata sandi lama" required>
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label class="form-label font-bold text-sm block" style="margin-bottom: 4px; color: var(--accent-primary);">Kata Sandi Baru</label>
                        <input type="password" id="new-password" class="form-input" style="width: 100%; border: 1px solid var(--border-glass); padding: 0.75rem 1rem; border-radius: var(--radius-md);" placeholder="Masukkan kata sandi baru" required>
                    </div>
                </div>
            `,
            confirmText: 'Simpan Sandi Baru',
            cancelText: 'Batal',
            onConfirm: async () => {
                const oldPw = document.getElementById('old-password')?.value;
                const newPw = document.getElementById('new-password')?.value;
                
                if (!oldPw || !newPw) {
                    showToast('Semua kolom sandi wajib diisi', 'error');
                    return;
                }
                
                if (newPw.length < 6) {
                    showToast('Kata sandi baru minimal 6 karakter', 'error');
                    return;
                }

                if (oldPw !== user.password) {
                    showToast('Kata sandi lama tidak sesuai', 'error');
                    return;
                }

                await Auth.updateProfile({ password: newPw });
                showToast('Kata sandi berhasil diperbarui!', 'success');
            }
        });
    };

    const btnChangePw = document.getElementById('btn-change-password');
    const btnChangePwSeller = document.getElementById('btn-change-password-seller');
    if (btnChangePw) btnChangePw.addEventListener('click', handlePasswordChange);
    if (btnChangePwSeller) btnChangePwSeller.addEventListener('click', handlePasswordChange);

    const eselon1Select = document.getElementById('profile-eselon1');
    const eselon2Select = document.getElementById('profile-eselon2');
    const savedEselon2 = document.getElementById('saved-eselon2')?.value;

    if (eselon1Select && eselon2Select) {
        eselon1Select.addEventListener('change', () => {
            const selected1 = eselon1Select.value;
            eselon2Select.innerHTML = '<option value="">-- Pilih Unit Eselon II --</option>';
            
            if (selected1 && eselonData[selected1]) {
                eselonData[selected1].forEach(opt => {
                    const optionEl = document.createElement('option');
                    optionEl.value = opt;
                    optionEl.textContent = opt;
                    if (opt === savedEselon2) {
                        optionEl.selected = true;
                    }
                    eselon2Select.appendChild(optionEl);
                });
            } else {
                eselon2Select.innerHTML = '<option value="">-- Pilih Eselon I Terlebih Dahulu --</option>';
            }
        });
        
        // Trigger on load
        eselon1Select.dispatchEvent(new Event('change'));
    }

    const handleFormSubmit = async (e, formId) => {
        e.preventDefault();
        
        let newAvatar = base64Input?.value;
        if (!newAvatar && user.avatar) {
            newAvatar = user.avatar; // Keep old avatar if no new file is uploaded
        }

        let updates = {};
        if (formId === 'profile-form-simplified') {
            updates = {
                name: document.getElementById('profile-name').value.trim(),
                phone: document.getElementById('profile-phone').value.trim(),
                avatar: newAvatar || '👤',
                address: document.getElementById('profile-address').value.trim(),
                warungName: user.warungName || '',
                eselon1: user.eselon1 || '',
                eselon2: user.eselon2 || '',
                bagian: user.bagian || ''
            };
        } else {
            updates = {
                name: document.getElementById('profile-name').value.trim(),
                phone: document.getElementById('profile-phone').value.trim(),
                avatar: newAvatar || '👤',
                warungName: document.getElementById('profile-warung').value.trim(),
                address: document.getElementById('profile-address').value.trim(),
                eselon1: document.getElementById('profile-eselon1').value,
                eselon2: document.getElementById('profile-eselon2').value.trim(),
                bagian: document.getElementById('profile-bagian').value.trim()
            };
        }

        if (!updates.name) {
            showToast('Nama tidak boleh kosong', 'error');
            return;
        }

        await Auth.updateProfile(updates);

        if (formId === 'profile-form-full') {
            await Store.updateLapak(user.id, {
                name: updates.warungName,
                description: `Warung milik ${updates.name}`
            });
        }

        showToast('Profil berhasil diperbarui!', 'success');
        await Router.handleRoute();
    };

    document.getElementById('profile-form-simplified')?.addEventListener('submit', (e) => handleFormSubmit(e, 'profile-form-simplified'));
    document.getElementById('profile-form-full')?.addEventListener('submit', (e) => handleFormSubmit(e, 'profile-form-full'));

    document.getElementById('btn-logout')?.addEventListener('click', () => {
        if(confirm('Apakah Anda yakin ingin keluar?')) {
            Auth.logout();
            showToast('Anda telah keluar', 'success');
            Router.navigate('/');
        }
    });
}
