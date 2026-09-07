import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types/ecommerce';
import {
  Search,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Banknote,
  PackageCheck,
  AlertCircle,
} from 'lucide-react';

export const AdminOrdersTab: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter((ord) => {
    const cleanSearch = searchQuery.toLowerCase().trim();
    const matchesSearch =
      ord.id.toLowerCase().includes(cleanSearch) ||
      ord.customerName.toLowerCase().includes(cleanSearch) ||
      ord.phone.includes(cleanSearch) ||
      ord.shippingAddress.city.toLowerCase().includes(cleanSearch);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && (ord.status === 'Order Placed' || ord.status === 'Processing')) ||
      (statusFilter === 'confirmed' && ord.status === 'Confirmed') ||
      (statusFilter === 'shipped' && (ord.status === 'Shipped' || ord.status === 'Out for Delivery')) ||
      (statusFilter === 'delivered' && ord.status === 'Delivered');

    return matchesSearch && matchesStatus;
  });

  const pendingCount = orders.filter((o) => o.status === 'Order Placed' || o.status === 'Processing').length;
  const confirmedCount = orders.filter((o) => o.status === 'Confirmed').length;
  const shippedCount = orders.filter((o) => o.status === 'Shipped' || o.status === 'Out for Delivery').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">Customer Orders Management</h2>
            <span className="bg-teal-100 text-teal-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
              {orders.length} Total Orders
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review customer delivery requests, verify payment status, and update live shipment milestones.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID, customer, phone, city..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-700"
          />
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm overflow-x-auto gap-1">
        {[
          { id: 'all', label: 'All Orders', count: orders.length },
          { id: 'pending', label: 'Pending / Processing', count: pendingCount },
          { id: 'confirmed', label: 'Confirmed', count: confirmedCount },
          { id: 'shipped', label: 'Shipped / Out', count: shippedCount },
          { id: 'delivered', label: 'Delivered', count: deliveredCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
              statusFilter === tab.id
                ? 'bg-teal-800 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                statusFilter === tab.id ? 'bg-teal-950 text-amber-300' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((ord) => (
          <div
            key={ord.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-teal-300 transition-colors"
          >
            {/* Header: Order ID, Timestamp & Live Status Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-teal-900">{ord.id}</span>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    Placed on: {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <span className="text-xs text-slate-600">
                  Customer: <strong className="text-slate-900">{ord.customerName}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-600">Update Status:</span>
                <select
                  value={ord.status}
                  onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                  className="px-3.5 py-2 bg-teal-50/80 border border-teal-300 rounded-xl text-xs font-black text-teal-950 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                >
                  <option value="Order Placed">Order Placed (Pending)</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing / Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Middle Grid: Customer Details, Delivery Address & Payment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
              {/* Customer Contact */}
              <div className="space-y-1.5">
                <span className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider block">
                  Customer Contact
                </span>
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Phone className="w-3.5 h-3.5 text-teal-700" />
                  <a href={`tel:${ord.phone}`} className="hover:underline">
                    {ord.phone}
                  </a>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-teal-700" />
                  <a href={`mailto:${ord.email}`} className="hover:underline truncate">
                    {ord.email}
                  </a>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1">
                <span className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-700" />
                  Shipping Destination
                </span>
                <p className="font-semibold text-slate-800">{ord.shippingAddress.addressLine}</p>
                <p className="text-slate-600">
                  {ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.pincode}
                </p>
              </div>

              {/* Payment Info */}
              <div className="space-y-1.5">
                <span className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider block">
                  Payment & Total
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold flex items-center gap-1 text-slate-800">
                    {ord.paymentMethod === 'Online Payment' ? (
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Banknote className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {ord.paymentMethod}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      ord.paymentStatus === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {ord.paymentStatus}
                  </span>
                </div>
                {ord.transactionId && (
                  <p className="text-[11px] text-slate-500 truncate">Ref: {ord.transactionId}</p>
                )}
                <div className="pt-1 text-sm font-black text-teal-950">
                  Total Paid: ₹{ord.totalAmount}
                </div>
              </div>
            </div>

            {/* Items Ordered List */}
            <div className="space-y-2">
              <span className="font-extrabold text-slate-800 uppercase text-[10px] tracking-wider block">
                Ordered Products ({ord.items.length} items)
              </span>
              <div className="divide-y divide-slate-100">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-900 font-black flex items-center justify-center text-[10px]">
                        {item.quantity}×
                      </span>
                      <span className="font-bold text-slate-900">{item.productName}</span>
                      <span className="text-slate-400">({item.weight})</span>
                    </div>
                    <span className="font-black text-slate-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No orders found</h3>
            <p className="text-xs text-slate-400">
              There are no orders matching this filter or search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
