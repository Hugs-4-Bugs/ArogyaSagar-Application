
import React, { useEffect, useRef, useState } from 'react';
import { motion as m, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle, Play, Heart, Utensils, Sparkles, Scan, Smartphone } from 'lucide-react';
import * as RRD from 'react-router-dom';
import { PRODUCTS, DOCTORS, WELLNESS_TIPS, RECIPES, CONCERNS } from '../data';
import { ProductCard } from '../components/ProductCard';
import { DoshaQuiz } from '../components/DoshaQuiz';
import { HealthScan } from '../components/HealthScan';

const { Link } = RRD as any;
const motion = m as any;

gsap.registerPlugin(ScrollTrigger);

export const Home = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showScan, setShowScan] = useState(false);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  useEffect(() => {
    // GSAP Hero Animation
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current, 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.5 }
      );
    });
    
    return () => ctx.revert();
  }, []);

  // Chakra Data
  const chakras = [
    { color: '#a855f7', glow: 'shadow-[0_0_50px_rgba(168,85,247,0.8)]', size: 'w-10 h-10', name: 'Crown' },
    { color: '#6366f1', glow: 'shadow-[0_0_40px_rgba(99,102,241,0.8)]', size: 'w-8 h-8', name: 'Third Eye' },
    { color: '#3b82f6', glow: 'shadow-[0_0_35px_rgba(59,130,246,0.8)]', size: 'w-7 h-7', name: 'Throat' },
    { color: '#22c55e', glow: 'shadow-[0_0_45px_rgba(34,197,94,0.8)]', size: 'w-12 h-12', name: 'Heart' },
    { color: '#eab308', glow: 'shadow-[0_0_35px_rgba(234,179,8,0.8)]', size: 'w-9 h-9', name: 'Solar Plexus' },
    { color: '#f97316', glow: 'shadow-[0_0_35px_rgba(249,115,22,0.8)]', size: 'w-8 h-8', name: 'Sacral' },
    { color: '#ef4444', glow: 'shadow-[0_0_35px_rgba(239,68,68,0.8)]', size: 'w-8 h-8', name: 'Root' },
  ];

  return (
    <div className="overflow-hidden bg-sand-50">
      <DoshaQuiz isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
      <HealthScan isOpen={showScan} onClose={() => setShowScan(false)} />

      {/* --- CINEMATIC HERO SECTION --- */}
      <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#051c12]">
        
        {/* Dynamic Background - Meditating Sage */}
        <div className="absolute inset-0 z-0">
           {/* Base Layer - Deep Forest/Cosmic */}
           <div className="absolute inset-0 bg-gradient-to-b from-[#051c12] via-[#0f2e1f] to-[#1a4031] opacity-90"></div>
           
           {/* Meditating Silhouette Image */}
           <motion.div 
             style={{ y: y1 }}
             className="absolute inset-0 flex items-end justify-center pb-0"
           >
              <img 
                src="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=2072&auto=format&fit=crop" 
                alt="Meditating Yogi"
                className="h-[85vh] md:h-[95vh] w-auto object-cover opacity-30 mix-blend-overlay mask-image-gradient"
                style={{ maskImage: 'linear-gradient(to top, black 50%, transparent 100%)' }}
              />
           </motion.div>

           {/* Animated Chakras Overlay */}
           <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="relative h-[60vh] md:h-[70vh] flex flex-col items-center justify-between py-10 mt-20 md:mt-32">
                 {chakras.map((chakra, idx) => (
                    <motion.div 
                      key={idx}
                      className={`rounded-full ${chakra.size} bg-white mix-blend-screen relative`}
                      style={{ backgroundColor: chakra.color }}
                      animate={{ 
                        scale: [1, 1.2, 1], 
                        opacity: [0.6, 1, 0.6],
                        boxShadow: [
                          `0 0 10px ${chakra.color}`, 
                          `0 0 40px ${chakra.color}`, 
                          `0 0 10px ${chakra.color}`
                        ]
                      }}
                      transition={{ 
                        duration: 2 + (idx * 0.3), // Staggered pulsing speed
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: idx * 0.2
                      }}
                    >
                       <div className={`absolute inset-0 rounded-full blur-xl opacity-50 ${chakra.glow}`}></div>
                    </motion.div>
                 ))}
                 
                 {/* Energy Flow Line */}
                 <div className="absolute top-4 bottom-4 w-[1px] bg-gradient-to-b from-white/0 via-white/20 to-white/0 -z-10"></div>
              </div>
           </div>

           {/* Floating Prana Particles */}
           {[...Array(20)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-1 h-1 md:w-2 md:h-2 bg-gold-400 rounded-full blur-[1px] opacity-40"
               initial={{ 
                 x: Math.random() * window.innerWidth, 
                 y: Math.random() * window.innerHeight 
               }}
               animate={{ 
                 y: [null, Math.random() * -100],
                 opacity: [0, 0.8, 0]
               }}
               transition={{ 
                 duration: 3 + Math.random() * 5, 
                 repeat: Infinity, 
                 ease: "linear",
                 delay: Math.random() * 2
               }}
             />
           ))}
        </div>

        {/* Foreground Content */}
        <div ref={textRef} className="relative z-20 text-center px-4 max-w-5xl mx-auto text-white mt-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-4 inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 shadow-2xl"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]"></span>
            <span className="text-xs md:text-sm font-medium tracking-widest uppercase text-gold-300">Awaken Your Inner Energy</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold mb-8 leading-tight drop-shadow-2xl tracking-tight">
            Ancient Wisdom <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 italic">Reimagined</span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed px-2 text-shadow-sm">
            Discover the balance of body, mind, and soul through authentic Ayurveda. 
            Align your Doshas with premium formulations and expert guidance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full px-8 sm:px-0">
            <Link to="/consult" className="group bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white px-10 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(234,179,8,0.4)] w-full sm:w-auto">
              Book Consultation <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
            
            <button 
              onClick={() => setShowQuiz(true)}
              className="group bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-3 w-full sm:w-auto hover:border-gold-400/50"
            >
               <Sparkles size={20} className="text-gold-400 group-hover:rotate-12 transition-transform" /> Discover Your Dosha
            </button>
          </div>
        </div>
        
        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#051c12] to-transparent z-10 pointer-events-none"></div>
      </div>

      {/* --- AI HEALTH SCAN BANNER --- */}
      <section className="bg-herbal-900 py-6 relative overflow-hidden border-b-4 border-gold-500">
         <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-white gap-4 text-center sm:text-left relative z-10">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center animate-pulse flex-shrink-0 border-2 border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.6)]">
                  <Scan size={24} />
               </div>
               <div>
                  <h3 className="font-bold text-lg leading-tight">AI Health Scan</h3>
                  <p className="text-xs text-gray-300">Face scan for instant Dosha diagnosis.</p>
               </div>
            </div>
            <button 
               onClick={() => setShowScan(true)}
               className="bg-white text-herbal-900 px-8 py-3 w-full sm:w-auto rounded-full font-bold text-sm shadow-lg hover:bg-gray-100 transition-colors"
            >
               Start Scan Now
            </button>
         </div>
      </section>

      {/* --- SHOP BY CONCERN --- */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
             <h2 className="text-3xl md:text-5xl font-serif font-bold text-herbal-900 mb-4">Shop by Concern</h2>
             <p className="text-gray-500 text-lg">Targeted remedies for modern lifestyle issues.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8">
             {CONCERNS.map((concern, idx) => (
                <Link to="/shop" key={idx} className="group flex flex-col items-center gap-4 text-center cursor-pointer">
                   <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-transparent group-hover:border-gold-400 transition-all p-1 shadow-lg group-hover:shadow-2xl">
                      <div className="w-full h-full rounded-full overflow-hidden relative">
                        <img src={concern.image} alt={concern.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                      </div>
                   </div>
                   <span className="font-bold text-herbal-800 text-base md:text-lg group-hover:text-gold-600 transition-colors">{concern.name}</span>
                </Link>
             ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-24 bg-sand-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
             >
               <span className="text-gold-600 font-bold uppercase tracking-widest text-sm mb-2 block">Vedic Heritage</span>
               <h2 className="text-4xl md:text-5xl font-serif font-bold text-herbal-900 mb-6">Why Choose Ayurveda?</h2>
               <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                 Ayurveda is not just about curing diseases; it's about preserving health. Our products are formulated using 
                 <span className="font-bold text-herbal-700"> "Bhasmas"</span> and <span className="font-bold text-herbal-700">"Rasayanas"</span> 
                 mentioned in the ancient texts of Charaka Samhita.
               </p>
               <ul className="space-y-5">
                 {[
                   '100% Natural & Chemical Free',
                   'Root Cause Treatment, Not Just Symptoms',
                   'Holistic Balance of Mind, Body & Soul',
                   'Personalized Treatment Plans'
                 ].map((item, i) => (
                   <li key={i} className="flex items-start gap-3 text-gray-700 font-medium text-lg">
                     <CheckCircle size={24} className="text-gold-600 mt-0.5 flex-shrink-0" /> <span>{item}</span>
                   </li>
                 ))}
               </ul>
             </motion.div>
             <div className="relative mt-8 md:mt-0">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
               >
                 <img src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop" alt="Ayurveda Ingredients" className="w-full h-auto" />
                 <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors duration-500"></div>
                 <div className="absolute center w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform shadow-xl border border-white/30">
                    <Play fill="white" className="text-white ml-2 w-8 h-8" />
                 </div>
               </motion.div>
               {/* Decorative Element */}
               <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-herbal-200/50 rounded-full blur-3xl -z-10"></div>
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-gold-200/50 rounded-full blur-3xl -z-10"></div>
             </div>
           </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-herbal-900 mb-4">Trending Remedies</h2>
            <div className="w-24 h-1.5 bg-gold-500 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 text-lg">Discover our most loved authentic formulations.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {PRODUCTS.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link to="/shop" className="inline-block bg-herbal-50 text-herbal-800 px-8 py-3 rounded-full font-bold hover:bg-herbal-100 transition-colors">
              View All Products
            </Link>
          </div>
        </div>
      </section>
      
      {/* Consult Section */}
      <section className="py-16 md:py-24 bg-[#0a2f1f] text-white relative overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="md:w-1/2 text-center md:text-left">
              <span className="text-gold-500 font-bold tracking-widest text-sm uppercase mb-3 block">Expert Consultation</span>
              <h2 className="text-3xl md:text-6xl font-serif font-bold mb-6 leading-tight">Talk to <br/> Vaidya Specialists</h2>
              <p className="text-herbal-200 text-lg md:text-xl mb-10 leading-relaxed font-light">
                Get a personalized diagnosis for chronic conditions like Diabetes, Thyroid, and Joint Pain via video consultation. Our doctors have 15+ years of clinical experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                 <Link to="/consult" className="bg-gold-500 text-herbal-900 px-8 py-4 rounded-full font-bold hover:bg-gold-400 transition-colors w-full md:w-auto text-center shadow-lg shadow-gold-500/20">
                   Book Appointment
                 </Link>
                 <Link to="/therapies" className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors w-full md:w-auto text-center">
                   Explore Therapies
                 </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
               <div className="relative z-10 grid grid-cols-2 gap-4">
                 <motion.img 
                   whileHover={{ y: -10 }}
                   src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop" 
                   className="w-full h-64 object-cover rounded-2xl transform translate-y-12 shadow-2xl" 
                   alt="Doctor" 
                 />
                 <motion.img 
                   whileHover={{ y: -10 }}
                   src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop" 
                   className="w-full h-64 object-cover rounded-2xl shadow-2xl" 
                   alt="Treatment" 
                 />
               </div>
               {/* Blob */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-herbal-800/50 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
