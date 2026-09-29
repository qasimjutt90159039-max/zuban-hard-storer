const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },
    minPurchase: {
      type: Number,
      default: 0
    },
    maxDiscount: {
      type: Number,
      default: 10000
    },
    isActive: {
      type: Boolean,
      default: true
    },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Coupon', couponSchema);
