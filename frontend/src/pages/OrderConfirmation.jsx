import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, MapPin, Phone, MessageCircle, ArrowRight, Printer } from 'lucide-react';
import { formatPKR, formatDate } from '../utils/formatters';
import { STORE_WHATSAPP_NUMBER } from '../utils/whatsapp';
import api from '../services/api';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      api.get(`/orders/${orderNumber}`)
        .then((res) => {
          if (res.data.success) setOrder(res.data.order);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [orderNumber, order]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-gray-500 font-semibold">Retrieving order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-charcoal-900">Order Information Unavailable</h2>
        <p className="text-xs text-gray-500">We could not retrieve order #{orderNumber}.</p>
        <Link to="/shop" className="inline-block px-5 py-2.5 bg-amber-500 text-charcoal-950 font-bold rounded-lg text-xs">
          Return to Shop
        </Link>
      </div>
    );
  }

  const whatsappInquiryUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Al Zaban Hardware Store, I have placed Order #${order.orderNumber} for Rs. ${order.totalPrice.toLocaleString()}. Please provide confirmation and delivery schedule for Lahore.`
  )}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Success Hero */}
      <div className="text-center space-y-3 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900">
          Order Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          Thank you for choosing Al Zaban Hardware Store. Your order has been registered in our Lahore warehouse dispatch queue.
        </p>
        <div className="pt-2">
          <span className="inline-block px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs font-mono font-bold text-amber-900">
            Order Reference: {order.orderNumber}
          </span>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <span className="text-xs text-gray-400">Date Placed:</span>
            <div className="text-xs font-bold text-charcoal-900">{formatDate(order.createdAt)}</div>
          </div>
          <div>
            <span className="text-xs text-gray-400">Payment:</span>
            <div className="text-xs font-bold text-charcoal-900">{order.paymentMethod}</div>
          </div>
          <div>
            <span className="text-xs text-gray-400">Order Status:</span>
            <div>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                {order.orderStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div>
            <span className="font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Customer Details
            </span>
            <div className="font-bold text-charcoal-900">
              {order.customerDetails.firstName} {order.customerDetails.lastName}
            </div>
            <div className="text-gray-600">{order.customerDetails.phone}</div>
            <div className="text-gray-600">{order.customerDetails.email}</div>
          </div>

          <div>
            <span className="font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Delivery Destination
            </span>
            <div className="text-gray-800 font-medium">
              {order.customerDetails.address}
            </div>
            <div className="text-gray-600">
              {order.customerDetails.city}, {order.customerDetails.province} {order.customerDetails.postalCode}
            </div>
          </div>
        </div>

        {/* Ordered Items List */}
        <div>
          <h3 className="font-bold text-sm text-charcoal-900 mb-3">Items Purchased</h3>
          <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between text-xs bg-white">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded bg-gray-50 border border-gray-200"
                    />
                  )}
                  <div>
                    <div className="font-bold text-charcoal-900">{item.name}</div>
                    <div className="text-[11px] text-gray-400">
                      SKU: {item.sku} • Qty: {item.quantity} × {formatPKR(item.price)}
                    </div>
                  </div>
                </div>
                <span className="font-bold text-charcoal-900">
                  {formatPKR(item.subtotal)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="space-y-2 pt-2 border-t border-gray-200 text-xs sm:text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span className="font-semibold text-charcoal-900">{formatPKR(order.itemsPrice)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping:</span>
            <span className="font-semibold text-charcoal-900">
              {order.shippingPrice === 0 ? 'FREE' : formatPKR(order.shippingPrice)}
            </span>
          </div>
          {order.discountPrice > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount ({order.couponCode || 'PROMO'}):</span>
              <span>-{formatPKR(order.discountPrice)}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-2 border-t border-gray-200 text-base font-black text-charcoal-950">
            <span>Total:</span>
            <span>{formatPKR(order.totalPrice)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm Order on WhatsApp</span>
          </a>

          <Link
            to="/shop"
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
