'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  PlusCircle,
  Package,
  Layers,
  MessageSquare,
  TrendingUp,
  MapPin,
  PauseCircle,
  PlayCircle,
  Trash2,
  Edit,
  ExternalLink,
  Building,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowDownToLine,
  X,
} from 'lucide-react';
import { Product, FarmerProfile } from '@/lib/types';
import { API_BASE, resolveImageUrl } from '@/lib/api';
import { getCategoryFallbackImage } from '@/components/ui/ProductCard';
import SkeletonCard from '@/components/ui/SkeletonCard';

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
  const isUrdu = locale === 'ur';
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'paused' | 'sold_out'
  >('all');
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

  useEffect(() => {
    if (token) {
      loadFarmerData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (user?.farmerProfile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFarmData({
        farmSizeAcres: user.farmerProfile.farmSizeAcres || 0,
        primaryCrops: user.farmerProfile.primaryCrops || [],
        experienceYears: user.farmerProfile.experienceYears || 0,
        farmAddress: user.farmerProfile.farmAddress || '',
        cnic: user.farmerProfile.cnic || '',
      });
    }
  }, [user]);

  const handleToggleStatus = async (
    productId: string,
    currentStatus: string
  ) => {
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
          prev.map((p) =>
            p._id === productId
              ? { ...p, status: newStatus as Product['status'] }
              : p
          )
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
    if (
      !window.confirm(
        isUrdu
          ? 'کیا آپ واقعی یہ فصل حذف کرنا چاہتے ہیں؟'
          : 'Are you sure you want to delete this listing? This action cannot be undone.'
      )
    ) {
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
            primaryCrops:
              typeof farmData.primaryCrops === 'string'
                ? (farmData.primaryCrops as string)
                    .split(',')
                    .map((c) => c.trim())
                    .filter(Boolean)
                : farmData.primaryCrops,
            experienceYears: Number(farmData.experienceYears) || 0,
            farmAddress: farmData.farmAddress,
            cnic: farmData.cnic,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProfileSuccess(
          isUrdu
            ? 'فارم کی معلومات کامیابی سے محفوظ ہو گئیں۔'
            : 'Farm profile successfully updated.'
        );
        if (updateUser && data.data?.farmerProfile) {
          updateUser({ farmerProfile: data.data.farmerProfile });
        }
        setTimeout(() => setShowProfileModal(false), 1200);
      } else {
        setProfileError(data.error?.message || 'Failed to update profile.');
      }
    } catch {
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
        <div className="w-9 h-9 border-4 border-km-green-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="km-container py-8 sm:py-10 space-y-8">
      {/* Farmer Greeting Header */}
      <div className="bg-white rounded-3xl border-2 border-km-green-300 shadow-km-sm p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-km-ink">
              {t('welcomeFarmer')}, {user.name}
            </h1>
            <span className="km-badge">
              {isUrdu ? 'تصدیق شدہ کسان' : 'Verified Farmer'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm sm:text-base font-medium text-km-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-km-green-700" />
              <span>
                {user.district} {isUrdu ? 'ضلع' : 'District'}
              </span>
            </span>
            <span className="text-km-green-300">|</span>
            <span>
              {isUrdu ? 'فون:' : 'Phone:'} {user.phone}
            </span>
            {user.farmerProfile?.farmSizeAcres ? (
              <>
                <span className="text-km-green-300">|</span>
                <span>
                  {isUrdu ? 'رقبہ:' : 'Farm:'}{' '}
                  {user.farmerProfile.farmSizeAcres}{' '}
                  {isUrdu ? 'ایکڑ' : 'Acres'}
                </span>
              </>
            ) : null}
          </div>
        </div>

        {/* Large, Farmer-Friendly Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          <Link
            href="/farmer/post"
            className="km-btn-primary px-6 py-4 text-base shadow-km-md"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t('postProduce')}</span>
          </Link>
          <Link
            href="/farmer/bids"
            className="km-btn-light px-6 py-4 text-base"
          >
            <ArrowDownToLine className="w-5 h-5" />
            <span>{t('bidsReceived')}</span>
          </Link>
          <button
            type="button"
            onClick={() => setShowProfileModal(true)}
            className="km-btn-outline px-6 py-4 text-base"
          >
            <Building className="w-5 h-5" />
            <span>{isUrdu ? 'فارم پروفائل' : 'Farm Profile'}</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: isUrdu ? 'فعال فصلیں' : 'Active Listings',
            value:
              analytics?.activeProducts ??
              products.filter((p) => p.status === 'active').length,
            sub: `${isUrdu ? 'کل:' : 'Total:'} ${
              analytics?.totalProducts ?? products.length
            }`,
            icon: Package,
          },
          {
            label: isUrdu ? 'کل دستیاب مقدار' : 'Total Inventory',
            value: (analytics?.totalInventoryQuantity || 0).toLocaleString(),
            sub: isUrdu ? 'دستیاب یونٹس' : 'Available units',
            icon: Layers,
          },
          {
            label: isUrdu ? 'تخمینی مالیت' : 'Portfolio Value',
            value: `PKR ${(analytics?.totalEstimatedValue || 0).toLocaleString()}`,
            sub: isUrdu ? 'موجودہ مارکیٹ قیمت' : 'Current ask value',
            icon: TrendingUp,
          },
          {
            label: isUrdu ? 'انکوائریز اور ویوز' : 'Inquiries & Views',
            value: analytics?.totalInquiries ?? 0,
            sub: `${analytics?.totalViews ?? 0} ${
              isUrdu ? 'ویوز' : 'marketplace views'
            }`,
            icon: MessageSquare,
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="km-card p-5 sm:p-6 space-y-2">
              <div className="flex items-center justify-between text-km-ink-muted">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className="w-9 h-9 rounded-xl bg-km-green-100 text-km-green-800 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-km-ink truncate">
                {stat.value}
              </div>
              <p className="text-xs font-medium text-km-ink-subtle">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Produce Catalog Management */}
      <div className="km-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-km-green-100 pb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-km-ink">
              {t('myListings')}
            </h2>
            <p className="text-sm text-km-ink-muted mt-0.5">
              {isUrdu
                ? 'اپنی تمام شائع کردہ فصلوں کی قیمت، مقدار اور اسٹیٹس کا انتظام کریں۔'
                : 'Manage your published produce, pricing, stock, and availability.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex bg-km-cream-100 p-1 rounded-xl border border-km-cream-300/70 text-xs font-bold">
              {(
                [
                  { id: 'all', label: isUrdu ? `سب (${products.length})` : `All (${products.length})` },
                  { id: 'active', label: isUrdu ? 'فعال' : 'Active' },
                  { id: 'paused', label: isUrdu ? 'معطل' : 'Paused' },
                  { id: 'sold_out', label: isUrdu ? 'فروخت شدہ' : 'Sold Out' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3.5 py-2 rounded-lg transition-all ${
                    statusFilter === tab.id
                      ? 'bg-km-green-700 text-white shadow-km-sm'
                      : 'text-km-ink-muted hover:text-km-ink'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={loadFarmerData}
              aria-label="Refresh listings"
              className="p-2.5 rounded-xl border border-km-green-200 hover:bg-km-green-50 text-km-green-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {fetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-km-cream-100 border-2 border-dashed border-km-green-300 rounded-3xl p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-km-green-100 text-km-green-800 flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-km-ink">
              {isUrdu ? 'کوئی فصل موجود نہیں' : 'No produce listings found'}
            </h3>
            <p className="text-sm text-km-ink-muted max-w-md mx-auto">
              {statusFilter === 'all'
                ? t('noListings')
                : `No products currently marked as ${statusFilter}.`}
            </p>
            <Link href="/farmer/post" className="km-btn-primary px-7 py-3.5 text-base">
              <PlusCircle className="w-5 h-5" />
              <span>{t('postProduce')}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const fallback = getCategoryFallbackImage(product.category);
              const primaryImg = product.images?.[0]
                ? resolveImageUrl(product.images[0])
                : fallback;
              const isActionRunning = actionLoading === product._id;

              return (
                <article
                  key={product._id}
                  className="bg-white border border-km-green-200/80 rounded-2xl overflow-hidden shadow-km-sm hover:shadow-km-md hover:border-km-green-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full bg-km-cream-200 overflow-hidden">
                      <Image
                        src={primaryImg}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute top-3 start-3">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-km-green-800 shadow-km-sm">
                          {product.category}
                        </span>
                      </div>
                      <div className="absolute top-3 end-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-km-sm ${
                            product.status === 'active'
                              ? 'bg-km-green-700 text-white'
                              : 'bg-km-cream-200 text-km-ink border border-km-cream-300'
                          }`}
                        >
                          {product.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3.5">
                      <div>
                        <h3 className="text-lg font-extrabold text-km-ink line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="text-xs font-medium text-km-ink-muted flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-km-green-700" />
                          <span>{product.location?.district || user.district}</span>
                        </p>
                      </div>

                      <div className="bg-km-cream-100 rounded-xl p-3.5 border border-km-cream-300/60 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-semibold text-km-ink-muted block">
                            {isUrdu ? 'قیمت' : 'Price'}
                          </span>
                          <span className="text-base font-extrabold text-km-green-800">
                            PKR {product.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-km-ink-subtle">
                            {' '}
                            / {product.unit}
                          </span>
                        </div>
                        <div className="text-end">
                          <span className="text-[11px] font-semibold text-km-ink-muted block">
                            {isUrdu ? 'دستیاب' : 'Stock'}
                          </span>
                          <span className="text-sm font-extrabold text-km-ink">
                            {product.quantity.toLocaleString()} {product.unit}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-medium text-km-ink-muted">
                        <span>
                          {isUrdu ? 'کم از کم:' : 'Min Order:'} {product.minOrder}{' '}
                          {product.unit}
                        </span>
                        <span>
                          {isUrdu ? 'انکوائریز:' : 'Inquiries:'}{' '}
                          <strong className="text-km-ink">
                            {product.inquiriesCount || 0}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Large Action Buttons */}
                  <div className="p-4 border-t border-km-green-100 bg-km-cream-50 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleStatus(product._id, product.status)
                      }
                      disabled={isActionRunning}
                      className="px-3.5 py-2 rounded-xl border border-km-green-300 bg-white hover:bg-km-green-50 text-xs font-bold text-km-green-800 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {product.status === 'active' ? (
                        <>
                          <PauseCircle className="w-4 h-4 text-km-green-700" />
                          <span>{isUrdu ? 'روکیں' : 'Pause'}</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4 text-km-green-700" />
                          <span>{isUrdu ? 'فعال کریں' : 'Activate'}</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/farmer/edit/${product._id}`}
                        aria-label="Edit listing"
                        title="Edit Details"
                        className="p-2.5 rounded-xl border border-km-green-200 bg-white hover:bg-km-green-50 text-km-green-800 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/marketplace/products/${product.slug || product._id}`}
                        aria-label="View in marketplace"
                        title="View in Marketplace"
                        className="p-2.5 rounded-xl border border-km-green-200 bg-white hover:bg-km-green-50 text-km-green-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={isActionRunning}
                        aria-label="Delete listing"
                        title="Delete Listing"
                        className="p-2.5 rounded-xl border border-km-cream-300 bg-white hover:bg-km-cream-200 text-km-ink transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Farm Profile Modal */}
      {showProfileModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="farm-profile-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-km-green-900/50 backdrop-blur-sm"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-km-lg border-2 border-km-green-300 space-y-6">
            <div className="flex items-center justify-between border-b border-km-green-100 pb-4">
              <div>
                <h2
                  id="farm-profile-title"
                  className="text-xl font-extrabold text-km-ink"
                >
                  {isUrdu ? 'فارم کی معلومات' : 'Farm Information & Profile'}
                </h2>
                <p className="text-xs text-km-ink-muted mt-0.5">
                  {isUrdu
                    ? 'خریداروں کا اعتماد بڑھانے کے لیے اپنے فارم کی تفصیلات مکمل کریں۔'
                    : 'Complete your farm details to build credibility with commercial buyers.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                aria-label="Close modal"
                className="p-2 rounded-xl hover:bg-km-cream-100 text-km-ink-muted hover:text-km-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileSuccess && (
              <div className="p-3.5 bg-km-green-50 border border-km-green-300 text-km-green-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-km-green-700 flex-shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}
            {profileError && (
              <div
                role="alert"
                className="p-3.5 bg-km-cream-200 border border-km-ink/30 text-km-ink text-xs font-bold rounded-xl flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-km-ink flex-shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-km-ink mb-1.5">
                    {isUrdu ? 'فارم کا رقبہ (ایکڑ)' : 'Farm Size (Acres)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={farmData.farmSizeAcres || ''}
                    onChange={(e) =>
                      setFarmData({
                        ...farmData,
                        farmSizeAcres: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="e.g. 15"
                    className="km-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-km-ink mb-1.5">
                    {isUrdu ? 'کاشتکاری کا تجربہ (سال)' : 'Experience (Years)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={farmData.experienceYears || ''}
                    onChange={(e) =>
                      setFarmData({
                        ...farmData,
                        experienceYears: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="e.g. 10"
                    className="km-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-km-ink mb-1.5">
                  {isUrdu ? 'بنیادی فصلیں' : 'Primary Crops Cultivated'}
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
                  className="km-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-km-ink mb-1.5">
                  {isUrdu ? 'شناختی کارڈ نمبر (CNIC)' : 'CNIC Number'}
                </label>
                <input
                  type="text"
                  value={farmData.cnic || ''}
                  onChange={(e) =>
                    setFarmData({ ...farmData, cnic: e.target.value })
                  }
                  placeholder="e.g. 35201-1234567-1"
                  className="km-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-km-ink mb-1.5">
                  {isUrdu ? 'فارم کا پتہ / گاؤں' : 'Farm Address / Village'}
                </label>
                <textarea
                  rows={2}
                  value={farmData.farmAddress || ''}
                  onChange={(e) =>
                    setFarmData({ ...farmData, farmAddress: e.target.value })
                  }
                  placeholder="Detailed address of your agricultural land"
                  className="km-input"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-km-green-100">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="km-btn-outline py-2.5"
                >
                  {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="km-btn-primary py-2.5"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {profileSaving
                      ? isUrdu
                        ? 'محفوظ ہو رہا ہے...'
                        : 'Saving...'
                      : isUrdu
                      ? 'محفوظ کریں'
                      : 'Save Profile'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
