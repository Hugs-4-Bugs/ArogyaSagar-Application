
import React, { useState } from 'react';
import * as RRD from 'react-router-dom';
import { Leaf, ArrowRight, Mail, CheckCircle } from 'lucide-react';
import { motion as m } from 'framer-motion';

const { Link } = RRD as any;
const motion = m as any;

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate API call and email sending
      setTimeout(() => setIsSent(true), 1500);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-sand-50 relative overflow-hidden">
       {/* Background Elements */}
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
          <h1 className="text-3xl font-serif font-bold text-herbal-900 mb-2">Reset Password</h1>
          <p className="text-gray-500 text-sm">
            Enter your email to receive instructions to reset your password.
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-herbal-500 focus:ring-2 focus:ring-herbal-200 outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-herbal-800 hover:bg-herbal-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-herbal-200 transition-all flex items-center justify-center gap-2 group"
            >
              Send Reset Link <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="text-center mt-4">
               <Link to="/login" className="text-sm text-gray-500 hover:text-herbal-700 font-medium">Back to Login</Link>
            </div>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h3>
            <p className="text-gray-600 mb-8 text-sm">
              We have sent password recovery instructions to <span className="font-bold text-herbal-800">{email}</span>.
            </p>
            
            {/* For Demo purposes, direct link */}
            <Link 
              to="/reset-password"
              className="block w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 rounded-xl shadow-md transition-colors"
            >
              Open Email (Demo: Reset Now)
            </Link>

            <button 
              onClick={() => setIsSent(false)}
              className="mt-6 text-sm text-gray-500 hover:text-herbal-700"
            >
              Didn't receive email? Try again
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
