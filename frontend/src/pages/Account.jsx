import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Phone, Mail, Package, ShieldCheck, Save } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { Link } from 'react-router-dom';

export default function Account() {
  const { user, updateProfile, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || 'Lahore',
    province: user?.address?.province || 'Punjab',
    postalCode: user?.address?.postalCode || '54770'
  });

  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-charcoal-900">Please Sign In</h2>
        <p className="text-xs text-gray-500">You must be logged in to access your account profile.</p>
        <Link to="/login" className="inline-block px-5 py-2.5 bg-amber-500 text-charcoal-950 font-bold rounded-lg text-xs">
          Sign In
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      name: formData.name,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode
      }
    });
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'My Account' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Customer Profile
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your personal contact details and saved Lahore delivery address
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="px-4 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>My Orders</span>
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-charcoal-950 rounded-lg text-xs font-bold transition-colors"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500 text-charcoal-950 font-black text-2xl flex items-center justify-center mx-auto shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-extrabold text-charcoal-900 text-base">{user.name}</h3>
            <div className="text-xs text-gray-400 mt-0.5">{user.email}</div>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <h3 className="text-sm font-extrabold text-charcoal-900 border-b border-gray-100 pb-3">
            Update Personal Details & Address
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Province</label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold rounded-lg text-xs flex items-center gap-2 shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
