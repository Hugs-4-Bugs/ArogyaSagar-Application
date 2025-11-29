
import React, { useState } from 'react';
import { DOCTORS } from '../data';
import { Doctor } from '../types';
import { Star, Clock, Video, X, Lock, CheckCircle, Video as VideoIcon, CreditCard, Smartphone, Wallet, Globe } from 'lucide-react';
import { motion as m, AnimatePresence as AP } from 'framer-motion';
import { useApp } from '../context/AppContext';
import * as RRD from 'react-router-dom';

const { Link, useNavigate } = RRD as any;
const motion = m as any;
const AnimatePresence = AP as any;

export const Consultation = () => {
  const { user, addAppointment } = useApp();
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  // Booking Wizard States
  const [bookingStep, setBookingStep] = useState<'date' | 'payment' | 'success' | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');

  // Generate next 3 days
  const getNextDays = () => {
    const days = [];
    for (let i = 1; i <= 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };
  
  const timeSlots = ['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'];

  const handleBookClick = (doctor: Doctor) => {
    if (!user) {
      // alert("You must be logged in to book an appointment.");
      navigate('/login');
      return;
    }
    setSelectedDoctor(doctor);
    setBookingStep('date'); // Directly jump to booking
  };

  const handleViewProfile = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setBookingStep(null); // Show profile view first
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const proceedToPayment = () => {
    if (selectedDate && selectedTime) {
        setBookingStep('payment');
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'upi' && !upiId.includes('@')) {
        alert("Please enter a valid UPI ID");
        return;
    }

    setIsProcessingPayment(true);
    // Simulate Payment Gateway
    setTimeout(() => {
        setIsProcessingPayment(false);
        if (selectedDoctor) {
            // Save Appointment
            addAppointment({
                id: Date.now().toString(),
                doctorName: selectedDoctor.name,
                doctorImage: selectedDoctor.image,
                date: selectedDate,
                time: selectedTime,
                status: 'scheduled'
            });
            setBookingStep('success');
        }
    }, 2000);
  };

  const closeModals = () => {
    setSelectedDoctor(null);
    setBookingStep(null);
    setSelectedDate('');
    setSelectedTime('');
    setPaymentMethod('upi');
    setUpiId('');
  };

  return (
    <div className="min-h-screen bg-sand-50 pt-24 pb-12">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-12">
            <span className="text-gold-600 font-bold uppercase tracking-wider text-xs">ArogyaSagar Clinic</span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-herbal-900 mt-2 mb-4">Book an Expert Vaidya</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Connect with India's top Ayurvedic doctors for personalized treatment plans, diet charts, and lifestyle guidance.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
           {DOCTORS.map((doctor, index) => (
             <motion.div 
               key={doctor.id}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full"
             >
               <div className="p-6 flex flex-col items-center border-b border-gray-50 bg-gradient-to-b from-herbal-50/50 to-transparent">
                 <img 
                   src={doctor.image} 
                   alt={doctor.name} 
                   className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg mb-4" 
                 />
                 <h3 className="text-xl font-serif font-bold text-gray-900 text-center">{doctor.name}</h3>
                 <p className="text-herbal-600 font-medium text-sm text-center">{doctor.specialty}</p>
                 <div className="flex items-center mt-2 text-gold-500 text-sm">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} size={14} fill={i < Math.floor(doctor.rating) ? "currentColor" : "none"} className={i < Math.floor(doctor.rating) ? "" : "text-gray-300"} />
                   ))}
                   <span className="text-gray-400 ml-1">({doctor.experience} yrs exp)</span>
                 </div>
               </div>

               <div className="p-6 flex-1 flex flex-col">
                 <p className="text-gray-600 text-sm mb-6 flex-1 italic line-clamp-3 text-center">"{doctor.bio}"</p>
                 
                 <div className="space-y-3 mb-6">
                   <div className="flex items-center text-sm text-gray-500">
                     <Video size={16} className="mr-3 text-herbal-500" /> Video Consultation
                   </div>
                   <div className="flex items-center text-sm text-gray-500">
                     <Clock size={16} className="mr-3 text-herbal-500" /> 15 Min Session
                   </div>
                 </div>

                 <div className="flex flex-col gap-3 mt-auto">
                   <div className="flex items-center justify-between">
                     <span className="text-xl font-bold text-herbal-800">₹{doctor.price}</span>
                     <button 
                       disabled={!doctor.available}
                       onClick={() => handleBookClick(doctor)}
                       className={`px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${
                         doctor.available 
                           ? 'bg-herbal-700 text-white hover:bg-herbal-800 shadow-lg shadow-herbal-200' 
                           : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                       }`}
                     >
                       Book Now
                     </button>
                   </div>
                   <button 
                    onClick={() => handleViewProfile(doctor)}
                    className="w-full text-center text-herbal-600 text-sm font-medium hover:text-herbal-800 hover:bg-herbal-50 py-2 rounded-lg transition-colors"
                   >
                     View Full Profile
                   </button>
                 </div>
               </div>
             </motion.div>
           ))}
         </div>
       </div>

       {/* Dynamic Booking/Profile Modal */}
       <AnimatePresence>
         {selectedDoctor && (
           <>
             {/* Backdrop */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.6 }}
               exit={{ opacity: 0 }}
               onClick={closeModals}
               className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
             />
             
             {/* Modal Container - Centered Logic */}
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-white w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative pointer-events-auto flex flex-col"
                >
                   
                   {/* CLOSE BUTTON */}
                   <button 
                     onClick={closeModals}
                     className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-colors z-20"
                   >
                     <X size={24} />
                   </button>

                   {/* --- VIEW 1: FULL PROFILE (When no booking step is active) --- */}
                   {!bookingStep && (
                       <>
                       <div className="h-28 md:h-32 bg-herbal-800 shrink-0 relative">
                           <div className="absolute inset-0 bg-herbal-900/20"></div>
                       </div>
                       <div className="px-6 pb-8 flex-1">
                         <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6 gap-4 sm:gap-6 text-center sm:text-left">
                           <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl bg-white shrink-0" />
                           <div className="mb-2 pt-2 sm:pt-0">
                              <h2 className="text-2xl font-serif font-bold text-gray-900">{selectedDoctor.name}</h2>
                              <p className="text-herbal-600 font-medium text-base">{selectedDoctor.specialty}</p>
                           </div>
                         </div>
                         <div className="space-y-6">
                            <div className="bg-sand-50 p-4 rounded-xl border border-sand-100">
                                <h4 className="font-bold text-herbal-900 text-sm uppercase tracking-wide mb-2">About Doctor</h4>
                                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{selectedDoctor.bio}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <span className="block font-bold text-gray-900 text-lg">{selectedDoctor.experience}+ Years</span>
                                    <span className="text-gray-500 text-xs">Experience</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <span className="block font-bold text-gray-900 text-lg">5000+</span>
                                    <span className="text-gray-500 text-xs">Patients Healed</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
                               <button 
                                 onClick={() => {
                                    if(user) {
                                        setBookingStep('date');
                                    } else {
                                        navigate('/login');
                                    }
                                 }}
                                 className="w-full sm:w-auto bg-herbal-800 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-herbal-900 transition-colors shadow-lg"
                               >
                                 Book Appointment (₹{selectedDoctor.price})
                               </button>
                             </div>
                         </div>
                       </div>
                       </>
                   )}

                   {/* --- VIEW 2: STEP 1 - DATE & TIME SELECTION --- */}
                   {bookingStep === 'date' && (
                       <div className="p-6 md:p-8 flex-1 flex flex-col">
                           <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 mt-4 sm:mt-0 text-center sm:text-left">Select Date & Time</h2>
                           
                           {/* Date Selection */}
                           <div className="mb-6">
                               <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">AVAILABLE DATES</p>
                               <div className="grid grid-cols-3 gap-3">
                                   {getNextDays().map((date, i) => {
                                       const isSelected = selectedDate === date.toISOString().split('T')[0];
                                       return (
                                           <button 
                                               key={i}
                                               onClick={() => handleDateSelect(date)}
                                               className={`p-3 rounded-xl border text-center transition-all ${isSelected ? 'border-herbal-600 bg-herbal-50 text-herbal-900 ring-2 ring-herbal-200' : 'border-gray-200 hover:border-herbal-300'}`}
                                           >
                                               <span className="block text-[10px] text-gray-500 uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                               <span className="block text-lg font-bold">{date.getDate()}</span>
                                           </button>
                                       )
                                   })}
                               </div>
                           </div>

                           {/* Time Selection */}
                           <div className="mb-8">
                               <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">AVAILABLE SLOTS</p>
                               <div className="grid grid-cols-3 gap-3">
                                   {timeSlots.map((time) => (
                                       <button
                                           key={time}
                                           onClick={() => setSelectedTime(time)}
                                           disabled={!selectedDate}
                                           className={`py-2 px-1 rounded-lg text-xs md:text-sm font-medium border transition-all ${selectedTime === time ? 'bg-gold-500 text-white border-gold-500' : 'bg-white border-gray-200 text-gray-700 hover:border-gold-300 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                                       >
                                           {time}
                                       </button>
                                   ))}
                               </div>
                           </div>

                           <button 
                               disabled={!selectedDate || !selectedTime}
                               onClick={proceedToPayment}
                               className="w-full bg-herbal-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-auto"
                           >
                               Continue to Payment
                           </button>
                       </div>
                   )}

                   {/* --- VIEW 3: STEP 2 - PAYMENT --- */}
                   {bookingStep === 'payment' && (
                       <div className="p-6 md:p-8 flex-1 flex flex-col">
                           <div className="flex items-center justify-between mb-6 mt-4 sm:mt-0">
                               <h2 className="text-2xl font-serif font-bold text-gray-900">Secure Payment</h2>
                               <div className="flex items-center text-green-600 text-[10px] font-bold bg-green-50 px-2 py-1 rounded">
                                   <Lock size={10} className="mr-1" /> SSL Encrypted
                               </div>
                           </div>

                           <div className="bg-sand-50 p-4 rounded-xl mb-6 flex justify-between items-center border border-sand-200">
                               <div>
                                   <p className="text-xs text-gray-500 uppercase tracking-wide">Consultation Fee</p>
                                   <p className="font-bold text-herbal-900 text-sm">Dr. {selectedDoctor.name}</p>
                               </div>
                               <span className="text-xl font-bold text-herbal-800">₹{selectedDoctor.price}</span>
                           </div>

                           {/* Payment Methods Tabs */}
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
                                       className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                                           paymentMethod === method.id 
                                           ? 'bg-herbal-700 text-white border-herbal-700' 
                                           : 'bg-white text-gray-600 border-gray-200 hover:border-herbal-300'
                                       }`}
                                   >
                                       <method.icon size={16} /> {method.label}
                                   </button>
                               ))}
                           </div>

                           {/* Dynamic Form Body */}
                           <div className="mb-8 min-h-[150px]">
                               {paymentMethod === 'upi' && (
                                   <div className="space-y-4 animate-in fade-in duration-300">
                                       <p className="text-xs text-gray-500">Pay using Google Pay, PhonePe, Paytm, or BHIM.</p>
                                       <div>
                                           <label className="block text-xs font-bold text-gray-500 mb-1">ENTER UPI ID</label>
                                           <input 
                                             type="text" 
                                             placeholder="username@okaxis" 
                                             value={upiId}
                                             onChange={(e) => setUpiId(e.target.value)}
                                             className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-herbal-500" 
                                           />
                                       </div>
                                       <div className="flex gap-3">
                                           {['GPay', 'PhonePe', 'Paytm'].map(app => (
                                               <div key={app} className="flex-1 bg-gray-50 border border-gray-100 rounded-lg p-2 flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-100">
                                                   {app}
                                               </div>
                                           ))}
                                       </div>
                                   </div>
                               )}

                               {paymentMethod === 'wallet' && (
                                   <div className="space-y-3 animate-in fade-in duration-300">
                                       <p className="text-xs text-gray-500">Select your preferred wallet.</p>
                                       {['Paytm Wallet', 'Amazon Pay', 'Freecharge', 'MobiKwik'].map(wallet => (
                                           <label key={wallet} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-herbal-500 hover:bg-herbal-50 transition-all">
                                               <span className="flex items-center gap-3 font-medium text-gray-700">
                                                   <Wallet size={18} className="text-herbal-600" /> {wallet}
                                               </span>
                                               <input type="radio" name="wallet" className="w-4 h-4 text-herbal-600 accent-herbal-600" />
                                           </label>
                                       ))}
                                   </div>
                               )}

                               {paymentMethod === 'card' && (
                                   <div className="space-y-4 animate-in fade-in duration-300">
                                       <div>
                                           <label className="block text-xs font-bold text-gray-500 mb-1">CARD NUMBER</label>
                                           <div className="relative">
                                               <CreditCard className="absolute left-3 top-3 text-gray-400" size={20} />
                                               <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-herbal-500" />
                                           </div>
                                       </div>
                                       <div className="grid grid-cols-2 gap-4">
                                           <div>
                                               <label className="block text-xs font-bold text-gray-500 mb-1">EXPIRY</label>
                                               <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-herbal-500" />
                                           </div>
                                           <div>
                                               <label className="block text-xs font-bold text-gray-500 mb-1">CVC</label>
                                               <input type="text" placeholder="123" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-herbal-500" />
                                           </div>
                                       </div>
                                   </div>
                               )}

                               {paymentMethod === 'netbanking' && (
                                   <div className="space-y-4 animate-in fade-in duration-300">
                                       <p className="text-xs text-gray-500">Select your bank for secure login.</p>
                                       <div className="grid grid-cols-2 gap-3">
                                           {['HDFC', 'SBI', 'ICICI', 'Axis'].map(bank => (
                                               <button key={bank} className="p-3 border border-gray-200 rounded-xl text-center font-bold text-gray-700 hover:border-herbal-500 hover:bg-herbal-50 hover:text-herbal-800 transition-all">
                                                   {bank}
                                               </button>
                                           ))}
                                       </div>
                                       <select className="w-full p-3 border border-gray-200 rounded-xl text-gray-600 bg-white focus:outline-none">
                                           <option>Other Banks</option>
                                           <option>Kotak Mahindra</option>
                                           <option>Punjab National Bank</option>
                                           <option>Bank of Baroda</option>
                                       </select>
                                   </div>
                               )}
                           </div>

                           <button 
                               onClick={handlePayment}
                               disabled={isProcessingPayment}
                               className="w-full bg-herbal-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-herbal-900 transition-colors mt-auto shadow-lg shadow-herbal-200"
                           >
                               {isProcessingPayment ? 'Processing Secure Payment...' : `Pay ₹${selectedDoctor.price}`}
                           </button>
                       </div>
                   )}

                   {/* --- VIEW 4: SUCCESS --- */}
                   {bookingStep === 'success' && (
                       <div className="p-8 text-center h-full flex flex-col justify-center items-center">
                           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                               <CheckCircle className="text-green-600 w-10 h-10" />
                           </div>
                           <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                           <p className="text-gray-600 mb-6 text-sm">
                               Your appointment with <span className="font-bold text-herbal-800">{selectedDoctor.name}</span> is scheduled for <br/>
                               <span className="font-bold text-black text-lg mt-1 block">{selectedDate} at {selectedTime}</span>
                           </p>
                           
                           <div className="space-y-3 w-full">
                               <Link 
                                   to="/video-call"
                                   className="block w-full bg-herbal-700 text-white py-3 rounded-xl font-bold hover:bg-herbal-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-herbal-200"
                               >
                                   <VideoIcon size={18} /> Join Video Room
                               </Link>
                               <button 
                                   onClick={closeModals}
                                   className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                               >
                                   Close
                               </button>
                           </div>
                       </div>
                   )}

                </motion.div>
             </div>
           </>
         )}
       </AnimatePresence>
    </div>
  );
};
