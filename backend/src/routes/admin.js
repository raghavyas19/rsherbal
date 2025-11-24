const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const orderController = require('../controllers/orderController');
const productController = require('../controllers/productController');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const CLIENT_URL = process.env.CLIENT_URL || process.env.CORS_ORIGIN || 'http://localhost:5173';

// Hardcoded admin login
router.post('/login', (req, res) => {
  const { id, password } = req.body || {};
  if (id === 'admin' && password === 'password') {
    const token = jwt.sign({ id: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie('auth_token', token, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 60 * 1000,
    });
    res.cookie('auth_completed', '1', {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 60 * 1000,
    });
    return res.json({ message: 'admin_logged_in' });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

// Admin logout - clears cookies
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('auth_token');
  res.clearCookie('auth_completed');
  res.json({ message: 'logged_out' });
});

// GET /api/admin/users - Get all users (admin only)
router.get('/users', auth, admin, async (req, res) => {
  try {
  const users = await User.find().select('-__v');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/users/:id - delete a user (admin only)
router.delete('/users/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing user id' });
    await User.findByIdAndDelete(id);
    return res.json({ message: 'User deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/orders - Get all orders (admin only)
router.get('/orders', auth, admin, orderController.getAllOrders);

// GET /api/admin/order-stats - Get order stats for dashboard (admin only)
router.get('/order-stats', auth, admin, orderController.getOrderStats);

// GET /api/admin/top-products - Get top products by review count (admin only)
router.get('/top-products', auth, admin, productController.getTopProducts);

// Add product (admin only)
router.post('/products', auth, admin, productController.adminCreateProduct);

// Update product (admin only)
router.patch('/products/:id', auth, admin, productController.adminUpdateProduct);

// Delete product (admin only)
router.delete('/products/:id', auth, admin, productController.adminDeleteProduct);

// Admin order details and mark as paid
router.get('/orders/:orderid', orderController.getOrderById);
router.patch('/orders/:orderid/mark-paid', orderController.markOrderPaid);

// Update order status
router.patch('/orders/:orderid/status', orderController.updateOrderStatus);
// Delete order
router.delete('/orders/:orderid', auth, admin, orderController.deleteOrder);

module.exports = router; 