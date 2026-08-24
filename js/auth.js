import Store from './store.js';

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
    localStorage.setItem(Store.KEYS.CURRENT_USER, user.id);
    return user;
  },
  
  async login(email, password) {
    const user = await Store.getUserByEmail(email);
    if (!user) return {error: 'Email tidak ditemukan'};
    if (user.password !== password) return {error: 'Password salah'};
    
    localStorage.setItem(Store.KEYS.CURRENT_USER, user.id);
    return user;
  },
  
  logout() {
    localStorage.removeItem(Store.KEYS.CURRENT_USER);
  },
  
  async getCurrentUser() {
    const userId = localStorage.getItem(Store.KEYS.CURRENT_USER);
    if (!userId || userId === 'null' || userId === 'undefined') {
      localStorage.removeItem(Store.KEYS.CURRENT_USER);
      return null;
    }
    const user = await Store.getUser(userId);
    if (!user) {
      localStorage.removeItem(Store.KEYS.CURRENT_USER);
      return null;
    }
    return user;
  },
  
  isLoggedIn() {
    const userId = localStorage.getItem(Store.KEYS.CURRENT_USER);
    return !!userId && userId !== 'null' && userId !== 'undefined';
  },
  
  async updateProfile(updates) {
    const user = await this.getCurrentUser();
    if (!user) return null;
    return await Store.updateUser(user.id, updates);
  }
};

export default Auth;
