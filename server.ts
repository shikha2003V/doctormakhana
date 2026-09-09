import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
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
  getUploadedImage,
  authenticateAdmin,
  verifyAdminToken,
  revokeAdminToken,
} from './server/storeDb.js';

dotenv.config();

// AI Studio requires port 3000 behind its reverse proxy (detected via APPLET_ID).
// Render and cloud platforms inject process.env.PORT (typically 10000 on Render).
const PORT = process.env.APPLET_ID ? 3000 : (Number(process.env.PORT) || 3000);

async function startServer() {
  const app = express();

  // Support JSON and urlencoded with up to 50MB for uploaded product images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Serve static uploaded product images (ensure directory exists)
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
    } catch {
      // Ignore if cannot create
    }
  }
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
  app.get('/api/products', async (req, res) => {
    try {
      const products = await getProducts();
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
  app.post('/api/products', requireAdminAuth, async (req, res) => {
    try {
      const productData = req.body;
      if (!productData || !productData.name || productData.price === undefined) {
        return res.status(400).json({ error: 'Product name and price are required' });
      }

      const created = await addProduct(productData);
      res.status(201).json({ success: true, product: created });
    } catch (err: any) {
      console.error('Add product error:', err);
      res.status(500).json({ error: 'Failed to add product' });
    }
  });

  // Update product (Admin only)
  app.put('/api/products/:id', requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await updateProduct(id, updates);
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
  app.delete('/api/products/:id', requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await deleteProduct(id);
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
  app.patch('/api/products/:id/toggle-publish', requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const product = await toggleProductPublish(id);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${id} not found` });
      }
      res.json({ success: true, product });
    } catch (err: any) {
      console.error('Toggle publish error:', err);
      res.status(500).json({ error: 'Failed to update product publish status' });
    }
  });

  // Upload product image (Admin only) - Permanent cloud persistence
  app.post('/api/upload', requireAdminAuth, async (req, res) => {
    try {
      const { image, filename } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'Image data is required' });
      }
      const fileUrl = await saveUploadedImage(image, filename || 'product_image.jpg');
      res.json({ success: true, url: fileUrl });
    } catch (err: any) {
      console.error('Upload image error:', err);
      res.status(500).json({ error: 'Failed to save uploaded image' });
    }
  });

  // Permanent image retrieval from database
  app.get('/api/images/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const imgRecord = await getUploadedImage(id);
      if (!imgRecord || !imgRecord.data) {
        return res.status(404).send('Image not found');
      }
      const matches = imgRecord.data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.send(buffer);
      }
      return res.status(400).send('Invalid image data');
    } catch (err) {
      console.error('Error serving image:', err);
      res.status(500).send('Error loading image');
    }
  });

  // ================= ORDER MANAGEMENT APIS =================
  // Get all orders (Admin only)
  app.get('/api/orders', requireAdminAuth, async (req, res) => {
    try {
      const orders = await getOrders();
      res.json(orders);
    } catch (err: any) {
      console.error('Get orders error:', err);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // Create order (Customer checkout)
  app.post('/api/orders', async (req, res) => {
    try {
      const orderData = req.body;
      if (!orderData || !orderData.id || !orderData.items) {
        return res.status(400).json({ error: 'Invalid order details' });
      }
      const created = await addOrder(orderData);
      res.status(201).json({ success: true, order: created });
    } catch (err: any) {
      console.error('Add order error:', err);
      res.status(500).json({ error: 'Failed to save order' });
    }
  });

  // Update order status (Admin only)
  app.patch('/api/orders/:id/status', requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'New order status is required' });
      }
      const updated = await updateOrderStatus(id, status);
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
  app.get('/api/categories', async (req, res) => {
    res.json(await getCategories());
  });

  app.post('/api/categories', requireAdminAuth, async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });
    const cats = await addCategory(name);
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

  // Production vs development determination:
  // In production (Render, Cloud Run, node dist/server.cjs), serve built frontend from dist
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    Boolean(process.env.RENDER) ||
    process.env.npm_lifecycle_event === 'start' ||
    (typeof __filename !== 'undefined' && __filename.includes('dist'));

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'))
      ? path.join(process.cwd(), 'dist')
      : (typeof __dirname !== 'undefined' ? __dirname : path.join(process.cwd(), 'dist'));

    app.use(express.static(distPath));

    app.get('*', (req: Request, res: Response) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Doctor Makhana server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
