const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

dotenv.config({ path: __dirname + '/../.env' });

const categoriesData = require('./categoriesData');
const productsData = require('./productsData');
const { memoryStore, saveStore, isMongoConnected, generateId } = require('../utils/storage');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');

const seedAll = async () => {
  console.log('[Seed] Starting database population for Al Zaban Hardware Store...');

  // Try connecting to MongoDB if possible
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/alzaban_hardware';
  let mongoActive = false;
  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 1500 });
    mongoActive = true;
    console.log('[Seed] Connected to live MongoDB.');
  } catch (err) {
    console.log('[Seed] No live MongoDB service found. Seeding persistent embedded store.');
  }

  // 1. Password hashes
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Alzaban2026';
  const salt = await bcrypt.genSalt(10);
  const hashedAdminPassword = await bcrypt.hash(adminPassword, salt);
  const hashedCustomerPassword = await bcrypt.hash('Customer@12345', salt);

  const adminUser = {
    _id: generateId(),
    name: process.env.ADMIN_NAME || 'Al Zaban Admin',
    email: (process.env.ADMIN_EMAIL || 'admin@alzaban.com').toLowerCase(),
    password: hashedAdminPassword,
    role: 'admin',
    phone: '+92 42 35110830',
    address: {
      street: 'Plot #3, Sector B-1, Block 11, Township',
      city: 'Lahore',
      province: 'Punjab',
      postalCode: '54770'
    },
    createdAt: new Date().toISOString()
  };

  const customerUser = {
    _id: generateId(),
    name: 'Hamza Khan',
    email: 'customer@alzaban.com',
    password: hashedCustomerPassword,
    role: 'customer',
    phone: '+92 300 1234567',
    address: {
      street: 'House #45, Street 8, Model Town',
      city: 'Lahore',
      province: 'Punjab',
      postalCode: '54700'
    },
    createdAt: new Date().toISOString()
  };

  // 2. Prepare Categories with counts
  const categories = categoriesData.map(cat => {
    const count = productsData.filter(p => p.categorySlug === cat.slug).length;
    return {
      _id: generateId(),
      ...cat,
      productCount: count,
      createdAt: new Date().toISOString()
    };
  });

  // 3. Prepare Products with IDs
  const products = productsData.map((prod, index) => {
    const pId = generateId();
    return {
      _id: pId,
      ...prod,
      createdAt: new Date(Date.now() - (index * 86400000)).toISOString()
    };
  });

  // 4. Coupons
  const coupons = [
    {
      _id: generateId(),
      code: 'ALZABAN10',
      discountPercentage: 10,
      minPurchase: 1000,
      maxDiscount: 5000,
      isActive: true,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: generateId(),
      code: 'WELCOME5',
      discountPercentage: 5,
      minPurchase: 500,
      maxDiscount: 2000,
      isActive: true,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: generateId(),
      code: 'LAHOREHARDWARE',
      discountPercentage: 15,
      minPurchase: 5000,
      maxDiscount: 10000,
      isActive: true,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // 5. Sample Initial Orders for realistic dashboard analytics
  const sampleOrders = [
    {
      _id: generateId(),
      orderNumber: 'AZ-2026-1001',
      user: customerUser._id,
      customerDetails: {
        firstName: 'Hamza',
        lastName: 'Khan',
        email: 'customer@alzaban.com',
        phone: '+92 300 1234567',
        address: 'House #45, Street 8, Model Town',
        city: 'Lahore',
        province: 'Punjab',
        postalCode: '54700',
        orderNotes: 'Please deliver between 2 PM and 5 PM.'
      },
      orderItems: [
        {
          productId: products[0]._id,
          name: products[0].name,
          sku: products[0].sku,
          image: products[0].images[0],
          price: products[0].price,
          quantity: 2,
          subtotal: products[0].price * 2
        },
        {
          productId: products[16]._id, // Ingco drill
          name: products[16].name,
          sku: products[16].sku,
          image: products[16].images[0],
          price: products[16].price,
          quantity: 1,
          subtotal: products[16].price
        }
      ],
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      itemsPrice: products[0].price * 2 + products[16].price,
      shippingPrice: 0,
      discountPrice: 1000,
      couponCode: 'ALZABAN10',
      totalPrice: products[0].price * 2 + products[16].price - 1000,
      orderStatus: 'Delivered',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      _id: generateId(),
      orderNumber: 'AZ-2026-1002',
      user: null,
      customerDetails: {
        firstName: 'Tariq',
        lastName: 'Mehmood',
        email: 'tariq.mehmood@gmail.com',
        phone: '+92 321 9876543',
        address: 'Plot 12, Phase 5, DHA',
        city: 'Lahore',
        province: 'Punjab',
        postalCode: '54792',
        orderNotes: 'Call before delivery.'
      },
      orderItems: [
        {
          productId: products[4]._id, // Ingco Pliers
          name: products[4].name,
          sku: products[4].sku,
          image: products[4].images[0],
          price: products[4].price,
          quantity: 3,
          subtotal: products[4].price * 3
        },
        {
          productId: products[32]._id, // Measuring tape
          name: products[32].name,
          sku: products[32].sku,
          image: products[32].images[0],
          price: products[32].price,
          quantity: 2,
          subtotal: products[32].price * 2
        }
      ],
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      itemsPrice: products[4].price * 3 + products[32].price * 2,
      shippingPrice: 250,
      discountPrice: 0,
      couponCode: '',
      totalPrice: products[4].price * 3 + products[32].price * 2 + 250,
      orderStatus: 'Processing',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      _id: generateId(),
      orderNumber: 'AZ-2026-1003',
      user: customerUser._id,
      customerDetails: {
        firstName: 'Hamza',
        lastName: 'Khan',
        email: 'customer@alzaban.com',
        phone: '+92 300 1234567',
        address: 'House #45, Street 8, Model Town',
        city: 'Lahore',
        province: 'Punjab',
        postalCode: '54700',
        orderNotes: 'Urgent hardware supplies.'
      },
      orderItems: [
        {
          productId: products[20]._id, // Bosch grinder
          name: products[20].name,
          sku: products[20].sku,
          image: products[20].images[0],
          price: products[20].price,
          quantity: 1,
          subtotal: products[20].price
        }
      ],
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Pending',
      itemsPrice: products[20].price,
      shippingPrice: 0,
      discountPrice: 0,
      couponCode: '',
      totalPrice: products[20].price,
      orderStatus: 'Pending',
      createdAt: new Date().toISOString()
    }
  ];

  // 6. Sample verified reviews
  const sampleReviews = [
    {
      _id: generateId(),
      productId: products[0]._id,
      userId: customerUser._id,
      userName: 'Hamza K.',
      rating: 5,
      title: 'Top notch Stanley hammer',
      comment: 'Very solid fiberglass handle and the balance is exceptional. Excellent service from Al Zaban Township store.',
      verifiedPurchase: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: generateId(),
      productId: products[16]._id, // Ingco drill
      userId: customerUser._id,
      userName: 'Bilal Ahmed',
      rating: 5,
      title: 'Reliable impact drill',
      comment: 'Easily handles masonry drilling in Lahore brick walls. High value for money.',
      verifiedPurchase: true,
      createdAt: new Date().toISOString()
    }
  ];

  // Populate persistent storage
  memoryStore.users = [adminUser, customerUser];
  memoryStore.categories = categories;
  memoryStore.products = products;
  memoryStore.coupons = coupons;
  memoryStore.orders = sampleOrders;
  memoryStore.reviews = sampleReviews;
  memoryStore.carts = [];
  memoryStore.wishlists = [];
  saveStore();

  // If live MongoDB is connected, also populate MongoDB collections
  if (mongoActive) {
    try {
      await User.deleteMany({});
      await Product.deleteMany({});
      await Category.deleteMany({});
      await Coupon.deleteMany({});
      await Order.deleteMany({});
      await Review.deleteMany({});

      await User.insertMany([adminUser, customerUser]);
      await Category.insertMany(categories);
      await Product.insertMany(products);
      await Coupon.insertMany(coupons);
      await Order.insertMany(sampleOrders);
      await Review.insertMany(sampleReviews);

      console.log('[Seed] Live MongoDB collections synced successfully.');
    } catch (err) {
      console.warn('[Seed] Mongoose collection sync notice:', err.message);
    }
  }

  console.log(`[Seed Complete] Successfully populated:`);
  console.log(`  - ${categories.length} Categories`);
  console.log(`  - ${products.length} Realistic Hardware Products`);
  console.log(`  - 2 User Accounts (Admin: ${adminUser.email} / Customer: ${customerUser.email})`);
  console.log(`  - ${coupons.length} Active Coupons`);
  console.log(`  - ${sampleOrders.length} Initial Sample Orders`);
  console.log(`  - ${sampleReviews.length} Verified Reviews`);
};

if (require.main === module) {
  seedAll()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('[Seed Error]:', err);
      process.exit(1);
    });
}

module.exports = seedAll;
