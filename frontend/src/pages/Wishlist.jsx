import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPKR } from '../utils/formatters';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 border border-red-200 flex items-center justify-center mx-auto">
          <Heart className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mb-2">
            Your Wishlist is Empty
          </h1>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            You haven't saved any hardware tools or supplies to your wishlist yet.
          </p>
        </div>
        <div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold rounded-xl text-sm shadow-md transition-colors"
          >
            <span>Explore Hardware Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Saved Wishlist' }]} />

      <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Saved Products
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {wishlist.length} hardware items saved in your wishlist
          </p>
        </div>
        <Link to="/shop" className="text-xs font-bold text-amber-600 hover:underline">
          Continue Shopping →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div
            key={item._id || item.productId}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="aspect-square bg-gray-50 relative overflow-hidden">
              <img
                src={item.image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80'}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeFromWishlist(item._id || item.productId)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-red-500 shadow-md transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
                  {item.brand}
                </span>
                <Link
                  to={`/products/${item.slug || item._id || item.productId}`}
                  className="font-bold text-sm text-charcoal-900 hover:text-amber-600 transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
              </div>

              <div>
                <div className="text-base font-black text-charcoal-900 mb-3">
                  {formatPKR(item.price)}
                </div>

                <button
                  onClick={() => addToCart(item, 1)}
                  className="w-full py-2 px-3 bg-charcoal-900 hover:bg-amber-500 hover:text-charcoal-950 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Move to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
