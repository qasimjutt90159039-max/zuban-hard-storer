const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    customerDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true, default: 'Lahore' },
      province: { type: String, required: true, default: 'Punjab' },
      postalCode: { type: String, default: '54770' },
      orderNotes: { type: String, default: '' }
    },
    orderItems: [orderItemSchema],
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'Bank Transfer'],
      default: 'Cash on Delivery'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending'
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0
    },
    discountPrice: {
      type: Number,
      default: 0
    },
    couponCode: {
      type: String,
      default: ''
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
