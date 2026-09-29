const express = require('express');
const router = express.Router();
const {
  getProducts,
  getSearchSuggestions,
  getFeaturedProducts,
  getBestsellers,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/search/suggestions', getSearchSuggestions);
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestsellers);
router.get('/:id', getProductByIdOrSlug);

// Admin endpoints
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
