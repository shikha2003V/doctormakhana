import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { GoogleDriveManager } from '../components/common/GoogleDriveManager';
import {
  CheckCircle,
  Package,
  Truck,
  ArrowRight,
  Phone,
  Calendar,
  Clock,
  ShieldCheck,
  HardDrive,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { currentOrder, setActivePage } = useStore();
  const [isDriveOpen, setIsDriveOpen] = useState(false);

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-800">No active order found</h2>
          <button
            onClick={() => setActivePage('shop')}
            className="bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow"
          >
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Success Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="bg-emerald-100 text-emerald-900 font-black text-xs px-3.5 py-1 rounded-full border border-emerald-200 uppercase tracking-widest inline-block">
            Order Confirmed
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Your order has been placed successfully!
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Thank you for choosing Doctor Makhana. We are preparing your fresh,
            moisture-proof sealed makhana parcel for express dispatch.
          </p>

          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 px-4 py-2 rounded-xl text-teal-900 font-extrabold text-sm">
            <span>Order ID:</span>
            <span className="text-amber-600">{currentOrder.id}</span>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Truck className="w-5 h-5 text-teal-700" />
            Order Progress Status
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[10px]">
            {currentOrder.timeline.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold border ${
                    step.completed
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}
                >
                  {step.completed ? '✓' : idx + 1}
                </div>
                <span
                  className={`font-bold leading-tight ${
                    step.completed ? 'text-teal-900' : 'text-slate-400'
                  }`}
                >
                  {step.status}
                </span>
                <span className="text-[9px] text-slate-400">
                  {step.timestamp !== 'Pending' ? step.timestamp : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Receipt & Customer Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
            Order Receipt Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <span className="font-bold text-teal-900 uppercase block">
                Shipping Address:
              </span>
              <p className="font-extrabold text-slate-900">
                {currentOrder.shippingAddress.fullName}
              </p>
              <p>{currentOrder.shippingAddress.addressLine}</p>
              <p>
                {currentOrder.shippingAddress.city},{' '}
                {currentOrder.shippingAddress.state} -{' '}
                {currentOrder.shippingAddress.pincode}
              </p>
              <p className="font-semibold text-slate-800">
                Phone: {currentOrder.shippingAddress.mobileNumber}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <span className="font-bold text-teal-900 uppercase block">
                Payment Info:
              </span>
              <p className="font-semibold">
                Method:{' '}
                <strong className="text-slate-900">{currentOrder.paymentMethod}</strong>
              </p>
              <p className="font-semibold">
                Payment Status:{' '}
                {currentOrder.paymentStatus === 'Paid' ? (
                  <span className="text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1 border border-emerald-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Paid Online (Success)
                  </span>
                ) : (
                  <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold border border-amber-300">
                    Pending (Pay ₹{currentOrder.totalAmount} on delivery)
                  </span>
                )}
              </p>
              {currentOrder.transactionId && (
                <p className="font-mono text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                  <span className="font-sans font-bold text-slate-800">Txn Ref ID:</span> {currentOrder.transactionId}
                </p>
              )}
              <p className="text-slate-500 text-[11px] pt-1">
                Estimated Delivery: {currentOrder.estimatedDelivery}
              </p>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div className="divide-y divide-slate-100 border-t border-b border-slate-100 py-4 space-y-3">
            {currentOrder.items.map((item, i) => (
              <div key={i} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-slate-900 block">
                    {item.productName}
                  </span>
                  <span className="text-slate-500">
                    Net Wt: {item.weight} • Qty: {item.quantity} × ₹{item.price}
                  </span>
                </div>
                <span className="font-black text-teal-900 text-sm">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-2">
            <span>Total Payable Amount</span>
            <span className="text-teal-800 text-xl">
              ₹{currentOrder.totalAmount}
            </span>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <button
              onClick={() => setIsDriveOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow text-xs flex items-center justify-center gap-2 transition-all"
            >
              <HardDrive className="w-4 h-4 text-emerald-200" /> Save Invoice to Google Drive
            </button>

            <button
              onClick={() => setActivePage('track-order')}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-3.5 rounded-xl shadow text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Truck className="w-4 h-4" /> Track Order Status
            </button>

            <button
              onClick={() => setActivePage('shop')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Google Drive Save Modal */}
      {currentOrder && (
        <GoogleDriveManager
          isOpen={isDriveOpen}
          onClose={() => setIsDriveOpen(false)}
          autoSaveData={{
            title: `Save Order Invoice #${currentOrder.id}`,
            filename: `Doctor_Makhana_Invoice_${currentOrder.id}.txt`,
            content: `====================================================
DOCTOR MAKHANA - TAX INVOICE & ORDER RECEIPT
The Crispy Taste For Health
====================================================

Order ID: ${currentOrder.id}
Date: ${currentOrder.date}
Status: ${currentOrder.status}
Payment Method: ${currentOrder.paymentMethod} (${currentOrder.paymentStatus})
Estimated Delivery: ${currentOrder.estimatedDelivery}

CUSTOMER & SHIPPING ADDRESS:
----------------------------------------------------
Name: ${currentOrder.shippingAddress.fullName}
Address: ${currentOrder.shippingAddress.addressLine}
Location: ${currentOrder.shippingAddress.city}, ${currentOrder.shippingAddress.state} - ${currentOrder.shippingAddress.pincode}
Phone: ${currentOrder.shippingAddress.mobileNumber}
Email: ${currentOrder.email}

ORDER ITEMS:
----------------------------------------------------
${currentOrder.items
  .map(
    (item) =>
      `- ${item.productName} (${item.weight}) x ${item.quantity} = ₹${
        item.price * item.quantity
      }`
  )
  .join('\n')}

----------------------------------------------------
TOTAL AMOUNT: ₹${currentOrder.totalAmount}
====================================================
Thank you for choosing Doctor Makhana!
Contact Support: +91 89892 14183 | shikhuverma2804@gmail.com`,
          }}
        />
      )}
    </div>
  );
};
