const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const CLIENT_URL = process.env.CLIENT_URL || process.env.CORS_ORIGIN || 'http://localhost:5173';

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
}

// Initiate Google OAuth
const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Google OAuth callback handler
const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user) => {
    if (err || !user) {
      console.error('Google auth error', err);
      return res.redirect(`${CLIENT_URL}/user/auth?error=google_failed`);
    }

    try {
      // Ensure lastLogin updated
      user.lastLogin = new Date();
      await user.save();

      const token = signToken(user);

      const isProd = process.env.NODE_ENV === 'production';
      // Set httpOnly token for requests
      res.cookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Set short-lived readable token for frontend to pick up once
      res.cookie('auth_token', token, {
        httpOnly: false,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 60 * 1000, // 1 minute
      });

      // Set a flag cookie to indicate auth completed
      res.cookie('auth_completed', '1', {
        httpOnly: false,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 60 * 1000,
      });

      // Choose redirect based on role
      const redirectPath = user.role === 'admin' ? '/admin' : '/';
      return res.redirect(`${CLIENT_URL}/auth/callback?next=${encodeURIComponent(redirectPath)}`);
    } catch (e) {
      console.error('Error processing google callback', e);
      return res.redirect(`${CLIENT_URL}/user/auth?error=server_error`);
    }
  })(req, res, next);
};

module.exports = {
  googleAuth,
  googleCallback,
};