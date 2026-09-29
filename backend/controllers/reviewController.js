const { memoryStore, saveStore, isMongoConnected, generateId } = require('../utils/storage');
const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
const getProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (isMongoConnected()) {
      const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });
      return res.json({ success: true, reviews });
    } else {
      const reviews = memoryStore.reviews.filter(r =>
        r.productId === productId ||
        r.product === productId
      );
      return res.json({ success: true, reviews });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new product review
// @route   POST /api/reviews/:productId
const createProductReview = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { rating, title, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating and review comment' });
    }

    const userName = req.user ? req.user.name : (req.body.userName || 'Verified Buyer');
    const userId = req.user ? req.user._id : generateId();

    const newReview = {
      _id: generateId(),
      product: productId,
      productId: productId,
      user: userId,
      userName,
      rating: Number(rating),
      title: title || '',
      comment,
      verifiedPurchase: true,
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected()) {
      const created = await Review.create(newReview);

      // Recalculate average rating on product
      const allReviews = await Review.find({ product: productId });
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await Product.findByIdAndUpdate(productId, {
        rating: Number(avgRating.toFixed(1)),
        reviewsCount: allReviews.length
      });

      return res.status(201).json({ success: true, review: created });
    } else {
      memoryStore.reviews.unshift(newReview);

      const prodReviews = memoryStore.reviews.filter(r => r.productId === productId || r.product === productId);
      const avgRating = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;

      const pIdx = memoryStore.products.findIndex(p => p._id.toString() === productId.toString() || p.slug === productId);
      if (pIdx > -1) {
        memoryStore.products[pIdx].rating = Number(avgRating.toFixed(1));
        memoryStore.products[pIdx].reviewsCount = prodReviews.length;
      }

      saveStore();
      return res.status(201).json({ success: true, review: newReview });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProductReviews,
  createProductReview
};
