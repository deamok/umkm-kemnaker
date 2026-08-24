import Store from './store.js';

// Key localStorage yang digunakan konsisten di auth dan store
const SESSION_KEY = 'elapak_current_user';

const Auth = {
  async register({name, email, password, phone}) {
    // Validate inputs
    if (!name || !email || !password) return {error: 'Semua field wajib diisi'};
    if (password.length < 6) return {error: 'Password minimal 6 karakter'};
    
    // Check if email exists
    const existing = await Store.getUserByEmail(email);
    if (existing) return {error: 'Email sudah terdaftar'};
    
    // Create user
    const user = await Store.createUser({name, email, password, phone, avatar:'👤', address:''});
    
    // Set session
    localStorage.setItem(SESSION_KEY, user.id);
    return user;
  },
  
  async login(email, password) {
    const user = await Store.getUserByEmail(email);
    if (!user) return {error: 'Email tidak ditemukan'};
    if (user.password !== password) return {error: 'Password salah'};
    
    localStorage.setItem(SESSION_KEY, user.id);
    return user;
  },
  
  logout() {
    localStorage.removeItem(SESSION_KEY);
  },
  
  async getCurrentUser() {
    const userId = localStorage.getItem(SESSION_KEY);
    if (!userId) return null;
    return await Store.getUser(userId);
  },
  
  isLoggedIn() {
    return !!localStorage.getItem(SESSION_KEY);
  },
  
  async updateProfile(updates) {
    const user = await this.getCurrentUser();
    if (!user) return null;
    return await Store.updateUser(user.id, updates);
  }
};

export default Auth;
