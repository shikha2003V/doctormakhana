import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductVariant } from '../../types/ecommerce';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Check,
  Plus,
  Layers,
  FileText,
  DollarSign,
  Package,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { ProductPackGraphic } from '../common/ProductPackGraphic';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, uploadProductImage } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active form section
  const [activeTab, setActiveTab] = useState<'details' | 'pricing' | 'images' | 'variants' | 'nutrition'>('details');

  // Form fields
  const [name, setName] = useState(productToEdit?.name || '');
  const [tagline, setTagline] = useState(productToEdit?.tagline || 'The Crispy Taste For Health');
  const [category, setCategory] = useState<any>(productToEdit?.category || 'Raw');
  const [weight, setWeight] = useState(productToEdit?.weight || '250g');
  const [productType, setProductType] = useState(productToEdit?.productType || 'Raw Makhana');
  const [price, setPrice] = useState<number>(productToEdit?.price || 399);
  const [originalPrice, setOriginalPrice] = useState<number>(productToEdit?.originalPrice || 449);
  const [stock, setStock] = useState<number>(productToEdit?.stock ?? 100);
  const [isPublished, setIsPublished] = useState<boolean>(productToEdit?.isPublished !== false);
  const [isComingSoon, setIsComingSoon] = useState<boolean>(productToEdit?.isComingSoon || false);
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [storageInstructions, setStorageInstructions] = useState(
    productToEdit?.storageInstructions || 'Store in a cool, dry place. Reseal tightly after opening.'
  );
  const [ingredients, setIngredients] = useState(
    productToEdit?.ingredients || '100% Handpicked Fox Nuts (Makhana).'
  );
  const [highlights, setHighlights] = useState<string[]>(
    productToEdit?.highlights || ['100% Natural & Vegan', 'Zero Added Preservatives', 'Rich in Protein & Calcium']
  );
  const [highlightInput, setHighlightInput] = useState('');

  // Images state
  const [customImages, setCustomImages] = useState<string[]>(productToEdit?.customImages || []);
  const [mainImageIndex, setMainImageIndex] = useState<number>(productToEdit?.mainImageIndex || 0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Variants state
  const [variants, setVariants] = useState<ProductVariant[]>(
    productToEdit?.variants || [
      { id: 'var-1', weight: productToEdit?.weight || '250g', price: productToEdit?.price || 399, originalPrice: productToEdit?.originalPrice || 449, inStock: true },
    ]
  );
  const [newVariantWeight, setNewVariantWeight] = useState('');
  const [newVariantPrice, setNewVariantPrice] = useState(749);
  const [newVariantMRP, setNewVariantMRP] = useState(849);

  // Nutritional facts
  const [nutrition, setNutrition] = useState({
    energy: productToEdit?.nutritionalFacts?.energy || '350 kcal',
    protein: productToEdit?.nutritionalFacts?.protein || '9.7 g',
    carbohydrates: productToEdit?.nutritionalFacts?.carbohydrates || '76.9 g',
    dietaryFiber: productToEdit?.nutritionalFacts?.dietaryFiber || '7.6 g',
    fat: productToEdit?.nutritionalFacts?.fat || '0.1 g',
    sugar: productToEdit?.nutritionalFacts?.sugar || '0.0 g',
    transFat: productToEdit?.nutritionalFacts?.transFat || '0.0 g',
  });

  if (!isOpen) return null;

  // Handle File Upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          setUploadError('Only image files (PNG, JPG, WEBP) are supported.');
          continue;
        }
        const serverUrl = await uploadProductImage(file, file.name);
        setCustomImages((prev) => [...prev, serverUrl]);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setCustomImages((prev) => prev.filter((_, i) => i !== index));
    if (mainImageIndex >= index && mainImageIndex > 0) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim() && !highlights.includes(highlightInput.trim())) {
      setHighlights((prev) => [...prev, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddVariant = () => {
    if (!newVariantWeight.trim()) return;
    const newVar: ProductVariant = {
      id: 'var-' + Date.now(),
      weight: newVariantWeight.trim(),
      price: Number(newVariantPrice),
      originalPrice: Number(newVariantMRP),
      inStock: true,
    };
    setVariants((prev) => [...prev, newVar]);
    setNewVariantWeight('');
  };

  const handleRemoveVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  // Submit and save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Product Name is required.');
      return;
    }

    const payload: Product = {
      id: productToEdit ? productToEdit.id : `dm-prod-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim() || 'The Crispy Taste For Health',
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price) + 40,
      weight: weight.trim() || '250g',
      category,
      productType: productType.trim() || `${category} Makhana`,
      netQuantity: weight.trim() || '250g',
      images: productToEdit?.images || {
        front: 'pack-front',
        back: 'pack-back',
        closeup: 'pack-closeup',
        lifestyle: 'pack-lifestyle',
      },
      customImages,
      mainImageIndex,
      stock: Number(stock),
      isPublished,
      isComingSoon,
      rating: productToEdit?.rating || 4.8,
      reviewCount: productToEdit?.reviewCount || 1,
      description: description.trim() || 'Premium quality Fox Nuts by Doctor Makhana.',
      highlights: highlights.length > 0 ? highlights : ['100% Natural', 'Gluten Free'],
      nutritionalFacts: nutrition,
      storageInstructions,
      packageIncludes: `1 × ${name}`,
      ingredients,
      variants: variants.length > 0 ? variants : undefined,
    };

    if (productToEdit) {
      await updateProduct(payload);
    } else {
      await addProduct(payload);
    }

    onClose();
  };

  const primaryImageSrc = customImages.length > 0 ? customImages[mainImageIndex] || customImages[0] : undefined;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-teal-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase bg-amber-400 text-teal-950 px-2 py-0.5 rounded">
                {productToEdit ? 'Edit Product' : 'Add New Product'}
              </span>
              <span className="text-xs text-slate-400">Doctor Makhana Live Catalog</span>
            </div>
            <h3 className="text-lg font-black mt-0.5">{productToEdit ? productToEdit.name : 'Create Product Item'}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside Form */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex gap-2 overflow-x-auto">
          {[
            { id: 'details', label: '1. Basic Info', icon: Package },
            { id: 'pricing', label: '2. Pricing & Stock', icon: DollarSign },
            { id: 'images', label: '3. Product Images', icon: ImageIcon },
            { id: 'variants', label: '4. Size Variants', icon: Layers },
            { id: 'nutrition', label: '5. Description & Facts', icon: Activity },
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-800 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Doctor Makhana 250g Raw Fox Nuts"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Tagline / Subheading
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="The Crispy Taste For Health"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Category / Flavor *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-700"
                  >
                    <option value="Raw">Raw Fox Nuts (Unflavored/Classic)</option>
                    <option value="Roasted">Roasted & Lightly Salted</option>
                    <option value="Flavored">Flavored (Peri Peri / Mint Pudina / Cream & Onion)</option>
                    <option value="Combo">Combo / Value Pack</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Pack Size / Weight (e.g. 100g, 200g, 250g, 500g, 1kg) *
                  </label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="250g"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Product Type Label
                  </label>
                  <input
                    type="text"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    placeholder="Raw Makhana"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-700"
                  />
                </div>
              </div>

              <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-xs text-teal-950 block">
                    Coming Soon Badge
                  </span>
                  <span className="text-[11px] text-teal-700">
                    Mark as Coming Soon if this flavor/batch is currently preparing for launch.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isComingSoon}
                  onChange={(e) => setIsComingSoon(e.target.checked)}
                  className="w-5 h-5 text-teal-700 rounded focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & STOCK */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Selling Price (INR ₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      required
                      min={1}
                      className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-teal-700"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Actual customer checkout price</span>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Original MRP (INR ₹) (For showing discount)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      min={1}
                      className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-teal-700"
                    />
                  </div>
                  <span className="text-[10px] text-emerald-600 mt-1 block font-semibold">
                    Shows discount:{' '}
                    {originalPrice > price
                      ? `Save ₹${originalPrice - price} (${Math.round(((originalPrice - price) / originalPrice) * 100)}% off)`
                      : 'No discount displayed'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Inventory Stock Units
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    min={0}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-700"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {stock > 0 ? `${stock} units in stock` : 'Will show as Out of Stock'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Catalog Visibility Status *
                  </label>
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        checked={isPublished}
                        onChange={() => setIsPublished(true)}
                        className="text-teal-700"
                      />
                      <span className="text-xs font-extrabold text-emerald-800">
                        Published (Live on Website)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        checked={!isPublished}
                        onChange={() => setIsPublished(false)}
                        className="text-teal-700"
                      />
                      <span className="text-xs font-extrabold text-slate-500">
                        Draft (Hidden from Customers)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REAL PRODUCT IMAGES */}
          {activeTab === 'images' && (
            <div className="space-y-5">
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-6 text-center space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="admin-image-upload-input"
                />
                <label
                  htmlFor="admin-image-upload-input"
                  className="inline-flex flex-col items-center justify-center cursor-pointer space-y-2"
                >
                  <div className="w-12 h-12 bg-teal-100 text-teal-800 rounded-2xl flex items-center justify-center shadow-sm">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-teal-900 block">
                      Click to upload real product images (PNG, JPG, WEBP)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Uploaded images are stored byte-for-byte on the server and used directly on the website.
                    </span>
                  </div>
                </label>

                {isUploading && (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-teal-800">
                    <div className="w-4 h-4 border-2 border-teal-800/30 border-t-teal-800 rounded-full animate-spin"></div>
                    Uploading image securely...
                  </div>
                )}

                {uploadError && (
                  <div className="text-xs text-rose-600 font-bold">{uploadError}</div>
                )}
              </div>

              {/* Uploaded Gallery */}
              {customImages.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Uploaded Product Photos ({customImages.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {customImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-2xl overflow-hidden border-2 bg-white shadow-sm p-1.5 flex flex-col items-center group ${
                          mainImageIndex === idx ? 'border-teal-600 ring-2 ring-teal-300' : 'border-slate-200'
                        }`}
                      >
                        <div className="w-full aspect-square overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center">
                          <img
                            src={imgUrl}
                            alt={`Product preview ${idx + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="mt-2 w-full flex items-center justify-between text-[10px]">
                          <button
                            type="button"
                            onClick={() => setMainImageIndex(idx)}
                            className={`px-2 py-0.5 rounded font-bold ${
                              mainImageIndex === idx
                                ? 'bg-teal-700 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {mainImageIndex === idx ? 'Main Image ✓' : 'Set as Main'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Preview Box */}
              <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 shrink-0">
                  <ProductPackGraphic
                    customImageSrc={primaryImageSrc}
                    productName={name || 'Doctor Makhana'}
                    weight={weight}
                    price={price}
                  />
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <span className="font-extrabold text-teal-900 block">Live Packaging Render Preview</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    This is how your product will be displayed in the store catalog, cart drawer, and product details page.
                    {primaryImageSrc ? ' Using your custom uploaded photo.' : ' Using Doctor Makhana packaging graphic.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SIZE VARIANTS */}
          {activeTab === 'variants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Pack Size Variants
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Define multiple pack sizes (e.g. 250g, 500g, 1kg) with their respective prices.
                  </p>
                </div>
              </div>

              {/* Existing Variants Table */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Weight</th>
                      <th className="p-3">Price (₹)</th>
                      <th className="p-3">Original MRP (₹)</th>
                      <th className="p-3">Stock Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {variants.map((v) => (
                      <tr key={v.id} className="hover:bg-white">
                        <td className="p-3 font-bold text-slate-900">{v.weight}</td>
                        <td className="p-3 font-extrabold text-teal-900">₹{v.price}</td>
                        <td className="p-3 text-slate-400 line-through">₹{v.originalPrice || v.price + 50}</td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            In Stock
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(v.id)}
                            className="text-rose-600 hover:text-rose-800 p-1"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Variant Box */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-slate-800 block">Add Another Variant Size</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Weight</label>
                    <input
                      type="text"
                      value={newVariantWeight}
                      onChange={(e) => setNewVariantWeight(e.target.value)}
                      placeholder="e.g. 500g"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={newVariantPrice}
                      onChange={(e) => setNewVariantPrice(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">MRP (₹)</label>
                    <input
                      type="number"
                      value={newVariantMRP}
                      onChange={(e) => setNewVariantMRP(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="w-full py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Variant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DESCRIPTION & FACTS */}
          {activeTab === 'nutrition' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1">
                  Product Description *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Doctor Makhana offers premium, crunchy fox nuts packed with vital minerals, antioxidants, and pure goodness."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-700"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1">
                  Key Health Highlights / Benefits
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    placeholder="e.g. Rich in Calcium & Iron"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {highlights.map((h, i) => (
                    <span
                      key={i}
                      className="bg-teal-100 text-teal-900 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                    >
                      {h}
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(i)}
                        className="hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Ingredients
                  </label>
                  <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Storage Instructions
                  </label>
                  <input
                    type="text"
                    value={storageInstructions}
                    onChange={(e) => setStorageInstructions(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Nutritional Breakdown Inputs */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-2">
                  Nutritional Facts (Per 100g)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Energy</label>
                    <input
                      type="text"
                      value={nutrition.energy}
                      onChange={(e) => setNutrition({ ...nutrition, energy: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Protein</label>
                    <input
                      type="text"
                      value={nutrition.protein}
                      onChange={(e) => setNutrition({ ...nutrition, protein: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Carbohydrates</label>
                    <input
                      type="text"
                      value={nutrition.carbohydrates}
                      onChange={(e) => setNutrition({ ...nutrition, carbohydrates: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Dietary Fiber</label>
                    <input
                      type="text"
                      value={nutrition.dietaryFiber}
                      onChange={(e) => setNutrition({ ...nutrition, dietaryFiber: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Total Fat</label>
                    <input
                      type="text"
                      value={nutrition.fat}
                      onChange={(e) => setNutrition({ ...nutrition, fat: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Sugar</label>
                    <input
                      type="text"
                      value={nutrition.sugar}
                      onChange={(e) => setNutrition({ ...nutrition, sugar: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * Writes immediately to persistent database and updates live website.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-extrabold shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 text-amber-300" />
                {productToEdit ? 'Save Changes' : 'Publish Product to Live Store'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
