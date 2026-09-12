const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const foodItemsRouter = require('./routes/foodItems');
const authRouter = require('./routes/auth');
const ordersRouter = require('./routes/orders');
const restaurantsRouter = require('./routes/restaurants');
const http = require('http');
const { Server } = require('socket.io');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const { setIo } = require('./src/socket');
const { getJwtSecret, getClientOrigins } = require('./src/config');

const app = express();
const server = http.createServer(app);

const allowedOrigins = getClientOrigins();
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});
setIo(io);

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET is required in production');
} else if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET not set. Using development fallback only.');
}

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '1mb' }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/auth', authLimiter);

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.warn('WARNING: MONGO_URI is not set. Set it in .env (see .env.example).');
} else {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      console.log('Database:', mongoose.connection.name);
    })
    .catch(err => console.error('MongoDB connection error:', err));
}

app.get('/', (req, res) => {
  res.send('GoEato Backend is Running');
});

app.get('/health', (req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.use('/api/food-items', foodItemsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/restaurants', restaurantsRouter);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    const secret = getJwtSecret();
    const claims = jwt.verify(token, secret);
    const user = await User.findById(claims.id).select('_id role');
    if (!user) return next(new Error('User no longer exists'));
    socket.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    next(new Error('Invalid socket token'));
  }
});

io.on('connection', (socket) => {
  socket.join(`user:${socket.user.id}`);
  if (socket.user.role === 'admin') socket.join('admins');
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const shutdown = () => {
    server.close(() => {
      mongoose.disconnect().finally(() => process.exit(0));
    });
    setTimeout(() => process.exit(0), 5000).unref();
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = { app, server };
