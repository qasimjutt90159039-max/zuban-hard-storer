const { memoryStore, isMongoConnected } = require('../utils/storage');
const Coupon = require('../models/Coupon');

// @desc    Validate and apply coupon code
// @route   POST /api/coupons/validate
const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
    }

    const cleanCode = code.toUpperCase().trim();
    const purchaseAmount = Number(subtotal) || 0;

    let coupon;
    if (isMongoConnected()) {
      coupon = await Coupon.findOne({ code: cleanCode, isActive: true });
    } else {
      coupon = memoryStore.coupons.find(c => c.code === cleanCode && c.isActive);
    }

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    if (purchaseAmount < coupon.minPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of Rs. ${coupon.minPurchase.toLocaleString()} required for this coupon`
      });
    }

    const discountAmount = Math.min(
      Math.round((purchaseAmount * coupon.discountPercentage) / 100),
      coupon.maxDiscount || 10000
    );

    return res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        discountAmount
      },
      message: `Coupon applied! You saved Rs. ${discountAmount.toLocaleString()}`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  validateCoupon
};
