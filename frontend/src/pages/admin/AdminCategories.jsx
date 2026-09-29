import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Trash2, X, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminCategories() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      if (res.data.success) setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCat(null);
    setName('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80');
    setModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingCat(c);
    setName(c.name);
    setDescription(c.description || '');
    setImage(c.image || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCat) {
        const res = await api.put(`/categories/${editingCat._id}`, { name, description, image });
        if (res.data.success) {
          showToast('Category updated successfully!', 'success');
          setModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await api.post('/categories', { name, description, image });
        if (res.data.success) {
          showToast('New category added!', 'success');
          setModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (window.confirm(`Delete category "${catName}"?`)) {
      try {
        const res = await api.delete(`/categories/${id}`);
        if (res.data.success) {
          showToast('Category removed', 'info');
          fetchCategories();
        }
      } catch (err) {
        showToast('Failed to delete category', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
            Category Department Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Organize hardware departments and public store browsing menus
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-gray-200 rounded-2xl animate-pulse"></div>
          ))
        ) : (
          categories.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="h-32 bg-gray-100 relative overflow-hidden">
                <img
                  src={c.image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80'}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-charcoal-950">
                  {c.productCount || 0} Products
                </span>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-charcoal-900">{c.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                    {c.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                  <span className="font-mono text-gray-400 text-[11px]">/{c.slug}</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-1.5 rounded bg-gray-100 hover:bg-amber-500 text-gray-600 hover:text-charcoal-950"
                      title="Edit Category"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id, c.name)}
                      className="p-1.5 rounded bg-gray-100 hover:bg-red-500 text-gray-600 hover:text-white"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-gray-200 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-black text-charcoal-900 border-b border-gray-100 pb-2">
              {editingCat ? `Edit Category: ${editingCat.name}` : 'Create New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full border p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border p-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
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
                  {submitting ? 'Saving...' : editingCat ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
