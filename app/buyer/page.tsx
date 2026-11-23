'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Search,
  MapPin,
  Store,
  Package,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { API_BASE } from '@/lib/api';
import ProductCard from '@/components/ui/ProductCard';
import SkeletonCard from '@/components/ui/SkeletonCard';

const PAKISTAN_DISTRICTS = [
  'All Locations',
  'Mardan',
  'Lahore',
  'Faisalabad',
  'Multan',
  'Rawalpindi',
  'Gujranwala',
  'Sargodha',
  'Bahawalpur',
  'Peshawar',
  'Hyderabad',
];

export default function BuyerDashboard() {
  const { user, loading } = useAuth();
  const { t, locale } = useLanguage();
  const isUrdu = locale === 'ur';
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('All Locations');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'buyer')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const fetchMarketplaceProducts = async () => {
    try {
      setFetching(true);
      setError('');
      const params = new URLSearchParams();
      if (district !== 'All Locations') params.append('district', district);
      if (search.trim()) params.append('search', search.trim());
      params.append('sort', sortBy);
      params.append('limit', '12');

      const res = await fetch(`${API_BASE}/marketplace?${params.toString()}`);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      if (data.success && data.data?.products) {
        setProducts(data.data.products);
      }
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Could not fetch live produce listings.'
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMarketplaceProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMarketplaceProducts();
  };

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-9 h-9 border-4 border-km-green-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="km-container py-8 sm:py-10 space-y-8">
      {/* Buyer Welcome Header */}
      <div className="bg-white rounded-3xl border-2 border-km-green-300 shadow-km-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-km-ink">
              {t('welcomeBuyer')}, {user.name}
            </h1>
            <span className="km-badge">
              {isUrdu ? 'تصدیق شدہ خریدار' : 'Verified Buyer'}
            </span>
          </div>
          <p className="text-sm sm:text-base text-km-ink-muted flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-km-green-700" />
            <span>
              {user.district} {isUrdu ? 'ضلع' : 'District'} —{' '}
              {isUrdu
                ? 'کسانوں سے براہِ راست تازہ فصلیں خریدیں'
                : 'Source verified harvests directly from growers'}
            </span>
          </p>
        </div>

        <Link href="/marketplace" className="km-btn-primary px-6 py-3.5 text-sm">
          <Store className="w-4 h-4" />
          <span>{isUrdu ? 'مکمل مارکیٹ پلیس کھولیں' : 'Open Full Marketplace'}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>

      {/* Quick Search & Filter Bar */}
      <div className="km-card p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-km-ink-subtle absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isUrdu
                  ? 'فصل تلاش کریں (مثلاً ٹماٹر، گندم، آم)...'
                  : 'Search produce (e.g. Tomatoes, Wheat, Mangoes)...'
              }
              className="km-input ps-10 py-2.5 text-sm"
            />
          </div>
          <button type="submit" className="km-btn-primary py-2.5 px-5 text-sm">
            {isUrdu ? 'تلاش' : 'Search'}
          </button>
        </form>

        <div className="flex items-center gap-2">
          <select
            aria-label="Filter by district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="km-input py-2.5 text-xs font-bold w-auto"
          >
            {PAKISTAN_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            aria-label="Sort listings"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="km-input py-2.5 text-xs font-bold w-auto"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="qty_desc">Highest Volume</option>
          </select>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="bg-km-cream-200 border border-km-ink/30 rounded-2xl p-5 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 text-sm font-bold text-km-ink">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchMarketplaceProducts}
            className="km-btn-primary py-2 px-4 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Results Header & Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-km-ink">
          {t('browseProduce')} ({products.length})
        </h2>

        {fetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-km-green-300 p-12 text-center space-y-3">
            <Package className="w-12 h-12 text-km-green-700 mx-auto" />
            <h3 className="text-lg font-extrabold text-km-ink">
              {isUrdu
                ? 'کوئی فعال فصل موجود نہیں'
                : 'No active listings match your search'}
            </h3>
            <p className="text-sm text-km-ink-muted">
              {isUrdu
                ? 'دوسرا ضلع منتخب کریں یا تمام فصلیں دیکھیں۔'
                : 'Try clearing your search or selecting All Locations.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isUrdu={isUrdu}
                ctaLabel={isUrdu ? 'بولی لگائیں' : 'Place Bid'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
