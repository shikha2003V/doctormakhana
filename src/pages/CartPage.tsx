import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductPackGraphic } from '../components/common/ProductPackGraphic';
import { getProductDisplayImage } from '../utils/productUtils';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  ArrowLeft,
  X,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    setActivePage,
    navigateToProduct,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [couponError, setCouponError] = useState('');

  const shippingFee = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 40;
  const freeShippingThreshold = 499;
  const amountNeededForFreeShipping = Math.max(
    0,
    freeShippingThreshold - cartSubtotal
  );
  const totalAmount = cartSubtotal + shippingFee - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME10') {
      const disc = Math.round(cartSubtotal * 0.1);
      setDiscountAmount(disc);
      setCouponApplied('WELCOME10 (10% OFF)');
      setCouponCode('');
    } else if (code === 'MAKHANA50') {
      setDiscountAmount(50);
      setCouponApplied('MAKHANA50 (₹50 OFF)');
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 or MAKHANA50');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage('shop')}
              className="p-2 bg-white text-slate-600 hover:text-teal-700 rounded-xl shadow-sm border border-slate-200 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Shopping Cart
              </h1>
              <p className="text-xs text-slate-500">
                Review your items and proceed to secure checkout
              </p>
            </div>
          </div>
          <span className="text-sm font-bold text-teal-800 bg-teal-100 px-3 py-1 rounded-full border border-teal-200">
            {cart.reduce((s, i) => s + i.quantity, 0)} Items
          </span>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm border border-slate-200 my-8">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-700">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Your cart is empty!
            </h2>
            <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
              Add Doctor Makhana Premium Fox Nuts to experience crunchy, healthy
              snacking today.
            </p>
            <button
              onClick={() => setActivePage('shop')}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-teal-800/20 transition-all text-sm inline-flex items-center gap-2"
            >
              Start Shopping Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Meter */}
              <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white p-4 rounded-2xl shadow-sm border border-teal-700">
                {amountNeededForFreeShipping > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-amber-400" />
                        Add ₹{amountNeededForFreeShipping} more for FREE
                        Shipping!
                      </span>
                      <span className="text-amber-300">
                        ₹{cartSubtotal} / ₹{freeShippingThreshold}
                      </span>
                    </div>
                    <div className="w-full bg-teal-950 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            (cartSubtotal / freeShippingThreshold) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Truck className="w-4 h-4 text-amber-400" />
                    Congratulations! You qualified for FREE Express Shipping.
                  </div>
                )}
              </div>

              {/* Items Card List */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Product Graphic Thumbnail */}
                      <button
                        onClick={() => navigateToProduct(item.product.id)}
                        className="w-20 h-24 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-teal-50/30 group"
                      >
                        <ProductPackGraphic
                          type="front"
                          weight={item.product.weight}
                          price={item.product.price}
                          productName={item.product.name}
                          customImageSrc={getProductDisplayImage(item.product)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </button>

                      <div>
                        <button
                          onClick={() => navigateToProduct(item.product.id)}
                          className="font-bold text-slate-800 text-base hover:text-teal-700 text-left transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </button>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Net Weight: {item.product.weight} • {item.product.category}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-base font-black text-teal-800">
                            ₹{item.product.price}
                          </span>
                          {item.product.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{item.product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector & Item Total */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                      <div className="flex items-center gap-2 border-2 border-slate-200 rounded-xl px-2 py-1 bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, -1)}
                          className="p-1 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-extrabold text-slate-800 w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, 1)}
                          className="p-1 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-medium">
                          Total
                        </span>
                        <span className="text-lg font-black text-slate-900">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setActivePage('shop')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition-colors"
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                Order Summary
              </h2>

              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-teal-600" /> Apply Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-teal-600 uppercase"
                  />
                  <button
                    type="submit"
                    className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {couponApplied && (
                  <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-200">
                    <span>Applied: {couponApplied}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDiscountAmount(0);
                        setCouponApplied('');
                      }}
                      className="text-emerald-900 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="text-[11px] font-semibold text-rose-600">
                    {couponError}
                  </p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm border-t border-b border-slate-100 py-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">
                    ₹{cartSubtotal}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-slate-800">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount Coupon</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Payable</span>
                  <span className="text-teal-800 text-xl">₹{totalAmount}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => setActivePage('checkout')}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-800/20 transition-all text-sm flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-500 space-y-2">
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Safe &
                  Secure Cash on Delivery
                </div>
                <p className="text-[11px] leading-relaxed">
                  Your order is packed under hygienic FSSAI standards. Pay
                  conveniently at your doorstep when delivered.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    setActivePage,
    navigateToProduct,
  } = useStore();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-teal-900 text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <h2 className="font-extrabold text-base tracking-tight">
              Your Shopping Cart
            </h2>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1 text-teal-200 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-teal-200 mx-auto" />
              <p className="font-bold text-slate-800">Your cart is empty</p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setActivePage('shop');
                }}
                className="bg-teal-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow"
              >
                Explore Doctor Makhana
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateToProduct(item.product.id);
                  }}
                  className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-white"
                >
                  <ProductPackGraphic
                    type="front"
                    weight={item.product.weight}
                    price={item.product.price}
                    productName={item.product.name}
                    customImageSrc={getProductDisplayImage(item.product)}
                    className="w-full h-full object-cover"
                  />
                </button>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 text-xs truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    ₹{item.product.price} × {item.quantity}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, -1)}
                      className="w-5 h-5 bg-white border border-slate-300 rounded flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, 1)}
                      className="w-5 h-5 bg-white border border-slate-300 rounded flex items-center justify-center font-bold text-xs text-teal-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-900 text-sm block">
                    ₹{item.product.price * item.quantity}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[10px] text-rose-500 hover:underline mt-1 block"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-600">Subtotal</span>
              <span className="text-teal-800 text-lg">₹{cartSubtotal}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setActivePage('cart');
                }}
                className="w-full bg-white border-2 border-slate-200 text-slate-800 font-bold py-3 rounded-xl text-xs hover:border-teal-600 transition-colors"
              >
                View Cart
              </button>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setActivePage('checkout');
                }}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 rounded-xl text-xs shadow transition-colors"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
