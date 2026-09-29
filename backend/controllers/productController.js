const { memoryStore, saveStore, isMongoConnected, generateId } = require('../utils/storage');
const Product = require('../models/Product');

// Helper to filter & sort products in-memory
const filterAndSortProducts = (products, query) => {
  let filtered = [...products];

  // Search keyword across name, brand, sku, description, tags
  if (query.search) {
    const s = query.search.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.brand.toLowerCase().includes(s) ||
      p.sku.toLowerCase().includes(s) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(s))) ||
      p.description.toLowerCase().includes(s)
    );
  }

  // Category filter
  if (query.category && query.category !== 'all') {
    const cat = query.category.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.categorySlug === cat ||
      p.category.toLowerCase() === cat
    );
  }

  // Brand filter (supports comma-separated multiple brands)
  if (query.brand && query.brand !== 'all') {
    const brands = query.brand.split(',').map(b => b.trim().toLowerCase());
    filtered = filtered.filter(p => brands.includes(p.brand.toLowerCase()));
  }

  // Price range
  if (query.minPrice) {
    const min = Number(query.minPrice);
    if (!isNaN(min)) filtered = filtered.filter(p => p.price >= min);
  }
  if (query.maxPrice) {
    const max = Number(query.maxPrice);
    if (!isNaN(max)) filtered = filtered.filter(p => p.price <= max);
  }

  // Stock status
  if (query.stockStatus && query.stockStatus !== 'all') {
    if (query.stockStatus === 'in-stock') {
      filtered = filtered.filter(p => p.stock > 0);
    } else if (query.stockStatus === 'low-stock') {
      filtered = filtered.filter(p => p.stockStatus === 'Low Stock' || (p.stock > 0 && p.stock <= 10));
    }
  }

  // Rating filter
  if (query.rating) {
    const minRating = Number(query.rating);
    if (!isNaN(minRating)) filtered = filtered.filter(p => p.rating >= minRating);
  }

  // Discount only
  if (query.discountOnly === 'true' || query.discountOnly === true) {
    filtered = filtered.filter(p => p.discount > 0);
  }

  // Featured only
  if (query.featured === 'true' || query.featured === true) {
    filtered = filtered.filter(p => p.featured === true);
  }

  // Bestseller only
  if (query.bestseller === 'true' || query.bestseller === true) {
    filtered = filtered.filter(p => p.bestseller === true);
  }

  // Sorting
  const sort = query.sort || 'popular';
  switch (sort) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      break;
    case 'price_asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'popular':
    default:
      filtered.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
      break;
  }

  return filtered;
};

// @desc    Get all products with filters & pagination
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const allProducts = isMongoConnected()
      ? await Product.find({}).lean()
      : memoryStore.products;

    const filtered = filterAndSortProducts(allProducts, req.query);
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filtered.slice(startIndex, startIndex + limit);

    // Extract unique brands for filters
    const availableBrands = [...new Set(allProducts.map(p => p.brand))].sort();

    return res.json({
      success: true,
      count: paginatedProducts.length,
      total,
      page,
      totalPages,
      availableBrands,
      products: paginatedProducts
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get live search suggestions
// @route   GET /api/products/search/suggestions
const getSearchSuggestions = async (req, res) => {
  try {
    const query = (req.query.q || '').toLowerCase().trim();
    if (!query) {
      return res.json({ success: true, suggestions: [] });
    }

    const allProducts = isMongoConnected()
      ? await Product.find({}).lean()
      : memoryStore.products;

    const matches = allProducts
      .filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
      .slice(0, 8)
      .map(p => ({
        _id: p._id,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        category: p.category,
        brand: p.brand,
        price: p.price,
        image: p.images && p.images[0] ? p.images[0] : ''
      }));

    return res.json({
      success: true,
      suggestions: matches
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get 12 featured products for homepage
// @route   GET /api/products/featured
const getFeaturedProducts = async (req, res) => {
  try {
    const allProducts = isMongoConnected()
      ? await Product.find({}).lean()
      : memoryStore.products;

    let featured = allProducts.filter(p => p.featured);
    if (featured.length < 12) {
      // Fallback to top rated/bestsellers to ensure exactly 12 items
      const additional = allProducts.filter(p => !p.featured).slice(0, 12 - featured.length);
      featured = [...featured, ...additional];
    }

    return res.json({
      success: true,
      products: featured.slice(0, 12)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bestsellers
// @route   GET /api/products/bestsellers
const getBestsellers = async (req, res) => {
  try {
    const allProducts = isMongoConnected()
      ? await Product.find({}).lean()
      : memoryStore.products;

    const bestsellers = allProducts.filter(p => p.bestseller).slice(0, 8);
    return res.json({
      success: true,
      products: bestsellers.length ? bestsellers : allProducts.slice(0, 8)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:id
const getProductByIdOrSlug = async (req, res) => {
  try {
    const param = req.params.id;
    const allProducts = isMongoConnected()
      ? await Product.find({}).lean()
      : memoryStore.products;

    const product = allProducts.find(p =>
      p._id.toString() === param ||
      p.slug === param ||
      p.sku.toLowerCase() === param.toLowerCase()
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch related products in same category
    const relatedProducts = allProducts
      .filter(p => p.categorySlug === product.categorySlug && p._id.toString() !== product._id.toString())
      .slice(0, 4);

    return res.json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product (Admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      category,
      categorySlug,
      brand,
      description,
      shortDescription,
      price,
      compareAtPrice,
      discount,
      stock,
      images,
      specifications,
      tags,
      featured,
      bestseller
    } = req.body;

    if (!name || !sku || !category || !brand || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, SKU, category, brand, and price are required'
      });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const calculatedDiscount = compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : (discount || 0);

    const stockStatus = stock <= 0 ? 'Out of Stock' : (stock <= 5 ? 'Low Stock' : 'In Stock');

    const newProduct = {
      _id: generateId(),
      name,
      slug,
      sku: sku.toUpperCase().trim(),
      category,
      categorySlug: categorySlug || category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand,
      description,
      shortDescription: shortDescription || description.slice(0, 120),
      price: Number(price),
      compareAtPrice: Number(compareAtPrice) || 0,
      discount: calculatedDiscount,
      stock: Number(stock) || 0,
      stockStatus,
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80'],
      rating: 4.5,
      reviewsCount: 0,
      specifications: specifications || {},
      tags: tags || [],
      featured: Boolean(featured),
      bestseller: Boolean(bestseller),
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected()) {
      const created = await Product.create(newProduct);
      return res.status(201).json({ success: true, product: created });
    } else {
      memoryStore.products.unshift(newProduct);
      saveStore();
      return res.status(201).json({ success: true, product: newProduct });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    if (updates.price || updates.compareAtPrice) {
      const price = Number(updates.price);
      const compare = Number(updates.compareAtPrice);
      if (compare && price && compare > price) {
        updates.discount = Math.round(((compare - price) / compare) * 100);
      }
    }

    if (typeof updates.stock !== 'undefined') {
      const stock = Number(updates.stock);
      updates.stock = stock;
      updates.stockStatus = stock <= 0 ? 'Out of Stock' : (stock <= 5 ? 'Low Stock' : 'In Stock');
    }

    if (isMongoConnected()) {
      const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, product: updated });
    } else {
      const index = memoryStore.products.findIndex(p => p._id.toString() === id.toString() || p.slug === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      memoryStore.products[index] = {
        ...memoryStore.products[index],
        ...updates
      };
      saveStore();

      return res.json({ success: true, product: memoryStore.products[index] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    if (isMongoConnected()) {
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, message: 'Product removed successfully' });
    } else {
      const initialCount = memoryStore.products.length;
      memoryStore.products = memoryStore.products.filter(p => p._id.toString() !== id.toString());
      if (memoryStore.products.length === initialCount) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      saveStore();
      return res.json({ success: true, message: 'Product removed successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getSearchSuggestions,
  getFeaturedProducts,
  getBestsellers,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct
};
