
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, User, Appointment, ChatMessage, Review, WishlistItem, Order, Doctor, Address } from '../types';
import { getChatResponse } from '../services/geminiService';
import { PRODUCTS as INITIAL_PRODUCTS, DOCTORS as INITIAL_DOCTORS } from '../data';

interface AppContextType {
  // Data State (Dynamic)
  products: Product[];
  doctors: Doctor[];
  orders: Order[];
  
  // Admin Actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (id: string, updated: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  placeOrder: (shippingAddress: Address, paymentMethod: string) => void;

  // Auth & User
  user: User | null;
  login: (email: string, name: string) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
  updateUserProfile: (profile: Partial<User>) => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (appt: Appointment) => void;
  updateAppointmentTranscript: (id: string, transcript: string) => void;

  // Chat
  messages: ChatMessage[];
  addMessage: (text: string, role: 'user' | 'model') => Promise<void>;
  isChatTyping: boolean;

  // Reviews & Wishlist
  getProductReviews: (productId: string) => Review[];
  addReview: (review: Review) => void;
  wishlist: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Recommendations
  trackProductView: (product: Product) => void;
  getRecommendations: () => Product[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- DYNAMIC DATA STATE (Initialized from Static Data or LocalStorage) ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('doctors');
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  // --- USER STATE ---
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // --- CART STATE ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- APPOINTMENTS & WISHLIST ---
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('appointments');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [customReviews, setCustomReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('customReviews');
    return saved ? JSON.parse(saved) : [];
  });

  // --- CHAT STATE ---
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatTyping, setIsChatTyping] = useState(false);

  // --- RECOMMENDATION STATE ---
  // Tracks category view counts: { 'Immunity': 5, 'Skincare': 2 }
  const [viewHistory, setViewHistory] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('viewHistory');
    return saved ? JSON.parse(saved) : {};
  });

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => localStorage.setItem('products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('doctors', JSON.stringify(doctors)), [doctors]);
  useEffect(() => localStorage.setItem('orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('appointments', JSON.stringify(appointments)), [appointments]);
  useEffect(() => localStorage.setItem('wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('customReviews', JSON.stringify(customReviews)), [customReviews]);
  useEffect(() => localStorage.setItem('viewHistory', JSON.stringify(viewHistory)), [viewHistory]);

  // Load chat history
  useEffect(() => {
    const userId = user ? user.email : 'guest';
    const savedChat = localStorage.getItem(`chat_${userId}`);
    if (savedChat) {
      const parsed = JSON.parse(savedChat).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(parsed);
    } else {
      setMessages([{
        id: 'welcome',
        role: 'model',
        text: user ? `Namaste ${user.name}! I am Veda. How can I assist you today?` : 'Namaste! I am Veda, your Ayurvedic health assistant. How can I help you heal today?',
        timestamp: new Date(),
        status: 'read'
      }]);
    }
  }, [user]);

  useEffect(() => {
    const userId = user ? user.email : 'guest';
    if (messages.length > 0) {
      localStorage.setItem(`chat_${userId}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  // --- ADMIN ACTIONS ---
  const addProduct = (product: Product) => setProducts(prev => [...prev, product]);
  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  const addDoctor = (doctor: Doctor) => setDoctors(prev => [...prev, doctor]);
  const updateDoctor = (id: string, updated: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
  };
  const deleteDoctor = (id: string) => setDoctors(prev => prev.filter(d => d.id !== id));

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // --- USER & AUTH ACTIONS ---
  const login = (email: string, name: string) => {
    // Simple Admin Check
    const role = email === 'admin@arogyasagar.com' ? 'admin' : 'user';
    const newUser: User = { email, name, role };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const signup = (email: string, name: string) => {
    const newUser: User = { email, name, role: 'user' }; // Always user by default
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    clearCart();
    setMessages([]);
  };

  const updateUserProfile = (profile: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...profile };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // --- CART & ORDER ACTIONS ---
  const addToCart = (product: Product) => {
    if (!user) {
      alert("Please login to add items to cart.");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    // Track interest
    trackProductView(product);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (shippingAddress: Address, paymentMethod: string) => {
    if (!user) return;
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: user.email,
      items: [...cart],
      total: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      date: new Date().toISOString(),
      status: 'Processing',
      shippingAddress,
      paymentMethod
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  // --- RECOMMENDATION ENGINE ---
  const trackProductView = (product: Product) => {
    setViewHistory(prev => ({
      ...prev,
      [product.category]: (prev[product.category] || 0) + 1
    }));
  };

  const getRecommendations = (): Product[] => {
    // 1. Find top categories from history
    const sortedCategories = Object.entries(viewHistory)
      .sort(([, a], [, b]) => b - a)
      .map(([cat]) => cat);

    if (sortedCategories.length === 0) {
      // Fallback: Trending (Random high rated)
      return products.filter(p => p.rating > 4.5).slice(0, 4);
    }

    // 2. Get products from top categories
    const topCategory = sortedCategories[0];
    const recs = products
      .filter(p => p.category === topCategory)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
      
    return recs;
  };

  // --- APPOINTMENTS ---
  const addAppointment = (appt: Appointment) => {
    setAppointments(prev => [...prev, appt]);
  };

  const updateAppointmentTranscript = (id: string, transcript: string) => {
    setAppointments(prev => prev.map(appt => 
      appt.id === id ? { ...appt, transcript, status: 'completed' } : appt
    ));
  };

  // --- WISHLIST ---
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.filter(item => item.id !== product.id);
      return [...prev, { ...product, dateAdded: new Date().toISOString() }];
    });
    trackProductView(product); // Wishlisting counts as interest
  };

  const isInWishlist = (productId: string) => wishlist.some(item => item.id === productId);

  // --- REVIEWS ---
  const addReview = (review: Review) => setCustomReviews(prev => [review, ...prev]);
  const getProductReviews = (productId: string) => {
    const product = products.find(p => p.id === productId);
    const staticReviews = product?.reviewsList || [];
    const dynamicReviews = customReviews.filter(r => r.productId === productId);
    return [...dynamicReviews, ...staticReviews];
  };

  // --- CHAT ---
  const addMessage = async (text: string, role: 'user' | 'model') => {
    if (role === 'user') {
      const userMsg: ChatMessage = { id: Date.now().toString(), role, text, timestamp: new Date(), status: 'sending' };
      setMessages(prev => [...prev, userMsg]);
      setIsChatTyping(true);
      try {
        setTimeout(() => setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'sent' } : m)), 500);
        const responseText = await getChatResponse(text);
        const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: new Date(), status: 'read' };
        setMessages(prev => {
             const updated = prev.map(m => m.id === userMsg.id ? { ...m, status: 'read' as const } : m);
             return [...updated, aiMsg];
        });
      } catch (error) {
        setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'error' } : m));
      } finally {
        setIsChatTyping(false);
      }
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <AppContext.Provider value={{ 
      products, doctors, orders,
      addProduct, updateProduct, deleteProduct,
      addDoctor, updateDoctor, deleteDoctor, updateOrderStatus,
      cart, addToCart, removeFromCart, clearCart, cartTotal, isCartOpen, setIsCartOpen, placeOrder,
      user, login, signup, logout, updateUserProfile,
      appointments, addAppointment, updateAppointmentTranscript,
      messages, addMessage, isChatTyping,
      getProductReviews, addReview,
      wishlist, toggleWishlist, isInWishlist,
      trackProductView, getRecommendations
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
