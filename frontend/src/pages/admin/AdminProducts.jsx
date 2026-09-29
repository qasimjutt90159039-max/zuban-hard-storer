import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Check,
  X,
  Star,
  AlertTriangle,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import { formatPKR } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function AdminProducts() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: '',
    category: '',
    price: '',
    compareAtPrice: '',
    stock: '',
    description: '',
    shortDescription: '',
    image: '',
    featured: false,
    bestseller: false
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', 15);
      if (search) params.set('search', search);
      if (selectedCat !== 'all') params.set('category', selectedCat);

      const res = await api.get(`/products?${params.toString()}`);
      if (res.data.success) {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, selectedCat]);

  useEffect(() => {
    api.get('/categories').then((res) => {
      if (res.data.success) setCategories(res.data.categories);
    });
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: '',
      brand: 'Ingco',
      category: categories[0]?.name || 'Hand Tools',
      price: '',
      compareAtPrice: '',
      stock: '20',
      description: '',
      shortDescription: '',
      image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80',
      featured: false,
      bestseller: false
    });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      brand: p.brand,
      category: p.category,
      price: p.price.toString(),
      compareAtPrice: (p.compareAtPrice || '').toString(),
      stock: p.stock.toString(),
      description: p.description,
      shortDescription: p.shortDescription || '',
      image: p.images && p.images[0] ? p.images[0] : (p.image || ''),
      featured: Boolean(p.featured),
      bestseller: Boolean(p.bestseller)
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      compareAtPrice: Number(formData.compareAtPrice) || 0,
      stock: Number(formData.stock),
      images: [formData.image]
    };

    try {
      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct._id}`, payload);
        if (res.data.success) {
          showToast('Product updated successfully!', 'success');
          setModalOpen(false);
          fetchProducts();
        }
      } else {
        const res = await api.post('/products', payload);
        if (res.data.success) {
          showToast('New product added to inventory!', 'success');
          setModalOpen(false);
          fetchProducts();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
      try {
        const res = await api.delete(`/products/${id}`);
        if (res.data.success) {
          showToast('Product removed successfully', 'info');
          fetchProducts();
        }
      } catch (err) {
        showToast('Failed to delete product', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
            Inventory & Product Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Total of {totalCount} products currently registered in Al Zaban Hardware Store
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by name, SKU, or brand..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-gray-50 border border-gray-300 text-xs rounded-xl pl-9 pr-3 py-2 text-charcoal-900 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => {
            setSelectedCat(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-auto bg-gray-50 border border-gray-300 text-xs font-semibold rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Loading inventory...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const img = p.images && p.images[0] ? p.images[0] : (p.image || '');
                  return (
                    <tr key={p._id} className="hover:bg-gray-50/60">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt=""
                            className="w-10 h-10 object-cover rounded-lg bg-gray-100 border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-charcoal-900 truncate">{p.name}</div>
                            <div className="text-[11px] text-amber-600 font-semibold">{p.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-gray-700">{p.sku}</td>
                      <td className="py-3 px-4 text-gray-600">{p.category}</td>
                      <td className="py-3 px-4 font-black text-charcoal-900">
                        {formatPKR(p.price)}
                        {p.discount > 0 && (
                          <span className="text-[10px] text-amber-600 block">(-{p.discount}%)</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold">
                        <span className={p.stock <= 5 ? 'text-red-600' : 'text-charcoal-900'}>
                          {p.stock} pcs
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.stock <= 0
                              ? 'bg-red-100 text-red-700'
                              : p.stock <= 5
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {p.stock <= 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded bg-gray-100 hover:bg-amber-500 hover:text-charcoal-950 text-gray-600 transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            className="p-1.5 rounded bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1.5 rounded border border-gray-300 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded border border-gray-300 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 border border-gray-200 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-black text-charcoal-900 border-b border-gray-100 pb-3">
              {editingProduct ? `Edit Hardware Product: ${editingProduct.sku}` : 'Add New Hardware Product'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full border p-2.5 rounded-lg font-mono focus:outline-none focus:border-amber-500 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full border p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Compare Price (Old)</label>
                  <input
                    type="number"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    className="w-full border p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Available Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full border p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full border p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span className="font-bold text-charcoal-900">Mark Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span className="font-bold text-charcoal-900">Mark Bestseller</span>
                </label>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold rounded-lg shadow-sm"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
