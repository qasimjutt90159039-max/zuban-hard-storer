const { memoryStore, saveStore, isMongoConnected, generateId } = require('../utils/storage');
const Cart = require('../models/Cart');

// @desc    Get user's cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    if (isMongoConnected()) {
      let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
      }
      return res.json({ success: true, cart });
    } else {
      let cart = memoryStore.carts.find(c => c.user.toString() === userId);
      if (!cart) {
        cart = { _id: generateId(), user: userId, items: [] };
        memoryStore.carts.push(cart);
        saveStore();
      }
      return res.json({ success: true, cart });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID required' });
    }

    if (isMongoConnected()) {
      let cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
      }

      const existingIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += Number(quantity);
      } else {
        cart.items.push({ product: productId, quantity: Number(quantity) });
      }

      await cart.save();
      await cart.populate('items.product');
      return res.json({ success: true, cart });
    } else {
      let cart = memoryStore.carts.find(c => c.user.toString() === userId);
      if (!cart) {
        cart = { _id: generateId(), user: userId, items: [] };
        memoryStore.carts.push(cart);
      }

      const existingIndex = cart.items.findIndex(item => item.productId === productId);
      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += Number(quantity);
      } else {
        cart.items.push({ productId, quantity: Number(quantity) });
      }

      saveStore();
      return res.json({ success: true, cart });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const productId = req.params.productId;

    if (isMongoConnected()) {
      let cart = await Cart.findOne({ user: req.user._id });
      if (cart) {
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
      }
      return res.json({ success: true, cart });
    } else {
      let cart = memoryStore.carts.find(c => c.user.toString() === userId);
      if (cart) {
        cart.items = cart.items.filter(item => item.productId !== productId);
        saveStore();
      }
      return res.json({ success: true, cart });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart
};
