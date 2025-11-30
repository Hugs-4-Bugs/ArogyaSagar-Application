
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Filter, Search, X, ChevronRight, Sparkles } from 'lucide-react';
import * as RRD from 'react-router-dom';

const { Link } = RRD as any;

const categories = [
  'All', 'Herbal Teas', 'Organic Honey', 'Essential Oils', 'Spices & Superfoods',
  'Immunity & Energy', 'General Wellness', 'Pain Relief', 'Hair & Skin Care', 
  'Chronic Diseases', 'Mental Wellness'
];

export const Shop = () => {
  const { products, getRecommendations, trackProductView, viewHistory } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // Load recommendations on mount and when viewHistory/products change
    setRecommendations(getRecommendations());
  }, [products, viewHistory]);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const suggestions = searchQuery.length > 0 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div className="min-h-screen bg-sand-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-herbal-900 mb-3">Ayurvedic Store</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Browse our curated collection of authentic, doctor-verified formulations.
          </p>
        </div>

        {/* Recommended for You Section */}
        {recommendations.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="text-gold-500" size={24} />
              <h2 className="text-2xl font-serif font-bold text-herbal-900">Recommended For You</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendations.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 relative z-30">
          <div className="relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search for medicines, teas, oils..." 
              className="w-full pl-12 pr-10 py-3 md:py-4 rounded-full border border-herbal-200 focus:border-herbal-500 focus:ring-2 focus:ring-herbal-200 shadow-sm outline-none bg-white"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setShowSuggestions(false); }} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Autocomplete */}
          {showSuggestions && searchQuery && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-xl border border-herbal-100 overflow-hidden z-20">
                {suggestions.length > 0 ? (
                  suggestions.map(product => (
                    <Link 
                      key={product.id} 
                      to={`/product/${product.id}`} 
                      onClick={() => { setShowSuggestions(false); trackProductView(product); }}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-herbal-50 transition-colors"
                    >
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-herbal-600">{product.category}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-300" />
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500 text-sm">No matches found</div>
                )}
            </div>
          )}
        </div>

        {/* Filters & Grid */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8">
          
          {/* Mobile Categories */}
          <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar flex gap-2 sticky top-20 bg-sand-50/95 backdrop-blur-sm z-20 py-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm border transition-all ${selectedCategory === cat ? 'bg-herbal-700 text-white font-bold' : 'bg-white text-gray-600'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-4 text-herbal-800 font-bold"><Filter size={20} /> Categories</div>
              
              {/* Dynamic Height Calculation for Sidebar Scroll */}
              <div className="space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${selectedCategory === cat ? 'bg-herbal-100 text-herbal-800 font-bold translate-x-1' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
             <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
             </div>
             {filteredProducts.length === 0 && (
               <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                 <h3 className="text-lg font-bold text-gray-800">No products found</h3>
                 <button onClick={() => {setSearchQuery(''); setSelectedCategory('All');}} className="mt-4 text-herbal-700 font-medium hover:underline">Clear all filters</button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
