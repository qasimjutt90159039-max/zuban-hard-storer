import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, Lock, Mail, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: 'Lahore',
    province: 'Punjab'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: {
        city: formData.city,
        province: formData.province
      }
    });
    setLoading(false);
    if (res.success) {
      navigate('/account');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <Breadcrumbs items={[{ label: 'Register Account' }]} />

      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-charcoal-950 font-bold flex items-center justify-center mx-auto shadow-md">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-gray-500">
            Join Al Zaban Hardware Store for easy ordering and order tracking
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Asad Farooq"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g. asad@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="e.g. +92 300 1234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-amber-600 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
