
import React, { useState } from 'react';
import { motion as m, AnimatePresence as AP } from 'framer-motion';
import { X, Sparkles, ArrowRight, RefreshCcw } from 'lucide-react';
import { DOSHA_QUIZ, PRODUCTS } from '../data';
import * as RRD from 'react-router-dom';

const { Link } = RRD as any;
const motion = m as any;
const AnimatePresence = AP as any;

export const DoshaQuiz = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ Vata: 0, Pitta: 0, Kapha: 0 });
  const [result, setResult] = useState<string | null>(null);

  const handleAnswer = (type: string) => {
    const newScores = { ...scores, [type]: (scores as any)[type] + 1 };
    setScores(newScores);

    if (currentQuestion < DOSHA_QUIZ.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate Result
      const winner = Object.keys(newScores).reduce((a, b) => (newScores as any)[a] > (newScores as any)[b] ? a : b);
      setResult(winner);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores({ Vata: 0, Pitta: 0, Kapha: 0 });
    setResult(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
        >
           {/* Header */}
           <div className="bg-herbal-900 p-6 text-white flex justify-between items-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-herbal-900 to-herbal-700"></div>
             <div className="relative z-10 flex items-center gap-3">
               <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-herbal-900 shadow-lg">
                 <Sparkles size={20} />
               </div>
               <div>
                 <h2 className="text-xl font-serif font-bold">Prakriti Parikshan</h2>
                 <p className="text-xs text-herbal-200">Discover your Ayurvedic Dosha</p>
               </div>
             </div>
             <button onClick={onClose} className="relative z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
               <X size={20} />
             </button>
           </div>

           {/* Content */}
           <div className="p-8 md:p-10 min-h-[400px] flex flex-col justify-center">
             {!result ? (
               <>
                 <div className="mb-8">
                   <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                     <span>Question {currentQuestion + 1} of {DOSHA_QUIZ.questions.length}</span>
                     <span>{Math.round(((currentQuestion) / DOSHA_QUIZ.questions.length) * 100)}%</span>
                   </div>
                   <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                     <motion.div 
                       className="h-full bg-gold-500"
                       initial={{ width: 0 }}
                       animate={{ width: `${((currentQuestion) / DOSHA_QUIZ.questions.length) * 100}%` }}
                     />
                   </div>
                 </div>

                 <motion.h3 
                   key={currentQuestion}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="text-2xl font-serif font-bold text-gray-900 mb-8 text-center"
                 >
                   {DOSHA_QUIZ.questions[currentQuestion].text}
                 </motion.h3>

                 <div className="grid gap-4">
                   {DOSHA_QUIZ.questions[currentQuestion].options.map((option, idx) => (
                     <motion.button
                       key={idx}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.1 }}
                       onClick={() => handleAnswer(option.type)}
                       className="p-4 border-2 border-gray-100 rounded-xl hover:border-herbal-500 hover:bg-herbal-50 transition-all text-left font-medium text-gray-700 flex items-center justify-between group"
                     >
                       {option.text}
                       <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 text-herbal-600 transition-opacity" />
                     </motion.button>
                   ))}
                 </div>
               </>
             ) : (
               <div className="text-center">
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   className="w-24 h-24 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gold-600"
                 >
                   <Sparkles size={40} />
                 </motion.div>
                 
                 <h2 className="text-3xl font-serif font-bold text-herbal-900 mb-2">
                   You are {(DOSHA_QUIZ.results as any)[result].title}
                 </h2>
                 <p className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
                   {(DOSHA_QUIZ.results as any)[result].desc}
                 </p>

                 <div className="bg-sand-50 p-6 rounded-2xl mb-8 text-left">
                   <h4 className="font-bold text-herbal-900 text-sm uppercase tracking-wide mb-4 text-center">Recommended for You</h4>
                   <div className="flex gap-4 overflow-x-auto pb-2">
                     {(DOSHA_QUIZ.results as any)[result].recommendations.map((id: string) => {
                       const product = PRODUCTS.find(p => p.id === id);
                       if(!product) return null;
                       return (
                         <Link key={id} to={`/product/${id}`} onClick={onClose} className="flex-shrink-0 w-32 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                           <img src={product.image} alt={product.name} className="w-full h-24 object-cover rounded-md mb-2" />
                           <p className="text-xs font-bold text-gray-900 line-clamp-2">{product.name}</p>
                           <p className="text-xs text-herbal-600">₹{product.price}</p>
                         </Link>
                       )
                     })}
                   </div>
                 </div>

                 <div className="flex gap-4 justify-center">
                   <button onClick={resetQuiz} className="flex items-center gap-2 text-gray-500 hover:text-herbal-700 text-sm font-bold">
                     <RefreshCcw size={16} /> Retake Quiz
                   </button>
                   <button onClick={onClose} className="bg-herbal-800 text-white px-8 py-3 rounded-full font-bold hover:bg-herbal-900 transition-colors shadow-lg">
                     Explore Remedies
                   </button>
                 </div>
               </div>
             )}
           </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
