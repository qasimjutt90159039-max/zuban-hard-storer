const express = require('express');
const router = express.Router();
const { getProductReviews, createProductReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.get('/:productId', getProductReviews);
router.post('/:productId', optionalAuth, createProductReview);

module.exports = router;
