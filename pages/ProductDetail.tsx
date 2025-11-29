
import React, { useState } from 'react';
import * as RRD from 'react-router-dom';
import { PRODUCTS } from '../data';
import { useApp } from '../context/AppContext';
import { Star, ShoppingCart, Check, ArrowLeft, Leaf, ShieldCheck, Activity, User, MessageCircle, Volume2, VolumeX } from 'lucide-react';
import { motion as m } from 'framer-motion';

const { useParams, useNavigate } = RRD as any;
const motion = m as any;

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getProductReviews, addReview, user } = useApp();
  
  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState(''); // For guests
  
  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sand-50">
        <h2 className="text-2xl font-serif font-bold text-herbal-900">Product not found</h2>
        <button 
          onClick={() => navigate('/shop')}
          className="mt-4 px-6 py-2 bg-herbal-700 text-white rounded-full hover:bg-herbal-800 transition-colors"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const reviews = getProductReviews(product.id);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `
      ${product.name}. 
      ${product.description}. 
      Key Benefits are: ${product.benefits.join(', ')}. 
      Ingredients include: ${product.ingredients.join(', ')}.
      Price is ${product.price} rupees.
    `;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9; // Slower for clarity
    
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const reviewerName = user ? user.name : name;
    
    if (!reviewerName) {
        alert("Please enter your name.");
        return;
    }

    addReview({
        id: Date.now().toString(),
        productId: product.id,
        userName: reviewerName,
        rating: rating,
        comment: comment,
        date: new Date().toISOString().split('T')[0]
    });

    setComment('');
    setRating(5);
    setName('');
    alert("Thank you for your review!");
  };

  return (
    <div className="min-h-screen bg-sand-50 pt-20 pb-20 md:pt-28 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-herbal-700 mb-6 transition-colors group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-12">
          <div className="grid md:grid-cols-2">
            
            {/* Product Image Section */}
            <div className="bg-gray-50 relative p-6 md:p-16 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-sm md:max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl"
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {/* Decorative background blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-herbal-100/50 rounded-full blur-3xl -z-0"></div>
            </div>

            {/* Product Details Section */}
            <div className="p-6 md:p-12 flex flex-col">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-gold-100 text-gold-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                    {product.category}
                  </span>
                  
                  {/* TTS Button */}
                  <button 
                    onClick={handleSpeak}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isSpeaking ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                     {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />} 
                     {isSpeaking ? 'Stop' : 'Listen'}
                  </button>
                </div>

                <h1 className="text-3xl md:text-4xl font-serif font-bold text-herbal-900 mb-2">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="flex text-gold-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i >= Math.floor(product.rating) ? "text-gray-300" : ""} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
                  <span className="hidden md:inline mx-2 text-gray-300">|</span>
                  <span className="flex items-center text-sm text-green-600 font-medium w-full md:w-auto mt-1 md:mt-0">
                    <ShieldCheck size={16} className="mr-1" /> Doctor Verified
                  </span>
                </div>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">{product.description}</p>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-sm font-bold text-herbal-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Leaf size={16} /> Key Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing, i) => (
                      <span key={i} className="px-3 py-1 bg-herbal-50 text-herbal-700 rounded-md text-sm font-medium border border-herbal-100">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-herbal-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Activity size={16} /> Benefits
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-gray-600 text-sm">
                        <Check size={16} className="text-herbal-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price & Add Cart - Sticky Feel on Mobile */}
              <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="w-full sm:w-auto flex justify-between sm:block items-center">
                  <p className="text-sm text-gray-500 mb-1 hidden sm:block">Price</p>
                  <div>
                      <span className="text-4xl font-serif font-bold text-herbal-900">₹{product.price}</span>
                      <p className="text-xs text-green-600 font-medium mt-1 sm:hidden md:block">Inclusive of all taxes</p>
                  </div>
                  {/* On very small screens, hide the "Inclusive" text to save space if needed */}
                </div>

                <div className="flex-1 w-full sm:w-auto">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-herbal-800 hover:bg-herbal-900 text-white text-lg font-bold py-4 rounded-xl shadow-xl shadow-herbal-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ShoppingCart size={20} /> Add to Cart
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid md:grid-cols-2 gap-8">
            {/* Review List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="text-2xl font-serif font-bold text-herbal-900 mb-6 flex items-center gap-2">
                    <MessageCircle className="text-gold-500" /> Customer Reviews
                </h3>
                
                {reviews.length === 0 ? (
                    <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                ) : (
                    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-herbal-100 rounded-full flex items-center justify-center text-herbal-700 font-bold text-xs">
                                            {review.userName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{review.userName}</p>
                                            <div className="flex text-gold-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">{review.date}</span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Write a Review */}
            <div className="bg-herbal-50 rounded-3xl border border-herbal-100 p-6 md:p-8">
                <h3 className="text-xl font-serif font-bold text-herbal-900 mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                    {!user && (
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Your Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-herbal-500"
                                placeholder="Enter your name"
                            />
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`p-1 transition-transform hover:scale-110 ${rating >= star ? 'text-gold-500' : 'text-gray-300'}`}
                                >
                                    <Star size={28} fill={rating >= star ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Review</label>
                        <textarea 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-herbal-500"
                            placeholder="Share your experience with this product..."
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-herbal-700 text-white font-bold py-3 rounded-xl hover:bg-herbal-800 transition-colors shadow-lg active:scale-95"
                    >
                        Submit Review
                    </button>
                </form>
            </div>
        </div>

      </div>
    </div>
  );
};
