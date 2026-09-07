import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductPackGraphic } from '../components/common/ProductPackGraphic';
import {
  Search,
  Filter,
  Star,
  ShoppingBag,
  Heart,
  Sparkles,
  Zap,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    products,
    addToCart,
    navigateToProduct,
    wishlist,
    toggleWishlist,
    searchQuery,
    setSearchQuery,
    setActivePage,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const categories = ['All', 'Raw', 'Roasted', 'Flavored', 'Combo'];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured
  });

  const handleBuyNow = (product: any) => {
    addToCart(product, 1);
    setActivePage('checkout');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0D6E6B] via-[#0A5D5A] to-[#127F7B] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="text-xs font-black uppercase tracking-widest text-teal-100 bg-white/20 px-3.5 py-1 rounded-full border border-white/30">
              Doctor Makhana Shop
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              100% Premium Quality Fox Nuts
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 leading-relaxed font-medium">
              Explore our range of raw lotus seeds and gourmet roasted flavors.
              Freshly sealed in airtight packaging for ultimate crunchiness.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search makhana products..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  selectedCategory === cat
                    ? 'bg-teal-700 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-200">
            <p className="text-base font-bold text-slate-800 mb-2">
              No products found
            </p>
            <p className="text-xs text-slate-500 mb-4">
              Try adjusting your search query or switching categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-2xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Badges */}
                  <div className="absolute top-6 left-6 z-20 flex flex-col gap-1.5 items-start">
                    {product.isComingSoon ? (
                      <span className="bg-[#127F7B] text-white font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md tracking-widest border border-teal-300">
                        COMING SOON
                      </span>
                    ) : (
                      <>
                        {product.isBestSeller && (
                          <span className="bg-amber-400 text-teal-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-sm tracking-wider">
                            Best Seller
                          </span>
                        )}
                        {product.badge && product.badge !== 'Available Now' && (
                          <span className="bg-teal-800 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-sm tracking-wider">
                            {product.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-6 right-6 z-20 p-2 rounded-full border transition-all ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-200 text-rose-500'
                        : 'bg-white/90 border-slate-200 text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted ? 'fill-rose-500' : ''
                      }`}
                    />
                  </button>

                  {/* Product Pack Graphic */}
                  <div
                    onClick={() => navigateToProduct(product.id)}
                    className="cursor-pointer my-4 p-4 rounded-2xl bg-teal-50/30 group-hover:bg-teal-50/80 transition-colors flex items-center justify-center"
                  >
                    <ProductPackGraphic
                      type="front"
                      weight={product.weight}
                      price={product.price}
                      productName={product.name}
                      className="w-full h-auto max-w-[190px] group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">
                        ({product.reviewCount})
                      </span>
                    </div>

                    <h3
                      onClick={() => navigateToProduct(product.id)}
                      className="font-extrabold text-slate-900 text-base hover:text-teal-700 cursor-pointer transition-colors line-clamp-2"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">
                            Net Wt: {product.weight}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-teal-900">
                              ₹{product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: Add to Cart & Buy Now OR Coming Soon */}
                      {product.isComingSoon ? (
                        <button
                          onClick={() => navigateToProduct(product.id)}
                          className="w-full bg-[#E4F5F2] hover:bg-[#D3EEEA] text-[#0D4D4A] border border-[#9CE3DC] font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm group"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#127F7B] animate-pulse"></span>
                          <span>Coming Soon • View Details</span>
                        </button>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="bg-white border-2 border-teal-700 text-teal-800 hover:bg-teal-50 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Add
                          </button>
                          <button
                            onClick={() => handleBuyNow(product)}
                            className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                            Buy Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
