
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Users, Package, ShoppingBag, Plus, Trash2, Edit, X, Save, Upload } from 'lucide-react';
import { Product, Doctor } from '../types';
import * as RRD from 'react-router-dom';

const { useNavigate } = RRD as any;

export const Admin = () => {
  const { 
    user, products, doctors, orders, 
    addProduct, updateProduct, deleteProduct, 
    addDoctor, updateDoctor, deleteDoctor, 
    updateOrderStatus 
  } = useApp();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'doctors' | 'orders'>('dashboard');

  // Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '', price: 0, category: 'General Wellness', description: '', image: ''
  });
  const [doctorForm, setDoctorForm] = useState<Partial<Doctor>>({
    name: '', specialty: '', price: 0, experience: 0, bio: '', image: ''
  });

  // Protect Route
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // --- HANDLERS ---

  const openAddProduct = () => {
    setEditingId(null);
    setProductForm({ name: '', price: 0, category: 'General Wellness', description: '', image: 'https://images.unsplash.com/photo-1629196911514-cfd8d628b26e?q=80&w=600&auto=format&fit=crop' });
    setIsProductModalOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingId(product.id);
    setProductForm(product);
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
        updateProduct(editingId, productForm);
    } else {
        const newProduct = {
            ...productForm,
            id: Date.now().toString(),
            rating: 4.5,
            reviews: 0,
            reviewsList: [],
            benefits: ['Natural', 'Verified'],
            ingredients: ['Herbal Extract'],
            inStock: true
        } as Product;
        addProduct(newProduct);
    }
    setIsProductModalOpen(false);
  };

  const openAddDoctor = () => {
    setEditingId(null);
    setDoctorForm({ name: '', specialty: '', price: 0, experience: 0, bio: '', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop', available: true });
    setIsDoctorModalOpen(true);
  };

  const openEditDoctor = (doctor: Doctor) => {
    setEditingId(doctor.id);
    setDoctorForm(doctor);
    setIsDoctorModalOpen(true);
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
        updateDoctor(editingId, doctorForm);
    } else {
        const newDoctor = {
            ...doctorForm,
            id: `doc-${Date.now()}`,
            rating: 5.0,
        } as Doctor;
        addDoctor(newDoctor);
    }
    setIsDoctorModalOpen(false);
  };

  // Stats
  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white p-4 rounded-xl shadow-sm h-fit">
            <h2 className="font-bold text-xl mb-6 px-4">Admin Panel</h2>
            <nav className="space-y-1">
              {[
                { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
                { id: 'products', icon: ShoppingBag, label: 'Products' },
                { id: 'doctors', icon: Users, label: 'Doctors' },
                { id: 'orders', icon: Package, label: 'Orders' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${activeTab === item.id ? 'bg-herbal-700 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <item.icon size={18} /> {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-xs uppercase font-bold">Total Sales</p>
                    <h3 className="text-2xl font-bold">₹{totalSales.toLocaleString()}</h3>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-xs uppercase font-bold">Total Orders</p>
                    <h3 className="text-2xl font-bold">{orders.length}</h3>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-xs uppercase font-bold">Pending</p>
                    <h3 className="text-2xl font-bold text-orange-500">{pendingOrders}</h3>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-xs uppercase font-bold">Products</p>
                    <h3 className="text-2xl font-bold">{products.length}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">Inventory Management</h3>
                  <button onClick={openAddProduct} className="bg-herbal-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Plus size={16} /> Add Product
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium flex items-center gap-2">
                              <img src={p.image} className="w-8 h-8 rounded object-cover" alt="" />
                              {p.name}
                          </td>
                          <td className="px-4 py-3">₹{p.price}</td>
                          <td className="px-4 py-3">{p.category}</td>
                          <td className="px-4 py-3 flex gap-2">
                            <button onClick={() => openEditProduct(p)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                            <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DOCTORS TAB */}
            {activeTab === 'doctors' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">Doctor Management</h3>
                  <button onClick={openAddDoctor} className="bg-herbal-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Plus size={16} /> Add Doctor
                  </button>
                </div>
                <div className="grid gap-4">
                  {doctors.map(d => (
                    <div key={d.id} className="flex items-center justify-between p-4 border rounded-xl">
                      <div className="flex items-center gap-4">
                        <img src={d.image} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h4 className="font-bold">{d.name}</h4>
                          <p className="text-xs text-gray-500">{d.specialty} • ₹{d.price}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEditDoctor(d)} className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Edit size={18} /></button>
                        <button onClick={() => deleteDoctor(d.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-lg mb-6">Order Management</h3>
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <p className="font-bold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-500">{order.items.length} items • Total: ₹{order.total}</p>
                        <p className="text-xs text-gray-400">{new Date(order.date).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="border rounded-lg px-3 py-2 text-sm bg-gray-50"
                        >
                          <option>Processing</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* --- PRODUCT MODAL --- */}
      {isProductModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl">{editingId ? 'Edit Product' : 'Add Product'}</h3>
                      <button onClick={() => setIsProductModalOpen(false)}><X size={24} /></button>
                  </div>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Name</label>
                          <input required type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full p-2 border rounded-lg" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Price (₹)</label>
                              <input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                              <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full p-2 border rounded-lg">
                                  {['General Wellness', 'Immunity & Energy', 'Herbal Teas', 'Organic Honey', 'Essential Oils', 'Hair & Skin Care', 'Pain Relief'].map(c => (
                                      <option key={c} value={c}>{c}</option>
                                  ))}
                              </select>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                          <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full p-2 border rounded-lg" rows={3}></textarea>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Image URL</label>
                          <input type="text" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full p-2 border rounded-lg" />
                      </div>
                      <button type="submit" className="w-full bg-herbal-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                          <Save size={18} /> Save Product
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* --- DOCTOR MODAL --- */}
      {isDoctorModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl">{editingId ? 'Edit Doctor' : 'Add Doctor'}</h3>
                      <button onClick={() => setIsDoctorModalOpen(false)}><X size={24} /></button>
                  </div>
                  <form onSubmit={handleDoctorSubmit} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Name</label>
                          <input required type="text" value={doctorForm.name} onChange={e => setDoctorForm({...doctorForm, name: e.target.value})} className="w-full p-2 border rounded-lg" />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Specialty</label>
                          <input required type="text" value={doctorForm.specialty} onChange={e => setDoctorForm({...doctorForm, specialty: e.target.value})} className="w-full p-2 border rounded-lg" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Fee (₹)</label>
                              <input required type="number" value={doctorForm.price} onChange={e => setDoctorForm({...doctorForm, price: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Experience (Yrs)</label>
                              <input required type="number" value={doctorForm.experience} onChange={e => setDoctorForm({...doctorForm, experience: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Bio</label>
                          <textarea value={doctorForm.bio} onChange={e => setDoctorForm({...doctorForm, bio: e.target.value})} className="w-full p-2 border rounded-lg" rows={3}></textarea>
                      </div>
                      <button type="submit" className="w-full bg-herbal-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                          <Save size={18} /> Save Doctor
                      </button>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};
