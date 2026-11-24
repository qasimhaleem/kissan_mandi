'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Sprout,
  ShoppingCart,
  TrendingUp,
  ShieldCheck,
  Search,
  RefreshCw,
  AlertCircle,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { API_BASE } from '@/lib/api';

interface AdminMetrics {
  totalUsers: number;
  totalFarmers: number;
  totalBuyers: number;
  totalListings: number;
  activeListings: number;
}

interface AdminUser {
  _id: string;
  name: string;
  phone: string;
  role: 'farmer' | 'buyer' | 'admin';
  district?: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'farmer' | 'buyer' | 'admin'>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchAdminData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError('');

      // Fetch overview metrics
      const resOverview = await fetch(`${API_BASE}/portals/admin/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataOverview = await resOverview.json();

      if (dataOverview.success && dataOverview.data?.metrics) {
        setMetrics(dataOverview.data.metrics);
      }

      // Fetch users list
      const resUsers = await fetch(`${API_BASE}/portals/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataUsers = await resUsers.json();

      if (dataUsers.success && dataUsers.data?.users) {
        setUsers(dataUsers.data.users);
      }
    } catch {
      setError('Unable to load administration data. Please verify connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin' && token) {
      fetchAdminData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  if (authLoading || (!user && loading)) {
    return (
      <div className="km-container py-20 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-neutral-500 font-medium">
          <RefreshCw className="w-4 h-4 animate-spin text-km-green-700" />
          <span>Verifying administrator credentials...</span>
        </div>
      </div>
    );
  }

  // Unauthorized view for non-admin roles
  if (user && user.role !== 'admin') {
    return (
      <div className="km-container py-20 max-w-xl mx-auto text-center space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="font-heading font-extrabold text-2xl text-km-ink">
          Administrator Access Required
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Your current account is registered as a <strong className="capitalize">{user.role}</strong>. The administrative operations console is restricted to authorized platform personnel.
        </p>
        <Link
          href={user.role === 'farmer' ? '/farmer' : '/buyer'}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-km-ink text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
        >
          <span>Return to {user.role === 'farmer' ? 'Farmer' : 'Buyer'} Portal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.district && u.district.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="km-container py-10 lg:py-14 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Platform Administration
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-km-ink mt-1">
            System Operations Console
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Institutional overview of user registration, harvest listings, and platform health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchAdminData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: 'Total Registered Users',
            value: metrics?.totalUsers ?? '—',
            icon: Users,
            sub: `${metrics?.totalFarmers ?? 0} Farmers · ${metrics?.totalBuyers ?? 0} Buyers`,
          },
          {
            label: 'Registered Farmers',
            value: metrics?.totalFarmers ?? '—',
            icon: Sprout,
            sub: 'Growers across Pakistan',
          },
          {
            label: 'Commercial Buyers',
            value: metrics?.totalBuyers ?? '—',
            icon: ShoppingCart,
            sub: 'Wholesalers & Mills',
          },
          {
            label: 'Active Produce Lots',
            value: metrics?.activeListings ?? '—',
            icon: TrendingUp,
            sub: `${metrics?.totalListings ?? 0} All-time listings`,
          },
          {
            label: 'System Status',
            value: 'Healthy',
            icon: ShieldCheck,
            sub: 'All systems operational',
          },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-2 hover:border-neutral-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  {m.label}
                </span>
                <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="font-heading font-extrabold text-2xl text-km-ink tabular-nums">
                {m.value}
              </p>
              <p className="text-[11px] text-neutral-400 font-medium truncate">
                {m.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Duffel-Style Segmented Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-3 text-xs font-bold transition-all relative ${
            activeTab === 'overview'
              ? 'text-neutral-900 border-b-2 border-neutral-900'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          System Controls
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-3 text-xs font-bold transition-all relative ${
            activeTab === 'users'
              ? 'text-neutral-900 border-b-2 border-neutral-900'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          User Registry ({users.length})
        </button>
      </div>

      {/* TAB 1: SYSTEM CONTROLS & QUICK ACTIONS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-km-ink">
              Marketplace Quick Links
            </h3>
            <p className="text-xs text-neutral-600">
              Access the live public marketplace and review active farm-gate batches.
            </p>
            <div className="space-y-2 pt-2">
              <Link
                href="/marketplace"
                className="w-full inline-flex items-center justify-between p-3 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
              >
                <span>Browse All Active Listings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/farmer/post"
                className="w-full inline-flex items-center justify-between p-3 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
              >
                <span>Post Produce Form Preview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-km-ink">
              Institutional Security
            </h3>
            <p className="text-xs text-neutral-600">
              JWT dual-token authentication, bcrypt hashing, and role-based access control (RBAC).
            </p>
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">RBAC Enforcement:</span>
                <span className="font-bold text-emerald-700">Strict</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Storage Provider:</span>
                <span className="font-bold text-neutral-800">Cloudinary / Disk</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Database Engine:</span>
                <span className="font-bold text-neutral-800">MongoDB Atlas</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-km-ink">
              Toll-Free Helpline Registry
            </h3>
            <p className="text-xs text-neutral-600">
              Direct voice routing for rural farmers without smartphones.
            </p>
            <div className="p-4 rounded-2xl bg-[#0E2015] text-white space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400">
                Helpline Dispatch
              </span>
              <p className="font-heading font-extrabold text-xl text-white">
                0800-KISSAN
              </p>
              <p className="text-[11px] text-neutral-300">
                Operating Mon–Sat, 7:00 AM – 9:00 PM PKT
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER REGISTRY TABLE */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user by name, phone, or district..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-neutral-200 bg-white placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="inline-flex items-center p-0.5 rounded-full bg-neutral-100 border border-neutral-200/80 self-start sm:self-auto">
              {(['all', 'farmer', 'buyer', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                    roleFilter === r
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200/80 text-neutral-500 uppercase font-semibold">
                  <tr>
                    <th className="py-3.5 px-6">User Name</th>
                    <th className="py-3.5 px-6">Phone Number</th>
                    <th className="py-3.5 px-6">Role</th>
                    <th className="py-3.5 px-6">District</th>
                    <th className="py-3.5 px-6">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-neutral-50/70 transition-colors">
                        <td className="py-4 px-6 font-semibold text-km-ink">{u.name}</td>
                        <td className="py-4 px-6 font-mono text-neutral-600">{u.phone}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              u.role === 'farmer'
                                ? 'bg-emerald-100 text-emerald-800'
                                : u.role === 'buyer'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-neutral-600">{u.district || '—'}</td>
                        <td className="py-4 px-6 text-neutral-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-neutral-400">
                        No registered users found matching the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
