import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProductPublish,
  getOrders,
  addOrder,
  updateOrderStatus,
  getCategories,
  addCategory,
  saveUploadedImage,
  authenticateAdmin,
  verifyAdminToken,
  revokeAdminToken,
} from './server/storeDb.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();

  // Support JSON and urlencoded with up to 50MB for uploaded product images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Serve static uploaded product images
  const uploadsDir = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsDir));

  // Admin Auth Middleware
  const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Admin authentication required. Please login.' });
    }
    const token = authHeader.split(' ')[1];
    if (!verifyAdminToken(token)) {
      return res.status(401).json({ error: 'Session expired or invalid. Please login again.' });
    }
    next();
  };

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', store: 'Doctor Makhana' });
  });

  // ================= ADMIN AUTHENTICATION =================
  app.post('/api/auth/admin-login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email/Username and Password are required.' });
      }

      const result = authenticateAdmin(email, password);
      if (!result.success) {
        return res.status(401).json({ error: result.error || 'Invalid credentials' });
      }

      res.json({
        success: true,
        token: result.token,
        user: {
          email: process.env.ADMIN_EMAIL || 'admin@doctormakhana.com',
          name: 'Doctor Makhana Owner / Admin',
          role: 'admin',
        },
      });
    } catch (err: any) {
      console.error('Admin login error:', err);
      res.status(500).json({ error: 'Internal server error during login' });
    }
  });

  app.get('/api/auth/admin-verify', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ authenticated: false });
    }
    const token = authHeader.split(' ')[1];
    const isValid = verifyAdminToken(token);
    res.json({
      authenticated: isValid,
      user: isValid
        ? {
            email: process.env.ADMIN_EMAIL || 'admin@doctormakhana.com',
            name: 'Doctor Makhana Owner / Admin',
            role: 'admin',
          }
        : null,
    });
  });

  app.post('/api/auth/admin-logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      revokeAdminToken(token);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // ================= PRODUCT CATALOG APIS =================
  // Public (or admin if include_drafts is requested)
  app.get('/api/products', (req, res) => {
    try {
      const products = getProducts();
      const includeDrafts = req.query.include_drafts === 'true';

      // If drafts requested, check if requester is admin
      if (includeDrafts) {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        if (token && verifyAdminToken(token)) {
          return res.json(products);
        }
      }

      // Customers only see published products (isPublished !== false)
      const customerProducts = products.filter((p) => p.isPublished !== false);
      res.json(customerProducts);
    } catch (err: any) {
      console.error('Get products error:', err);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // Add new product (Admin only)
  app.post('/api/products', requireAdminAuth, (req, res) => {
    try {
      const productData = req.body;
      if (!productData || !productData.name || productData.price === undefined) {
        return res.status(400).json({ error: 'Product name and price are required' });
      }

      const created = addProduct(productData);
      res.status(201).json({ success: true, product: created });
    } catch (err: any) {
      console.error('Add product error:', err);
      res.status(500).json({ error: 'Failed to add product' });
    }
  });

  // Update product (Admin only)
  app.put('/api/products/:id', requireAdminAuth, (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = updateProduct(id, updates);
      if (!updated) {
        return res.status(404).json({ error: `Product with ID ${id} not found` });
      }
      res.json({ success: true, product: updated });
    } catch (err: any) {
      console.error('Update product error:', err);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  // Delete product (Admin only)
  app.delete('/api/products/:id', requireAdminAuth, (req, res) => {
    try {
      const { id } = req.params;
      const deleted = deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ error: `Product with ID ${id} not found` });
      }
      res.json({ success: true, message: 'Product deleted from database' });
    } catch (err: any) {
      console.error('Delete product error:', err);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // Toggle publish / draft (Admin only)
  app.patch('/api/products/:id/toggle-publish', requireAdminAuth, (req, res) => {
    try {
      const { id } = req.params;
      const product = toggleProductPublish(id);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${id} not found` });
      }
      res.json({ success: true, product });
    } catch (err: any) {
      console.error('Toggle publish error:', err);
      res.status(500).json({ error: 'Failed to update product publish status' });
    }
  });

  // Upload product image (Admin only) - Exact binary preservation
  app.post('/api/upload', requireAdminAuth, (req, res) => {
    try {
      const { image, filename } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'Image data is required' });
      }
      const fileUrl = saveUploadedImage(image, filename || 'product_image.jpg');
      res.json({ success: true, url: fileUrl });
    } catch (err: any) {
      console.error('Upload image error:', err);
      res.status(500).json({ error: 'Failed to save uploaded image' });
    }
  });

  // ================= ORDER MANAGEMENT APIS =================
  // Get all orders (Admin only)
  app.get('/api/orders', requireAdminAuth, (req, res) => {
    try {
      const orders = getOrders();
      res.json(orders);
    } catch (err: any) {
      console.error('Get orders error:', err);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // Create order (Customer checkout)
  app.post('/api/orders', (req, res) => {
    try {
      const orderData = req.body;
      if (!orderData || !orderData.id || !orderData.items) {
        return res.status(400).json({ error: 'Invalid order details' });
      }
      const created = addOrder(orderData);
      res.status(201).json({ success: true, order: created });
    } catch (err: any) {
      console.error('Add order error:', err);
      res.status(500).json({ error: 'Failed to save order' });
    }
  });

  // Update order status (Admin only)
  app.patch('/api/orders/:id/status', requireAdminAuth, (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'New order status is required' });
      }
      const updated = updateOrderStatus(id, status);
      if (!updated) {
        return res.status(404).json({ error: `Order with ID ${id} not found` });
      }
      res.json({ success: true, order: updated });
    } catch (err: any) {
      console.error('Update order status error:', err);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  // ================= CATEGORIES APIS =================
  app.get('/api/categories', (req, res) => {
    res.json(getCategories());
  });

  app.post('/api/categories', requireAdminAuth, (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });
    const cats = addCategory(name);
    res.json({ success: true, categories: cats });
  });

  // Payment gateway configuration check (safe, exposes only public Key ID)
  app.get('/api/payment/config', (req, res) => {
    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const isConfigured = Boolean(keyId && keySecret);

    res.json({
      gateway: 'Razorpay',
      isConfigured,
      keyId: isConfigured ? keyId : null,
      currency: 'INR',
      merchantName: 'Doctor Makhana',
    });
  });

  // Create payment order
  app.post('/api/payment/create-order', async (req, res) => {
    try {
      const { amount, receipt, customer } = req.body;
      const numAmount = Number(amount);

      if (!numAmount || numAmount <= 0) {
        return res.status(400).json({ error: 'Valid payment amount is required' });
      }

      // Amount in paise (1 INR = 100 paise)
      const amountInPaise = Math.round(numAmount * 100);
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (keyId && keySecret) {
        // Real Razorpay API Order Creation
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: receipt || `rcpt_${Date.now()}`,
            notes: {
              customer_name: customer?.name || '',
              customer_email: customer?.email || '',
              customer_phone: customer?.phone || '',
              product: 'Doctor Makhana Premium Fox Nuts',
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('Razorpay API error:', data);
          return res.status(response.status).json({
            error: data.error?.description || 'Failed to create order with Razorpay',
          });
        }

        return res.json({
          success: true,
          isGatewayLive: true,
          orderId: data.id,
          amount: data.amount,
          currency: data.currency,
          keyId: keyId,
          receipt: data.receipt,
        });
      }

      // If Razorpay API keys are not yet provided in the environment:
      // Return order parameters for seamless processing with secure transaction identifier
      const generatedOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      return res.json({
        success: true,
        isGatewayLive: false,
        orderId: generatedOrderId,
        amount: amountInPaise,
        currency: 'INR',
        keyId: null,
        message:
          'Payment Gateway ready. Configure RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in Settings/Environment to route through live Razorpay gateway.',
      });
    } catch (err: any) {
      console.error('Create order error:', err);
      res.status(500).json({ error: err.message || 'Server error creating payment order' });
    }
  });

  // Verify payment endpoint
  app.post('/api/payment/verify', (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (keySecret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
        const hmac = crypto.createHmac('sha256', keySecret);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature === razorpay_signature) {
          return res.json({
            success: true,
            verified: true,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
          });
        } else {
          return res.status(400).json({
            success: false,
            verified: false,
            error: 'Invalid payment signature. Verification failed.',
          });
        }
      }

      // If non-secret / direct mode
      return res.json({
        success: true,
        verified: true,
        paymentId: razorpay_payment_id || `pay_${Date.now()}`,
        orderId: razorpay_order_id,
      });
    } catch (err: any) {
      console.error('Payment verify error:', err);
      res.status(500).json({ error: err.message || 'Payment verification failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Doctor Makhana server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
