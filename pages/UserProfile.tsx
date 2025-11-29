
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Package, Calendar, Heart, MapPin, LogOut, Edit2, Save } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import * as RRD from 'react-router-dom';

const { useNavigate } = RRD as any;

export const UserProfile = () => {
  const { user, orders, appointments, wishlist, logout, updateUserProfile } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'appointments' | 'wishlist'>('profile');
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    gender: user?.gender || 'Male',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    pincode: user?.address?.pincode || '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editForm.name,
      phone: editForm.phone,
      gender: editForm.gender as any,
      address: {
        street: editForm.street,
        city: editForm.city,
        pincode: editForm.pincode,
        state: '', country: 'India'
      }
    });
    setIsEditing(false);
  };

  const userOrders = orders.filter(o => o.userId === user.email);

  return (
    <div className="min-h-screen bg-sand-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-herbal-100 rounded-full flex items-center justify-center mx-auto mb-3 text-herbal-700 text-2xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <h2 className="font-serif font-bold text-xl text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'My Profile', icon: User },
                  { id: 'orders', label: 'My Orders', icon: Package },
                  { id: 'appointments', label: 'Appointments', icon: Calendar },
                  { id: 'wishlist', label: 'Wishlist', icon: Heart },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-herbal-700 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <item.icon size={18} /> {item.label}
                  </button>
                ))}
                <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 mt-4">
                  <LogOut size={18} /> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Personal Information</h2>
                  <button onClick={() => setIsEditing(!isEditing)} className="text-herbal-700 font-bold text-sm flex items-center gap-2">
                    {isEditing ? <><X size={16} /> Cancel</> : <><Edit2 size={16} /> Edit</>}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">FULL NAME</label>
                      <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">PHONE</label>
                      <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">STREET ADDRESS</label>
                      <input type="text" value={editForm.street} onChange={e => setEditForm({...editForm, street: e.target.value})} className="w-full p-3 border rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">CITY</label>
                        <input type="text" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} className="w-full p-3 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">PINCODE</label>
                        <input type="text" value={editForm.pincode} onChange={e => setEditForm({...editForm, pincode: e.target.value})} className="w-full p-3 border rounded-lg" />
                      </div>
                    </div>
                    <button type="submit" className="md:col-span-2 bg-herbal-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 mt-4">
                      <Save size={18} /> Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <span className="block text-xs text-gray-500 mb-1">Full Name</span>
                        <span className="font-bold text-gray-900">{user.name}</span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <span className="block text-xs text-gray-500 mb-1">Email</span>
                        <span className="font-bold text-gray-900">{user.email}</span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <span className="block text-xs text-gray-500 mb-1">Phone</span>
                        <span className="font-bold text-gray-900">{user.phone || 'Not Set'}</span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <span className="block text-xs text-gray-500 mb-1">Gender</span>
                        <span className="font-bold text-gray-900">{user.gender || 'Not Set'}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <span className="block text-xs text-gray-500 mb-1">Address</span>
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-herbal-600 mt-0.5" />
                        <span className="font-bold text-gray-900">
                          {user.address ? `${user.address.street}, ${user.address.city} - ${user.address.pincode}` : 'No Address Saved'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Order History</h2>
                {userOrders.length === 0 ? (
                  <p className="text-gray-500">No orders placed yet.</p>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map(order => (
                      <div key={order.id} className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <p className="font-bold text-gray-900">{order.id}</p>
                          <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                          <p className="text-sm mt-1">{order.items.length} Items • ₹{order.total}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* APPOINTMENTS TAB */}
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">My Consultations</h2>
                {appointments.length === 0 ? (
                  <p className="text-gray-500">No upcoming appointments.</p>
                ) : (
                  <div className="grid gap-4">
                    {appointments.map(appt => (
                      <div key={appt.id} className="border border-gray-200 rounded-xl p-4 flex gap-4 items-center">
                        <img src={appt.doctorImage} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-gray-900">Dr. {appt.doctorName}</p>
                          <p className="text-sm text-gray-600">{appt.date} at {appt.time}</p>
                          <span className="text-xs bg-herbal-50 text-herbal-700 px-2 py-0.5 rounded">{appt.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">My Wishlist</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlist.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
