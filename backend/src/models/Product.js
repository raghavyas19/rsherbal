const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String, required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  description: { type: String },
  keyBenefits: [{ type: String }],
  keyIngredients: [{ type: String }],
  directionForUse: { type: String },
  safetyInformation: { type: String },
  technicalInformation: { type: String },
  additionalInformation: { type: String },
  ingredients: [{ type: String }],
  benefits: [{ type: String }],
  howToUse: [{ type: String }],
  precautions: [{ type: String }],
  inStock: { type: Boolean, default: true },
  visibility: { type: String, enum: ['public', 'hidden', 'archived'], default: 'public' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema); 