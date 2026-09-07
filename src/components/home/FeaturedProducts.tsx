import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductPackGraphic } from '../common/ProductPackGraphic';
import { Star, ShoppingBag, ArrowRight, Heart } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const { products, addToCart, navigateToProduct, wishlist, toggleWishlist, setActivePage } =
    useStore();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#0D4D4A] bg-[#E1F6F4] px-3.5 py-1.5 rounded-full border border-[#A4E7E2]">
              Our Products
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0D4D4A] tracking-tight mt-3">
              Explore Our Makhana Collection
            </h2>
            <p className="text-sm text-slate-600 font-medium max-w-xl mt-1">
              Hand-picked, perfectly sized, and packed in fresh, airtight pouches
              to preserve natural flavor and crispiness.
            </p>
          </div>

          <button
            onClick={() => setActivePage('shop')}
            className="text-xs font-extrabold text-[#0D4D4A] hover:text-[#0A5D5A] flex items-center gap-2 bg-[#E8F8F5] px-5 py-3 rounded-xl border border-[#A4E7E2] transition-all hover:bg-[#D5F2ED] w-fit"
          >
            View All Products <ArrowRight className="w-4 h-4 text-[#127F7B]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-2xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Badges */}
                <div className="absolute top-8 left-8 z-20 flex flex-col gap-1.5 items-start">
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
                  className={`absolute top-8 right-8 z-20 p-2 rounded-full border transition-all ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'bg-white/80 border-slate-200 text-slate-400 hover:text-rose-500'
                  }`}
                  title="Toggle Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>

                {/* Graphic Product Pack Clickable */}
                <div
                  onClick={() => navigateToProduct(product.id)}
                  className="cursor-pointer my-4 p-4 rounded-2xl bg-gradient-to-b from-teal-50/50 to-white flex items-center justify-center transition-transform group-hover:scale-105"
                >
                  <ProductPackGraphic
                    type="front"
                    weight={product.weight}
                    price={product.price}
                    productName={product.name}
                    className="w-full h-auto max-w-[200px]"
                  />
                </div>

                {/* Info & Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">
                      ({product.reviewCount} reviews)
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

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400 block font-semibold">
                        Net Wt: {product.weight}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-teal-900">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through font-medium">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {product.isComingSoon ? (
                      <button
                        onClick={() => navigateToProduct(product.id)}
                        className="bg-[#E4F5F2] hover:bg-[#D3EEEA] text-[#0D4D4A] border border-[#9CE3DC] font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs shadow-sm"
                        title="Coming Soon - Click for details"
                      >
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                        Coming Soon
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="bg-teal-700 hover:bg-teal-800 text-white font-bold p-3 rounded-xl shadow-md shadow-teal-800/20 transition-all flex items-center gap-2 text-xs"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-4 h-4 text-amber-300" />
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
