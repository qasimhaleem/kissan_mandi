'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  PlusCircle,
  Package,
  Layers,
  Eye,
  MessageSquare,
  TrendingUp,
  MapPin,
  PauseCircle,
  PlayCircle,
  Trash2,
  Edit,
  ExternalLink,
  UserCheck,
  Building,
  Save,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X,
} from 'lucide-react';
import { Product, FarmerProfile } from '@/lib/types';
import { API_BASE, resolveImageUrl } from '@/lib/api';

interface AnalyticsData {
  totalProducts: number;
  activeProducts: number;
  pausedProducts: number;
  soldOutProducts: number;
  totalInventoryQuantity: number;
  totalEstimatedValue: number;
  totalViews: number;
  totalInquiries: number;
}

export default function FarmerDashboard() {
  const { user, token, loading, updateUser } = useAuth();
  const { t, locale } = useLanguage();
  const router = useRouter();

  // Products and Analytics state
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'sold_out'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Profile Management state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [farmData, setFarmData] = useState<FarmerProfile>({
    farmSizeAcres: user?.farmerProfile?.farmSizeAcres || 0,
    primaryCrops: user?.farmerProfile?.primaryCrops || [],
    experienceYears: user?.farmerProfile?.experienceYears || 0,
    farmAddress: user?.farmerProfile?.farmAddress || '',
    cnic: user?.farmerProfile?.cnic || '',
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'farmer')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (token) {
      loadFarmerData();
    }
  }, [token]);

  useEffect(() => {
    if (user?.farmerProfile) {
      setFarmData({
        farmSizeAcres: user.farmerProfile.farmSizeAcres || 0,
        primaryCrops: user.farmerProfile.primaryCrops || [],
        experienceYears: user.farmerProfile.experienceYears || 0,
        farmAddress: user.farmerProfile.farmAddress || '',
        cnic: user.farmerProfile.cnic || '',
      });
    }
  }, [user]);

  const loadFarmerData = async () => {
    setFetching(true);
    try {
      const [prodRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE}/products/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/products/mine/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const prodData = await prodRes.json();
      const anaData = await analyticsRes.json();

      if (prodData.success) {
        setProducts(prodData.data);
      }
      if (anaData.success) {
        setAnalytics(anaData.data);
      }
    } catch (err) {
      console.error('Failed to load farmer data:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleToggleStatus = async (productId: string, currentStatus: string) => {
    try {
      setActionLoading(productId);
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      const res = await fetch(`${API_BASE}/products/${productId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? { ...p, status: newStatus as any } : p))
        );
        loadFarmerData();
      }
    } catch (err) {
      console.error('Failed to update product status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }
    try {
      setActionLoading(productId);
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        loadFarmerData();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess('');
    setProfileError('');
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          farmerProfile: {
            farmSizeAcres: Number(farmData.farmSizeAcres) || 0,
            primaryCrops: typeof farmData.primaryCrops === 'string'
              ? (farmData.primaryCrops as string).split(',').map((c) => c.trim()).filter(Boolean)
              : farmData.primaryCrops,
            experienceYears: Number(farmData.experienceYears) || 0,
            farmAddress: farmData.farmAddress,
            cnic: farmData.cnic,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProfileSuccess('Farm profile successfully updated.');
        if (updateUser && data.data?.farmerProfile) {
          updateUser({ farmerProfile: data.data.farmerProfile });
        }
        setTimeout(() => setShowProfileModal(false), 1500);
      } else {
        setProfileError(data.error?.message || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileError('Network error while saving profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#8FD19E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header and Welcome Banner */}
      <div className="bg-white border-2 border-[#8FD19E] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#2B2B2B]">
              {user.name}
            </h1>
            <span className="px-3 py-1 bg-[#8FD19E]/20 text-[#2B2B2B] font-bold text-xs rounded-full uppercase tracking-wider">
              Verified Farmer
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-4 h-4 text-gray-500" />
              {user.district} District
            </span>
            <span className="text-gray-300">|</span>
            <span className="font-medium">Phone: {user.phone}</span>
            {user.farmerProfile?.farmSizeAcres ? (
              <>
                <span className="text-gray-300">|</span>
                <span className="font-medium">
                  Farm Size: {user.farmerProfile.farmSizeAcres} Acres
                </span>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowProfileModal(true)}
            className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-[#2B2B2B] font-bold text-sm hover:border-[#8FD19E] hover:bg-[#FAF6EA] transition-all flex items-center gap-2"
          >
            <Building className="w-4 h-4" />
            <span>Farm Profile</span>
          </button>
          <Link
            href="/farmer/post"
            className="px-5 py-2.5 rounded-xl bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-sm shadow-sm transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List New Produce</span>
          </Link>
        </div>
      </div>

      {/* Analytics Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Listings</span>
            <Package className="w-5 h-5 text-[#8FD19E]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2B2B2B]">
            {analytics?.activeProducts ?? products.filter((p) => p.status === 'active').length}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total listings: {analytics?.totalProducts ?? products.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Inventory</span>
            <Layers className="w-5 h-5 text-[#8FD19E]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2B2B2B]">
            {(analytics?.totalInventoryQuantity || 0).toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 mt-1">Available Units</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Portfolio Value</span>
            <TrendingUp className="w-5 h-5 text-[#8FD19E]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2B2B2B]">
            PKR {(analytics?.totalEstimatedValue || 0).toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 mt-1">Current market ask</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Views & Inquiries</span>
            <MessageSquare className="w-5 h-5 text-[#8FD19E]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2B2B2B]">
            {analytics?.totalInquiries ?? 0}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {analytics?.totalViews ?? 0} Marketplace views
          </p>
        </div>
      </div>

      {/* Product Management Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-[#2B2B2B]">Produce Catalog & Listings</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your published agricultural crops, pricing, and stock.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Tabs */}
            <div className="flex bg-[#FAF6EA] p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white text-[#2B2B2B] shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'active'
                    ? 'bg-white text-[#2B2B2B] shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('paused')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'paused'
                    ? 'bg-white text-[#2B2B2B] shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Paused
              </button>
              <button
                onClick={() => setStatusFilter('sold_out')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'sold_out'
                    ? 'bg-white text-[#2B2B2B] shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Sold Out
              </button>
            </div>

            <button
              onClick={loadFarmerData}
              className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:text-[#2B2B2B] hover:border-[#8FD19E] transition-all"
              title="Refresh Listings"
            >
              <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {fetching ? (
          <div className="py-16 text-center text-gray-500 font-bold">
            <div className="w-8 h-8 border-4 border-[#8FD19E] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading listings...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#2B2B2B]">No produce found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              {statusFilter === 'all'
                ? 'You have not listed any produce yet. Add your first harvest to connect with commercial buyers.'
                : `No products matching status: ${statusFilter}.`}
            </p>
            <Link
              href="/farmer/post"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-bold rounded-xl text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List First Product</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const primaryImg = resolveImageUrl(product.images?.[0]);
              const isActionRunning = actionLoading === product._id;

              return (
                <div
                  key={product._id}
                  className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-[#8FD19E] transition-all flex flex-col justify-between shadow-sm"
                >
                  <div>
                    {/* Thumbnail with status badge */}
                    <div className="relative h-44 bg-gray-100 overflow-hidden">
                      <img
                        src={primaryImg}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg text-xs font-bold text-[#2B2B2B] shadow-sm">
                          {product.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-black shadow-sm ${
                            product.status === 'active'
                              ? 'bg-[#8FD19E] text-[#2B2B2B]'
                              : product.status === 'paused'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {product.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-lg font-black text-[#2B2B2B] line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {product.location?.district || user.district}
                        </p>
                      </div>

                      <div className="bg-[#FAF6EA] p-3 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-xs text-gray-500 font-semibold block">Price</span>
                          <span className="text-base font-black text-[#2B2B2B]">
                            PKR {product.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500"> / {product.unit}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 font-semibold block">Available</span>
                          <span className="text-base font-black text-[#2B2B2B]">
                            {product.quantity.toLocaleString()} {product.unit}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 flex items-center justify-between">
                        <span>Min Order: {product.minOrder} {product.unit}</span>
                        <span>Inquiries: {product.inquiriesCount || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleStatus(product._id, product.status)}
                      disabled={isActionRunning}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 hover:border-[#8FD19E] text-xs font-bold text-[#2B2B2B] flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      title={product.status === 'active' ? 'Pause Listing' : 'Activate Listing'}
                    >
                      {product.status === 'active' ? (
                        <>
                          <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-3.5 h-3.5 text-green-600" />
                          <span>Activate</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/farmer/edit/${product._id}`}
                        className="p-2 rounded-lg border border-gray-200 hover:border-[#8FD19E] hover:bg-white text-gray-600 hover:text-[#2B2B2B] transition-colors"
                        title="Edit Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/marketplace/products/${product.slug || product._id}`}
                        className="p-2 rounded-lg border border-gray-200 hover:border-[#8FD19E] hover:bg-white text-gray-600 hover:text-[#2B2B2B] transition-colors"
                        title="View in Marketplace"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={isActionRunning}
                        className="p-2 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Farm Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl border-2 border-[#8FD19E] space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-[#2B2B2B]">Farm Information & Profile</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Complete your farm details to build credibility with buyers.
                </p>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}
            {profileError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                    Farm Size (Acres)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={farmData.farmSizeAcres || ''}
                    onChange={(e) =>
                      setFarmData({ ...farmData, farmSizeAcres: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="e.g. 15"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#8FD19E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                    Farming Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={farmData.experienceYears || ''}
                    onChange={(e) =>
                      setFarmData({ ...farmData, experienceYears: parseInt(e.target.value) || 0 })
                    }
                    placeholder="e.g. 10"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#8FD19E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                  Primary Crops Cultivated (comma separated)
                </label>
                <input
                  type="text"
                  value={
                    Array.isArray(farmData.primaryCrops)
                      ? farmData.primaryCrops.join(', ')
                      : farmData.primaryCrops || ''
                  }
                  onChange={(e) =>
                    setFarmData({
                      ...farmData,
                      primaryCrops: e.target.value.split(',').map((c) => c.trim()),
                    })
                  }
                  placeholder="e.g. Tomatoes, Wheat, Sugarcane, Citrus"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#8FD19E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                  CNIC Number (Verification)
                </label>
                <input
                  type="text"
                  value={farmData.cnic || ''}
                  onChange={(e) => setFarmData({ ...farmData, cnic: e.target.value })}
                  placeholder="e.g. 35201-1234567-1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#8FD19E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                  Farm Address / Village
                </label>
                <textarea
                  rows={2}
                  value={farmData.farmAddress || ''}
                  onChange={(e) => setFarmData({ ...farmData, farmAddress: e.target.value })}
                  placeholder="Detailed address of your agricultural land"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#8FD19E]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-5 py-2.5 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-sm rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{profileSaving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
