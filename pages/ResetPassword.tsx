
import React, { useState } from 'react';
import * as RRD from 'react-router-dom';
import { Leaf, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion as m } from 'framer-motion';

const { Link, useNavigate } = RRD as any;
const motion = m as any;

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
    }
    
    if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
    }

    // Simulate API call
    setTimeout(() => setIsSuccess(true), 1500);
  };

  if (isSuccess) {
      return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-sand-50">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 rounded-3xl shadow-xl w-full max-w-md text-center border border-white/50"
            >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Password Reset Successful</h2>
                <p className="text-gray-600 mb-8">
                    Your password has been updated securely. You can now login with your new credentials.
                </p>
                <Link 
                    to="/login"
                    className="block w-full bg-herbal-800 text-white font-bold py-3.5 rounded-xl hover:bg-herbal-900 transition-colors shadow-lg"
                >
                    Back to Login
                </Link>
            </motion.div>
        </div>
      );
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-sand-50 relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-100/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-herbal-100/50 rounded-full blur-3xl"></div>
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
          <h1 className="text-3xl font-serif font-bold text-herbal-900 mb-2">New Password</h1>
          <p className="text-gray-500 text-sm">Create a strong password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
            <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input 
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-herbal-500 focus:ring-2 focus:ring-herbal-200 outline-none transition-all"
                placeholder="Min 8 characters"
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input 
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-herbal-500 focus:ring-2 focus:ring-herbal-200 outline-none transition-all"
                placeholder="Repeat password"
                />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-herbal-800 hover:bg-herbal-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-herbal-200 transition-all"
          >
            Reset Password
          </button>
        </form>
      </motion.div>
    </div>
  );
};
