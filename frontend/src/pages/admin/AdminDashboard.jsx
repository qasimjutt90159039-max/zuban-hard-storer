import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { formatPKR, formatDate } from '../../utils/formatters';
import api from '../../services/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => {
        if (res.data.success) setData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 font-semibold text-sm">
        Gathering Al Zaban Hardware Store metrics...
      </div>
    );
  }

  const stats = data?.stats || {};
  const monthlySales = data?.monthlySales || [];
  const categoryPerformance = data?.categoryPerformance || [];
  const orderStatuses = data?.orderStatuses || {};
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 tracking-tight">
            Store Performance & Analytics
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time sales, order fulfillment, and inventory monitoring for Township, Lahore branch
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold rounded-lg text-xs transition-colors"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold rounded-lg text-xs transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Total Revenue
            </span>
            <div className="text-xl sm:text-2xl font-black text-charcoal-900 mt-1">
              {formatPKR(stats.totalRevenue || 0)}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" />
              Live Store Orders
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Total Orders
            </span>
            <div className="text-xl sm:text-2xl font-black text-charcoal-900 mt-1">
              {stats.totalOrders || 0}
            </div>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
              {stats.pendingOrders || 0} Pending Confirmation
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Inventory Catalog
            </span>
            <div className="text-xl sm:text-2xl font-black text-charcoal-900 mt-1">
              {stats.totalProducts || 0}
            </div>
            <span className="text-[11px] text-gray-500 font-medium mt-1 block">
              Across 12 Categories
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Low Stock Items
            </span>
            <div className="text-xl sm:text-2xl font-black text-red-600 mt-1">
              {stats.lowStockProducts || 0}
            </div>
            <span className="text-[11px] text-red-500 font-semibold mt-1 block">
              Needs Reorder Soon
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Charts & Category Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-extrabold text-charcoal-900 text-sm">Monthly Sales Performance</h3>
              <p className="text-[11px] text-gray-400">Revenue in PKR over the past 6 months</p>
            </div>
            <span className="text-xs font-bold text-amber-600">PKR Currency</span>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 pt-8 px-2">
            {monthlySales.map((item, idx) => {
              const maxSale = 450000;
              const heightPercent = Math.min(100, Math.round((item.sales / maxSale) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Rs. {(item.sales / 1000).toFixed(0)}k
                  </div>
                  <div className="w-full bg-gray-100 rounded-t-lg h-44 flex items-end overflow-hidden">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-charcoal-900 group-hover:bg-amber-500 transition-all duration-300 rounded-t-lg"
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-charcoal-900">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-charcoal-900 text-sm border-b border-gray-100 pb-3">
              Order Fulfillment Breakdown
            </h3>
            <div className="space-y-3 pt-3 text-xs">
              {Object.entries(orderStatuses).map(([status, count]) => {
                let badge = 'bg-gray-100 text-gray-700';
                if (status === 'Pending') badge = 'bg-amber-100 text-amber-800';
                if (status === 'Delivered') badge = 'bg-emerald-100 text-emerald-800';
                if (status === 'Shipped') badge = 'bg-blue-100 text-blue-800';
                if (status === 'Cancelled') badge = 'bg-red-100 text-red-800';

                return (
                  <div key={status} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <span className="font-medium text-gray-700">{status} Orders</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${badge}`}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            to="/admin/orders"
            className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-center text-xs font-bold text-charcoal-900 transition-colors block"
          >
            Review All Orders →
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-extrabold text-charcoal-900 text-sm">Recent Store Orders</h3>
            <p className="text-[11px] text-gray-400">Latest customer submissions</p>
          </div>
          <Link to="/admin/orders" className="text-xs font-bold text-amber-600 hover:underline">
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-charcoal-900">
                    {o.orderNumber}
                  </td>
                  <td className="py-3 px-4 font-medium text-charcoal-900">
                    {o.customerDetails.firstName} {o.customerDetails.lastName}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{o.customerDetails.phone}</td>
                  <td className="py-3 px-4 font-bold text-charcoal-900">{formatPKR(o.totalPrice)}</td>
                  <td className="py-3 px-4 text-gray-600">{o.paymentMethod}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to="/admin/orders"
                      className="text-amber-600 font-bold hover:underline"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
