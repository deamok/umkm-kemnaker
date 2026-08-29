import { db } from './firebase-init.js';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { generateId } from './utils.js';

const Store = {
  KEYS: {
    USERS: 'users',
    PRODUCTS: 'products',
    ORDERS: 'orders',
    CARTS: 'carts',
    LAPAKS: 'lapaks',
    CHATS: 'chats',
    CURRENT_USER: 'elapak_current_user'
  },
  
  async init() {
    // Database seeding is disabled for production cloud environment.
  },

  async getProducts() {
    const q = query(collection(db, this.KEYS.PRODUCTS));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        unit: data.unit || 'Pcs',
        minOrder: data.minOrder || 1,
        status: data.status || 'ready',
        sold: data.sold || 0,
        rating: data.rating || 0
      };
    });
  },
  async getProduct(id) {
    const docRef = doc(db, this.KEYS.PRODUCTS, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      unit: data.unit || 'Pcs',
      minOrder: data.minOrder || 1,
      status: data.status || 'ready',
      sold: data.sold || 0,
      rating: data.rating || 0
    };
  },
  async getProductsByCategory(category) {
    const q = query(collection(db, this.KEYS.PRODUCTS), where("category", "==", category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  async getProductsBySeller(sellerId) {
    const q = query(collection(db, this.KEYS.PRODUCTS), where("sellerId", "==", sellerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        unit: data.unit || 'Pcs',
        minOrder: data.minOrder || 1,
        status: data.status || 'ready',
        sold: data.sold || 0,
        rating: data.rating || 0
      };
    });
  },
  async searchProducts(queryStr) {
    const all = await this.getProducts();
    const q = queryStr.toLowerCase();
    return all.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
  },
  async addProduct(product) {
    const newProduct = { ...product, sold: 0, rating: 0, createdAt: new Date().toISOString() };
    const docRef = await addDoc(collection(db, this.KEYS.PRODUCTS), newProduct);
    return { id: docRef.id, ...newProduct };
  },
  async updateProduct(id, updates) {
    const docRef = doc(db, this.KEYS.PRODUCTS, id);
    await updateDoc(docRef, updates);
    return { id, ...updates };
  },
  async deleteProduct(id) {
    await deleteDoc(doc(db, this.KEYS.PRODUCTS, id));
    return true;
  },

  // Orders
  async getAllOrders() {
    const q = query(collection(db, this.KEYS.ORDERS));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  async getOrders(userId) {
    const q = query(collection(db, this.KEYS.ORDERS), where("buyerId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  async getSellerOrders(sellerId) {
    const q = query(collection(db, this.KEYS.ORDERS), where("sellerId", "==", sellerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  async addOrder(orderData) {
    const id = orderData.id || 'ord-' + generateId();
    // Deep sanitize undefined values to null or empty string to ensure Firestore setDoc never throws
    const sanitized = JSON.parse(JSON.stringify(orderData, (k, v) => v === undefined ? null : v));
    const newOrder = { ...sanitized, createdAt: new Date().toISOString() };
    await setDoc(doc(db, this.KEYS.ORDERS, id), newOrder);
    return { id, ...newOrder };
  },
  async updateOrderStatus(orderId, status) {
    const docRef = doc(db, this.KEYS.ORDERS, orderId);
    
    // Jika pesanan selesai, tambahkan jumlah produk terjual
    if (status === 'completed') {
      const orderSnap = await getDoc(docRef);
      if (orderSnap.exists()) {
        const orderData = orderSnap.data();
        if (orderData.status !== 'completed' && orderData.items) {
          for (const item of orderData.items) {
            const productRef = doc(db, this.KEYS.PRODUCTS, item.productId);
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
              const currentSold = productSnap.data().sold || 0;
              await updateDoc(productRef, { sold: currentSold + item.qty });
            }
          }
        }
      }
    }
    
    await updateDoc(docRef, { status });
    return true;
  },
  async getOrder(id) {
    const docRef = doc(db, this.KEYS.ORDERS, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  async getAllOrders() {
    const snapshot = await getDocs(collection(db, this.KEYS.ORDERS));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Users
  async getUsers() {
    const snapshot = await getDocs(collection(db, this.KEYS.USERS));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  async getUser(id) {
    const docRef = doc(db, this.KEYS.USERS, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  async getUserByEmail(email) {
    const q = query(collection(db, this.KEYS.USERS), where("email", "==", email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  },
  async createUser(userData) {
    const id = userData.id || 'usr-' + generateId();
    const newUser = { ...userData, createdAt: new Date().toISOString() };
    await setDoc(doc(db, this.KEYS.USERS, id), newUser);
    return { id, ...newUser };
  },
  async updateUser(id, updates) {
    const docRef = doc(db, this.KEYS.USERS, id);
    await updateDoc(docRef, updates);
    return true;
  },

  // Lapak
  async getAllLapaks() {
    const snapshot = await getDocs(collection(db, this.KEYS.LAPAKS));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  async getLapak(userId) {
    const q = query(collection(db, this.KEYS.LAPAKS), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  },
  async createLapak(lapakData) {
    const newLapak = { ...lapakData, createdAt: new Date().toISOString() };
    await setDoc(doc(db, this.KEYS.LAPAKS, lapakData.userId), newLapak);
    return { id: lapakData.userId, ...newLapak };
  },
  async updateLapak(userId, updates) {
    const q = query(collection(db, this.KEYS.LAPAKS), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await updateDoc(snapshot.docs[0].ref, updates);
    } else {
      await this.createLapak({ userId, ...updates });
    }
  },

  // Cart - Keep in LocalStorage for Speed & Cost efficiency (No need to sync carts to cloud until checkout)
  getCart() {
    const userId = localStorage.getItem('elapak_current_user');
    if (!userId) return [];
    const data = localStorage.getItem(this.KEYS.CARTS);
    const carts = data ? JSON.parse(data) : {};
    return carts[userId] || [];
  },
  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.qty, 0);
  },
  addToCart(productId, qty = 1) {
    const userId = localStorage.getItem('elapak_current_user');
    if (!userId) return;
    const data = localStorage.getItem(this.KEYS.CARTS);
    const carts = data ? JSON.parse(data) : {};
    if (!carts[userId]) carts[userId] = [];
    
    const existing = carts[userId].find(item => item.productId === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      carts[userId].push({ productId, qty });
    }
    localStorage.setItem(this.KEYS.CARTS, JSON.stringify(carts));
  },
  updateCartQty(productId, qty) {
    const userId = localStorage.getItem('elapak_current_user');
    if (!userId) return;
    const data = localStorage.getItem(this.KEYS.CARTS);
    const carts = data ? JSON.parse(data) : {};
    if (!carts[userId]) return;
    
    const item = carts[userId].find(item => item.productId === productId);
    if (item) item.qty = qty;
    localStorage.setItem(this.KEYS.CARTS, JSON.stringify(carts));
  },
  removeFromCart(productId) {
    const userId = localStorage.getItem('elapak_current_user');
    if (!userId) return;
    const data = localStorage.getItem(this.KEYS.CARTS);
    const carts = data ? JSON.parse(data) : {};
    if (!carts[userId]) return;
    
    carts[userId] = carts[userId].filter(item => item.productId !== productId);
    localStorage.setItem(this.KEYS.CARTS, JSON.stringify(carts));
  },
  clearCart() {
    const userId = localStorage.getItem('elapak_current_user');
    if (!userId) return;
    const data = localStorage.getItem(this.KEYS.CARTS);
    const carts = data ? JSON.parse(data) : {};
    carts[userId] = [];
    localStorage.setItem(this.KEYS.CARTS, JSON.stringify(carts));
  },

  // Chats
  async getOrCreateChatRoom(buyerId, buyerName, sellerId, sellerName) {
    const chatId = `${buyerId}_${sellerId}`;
    const chatRef = doc(db, this.KEYS.CHATS, chatId);
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        id: chatId,
        buyerId,
        buyerName,
        sellerId,
        sellerName,
        lastMessage: '',
        lastMessageSenderId: '',
        updatedAt: new Date().toISOString()
      });
    }
    return chatId;
  },
  async getChatRoom(chatId) {
    const docRef = doc(db, this.KEYS.CHATS, chatId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  async sendMessage(chatId, senderId, text, productId = null) {
    const messageData = {
      senderId,
      text,
      createdAt: new Date().toISOString(),
      read: false
    };
    if (productId) messageData.productId = productId;
    
    // Add message to subcollection
    const msgCollection = collection(db, this.KEYS.CHATS, chatId, 'messages');
    await addDoc(msgCollection, messageData);
    
    // Update chat metadata
    const chatRef = doc(db, this.KEYS.CHATS, chatId);
    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageSenderId: senderId,
      updatedAt: new Date().toISOString()
    });
  },
  listenMessages(chatId, callback) {
    const q = query(
      collection(db, this.KEYS.CHATS, chatId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(messages);
    });
  },
  listenUserChats(userId, callback) {
    const qBuyer = query(collection(db, this.KEYS.CHATS), where("buyerId", "==", userId));
    const qSeller = query(collection(db, this.KEYS.CHATS), where("sellerId", "==", userId));
    
    let buyerRooms = [];
    let sellerRooms = [];
    
    const triggerCallback = () => {
      const merged = [...buyerRooms, ...sellerRooms];
      const unique = [];
      const seen = new Set();
      for (const room of merged) {
        if (!seen.has(room.id)) {
          seen.add(room.id);
          unique.push(room);
        }
      }
      unique.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      callback(unique);
    };

    const unsubBuyer = onSnapshot(qBuyer, (snapshot) => {
      buyerRooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      triggerCallback();
    });

    const unsubSeller = onSnapshot(qSeller, (snapshot) => {
      sellerRooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      triggerCallback();
    });

    return () => {
      unsubBuyer();
      unsubSeller();
    };
  }
};

export default Store;
