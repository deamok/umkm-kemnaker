import Store from '../store.js';
import Auth from '../auth.js';
import Router from '../router.js';
import { timeAgo, escapeHtml } from '../utils.js';

export async function render(params) {
    if (!Auth.isLoggedIn()) {
        setTimeout(() => Router.navigate('/login'), 0);
        return `<div class="container text-center mt-5"><p>Mengarahkan ke halaman login...</p></div>`;
    }

    return `
        <div class="chats-page container mt-6 mb-10 fade-in">
            <h1 class="text-2xl font-heading font-bold mb-5 flex flex-center">
                <i data-lucide="message-square" class="mr-2 text-primary w-6 h-6"></i> Kotak Masuk Chat
            </h1>
            
            <div class="mx-auto card border" style="max-width: 48rem; min-height: 400px; display: flex; flex-direction: column;">
                <div id="chats-list-container" class="flex-grow">
                    <div class="text-center py-20 text-muted">
                        <div style="font-size: 2.5rem; animation: pulse 2s infinite; text-align: center;">🔄</div>
                        <p class="mt-2 text-center">Memuat daftar obrolan...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function afterRender(params) {
    if (window.lucide) window.lucide.createIcons();

    const user = await Auth.getCurrentUser();
    if (!user) return;

    const listContainer = document.getElementById('chats-list-container');
    
    // Subscribe to chat list updates
    const unsubscribe = Store.listenUserChats(user.id, (rooms) => {
        if (!rooms || rooms.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state text-center py-16" style="padding: 4rem 1rem; text-align: center;">
                    <div class="flex flex-center justify-center mx-auto mb-4" style="width: 5rem; height: 5rem; border-radius: var(--radius-full); background: #f3f4f6; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
                        <i data-lucide="message-circle" class="w-10 h-10 text-muted"></i>
                    </div>
                    <h3 class="text-xl font-bold text-secondary">Belum ada obrolan</h3>
                    <p class="text-muted mt-2 mb-5">Hubungi penjual dari detail produk atau pesanan untuk mulai chat.</p>
                    <a href="#/products" class="btn btn-primary px-6 py-2 card inline-flex flex-center">
                        Lihat Produk <i data-lucide="arrow-right" class="ml-2 w-4 h-4"></i>
                    </a>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        listContainer.innerHTML = `
            <div class="chat-list" style="display: flex; flex-direction: column;">
                ${rooms.map(room => {
                    const isBuyer = room.buyerId === user.id;
                    const otherName = isBuyer ? room.sellerName : room.buyerName;
                    const roleLabel = isBuyer ? 'Penjual' : 'Pembeli';
                    const lastMessageText = room.lastMessage || 'Belum ada pesan.';
                    const lastActive = room.updatedAt ? timeAgo(room.updatedAt) : '';
                    
                    return `
                        <div class="chat-item p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors" 
                             data-id="${room.id}"
                             style="display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid var(--border-glass);">
                            
                            <div class="chat-avatar flex flex-center justify-center bg-primary text-white font-bold" 
                                 style="width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; background-color: var(--accent-primary);">
                                ${otherName.charAt(0).toUpperCase()}
                            </div>
                            
                            <div class="chat-info" style="flex-grow: 1; min-width: 0;">
                                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem;">
                                    <h4 class="font-bold text-gray-800 text-base truncate" style="margin: 0; max-width: 70%; font-size: 15px;">${escapeHtml(otherName)}</h4>
                                    <span class="text-xs text-muted" style="flex-shrink: 0; color: var(--text-secondary);">${lastActive}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <p class="text-sm text-muted truncate" style="margin: 0; max-width: 80%; font-weight: ${room.lastMessageSenderId !== user.id && room.lastMessage ? '600' : 'normal'}; color: ${room.lastMessageSenderId !== user.id && room.lastMessage ? 'var(--text-primary)' : 'var(--text-secondary)'}; font-size: 13px;">
                                        ${escapeHtml(lastMessageText)}
                                    </p>
                                    <span class="badge text-xs px-1.5 py-0.5 rounded" style="font-size: 10px; font-weight: 600; background: var(--bg-primary); border: 1px solid var(--border-glass); border-radius: 4px;">
                                        ${roleLabel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        if (window.lucide) window.lucide.createIcons();

        // Handle item click
        document.querySelectorAll('.chat-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const id = item.dataset.id;
                Router.navigate(`/chat/${id}`);
            });
        });
    });

    // Cleanup on navigation
    window.addEventListener('hashchange', () => unsubscribe(), { once: true });
}
