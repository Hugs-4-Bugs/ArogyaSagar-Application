
import React, { useState } from 'react';
import * as RRD from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Leaf, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion as m } from 'framer-motion';

const { Link, useNavigate } = RRD as any;
const motion = m as any;

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password.length >= 8) {
      // Logic for name generation
      const generatedName = email.split('@')[0];
      const formattedName = generatedName.charAt(0).toUpperCase() + generatedName.slice(1);
      
      login(email, formattedName);
      
      // Role Based Redirect
      if (email === 'admin@arogyasagar.com') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } else {
        alert("Please ensure password is at least 8 characters.");
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-sand-50 relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-herbal-100/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-100/50 rounded-full blur-3xl"></div>
       </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-md relative z-10 border border-white/50 backdrop-blur-sm"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-herbal-700 rounded-full flex items-center justify-center text-gold-500 mx-auto mb-4 shadow-lg">
            <Leaf size={24} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-herbal-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Sign in to access your wellness journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-herbal-500 focus:ring-2 focus:ring-herbal-200 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-herbal-500 focus:ring-2 focus:ring-herbal-200 outline-none transition-all"
                placeholder="••••••••"
              />
              <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-herbal-800 hover:bg-herbal-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-herbal-200 transition-all flex items-center justify-center gap-2 group transform active:scale-95"
          >
            Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
