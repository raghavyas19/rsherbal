const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  username: { type: String, unique: true, sparse: true },
  name: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  lastLogin: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  dob: { type: Date },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 