const Review = require('../models/Review');
const mongoose = require('mongoose');

exports.addReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  if (!rating) return res.status(400).json({ message: 'Rating is required' });
  // Prevent multiple reviews by same user for same product
  const existing = await Review.findOne({ product: productId, user: req.user._id });
  if (existing) return res.status(400).json({ message: 'You have already reviewed this product' });
  const review = await Review.create({ product: productId, user: req.user._id, rating, comment });
  res.json(review);
};

exports.getProductReviews = async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid product id' });
  }
  const reviews = await Review.find({ product: productId }).populate('user', 'name');
  res.json(reviews);
}; 