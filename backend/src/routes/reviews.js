const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post('/:productId', auth, reviewController.addReview);
router.get('/:productId', reviewController.getProductReviews);

module.exports = router; 