
import React, { useState, useRef, useEffect } from 'react';
import { motion as m, AnimatePresence as AP } from 'framer-motion';
import { Camera, X, Scan, CheckCircle, Sparkles, ShoppingCart } from 'lucide-react';
import { PRODUCTS } from '../data';
import * as RRD from 'react-router-dom';

const { Link } = RRD as any;
const motion = m as any;
const AnimatePresence = AP as any;

export const HealthScan = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState<'permission' | 'scanning' | 'analyzing' | 'result'>('permission');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [diagnosis, setDiagnosis] = useState<any>(null);

  // Mock Diagnosis Logic
  const generateDiagnosis = () => {
    const scenarios = [
      {
        dosha: 'Vata Imbalance',
        issue: 'Dry Skin & Joint Pain',
        desc: 'Our AI detects signs of dryness and irregularity. You may be suffering from joint stiffness or dry skin.',
        products: ['3', '6'] // JointCare, Shankhpushpi
      },
      {
        dosha: 'Pitta Imbalance',
        issue: 'Acidity & Heat',
        desc: 'We detected signs of heat and redness. You might be experiencing acidity, hair fall, or stress.',
        products: ['2', '4'] // Triphala, GlowSkin
      },
      {
        dosha: 'Kapha Imbalance',
        issue: 'Lethargy & Weight',
        desc: 'The scan shows signs of heaviness. You may feel low energy, slow digestion, or congestion.',
        products: ['1', '5'] // Ashwagandha, DiabaControl
      }
    ];
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  };

  // Effect to attach stream to video element when it becomes available
  useEffect(() => {
    if (step === 'scanning' && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [step, stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setStep('scanning'); // This triggers the render of the <video> element
      
      // Auto progress
      setTimeout(() => setStep('analyzing'), 3000);
      setTimeout(() => {
        setDiagnosis(generateDiagnosis());
        setStep('result');
        stopCamera();
      }, 6000);
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Camera access denied or not available. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
    setTimeout(() => setStep('permission'), 300); // Reset after animation
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-gray-900 rounded-3xl overflow-hidden shadow-2xl relative border border-gray-700">
          
          <button onClick={handleClose} className="absolute top-4 right-4 text-white/70 hover:text-white z-20 bg-black/40 rounded-full p-2">
            <X size={24} />
          </button>

          {/* STEP 1: PERMISSION */}
          {step === 'permission' && (
            <div className="p-8 text-center text-white">
              <div className="w-20 h-20 bg-herbal-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Scan size={40} />
              </div>
              <h2 className="text-2xl font-serif font-bold mb-4">AI Health Scan</h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Let our AI scan your face to detect Dosha imbalances using ancient 
                <span className="text-gold-400 font-bold"> Mukh Parikshan</span> techniques.
              </p>
              <button 
                onClick={startCamera}
                className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Camera size={20} /> Start Scan
              </button>
            </div>
          )}

          {/* STEP 2: SCANNING */}
          {step === 'scanning' && (
            <div className="relative h-[500px] bg-black">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-64 h-64 border-2 border-green-500/50 rounded-full relative">
                    <motion.div 
                      className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    />
                 </div>
              </div>
              <div className="absolute bottom-10 left-0 right-0 text-center">
                <p className="text-green-400 font-mono text-sm animate-pulse">SCANNING FACE TOPOGRAPHY...</p>
              </div>
            </div>
          )}

          {/* STEP 3: ANALYZING */}
          {step === 'analyzing' && (
            <div className="h-[500px] bg-gray-900 flex flex-col items-center justify-center text-center p-8">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full mb-6"
               />
               <h3 className="text-xl font-bold text-white mb-2">Analyzing Results...</h3>
               <p className="text-gray-400 text-sm">Matching with Ayurvedic Database...</p>
               <div className="mt-8 space-y-2 w-full max-w-xs">
                 <div className="flex justify-between text-xs text-gray-500"><span>Skin Texture</span><span className="text-green-500">Done</span></div>
                 <div className="flex justify-between text-xs text-gray-500"><span>Eye Clarity</span><span className="text-green-500">Done</span></div>
                 <div className="flex justify-between text-xs text-gray-500"><span>Tongue Analysis</span><span className="text-gold-500">Processing...</span></div>
               </div>
            </div>
          )}

          {/* STEP 4: RESULT */}
          {step === 'result' && diagnosis && (
            <div className="bg-white h-[600px] overflow-y-auto">
              <div className="bg-red-500 p-6 text-white text-center rounded-b-3xl relative">
                 <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2 border border-white/30">
                    PROBLEM DETECTED
                 </div>
                 <h2 className="text-3xl font-serif font-bold mb-1">{diagnosis.dosha}</h2>
                 <p className="text-red-100 font-medium">{diagnosis.issue}</p>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                   <p className="text-gray-700 leading-relaxed text-sm">"{diagnosis.desc}"</p>
                </div>

                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                   <Sparkles size={16} className="text-gold-500" /> Recommended Cure
                </h3>

                <div className="space-y-4">
                  {diagnosis.products.map((id: string) => {
                    const product = PRODUCTS.find(p => p.id === id);
                    if (!product) return null;
                    return (
                      <Link 
                        key={id} 
                        to={`/product/${id}`} 
                        onClick={onClose}
                        className="flex gap-4 p-3 rounded-xl border border-gray-100 shadow-sm hover:border-herbal-500 transition-all items-center"
                      >
                         <img src={product.image} className="w-16 h-16 object-cover rounded-lg bg-gray-100" alt={product.name} />
                         <div className="flex-1">
                            <h4 className="font-bold text-gray-900 leading-tight">{product.name}</h4>
                            <p className="text-xs text-green-600 font-bold mt-1">AI Match: 98%</p>
                         </div>
                         <div className="bg-herbal-100 p-2 rounded-full text-herbal-700">
                            <ShoppingCart size={18} />
                         </div>
                      </Link>
                    )
                  })}
                </div>

                <button 
                   onClick={handleClose}
                   className="w-full mt-6 bg-gray-900 text-white py-3 rounded-xl font-bold"
                >
                   Close Report
                </button>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
