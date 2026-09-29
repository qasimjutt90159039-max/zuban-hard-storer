import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Heart,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Share2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPKR, formatDate } from '../utils/formatters';
import { getProductWhatsAppUrl, STORE_WHATSAPP_NUMBER } from '../utils/whatsapp';
import api from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'specs', 'reviews', 'shipping'

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
          setRelatedProducts(res.data.relatedProducts || []);
          setSelectedImage(0);
          setQuantity(1);

          // Fetch reviews
          const revRes = await api.get(`/reviews/${res.data.product._id}`);
          if (revRes.data.success) {
            setReviews(revRes.data.reviews);
          }
        }
      } catch (err) {
        console.error('Error fetching product', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 font-semibold text-sm">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-charcoal-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-gray-500 mb-6">The hardware item you requested is unavailable or has been moved.</p>
        <Link to="/shop" className="px-5 py-2.5 bg-amber-500 text-charcoal-950 font-bold rounded-lg text-xs">
          Return to Shop
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80'];

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showToast('Please provide a comment for your review', 'warning');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post(`/reviews/${product._id}`, {
        rating: newRating,
        title: newTitle,
        comment: newComment,
        userName: user ? user.name : 'Customer'
      });

      if (res.data.success) {
        showToast('Review submitted successfully!', 'success');
        setReviews([res.data.review, ...reviews]);
        setNewComment('');
        setNewTitle('');
      }
    } catch (err) {
      showToast('Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const isLowStock = product.stockStatus === 'Low Stock' || (product.stock > 0 && product.stock <= 5);
  const isOutOfStock = product.stockStatus === 'Out of Stock' || product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Shop', url: '/shop' },
          { label: product.category, url: `/category/${product.categorySlug}` },
          { label: product.name }
        ]}
      />

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Multi-Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-white border border-gray-200 overflow-hidden relative shadow-sm group">
            <img
              src={images[selectedImage] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-amber-500 text-charcoal-950 font-black text-xs px-3 py-1 rounded-md shadow-md">
                {product.discount}% OFF
              </span>
            )}
            {product.bestseller && (
              <span className="absolute top-4 right-4 bg-charcoal-900 text-amber-400 font-bold text-[11px] px-2.5 py-1 rounded-md border border-amber-500/30 uppercase tracking-wider">
                Bestseller
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                    selectedImage === idx
                      ? 'border-amber-500 ring-2 ring-amber-500/20 scale-105'
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Meta & Purchase Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-extrabold text-amber-600 uppercase tracking-widest text-xs">
                {product.brand}
              </span>
              <span className="font-mono text-gray-400">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating & Stock Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Star className="w-4 h-4 fill-amber-500" />
                <span className="font-black text-charcoal-900">{product.rating ? product.rating.toFixed(1) : '4.8'}</span>
                <span className="text-gray-500">({reviews.length || product.reviewsCount || 15} Reviews)</span>
              </div>

              <span
                className={`px-3 py-1 rounded-md font-bold text-xs ${
                  isOutOfStock
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : isLowStock
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isOutOfStock ? 'Out of Stock' : isLowStock ? `Low Stock (${product.stock} units remaining)` : `In Stock (${product.stock} units available)`}
              </span>
            </div>
          </div>

          {/* Pricing Highlight Card */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-wrap items-baseline justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-charcoal-950">
                {formatPKR(product.price)}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-base text-gray-500 line-through">
                  {formatPKR(product.compareAtPrice)}
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <span className="text-xs font-bold text-amber-800 bg-amber-200/60 px-2.5 py-1 rounded-md">
                Save {formatPKR(product.compareAtPrice - product.price)}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Purchase Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2.5 text-gray-600 hover:bg-gray-100 font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2.5 text-sm font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2.5 text-gray-600 hover:bg-gray-100 font-bold transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={isOutOfStock}
                className="flex-1 min-w-[140px] py-3 px-4 bg-charcoal-900 hover:bg-amber-500 hover:text-charcoal-950 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="py-3 px-5 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-extrabold rounded-xl text-xs sm:text-sm transition-all shadow-md"
              >
                Buy Now
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors shadow-sm ${
                  inWishlist
                    ? 'border-red-300 bg-red-50 text-red-500'
                    : 'border-gray-300 text-gray-600 hover:text-red-500 bg-white'
                }`}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* WhatsApp Inquiry Button with pre-filled message */}
            <a
              href={getProductWhatsAppUrl(product)}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask on WhatsApp (+92 335 1108300)</span>
            </a>
          </div>

          {/* Quick Hardware Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 text-xs text-gray-600">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <Truck className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Free Lahore Delivery &gt; Rs. 5,000</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Genuine Warranty & Backup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specifications, Reviews, Shipping */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
          {[
            { id: 'description', label: 'Description' },
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'reviews', label: `Customer Reviews (${reviews.length})` },
            { id: 'shipping', label: 'Shipping & Lahore Delivery' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-6 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-500 text-charcoal-900 bg-white'
                  : 'border-transparent text-gray-500 hover:text-charcoal-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {/* TAB 1: Description */}
          {activeTab === 'description' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-base font-bold text-charcoal-900">
                Product Details
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>

              {product.tags && product.tags.length > 0 && (
                <div className="pt-4 flex flex-wrap gap-2">
                  <span className="text-xs font-bold text-gray-500">Related Tags:</span>
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Specifications */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <h3 className="text-base font-bold text-charcoal-900 mb-4">
                Technical Specifications
              </h3>
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200 text-xs sm:text-sm">
                  <div className="grid grid-cols-2 p-3 bg-gray-50 font-bold text-charcoal-900">
                    <span>Feature / Specification</span>
                    <span>Rating / Value</span>
                  </div>
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-2 p-3 hover:bg-gray-50/50">
                      <span className="text-gray-600 font-medium">{key}</span>
                      <span className="text-charcoal-900 font-semibold">{val}</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 p-3 hover:bg-gray-50/50">
                    <span className="text-gray-600 font-medium">SKU</span>
                    <span className="font-mono text-charcoal-900 font-semibold">{product.sku}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 hover:bg-gray-50/50">
                    <span className="text-gray-600 font-medium">Brand</span>
                    <span className="text-charcoal-900 font-semibold">{product.brand}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Standard specifications apply. Please contact our Lahore store for detailed technical data sheets.</p>
              )}
            </div>
          )}

          {/* TAB 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-8 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-charcoal-900">
                    Customer Reviews
                  </h3>
                  <p className="text-xs text-gray-500">Verified buyer feedback on {product.name}</p>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-gray-500">No reviews yet. Be the first to review this hardware tool!</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r._id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-charcoal-900">{r.userName}</span>
                          {r.verifiedPurchase && (
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-gray-400">{formatDate(r.createdAt)}</span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < r.rating ? 'fill-amber-500' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {r.title && <div className="font-semibold text-xs text-charcoal-900">{r.title}</div>}
                      <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Review Submission Form */}
              <div className="p-6 rounded-xl border border-gray-200 bg-white space-y-4">
                <h4 className="font-bold text-sm text-charcoal-900">Write a Review</h4>
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setNewRating(num)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              num <= newRating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Review Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Excellent build quality and durability"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-white border border-gray-300 text-xs rounded-lg p-2.5 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Review</label>
                    <textarea
                      rows={3}
                      placeholder="Share your practical experience with this tool..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full bg-white border border-gray-300 text-xs rounded-lg p-2.5 focus:outline-none focus:border-amber-500"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold rounded-lg text-xs shadow-sm transition-colors"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: Shipping */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-2xl text-xs sm:text-sm text-gray-700">
              <h3 className="text-base font-bold text-charcoal-900 mb-2">
                Lahore & Pakistan Delivery Policy
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Lahore Metro Express Delivery:</strong> 24 to 48 business hours across Township, Johar Town, Model Town, Gulberg, DHA, Bahria Town, and all Lahore sectors.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Free Shipping:</strong> Orders valued at Rs. 5,000 or above qualify for zero delivery fee in Lahore.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Flat Delivery Fee:</strong> Rs. 250 flat shipping for orders below Rs. 5,000 in Lahore.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Payment Modes:</strong> Cash on Delivery (COD) and Bank Transfer upon verified order confirmation.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Physical Store Pickup:</strong> You can also collect your orders directly from our store: Plot #3, Sector B-1, Block 11, Township, Lahore 54770.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel / Grid ("You May Also Like") */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-0.5">
                Related Equipment
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-900">
                You May Also Like
              </h2>
            </div>
            <Link to={`/category/${product.categorySlug}`} className="text-xs font-bold text-amber-600 hover:underline">
              View More in {product.category} →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} onQuickView={setQuickViewProduct} />
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
