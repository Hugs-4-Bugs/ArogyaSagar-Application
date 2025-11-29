
import React, { useState } from 'react';
import * as RRD from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Leaf, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion as m, AnimatePresence as AP } from 'framer-motion';

const { Link, useNavigate } = RRD as any;
const motion = m as any;
const AnimatePresence = AP as any;

export const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useApp();
  
  // Form State
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Strict Regex for Password: Min 8, 1 Upper, 1 Lower, 1 Num, 1 Special
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  // Email Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    let newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format (e.g., user@domain.com)";
    }
    
    if (!formData.password) {
        newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
        newErrors.password = "Password must be min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.";
    }

    if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate sending OTP to email
      console.log(`Sending OTP to ${formData.email}`);
      setStep('otp'); // Move to OTP step
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    // Mock OTP verification (accept '1234' for demo)
    if (enteredOtp.length === 4) {
      // In a real app, verify with backend here
      if (enteredOtp === '1234') {
        signup(formData.email, formData.name);
        navigate('/');
      } else {
        setErrors({ otp: "Invalid OTP. For demo use 1234." });
      }
    } else {
      setErrors({ otp: "Please enter a 4-digit OTP." });
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-sand-50 relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-herbal-100/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-100/50 rounded-full blur-3xl"></div>
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
          <h1 className="text-3xl font-serif font-bold text-herbal-900 mb-2">
            {step === 'details' ? 'Join ArogyaSagar' : 'Verify Email'}
          </h1>
          <p className="text-gray-500 text-sm">
            {step === 'details' ? 'Start your journey to holistic health.' : `Enter the code sent to ${formData.email}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
        {step === 'details' ? (
          <motion.form 
            key="details-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleDetailsSubmit} 
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-herbal-500 focus:outline-none"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input 
                type="text" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-herbal-500 focus:outline-none"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-herbal-500 focus:outline-none"
                  placeholder="Min 8 chars, 1 Upper, 1 Special"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-herbal-500 focus:outline-none"
                  placeholder="Repeat Password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button 
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 rounded-xl shadow-lg mt-4 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              Verify Email & Continue <ArrowRight size={18} />
            </button>
          </motion.form>
        ) : (
          <motion.form 
            key="otp-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleVerifyOtp}
            className="space-y-6"
          >
            <div className="flex justify-center gap-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 focus:border-herbal-500 focus:outline-none"
                />
              ))}
            </div>
            {errors.otp && <p className="text-red-500 text-center text-sm">{errors.otp}</p>}
            
            <button 
              type="submit"
              className="w-full bg-herbal-700 hover:bg-herbal-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              Verify & Create Account <CheckCircle size={18} />
            </button>

            <button 
              type="button"
              onClick={() => setStep('details')}
              className="w-full text-center text-gray-500 hover:text-herbal-700 text-sm"
            >
              Back to Details
            </button>
          </motion.form>
        )}
        </AnimatePresence>

        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-herbal-700 font-bold hover:underline">Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
};
