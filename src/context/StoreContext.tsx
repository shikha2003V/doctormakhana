import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  UserProfile,
  Review,
  SupportTicket,
  ContactSubmission,
  OrderStatus,
  ShippingAddress,
} from '../types/ecommerce';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
} from '../data/initialData';

type PageRoute =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'track-order'
  | 'account'
  | 'about'
  | 'support'
  | 'contact'
  | 'policy-shopping'
  | 'policy-privacy'
  | 'policy-refund'
  | 'policy-terms'
  | 'admin';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface StoreContextType {
  // Navigation
  activePage: PageRoute;
  setActivePage: (page: PageRoute) => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  navigateToProduct: (id: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Products Data
  products: Product[];
  addProduct: (product: Product) => Promise<void> | void;
  updateProduct: (product: Product) => Promise<void> | void;
  deleteProduct: (productId: string) => Promise<void> | void;
  togglePublishProduct: (productId: string) => Promise<void>;
  uploadProductImage: (fileOrBase64: File | string, filename?: string) => Promise<string>;
  refreshProducts: () => Promise<void>;
  isDbLoading: boolean;

  // Admin & Persistent Backend
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  adminLogin: (emailOrUser: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;

  // Orders Data
  orders: Order[];
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  createOrder: (
    shippingAddress: ShippingAddress,
    paymentMethod: 'Cash on Delivery' | 'Online Payment',
    paymentDetails?: { transactionId?: string; paymentStatus?: 'Pending' | 'Paid' }
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  findOrderByPhoneOrId: (query: string) => Order[];

  // Auth User Session
  user: UserProfile | null;
  login: (emailOrPhone: string, role?: 'customer' | 'admin') => void;
  logout: () => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;

  // Support & Contact
  supportTickets: SupportTicket[];
  addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => void;
  contactSubmissions: ContactSubmission[];
  addContactSubmission: (submission: Omit<ContactSubmission, 'id' | 'createdAt'>) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Navigation & Page State
  const [activePage, setActivePage] = useState<PageRoute>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('dm-raw-250g');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  // Admin Auth State & Token
  const [adminToken, setAdminToken] = useState<string | null>(() =>
    localStorage.getItem('dm_admin_token')
  );
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isDbLoading, setIsDbLoading] = useState<boolean>(false);

  // Load state from LocalStorage or Fallbacks
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('dm_products_v5');
    if (saved) {
      try {
        const parsed: Product[] = JSON.parse(saved);
        return parsed;
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dm_cart_v5') || localStorage.getItem('dm_cart_v4');
    if (saved) {
      try {
        const parsed: CartItem[] = JSON.parse(saved);
        return parsed
          .filter((item) => !['dm-roasted-salted-250g', 'dm-peri-peri-250g', 'dm-mint-pudina-250g'].includes(item.product.id))
          .map((item) => {
            if (item.product.id === 'dm-raw-100g') {
              return { ...item, product: { ...item.product, price: 180 } };
            }
            if (item.product.id === 'dm-raw-200g') {
              return { ...item, product: { ...item.product, price: 379 } };
            }
            if (item.product.id === 'dm-raw-250g') {
              return { ...item, product: { ...item.product, price: 399 } };
            }
            return item;
          });
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('dm_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('dm_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('dm_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('dm_support_tickets');
    return saved ? JSON.parse(saved) : [];
  });

  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>(() => {
    const saved = localStorage.getItem('dm_contact_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('dm_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Synchronize Products from persistent Server DB
  const refreshProducts = async (tokenOverride?: string) => {
    try {
      setIsDbLoading(true);
      const token =
        tokenOverride !== undefined
          ? tokenOverride
          : adminToken || localStorage.getItem('dm_admin_token');
      const headers: Record<string, string> = {};
      let url = '/api/products';
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        url += '?include_drafts=true';
      }
      const res = await fetch(url, { headers });
      if (res.ok) {
        const serverProducts: Product[] = await res.json();
        if (Array.isArray(serverProducts) && serverProducts.length > 0) {
          setProducts(serverProducts);
        }
      }
    } catch (err) {
      console.error('Failed to sync products from server DB:', err);
    } finally {
      setIsDbLoading(false);
    }
  };

  // Synchronize Orders from persistent Server DB
  const refreshOrders = async (tokenOverride?: string) => {
    try {
      const token =
        tokenOverride !== undefined
          ? tokenOverride
          : adminToken || localStorage.getItem('dm_admin_token');
      if (!token) return;
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const serverOrders: Order[] = await res.json();
        if (Array.isArray(serverOrders)) {
          setOrders(serverOrders);
        }
      }
    } catch (err) {
      console.error('Failed to sync orders from server DB:', err);
    }
  };

  // Check admin session validation on initial load
  useEffect(() => {
    const verifyInitialSession = async () => {
      const token = localStorage.getItem('dm_admin_token');
      if (token) {
        try {
          const res = await fetch('/api/auth/admin-verify', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.authenticated) {
            setIsAdminAuthenticated(true);
            setAdminToken(token);
            setUser({
              id: 'admin-owner',
              fullName: 'Doctor Makhana Owner / Admin',
              email: data.user?.email || 'admin@doctormakhana.com',
              phone: '7649090402',
              role: 'admin',
              savedAddresses: [],
            });
            await refreshProducts(token);
            await refreshOrders(token);
            return;
          } else {
            localStorage.removeItem('dm_admin_token');
            setIsAdminAuthenticated(false);
            setAdminToken(null);
          }
        } catch (e) {
          console.error('Admin token verification error:', e);
        }
      }
      refreshProducts();
    };

    verifyInitialSession();
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('dm_products_v5', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('dm_cart_v5', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('dm_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('dm_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('dm_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('dm_support_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem('dm_contact_submissions', JSON.stringify(contactSubmissions));
  }, [contactSubmissions]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('dm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dm_user');
    }
  }, [user]);

  // Toast helper
  const showToast = (
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
    showToast(`Added ${product.name} to cart!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to Wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  // Product Operations (Connected to Server DB)
  const addProduct = async (newProd: Product) => {
    try {
      const token = adminToken || localStorage.getItem('dm_admin_token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newProd),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to add product to server');
      }

      const data = await res.json();
      const saved = data.product || newProd;
      setProducts((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);
      showToast('New product added to database and live store!', 'success');
    } catch (err: any) {
      console.error('Error adding product:', err);
      // Local fallback
      setProducts((prev) => [newProd, ...prev]);
      showToast(err.message || 'Product saved locally', 'info');
    }
  };

  const updateProduct = async (updated: Product) => {
    try {
      const token = adminToken || localStorage.getItem('dm_admin_token');
      const res = await fetch(`/api/products/${updated.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updated),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update product on server');
      }

      const data = await res.json();
      const saved = data.product || updated;
      setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));

      // Keep active cart synchronized if product price/details changed
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === saved.id ? { ...item, product: saved } : item
        )
      );

      showToast('Product updated in database and live website!', 'success');
    } catch (err: any) {
      console.error('Error updating product:', err);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      showToast(err.message || 'Product updated locally', 'info');
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const token = adminToken || localStorage.getItem('dm_admin_token');
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete product on server');
      }

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      showToast('Product removed from database and live catalog', 'info');
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast(err.message || 'Product removed locally', 'info');
    }
  };

  const togglePublishProduct = async (productId: string) => {
    try {
      const token = adminToken || localStorage.getItem('dm_admin_token');
      const res = await fetch(`/api/products/${productId}/toggle-publish`, {
        method: 'PATCH',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to toggle product status');
      }

      const data = await res.json();
      const updated = data.product;
      setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
      showToast(
        `Product visibility changed to: ${updated.isPublished ? 'Published (Live)' : 'Draft (Hidden)'}`,
        'info'
      );
    } catch (err: any) {
      console.error('Error toggling publish state:', err);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isPublished: !p.isPublished } : p))
      );
      showToast(err.message || 'Toggled locally', 'info');
    }
  };

  const uploadProductImage = async (
    fileOrBase64: File | string,
    filename?: string
  ): Promise<string> => {
    let base64Data = '';
    let resolvedFilename = filename || 'product_image.jpg';

    if (fileOrBase64 instanceof File) {
      resolvedFilename = fileOrBase64.name;
      base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrBase64);
      });
    } else {
      base64Data = fileOrBase64;
    }

    const token = adminToken || localStorage.getItem('dm_admin_token');
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ image: base64Data, filename: resolvedFilename }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to upload image to server');
    }

    const data = await res.json();
    return data.url;
  };

  // Order Placement & Status Updates
  const createOrder = (
    shippingAddress: ShippingAddress,
    paymentMethod: 'Cash on Delivery' | 'Online Payment',
    paymentDetails?: { transactionId?: string; paymentStatus?: 'Pending' | 'Paid' }
  ): Order => {
    const nextNumber = 1001 + orders.length;
    const orderId = `DM-${nextNumber}`;
    const subtotal = cartSubtotal;
    const shippingFee = subtotal >= 499 ? 0 : 40;
    const totalAmount = subtotal + shippingFee;
    const isPaid = paymentMethod === 'Online Payment' && paymentDetails?.paymentStatus === 'Paid';

    const currentTimestamp = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName: shippingAddress.fullName,
      phone: shippingAddress.mobileNumber.replace(/\s+/g, ''),
      email: shippingAddress.email,
      shippingAddress,
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        weight: item.product.weight,
        image: item.product.images.front,
      })),
      subtotal,
      shippingFee,
      discount: 0,
      totalAmount,
      paymentMethod,
      paymentStatus: isPaid ? 'Paid' : 'Pending',
      transactionId: paymentDetails?.transactionId,
      status: isPaid ? 'Confirmed' : 'Order Placed',
      estimatedDelivery: '3-5 Business Days',
      timeline: [
        {
          status: 'Order Placed',
          timestamp: currentTimestamp,
          completed: true,
          note:
            paymentMethod === 'Online Payment'
              ? `Online Payment Received (Ref: ${paymentDetails?.transactionId || 'Verified'})`
              : 'Order received via Cash on Delivery',
        },
        {
          status: 'Confirmed',
          timestamp: isPaid ? currentTimestamp : 'Pending',
          completed: isPaid,
          note: isPaid ? 'Order & Payment verified' : undefined,
        },
        { status: 'Processing', timestamp: 'Pending', completed: false },
        { status: 'Shipped', timestamp: 'Pending', completed: false },
        { status: 'Out for Delivery', timestamp: 'Pending', completed: false },
        { status: 'Delivered', timestamp: 'Pending', completed: false },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    clearCart();
    showToast(`Order ${orderId} placed successfully!`, 'success');

    // Asynchronously persist to server DB
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch((e) => console.error('Error persisting order to server:', e));

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nowStr = new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
          const updatedTimeline = ord.timeline.map((item) => {
            if (item.status === status) {
              return { ...item, completed: true, timestamp: nowStr };
            }
            return item;
          });
          return { ...ord, status, timeline: updatedTimeline };
        }
        return ord;
      })
    );
    showToast(`Order ${orderId} status updated to ${status}`, 'info');

    const token = adminToken || localStorage.getItem('dm_admin_token');
    if (token) {
      fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }).catch((e) => console.error('Error updating order status on server:', e));
    }
  };

  const findOrderByPhoneOrId = (query: string): Order[] => {
    const clean = query.trim().toLowerCase().replace(/\s+/g, '');
    if (!clean) return [];
    return orders.filter(
      (ord) =>
        ord.id.toLowerCase().includes(clean) ||
        ord.phone.includes(clean) ||
        ord.shippingAddress.mobileNumber.replace(/\s+/g, '').includes(clean)
    );
  };

  // Secure Admin Authentication
  const adminLogin = async (
    emailOrUser: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrUser, password: pass }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid credentials' };
      }

      localStorage.setItem('dm_admin_token', data.token);
      setAdminToken(data.token);
      setIsAdminAuthenticated(true);
      setUser({
        id: 'admin-owner',
        fullName: 'Doctor Makhana Owner / Admin',
        email: data.user?.email || emailOrUser,
        phone: '7649090402',
        role: 'admin',
        savedAddresses: [],
      });

      await refreshProducts(data.token);
      await refreshOrders(data.token);
      showToast('Admin logged in successfully! Welcome Owner.', 'success');
      return { success: true };
    } catch (err: any) {
      console.error('Admin login error:', err);
      return { success: false, error: err.message || 'Unable to connect to login server' };
    }
  };

  const adminLogout = async () => {
    try {
      const token = adminToken || localStorage.getItem('dm_admin_token');
      if (token) {
        await fetch('/api/auth/admin-logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error('Admin logout network error:', err);
    } finally {
      localStorage.removeItem('dm_admin_token');
      setAdminToken(null);
      setIsAdminAuthenticated(false);
      setUser(null);
      showToast('Admin logged out securely.', 'info');
      await refreshProducts('');
      setActivePage('home');
    }
  };

  // Customer Auth
  const login = (emailOrPhone: string, role: 'customer' | 'admin' = 'customer') => {
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      fullName: role === 'admin' ? 'Doctor Makhana Admin' : 'Valued Customer',
      email: emailOrPhone.includes('@') ? emailOrPhone : 'shikhuverma2804@gmail.com',
      phone: '8989214183',
      role,
      savedAddresses: [
        {
          fullName: 'Shikhu Verma',
          mobileNumber: '89892 14183',
          email: 'shikhuverma2804@gmail.com',
          addressLine: '509 D, Abbalganj, Gole Bazar',
          city: 'Jabalpur',
          state: 'Madhya Pradesh',
          pincode: '482002',
        },
      ],
    };
    setUser(newUser);
    showToast(`Welcome ${role === 'admin' ? 'Admin' : 'back'} to Doctor Makhana!`, 'success');
  };

  const logout = () => {
    if (isAdminAuthenticated) {
      adminLogout();
      return;
    }
    setUser(null);
    showToast('Logged out successfully', 'info');
    setActivePage('home');
  };

  // Reviews & Support
  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...review,
      id: 'rev-' + Date.now(),
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('Thank you! Your review has been submitted.', 'success');
  };

  const addSupportTicket = (
    ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>
  ) => {
    const newTicket: SupportTicket = {
      ...ticket,
      id: 'SUP-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      status: 'Open',
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    showToast(`Support ticket ${newTicket.id} submitted!`, 'success');
  };

  const addContactSubmission = (
    submission: Omit<ContactSubmission, 'id' | 'createdAt'>
  ) => {
    const newSubmission: ContactSubmission = {
      ...submission,
      id: 'MSG-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
    };
    setContactSubmissions((prev) => [newSubmission, ...prev]);
    showToast('Message sent! Our team will call or email you soon.', 'success');
  };

  const navigateToProduct = (id: string) => {
    setSelectedProductId(id);
    setActivePage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <StoreContext.Provider
      value={{
        activePage,
        setActivePage: (p) => {
          setActivePage(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        selectedProductId,
        setSelectedProductId,
        navigateToProduct,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartItemCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        togglePublishProduct,
        uploadProductImage,
        refreshProducts,
        isDbLoading,
        adminToken,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        orders,
        currentOrder,
        setCurrentOrder,
        createOrder,
        updateOrderStatus,
        findOrderByPhoneOrId,
        user,
        login,
        logout,
        reviews,
        addReview,
        supportTickets,
        addSupportTicket,
        contactSubmissions,
        addContactSubmission,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
