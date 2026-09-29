const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const seedAll = require('./seed/seed');
const { memoryStore, loadStore } = require('./utils/storage');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const couponRoutes = require('./routes/couponRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    business: 'Al Zaban Hardware Store',
    location: 'Plot #3, Sector B-1, Block 11, Township, Lahore 54770, Pakistan',
    phone: '+92 42 35110830',
    whatsapp: '+92 335 1108300',
    email: 'info@alzaban.com',
    productsCount: memoryStore.products.length,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Server & Auto-Seed if empty
const startServer = async () => {
  await connectDB();
  loadStore();

  if (!memoryStore.products || memoryStore.products.length === 0) {
    console.log('[Init] No products found. Performing initial database seed...');
    await seedAll();
  } else {
    console.log(`[Init] Store loaded with ${memoryStore.products.length} products.`);
  }

  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Al Zaban Hardware Store - Backend Server Started`);
    console.log(` Port: ${PORT}`);
    console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Township, Lahore 54770, Pakistan`);
    console.log(`=======================================================`);
  });

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
