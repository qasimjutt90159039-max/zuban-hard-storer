const { memoryStore, saveStore, isMongoConnected, generateId } = require('../utils/storage');
const Category = require('../models/Category');

// @desc    Get all categories with active product counts
// @route   GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = isMongoConnected()
      ? await Category.find({}).lean()
      : memoryStore.categories;

    const allProducts = isMongoConnected()
      ? await require('../models/Product').find({}).lean()
      : memoryStore.products;

    // Recalculate dynamic live product counts
    const enriched = categories.map(cat => ({
      ...cat,
      productCount: allProducts.filter(p => p.categorySlug === cat.slug).length
    }));

    return res.json({
      success: true,
      categories: enriched
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
const getCategoryBySlug = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const categories = isMongoConnected()
      ? await Category.find({}).lean()
      : memoryStore.categories;

    const category = categories.find(c => c.slug === slug || c._id.toString() === slug);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const allProducts = isMongoConnected()
      ? await require('../models/Product').find({}).lean()
      : memoryStore.products;

    const count = allProducts.filter(p => p.categorySlug === category.slug).length;

    return res.json({
      success: true,
      category: { ...category, productCount: count }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a category (Admin)
// @route   POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name, description, image, icon } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newCategory = {
      _id: generateId(),
      name,
      slug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80',
      icon: icon || 'Wrench',
      productCount: 0,
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected()) {
      const created = await Category.create(newCategory);
      return res.status(201).json({ success: true, category: created });
    } else {
      memoryStore.categories.push(newCategory);
      saveStore();
      return res.status(201).json({ success: true, category: newCategory });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update category (Admin)
// @route   PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    if (isMongoConnected()) {
      const updated = await Category.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      return res.json({ success: true, category: updated });
    } else {
      const index = memoryStore.categories.findIndex(c => c._id.toString() === id.toString() || c.slug === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      memoryStore.categories[index] = {
        ...memoryStore.categories[index],
        ...updates
      };
      saveStore();
      return res.json({ success: true, category: memoryStore.categories[index] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete category (Admin)
// @route   DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    if (isMongoConnected()) {
      const deleted = await Category.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      return res.json({ success: true, message: 'Category removed' });
    } else {
      const initial = memoryStore.categories.length;
      memoryStore.categories = memoryStore.categories.filter(c => c._id.toString() !== id.toString());
      if (memoryStore.categories.length === initial) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      saveStore();
      return res.json({ success: true, message: 'Category removed' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};
