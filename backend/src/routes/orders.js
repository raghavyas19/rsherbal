const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Use memory storage so we can upload buffers to Cloudinary (or other providers)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    // allow common image types
    if (/^image\/(jpeg|png|webp|gif)$/i.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, png, webp, gif)'));
    }
  }
});

router.use(auth);

router.post('/', upload.single('paymentScreenshot'), orderController.placeOrder);
router.get('/', orderController.getUserOrders);
// Serve screenshot for an order (auth required) before the generic :id route
router.get('/:id/screenshot', orderController.serveOrderScreenshot);
router.get('/:id', orderController.getUserOrderById);

module.exports = router; 