
import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import * as RRD from 'react-router-dom';

const { Link } = RRD as any;

export const Wishlist = () => {
  const { wishlist } = useApp();

  return (
    <div className="min-h-screen bg-sand-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
             <Heart size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-herbal-900 mb-3">My Wishlist</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your saved collection of holistic remedies and wellness products.
          </p>
        </div>

        {wishlist.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
              <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6">Save items you love to revisit them later.</p>
              <Link 
                to="/shop" 
                className="inline-block bg-herbal-700 text-white px-8 py-3 rounded-full font-bold hover:bg-herbal-800 transition-colors"
              >
                Browse Shop
              </Link>
           </div>
        ) : (
           <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {wishlist.map(product => (
                 <ProductCard key={product.id} product={product} />
              ))}
           </div>
        )}
      </div>
    </div>
  );
};
