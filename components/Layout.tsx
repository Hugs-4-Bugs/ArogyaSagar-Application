
import React, { useState } from 'react';
import * as RRD from 'react-router-dom';
import { ShoppingBag, Menu, X, User as UserIcon, Search, Leaf, LogOut, Heart, Smartphone, Wallet, CreditCard, Globe, Lock, MapPin, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion as m, AnimatePresence as AP } from 'framer-motion';

const { Link, useLocation, useNavigate } = RRD as any;
const motion = m as any;
const AnimatePresence = AP as any;

export const Navbar = () => {
  const { cart, setIsCartOpen, user, logout, wishlist } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Consult', path: '/consult' },
    { name: 'Wellness', path: '/wellness' },
    { name: 'Therapies', path: '/therapies' },
  ];

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleProfileClick = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/profile');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-herbal-50/80 backdrop-blur-md border-b border-herbal-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-herbal-700 rounded-full flex items-center justify-center text-gold-500 shadow-lg group-hover:scale-110 transition-transform">
              <Leaf size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-herbal-900 tracking-tight">ArogyaSagar</h1>
              <p className="text-[10px] text-gold-600 tracking-widest uppercase font-semibold">Premium Ayurveda</p>
            </div>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link: any) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 ${location.pathname === link.path ? 'text-herbal-700 font-bold' : 'text-gray-600 hover:text-herbal-600'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="text-gray-600 hover:text-herbal-700 transition-colors p-2 hidden sm:block">
              <Search size={20} />
            </button>
            
            <Link to="/wishlist" className="relative text-gray-600 hover:text-red-500 transition-colors p-2">
               <Heart size={20} className={wishlist.length > 0 ? "fill-red-500 text-red-500" : ""} />
            </Link>

            {user ? (
              <div className="relative group hidden sm:block">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-herbal-800 transition-colors">
                  <div className="w-8 h-8 bg-herbal-100 rounded-full flex items-center justify-center text-herbal-700 border border-herbal-200">
                    <UserIcon size={16} />
                  </div>
                  <span className="text-sm font-medium hidden lg:inline">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                   <div className="py-2">
                     <button onClick={handleProfileClick} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        {user.role === 'admin' ? 'Admin Dashboard' : 'My Profile'}
                     </button>
                     <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                       <LogOut size={14} className="mr-2" /> Logout
                     </button>
                   </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center px-4 py-2 bg-herbal-700 text-white rounded-full text-sm font-bold hover:bg-herbal-800 transition-colors shadow-md">
                Login
              </Link>
            )}

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative text-gray-600 hover:text-herbal-700 transition-colors p-2"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-gold-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {totalItems}
                </span>
              )}
            </button>
            
            <button 
              className="md:hidden text-gray-800 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-herbal-100 overflow-hidden shadow-lg"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link: any) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-herbal-700 hover:bg-herbal-50 rounded-lg active:bg-herbal-100"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 mt-2">
                 {user ? (
                   <>
                    <button onClick={() => { handleProfileClick(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-herbal-700 font-bold bg-herbal-50 rounded-lg mb-2">
                        {user.role === 'admin' ? 'Admin Dashboard' : 'My Profile'}
                    </button>
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); navigate('/'); }} className="block w-full text-left px-4 py-3 text-red-600 font-medium">
                        Logout ({user.name})
                    </button>
                   </>
                 ) : (
                   <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-herbal-700 font-bold bg-herbal-50 rounded-lg text-center">
                     Login / Signup
                   </Link>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-herbal-900 text-sand-50 pt-16 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-sand-100 rounded-full flex items-center justify-center text-herbal-900">
                <Leaf size={18} fill="currentColor" />
              </div>
              <span className="text-2xl font-serif font-bold">ArogyaSagar</span>
            </div>
            <p className="text-herbal-200 text-sm leading-relaxed">
              Bringing ancient Vedic wisdom to modern lifestyle. Pure, authentic, and scientifically verified Ayurvedic solutions.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold mb-4 text-gold-400">Shop</h3>
            <ul className="space-y-2 text-sm text-herbal-100">
              <li><Link to="/shop" className="hover:text-gold-400 transition">Medicines</Link></li>
              <li><Link to="/shop" className="hover:text-gold-400 transition">Skincare</Link></li>
              <li><Link to="/shop" className="hover:text-gold-400 transition">Immunity</Link></li>
              <li><Link to="/shop" className="hover:text-gold-400 transition">Hair Care</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold mb-4 text-gold-400">Services</h3>
            <ul className="space-y-2 text-sm text-herbal-100">
              <li><Link to="/consult" className="hover:text-gold-400 transition">Doctor Consultation</Link></li>
              <li><Link to="/therapies" className="hover:text-gold-400 transition">Panchakarma</Link></li>
              <li><Link to="/wellness" className="hover:text-gold-400 transition">Wellness Tips</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold mb-4 text-gold-400">Contact</h3>
            <ul className="space-y-2 text-sm text-herbal-100">
              <li>support@arogyasagar.com</li>
              <li>+91 98765 43210</li>
              <li>123 Herbal Park, Rishikesh, India</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-herbal-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-herbal-300">
          <p className="text-center md:text-left">&copy; 2024 ArogyaSagar Wellness Pvt Ltd. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const CartSidebar = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, cartTotal, clearCart, user, placeOrder } = useApp();
  const navigate = useNavigate();
  
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  
  const [address, setAddress] = useState({
      fullName: user?.name || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      pincode: user?.address?.pincode || '',
      phone: user?.phone || ''
  });

  const handleCheckoutClick = () => {
    if (!user) {
      setIsCartOpen(false);
      navigate('/login');
      return;
    }
    setStep('address');
    setShowCheckoutModal(true);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!address.fullName || !address.street || !address.city || !address.pincode || !address.phone) {
          alert("All address fields are required.");
          return;
      }
      setStep('payment');
  };

  const handleFinalPayment = () => {
    if (paymentMethod === 'upi' && !upiId.includes('@')) {
        alert("Please enter a valid UPI ID");
        return;
    }
    setIsProcessing(true);
    setTimeout(() => {
        setIsProcessing(false);
        // Call global placeOrder function
        placeOrder(
            { street: address.street, city: address.city, pincode: address.pincode, state: '', country: 'India' },
            paymentMethod
        );
        setShowCheckoutModal(false);
        setIsCartOpen(false);
        alert(`Order Placed Successfully!\nTrack status in your profile.`);
        setStep('address');
        navigate('/profile');
    }, 2000);
  };

  const closeCheckout = () => {
      setShowCheckoutModal(false);
      setStep('address');
  };

  return (
    <>
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-herbal-50">
              <h2 className="text-xl font-serif font-bold text-herbal-900">Your Basket</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-red-500 p-2">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Your basket is empty.</p>
                  <button onClick={() => setIsCartOpen(false)} className="mt-4 text-herbal-600 font-medium hover:underline">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md bg-gray-50" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-herbal-700 mt-1">₹{item.price * item.quantity}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 self-start p-2"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-sand-50 pb-8 sm:pb-6">
                <div className="flex justify-between mb-4 text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
                <button 
                  onClick={handleCheckoutClick}
                  className="w-full bg-herbal-700 hover:bg-herbal-800 text-white py-4 rounded-xl font-medium transition-all shadow-lg shadow-herbal-200 active:scale-95"
                >
                  {user ? 'Checkout Securely' : 'Login to Checkout'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Checkout Flow Modal */}
    <AnimatePresence>
        {showCheckoutModal && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    onClick={closeCheckout}
                    className="absolute inset-0 bg-black backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
                >
                    <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                        <h2 className="text-xl font-serif font-bold text-gray-900">
                            {step === 'address' ? 'Shipping Details' : 'Secure Payment'}
                        </h2>
                        <button onClick={closeCheckout} className="p-2 hover:bg-gray-200 rounded-full text-gray-500"><X size={20}/></button>
                    </div>

                    <div className="p-6 overflow-y-auto">
                        
                        {/* STEP 1: ADDRESS */}
                        {step === 'address' && (
                            <form onSubmit={handleAddressSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">FULL NAME *</label>
                                    <input type="text" required value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-herbal-500" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">STREET ADDRESS *</label>
                                    <input type="text" required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-herbal-500" placeholder="123 Herbal Street" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">CITY *</label>
                                        <input type="text" required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-herbal-500" placeholder="Mumbai" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">PINCODE *</label>
                                        <input type="text" required value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-herbal-500" placeholder="400001" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">PHONE NUMBER *</label>
                                    <input type="tel" required value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-herbal-500" placeholder="98765 43210" />
                                </div>

                                <button type="submit" className="w-full bg-herbal-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-herbal-800 transition-colors mt-4">
                                    Proceed to Payment <Truck size={18} />
                                </button>
                            </form>
                        )}

                        {/* STEP 2: PAYMENT */}
                        {step === 'payment' && (
                            <>
                                <div className="bg-sand-50 p-4 rounded-xl mb-6 flex justify-between items-center border border-sand-200">
                                    <span className="text-gray-600 font-medium text-sm">Shipping to: <br/><span className="text-gray-900 font-bold">{address.city}</span></span>
                                    <span className="text-xl font-bold text-herbal-800">₹{cartTotal}</span>
                                </div>

                                {/* Payment Tabs */}
                                <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
                                    {[
                                        { id: 'upi', label: 'UPI', icon: Smartphone },
                                        { id: 'wallet', label: 'Wallet', icon: Wallet },
                                        { id: 'card', label: 'Card', icon: CreditCard },
                                        { id: 'netbanking', label: 'NetBanking', icon: Globe }
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id as any)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-medium whitespace-nowrap transition-all ${
                                                paymentMethod === method.id 
                                                ? 'bg-herbal-700 text-white border-herbal-700' 
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-herbal-300'
                                            }`}
                                        >
                                            <method.icon size={14} /> {method.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="mb-8 min-h-[120px]">
                                    {paymentMethod === 'upi' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1">ENTER UPI ID</label>
                                                <input type="text" placeholder="username@okaxis" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-xs text-center text-gray-400">Payment details simulated for demo</p>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => setStep('address')} className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200">Back</button>
                                    <button onClick={handleFinalPayment} disabled={isProcessing} className="flex-[2] bg-herbal-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-herbal-900 shadow-lg">
                                        {isProcessing ? 'Processing...' : `Pay Securely ₹${cartTotal}`}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
    </>
  );
}
