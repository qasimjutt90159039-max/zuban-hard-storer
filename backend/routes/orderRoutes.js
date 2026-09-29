const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Optional protect middleware so guest checkout also works cleanly if needed,
// but if bearer token present it extracts user
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.post('/', optionalAuth, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', getOrderById);

// Admin endpoints
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
