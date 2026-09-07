import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductPackGraphic } from '../components/common/ProductPackGraphic';
import {
  doctorMakhanaPackagingReal,
  doctorMakhanaFront,
  doctorMakhanaBack,
  doctorMakhanaCloseup,
  doctorMakhanaLifestyleKitchen,
  doctorMakhanaPosterFacts,
} from '../assets/images';

import {
  Star,
  ShoppingBag,
  Zap,
  Heart,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  CheckCircle2,
  ArrowLeft,
  Share2,
  MessageSquare,
  Award,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    addToCart,
    wishlist,
    toggleWishlist,
    reviews,
    addReview,
    setActivePage,
    navigateToProduct,
    showToast,
  } = useStore();

  const [selectedView, setSelectedView] = useState<
    'front' | 'back' | 'closeup' | 'lifestyle' | 'poster' | 'kitchen' | 'real'
  >('real');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'nutrition' | 'reviews'>(
    'details'
  );

  // Review Form State
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [notifyContact, setNotifyContact] = useState('');
  const [notifiedDone, setNotifiedDone] = useState(false);

  const product =
    products.find((p) => p.id === selectedProductId) || products[0];

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleBuyNow = () => {
    if (product.isComingSoon) return;
    addToCart(product, quantity);
    setActivePage('checkout');
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyContact) return;
    setNotifiedDone(true);
    showToast(`We will notify you at ${notifyContact} as soon as ${product.name} launches!`, 'success');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewComment) {
      showToast('Please fill in your name and review comment.', 'warning');
      return;
    }
    addReview({
      productId: product.id,
      userName: newReviewName,
      userCity: newReviewCity || 'India',
      rating: newReviewRating,
      title: newReviewTitle || 'Great quality makhana!',
      comment: newReviewComment,
      verifiedPurchase: true,
    });
    setNewReviewName('');
    setNewReviewCity('');
    setNewReviewTitle('');
    setNewReviewComment('');
  };

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Link */}
        <button
          onClick={() => setActivePage('shop')}
          className="text-xs font-bold text-slate-600 hover:text-teal-700 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 w-fit transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </button>

        {/* Product Showcase Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Image Gallery & Graphic Switcher */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-b from-teal-50 to-slate-50 rounded-3xl p-6 border border-slate-200 min-h-[380px] flex items-center justify-center relative overflow-hidden">
              <ProductPackGraphic
                type={selectedView}
                weight={product.weight}
                price={product.price}
                productName={product.name}
                className="w-full h-auto max-w-xs shadow-xl"
              />

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full border shadow-md transition-all ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500'
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`}
                />
              </button>
            </div>

            {/* Gallery Views Switcher with Rich Thumbnails */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'real', label: 'Packaging', img: doctorMakhanaPackagingReal },
                { id: 'kitchen', label: 'Bowl Setup', img: doctorMakhanaLifestyleKitchen },
                { id: 'front', label: 'Front Pack', img: doctorMakhanaFront },
                { id: 'poster', label: 'Poster Facts', img: doctorMakhanaPosterFacts },
                { id: 'back', label: 'Back Panel', img: doctorMakhanaBack },
                { id: 'closeup', label: 'Close-Up', img: doctorMakhanaCloseup },
              ].map((item) => (

                <button
                  key={item.id}
                  onClick={() => setSelectedView(item.id as any)}
                  className={`p-1.5 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                    selectedView === item.id
                      ? 'border-teal-700 bg-teal-50 text-teal-900 shadow-md ring-2 ring-teal-500/30'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <img
                      src={item.img}
                      alt={item.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold leading-tight text-center line-clamp-1">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Meta & Purchase Panel */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {product.isComingSoon ? (
                  <span className="bg-[#127F7B] text-white text-xs font-black uppercase px-3.5 py-1 rounded-full shadow-sm tracking-widest border border-teal-300">
                    COMING SOON
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-emerald-200">
                    In Stock & Available
                  </span>
                )}
                <span className="bg-teal-100 text-teal-800 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-teal-200">
                  Brand: {product.productType || 'Doctor Makhana'}
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-amber-200">
                  Packet Size: {product.weight}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {product.name}
              </h1>

              <p className="text-xs font-bold text-teal-700 uppercase tracking-widest mt-1">
                {product.tagline || 'The Crispy Taste For Health'}
              </p>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 text-amber-600 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating} / 5.0</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Based on {productReviews.length || product.reviewCount} verified ratings
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-teal-50/80 p-4 rounded-2xl border border-teal-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block font-bold uppercase">
                  {product.isComingSoon ? 'Expected Launch Price' : 'Special Offer Price'}
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-teal-900">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      M.R.P.: ₹{product.originalPrice}
                    </span>
                  )}
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Save ₹{(product.originalPrice || 299) - product.price}
                  </span>
                </div>
              </div>

              <div className="text-right text-xs font-bold text-slate-700">
                {product.isComingSoon ? (
                  <span className="text-teal-700 font-extrabold block">⏳ Launching Soon</span>
                ) : (
                  <span className="text-emerald-700 block">✓ In Stock ({product.stock} units)</span>
                )}
                <span className="text-[10px] text-slate-500 font-normal">
                  Inclusive of all taxes
                </span>
              </div>
            </div>

            {/* Variant / Weight Selector for Raw Fox Nuts */}
            {(product.id.startsWith('dm-raw-') && product.id !== 'dm-raw-2x250g') && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase flex items-center justify-between">
                  <span>Select Packet Size:</span>
                  <span className="text-teal-700 font-extrabold text-[11px]">{product.weight} (Active)</span>
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'dm-raw-100g', label: '100g', price: 180, tag: 'Trial Pack' },
                    { id: 'dm-raw-200g', label: '200g', price: 379, tag: 'Standard' },
                    { id: 'dm-raw-250g', label: '250g', price: 399, tag: 'Most Popular' },
                  ].map((variant) => {
                    const isSelected = product.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => navigateToProduct(variant.id)}
                        className={`p-2.5 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-teal-700 bg-teal-50 shadow-sm ring-2 ring-teal-500/20'
                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-black ${isSelected ? 'text-teal-950' : 'text-slate-800'}`}>
                            {variant.label}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            ₹{variant.price}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                          {variant.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Flavour Selector for Flavoured Range */}
            {(product.category === 'Flavored' || product.category === 'Roasted') && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase flex items-center justify-between">
                  <span>Flavoured Range (Coming Soon):</span>
                  <span className="text-amber-700 font-extrabold text-[11px] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    Launching Soon
                  </span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'dm-roasted-salted-250g', name: 'Roasted Makhana', price: 418, tag: 'Coming Soon' },
                    { id: 'dm-peri-peri-250g', name: 'Peri Peri Makhana', price: 429, tag: 'Coming Soon' },
                    { id: 'dm-mint-pudina-250g', name: 'Pudina Mint', price: 289, tag: 'Coming Soon' },
                  ].map((flav) => {
                    const isSelected = product.id === flav.id;
                    return (
                      <button
                        key={flav.id}
                        onClick={() => navigateToProduct(flav.id)}
                        className={`p-2.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-teal-700 bg-teal-50 shadow-sm ring-2 ring-teal-500/20'
                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-black line-clamp-1 ${isSelected ? 'text-teal-950' : 'text-slate-800'}`}>
                            {flav.name}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            ₹{flav.price}
                          </span>
                        </div>
                        <span className="text-[10px] text-amber-700 block mt-0.5 font-semibold">
                          {flav.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 250g / Twin Pack Packaging Explanatory Card */}
            {product.id === 'dm-raw-2x250g' && (
              <div className="p-3.5 bg-amber-50/90 border border-amber-300 rounded-2xl text-xs text-amber-900 font-medium space-y-1">
                <div className="font-black text-amber-950 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-amber-700" />
                  Twin Pack Contents Breakdown:
                </div>
                <p className="text-[11px] leading-relaxed">
                  This option delivers <strong>two individual 250g sealed packets</strong> of Doctor Makhana (making a total weight of <strong>500g</strong>). We do not produce a single oversized 500g pouch to ensure maximum freshness across each 250g seal.
                </p>
              </div>
            )}

            {/* Key Highlights Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Product Highlights:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                {product.highlights.map((hl, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase CTAs or Coming Soon Notification Box */}
            {product.isComingSoon ? (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-[#0D4D4A] font-black text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-ping"></span>
                    <span>Flavoured Makhana • Launching Soon!</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Our gourmet flavored range (Roasted Makhana, Peri Peri, and Pudina Punch) is currently under preparation and will be launching soon. Our signature <strong>100g, 200g, and 250g Raw Fox Nuts</strong> are available to order now! Enter your phone or email below to receive an instant launch alert.
                  </p>

                  {notifiedDone ? (
                    <div className="bg-white border border-emerald-300 p-3 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Thank you! We will notify you at <strong>{notifyContact}</strong> when {product.name} launches.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleNotifySubmit} className="flex gap-2">
                      <input
                        type="text"
                        value={notifyContact}
                        onChange={(e) => setNotifyContact(e.target.value)}
                        placeholder="Enter your Email or WhatsApp number"
                        className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600 shadow-inner"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-[#0D6E6B] hover:bg-[#0A5855] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow"
                      >
                        Notify Me
                      </button>
                    </form>
                  )}
                </div>

                <button
                  onClick={() => navigateToProduct('dm-raw-250g')}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Order Available 250g Raw Fox Nuts Instead
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Select Quantity:
                  </span>
                  <div className="flex items-center gap-3 border-2 border-slate-200 rounded-xl px-3 py-1.5 bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-slate-600 hover:text-teal-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-extrabold text-slate-900 w-8 text-center text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-slate-600 hover:text-teal-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="bg-white border-2 border-teal-700 text-teal-800 hover:bg-teal-50 font-bold py-4 rounded-2xl shadow-sm text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <ShoppingBag className="w-5 h-5" /> Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-800/20 text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <Zap className="w-5 h-5 text-amber-300" /> Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <Truck className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Fast Cash on Delivery Available</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <span>100% Moisture Proof Sealed Pouch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info Section (Details, Nutrition, Reviews) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
          {/* Tabs header */}
          <div className="flex border-b border-slate-200 gap-6 mb-8 text-sm font-extrabold">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 transition-all relative ${
                activeTab === 'details'
                  ? 'text-teal-800 border-b-2 border-teal-700'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Description & Storage
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`pb-4 transition-all relative ${
                activeTab === 'nutrition'
                  ? 'text-teal-800 border-b-2 border-teal-700'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Nutritional Facts & Ingredients
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 transition-all relative ${
                activeTab === 'reviews'
                  ? 'text-teal-800 border-b-2 border-teal-700'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Reviews ({productReviews.length})
            </button>
          </div>

          {/* Tab 1: Description & Storage */}
          {activeTab === 'details' && (
            <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base mb-2">
                  About Doctor Makhana 250g
                </h3>
                <p>{product.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="bg-teal-50 p-5 rounded-2xl border border-teal-100 space-y-1">
                  <h4 className="font-bold text-teal-900 text-xs uppercase tracking-wider">
                    Storage Instructions:
                  </h4>
                  <p className="text-xs text-slate-700">{product.storageInstructions}</p>
                </div>

                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 space-y-1">
                  <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider">
                    Package Includes:
                  </h4>
                  <p className="text-xs text-slate-700">{product.packageIncludes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Nutritional Facts */}
          {activeTab === 'nutrition' && (
            <div className="space-y-6">
              <div className="max-w-xl">
                <h3 className="font-extrabold text-slate-900 text-base mb-4">
                  Nutritional Breakdown (per 100g approx)
                </h3>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 divide-y divide-slate-200 text-xs">
                  <div className="py-2 flex justify-between font-bold text-slate-800">
                    <span>Energy</span>
                    <span>{product.nutritionalFacts.energy}</span>
                  </div>
                  <div className="py-2 flex justify-between font-bold text-slate-800">
                    <span>Protein</span>
                    <span>{product.nutritionalFacts.protein}</span>
                  </div>
                  <div className="py-2 flex justify-between font-bold text-slate-800">
                    <span>Carbohydrates</span>
                    <span>{product.nutritionalFacts.carbohydrates}</span>
                  </div>
                  <div className="py-2 flex justify-between font-bold text-slate-800">
                    <span>Dietary Fiber</span>
                    <span>{product.nutritionalFacts.dietaryFiber}</span>
                  </div>
                  <div className="py-2 flex justify-between font-bold text-slate-800">
                    <span>Fat</span>
                    <span>{product.nutritionalFacts.fat}</span>
                  </div>
                  <div className="py-2 flex justify-between font-bold text-slate-800">
                    <span>Trans Fat & Cholesterol</span>
                    <span>0.0 g</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <span className="font-extrabold text-slate-900 text-xs uppercase block mb-1">
                  Ingredients:
                </span>
                <p className="text-xs text-slate-600">{product.ingredients}</p>
              </div>
            </div>
          )}

          {/* Tab 3: Customer Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Existing Reviews */}
              <div className="space-y-4">
                {productReviews.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    No customer reviews yet. Be the first to review Doctor Makhana!
                  </p>
                ) : (
                  productReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{rev.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                      <div className="text-[11px] text-slate-500 font-semibold pt-1">
                        By {rev.userName} ({rev.userCity})
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Submit Review Form */}
              <div className="pt-6 border-t border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-base mb-4">
                  Write a Verified Review
                </h4>
                <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={newReviewCity}
                        onChange={(e) => setNewReviewCity(e.target.value)}
                        placeholder="e.g. Bhopal"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Rating
                    </label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-teal-600"
                    >
                      <option value={5}>5 Stars - Excellent</option>
                      <option value={4}>4 Stars - Good</option>
                      <option value={3}>3 Stars - Average</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Review Title
                    </label>
                    <input
                      type="text"
                      value={newReviewTitle}
                      onChange={(e) => setNewReviewTitle(e.target.value)}
                      placeholder="e.g. Extremely crispy & fresh"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Your Detailed Review *
                    </label>
                    <textarea
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Tell us about the crunchiness, roasting, and taste..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="space-y-4 pt-6">
          <h3 className="text-xl font-black text-slate-900">
            More Doctor Makhana Products
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {products
              .filter((p) => p.id !== product.id)
              .slice(0, 3)
              .map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigateToProduct(rel.id)}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-teal-300 transition-all cursor-pointer flex items-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-teal-50 border border-slate-100 shrink-0">
                    <ProductPackGraphic
                      type="front"
                      weight={rel.weight}
                      price={rel.price}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs line-clamp-1 group-hover:text-teal-700">
                      {rel.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{rel.weight}</p>
                    <span className="text-sm font-black text-teal-900 block mt-1">
                      ₹{rel.price}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
