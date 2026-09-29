import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Grid,
  List,
  Search,
  SlidersHorizontal,
  X,
  Star,
  RotateCcw,
  Check
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import Breadcrumbs from '../components/Breadcrumbs';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';
import api from '../services/api';
import { formatPKR } from '../utils/formatters';

const sortOptions = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Highest Rated', value: 'rating' }
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialBrand = searchParams.get('brand') || 'all';
  const initialSort = searchParams.get('sort') || 'popular';
  const initialPage = parseInt(searchParams.get('page')) || 1;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [stockStatus, setStockStatus] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('');
  const [discountOnly, setDiscountOnly] = useState(false);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Load categories list once
  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        if (res.data.success) setCategories(res.data.categories);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
        if (selectedBrand && selectedBrand !== 'all') params.set('brand', selectedBrand);
        if (selectedSort) params.set('sort', selectedSort);
        if (currentPage) params.set('page', currentPage);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (stockStatus !== 'all') params.set('stockStatus', stockStatus);
        if (ratingFilter) params.set('rating', ratingFilter);
        if (discountOnly) params.set('discountOnly', 'true');

        // Sync with browser URL
        setSearchParams(params, { replace: true });

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
          setTotalProducts(res.data.total);
          setTotalPages(res.data.totalPages);
          if (res.data.availableBrands) setAvailableBrands(res.data.availableBrands);
        }
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedSort,
    currentPage,
    minPrice,
    maxPrice,
    stockStatus,
    ratingFilter,
    discountOnly
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMinPrice('');
    setMaxPrice('');
    setStockStatus('all');
    setRatingFilter('');
    setDiscountOnly(false);
    setSelectedSort('popular');
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs
        items={[
          { label: 'Shop Hardware & Tools', url: '/shop' },
          ...(selectedCategory !== 'all'
            ? [{ label: selectedCategory.replace(/-/g, ' ').toUpperCase() }]
            : [])
        ]}
      />

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Hardware & Tool Catalog
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing <strong className="text-charcoal-900">{totalProducts}</strong> products available at Al Zaban Hardware Store
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-charcoal-900 shadow-sm"
          >
            <Filter className="w-4 h-4 text-amber-500" />
            <span>Filters</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 hidden sm:inline">Sort:</span>
            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-300 text-charcoal-900 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 shadow-sm"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Grid / List toggle */}
          <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-charcoal-900' : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm text-charcoal-900' : 'text-gray-500 hover:text-gray-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block space-y-6">
          {/* Header & Reset */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <span className="text-sm font-bold text-charcoal-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              Filter By
            </span>
            <button
              onClick={resetFilters}
              className="text-[11px] font-semibold text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>

          {/* Search keyword inside filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
              Search Keywords
            </label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Drill, hammer, valve..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-300 text-xs rounded-lg pl-8 pr-3 py-2 text-charcoal-900 focus:outline-none focus:border-amber-500"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </form>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
              Categories
            </label>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1 text-xs">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-2 py-1.5 rounded-md font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-amber-50 text-amber-700 font-bold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Categories ({totalProducts})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-md font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-amber-50 text-amber-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] text-gray-400 ml-1">
                    ({cat.productCount})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
              Brands
            </label>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1 text-xs">
              <button
                onClick={() => {
                  setSelectedBrand('all');
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-2 py-1.5 rounded-md font-medium transition-colors ${
                  selectedBrand === 'all'
                    ? 'bg-amber-50 text-amber-700 font-bold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Brands
              </button>
              {availableBrands.map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setSelectedBrand(b);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-md font-medium transition-colors ${
                    selectedBrand.toLowerCase() === b.toLowerCase()
                      ? 'bg-amber-50 text-amber-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
              Price Range (PKR)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-1/2 bg-white border border-gray-300 text-xs rounded-lg px-2.5 py-1.5 text-charcoal-900 focus:outline-none focus:border-amber-500"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-1/2 bg-white border border-gray-300 text-xs rounded-lg px-2.5 py-1.5 text-charcoal-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
              Availability
            </label>
            <div className="space-y-1 text-xs">
              {['all', 'in-stock', 'low-stock'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStockStatus(status);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-md font-medium transition-colors capitalize ${
                    stockStatus === status
                      ? 'bg-amber-50 text-amber-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status === 'all' ? 'All Items' : status === 'in-stock' ? 'In Stock Only' : 'Low Stock Alert'}
                </button>
              ))}
            </div>
          </div>

          {/* Special Toggles */}
          <div className="space-y-2 pt-2 border-t border-gray-200 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-charcoal-900">
              <input
                type="checkbox"
                checked={discountOnly}
                onChange={(e) => {
                  setDiscountOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
              />
              <span className="font-medium">On Sale / Discounted Items</span>
            </label>
          </div>
        </aside>

        {/* Products Grid & Results Area */}
        <div className="md:col-span-3">
          {/* Active filter badges */}
          {(selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery || discountOnly || stockStatus !== 'all') && (
            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
              <span className="text-gray-500 font-medium">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold">
                  Category: {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold">
                  Brand: {selectedBrand}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBrand('all')} />
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-200 text-gray-800 font-semibold">
                  Keyword: "{searchQuery}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </span>
              )}
              {discountOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-semibold">
                  Discounted Only
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setDiscountOnly(false)} />
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-amber-600 hover:underline font-semibold ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center my-6">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-900 mb-1">
                No matching hardware products found
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
                We couldn't find any products matching your specific filters or search keywords. Try adjusting your search criteria.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Responsive Products Grid */
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5'
                  : 'space-y-3'
              }
            >
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
          />
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end md:hidden">
          <div className="w-4/5 max-w-sm bg-white h-full p-5 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="font-bold text-charcoal-900 text-sm">Filters</span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-white border border-gray-300 text-xs rounded-lg p-2"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Mobile Brand */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-white border border-gray-300 text-xs rounded-lg p-2"
              >
                <option value="all">All Brands</option>
                {availableBrands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Price inputs */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Price (PKR)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 border p-2 text-xs rounded"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 border p-2 text-xs rounded"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex gap-2">
              <button
                onClick={() => {
                  resetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-1/2 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg text-xs"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-1/2 py-2.5 bg-amber-500 text-charcoal-950 font-bold rounded-lg text-xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
