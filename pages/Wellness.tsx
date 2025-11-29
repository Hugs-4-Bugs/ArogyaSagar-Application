
import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence as AP } from 'framer-motion';
import { Clock, Flame, Heart, Leaf, Sun, X } from 'lucide-react';
import { RECIPES, WELLNESS_TIPS } from '../data';
import { Recipe } from '../types';

const motion = m as any;
const AnimatePresence = AP as any;

export const Wellness = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedRecipe) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedRecipe]);

  return (
    <div className="min-h-screen bg-sand-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20 relative">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-herbal-400 rounded-full blur-3xl -z-10"
          />
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold-600 font-bold uppercase tracking-wider text-xs block mb-3"
          >
            Svasthya & Dinacharya
          </motion.span>
          <motion.h1 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.6, ease: "easeOut" }}
             className="text-5xl md:text-6xl font-serif font-bold text-herbal-900 mb-6 tracking-tight"
          >
            Holistic Living
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-light"
          >
            Ayurveda is the science of life. Discover ancient rituals and Sattvic recipes 
            to restore the balance of <span className="text-herbal-700 font-medium">Vata</span>, <span className="text-gold-600 font-medium">Pitta</span>, and <span className="text-herbal-900 font-medium">Kapha</span>.
          </motion.p>
        </div>

        {/* Daily Tips Section */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10 justify-center">
             <Sun size={24} className="text-gold-500" />
             <h2 className="text-3xl font-serif font-bold text-herbal-900">Daily Wisdom</h2>
             <Sun size={24} className="text-gold-500" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {WELLNESS_TIPS.map((tip, idx) => (
              <motion.div 
                key={tip.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col h-full"
              >
                <div className="h-56 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                  <motion.img 
                    src={tip.image} 
                    alt={tip.title} 
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-bold text-herbal-800 tracking-wider shadow-sm flex items-center gap-1">
                    <Leaf size={10} /> {tip.category}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-serif font-bold text-2xl text-herbal-900 mb-4 group-hover:text-gold-600 transition-colors">{tip.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">{tip.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recipes Section */}
        <section>
          <div className="flex items-center gap-4 mb-10 justify-center">
             <div className="w-12 h-[1px] bg-herbal-300"></div>
             <h2 className="text-3xl font-serif font-bold text-herbal-900">Sattvic Kitchen</h2>
             <div className="w-12 h-[1px] bg-herbal-300"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {RECIPES.map((recipe, idx) => (
              <motion.div 
                key={recipe.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover="hover"
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-herbal-50 flex flex-col md:flex-row h-auto md:h-80"
              >
                {/* Image Side */}
                <div className="md:w-5/12 relative overflow-hidden h-64 md:h-full cursor-pointer" onClick={() => setSelectedRecipe(recipe)}>
                   <motion.div 
                      className="w-full h-full"
                      variants={{
                        hover: { scale: 1.15 }
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                   >
                     <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                   </motion.div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10"></div>
                   
                   <div className="absolute bottom-4 left-4 text-white md:hidden">
                      <div className="flex items-center gap-3 text-xs font-medium">
                        <span className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded backdrop-blur-sm"><Clock size={12} /> {recipe.prepTime}</span>
                        <span className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded backdrop-blur-sm"><Flame size={12} /> {recipe.calories} kcal</span>
                      </div>
                   </div>
                </div>

                {/* Content Side */}
                <div className="md:w-7/12 p-8 flex flex-col justify-center relative">
                   <div className="hidden md:flex absolute top-6 right-6 gap-3 text-xs font-medium text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={14} /> {recipe.prepTime}</span>
                      <span className="flex items-center gap-1"><Flame size={14} /> {recipe.calories}</span>
                   </div>

                   <h3 className="font-serif font-bold text-2xl text-herbal-900 mb-3">{recipe.name}</h3>
                   <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-3">{recipe.description}</p>
                   
                   <div className="bg-sand-50 rounded-xl p-4 mb-6">
                      <p className="text-[10px] font-bold text-gold-600 uppercase tracking-wide mb-2">Ayurvedic Benefits</p>
                      <ul className="text-sm text-herbal-800 space-y-2">
                        {recipe.benefits.map((b, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Heart size={12} className="text-herbal-500 fill-herbal-500" /> {b}
                          </li>
                        ))}
                      </ul>
                   </div>
                   
                   <motion.button 
                    whileHover={{ x: 5 }}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="self-start text-sm font-bold text-herbal-700 hover:text-herbal-900 flex items-center gap-2 cursor-pointer"
                   >
                     View Full Recipe <div className="w-6 h-[1px] bg-herbal-700"></div>
                   </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Recipe Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              // Removed onClick to disable close on backdrop click
              className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden m-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="relative">
                <div className="h-64 relative">
                  <img src={selectedRecipe.image} alt={selectedRecipe.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button 
                    onClick={() => setSelectedRecipe(null)}
                    className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-colors backdrop-blur-md z-20"
                  >
                    <X size={20} />
                  </button>
                  <div className="absolute bottom-6 left-8 text-white">
                    <h2 className="text-4xl font-serif font-bold mb-2">{selectedRecipe.name}</h2>
                    <div className="flex gap-4 text-sm font-medium">
                      <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md"><Clock size={14} /> {selectedRecipe.prepTime}</span>
                      <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md"><Flame size={14} /> {selectedRecipe.calories} kcal</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 md:p-10 bg-white">
                  <p className="text-gray-600 text-lg leading-relaxed mb-8 border-l-4 border-gold-500 pl-4 italic">
                    "{selectedRecipe.description}"
                  </p>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div>
                      <h3 className="font-bold text-herbal-900 uppercase tracking-widest text-sm mb-4 border-b border-gray-100 pb-2">Ingredients</h3>
                      <ul className="space-y-3">
                        {selectedRecipe.ingredients.map((ing, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 flex-shrink-0"></span>
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-herbal-900 uppercase tracking-widest text-sm mb-4 border-b border-gray-100 pb-2">Instructions</h3>
                      <ol className="space-y-4">
                        {selectedRecipe.instructions && selectedRecipe.instructions.map((inst, i) => (
                          <li key={i} className="flex gap-4 text-gray-700">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-herbal-100 text-herbal-800 font-bold text-xs flex items-center justify-center">
                              {i + 1}
                            </span>
                            <span className="text-sm leading-relaxed">{inst}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-herbal-50 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1">
                       <h4 className="font-bold text-herbal-800 mb-1">Ayurvedic Wisdom</h4>
                       <p className="text-sm text-herbal-600">This recipe helps balance the doshas and promotes sattva (clarity) in the mind.</p>
                    </div>
                    <button onClick={() => setSelectedRecipe(null)} className="px-6 py-2 bg-herbal-700 text-white rounded-lg font-bold hover:bg-herbal-800 transition-colors">
                      Close Recipe
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
