const { memoryStore, saveStore, isMongoConnected, generateId } = require('../utils/storage');
const Order = require('../models/Order');

// @desc    Create a new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const {
      customerDetails,
      orderItems,
      paymentMethod,
      couponCode,
      discountPrice
    } = req.body;

    if (!customerDetails || !customerDetails.firstName || !customerDetails.phone || !customerDetails.address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full delivery details (Name, Phone, and Address)'
      });
    }

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    // Calculate items price
    const itemsPrice = orderItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);

    // Lahore delivery rule: Free delivery above Rs. 5,000; otherwise Rs. 250
    const shippingPrice = itemsPrice >= 5000 ? 0 : 250;

    const discount = Number(discountPrice) || 0;
    const totalPrice = Math.max(0, itemsPrice + shippingPrice - discount);

    // Generate Order Number: AZ-2026-XXXX
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AZ-2026-${randomCode}`;

    const newOrder = {
      _id: generateId(),
      orderNumber,
      user: req.user ? req.user._id : null,
      customerDetails: {
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName || '',
        email: customerDetails.email || '',
        phone: customerDetails.phone,
        address: customerDetails.address,
        city: customerDetails.city || 'Lahore',
        province: customerDetails.province || 'Punjab',
        postalCode: customerDetails.postalCode || '54770',
        orderNotes: customerDetails.orderNotes || ''
      },
      orderItems: orderItems.map(item => ({
        productId: item.productId || item._id,
        name: item.name,
        sku: item.sku,
        image: item.image || (item.images && item.images[0]) || '',
        price: Number(item.price),
        quantity: Number(item.quantity),
        subtotal: Number(item.price) * Number(item.quantity)
      })),
      paymentMethod: paymentMethod === 'Bank Transfer' ? 'Bank Transfer' : 'Cash on Delivery',
      paymentStatus: 'Pending',
      itemsPrice,
      shippingPrice,
      discountPrice: discount,
      couponCode: couponCode || '',
      totalPrice,
      orderStatus: 'Pending',
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected()) {
      const createdOrder = await Order.create(newOrder);
      return res.status(201).json({ success: true, order: createdOrder });
    } else {
      memoryStore.orders.unshift(newOrder);
      saveStore();
      return res.status(201).json({ success: true, order: newOrder });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const userId = req.user._id.toString();
    const userEmail = req.user.email.toLowerCase();

    if (isMongoConnected()) {
      const orders = await Order.find({
        $or: [{ user: req.user._id }, { 'customerDetails.email': userEmail }]
      }).sort({ createdAt: -1 });
      return res.json({ success: true, orders });
    } else {
      const orders = memoryStore.orders.filter(o =>
        (o.user && o.user.toString() === userId) ||
        (o.customerDetails && o.customerDetails.email && o.customerDetails.email.toLowerCase() === userEmail)
      );
      return res.json({ success: true, orders });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order by ID or Order Number
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;

    if (isMongoConnected()) {
      const order = await Order.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderNumber: id }]
      });
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      return res.json({ success: true, order });
    } else {
      const order = memoryStore.orders.find(o =>
        o._id.toString() === id.toString() ||
        o.orderNumber === id
      );
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      return res.json({ success: true, order });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const status = req.query.status;

    let orders = isMongoConnected()
      ? await Order.find({}).sort({ createdAt: -1 }).lean()
      : [...memoryStore.orders];

    if (status && status !== 'all') {
      orders = orders.filter(o => o.orderStatus.toLowerCase() === status.toLowerCase());
    }

    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { orderStatus, paymentStatus } = req.body;

    const allowedStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (orderStatus && !allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (isMongoConnected()) {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      if (orderStatus) order.orderStatus = orderStatus;
      if (paymentStatus) order.paymentStatus = paymentStatus;

      const updated = await order.save();
      return res.json({ success: true, order: updated });
    } else {
      const index = memoryStore.orders.findIndex(o => o._id.toString() === id.toString() || o.orderNumber === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      if (orderStatus) memoryStore.orders[index].orderStatus = orderStatus;
      if (paymentStatus) memoryStore.orders[index].paymentStatus = paymentStatus;

      saveStore();
      return res.json({ success: true, order: memoryStore.orders[index] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
