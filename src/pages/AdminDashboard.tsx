import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/ecommerce';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  Star,
  LogOut,
  RefreshCw,
  Plus,
  Phone,
  Mail,
} from 'lucide-react';
import { AdminLoginForm } from '../components/admin/AdminLoginForm';
import { ProductFormModal } from '../components/admin/ProductFormModal';
import { AdminProductsTab } from '../components/admin/AdminProductsTab';
import { AdminOrdersTab } from '../components/admin/AdminOrdersTab';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminAuthenticated,
    isAdminAuthLoading,
    adminLogout,
    products,
    orders,
    reviews,
    refreshProducts,
    isDbLoading,
    setActivePage,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'overview' | 'customers' | 'reviews'>('products');

  // Product Add / Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // If owner is not authenticated, redirect to customer account page immediately
  React.useEffect(() => {
    if (!isAdminAuthLoading && !isAdminAuthenticated) {
      setActivePage('account');
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', '/');
      }
    }
  }, [isAdminAuthLoading, isAdminAuthenticated, setActivePage]);

  if (isAdminAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-teal-700 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return null;
  }

  // Dashboard Stats Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const pendingOrders = orders.filter((o) => o.status === 'Order Placed' || o.status === 'Processing').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setIsProductModalOpen(true);
  };

  return (
    <div className="bg-slate-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Top Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-4 border-amber-400">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400 text-teal-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded">
                Owner Dashboard
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Database Live
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">Doctor Makhana Control Panel</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Logged in as Authorized Store Owner • Direct Live Database Connection
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={handleOpenAddProduct}
              className="flex-1 md:flex-initial bg-amber-400 hover:bg-amber-300 text-teal-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>

            <button
              onClick={() => refreshProducts()}
              disabled={isDbLoading}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
              title="Sync Products from Database"
            >
              <RefreshCw className={`w-4 h-4 ${isDbLoading ? 'animate-spin text-amber-300' : ''}`} />
            </button>

            <button
              onClick={() => adminLogout()}
              className="px-3.5 py-2.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800/60 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Revoke session and log out"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm flex flex-wrap gap-1">
          {[
            { id: 'products', label: 'Products & Catalog', icon: Package, count: totalProducts },
            { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, count: totalOrders },
            { id: 'overview', label: 'Sales & Analytics', icon: BarChart3 },
            { id: 'customers', label: 'Customer Directory', icon: Users },
            { id: 'reviews', label: 'Store Reviews', icon: Star, count: reviews.length },
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-800 text-white shadow'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <IconComp className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      activeTab === tab.id ? 'bg-teal-950 text-amber-300' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content: Products */}
        {activeTab === 'products' && (
          <AdminProductsTab
            onOpenAdd={handleOpenAddProduct}
            onOpenEdit={handleOpenEditProduct}
          />
        )}

        {/* Tab Content: Orders */}
        {activeTab === 'orders' && <AdminOrdersTab />}

        {/* Tab Content: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase">
                  Total Sales Revenue
                </span>
                <p className="text-3xl font-black text-teal-900">₹{totalRevenue}</p>
                <span className="text-[10px] text-emerald-600 font-bold block">
                  ↑ 100% Cash & Online Processed
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase">
                  Total Orders
                </span>
                <p className="text-3xl font-black text-slate-900">{totalOrders}</p>
                <span className="text-[10px] text-teal-700 font-bold block">
                  {deliveredOrders} Completed
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase">
                  Pending Dispatch
                </span>
                <p className="text-3xl font-black text-amber-600">{pendingOrders}</p>
                <span className="text-[10px] text-amber-700 font-bold block">
                  Requires Processing
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase">
                  Active Products
                </span>
                <p className="text-3xl font-black text-slate-900">{totalProducts}</p>
                <span className="text-[10px] text-slate-500 font-bold block">
                  In Persistent Database
                </span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
                Recent Orders Summary
              </h3>

              <div className="divide-y divide-slate-100 overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 uppercase font-extrabold border-b border-slate-200">
                      <th className="py-2.5">Order ID</th>
                      <th className="py-2.5">Customer</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 font-bold text-teal-900">{ord.id}</td>
                        <td className="py-3 font-semibold text-slate-800">
                          {ord.customerName} ({ord.shippingAddress.city})
                        </td>
                        <td className="py-3 font-extrabold text-slate-900">
                          ₹{ord.totalAmount}
                        </td>
                        <td className="py-3">
                          <span className="bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded text-[10px]">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setActiveTab('orders')}
                            className="text-teal-700 font-bold hover:underline"
                          >
                            Manage Order
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Customers */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              Customer Directory
            </h2>
            <div className="divide-y divide-slate-100">
              {orders.map((ord, idx) => (
                <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{ord.customerName}</h4>
                    <p className="text-xs text-slate-500">
                      {ord.shippingAddress.city}, {ord.shippingAddress.state} • {ord.shippingAddress.pincode}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                    <a href={`tel:${ord.phone}`} className="flex items-center gap-1 hover:text-teal-700">
                      <Phone className="w-3.5 h-3.5 text-teal-600" /> {ord.phone}
                    </a>
                    <a href={`mailto:${ord.email}`} className="flex items-center gap-1 hover:text-teal-700">
                      <Mail className="w-3.5 h-3.5 text-teal-600" /> {ord.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Reviews */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              Customer Reviews ({reviews.length})
            </h2>
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{rev.author}</span>
                      <span className="text-[10px] text-slate-400">{rev.location} • {rev.date}</span>
                    </div>
                    <div className="flex text-amber-400">
                      {'★'.repeat(rev.rating)}
                    </div>
                  </div>
                  <h5 className="font-bold text-slate-800 text-xs">{rev.title}</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={editingProduct}
      />
    </div>
  );
};
