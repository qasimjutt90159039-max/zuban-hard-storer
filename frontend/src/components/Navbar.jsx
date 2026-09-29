import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Wrench,
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ShieldCheck,
  Package,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { STORE_PHONE, STORE_WHATSAPP_NUMBER, STORE_ADDRESS, STORE_EMAIL, getGeneralWhatsAppUrl } from '../utils/whatsapp';
import { formatPKR } from '../utils/formatters';
import api from '../services/api';

const categoriesList = [
  { name: 'Hand Tools', slug: 'hand-tools' },
  { name: 'Power Tools', slug: 'power-tools' },
  { name: 'Measuring Tools', slug: 'measuring-tools' },
  { name: 'Fasteners', slug: 'fasteners' },
  { name: 'Plumbing Supplies', slug: 'plumbing-supplies' },
  { name: 'Electrical Supplies', slug: 'electrical-supplies' },
  { name: 'Paint & Accessories', slug: 'paint-accessories' },
  { name: 'Safety Equipment', slug: 'safety-equipment' },
  { name: 'Adhesives & Sealants', slug: 'adhesives-sealants' },
  { name: 'Cutting Tools', slug: 'cutting-tools' },
  { name: 'Building Hardware', slug: 'building-hardware' },
  { name: 'Workshop Accessories', slug: 'workshop-accessories' }
];

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const searchRef = useRef(null);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoryDropdownOpen(false);
    setAccountDropdownOpen(false);
    setShowSuggestions(false);
  }, [location.pathname]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search suggestions debounce
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/products/search/suggestions?q=${encodeURIComponent(q)}`);
        if (res.data.success) {
          setSuggestions(res.data.suggestions);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Error fetching suggestions', err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-charcoal-900 border-b border-charcoal-800 shadow-md">
      {/* Top Notification Bar */}
      <div className="bg-charcoal-950 text-gray-300 text-xs border-b border-charcoal-800/80 py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              Plot #3, Sector B-1, Block 11, Township, Lahore 54770
            </span>
            <span className="text-charcoal-700">|</span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <a href="tel:+924235110830" className="hover:text-amber-400 transition-colors">+92 42 35110830</a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${STORE_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
            >
              WhatsApp: +92 335 1108300
            </a>
            <span className="text-charcoal-700">|</span>
            <span className="text-gray-400">Delivery throughout Lahore & Pakistan</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-charcoal-950 font-black shadow-md group-hover:bg-amber-400 transition-colors">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold tracking-tight text-white leading-none group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
              AL ZABAN
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
                HARDWARE
              </span>
            </div>
            <div className="text-[11px] text-gray-400 tracking-wide font-medium mt-0.5">
              Township, Lahore • Tools & Supplies
            </div>
          </div>
        </Link>

        {/* Live Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-xl hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search 140+ tools, drills, hammers, screws, plumbing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
              className="w-full bg-charcoal-800 text-white placeholder-gray-400 text-sm rounded-lg pl-10 pr-24 py-2.5 border border-charcoal-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3.5 bg-amber-500 hover:bg-amber-400 text-charcoal-950 text-xs font-bold rounded-md transition-colors flex items-center gap-1"
            >
              Search
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-charcoal-900 border border-charcoal-700 rounded-lg shadow-2xl overflow-hidden z-50 fade-in divide-y divide-charcoal-800">
              <div className="px-3 py-1.5 bg-charcoal-950 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Matching Hardware Products ({suggestions.length})
              </div>
              {suggestions.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    setShowSuggestions(false);
                    navigate(`/products/${item.slug || item._id}`);
                  }}
                  className="flex items-center gap-3 p-2.5 hover:bg-charcoal-800 cursor-pointer transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded bg-charcoal-950 shrink-0 border border-charcoal-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate hover:text-amber-400">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <span className="text-amber-500">{item.brand}</span>
                      <span>•</span>
                      <span>SKU: {item.sku}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-amber-400">
                      {formatPKR(item.price)}
                    </div>
                    <span className="text-[10px] text-gray-400">{item.category}</span>
                  </div>
                </div>
              ))}
              <div
                onClick={handleSearchSubmit}
                className="p-2.5 text-center text-xs font-semibold text-amber-400 hover:bg-charcoal-800 cursor-pointer transition-colors"
              >
                View all results for "{searchQuery}" →
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* WhatsApp Direct Header Link */}
          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 text-xs font-semibold transition-all"
            title="Chat with Al Zaban Store on WhatsApp"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            WhatsApp
          </a>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-2 text-gray-300 hover:text-amber-400 hover:bg-charcoal-800 rounded-lg transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-charcoal-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 text-gray-300 hover:text-amber-400 hover:bg-charcoal-800 rounded-lg transition-colors flex items-center"
            title="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-charcoal-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="flex items-center gap-1.5 p-2 text-gray-300 hover:text-amber-400 hover:bg-charcoal-800 rounded-lg transition-colors text-xs font-medium"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">
                {user ? user.name.split(' ')[0] : 'Account'}
              </span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {accountDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-charcoal-900 border border-charcoal-700 rounded-lg shadow-xl py-1.5 z-50 fade-in text-sm">
                {user ? (
                  <>
                    <div className="px-3.5 py-2 border-b border-charcoal-800">
                      <div className="font-semibold text-white truncate">{user.name}</div>
                      <div className="text-xs text-gray-400 truncate">{user.email}</div>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">
                          Admin Access
                        </span>
                      )}
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-amber-400 hover:bg-charcoal-800"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/account"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-gray-300 hover:bg-charcoal-800 hover:text-white"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-gray-300 hover:bg-charcoal-800 hover:text-white"
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                    <div className="border-t border-charcoal-800 my-1"></div>
                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-red-400 hover:bg-charcoal-800 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="block px-3.5 py-2 text-amber-400 font-semibold hover:bg-charcoal-800"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="block px-3.5 py-2 text-gray-300 hover:bg-charcoal-800 hover:text-white"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-charcoal-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar (Desktop) */}
      <nav className="bg-charcoal-950 border-t border-charcoal-800/80 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1">
            {/* Categories Mega Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold transition-colors"
              >
                <Menu className="w-4 h-4" />
                All Hardware Categories
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-charcoal-900 border border-charcoal-700 shadow-2xl py-2 z-50 fade-in divide-y divide-charcoal-800/60">
                  {categoriesList.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-200 hover:bg-charcoal-800 hover:text-amber-400 transition-colors text-xs"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link
                    to="/categories"
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="block px-4 py-2 text-amber-400 font-bold hover:bg-charcoal-800 transition-colors text-xs"
                  >
                    View All Categories →
                  </Link>
                </div>
              )}
            </div>

            <Link to="/" className="px-3.5 py-2.5 text-gray-300 hover:text-amber-400 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="px-3.5 py-2.5 text-gray-300 hover:text-amber-400 transition-colors">
              Shop Tools
            </Link>
            <Link
              to="/shop?sasta=true"
              className="px-3 py-1 text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 rounded-md my-auto"
            >
              <span>🔥 Sasta Corner</span>
            </Link>
            <Link to="/category/power-tools" className="px-3.5 py-2.5 text-gray-300 hover:text-amber-400 transition-colors">
              Power Tools
            </Link>
            <Link to="/category/hand-tools" className="px-3.5 py-2.5 text-gray-300 hover:text-amber-400 transition-colors">
              Hand Tools
            </Link>
            <Link to="/category/plumbing-supplies" className="px-3.5 py-2.5 text-gray-300 hover:text-amber-400 transition-colors">
              Plumbing
            </Link>
            <Link to="/category/electrical-supplies" className="px-3.5 py-2.5 text-gray-300 hover:text-amber-400 transition-colors">
              Electrical
            </Link>
            <Link to="/about" className="px-3.5 py-2.5 text-gray-300 hover:text-amber-400 transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="px-3.5 py-2.5 text-gray-300 hover:text-amber-400 transition-colors">
              Contact & Lahore Store
            </Link>
          </div>

          <div className="flex items-center gap-3 text-gray-400 py-2">
            <span className="flex items-center gap-1 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              100% Genuine Hardware & Tools
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-charcoal-900 border-t border-charcoal-800 px-4 py-4 space-y-4 fade-in">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search tools, screws, drills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-charcoal-800 text-white placeholder-gray-400 text-sm rounded-lg pl-9 pr-4 py-2 border border-charcoal-700 focus:outline-none focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </form>

          {/* Links */}
          <div className="space-y-1 font-medium text-sm">
            <Link to="/" className="block py-2 text-white hover:text-amber-400 border-b border-charcoal-800">
              Home
            </Link>
            <Link to="/shop" className="block py-2 text-white hover:text-amber-400 border-b border-charcoal-800">
              Shop All Products
            </Link>
            <Link to="/shop?sasta=true" className="block py-2 text-amber-400 font-bold hover:text-amber-300 border-b border-charcoal-800 flex items-center gap-1.5">
              <span>🔥 Sasta Corner (بچت بازار)</span>
            </Link>
            <Link to="/categories" className="block py-2 text-white hover:text-amber-400 border-b border-charcoal-800">
              Browse Categories
            </Link>
            <Link to="/about" className="block py-2 text-white hover:text-amber-400 border-b border-charcoal-800">
              About Us
            </Link>
            <Link to="/contact" className="block py-2 text-white hover:text-amber-400 border-b border-charcoal-800">
              Contact & Lahore Store
            </Link>
            {isAdmin && (
              <Link to="/admin" className="block py-2 text-amber-400 font-bold border-b border-charcoal-800">
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Category Grid */}
          <div className="pt-2">
            <div className="text-xs font-bold uppercase text-amber-500 mb-2 tracking-wider">
              Popular Categories
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {categoriesList.slice(0, 8).map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="p-2 rounded bg-charcoal-800 text-gray-300 hover:text-amber-400"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Contact Quick Links */}
          <div className="pt-3 border-t border-charcoal-800 text-xs text-gray-400 space-y-1.5">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>+92 42 35110830</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              <span>info@alzaban.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Plot #3, Sector B-1, Block 11, Township, Lahore</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
