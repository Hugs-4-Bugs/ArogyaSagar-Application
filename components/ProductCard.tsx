
import React from 'react';
import { Product } from '../types';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion as m } from 'framer-motion';
import * as RRD from 'react-router-dom';

const { Link } = RRD as any;
const motion = m as any;

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const isWishlisted = isInWishlist(product.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-herbal-100 flex flex-col h-full relative"
    >
      {/* Wishlist Button */}
      <button 
        onClick={(e) => {
           e.preventDefault();
           e.stopPropagation();
           toggleWishlist(product);
        }}
        className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:scale-110 transition-transform"
      >
        <Heart 
          size={18} 
          className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-400"} 
        />
      </button>

      <div className="relative overflow-hidden aspect-square">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] uppercase font-bold text-herbal-800 tracking-wider">
            {product.category}
          </div>
        </Link>
        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
             <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
              className="bg-white text-herbal-800 px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 hover:bg-herbal-50 pointer-events-auto shadow-lg"
             >
               <ShoppingCart size={16} /> Add to Cart
             </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product.id}`} className="hover:underline decoration-herbal-700 underline-offset-2">
            <h3 className="font-serif font-bold text-lg text-gray-900 leading-tight group-hover:text-herbal-700 transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center bg-sand-100 px-1.5 py-0.5 rounded text-xs font-bold text-gold-600 flex-shrink-0 ml-2">
            {product.rating} <Star size={10} fill="currentColor" className="ml-0.5" />
          </div>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10 flex-1">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl font-bold text-herbal-800">₹{product.price}</span>
          <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
            In Stock
          </span>
        </div>
      </div>
    </motion.div>
  );
};
