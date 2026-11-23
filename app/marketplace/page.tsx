'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  Filter,
  X,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { API_BASE } from '@/lib/api';
import ProductCard from '@/components/ui/ProductCard';
import SkeletonCard from '@/components/ui/SkeletonCard';

const PRODUCT_CATEGORIES = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains',
  'Pulses',
  'Oilseeds',
  'Cotton',
  'Sugarcane',
  'Other',
];

const PAKISTAN_DISTRICTS = [
  'All Locations',
  'Mardan',
  'Lahore',
  'Faisalabad',
  'Rawalpindi',
  'Multan',
  'Gujranwala',
  'Sargodha',
  'Bahawalpur',
  'Sahiwal',
  'Sheikhupura',
  'Jhang',
  'Rahim Yar Khan',
  'Kasur',
  'Okara',
  'Peshawar',
  'Swat',
  'Charsadda',
  'Hyderabad',
  'Sukkur',
  'Quetta',
];

function MarketplaceContent({
  initialCategory,
}: {
  initialCategory?: string;
}) {
  const searchParams = useSearchParams();
  const { locale } = useLanguage();
  const isUrdu = locale === 'ur';

  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<
    Array<{ name: string; slug: string; activeCount: number }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || searchParams?.get('category') || 'All'
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams?.get('search') || ''
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    searchParams?.get('district') || 'All Locations'
  );
  const [minPrice, setMinPrice] = useState(searchParams?.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams?.get('maxPrice') || '');
  const [minQuantity, setMinQuantity] = useState(
    searchParams?.get('minQuantity') || ''
  );
  const [sortBy, setSortBy] = useState(searchParams?.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams?.get('page')) || 1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/marketplace/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategoriesWithCounts(data.data);
        }
      })
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setFetchError('');
      const params = new URLSearchParams();

      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (selectedDistrict && selectedDistrict !== 'All Locations') {
        params.append('district', selectedDistrict);
      }
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      if (minPrice) {
        params.append('minPrice', minPrice);
      }
      if (maxPrice) {
        params.append('maxPrice', maxPrice);
      }
      if (minQuantity) {
        params.append('minQuantity', minQuantity);
      }
      if (sortBy) {
        params.append('sort', sortBy);
      }
      params.append('page', page.toString());
      params.append('limit', '12');

      const res = await fetch(`${API_BASE}/marketplace?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Marketplace request failed (${res.status})`);
      }
      const data = await res.json();

      if (data.success && data.data) {
        setProducts(data.data.products || []);
        if (data.data.pagination) {
          setPagination(data.data.pagination);
        }
      } else {
        throw new Error(data.error?.message || 'Unable to load listings.');
      }
    } catch (err: unknown) {
      console.error('Failed to load products:', err);
      setFetchError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to the marketplace right now.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCategory,
    selectedDistrict,
    minPrice,
    maxPrice,
    minQuantity,
    sortBy,
    page,
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedDistrict('All Locations');
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setMinQuantity('');
    setSortBy('newest');
    setPage(1);
  };

  const getCategoryCount = (categoryName: string) => {
    if (categoryName === 'All') return null;
    const found = categoriesWithCounts.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    return found ? found.activeCount : null;
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedDistrict !== 'All Locations' ||
    Boolean(searchTerm.trim()) ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    Boolean(minQuantity);

  const filterSidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-km-green-100 pb-3">
        <div className="flex items-center gap-2 text-sm font-extrabold text-km-ink">
          <SlidersHorizontal className="w-4 h-4 text-km-green-700" />
          <span>{isUrdu ? 'فلٹرز' : 'Filters'}</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-bold text-km-green-700 hover:underline"
          >
            {isUrdu ? 'صاف کریں' : 'Reset all'}
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <span className="block text-xs font-extrabold text-km-ink-muted uppercase tracking-wider">
          {isUrdu ? 'فصل کی قسم' : 'Crop Category'}
        </span>
        <div className="flex flex-col gap-1">
          {PRODUCT_CATEGORIES.map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === cat.toLowerCase();
            const count = getCategoryCount(cat);

            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isSelected
                    ? 'bg-km-green-700 text-white font-bold shadow-km-sm'
                    : 'text-km-ink-muted hover:bg-km-cream-100 hover:text-km-ink'
                }`}
              >
                <span>{cat}</span>
                {count !== null && count > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-km-green-100 text-km-green-800'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* District / Location */}
      <div className="space-y-2">
        <label
          htmlFor="filter-district"
          className="block text-xs font-extrabold text-km-ink-muted uppercase tracking-wider"
        >
          {isUrdu ? 'ضلع / مقام' : 'District / Location'}
        </label>
        <select
          id="filter-district"
          value={selectedDistrict}
          onChange={(e) => {
            setSelectedDistrict(e.target.value);
            setPage(1);
          }}
          className="km-input py-2.5 text-sm"
        >
          {PAKISTAN_DISTRICTS.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <span className="block text-xs font-extrabold text-km-ink-muted uppercase tracking-wider">
          {isUrdu ? 'قیمت کی حد (PKR)' : 'Price Range (PKR)'}
        </span>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            aria-label="Minimum price"
            placeholder={isUrdu ? 'کم از کم' : 'Min'}
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
            className="km-input py-2.5 text-sm"
          />
          <input
            type="number"
            min="0"
            aria-label="Maximum price"
            placeholder={isUrdu ? 'زیادہ سے زیادہ' : 'Max'}
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
            className="km-input py-2.5 text-sm"
          />
        </div>
      </div>

      {/* Min Quantity */}
      <div className="space-y-2">
        <label
          htmlFor="filter-min-qty"
          className="block text-xs font-extrabold text-km-ink-muted uppercase tracking-wider"
        >
          {isUrdu ? 'کم از کم دستیاب مقدار' : 'Min Available Volume'}
        </label>
        <input
          id="filter-min-qty"
          type="number"
          min="0"
          placeholder="e.g. 500"
          value={minQuantity}
          onChange={(e) => {
            setMinQuantity(e.target.value);
            setPage(1);
          }}
          className="km-input py-2.5 text-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Top Marketplace Search Header */}
      <section className="bg-gradient-to-b from-km-cream-100 to-white border-b border-km-green-200/70 py-10 sm:py-12">
        <div className="km-container space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="km-badge">
              {isUrdu ? 'براہِ راست زرعی منڈی' : 'Direct Trade Marketplace'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-km-ink tracking-tight">
              {isUrdu
                ? 'تازہ فصلیں اور براہِ راست کسان لسٹنگز'
                : 'Browse Verified Farm Produce'}
            </h1>
            <p className="text-sm sm:text-base text-km-ink-muted">
              {isUrdu
                ? 'پاکستان بھر کے تصدیق شدہ کسانوں سے براہِ راست تازہ فصلیں تلاش کریں اور شفاف بولی لگائیں۔'
                : 'Filter active harvests by district, crop category, and price range. Bid directly with 0% middleman commission.'}
            </p>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-3xl"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-km-ink-subtle absolute start-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label="Search crops or districts"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  isUrdu
                    ? 'فصل کا نام (مثلاً ٹماٹر، گندم، آم) یا ضلع تلاش کریں...'
                    : 'Search by crop name (e.g. Tomatoes, Wheat, Mangoes) or district...'
                }
                className="km-input ps-12 py-3.5 text-sm shadow-km-sm"
              />
            </div>
            <button
              type="submit"
              className="km-btn-primary px-7 py-3.5 text-sm shadow-km-sm"
            >
              {isUrdu ? 'تلاش کریں' : 'Search Produce'}
            </button>
          </form>
        </div>
      </section>

      {/* Main Content: Sidebar + Grid */}
      <section className="km-container py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside
            aria-label="Marketplace filters"
            className="hidden lg:block lg:col-span-3 km-card p-6 sticky top-24"
          >
            {filterSidebarContent}
          </aside>

          {/* Results Column */}
          <div className="lg:col-span-9 space-y-6">
            {/* Toolbar: Count, Mobile Filter Button, Sort */}
            <div className="bg-white rounded-2xl border border-km-green-200/80 p-4 flex flex-wrap items-center justify-between gap-3 shadow-km-sm">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden km-btn-outline py-2 px-3.5 text-xs"
                >
                  <Filter className="w-4 h-4" />
                  <span>{isUrdu ? 'فلٹرز' : 'Filters'}</span>
                </button>
                <p className="text-sm font-semibold text-km-ink-muted">
                  {isUrdu ? 'دکھائے جا رہے ہیں:' : 'Showing'}{' '}
                  <strong className="text-km-ink">{products.length}</strong>{' '}
                  {isUrdu ? 'از' : 'of'}{' '}
                  <strong className="text-km-ink">{pagination.total}</strong>{' '}
                  {isUrdu ? 'فصلیں' : 'listings'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="marketplace-sort"
                  className="text-xs font-bold text-km-ink-muted hidden sm:inline"
                >
                  {isUrdu ? 'ترتیب:' : 'Sort by:'}
                </label>
                <select
                  id="marketplace-sort"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="km-input py-2 px-3 text-xs font-bold w-auto"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="qty_desc">Quantity: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Error State */}
            {fetchError && (
              <div
                role="alert"
                className="bg-km-cream-200 border border-km-ink/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-km-ink flex-shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-sm font-extrabold text-km-ink">
                      Could not load marketplace listings
                    </h2>
                    <p className="text-xs text-km-ink-muted mt-0.5">
                      {fetchError}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fetchProducts}
                  className="km-btn-primary py-2 px-4 text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* Loading Skeletons / Empty / Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-km-green-300 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-km-green-100 text-km-green-800 flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-extrabold text-km-ink">
                  {isUrdu ? 'کوئی فصل نہیں ملی' : 'No produce matches your filters'}
                </h2>
                <p className="text-sm text-km-ink-muted max-w-md mx-auto">
                  {isUrdu
                    ? 'اپنے فلٹرز تبدیل کریں یا تمام فعال فصلیں دیکھنے کے لیے فلٹرز صاف کریں۔'
                    : 'Try adjusting your category, location, or price range to see all active harvests.'}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="km-btn-primary"
                >
                  {isUrdu ? 'تمام فلٹرز صاف کریں' : 'Clear All Filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrevPage}
                  className="km-btn-outline py-2 px-4 text-xs"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                  <span>{isUrdu ? 'پچھلا' : 'Previous'}</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPage(num)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        pagination.page === num
                          ? 'bg-km-green-700 text-white shadow-km-sm'
                          : 'bg-white border border-km-green-200 text-km-ink-muted hover:border-km-green-500'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={!pagination.hasNextPage}
                  className="km-btn-outline py-2 px-4 text-xs"
                >
                  <span>{isUrdu ? 'اگلا' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter listings"
          className="fixed inset-0 z-50 lg:hidden flex justify-end bg-km-green-900/50 backdrop-blur-sm"
        >
          <div className="w-full max-w-xs bg-white h-full overflow-y-auto p-6 shadow-km-lg space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold text-km-ink">
                {isUrdu ? 'فصلیں فلٹر کریں' : 'Filter Produce'}
              </span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="p-2 rounded-xl hover:bg-km-cream-100 text-km-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterSidebarContent}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full km-btn-primary py-3"
            >
              {isUrdu ? 'فلٹرز لاگو کریں' : 'Apply Filters'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MarketplacePage({
  initialCategory,
}: {
  initialCategory?: string;
}) {
  return (
    <Suspense
      fallback={
        <div className="km-container py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      }
    >
      <MarketplaceContent initialCategory={initialCategory} />
    </Suspense>
  );
}
