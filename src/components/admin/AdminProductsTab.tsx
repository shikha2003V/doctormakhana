import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/ecommerce';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { ProductPackGraphic } from '../common/ProductPackGraphic';

interface AdminProductsTabProps {
  onOpenAdd: () => void;
  onOpenEdit: (product: Product) => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  onOpenAdd,
  onOpenEdit,
}) => {
  const { products, deleteProduct, togglePublishProduct, refreshProducts, isDbLoading } =
    useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'published' | 'drafts'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.weight.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();

    const isPub = p.isPublished !== false;
    const matchesVisibility =
      visibilityFilter === 'all' ||
      (visibilityFilter === 'published' && isPub) ||
      (visibilityFilter === 'drafts' && !isPub);

    return matchesSearch && matchesCategory && matchesVisibility;
  });

  const publishedCount = products.filter((p) => p.isPublished !== false).length;
  const draftCount = products.filter((p) => p.isPublished === false).length;

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">Product Catalog Management</h2>
            <span className="bg-teal-100 text-teal-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
              {products.length} Products
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage live prices, stock levels, packaging images, and visibility on the customer website.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => refreshProducts()}
            disabled={isDbLoading}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Refresh from Server DB"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDbLoading ? 'animate-spin' : ''}`} />
            Sync DB
          </button>

          <button
            onClick={onOpenAdd}
            className="flex-1 md:flex-initial px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            Add New Product
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product name, weight..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="all">All Flavors & Categories</option>
            <option value="raw">Raw</option>
            <option value="roasted">Roasted</option>
            <option value="flavored">Flavored</option>
            <option value="combo">Combo</option>
          </select>

          {/* Visibility Filter Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setVisibilityFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                visibilityFilter === 'all' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setVisibilityFilter('published')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                visibilityFilter === 'published' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500'
              }`}
            >
              Live ({publishedCount})
            </button>
            <button
              onClick={() => setVisibilityFilter('drafts')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                visibilityFilter === 'drafts' ? 'bg-white text-amber-800 shadow-sm' : 'text-slate-500'
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => {
          const isLive = p.isPublished !== false;
          const imageSrc =
            p.customImages && p.customImages.length > 0
              ? p.customImages[p.mainImageIndex || 0] || p.customImages[0]
              : undefined;

          return (
            <div
              key={p.id}
              className={`bg-white rounded-3xl p-5 border transition-all space-y-4 shadow-sm relative flex flex-col justify-between ${
                isLive ? 'border-slate-200 hover:border-teal-300' : 'border-amber-200 bg-amber-50/20'
              }`}
            >
              {/* Card Top: Image & Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-20 h-24 shrink-0 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-1">
                    <ProductPackGraphic
                      customImageSrc={imageSrc}
                      productName={p.name}
                      weight={p.weight}
                      price={p.price}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="bg-teal-50 text-teal-800 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-teal-200">
                        {p.category}
                      </span>
                      {p.isComingSoon && (
                        <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded">
                          Coming Soon
                        </span>
                      )}
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                          isLive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {isLive ? '● Live on Store' : '○ Draft (Hidden)'}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 line-clamp-2 leading-tight">
                      {p.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Net Wt: <strong>{p.weight}</strong> • {p.productType}
                    </span>
                  </div>
                </div>

                {/* Pricing & Stock Bar */}
                <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Store Price</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-teal-900">₹{p.price}</span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="text-[11px] text-slate-400 line-through">₹{p.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">Stock Status</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        p.stock > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.stock > 0 ? `${p.stock} units (In Stock)` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => togglePublishProduct(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    isLive
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                  title={isLive ? 'Unpublish to hide from store' : 'Publish to show on live store'}
                >
                  {isLive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {isLive ? 'Hide (Draft)' : 'Publish Live'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenEdit(p)}
                    className="px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-900 hover:bg-teal-100 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-teal-700" />
                    Edit
                  </button>

                  {deleteConfirmId === p.id ? (
                    <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-xl border border-rose-200">
                      <button
                        onClick={() => {
                          deleteProduct(p.id);
                          setDeleteConfirmId(null);
                        }}
                        className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-1.5 py-0.5 text-slate-500 text-[10px] font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No products match your search/filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or category filters, or click "Add New Product" to create one.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setVisibilityFilter('all');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
