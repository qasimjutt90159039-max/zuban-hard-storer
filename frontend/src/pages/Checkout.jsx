import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPKR } from '../utils/formatters';
import Breadcrumbs from '../components/Breadcrumbs';
import api from '../services/api';

export default function Checkout() {
  const {
    cartItems,
    cartSubtotal,
    shippingFee,
    discountAmount,
    appliedCoupon,
    cartTotal,
    clearCart
  } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user ? user.name.split(' ')[0] : '',
    lastName: user ? user.name.split(' ').slice(1).join(' ') : '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address?.street || '',
    city: user?.address?.city || 'Lahore',
    province: user?.address?.province || 'Punjab',
    postalCode: user?.address?.postalCode || '54770',
    orderNotes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-charcoal-900 mb-2">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500 mb-6">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="px-5 py-2.5 bg-amber-500 text-charcoal-950 font-bold rounded-lg text-xs">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.firstName || !formData.phone || !formData.address) {
      setErrorMsg('Please complete all required fields (First Name, Phone Number, and Street Address).');
      showToast('Please fill in required delivery information', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        customerDetails: formData,
        orderItems: cartItems.map((item) => ({
          productId: item.productId || item._id,
          name: item.name,
          sku: item.sku,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        paymentMethod,
        couponCode: appliedCoupon ? appliedCoupon.code : '',
        discountPrice: discountAmount
      };

      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        const createdOrder = res.data.order;
        clearCart();
        showToast(`Order #${createdOrder.orderNumber} placed successfully!`, 'success');
        navigate(`/order-confirmation/${createdOrder.orderNumber}`, { state: { order: createdOrder } });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order. Please try again.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Cart', url: '/cart' },
          { label: 'Checkout' }
        ]}
      />

      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
          Secure Order Checkout
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Complete your hardware order for delivery in Lahore and across Pakistan
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Customer & Delivery Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details Box */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-500" />
              Delivery & Contact Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Tariq"
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Mehmood"
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +92 300 1234567"
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-gray-400">Required for delivery verification</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. info@example.com"
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Street Address / House / Plot <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                placeholder="Complete street address, sector, block, house or workshop number"
                required
                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Province
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Order Notes (Optional)
              </label>
              <input
                type="text"
                name="orderNotes"
                value={formData.orderNotes}
                onChange={handleChange}
                placeholder="Special delivery instructions or gate timing in Lahore"
                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-amber-500" />
              Payment Method
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery (Primary) */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="mt-1 text-amber-500 focus:ring-amber-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-charcoal-900">Cash on Delivery (COD)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-charcoal-950 uppercase">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Pay securely in cash directly to the courier when your hardware package is delivered to your doorstep in Lahore or Pakistan.
                  </p>
                </div>
              </label>

              {/* Bank Transfer */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Bank Transfer'
                    ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Bank Transfer"
                  checked={paymentMethod === 'Bank Transfer'}
                  onChange={() => setPaymentMethod('Bank Transfer')}
                  className="mt-1 text-amber-500 focus:ring-amber-500"
                />
                <div className="flex-1">
                  <span className="font-bold text-sm text-charcoal-900">Direct Bank Transfer</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Make your payment directly into our official business bank account. Our representative will share verified account details upon order confirmation.
                  </p>
                  {paymentMethod === 'Bank Transfer' && (
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 space-y-1">
                      <p className="font-semibold text-charcoal-900">Bank Transfer Instructions:</p>
                      <p>1. Place your order to generate your Order Reference Number.</p>
                      <p>2. Our store team will verify stock and contact you with bank transfer details via WhatsApp / Call (+92 335 1108300).</p>
                      <p>3. Share payment proof to initiate immediate dispatch.</p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Col: Order Summary & Place Order */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-extrabold text-charcoal-900 border-b border-gray-100 pb-3">
              Order Review ({cartItems.length} Products)
            </h2>

            {/* Compact items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item.productId || item._id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-md border border-gray-200 shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-charcoal-900 truncate">{item.name}</div>
                      <div className="text-[11px] text-gray-400">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <span className="font-bold text-charcoal-900 shrink-0">
                    {formatPKR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing details */}
            <div className="space-y-2.5 pt-3 border-t border-gray-200 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-charcoal-900">{formatPKR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Lahore Shipping:</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    <span className="font-semibold text-charcoal-900">{formatPKR(shippingFee)}</span>
                  )}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>-{formatPKR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-gray-200">
                <span className="text-sm font-bold text-charcoal-900">Total Payable:</span>
                <span className="text-2xl font-black text-charcoal-950">
                  {formatPKR(cartTotal)}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-black rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'Placing Order...' : 'Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-[11px] text-gray-400 text-center leading-relaxed">
              By placing your order, you agree to Al Zaban Hardware Store's delivery and inspection terms.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
