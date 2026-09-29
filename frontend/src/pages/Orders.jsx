import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Clock, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../context/AuthContext';
import { formatPKR, formatDate } from '../utils/formatters';
import { STORE_WHATSAPP_NUMBER } from '../utils/whatsapp';
import api from '../services/api';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get('/orders/myorders')
        .then((res) => {
          if (res.data.success) setOrders(res.data.orders);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-charcoal-900">Sign In to Track Orders</h2>
        <p className="text-xs text-gray-500">Please sign in to view your past purchases and order status.</p>
        <Link to="/login" className="inline-block px-5 py-2.5 bg-amber-500 text-charcoal-950 font-bold rounded-lg text-xs">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'My Orders' }]} />

      <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Order History & Tracking
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track your hardware supplies dispatch from Township, Lahore
          </p>
        </div>
        <Link to="/shop" className="text-xs font-bold text-amber-600 hover:underline">
          Shop More Tools →
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-500 text-sm">
          Loading your order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4 shadow-sm">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-charcoal-900">No Orders Placed Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You haven't placed any orders with Al Zaban Hardware Store yet. Start exploring our hand tools and power equipment.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold rounded-xl text-xs shadow-sm transition-colors"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            let statusColor = 'bg-amber-100 text-amber-800';
            if (order.orderStatus === 'Delivered') statusColor = 'bg-emerald-100 text-emerald-800';
            if (order.orderStatus === 'Shipped') statusColor = 'bg-blue-100 text-blue-800';
            if (order.orderStatus === 'Cancelled') statusColor = 'bg-red-100 text-red-800';

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="p-4 sm:p-5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-gray-400 block text-[11px]">Order Reference</span>
                      <span className="font-mono font-bold text-charcoal-900 text-sm">
                        {order.orderNumber}
                      </span>
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-gray-400 block text-[11px]">Date</span>
                      <span className="font-semibold text-gray-700">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColor}`}>
                      {order.orderStatus}
                    </span>
                    <a
                      href={`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Hello Al Zaban Store, I would like to inquire about status for Order #${order.orderNumber}.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/20 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                      title="WhatsApp Inquiry"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">Inquire</span>
                    </a>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 sm:p-5 divide-y divide-gray-100">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded bg-gray-100 border border-gray-200"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-charcoal-900">{item.name}</div>
                          <div className="text-[11px] text-gray-400">
                            Qty: {item.quantity} × {formatPKR(item.price)}
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-charcoal-900">
                        {formatPKR(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer details */}
                <div className="p-4 sm:p-5 bg-gray-50/50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-gray-500">
                    Payment Method: <strong className="text-charcoal-900">{order.paymentMethod}</strong>
                  </div>
                  <div className="text-sm font-black text-charcoal-950">
                    Total: {formatPKR(order.totalPrice)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
