import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  LogOut,
  Store,
  Wrench,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, isAdmin, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-950 text-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Verifying administrator credentials...</span>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-950 px-4">
        <div className="max-w-md w-full bg-charcoal-900 border border-charcoal-800 rounded-2xl p-8 text-center text-white">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-sm text-gray-400 mb-6">
            You must be logged in with administrator privileges to view this portal.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to="/login"
              className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold rounded-lg text-sm transition-colors"
            >
              Sign In as Admin
            </Link>
            <Link
              to="/"
              className="py-2.5 px-4 bg-charcoal-800 hover:bg-charcoal-700 text-gray-300 font-semibold rounded-lg text-sm transition-colors"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Users & Customers', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal-900 border-r border-charcoal-800 flex flex-col justify-between shrink-0 hidden md:flex text-gray-300">
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-charcoal-800 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-charcoal-950 font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm leading-tight">
                AL ZABAN
              </div>
              <div className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
                Admin Portal
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-charcoal-950 shadow-md font-bold'
                      : 'hover:bg-charcoal-800 hover:text-white text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-charcoal-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-charcoal-800 transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>View Public Store</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-charcoal-800 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="md:hidden flex items-center gap-2">
              <span className="font-extrabold text-charcoal-900 text-sm">AL ZABAN ADMIN</span>
            </div>
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">
              Township, Lahore 54770 Branch Management
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-amber-600 font-semibold hover:underline"
            >
              <Store className="w-3.5 h-3.5" />
              Public Store
            </Link>
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-charcoal-950 font-bold flex items-center justify-center text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-bold text-charcoal-900">{user.name}</div>
                <div className="text-[10px] text-gray-400">{user.email}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden bg-charcoal-900 border-b border-charcoal-800 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 rounded-md ${
                location.pathname === link.path ? 'bg-amber-500 text-charcoal-950 font-bold' : 'text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
