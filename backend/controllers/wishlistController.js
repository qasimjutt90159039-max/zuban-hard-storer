const { memoryStore, saveStore, isMongoConnected, generateId } = require('../utils/storage');
const Wishlist = require('../models/Wishlist');

// @desc    Get user wishlist
// @route   GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    if (isMongoConnected()) {
      let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
      if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user._id, products: [] });
      }
      return res.json({ success: true, wishlist: wishlist.products });
    } else {
      let wl = memoryStore.wishlists.find(w => w.user.toString() === userId);
      if (!wl) {
        wl = { _id: generateId(), user: userId, products: [] };
        memoryStore.wishlists.push(wl);
        saveStore();
      }

      // Populate product objects
      const populatedProducts = wl.products.map(pId =>
        memoryStore.products.find(p => p._id.toString() === pId.toString())
      ).filter(Boolean);

      return res.json({ success: true, wishlist: populatedProducts });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle product in wishlist (Add/Remove)
// @route   POST /api/wishlist/toggle
const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID required' });
    }

    if (isMongoConnected()) {
      let wishlist = await Wishlist.findOne({ user: req.user._id });
      if (!wishlist) {
        wishlist = new Wishlist({ user: req.user._id, products: [] });
      }

      const pIdStr = productId.toString();
      const exists = wishlist.products.some(p => p.toString() === pIdStr);

      if (exists) {
        wishlist.products = wishlist.products.filter(p => p.toString() !== pIdStr);
      } else {
        wishlist.products.push(productId);
      }

      await wishlist.save();
      await wishlist.populate('products');
      return res.json({
        success: true,
        action: exists ? 'removed' : 'added',
        wishlist: wishlist.products
      });
    } else {
      let wl = memoryStore.wishlists.find(w => w.user.toString() === userId);
      if (!wl) {
        wl = { _id: generateId(), user: userId, products: [] };
        memoryStore.wishlists.push(wl);
      }

      const pIdStr = productId.toString();
      const exists = wl.products.some(p => p.toString() === pIdStr);

      if (exists) {
        wl.products = wl.products.filter(p => p.toString() !== pIdStr);
      } else {
        wl.products.push(pIdStr);
      }

      saveStore();

      const populatedProducts = wl.products.map(pId =>
        memoryStore.products.find(p => p._id.toString() === pId.toString())
      ).filter(Boolean);

      return res.json({
        success: true,
        action: exists ? 'removed' : 'added',
        wishlist: populatedProducts
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist
};
