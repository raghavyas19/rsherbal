const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  // Delay throwing so that app can still start in environments where OAuth is not configured yet.
  console.warn('Google OAuth environment variables not fully set. Google strategy will be inactive.');
} else {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.toLowerCase();
      // Look for existing user by googleId or email
      let user = null;
      if (profile.id) {
        user = await User.findOne({ googleId: profile.id });
      }
      if (!user && email) {
        user = await User.findOne({ email });
      }

      if (!user) {
        // Generate a unique username based on email or name
        const base = (email && email.split('@')[0]) || (profile.displayName || 'user').replace(/\s+/g, '').toLowerCase();
        let username = base;
        let suffix = 0;
        while (await User.findOne({ username })) {
          suffix += 1;
          username = `${base}${suffix}`;
        }
        user = await User.create({
          googleId: profile.id,
          email,
          name: profile.displayName,
          username,
          isEmailVerified: true,
          lastLogin: new Date(),
        });
      } else {
        // Update existing user with googleId/email if missing
        const needsUpdate = {};
        if (profile.id && !user.googleId) needsUpdate.googleId = profile.id;
        if (email && !user.email) needsUpdate.email = email;
        needsUpdate.isEmailVerified = true;
        needsUpdate.lastLogin = new Date();
        if (Object.keys(needsUpdate).length) {
          await User.findByIdAndUpdate(user._id, { $set: needsUpdate }, { new: true });
        }
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
}

// No session serialization needed (JWT flow)
module.exports = passport;
