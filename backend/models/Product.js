const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    sku: {
      type: String,
      required: [true, 'Please enter product SKU'],
      unique: true,
      uppercase: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      trim: true
    },
    categorySlug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Please specify brand'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please enter product description']
    },
    shortDescription: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price in PKR'],
      min: 0
    },
    compareAtPrice: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      required: [true, 'Please enter available stock'],
      default: 10,
      min: 0
    },
    stockStatus: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock'
    },
    images: {
      type: [String],
      default: []
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    specifications: {
      type: Map,
      of: String,
      default: {}
    },
    tags: {
      type: [String],
      default: []
    },
    featured: {
      type: Boolean,
      default: false
    },
    bestseller: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ name: 'text', brand: 'text', sku: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
