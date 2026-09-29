import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import SkeletonCard from '../components/SkeletonCard';
import api from '../services/api';

export default function CategoryDetail() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get(`/categories/${slug}`),
          api.get(`/products?category=${slug}&limit=40`)
        ]);

        if (catRes.data.success) setCategory(catRes.data.category);
        if (prodRes.data.success) setProducts(prodRes.data.products);
      } catch (err) {
        console.error('Error fetching category details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const catName = category?.name || slug.replace(/-/g, ' ').toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'All Categories', url: '/categories' },
          { label: catName }
        ]}
      />

      {/* Category Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-charcoal-900 text-white p-8 sm:p-10 border border-charcoal-800 shadow-xl">
        {category?.image && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
            style={{ backgroundImage: `url(${category.image})` }}
          />
        )}
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 inline-block mb-3">
            Department Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">{catName}</h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
            {category?.description || `Explore our high quality selection of ${catName.toLowerCase()} at Al Zaban Hardware Store, Township, Lahore.`}
          </p>
          <div className="text-xs text-amber-400 font-bold">
            {products.length} Products Available in this Category
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
          <h2 className="text-lg font-bold text-charcoal-900">
            Available {catName} Products
          </h2>
          <Link
            to="/shop"
            className="text-xs font-bold text-amber-600 hover:underline"
          >
            Open in Full Shop Filter →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-sm text-gray-500">No products found in this category.</p>
            <Link to="/shop" className="mt-4 inline-block px-4 py-2 bg-amber-500 text-charcoal-950 font-bold text-xs rounded-lg">
              Explore All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
