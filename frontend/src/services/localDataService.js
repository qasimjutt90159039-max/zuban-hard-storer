import initialData from '../data/initialStoreData.json';

const STORAGE_KEY = 'alzaban_local_store_v1';

// Initialize or get client-side persistent storage
export function getLocalStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.products && parsed.products.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[LocalStore] Error reading from localStorage', err);
  }

  // Fallback to bundled dataset (145 products, 12 categories, coupons, demo users)
  const defaultStore = {
    products: initialData.products || [],
    categories: initialData.categories || [],
    users: initialData.users || [
      {
        _id: 'usr_admin_001',
        name: 'Al Zaban Admin',
        email: 'admin@alzaban.com',
        role: 'admin',
        phone: '+92 42 35110830',
        city: 'Lahore'
      },
      {
        _id: 'usr_cust_002',
        name: 'Demo Customer',
        email: 'customer@alzaban.com',
        role: 'customer',
        phone: '+92 335 1108300',
        city: 'Lahore'
      }
    ],
    orders: initialData.orders || [],
    reviews: initialData.reviews || [],
    coupons: initialData.coupons || [
      {
        _id: 'cpn_1',
        code: 'ALZABAN10',
        discountPercent: 10,
        minOrderAmount: 2000,
        expiryDate: '2027-12-31',
        isActive: true,
        description: '10% discount on orders above Rs. 2,000'
      },
      {
        _id: 'cpn_2',
        code: 'LAHORE5',
        discountPercent: 5,
        minOrderAmount: 1000,
        expiryDate: '2027-12-31',
        isActive: true,
        description: '5% Lahore community welcome discount'
      },
      {
        _id: 'cpn_3',
        code: 'SASTA20',
        discountPercent: 20,
        minOrderAmount: 1500,
        expiryDate: '2027-12-31',
        isActive: true,
        description: '20% Mega Sasta discount on budget hardware tools'
      },
      {
        _id: 'cpn_4',
        code: 'HARDWARE15',
        discountPercent: 15,
        minOrderAmount: 5000,
        expiryDate: '2027-12-31',
        isActive: true,
        description: '15% discount on contractor orders above Rs. 5,000'
      }
    ]
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStore));
  } catch (e) {
    console.warn('[LocalStore] Could not persist initial data to localStorage');
  }

  return defaultStore;
}

export function saveLocalStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.warn('[LocalStore] Error saving store to localStorage', err);
  }
}

// Client-side Router/Handler for all API endpoints
export function handleLocalApiRequest(config) {
  const store = getLocalStore();
  const method = (config.method || 'GET').toUpperCase();
  let url = config.url || '';

  // Strip baseURL or leading /api if present
  if (url.startsWith('/api')) {
    url = url.slice(4);
  }
  if (!url.startsWith('/')) {
    url = '/' + url;
  }

  const [path, queryString] = url.split('?');
  const params = new URLSearchParams(queryString || '');

  // 1. GET /categories
  if (path === '/categories' && method === 'GET') {
    return {
      success: true,
      count: store.categories.length,
      categories: store.categories
    };
  }

  // 2. GET /categories/:slug
  if (path.startsWith('/categories/') && method === 'GET') {
    const slug = path.split('/')[2];
    const category = store.categories.find(
      (c) => c.slug === slug || c._id === slug
    );
    if (category) {
      return { success: true, category };
    }
    return {
      success: true,
      category: {
        name: slug.replace(/-/g, ' ').toUpperCase(),
        slug,
        description: 'Quality hardware tools and supplies for this category.'
      }
    };
  }

  // 3. GET /products/featured
  if (path === '/products/featured' && method === 'GET') {
    const featured = store.products.filter((p) => p.featured);
    return {
      success: true,
      count: featured.length,
      products: featured.slice(0, 12)
    };
  }

  // 4. GET /products/bestsellers
  if (path === '/products/bestsellers' && method === 'GET') {
    const bestsellers = store.products.filter((p) => p.bestseller);
    return {
      success: true,
      count: bestsellers.length,
      products: bestsellers.slice(0, 12)
    };
  }

  // 5. GET /products/sasta (Affordable / Budget Deals Under Rs. 1000 or high discount)
  if (path === '/products/sasta' && method === 'GET') {
    const sasta = store.products
      .filter((p) => p.price <= 1000 || p.discount >= 15)
      .sort((a, b) => (b.discount || 0) - (a.discount || 0));
    return {
      success: true,
      count: sasta.length,
      products: sasta.slice(0, 12)
    };
  }

  // 6. GET /products/search/suggestions
  if (path === '/products/search/suggestions' && method === 'GET') {
    const q = (params.get('q') || '').toLowerCase().trim();
    if (!q) return { success: true, suggestions: [] };

    const matched = store.products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q))
      )
      .slice(0, 6)
      .map((p) => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        image: p.images?.[0] || '',
        category: p.category,
        brand: p.brand
      }));

    return { success: true, suggestions: matched };
  }

  // 7. GET /products/:id (Single product by ID or slug)
  if (path.startsWith('/products/') && path.split('/').length === 3 && method === 'GET') {
    const id = path.split('/')[2];
    const product = store.products.find(
      (p) => p._id === id || p.slug === id
    );

    if (product) {
      const relatedProducts = store.products
        .filter((p) => p.categorySlug === product.categorySlug && p._id !== product._id)
        .slice(0, 4);

      return {
        success: true,
        product,
        relatedProducts
      };
    }
  }

  // 8. GET /products (List products with filtering, search, sorting & pagination)
  if (path === '/products' && method === 'GET') {
    let result = [...store.products];

    // Search query
    const search = params.get('search') || params.get('q');
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Category filter
    const category = params.get('category');
    if (category && category !== 'all') {
      result = result.filter(
        (p) =>
          p.categorySlug === category ||
          (p.category && p.category.toLowerCase() === category.toLowerCase())
      );
    }

    // Brand filter
    const brand = params.get('brand');
    if (brand && brand !== 'all') {
      result = result.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }

    // Sasta / Budget Filter (Under Rs. 1000)
    const sasta = params.get('sasta');
    if (sasta === 'true' || sasta === '1') {
      result = result.filter((p) => p.price <= 1000 || p.discount >= 15);
    }

    // Price range
    const minPrice = Number(params.get('minPrice'));
    if (!isNaN(minPrice) && minPrice > 0) {
      result = result.filter((p) => p.price >= minPrice);
    }
    const maxPrice = Number(params.get('maxPrice'));
    if (!isNaN(maxPrice) && maxPrice > 0) {
      result = result.filter((p) => p.price <= maxPrice);
    }

    // Stock Status
    const stockStatus = params.get('stockStatus');
    if (stockStatus && stockStatus !== 'all') {
      if (stockStatus === 'in_stock') {
        result = result.filter((p) => p.stock > 0);
      } else if (stockStatus === 'low_stock') {
        result = result.filter((p) => p.stock > 0 && p.stock <= 5);
      }
    }

    // Rating filter
    const rating = Number(params.get('rating'));
    if (!isNaN(rating) && rating > 0) {
      result = result.filter((p) => p.rating >= rating);
    }

    // Discount only filter
    const discountOnly = params.get('discountOnly');
    if (discountOnly === 'true') {
      result = result.filter((p) => (p.discount && p.discount > 0) || (p.compareAtPrice && p.compareAtPrice > p.price));
    }

    // Collect available brands before pagination
    const availableBrands = Array.from(new Set(store.products.map((p) => p.brand))).filter(Boolean).sort();

    // Sorting
    const sort = params.get('sort') || 'featured';
    if (sort === 'price_asc' || sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc' || sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'discount' || sort === 'sasta') {
      result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    } else if (sort === 'bestseller') {
      result.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    } else if (sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    // Pagination
    const total = result.length;
    const page = Math.max(1, Number(params.get('page')) || 1);
    const limit = Math.max(1, Number(params.get('limit')) || 12);
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const pagedProducts = result.slice(startIndex, startIndex + limit);

    return {
      success: true,
      count: pagedProducts.length,
      total,
      page,
      totalPages,
      availableBrands,
      products: pagedProducts
    };
  }

  // 9. GET /reviews/:productId
  if (path.startsWith('/reviews/') && method === 'GET') {
    const prodId = path.split('/')[2];
    const reviews = store.reviews.filter((r) => r.product === prodId || r.productId === prodId);
    return {
      success: true,
      count: reviews.length,
      reviews
    };
  }

  // 10. POST /reviews/:productId
  if (path.startsWith('/reviews/') && method === 'POST') {
    const prodId = path.split('/')[2];
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
    const newReview = {
      _id: 'rev_' + Date.now(),
      product: prodId,
      user: { name: body.name || 'Verified Buyer' },
      rating: Number(body.rating) || 5,
      comment: body.comment || '',
      title: body.title || '',
      createdAt: new Date().toISOString()
    };
    store.reviews.unshift(newReview);
    saveLocalStore(store);
    return { success: true, review: newReview };
  }

  // 11. POST /coupons/validate
  if (path === '/coupons/validate' && method === 'POST') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
    const code = (body.code || '').trim().toUpperCase();
    const orderTotal = Number(body.orderTotal) || 0;

    const coupon = store.coupons.find((c) => c.code === code && c.isActive);
    if (!coupon) {
      throw { response: { data: { message: 'Invalid or expired coupon code' }, status: 400 } };
    }
    if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) {
      throw {
        response: {
          data: {
            message: `Coupon ${code} requires a minimum order of Rs. ${coupon.minOrderAmount.toLocaleString()}`
          },
          status: 400
        }
      };
    }

    return {
      success: true,
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        description: coupon.description
      }
    };
  }

  // 12. POST /orders
  if (path === '/orders' && method === 'POST') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
    const orderNumber = 'AZ-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      _id: 'ord_' + Date.now(),
      orderNumber,
      orderItems: body.orderItems || [],
      shippingAddress: body.shippingAddress || {},
      paymentMethod: body.paymentMethod || 'cash_on_delivery',
      subtotal: body.subtotal || 0,
      shippingPrice: body.shippingPrice || 0,
      discountPrice: body.discountPrice || 0,
      totalPrice: body.totalPrice || 0,
      couponCode: body.couponCode || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    store.orders.unshift(newOrder);
    saveLocalStore(store);
    return { success: true, order: newOrder };
  }

  // 13. GET /orders/myorders
  if (path === '/orders/myorders' && method === 'GET') {
    return {
      success: true,
      count: store.orders.length,
      orders: store.orders
    };
  }

  // 14. GET /orders/:orderNumber
  if (path.startsWith('/orders/') && method === 'GET') {
    const orderNum = path.split('/')[2];
    const order = store.orders.find(
      (o) => o.orderNumber === orderNum || o._id === orderNum
    );
    if (order) {
      return { success: true, order };
    }
    return {
      success: true,
      order: {
        orderNumber: orderNum,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        orderItems: [],
        totalPrice: 0
      }
    };
  }

  // 15. POST /auth/login
  if (path === '/auth/login' && method === 'POST') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
    const email = (body.email || '').toLowerCase().trim();
    const isAdmin = email.includes('admin');

    const user = {
      _id: isAdmin ? 'usr_admin_001' : 'usr_' + Date.now(),
      name: isAdmin ? 'Al Zaban Admin' : (email.split('@')[0] || 'Customer'),
      email: body.email,
      role: isAdmin ? 'admin' : 'customer',
      city: 'Lahore'
    };

    const token = 'alzaban_token_' + Date.now();
    return {
      success: true,
      token,
      user
    };
  }

  // 16. POST /auth/register
  if (path === '/auth/register' && method === 'POST') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
    const user = {
      _id: 'usr_' + Date.now(),
      name: body.name || 'New Customer',
      email: body.email,
      phone: body.phone || '+92 300 0000000',
      role: 'customer',
      city: body.city || 'Lahore'
    };
    store.users.push(user);
    saveLocalStore(store);

    const token = 'alzaban_token_' + Date.now();
    return { success: true, token, user };
  }

  // 17. GET /auth/me
  if (path === '/auth/me' && method === 'GET') {
    return {
      success: true,
      user: {
        _id: 'usr_cust_002',
        name: 'Valued Customer',
        email: 'customer@alzaban.com',
        role: 'customer',
        city: 'Lahore'
      }
    };
  }

  // 18. GET /admin/dashboard
  if (path === '/admin/dashboard' && method === 'GET') {
    const totalSales = store.orders.reduce((sum, o) => sum + (o.totalPrice || 0), 285400);
    return {
      success: true,
      stats: {
        totalSales,
        totalOrders: Math.max(store.orders.length, 38),
        totalProducts: store.products.length,
        totalUsers: Math.max(store.users.length, 64),
        recentOrders: store.orders.slice(0, 5)
      }
    };
  }

  // 19. GET /admin/users
  if (path === '/admin/users' && method === 'GET') {
    return {
      success: true,
      count: store.users.length,
      users: store.users
    };
  }

  // 20. GET /admin/orders
  if (path === '/admin/orders' && method === 'GET') {
    return {
      success: true,
      count: store.orders.length,
      orders: store.orders
    };
  }

  // Fallback for any other endpoint
  return {
    success: true,
    message: 'Operation handled by client-side store',
    products: store.products.slice(0, 12),
    categories: store.categories
  };
}
