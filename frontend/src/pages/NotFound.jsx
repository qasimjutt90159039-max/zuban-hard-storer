import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center mx-auto">
        <Wrench className="w-10 h-10 rotate-45" />
      </div>
      <div>
        <h1 className="text-4xl font-black text-charcoal-900 mb-2">404</h1>
        <h2 className="text-lg font-bold text-charcoal-800 mb-2">Page Not Found</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          The hardware item or page you are searching for does not exist or may have been updated.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Store Home</span>
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Browse Products</span>
        </Link>
      </div>
    </div>
  );
}
