const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product id' });
  }
  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// ADMIN: Get top products by review count
exports.getTopProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ reviewCount: -1 }).limit(4);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ADMIN: Create a new product
exports.adminCreateProduct = async (req, res) => {
  try {
    const {
      name,
      shortDescription,
      longDescription,
      price,
      originalPrice,
      image,
      images,
      category,
      quantity,
      unit,
      keyBenefits,
      keyIngredients,
      directionForUse,
      safetyInformation,
      technicalInformation,
      additionalInformation,
      inStock
    } = req.body;
    if (!name || !shortDescription || !price || !image || !category || !quantity || !unit) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const product = new Product({
      name,
      shortDescription,
      longDescription,
      price,
      originalPrice,
      image,
      images: images || [],
      category,
      quantity,
      unit,
      keyBenefits: keyBenefits || [],
      keyIngredients: keyIngredients || [],
      directionForUse,
      safetyInformation,
      technicalInformation,
      additionalInformation,
      inStock: typeof inStock === 'boolean' ? inStock : true,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ADMIN: Update a product (visibility, etc)
exports.adminUpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }
    const updateFields = req.body;
    const product = await Product.findByIdAndUpdate(id, updateFields, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ADMIN: Delete a product
exports.adminDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 