const Cart = require('../models/Cart');
const mongoose = require('mongoose');

exports.getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  res.json(cart);
};

exports.addOrUpdateCart = async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) return res.status(400).json({ message: 'Product and quantity required' });
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const idx = cart.items.findIndex(item => item.productId.equals(productId));
  if (idx > -1) {
    cart.items[idx].quantity = quantity;
  } else {
    cart.items.push({ productId, quantity });
  }
  await cart.save();
  res.json(cart);
};

exports.removeCartItem = async (req, res) => {
  const { itemId } = req.params;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items = cart.items.filter(item => !item.productId.equals(itemId));
  await cart.save();
  res.json(cart);
};

exports.mergeGuestCart = async (req, res) => {
  const { items } = req.body; // [{ productId, quantity }]
  if (!Array.isArray(items)) return res.status(400).json({ message: 'Invalid cart data' });
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  items.forEach(guestItem => {
    const idx = cart.items.findIndex(item => item.productId.equals(guestItem.productId));
    if (idx > -1) {
      cart.items[idx].quantity = Math.max(cart.items[idx].quantity, guestItem.quantity);
    } else {
      cart.items.push({ productId: guestItem.productId, quantity: guestItem.quantity });
    }
  });
  await cart.save();
  res.json(cart);
}; 