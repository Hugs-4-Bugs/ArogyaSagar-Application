
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Users, Package, ShoppingBag, Plus, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import * as RRD from 'react-router-dom';

const { useNavigate } = RRD as any;

export const Admin = () => {
  const { user, products, doctors, orders, addProduct, deleteProduct, addDoctor, deleteDoctor, updateOrderStatus } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'doctors' | 'orders'>('dashboard');

  // Protect Route
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

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
                  <button className="bg-herbal-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
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
                          <td className="px-4 py-3 font-medium">{p.name}</td>
                          <td className="px-4 py-3">₹{p.price}</td>
                          <td className="px-4 py-3">{p.category}</td>
                          <td className="px-4 py-3 flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
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
                  <button className="bg-herbal-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
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
    </div>
  );
};
