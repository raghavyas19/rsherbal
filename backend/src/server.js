require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');

// Initialize passport strategies (Google)
try {
  require('./config/passportGoogle');
} catch (err) {
  // If strategy file doesn't exist yet, skip — it will be added by setup.
}

const { PORT = 5000, MONGODB_URI, CORS_ORIGIN, NODE_ENV } = process.env;

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
// Simple request/response logger for terminal output
try {
  app.use(require('./middleware/logRequests'));
} catch (err) {
  // If middleware can't be loaded for any reason, continue without it.
  console.warn('logRequests middleware not loaded:', err && err.message);
}
app.use(passport.initialize());

// Configure CORS more explicitly to support multiple allowed origins
const defaultAllowedOrigins = ['https://www.rsherbal.shop', 'https://rsherbal.shop'];
let allowedOrigins = defaultAllowedOrigins;
if (CORS_ORIGIN) {
  // Allow providing a comma-separated list in env var
  allowedOrigins = CORS_ORIGIN.split(',').map((s) => s.trim()).filter(Boolean);
}

const corsOptions = {
  origin: function (origin, callback) {
    // If no origin (e.g. server-to-server requests or tools) allow it
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // Not allowed
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// Ensure preflight (OPTIONS) requests are handled with CORS headers
app.options('*', cors(corsOptions));

app.use(helmet());

// Note: access/file logging has been removed to avoid creating or exposing a `log/` folder.

// Connect to MongoDB
if (!MONGODB_URI) {
  console.error('Missing required environment variable: MONGODB_URI.\nPlease set MONGODB_URI in your environment or in a .env file. Example:\nMONGODB_URI=mongodb://username:password@host:port/dbname');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Modular routes (to be added)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/products', require('./routes/products'));
app.use('/api/user', require('./routes/user'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('*', (req, res) => {
  res.status(404).json({ status: false, message: 'Endpoint Not Found' });
});

app.listen(PORT, () => console.info('Server listening on port', PORT));