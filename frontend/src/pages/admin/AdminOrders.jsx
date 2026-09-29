import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, X, Check, MessageCircle, Phone, MapPin } from 'lucide-react';
import api from '../../services/api';
import { formatPKR, formatDate } from '../../utils/formatters';
import { STORE_WHATSAPP_NUMBER } from '../../utils/whatsapp';
import { useToast } from '../../context/ToastContext';

const statuses = ['all', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = selectedStatus === 'all' ? '/orders' : `/orders?status=${selectedStatus}`;
      const res = await api.get(url);
      if (res.data.success) setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      if (res.data.success) {
        showToast(`Order status updated to "${newStatus}"`, 'success');
        if (activeOrder && activeOrder._id === orderId) {
          setActiveOrder({ ...activeOrder, orderStatus: newStatus });
        }
        fetchOrders();
      }
    } catch (err) {
      showToast('Failed to update order status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
            Order Fulfillment Center
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review customer orders, update dispatch statuses, and monitor COD collection
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap capitalize ${
                selectedStatus === s
                  ? 'bg-amber-500 text-charcoal-950 shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s === 'all' ? 'All Orders' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Delivery City</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No orders matching status "{selectedStatus}".
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  let statusBadge = 'bg-amber-100 text-amber-800';
                  if (o.orderStatus === 'Delivered') statusBadge = 'bg-emerald-100 text-emerald-800';
                  if (o.orderStatus === 'Shipped') statusBadge = 'bg-blue-100 text-blue-800';
                  if (o.orderStatus === 'Cancelled') statusBadge = 'bg-red-100 text-red-800';

                  return (
                    <tr key={o._id} className="hover:bg-gray-50/60">
                      <td className="py-3.5 px-4 font-mono font-bold text-charcoal-900">
                        {o.orderNumber}
                        <div className="text-[10px] text-gray-400 font-normal font-sans">
                          {formatDate(o.createdAt)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-charcoal-900">
                          {o.customerDetails.firstName} {o.customerDetails.lastName}
                        </div>
                        <div className="text-gray-500">{o.customerDetails.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-700">
                        {o.customerDetails.city || 'Lahore'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-700">
                        {o.orderItems.length} Products
                      </td>
                      <td className="py-3.5 px-4 font-black text-charcoal-900">
                        {formatPKR(o.totalPrice)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {o.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border border-gray-300 focus:outline-none focus:border-amber-500 ${statusBadge}`}
                        >
                          {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setActiveOrder(o)}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-amber-500 hover:text-charcoal-950 font-bold text-gray-700 transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-gray-200 shadow-2xl relative">
            <button
              onClick={() => setActiveOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-charcoal-900">
                  Order Details: {activeOrder.orderNumber}
                </h2>
                <span className="text-xs text-gray-400">Placed on {formatDate(activeOrder.createdAt)}</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {activeOrder.orderStatus}
              </span>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <span className="font-bold text-gray-500 uppercase block mb-1">Customer</span>
                <div className="font-bold text-charcoal-900">
                  {activeOrder.customerDetails.firstName} {activeOrder.customerDetails.lastName}
                </div>
                <div className="text-gray-600">{activeOrder.customerDetails.phone}</div>
                <div className="text-gray-600">{activeOrder.customerDetails.email}</div>
              </div>

              <div>
                <span className="font-bold text-gray-500 uppercase block mb-1">Shipping Address</span>
                <div className="font-medium text-gray-800">{activeOrder.customerDetails.address}</div>
                <div className="text-gray-600">
                  {activeOrder.customerDetails.city}, {activeOrder.customerDetails.province} {activeOrder.customerDetails.postalCode}
                </div>
                {activeOrder.customerDetails.orderNotes && (
                  <div className="mt-2 text-amber-800 bg-amber-50 p-1.5 rounded">
                    <strong>Notes:</strong> {activeOrder.customerDetails.orderNotes}
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700">Purchased Hardware Tools:</span>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                {activeOrder.orderItems.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt="" className="w-9 h-9 object-cover rounded border border-gray-200" />
                      )}
                      <div>
                        <div className="font-bold text-charcoal-900">{item.name}</div>
                        <div className="text-[11px] text-gray-400">SKU: {item.sku} • Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <span className="font-bold text-charcoal-900">{formatPKR(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Totals */}
            <div className="text-xs space-y-1.5 border-t border-gray-200 pt-3">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal:</span>
                <span>{formatPKR(activeOrder.itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery:</span>
                <span>{activeOrder.shippingPrice === 0 ? 'FREE' : formatPKR(activeOrder.shippingPrice)}</span>
              </div>
              {activeOrder.discountPrice > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({activeOrder.couponCode || 'Promo'}):</span>
                  <span>-{formatPKR(activeOrder.discountPrice)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-charcoal-950 pt-2 border-t border-gray-100">
                <span>Grand Total:</span>
                <span>{formatPKR(activeOrder.totalPrice)}</span>
              </div>
            </div>

            {/* Status Selector & WhatsApp Contact */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-gray-700">Update Status:</span>
                <select
                  value={activeOrder.orderStatus}
                  onChange={(e) => handleStatusChange(activeOrder._id, e.target.value)}
                  className="bg-white border border-gray-300 font-bold rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500"
                >
                  {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <a
                href={`https://wa.me/${activeOrder.customerDetails.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${activeOrder.customerDetails.firstName}, regarding your order #${activeOrder.orderNumber} with Al Zaban Hardware Store Lahore.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Customer on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
