import React, { useState } from 'react';
import { X, Star, ShoppingCart, Heart, ShieldCheck, Check, MessageSquare, ExternalLink } from 'lucide-react';
import { formatPKR } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductWhatsAppUrl } from '../utils/whatsapp';
import { Link } from 'react-router-dom';

export default function QuickViewModal({ product, onClose }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const inWishlist = isInWishlist(product._id || product.productId);
  const images = product.images && product.images.length > 0 ? product.images : [product.image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80'];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Images Section */}
          <div className="p-6 bg-gray-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100">
            <div className="aspect-square rounded-xl overflow-hidden bg-white border border-gray-200 mb-3 relative">
              <img
                src={images[selectedImage] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-amber-500 text-charcoal-950 font-extrabold text-xs px-2.5 py-1 rounded-md shadow-sm">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-amber-500 scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span className="font-bold text-amber-600 uppercase tracking-wider">{product.brand}</span>
                <span className="font-mono text-gray-400">SKU: {product.sku}</span>
              </div>

              <h2 className="text-lg font-bold text-charcoal-900 leading-snug mb-2">
                {product.name}
              </h2>

              {/* Rating & Stock */}
              <div className="flex items-center gap-3 mb-3 text-xs">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="font-bold text-gray-800">{product.rating ? product.rating.toFixed(1) : '4.5'}</span>
                  <span className="text-gray-400">({product.reviewsCount || 10} reviews)</span>
                </div>
                <span>•</span>
                <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4">
                <span className="text-2xl font-black text-charcoal-950">
                  {formatPKR(product.price)}
                </span>
                {product.compareAtPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPKR(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                {product.shortDescription || product.description}
              </p>

              {/* Specs Highlights */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100 mb-4 space-y-1">
                  {Object.entries(product.specifications).slice(0, 3).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-500 font-medium">{key}:</span>
                      <span className="text-gray-900 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 py-2.5 px-4 bg-charcoal-900 hover:bg-amber-500 hover:text-charcoal-950 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-lg border transition-colors ${
                    inWishlist
                      ? 'border-red-300 bg-red-50 text-red-500'
                      : 'border-gray-300 text-gray-600 hover:text-red-500'
                  }`}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              {/* WhatsApp Inquiry CTA */}
              <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                <a
                  href={getProductWhatsAppUrl(product)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
                >
                  Ask on WhatsApp
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <Link
                  to={`/products/${product.slug || product._id}`}
                  onClick={onClose}
                  className="py-2 px-3 text-amber-600 hover:underline font-semibold"
                >
                  Full Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
