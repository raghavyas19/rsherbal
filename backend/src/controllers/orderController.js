const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

// Robust Cloudinary config: accept CLOUDINARY_URL (cloudinary://key:secret@name)
try {
  if (process.env.CLOUDINARY_URL) {
    // prefer parsing CLOUDINARY_URL to ensure api_key/api_secret are set
    const m = String(process.env.CLOUDINARY_URL).match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (m) {
      const [, api_key, api_secret, cloud_name] = m;
      cloudinary.config({ cloud_name, api_key, api_secret });
      console.info('Cloudinary configured from CLOUDINARY_URL');
    } else {
      // fallback to letting cloudinary parse the URL
      cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });
      console.info('Cloudinary configured from CLOUDINARY_URL (fallback)');
    }
  } else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.info('Cloudinary configured from CLOUDINARY_* env vars');
  }
} catch (e) {
  console.warn('Cloudinary config failed:', e && e.message ? e.message : e);
}

exports.placeOrder = async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

  // Calculate total and get product prices
  let total = 0;
  const items = await Promise.all(cart.items.map(async (item) => {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error('Product not found');
    const price = product.price;
    total += price * item.quantity;
    return { productId: product._id, quantity: item.quantity, price };
  }));

  // New: Get UTR, screenshot, contact, address from req.body/req.file
  const {
    email, name, phone, address, city, state, zipCode, landmark,
    utrNumber, // from frontend
  } = req.body;
  const contact = { name, phone, email };
  const addressObj = {
    line1: address,
    line2: landmark || '',
    city,
    state,
    pincode: zipCode,
    country: 'India',
  };
  // If a file was uploaded, upload to Cloudinary and store the secure URL
  let paymentScreenshot = undefined;
  if (req.file && req.file.buffer) {
    try {
      if (cloudinary && cloudinary.uploader) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'payments', resource_type: 'image' }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
          stream.end(req.file.buffer);
        });
        paymentScreenshot = uploadResult.secure_url;
      }
    } catch (e) {
      console.error('Cloudinary upload failed:', e.message || e);
      // fallback: continue without screenshot
      paymentScreenshot = undefined;
    }
  }

  const order = await Order.create({
    user: userId,
    items,
    total,
    status: 'pending',
    contact,
    address: addressObj,
    utrNumber,
    paymentScreenshot,
    paymentStatus: utrNumber ? 'pending' : 'pending',
  });
  // Clear cart
  cart.items = [];
  await cart.save();
  res.json(order);
};

exports.getUserOrders = async (req, res) => {
  const userId = req.user._id;
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  res.json(orders);
};

// ADMIN: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ADMIN: Get order stats for dashboard
exports.getOrderStats = async (req, res) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ADMIN: Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderid)
      .populate('user', 'name')
      .populate('items.productId', 'name price images');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ADMIN: Mark order as paid
exports.markOrderPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderid).populate('user', 'name mobile');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    await order.save();

    // Message-sending disabled: previously this sent an SMS to the user.
    // If you want to re-enable notifications, implement your new notifier here.

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// USER: Get single order by ID (with product details)
exports.getUserOrderById = async (req, res) => {
  try {
    const userId = req.user._id;
    const order = await Order.findOne({ _id: req.params.id, user: userId })
      .populate('items.productId', 'name price images');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Serve payment screenshot for an order only to the order owner or admin
exports.serveOrderScreenshot = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('user', '_id');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const requester = req.user;
    // Allow if admin or owner
    if (!(requester && (requester.role === 'admin' || String(order.user._id) === String(requester._id)))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const screenshotUrl = order.paymentScreenshot;
    if (!screenshotUrl) return res.status(404).json({ message: 'No screenshot available' });

    // Proxy the remote image to the client
    const url = new URL(screenshotUrl);
    const protocol = url.protocol === 'http:' ? require('http') : require('https');
    const options = {
      headers: {
        // forward minimal headers
        'User-Agent': 'rsherbal-proxy/1.0'
      }
    };
    protocol.get(screenshotUrl, options, (remoteRes) => {
      if (remoteRes.statusCode >= 400) {
        return res.status(502).json({ message: 'Failed to fetch image' });
      }
      // set content-type and other relevant headers
      if (remoteRes.headers['content-type']) res.setHeader('Content-Type', remoteRes.headers['content-type']);
      if (remoteRes.headers['content-length']) res.setHeader('Content-Length', remoteRes.headers['content-length']);
      remoteRes.pipe(res);
    }).on('error', (err) => {
      console.error('Error proxying screenshot:', err.message || err);
      return res.status(502).json({ message: 'Failed to fetch image' });
    });

  } catch (err) {
    console.error('serveOrderScreenshot error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ADMIN: Update order status and shipping info
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, courierName, trackingId, deliveryDate, cancelledDate } = req.body;
    const order = await Order.findById(req.params.orderid);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // If courier info is provided, always set status to 'shipped'
    if (courierName && trackingId) {
      order.status = 'shipped';
      order.courierName = courierName;
      order.trackingId = trackingId;
    } else {
      order.status = status;
    }
    if (order.status === 'delivered' && deliveryDate) {
      order.deliveryDate = deliveryDate;
      order.cancelledDate = undefined;
    }
    // Handle cancelled status and date
    if (order.status === 'cancelled' && cancelledDate) {
      order.cancelledDate = cancelledDate;
      order.deliveryDate = undefined;
    }
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 

// ADMIN: Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { orderid } = req.params;
    if (!orderid) return res.status(400).json({ message: 'Missing order id' });
    const order = await Order.findById(orderid);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Note: we don't delete remote Cloudinary image here because we store only the URL.
    await Order.findByIdAndDelete(orderid);
    return res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error('deleteOrder error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};