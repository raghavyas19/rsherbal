const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const User = require('../models/User');

// Get current user profile
router.get('/me', auth, (req, res) => {
  const { _id, mobile, name, gender, dob, email, username, role, isEmailVerified, lastLogin } = req.user;
  res.json({ id: _id, mobile, name, gender, dob, email, username, role, isEmailVerified, lastLogin });
});

// Update current user profile (only name, gender, dob allowed)
router.patch('/me', auth, async (req, res) => {
  try {
    const allowed = ['name', 'gender', 'dob'];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // If dob provided, ensure valid date
    if (updates.dob) {
      const d = new Date(updates.dob);
      if (isNaN(d.getTime())) return res.status(400).json({ message: 'Invalid date of birth' });
      updates.dob = d;
    }

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { _id, mobile, name, gender, dob, email, username, role, isEmailVerified, lastLogin } = user;
    res.json({ id: _id, mobile, name, gender, dob, email, username, role, isEmailVerified, lastLogin });
  } catch (err) {
    console.error('Update profile error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 