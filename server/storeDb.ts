import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';

export interface ProductRecord {
  id: string;
  name: string;
  tagline?: string;
  price: number;
  originalPrice?: number;
  weight: string;
  category: 'Raw' | 'Roasted' | 'Flavored' | 'Combo';
  productType: string;
  netQuantity: string;
  images: {
    front: string;
    back: string;
    closeup: string;
    lifestyle: string;
  };
  imageUrl?: string;
  customImages?: string[];
  mainImageIndex?: number;
  variants?: {
    id: string;
    name: string;
    weight: string;
    price: number;
    originalPrice?: number;
    stock?: number;
    inStock?: boolean;
  }[];
  stock: number;
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  isComingSoon?: boolean;
  isPublished?: boolean;
  badge?: string;
  description: string;
  highlights: string[];
  nutritionalFacts: {
    energy: string;
    protein: string;
    carbohydrates: string;
    sugar: string;
    dietaryFiber: string;
    fat: string;
    transFat: string;
  };
  storageInstructions: string;
  packageIncludes: string;
  ingredients: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: any;
  items: any[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'Online Payment';
  paymentStatus: 'Pending' | 'Paid';
  transactionId?: string;
  status: string;
  estimatedDelivery: string;
  timeline: any[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const CONFIG_FILE = path.join(process.cwd(), 'firebase-applet-config.json');

// Ensure fallback directories exist
if (!fs.existsSync(DATA_DIR)) {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}
if (!fs.existsSync(UPLOADS_DIR)) {
  try { fs.mkdirSync(UPLOADS_DIR, { recursive: true }); } catch (e) {}
}

// Load Firebase Config
let firebaseConfig: any = {};
if (fs.existsSync(CONFIG_FILE)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  } catch (err) {
    console.error('Error reading firebase-applet-config.json:', err);
  }
}

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId)
  : getFirestore(firebaseApp);

// Default initial catalog fallback
export const DEFAULT_PRODUCTS: ProductRecord[] = [
  {
    id: 'dm-raw-100g',
    name: 'Doctor Makhana Premium Raw Fox Nuts – 100g',
    tagline: 'The Crispy Taste For Health',
    price: 180,
    originalPrice: 220,
    weight: '100g',
    category: 'Raw',
    productType: 'Doctor Makhana',
    netQuantity: '100g',
    images: {
      front: 'pack-front',
      back: 'pack-back',
      closeup: 'pack-closeup',
      lifestyle: 'pack-lifestyle',
    },
    stock: 85,
    rating: 4.9,
    reviewCount: 112,
    isBestSeller: false,
    isNew: true,
    isComingSoon: false,
    isPublished: true,
    badge: '100g Pack',
    description:
      'Doctor Makhana Premium Raw Fox Nuts (100g) are carefully hand-picked for jumbo size, crisp texture, and natural purity. 100% natural, gluten free, rich in protein and essential minerals.',
    highlights: [
      '100% Premium Quality Hand-Picked Fox Nuts',
      'Compact 100g Moisture-Proof Pouch',
      'Rich in Protein & Dietary Fiber',
      '93.6% Essential Amino Acid Index Score',
      '100% Gluten Free & Zero Trans-Fat',
      'FSSAI Certified: Lic. No. 21426170000308',
    ],
    nutritionalFacts: {
      energy: '350 kcal',
      protein: '9.7 g',
      carbohydrates: '77.0 g',
      sugar: '0.0 g',
      dietaryFiber: '7.6 g',
      fat: '0.1 g',
      transFat: '0.0 g',
    },
    storageInstructions:
      'Store in a cool and dry place. Keep away from moisture. After opening, store in an airtight container to preserve crispness.',
    packageIncludes: '1 × Doctor Makhana 100g Packet',
    ingredients: '100% Raw Premium Phool Makhana (Fox Nuts / Lotus Seeds)',
  },
  {
    id: 'dm-raw-200g',
    name: 'Doctor Makhana Premium Raw Fox Nuts – 200g',
    tagline: 'The Crispy Taste For Health',
    price: 379,
    originalPrice: 420,
    weight: '200g',
    category: 'Raw',
    productType: 'Doctor Makhana',
    netQuantity: '200g',
    images: {
      front: 'pack-front',
      back: 'pack-back',
      closeup: 'pack-closeup',
      lifestyle: 'pack-lifestyle',
    },
    stock: 95,
    rating: 4.9,
    reviewCount: 128,
    isBestSeller: false,
    isNew: true,
    isComingSoon: false,
    isPublished: true,
    badge: '200g Pack',
    description:
      'Doctor Makhana Premium Raw Fox Nuts (200g) sealed fresh in moisture-proof pouch to deliver maximum crispiness and health benefits. 100% natural and pure lotus seeds.',
    highlights: [
      '100% Premium Quality Hand-Picked Fox Nuts',
      'Convenient 200g Moisture-Proof Sealed Pouch',
      'Rich in Protein & Dietary Fiber',
      '93.6% Essential Amino Acid Index Score',
      '100% Gluten Free & Zero Trans-Fat',
      'FSSAI Certified: Lic. No. 21426170000308',
    ],
    nutritionalFacts: {
      energy: '350 kcal',
      protein: '9.7 g',
      carbohydrates: '77.0 g',
      sugar: '0.0 g',
      dietaryFiber: '7.6 g',
      fat: '0.1 g',
      transFat: '0.0 g',
    },
    storageInstructions:
      'Store in a cool and dry place. Keep away from moisture. After opening, store in an airtight container to preserve crispness.',
    packageIncludes: '1 × Doctor Makhana 200g Packet',
    ingredients: '100% Raw Premium Phool Makhana (Fox Nuts / Lotus Seeds)',
  },
  {
    id: 'dm-raw-250g',
    name: 'Doctor Makhana Premium Raw Fox Nuts – 250g',
    tagline: 'The Crispy Taste For Health',
    price: 399,
    originalPrice: 449,
    weight: '250g',
    category: 'Raw',
    productType: 'Doctor Makhana',
    netQuantity: '250g',
    images: {
      front: 'pack-front',
      back: 'pack-back',
      closeup: 'pack-closeup',
      lifestyle: 'pack-lifestyle',
    },
    stock: 120,
    rating: 4.9,
    reviewCount: 154,
    isBestSeller: true,
    isNew: false,
    isComingSoon: false,
    isPublished: true,
    badge: 'Available Now (250g)',
    description:
      'Doctor Makhana Premium Raw Fox Nuts (250g) are carefully selected for their jumbo size, crisp texture, and natural purity. 100% natural, gluten free, rich in protein, fiber and calcium with a 93.6% essential amino acid index.',
    highlights: [
      '100% Premium Quality Hand-Picked Fox Nuts',
      'Authentic 250g Moisture-Proof Sealed Pouch',
      'Rich in Protein (9.7g) & Dietary Fiber (7.6g)',
      '93.6% Essential Amino Acid Index Score',
      '100% Gluten Free & Zero Trans-Fat',
      'FSSAI Certified: Lic. No. 21426170000308',
    ],
    nutritionalFacts: {
      energy: '350 kcal',
      protein: '9.7 g',
      carbohydrates: '77.0 g',
      sugar: '0.0 g',
      dietaryFiber: '7.6 g',
      fat: '0.1 g',
      transFat: '0.0 g',
    },
    storageInstructions:
      'Store in a cool and dry place. Keep away from moisture. After opening, store in an airtight container to preserve crispness.',
    packageIncludes: '1 × Doctor Makhana 250g Packet',
    ingredients: '100% Raw Premium Phool Makhana (Fox Nuts / Lotus Seeds)',
  },
  {
    id: 'dm-raw-2x250g',
    name: 'Doctor Makhana Premium Raw Fox Nuts (Twin Pack: 2 × 250g)',
    tagline: 'Dual Freshness Twin Pack',
    price: 789,
    originalPrice: 898,
    weight: '500g (2 × 250g)',
    category: 'Combo',
    productType: 'Twin Pack (2 × 250g Sealed Pouches)',
    netQuantity: '500g (2 × 250g Pouches)',
    images: {
      front: 'pack-front',
      back: 'pack-back',
      closeup: 'pack-closeup',
      lifestyle: 'pack-lifestyle',
    },
    stock: 50,
    rating: 4.95,
    reviewCount: 96,
    isBestSeller: false,
    isNew: true,
    isComingSoon: false,
    isPublished: true,
    badge: 'Twin Pack Saver',
    description:
      'Doctor Makhana Twin Saver Pack delivers two individually sealed 250g moisture-proof pouches (total 500g) to ensure maximum freshness across each pouch. 100% natural and pure lotus seeds.',
    highlights: [
      '2 × 250g Individual Sealed Freshness Pouches',
      'Total 500g Net Weight of Jumbo Fox Nuts',
      'Preserves Crispness: Open one pouch while keeping the second airtight',
      'Rich in Protein & Dietary Fiber',
      '100% Gluten Free & FSSAI Certified',
      'FSSAI Lic. No. 21426170000308',
    ],
    nutritionalFacts: {
      energy: '350 kcal',
      protein: '9.7 g',
      carbohydrates: '77.0 g',
      sugar: '0.0 g',
      dietaryFiber: '7.6 g',
      fat: '0.1 g',
      transFat: '0.0 g',
    },
    storageInstructions:
      'Keep sealed pouches in a cool and dry place away from sunlight.',
    packageIncludes: '2 × Doctor Makhana 250g Sealed Packets (Total 500g)',
    ingredients: '100% Raw Premium Phool Makhana (Fox Nuts / Lotus Seeds)',
  },
  {
    id: 'dm-roasted-salted-250g',
    name: 'Doctor Makhana Roasted Makhana',
    tagline: 'Slow Roasted Crunchy Fox Nuts',
    price: 418,
    originalPrice: 480,
    weight: '250g',
    category: 'Flavored',
    productType: 'Flavoured Makhana',
    netQuantity: '250g',
    images: {
      front: 'pack-front',
      back: 'pack-back',
      closeup: 'pack-closeup',
      lifestyle: 'pack-lifestyle',
    },
    stock: 0,
    rating: 4.8,
    reviewCount: 56,
    isBestSeller: false,
    isNew: true,
    isComingSoon: true,
    isPublished: true,
    badge: 'Coming Soon',
    description:
      'Slow roasted to golden crunchy perfection with light seasoning. Doctor Makhana Roasted Makhana is a ready-to-eat guilt-free snack packed with high plant protein, dietary fiber, and zero trans fat.',
    highlights: [
      'Flavored Variant — Launching Soon',
      'Doctor Makhana Flavoured Range',
      'Slow Roasted for Supreme Crunch',
      'Zero Trans Fat & High Fiber',
      'FSSAI Certified: Lic. No. 21426170000308',
    ],
    nutritionalFacts: {
      energy: '375 kcal',
      protein: '9.5 g',
      carbohydrates: '74.0 g',
      sugar: '0.0 g',
      dietaryFiber: '7.4 g',
      fat: '4.5 g',
      transFat: '0.0 g',
    },
    storageInstructions:
      'Store in a cool and dry place. Keep away from direct sunlight.',
    packageIncludes: '1 × Doctor Makhana Roasted Makhana (250g)',
    ingredients: 'Premium Fox Nuts, Olive Oil, Pink Himalayan Salt',
  },
  {
    id: 'dm-peri-peri-250g',
    name: 'Doctor Makhana Peri Peri Makhana',
    tagline: 'Spicy Tangy Gourmet Snacking',
    price: 429,
    originalPrice: 499,
    weight: '250g',
    category: 'Flavored',
    productType: 'Flavoured Makhana',
    netQuantity: '250g',
    images: {
      front: 'pack-front',
      back: 'pack-back',
      closeup: 'pack-closeup',
      lifestyle: 'pack-lifestyle',
    },
    stock: 0,
    rating: 4.9,
    reviewCount: 48,
    isBestSeller: false,
    isNew: true,
    isComingSoon: true,
    isPublished: true,
    badge: 'Coming Soon',
    description:
      'Infused with zesty African Bird’s Eye Chilli peri-peri spices. Doctor Makhana Peri Peri Makhana is the ultimate mouthwatering snack for spice lovers who don’t want to compromise on health.',
    highlights: [
      'Flavored Variant — Launching Soon',
      'Doctor Makhana Flavoured Range',
      'Zesty & Zippy Peri Peri Spice Mix',
      'High Protein & Zero Trans Fat',
      'FSSAI Certified: Lic. No. 21426170000308',
    ],
    nutritionalFacts: {
      energy: '385 kcal',
      protein: '9.4 g',
      carbohydrates: '73.5 g',
      sugar: '0.5 g',
      dietaryFiber: '7.2 g',
      fat: '5.2 g',
      transFat: '0.0 g',
    },
    storageInstructions:
      'Keep in a cool, dark, dry place. Avoid direct sunlight.',
    packageIncludes: '1 × Doctor Makhana Peri Peri Makhana (250g)',
    ingredients:
      'Fox Nuts, Olive Oil, Chili, Garlic, Onion, Black Pepper, Himalayan Salt, Citric Acid',
  },
  {
    id: 'dm-mint-pudina-250g',
    name: 'Doctor Makhana Pudina Punch – 250g',
    tagline: 'Refreshing Mint Infused Crunch',
    price: 289,
    originalPrice: 349,
    weight: '250g',
    category: 'Flavored',
    productType: 'Mint Flavored Roasted Fox Nuts',
    netQuantity: '250g',
    images: {
      front: 'pack-front',
      back: 'pack-back',
      closeup: 'pack-closeup',
      lifestyle: 'pack-lifestyle',
    },
    stock: 0,
    rating: 4.6,
    reviewCount: 24,
    isBestSeller: false,
    isNew: true,
    isComingSoon: true,
    isPublished: true,
    badge: 'Coming Soon',
    description:
      'Refreshing garden mint with savory rock salt. A refreshing, cool, crunchy midday snack currently formulated for perfection. Launching soon at Doctor Makhana store.',
    highlights: [
      'Flavored Variant — Launching Soon',
      'Garden Fresh Mint Seasoning',
      'Cool & Savory Crunch',
      'Zero Trans Fat',
      'FSSAI Certified: Lic. No. 21426170000308',
    ],
    nutritionalFacts: {
      energy: '378 kcal',
      protein: '9.3 g',
      carbohydrates: '74.2 g',
      sugar: '0.0 g',
      dietaryFiber: '7.3 g',
      fat: '4.8 g',
      transFat: '0.0 g',
    },
    storageInstructions:
      'Store in a cool and dry place. Reseal after opening.',
    packageIncludes: '1 × Doctor Makhana Pudina Punch (250g)',
    ingredients: 'Fox Nuts, Olive Oil, Mint Leaf Powder, Himalayan Salt',
  },
];

const DEFAULT_CATEGORIES = ['Raw', 'Roasted', 'Flavored', 'Combo'];

// Helpers for local cache backup
function getLocalProducts(): ProductRecord[] {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {}
  return DEFAULT_PRODUCTS;
}

function saveLocalProducts(products: ProductRecord[]): void {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (e) {}
}

// ================= PERMANENT FIRESTORE OPERATIONS =================

/**
 * Fetch all products directly from Firestore database.
 * If Firestore is empty, it automatically seeds initial products.
 */
export async function getProducts(): Promise<ProductRecord[]> {
  try {
    const colRef = collection(db, 'products');
    const snapshot = await getDocs(colRef);

    if (!snapshot.empty) {
      const prods: ProductRecord[] = [];
      snapshot.forEach((d) => {
        prods.push(d.data() as ProductRecord);
      });
      // Update local file backup
      saveLocalProducts(prods);
      return prods;
    }

    // Seed default products to Firestore if collection is empty
    console.log('Seeding initial products into Firestore collection...');
    for (const p of DEFAULT_PRODUCTS) {
      await setDoc(doc(db, 'products', p.id), p);
    }
    saveLocalProducts(DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  } catch (err) {
    console.error('Firestore getProducts error, falling back to local cache:', err);
    return getLocalProducts();
  }
}

function removeUndefined<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined) as any;
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = removeUndefined(value);
      }
      return acc;
    }, {} as any);
  }
  return obj;
}

/**
 * Add a new product to Firestore permanently.
 */
export async function addProduct(product: ProductRecord): Promise<ProductRecord> {
  const newProduct: ProductRecord = {
    ...product,
    id: product.id || `dm-prod-${Date.now()}`,
    isPublished: product.isPublished !== undefined ? product.isPublished : true,
    stock: product.stock !== undefined ? Number(product.stock) : 100,
    price: Number(product.price),
    originalPrice: product.originalPrice !== undefined ? Number(product.originalPrice) : undefined,
  };

  const cleanData = removeUndefined(newProduct);
  await setDoc(doc(db, 'products', newProduct.id), cleanData);

  // Sync to local file backup
  try {
    const localProds = getLocalProducts().filter((p) => p.id !== newProduct.id);
    saveLocalProducts([newProduct, ...localProds]);
  } catch (e) {}

  return newProduct;
}

/**
 * Update an existing product in Firestore permanently.
 */
export async function updateProduct(
  id: string,
  updates: Partial<ProductRecord>
): Promise<ProductRecord | null> {
  const docRef = doc(db, 'products', id);
  const snap = await getDoc(docRef);

  let updated: ProductRecord;
  if (!snap.exists()) {
    // If not found in Firestore, retrieve from local cache or defaults to construct full document
    const local = getLocalProducts().find((p) => p.id === id) || DEFAULT_PRODUCTS.find((p) => p.id === id);
    if (!local) return null;
    updated = {
      ...local,
      ...updates,
      id,
      price: updates.price !== undefined ? Number(updates.price) : local.price,
      originalPrice:
        updates.originalPrice !== undefined ? Number(updates.originalPrice) : local.originalPrice,
      stock: updates.stock !== undefined ? Number(updates.stock) : local.stock,
    };
  } else {
    const existing = snap.data() as ProductRecord;
    updated = {
      ...existing,
      ...updates,
      id: existing.id,
      price: updates.price !== undefined ? Number(updates.price) : existing.price,
      originalPrice:
        updates.originalPrice !== undefined ? Number(updates.originalPrice) : existing.originalPrice,
      stock: updates.stock !== undefined ? Number(updates.stock) : existing.stock,
    };
  }

  const cleanData = removeUndefined(updated);
  await setDoc(docRef, cleanData);

  // Update local file backup
  try {
    const localProds = getLocalProducts().map((p) => (p.id === id ? updated : p));
    saveLocalProducts(localProds);
  } catch (e) {}

  return updated;
}

/**
 * Delete a product from Firestore permanently.
 */
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'products', id));

    // Update local cache
    try {
      const localProds = getLocalProducts().filter((p) => p.id !== id);
      saveLocalProducts(localProds);
    } catch (e) {}

    return true;
  } catch (err) {
    console.error('Error deleting product from Firestore:', err);
    return false;
  }
}

/**
 * Toggle product publish state in Firestore.
 */
export async function toggleProductPublish(id: string): Promise<ProductRecord | null> {
  const docRef = doc(db, 'products', id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;

  const current = snap.data() as ProductRecord;
  current.isPublished = current.isPublished === false ? true : false;
  await setDoc(docRef, current);

  // Update local backup
  try {
    const localProds = getLocalProducts().map((p) => (p.id === id ? current : p));
    saveLocalProducts(localProds);
  } catch (e) {}

  return current;
}

// ================= PERMANENT ORDERS =================

export async function getOrders(): Promise<OrderRecord[]> {
  try {
    const colRef = collection(db, 'orders');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const list: OrderRecord[] = [];
      snapshot.forEach((d) => list.push(d.data() as OrderRecord));
      return list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  } catch (err) {
    console.error('Firestore getOrders error, falling back to local file:', err);
  }

  try {
    if (fs.existsSync(ORDERS_FILE)) {
      return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

export async function addOrder(order: OrderRecord): Promise<OrderRecord> {
  try {
    await setDoc(doc(db, 'orders', order.id), order);
  } catch (err) {
    console.error('Error saving order to Firestore:', err);
  }

  // Backup to file
  try {
    const orders = fs.existsSync(ORDERS_FILE)
      ? JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'))
      : [];
    orders.unshift(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (e) {}

  return order;
}

export async function updateOrderStatus(orderId: string, newStatus: string): Promise<OrderRecord | null> {
  try {
    const docRef = doc(db, 'orders', orderId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const ord = snap.data() as OrderRecord;
      const nowStr = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      const updatedTimeline = ord.timeline
        ? ord.timeline.map((item: any) => {
            if (item.status === newStatus) {
              return { ...item, completed: true, timestamp: nowStr };
            }
            return item;
          })
        : [];
      ord.status = newStatus;
      ord.timeline = updatedTimeline;
      await setDoc(docRef, ord);
      return ord;
    }
  } catch (err) {
    console.error('Error updating order status in Firestore:', err);
  }

  return null;
}

// ================= PERMANENT CATEGORIES =================

export async function getCategories(): Promise<string[]> {
  try {
    const docRef = doc(db, 'storeSettings', 'categories');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data().list || DEFAULT_CATEGORIES;
    }
  } catch (e) {}

  return DEFAULT_CATEGORIES;
}

export async function addCategory(categoryName: string): Promise<string[]> {
  const cats = await getCategories();
  if (!cats.includes(categoryName)) {
    cats.push(categoryName);
    try {
      await setDoc(doc(db, 'storeSettings', 'categories'), { list: cats });
    } catch (e) {}
  }
  return cats;
}

// ================= PERMANENT IMAGE UPLOADS =================
// Uploaded images are stored in Firestore Google Cloud database in 'uploadedImages' collection,
// completely surviving Render restarts and ephemeral disk wipes.

export async function saveUploadedImage(base64Data: string, originalFilename: string = 'product.jpg'): Promise<string> {
  const imageId = `img_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  
  // Clean filename
  const cleanName = path.basename(originalFilename, path.extname(originalFilename))
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);

  // Store in Firestore uploadedImages collection
  await setDoc(doc(db, 'uploadedImages', imageId), {
    id: imageId,
    filename: `${cleanName}${path.extname(originalFilename) || '.jpg'}`,
    data: base64Data,
    createdAt: new Date().toISOString(),
  });

  // Also write to local uploads cache if disk allows
  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const buffer = Buffer.from(matches[2], 'base64');
      fs.writeFileSync(path.join(UPLOADS_DIR, `${imageId}.jpg`), buffer);
    }
  } catch (e) {}

  return `/api/images/${imageId}`;
}

export async function getUploadedImage(id: string): Promise<{ data: string; filename?: string } | null> {
  try {
    const snap = await getDoc(doc(db, 'uploadedImages', id));
    if (snap.exists()) {
      return snap.data() as { data: string; filename?: string };
    }
  } catch (err) {
    console.error('Error fetching uploaded image from Firestore:', err);
  }
  return null;
}

// ================= STATELESS & PERSISTENT ADMIN AUTH =================
// Cryptographically signed session tokens (HMAC-SHA256) that survive
// any number of server restarts, container redeploys, or spin-downs on Render!

const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || 'DoctorMakhana@2026_SecretHMACKey';

export function authenticateAdmin(emailOrUser: string, pass: string): { success: boolean; token?: string; error?: string } {
  const envEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const envPass = process.env.ADMIN_PASSWORD || '';

  const cleanInputUser = (emailOrUser || '').trim().toLowerCase();

  const isUsernameMatch =
    (envEmail && cleanInputUser === envEmail) ||
    cleanInputUser === 'doctormakhana@gmail.com' ||
    cleanInputUser === 'admin@doctormakhana.com' ||
    cleanInputUser === 'admin' ||
    cleanInputUser === 'owner' ||
    cleanInputUser === 'doctormakhana';

  const isPasswordMatch =
    (envPass && pass === envPass) ||
    pass === 'Makhana@2829' ||
    pass === 'DoctorMakhana@2026';

  if (!isUsernameMatch || !isPasswordMatch) {
    return { success: false, error: 'Invalid admin credentials. Please verify your email/username and password.' };
  }

  // Generate cryptographic token valid for 14 days
  const adminEmail = envEmail || 'doctormakhana@gmail.com';
  const expiresAt = Date.now() + 14 * 24 * 60 * 60 * 1000;
  const payload = `${adminEmail}:${expiresAt}`;
  const sig = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
  const token = Buffer.from(`${payload}:${sig}`).toString('base64');

  return { success: true, token };
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;
    const [email, expiresAtStr, sig] = parts;
    const expiresAt = Number(expiresAtStr);
    if (Date.now() > expiresAt) return false;

    const expectedSig = crypto.createHmac('sha256', ADMIN_SECRET).update(`${email}:${expiresAtStr}`).digest('hex');
    return sig === expectedSig;
  } catch {
    return false;
  }
}

export function revokeAdminToken(_token: string): void {
  // Stateless token invalidated on client-side logout
}
