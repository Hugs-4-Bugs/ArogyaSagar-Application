
import React from 'react';
import { THERAPIES } from '../data';
import { useApp } from '../context/AppContext';
import * as RRD from 'react-router-dom';

const { useNavigate } = RRD as any;

export const Therapies = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  const handleBook = (therapyName: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    alert(`Booking therapy ${therapyName} for user ${user.name}`);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-herbal-900 mb-6">Panchakarma & Therapies</h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Rejuvenate your body and soul at our premium wellness centers. Experience ancient healing techniques performed by certified therapists.
          </p>
        </div>

        <div className="space-y-20">
          {THERAPIES.map((therapy, index) => (
            <div key={therapy.id} className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="md:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                  <img src={therapy.image} alt={therapy.name} className="w-full h-80 object-cover hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <span className="font-bold text-herbal-800">{therapy.duration}</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 space-y-6">
                <h2 className="text-3xl font-serif font-bold text-gray-900">{therapy.name}</h2>
                <div className="w-16 h-1 bg-gold-500 rounded-full"></div>
                <p className="text-gray-600 text-lg leading-relaxed">{therapy.description}</p>
                <div className="flex items-center gap-6">
                  <span className="text-2xl font-bold text-herbal-700">₹{therapy.price}</span>
                  <button 
                    onClick={() => handleBook(therapy.name)}
                    className="bg-herbal-900 text-white px-8 py-3 rounded-lg hover:bg-herbal-800 transition-colors shadow-lg"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
