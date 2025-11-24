const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');
const blockAdmin = require('../middleware/blockAdmin');

router.use(auth);
router.use(blockAdmin);

router.get('/', cartController.getCart);
router.post('/', cartController.addOrUpdateCart);
router.delete('/:itemId', cartController.removeCartItem);
router.post('/merge', cartController.mergeGuestCart);

module.exports = router; 