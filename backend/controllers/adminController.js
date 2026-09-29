const { memoryStore, isMongoConnected } = require('../utils/storage');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get comprehensive admin dashboard analytics
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const products = isMongoConnected()
      ? await Product.find({}).lean()
      : memoryStore.products;

    const orders = isMongoConnected()
      ? await Order.find({}).sort({ createdAt: -1 }).lean()
      : memoryStore.orders;

    const users = isMongoConnected()
      ? await User.find({}).select('-password').lean()
      : memoryStore.users.map(({ password, ...u }) => u);

    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalCustomers = users.filter(u => u.role === 'customer').length || 1;

    const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
    const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
    const lowStockProducts = products.filter(p => p.stock <= 10).length;

    // Total revenue (from non-cancelled orders)
    const validOrders = orders.filter(o => o.orderStatus !== 'Cancelled');
    const totalRevenue = validOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

    // Category breakdown
    const categoryStats = {};
    products.forEach(p => {
      const cat = p.category || 'General';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { name: cat, count: 0, totalStock: 0 };
      }
      categoryStats[cat].count += 1;
      categoryStats[cat].totalStock += (p.stock || 0);
    });

    const categoryPerformance = Object.values(categoryStats).sort((a, b) => b.count - a.count);

    // Order status breakdown
    const orderStatuses = {
      Pending: orders.filter(o => o.orderStatus === 'Pending').length,
      Confirmed: orders.filter(o => o.orderStatus === 'Confirmed').length,
      Processing: orders.filter(o => o.orderStatus === 'Processing').length,
      Shipped: orders.filter(o => o.orderStatus === 'Shipped').length,
      Delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
      Cancelled: orders.filter(o => o.orderStatus === 'Cancelled').length
    };

    // Monthly sales mockup/aggregation
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const monthlySales = [
      { month: 'May', sales: 185000, orders: 14 },
      { month: 'Jun', sales: 240000, orders: 19 },
      { month: 'Jul', sales: 310000, orders: 25 },
      { month: 'Aug', sales: 295000, orders: 22 },
      { month: 'Sep', sales: 380000, orders: 31 },
      { month: 'Oct', sales: totalRevenue > 0 ? totalRevenue : 420000, orders: totalOrders || 36 }
    ];

    // Top selling products
    const topProducts = products
      .filter(p => p.bestseller || p.rating >= 4.8)
      .slice(0, 5)
      .map(p => ({
        _id: p._id,
        name: p.name,
        sku: p.sku,
        brand: p.brand,
        price: p.price,
        stock: p.stock,
        rating: p.rating,
        category: p.category
      }));

    return res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        pendingOrders,
        completedOrders,
        lowStockProducts
      },
      categoryPerformance,
      orderStatuses,
      monthlySales,
      topProducts,
      recentOrders: orders.slice(0, 5)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users list (Admin)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    let users;
    if (isMongoConnected()) {
      users = await User.find({}).select('-password').sort({ createdAt: -1 }).lean();
    } else {
      users = memoryStore.users.map(({ password, ...u }) => u);
    }

    return res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers
};
