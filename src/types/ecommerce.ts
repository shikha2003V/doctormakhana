export interface ProductVariant {
  id: string;
  name?: string;
  weight: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  inStock?: boolean;
}

export interface Product {
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
  customImages?: string[];
  mainImageIndex?: number;
  variants?: ProductVariant[];
  nutritionalFacts: {
    energy: string; // e.g., 350 kcal
    protein: string; // 9.7 g
    carbohydrates: string; // 76.9 g
    sugar: string; // 0.0 g
    dietaryFiber: string; // 7.6 g
    fat: string; // 0.1 g
    transFat: string; // 0.0 g
  };
  storageInstructions: string;
  packageIncludes: string;
  ingredients: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  mobileNumber: string;
  email: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  weight: string;
  image: string;
}

export interface Order {
  id: string; // e.g. DM-1001
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'Online Payment';
  paymentStatus: 'Pending' | 'Paid';
  transactionId?: string;
  status: OrderStatus;
  estimatedDelivery: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    completed: boolean;
    note?: string;
  }[];
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses: ShippingAddress[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface SupportTicket {
  id: string;
  category: string;
  name: string;
  email: string;
  phone: string;
  orderId?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}
