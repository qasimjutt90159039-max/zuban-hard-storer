import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { formatPKR } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inWishlist = isInWishlist(product._id || product.productId);
  const image = (product.images && product.images[0]) || product.image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80';

  const isLowStock = product.stockStatus === 'Low Stock' || (product.stock > 0 && product.stock <= 5);
  const isOutOfStock = product.stockStatus === 'Out of Stock' || product.stock <= 0;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col relative">
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {product.discount > 0 && (
          <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-amber-500 text-charcoal-950 shadow-sm uppercase tracking-wide">
            {product.discount}% OFF
          </span>
        )}
        {product.bestseller && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-charcoal-900 text-amber-400 border border-amber-500/30 uppercase tracking-wide">
            Bestseller
          </span>
        )}
      </div>

      {/* Top Right Wishlist & Quick View */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md ${
            inWishlist
              ? 'bg-red-50 text-red-500 border border-red-200'
              : 'bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 border border-gray-200'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500' : ''}`} />
        </button>

        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-amber-600 border border-gray-200 flex items-center justify-center transition-colors shadow-md hidden sm:flex"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Image Container */}
      <Link
        to={`/products/${product.slug || product._id}`}
        className="block relative aspect-square overflow-hidden bg-gray-50 border-b border-gray-100"
      >
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & SKU */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-bold text-amber-600 uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            <span className="font-mono text-[10px] text-gray-400">
              SKU: {product.sku}
            </span>
          </div>

          {/* Name */}
          <Link
            to={`/products/${product.slug || product._id}`}
            className="block font-semibold text-charcoal-900 text-sm hover:text-amber-600 transition-colors line-clamp-2 leading-snug mb-1.5"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
            </div>
            <span className="text-xs font-bold text-gray-700">
              {product.rating ? product.rating.toFixed(1) : '4.5'}
            </span>
            <span className="text-xs text-gray-400">
              ({product.reviewsCount || 12})
            </span>
          </div>
        </div>

        {/* Pricing & Stock Status */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-baseline justify-between gap-1 mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold text-charcoal-900">
                {formatPKR(product.price)}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPKR(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                isOutOfStock
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : isLowStock
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
            </span>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-charcoal-900 hover:bg-amber-500 hover:text-charcoal-950 text-white shadow-sm'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
