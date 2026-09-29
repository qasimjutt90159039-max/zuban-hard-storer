import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wrench, Lock, Mail, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  // Quick Demo Logins
  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <Breadcrumbs items={[{ label: 'Account Login' }]} />

      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-charcoal-950 font-bold flex items-center justify-center mx-auto shadow-md">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-gray-500">
            Access your orders, saved hardware tools and profile
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Quick Demo Accounts:
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@alzaban.com', 'Admin@Alzaban2026')}
              className="flex-1 py-1.5 px-2 bg-charcoal-900 hover:bg-charcoal-800 text-amber-400 font-bold rounded-lg text-[11px] transition-colors"
            >
              Fill Admin Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('customer@alzaban.com', 'Customer@12345')}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-gray-100 text-charcoal-900 font-bold border border-gray-300 rounded-lg text-[11px] transition-colors"
            >
              Fill Customer Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g. admin@alzaban.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-amber-600 hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}
