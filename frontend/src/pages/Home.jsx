import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Drill,
  Ruler,
  ShieldCheck,
  CheckCircle,
  Truck,
  Users,
  MapPin,
  ArrowRight,
  Sparkles,
  Phone,
  MessageCircle,
  Layers,
  ChevronRight
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import SkeletonCard from '../components/SkeletonCard';
import api from '../services/api';
import { STORE_ADDRESS, STORE_PHONE, STORE_WHATSAPP_NUMBER, getGeneralWhatsAppUrl } from '../utils/whatsapp';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, featRes, bestRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products/featured'),
          api.get('/products/bestsellers')
        ]);

        if (catRes.data.success) setCategories(catRes.data.categories);
        if (featRes.data.success) setFeaturedProducts(featRes.data.products);
        if (bestRes.data.success) setBestsellers(bestRes.data.products);
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-14 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-charcoal-950 text-white overflow-hidden py-16 sm:py-24 border-b border-charcoal-800">
        {/* Hardware-themed background image with dark charcoal overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-25 mix-blend-luminosity filter blur-[1px]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1920&auto=format&fit=crop&q=80')`
          }}
        />
        {/* Radial dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-950/90 to-charcoal-900/80 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              Al Zaban Hardware Store • Township, Lahore
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-white">
              Professional Hardware & Tools for Every Project
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed font-normal">
              Quality tools, hardware supplies and essential products for professionals, builders, contractors and DIY projects.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-charcoal-950 text-sm font-extrabold shadow-lg shadow-amber-500/20 transition-all duration-200 flex items-center gap-2 group"
              >
                <span>Shop Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl bg-charcoal-800/90 hover:bg-charcoal-700 text-white border border-charcoal-700 text-sm font-bold transition-all duration-200 flex items-center gap-2"
              >
                <span>Contact Us</span>
              </Link>

              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 text-sm font-bold transition-all duration-200 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Inquiry</span>
              </a>
            </div>

            {/* Badges Bar */}
            <div className="mt-10 pt-8 border-t border-charcoal-800/80 flex flex-wrap gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500" />
                <span>140+ Authentic Products</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500" />
                <span>Township, Lahore Showroom</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST SECTION (4 Trust Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Quality Products */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:border-amber-500/40 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-charcoal-900 text-base mb-1.5">
                Quality Products
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Reliable hardware and tools for everyday projects.
              </p>
            </div>
          </div>

          {/* Card 2: Wide Product Range */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:border-amber-500/40 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-charcoal-900 text-base mb-1.5">
                Wide Product Range
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Everything from hand tools to plumbing and electrical supplies.
              </p>
            </div>
          </div>

          {/* Card 3: Professional Support */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:border-amber-500/40 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-charcoal-900 text-base mb-1.5">
                Professional Support
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Helpful assistance for your hardware requirements.
              </p>
            </div>
          </div>

          {/* Card 4: Lahore Based Store */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:border-amber-500/40 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-charcoal-900 text-base mb-1.5">
                Lahore Based Store
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Serving customers from Township, Lahore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              Organized Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              Explore Hardware Categories
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
          >
            <span>View All 12 Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group bg-white rounded-xl border border-gray-200 p-3 flex flex-col justify-between hover:border-amber-500/50 hover:shadow-lg transition-all duration-200 text-center"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2.5 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-charcoal-900 group-hover:text-amber-600 transition-colors line-clamp-1 mb-0.5">
                  {cat.name}
                </h4>
                <div className="text-[11px] text-gray-500 mb-2">
                  {cat.productCount || 10}+ Items
                </div>
                <span className="w-full py-1.5 px-2 rounded-md bg-gray-50 group-hover:bg-amber-500 group-hover:text-charcoal-950 text-[11px] font-bold text-gray-700 transition-colors inline-block">
                  View Products
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SECTION (12 Products) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-gray-200 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              Top Picks & Essential Equipment
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              Featured Hardware Products
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
          >
            <span>Browse Full Catalog</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 12).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. INDUSTRIAL SPOTLIGHT & CONTRACTOR SUPPORT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-charcoal-900 rounded-3xl overflow-hidden border border-charcoal-800 shadow-2xl relative text-white">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1600&auto=format&fit=crop&q=80')`
            }}
          />
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-md bg-amber-500 text-charcoal-950 font-black text-xs uppercase tracking-wider mb-4">
              Contractor & Project Orders
            </span>
            <h3 className="text-2xl sm:text-4xl font-black mb-4 leading-tight">
              Need Bulk Quantities or Workshop Quotations in Lahore?
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
              Al Zaban Hardware Store provides direct quotations and material procurement for industrial projects, factories, housing construction, and commercial facilities throughout Lahore and Punjab.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Al Zaban Hardware Store, I would like to request a bulk contractor quote for my construction/renovation project in Lahore.')}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-charcoal-950 font-extrabold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                Request Quote via WhatsApp
              </a>
              <Link
                to="/contact"
                className="px-6 py-3 bg-charcoal-800 hover:bg-charcoal-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors border border-charcoal-700"
              >
                Visit Lahore Store
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BESTSELLERS SECTION */}
      {bestsellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                Customer Favorites
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
                Top Bestsellers
              </h2>
            </div>
            <Link
              to="/shop?sort=popular"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestsellers.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
