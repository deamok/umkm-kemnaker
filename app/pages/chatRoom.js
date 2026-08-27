import Store from '../store.js';
import Auth from '../auth.js';
import Router from '../router.js';
import { escapeHtml } from '../utils.js';

export async function render(params) {
    const chatId = params.id;
    const user = await Auth.getCurrentUser();
    if (!user) {
        setTimeout(() => Router.navigate('/login'), 0);
        return `<div class="container text-center mt-5"><p>Mengarahkan ke halaman login...</p></div>`;
    }

    const chatRoom = await Store.getChatRoom(chatId);
    if (!chatRoom) {
        return `
            <div class="container py-20 text-center">
                <div class="text-6xl mb-4">😢</div>
                <h2 class="text-2xl font-bold mb-4">Ruang obrolan tidak ditemukan</h2>
                <a href="#/chats" class="btn btn-primary">Kembali ke Kotak Masuk</a>
            </div>
        `;
    }

    const isBuyer = chatRoom.buyerId === user.id;
    const otherName = isBuyer ? chatRoom.sellerName : chatRoom.buyerName;

    return `
        <div class="chat-room-page container mt-6 mb-10 fade-in">
            <div class="mx-auto card border flex flex-col" style="max-width: 48rem; height: 600px; border-radius: var(--radius-xl); overflow: hidden; display: flex; flex-direction: column;">
                <!-- Chat Header -->
                <div class="chat-header p-4 border-b flex items-center justify-between bg-gray-50" style="border-bottom: 1px solid var(--border-glass); background-color: var(--bg-secondary); display: flex; align-items: center; justify-content: space-between; padding: 1rem;">
                    <div class="flex items-center gap-3" style="display: flex; align-items: center; gap: 0.75rem;">
                        <a href="#/chats" class="btn btn-icon text-secondary" style="display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border-glass); background: var(--bg-primary); cursor: pointer;" title="Kembali ke Inbox">
                            <i data-lucide="arrow-left" style="width: 18px; height: 18px; color: var(--text-primary);"></i>
                        </a>
                        <div>
                            <h3 class="font-bold text-gray-800" style="margin: 0; font-size: 16px; color: var(--text-primary);">${escapeHtml(otherName)}</h3>
                            <span class="text-xs text-muted" style="color: var(--text-secondary);">${isBuyer ? 'Penjual Lapak' : 'Pembeli'}</span>
                        </div>
                    </div>
                </div>

                <!-- Messages Container -->
                <div id="chat-messages-container" class="flex-grow p-4 overflow-y-auto" style="flex-grow: 1; overflow-y: auto; background-color: var(--bg-primary); display: flex; flex-direction: column; gap: 0.75rem; padding: 1.5rem;">
                    <div class="text-center py-20 text-muted" style="text-align: center; color: var(--text-secondary);">
                        <div style="font-size: 2.5rem; animation: pulse 2s infinite;">🔄</div>
                        <p class="mt-2">Menghubungkan obrolan...</p>
                    </div>
                </div>

                <!-- Input Footer -->
                <div class="chat-input-footer p-4 border-t" style="border-top: 1px solid var(--border-glass); background-color: var(--bg-secondary); padding: 1rem;">
                    <form id="chat-send-form" class="flex gap-2" style="display: flex; gap: 0.5rem; width: 100%;">
                        <input type="text" id="chat-message-input" class="form-input flex-grow py-3 px-4 border" style="flex-grow: 1; border-radius: var(--radius-md); outline: none; border: 1px solid var(--border-glass); background-color: var(--bg-primary); color: var(--text-primary); padding: 0.75rem 1rem;" placeholder="Ketik pesan Anda di sini..." autocomplete="off" required>
                        <button type="submit" class="btn btn-primary px-5 font-semibold flex flex-center gap-1" style="border-radius: var(--radius-md); display: inline-flex; align-items: center; justify-content: center; background-color: var(--accent-primary); color: white; border: none; padding: 0.75rem 1.5rem; cursor: pointer;">
                            <span>Kirim</span> <i data-lucide="send" style="width: 14px; height: 14px;"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
}

export async function afterRender(params) {
    if (window.lucide) window.lucide.createIcons();

    const chatId = params.id;
    const user = await Auth.getCurrentUser();
    if (!user) return;

    const messagesContainer = document.getElementById('chat-messages-container');
    const sendForm = document.getElementById('chat-send-form');
    const messageInput = document.getElementById('chat-message-input');

    // Subscribe to messages
    const unsubscribe = Store.listenMessages(chatId, (messages) => {
        if (!messages || messages.length === 0) {
            messagesContainer.innerHTML = `
                <div style="flex-grow: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary); text-align: center; padding: 4rem 1rem; margin: auto;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">💬</div>
                    <h4 class="font-bold" style="color: var(--text-primary);">Belum ada obrolan</h4>
                    <p style="font-size: 13px; color: var(--text-secondary);">Mulai percakapan dengan mengetik pesan di bawah ini.</p>
                </div>
            `;
            return;
        }

        messagesContainer.innerHTML = messages.map(msg => {
            const isMe = msg.senderId === user.id;
            const msgTime = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
            
            const productCard = msg.productId ? `
                <div onclick="window.location.hash = '/product/${msg.productId}'" style="
                    display: flex; align-items: center; gap: 8px;
                    background: ${isMe ? 'rgba(255,255,255,0.15)' : 'var(--bg-tertiary)'};
                    border-radius: 8px; padding: 8px; margin-bottom: 6px;
                    cursor: pointer; border: 1px solid ${isMe ? 'rgba(255,255,255,0.2)' : 'var(--border-glass)'};
                ">
                    <i data-lucide="package" style="width:16px; height:16px; flex-shrink:0; opacity:0.8;"></i>
                    <span style="font-size: 12px; font-weight: 600; opacity: 0.9; text-decoration: underline;">Lihat Produk →</span>
                </div>
            ` : '';

            return `
                <div style="display: flex; justify-content: ${isMe ? 'flex-end' : 'flex-start'}; margin-bottom: 0.5rem; width: 100%;">
                    <div class="message-bubble" style="
                        max-width: 75%; 
                        padding: 0.75rem 1rem; 
                        border-radius: 12px; 
                        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                        position: relative;
                        background-color: ${isMe ? 'var(--accent-primary)' : 'var(--bg-secondary)'};
                        color: ${isMe ? 'white' : 'var(--text-primary)'};
                        border: ${isMe ? 'none' : '1px solid var(--border-glass)'};
                        border-bottom-right-radius: ${isMe ? '2px' : '12px'};
                        border-bottom-left-radius: ${isMe ? '12px' : '2px'};
                    ">
                        ${productCard}
                        <p style="margin: 0; font-size: 14px; line-height: 1.4; word-break: break-word;">${escapeHtml(msg.text)}</p>
                        <div style="text-align: right; font-size: 9px; margin-top: 4px; opacity: 0.7; color: ${isMe ? 'white' : 'var(--text-secondary)'};">
                            ${msgTime}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Auto-scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });

    // Handle form submit
    sendForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = messageInput.value.trim();
        if (!text) return;

        messageInput.value = '';
        messageInput.focus();

        try {
            await Store.sendMessage(chatId, user.id, text);
        } catch (error) {
            console.error("Gagal mengirim pesan:", error);
            alert("Pesan gagal dikirim, silakan coba lagi.");
        }
    });

    // Cleanup listener on navigation
    window.addEventListener('hashchange', () => unsubscribe(), { once: true });
}
