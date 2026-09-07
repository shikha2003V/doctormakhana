import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductPackGraphic } from '../components/common/ProductPackGraphic';
import { Order } from '../types/ecommerce';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  Package,
  AlertCircle,
  MapPin,
} from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { findOrderByPhoneOrId, orders } = useStore();

  const [queryInput, setQueryInput] = useState('8989214183'); // Pre-fill with sample for instant preview!
  const [matchedOrders, setMatchedOrders] = useState<Order[]>(() =>
    findOrderByPhoneOrId('8989214183')
  );
  const [hasSearched, setHasSearched] = useState(true);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    const results = findOrderByPhoneOrId(queryInput);
    setMatchedOrders(results);
    setHasSearched(true);
  };

  const statusSteps = [
    'Order Placed',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center shadow-xl space-y-3">
          <div className="w-12 h-12 bg-amber-400/20 text-amber-300 rounded-2xl flex items-center justify-center mx-auto border border-amber-400/30">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Track Your Doctor Makhana Order
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-md mx-auto">
            Enter your 10-digit Phone Number or Order ID (e.g. DM-1001) to view
            real-time shipment timeline.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleTrackSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto pt-2"
          >
            <div className="relative flex-1">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Phone No (8989214183) or Order ID (DM-1001)"
                className="w-full pl-9 pr-4 py-3 bg-white text-slate-900 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-300 text-teal-950 font-black px-6 py-3 rounded-xl text-xs shadow transition-all shrink-0"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="space-y-6">
            {matchedOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  No order found for the entered details.
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Please check the phone number or order ID. Try searching with
                  <strong className="text-teal-800"> 8989214183 </strong> or
                  <strong className="text-teal-800"> DM-1001</strong>.
                </p>
              </div>
            ) : (
              matchedOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
                >
                  {/* Order Top Summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-slate-900">
                          Order ID: {ord.id}
                        </span>
                        <span className="bg-teal-100 text-teal-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded border border-teal-200 uppercase">
                          {ord.status}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5 block">
                        Placed on:{' '}
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 block font-semibold">
                        Total Amount
                      </span>
                      <span className="text-lg font-black text-teal-900">
                        ₹{ord.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Order Visual Timeline */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      Live Delivery Timeline
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[10px] pt-2">
                      {statusSteps.map((stepName, idx) => {
                        const stepData = ord.timeline.find(
                          (t) => t.status === stepName
                        );
                        const isCompleted = stepData?.completed || false;
                        const isCurrent = ord.status === stepName;

                        return (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                              isCurrent
                                ? 'bg-amber-50 border-amber-400 shadow-sm'
                                : isCompleted
                                ? 'bg-emerald-50 border-emerald-200'
                                : 'bg-slate-50 border-slate-200 opacity-60'
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-[10px] ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : isCurrent
                                  ? 'bg-amber-400 text-teal-950'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {isCompleted ? '✓' : idx + 1}
                            </div>
                            <span
                              className={`font-bold leading-tight ${
                                isCompleted || isCurrent
                                  ? 'text-slate-900'
                                  : 'text-slate-400'
                              }`}
                            >
                              {stepName}
                            </span>
                            <span className="text-[9px] text-slate-500">
                              {stepData?.timestamp !== 'Pending'
                                ? stepData?.timestamp
                                : ''}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Products in this Order */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <span className="text-xs font-bold text-slate-700 block uppercase">
                      Items in Order:
                    </span>
                    <div className="divide-y divide-slate-200">
                      {ord.items.map((item, i) => (
                        <div
                          key={i}
                          className="pt-2 first:pt-0 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-extrabold text-slate-800">
                              {item.productName}
                            </span>
                            <span className="text-slate-500 block text-[10px]">
                              Qty: {item.quantity} • Net Wt: {item.weight}
                            </span>
                          </div>
                          <span className="font-black text-slate-900">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="text-xs text-slate-600 flex items-center justify-between pt-2">
                    <div>
                      <span>Delivery to: </span>
                      <strong className="text-slate-900">
                        {ord.shippingAddress.fullName} ({ord.shippingAddress.city})
                      </strong>
                    </div>
                    <span className="bg-teal-50 text-teal-800 font-bold px-2.5 py-1 rounded border border-teal-200">
                      {ord.paymentMethod}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
