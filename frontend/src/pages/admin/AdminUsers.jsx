import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, Shield, Calendar } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users')
      .then((res) => {
        if (res.data.success) setUsers(res.data.users);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
          Customer & User Directory
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Registered buyers and administrative accounts for Al Zaban Hardware Store
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Loading directory...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/60">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 font-bold flex items-center justify-center text-xs">
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-bold text-charcoal-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{u.email}</td>
                    <td className="py-3 px-4 text-gray-600">{u.phone || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-600">{u.address?.city || 'Lahore'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-400">
                      {formatDate(u.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
