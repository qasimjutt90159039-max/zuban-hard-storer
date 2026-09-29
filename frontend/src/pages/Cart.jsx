import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  MessageCircle,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPKR } from '../utils/formatters';
import { getCartWhatsAppUrl, STORE_WHATSAPP_NUMBER } from '../utils/whatsapp';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Cart() {
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    shippingFee,
    discountAmount,
    appliedCoupon,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    await applyCoupon(couponCode.trim());
    setApplyingCoupon(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/20">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            You don't have any hardware or tools in your cart yet. Explore our Lahore inventory to start shopping.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold rounded-xl text-sm shadow-md transition-colors"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            You have {cartCount} items in your hardware cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-gray-400 hover:text-red-600 font-semibold flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items Table / List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm divide-y divide-gray-100">
            {cartItems.map((item) => (
              <div
                key={item.productId || item._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product thumbnail & Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=300&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-gray-50 border border-gray-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <Link
                      to={`/products/${item.slug || item.productId || item._id}`}
                      className="font-bold text-sm text-charcoal-900 hover:text-amber-600 transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">
                      SKU: {item.sku || 'N/A'}
                    </div>
                    <div className="text-xs font-bold text-charcoal-900 mt-1">
                      {formatPKR(item.price)} each
                    </div>
                  </div>
                </div>

                {/* Quantity Modifier & Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => updateQuantity(item.productId || item._id, item.quantity - 1)}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId || item._id, item.quantity + 1)}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Subtotal */}
                  <div className="text-right min-w-[90px]">
                    <div className="text-sm font-extrabold text-charcoal-900">
                      {formatPKR(item.price * item.quantity)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.productId || item._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
            <Link
              to="/shop"
              className="text-amber-600 font-bold hover:underline flex items-center gap-1"
            >
              ← Continue Shopping
            </Link>
            <span>Township, Lahore Dispatch</span>
          </div>
        </div>

        {/* Order Summary & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-extrabold text-charcoal-900 border-b border-gray-100 pb-3">
              Order Summary
            </h2>

            {/* Calculations */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-charcoal-900">{formatPKR(cartSubtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Lahore Delivery Fee:</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE (Above Rs. 5,000)</span>
                  ) : (
                    <span className="font-semibold text-charcoal-900">{formatPKR(shippingFee)}</span>
                  )}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({appliedCoupon?.code}):</span>
                  <span>-{formatPKR(discountAmount)}</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-charcoal-900">Grand Total:</span>
                <span className="text-xl sm:text-2xl font-black text-charcoal-950">
                  {formatPKR(cartTotal)}
                </span>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="pt-2">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-emerald-800">
                      {appliedCoupon.code} applied ({appliedCoupon.discountPercentage}% OFF)
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 font-bold text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. ALZABAN10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-white border border-gray-300 text-xs rounded-lg px-3 py-2 uppercase font-medium focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={applyingCoupon}
                    className="px-4 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold rounded-lg text-xs transition-colors shrink-0"
                  >
                    {applyingCoupon ? 'Applying...' : 'Apply'}
                  </button>
                </form>
              )}
              <div className="text-[11px] text-gray-400 mt-1">
                Try promo codes: <strong>ALZABAN10</strong> or <strong>WELCOME5</strong>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-black rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Order via WhatsApp */}
              <a
                href={getCartWhatsAppUrl(cartItems, cartTotal)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order Inquiry via WhatsApp</span>
              </a>

              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                Cash on Delivery & Bank Transfer accepted. We verify all orders prior to Township warehouse dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
