import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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
  customImages?: string[];
  mainImageIndex?: number;
  variants?: {
    id: string;
    name: string;
    weight: string;
    price: number;
    originalPrice?: number;
    stock?: number;
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
const SESSIONS_FILE = path.join(DATA_DIR, 'admin-sessions.json');

// Ensure necessary directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Default initial catalog
const DEFAULT_PRODUCTS: ProductRecord[] = [
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

// Database Helper Functions
export function getProducts(): ProductRecord[] {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) {
      saveProducts(DEFAULT_PRODUCTS);
      return DEFAULT_PRODUCTS;
    }
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const products: ProductRecord[] = JSON.parse(data);
    return products;
  } catch (err) {
    console.error('Error reading products from database:', err);
    return DEFAULT_PRODUCTS;
  }
}

export function saveProducts(products: ProductRecord[]): void {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving products to database:', err);
  }
}

export function addProduct(product: ProductRecord): ProductRecord {
  const products = getProducts();
  // Ensure default flags
  const newProduct: ProductRecord = {
    ...product,
    id: product.id || `dm-prod-${Date.now()}`,
    isPublished: product.isPublished !== undefined ? product.isPublished : true,
    stock: product.stock !== undefined ? product.stock : 100,
    price: Number(product.price),
  };
  products.unshift(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<ProductRecord>): ProductRecord | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = products[index];
  const updated: ProductRecord = {
    ...existing,
    ...updates,
    id: existing.id, // preserve id
    price: updates.price !== undefined ? Number(updates.price) : existing.price,
    originalPrice:
      updates.originalPrice !== undefined ? Number(updates.originalPrice) : existing.originalPrice,
    stock: updates.stock !== undefined ? Number(updates.stock) : existing.stock,
  };

  products[index] = updated;
  saveProducts(products);
  return updated;
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const initialLength = products.length;
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length !== initialLength) {
    saveProducts(filtered);
    return true;
  }
  return false;
}

export function toggleProductPublish(id: string): ProductRecord | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = products[index];
  current.isPublished = current.isPublished === false ? true : false;
  saveProducts(products);
  return current;
}

// Orders database
export function getOrders(): OrderRecord[] {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading orders from database:', err);
    return [];
  }
}

export function saveOrders(orders: OrderRecord[]): void {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving orders to database:', err);
  }
}

export function addOrder(order: OrderRecord): OrderRecord {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  return order;
}

export function updateOrderStatus(orderId: string, newStatus: string): OrderRecord | null {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  const ord = orders[index];
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
  orders[index] = ord;
  saveOrders(orders);
  return ord;
}

// Categories
export function getCategories(): string[] {
  try {
    if (!fs.existsSync(CATEGORIES_FILE)) {
      fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(DEFAULT_CATEGORIES), 'utf-8');
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf-8'));
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function addCategory(categoryName: string): string[] {
  const cats = getCategories();
  if (!cats.includes(categoryName)) {
    cats.push(categoryName);
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(cats, null, 2), 'utf-8');
  }
  return cats;
}

// Image upload handling
export function saveUploadedImage(base64Data: string, originalFilename: string = 'product.jpg'): string {
  // Strip base64 prefix if present (e.g. data:image/png;base64,...)
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let buffer: Buffer;
  let extension = 'jpg';

  if (matches && matches.length === 3) {
    const mimeType = matches[1];
    if (mimeType.includes('png')) extension = 'png';
    else if (mimeType.includes('webp')) extension = 'webp';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = 'jpg';
    else if (mimeType.includes('gif')) extension = 'gif';

    buffer = Buffer.from(matches[2], 'base64');
  } else {
    buffer = Buffer.from(base64Data, 'base64');
    const extMatch = originalFilename.split('.').pop();
    if (extMatch) extension = extMatch.toLowerCase();
  }

  const cleanName = path.basename(originalFilename, path.extname(originalFilename))
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);
  const filename = `${Date.now()}_${cleanName}.${extension}`;
  const filePath = path.join(UPLOADS_DIR, filename);

  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
}

// Admin Authentication & Session Management
interface AdminSession {
  token: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

function getSessions(): AdminSession[] {
  try {
    if (!fs.existsSync(SESSIONS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveSessions(sessions: AdminSession[]): void {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving admin sessions:', err);
  }
}

export function authenticateAdmin(emailOrUser: string, pass: string): { success: boolean; token?: string; error?: string } {
  const configuredEmail = process.env.ADMIN_EMAIL || 'admin@doctormakhana.com';
  const configuredPass = process.env.ADMIN_PASSWORD || 'DoctorMakhana@2026';

  const cleanInputUser = (emailOrUser || '').trim().toLowerCase();
  const cleanConfigured = configuredEmail.trim().toLowerCase();

  // Allow username "admin" or full admin email
  const isUsernameMatch =
    cleanInputUser === cleanConfigured ||
    cleanInputUser === 'admin' ||
    cleanInputUser === 'owner' ||
    cleanInputUser === 'doctormakhana';

  if (!isUsernameMatch || pass !== configuredPass) {
    return { success: false, error: 'Invalid admin credentials. Please verify your email/username and password.' };
  }

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session: AdminSession = {
    token,
    email: configuredEmail,
    createdAt: now,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7 days validity
  };

  const sessions = getSessions().filter((s) => s.expiresAt > now); // clean up expired
  sessions.push(session);
  saveSessions(sessions);

  return { success: true, token };
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const sessions = getSessions();
  const now = Date.now();
  const validSession = sessions.find((s) => s.token === token && s.expiresAt > now);
  return Boolean(validSession);
}

export function revokeAdminToken(token: string): void {
  const sessions = getSessions();
  const remaining = sessions.filter((s) => s.token !== token);
  saveSessions(remaining);
}
