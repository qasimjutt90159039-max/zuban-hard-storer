import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Package } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import api from '../services/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        if (res.data.success) setCategories(res.data.categories);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'All Categories' }]} />

      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-extrabold text-charcoal-900 tracking-tight mb-2">
          Hardware & Industrial Categories
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Browse through our complete department catalog at Al Zaban Hardware Store, Township, Lahore.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col"
            >
              <div className="h-48 overflow-hidden relative bg-gray-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <span className="font-extrabold text-lg text-white drop-shadow">
                    {cat.name}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-charcoal-950">
                    {cat.productCount || 10}+ Items
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-bold text-amber-600 group-hover:text-amber-700">
                  <span>Browse Category</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
