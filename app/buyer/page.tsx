'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Search,
  MapPin,
  Package,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Phone,
  Send,
  X,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { API_BASE, resolveImageUrl } from '@/lib/api';
import { getCategoryFallbackImage } from '@/components/ui/ProductCard';
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
  const [category, setCategory] = useState('All');
  const [district, setDistrict] = useState('All Locations');
  const [sortBy, setSortBy] = useState('newest');

  // Self-contained In-Dashboard Product Inspection & Bid Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [requestedQuantity, setRequestedQuantity] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

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
      if (category !== 'All') params.append('category', category);
      if (district !== 'All Locations') params.append('district', district);
      if (search.trim()) params.append('search', search.trim());
      params.append('sort', sortBy);
      params.append('limit', '18');

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
  }, [category, district, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMarketplaceProducts();
  };

  const openBidModal = (product: Product) => {
    setSelectedProduct(product);
    setPhoneRevealed(false);
    setBuyerName(user?.name || '');
    setBuyerPhone(user?.phone || '');
    setRequestedQuantity(product.minOrder?.toString() || '');
    setInquiryMessage('');
    setInquirySuccess(false);
    setInquiryError('');
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (!buyerName.trim() || !buyerPhone.trim()) {
      setInquiryError('Please provide your name and phone number.');
      return;
    }

    try {
      setSubmittingInquiry(true);
      setInquiryError('');

      const res = await fetch(
        `${API_BASE}/marketplace/products/${selectedProduct._id}/inquiry`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: buyerName.trim(),
            phone: buyerPhone.trim(),
            requestedQuantity: requestedQuantity
              ? Number(requestedQuantity)
              : undefined,
            message: inquiryMessage.trim(),
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setInquirySuccess(true);
        setPhoneRevealed(true);
      } else {
        setInquiryError(data.error?.message || 'Failed to submit offer.');
      }
    } catch {
      setInquiryError('Network error while submitting offer.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-9 h-9 border-4 border-km-green-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="km-container py-8 sm:py-10 space-y-6">
      {/* Buyer Dashboard Header */}
      <div className="bg-white rounded-3xl border-2 border-km-green-300 shadow-km-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-km-ink">
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
                ? 'کسانوں سے براہِ راست تازہ فصلیں خریدیں اور بولی لگائیں'
                : 'Inspect verified harvests and place direct bids inside your workspace'}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMarketplaceProducts}
          className="km-btn-outline self-start md:self-auto py-2.5 px-4 text-xs"
        >
          <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
          <span>{isUrdu ? 'ریفریش' : 'Refresh Feed'}</span>
        </button>
      </div>

      {/* Category Filter Pills + Search & Sort Toolbar */}
      <div className="km-card p-5 space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <SlidersHorizontal className="w-4 h-4 text-km-green-700 flex-shrink-0 me-1" />
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-km-green-700 text-white shadow-km-sm'
                  : 'bg-km-cream-100 text-km-ink-muted hover:text-km-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
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
      </div>

      {/* Error State */}
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

      {/* Listings Grid */}
      <div className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-km-ink">
          {t('browseProduce')} ({products.length})
        </h2>

        {fetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-km-green-300 p-12 text-center space-y-3">
            <Package className="w-12 h-12 text-km-green-700 mx-auto" />
            <h3 className="font-heading text-lg font-bold text-km-ink">
              {isUrdu
                ? 'کوئی فعال فصل موجود نہیں'
                : 'No active listings match your filters'}
            </h3>
            <p className="text-sm text-km-ink-muted">
              {isUrdu
                ? 'دوسرا ضلع منتخب کریں یا فلٹرز صاف کریں۔'
                : 'Try selecting All Categories or All Locations.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const fallback = getCategoryFallbackImage(product.category);
              const imgSrc = product.images?.[0]
                ? resolveImageUrl(product.images[0])
                : fallback;

              return (
                <article
                  key={product._id}
                  className="bg-white rounded-2xl border border-km-green-200/80 shadow-km-sm hover:shadow-km-md hover:border-km-green-400 transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full bg-km-cream-200 overflow-hidden">
                      <Image
                        src={imgSrc}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute top-3 start-3">
                        <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-km-green-800 text-xs font-bold shadow-km-sm">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3.5">
                      <div>
                        <h3 className="font-heading text-h3 text-km-ink line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="text-caption text-km-ink-muted flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-km-green-600" />
                          <span>{product.location?.district} District</span>
                        </p>
                      </div>

                      <div className="bg-km-cream-100 rounded-xl p-3.5 border border-km-cream-300/60 flex items-center justify-between">
                        <div>
                          <span className="text-[13px] font-medium text-km-ink-muted block">
                            {isUrdu ? 'قیمت' : 'Direct Price'}
                          </span>
                          <span className="km-price text-xl">
                            PKR {product.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-km-ink-subtle">
                            {' '}
                            / {product.unit}
                          </span>
                        </div>
                        <div className="text-end">
                          <span className="text-[13px] font-medium text-km-ink-muted block">
                            {isUrdu ? 'مقدار' : 'Volume'}
                          </span>
                          <span className="text-sm font-semibold text-km-ink tabular-nums">
                            {product.quantity.toLocaleString()} {product.unit}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[13px] text-km-ink-muted">
                        <span>
                          Min: <strong className="text-km-ink">{product.minOrder} {product.unit}</strong>
                        </span>
                        <span className="inline-flex items-center gap-1 text-km-green-800 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-km-green-600" />
                          <span>{product.farmer?.name || 'Verified Farmer'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <button
                      type="button"
                      onClick={() => openBidModal(product)}
                      className="w-full km-btn-primary py-2.5 text-sm"
                    >
                      {isUrdu ? 'تفصیل اور بولی لگائیں' : 'Inspect & Place Bid'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Self-Contained In-Dashboard Bid & Inspection Modal */}
      {selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="buyer-bid-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-km-green-900/50 backdrop-blur-sm overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-km-lg border-2 border-km-green-300 space-y-6 my-8">
            <div className="flex items-start justify-between gap-4 border-b border-km-green-100 pb-4">
              <div>
                <span className="km-badge mb-1.5">{selectedProduct.category}</span>
                <h2
                  id="buyer-bid-modal-title"
                  className="font-heading text-2xl font-extrabold text-km-ink"
                >
                  {selectedProduct.title}
                </h2>
                <p className="text-xs font-medium text-km-ink-muted flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-km-green-700" />
                  <span>
                    {selectedProduct.location?.district} District • Farmer:{' '}
                    {selectedProduct.farmer?.name || 'Verified Grower'}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                aria-label="Close modal"
                className="p-2 rounded-xl hover:bg-km-cream-100 text-km-ink-muted hover:text-km-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
              <div className="space-y-3">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-km-cream-200 border border-km-green-200">
                  <Image
                    src={
                      selectedProduct.images?.[0]
                        ? resolveImageUrl(selectedProduct.images[0])
                        : getCategoryFallbackImage(selectedProduct.category)
                    }
                    alt={selectedProduct.title}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-km-ink-muted leading-relaxed">
                  {selectedProduct.description}
                </p>
                <div className="bg-km-cream-100 p-3.5 rounded-2xl border border-km-cream-300 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-km-ink-muted">Asking Price:</span>
                    <span className="font-heading font-extrabold text-km-green-800">
                      PKR {selectedProduct.price.toLocaleString()} / {selectedProduct.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-km-ink-muted">Available Stock:</span>
                    <span className="font-bold text-km-ink">
                      {selectedProduct.quantity.toLocaleString()} {selectedProduct.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-km-ink-muted">Min Order:</span>
                    <span className="font-bold text-km-ink">
                      {selectedProduct.minOrder} {selectedProduct.unit}
                    </span>
                  </div>
                </div>

                {phoneRevealed ? (
                  <div className="p-3.5 bg-km-green-50 border border-km-green-300 rounded-2xl text-center">
                    <span className="text-[11px] font-bold uppercase text-km-green-800 block">
                      Farmer Direct Phone
                    </span>
                    <a
                      href={`tel:${selectedProduct.farmer?.phone}`}
                      className="font-heading text-lg font-extrabold text-km-ink hover:text-km-green-700"
                    >
                      {selectedProduct.farmer?.phone || '0300-XXXXXXX'}
                    </a>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPhoneRevealed(true)}
                    className="w-full km-btn-light py-2.5 text-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Reveal Farmer Phone Number</span>
                  </button>
                )}
              </div>

              {/* Direct Bid / Offer Form */}
              <div>
                {inquirySuccess ? (
                  <div className="p-6 bg-km-green-50 border border-km-green-300 rounded-2xl text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-km-green-700 mx-auto" />
                    <h3 className="font-heading text-lg font-bold text-km-ink">
                      Bid & Inquiry Sent
                    </h3>
                    <p className="text-xs text-km-ink-muted">
                      Your offer has been logged for {selectedProduct.farmer?.name}. You can also call them directly via the phone number shown.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-km-green-800">
                      <ShieldCheck className="w-4 h-4 text-km-green-700" />
                      <span>Submit Direct Offer (0% Commission)</span>
                    </div>

                    {inquiryError && (
                      <div
                        role="alert"
                        className="p-3 bg-km-cream-200 border border-km-ink/30 text-km-ink text-xs font-bold rounded-xl"
                      >
                        {inquiryError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-km-ink mb-1">
                        Your Name / Company *
                      </label>
                      <input
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="km-input py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-km-ink mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="km-input py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-km-ink mb-1">
                        Required Quantity ({selectedProduct.unit})
                      </label>
                      <input
                        type="number"
                        min={selectedProduct.minOrder}
                        value={requestedQuantity}
                        onChange={(e) => setRequestedQuantity(e.target.value)}
                        className="km-input py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-km-ink mb-1">
                        Offer Price / Notes
                      </label>
                      <textarea
                        rows={2}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder="Proposed rate per unit & pickup schedule..."
                        className="km-input text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingInquiry}
                      className="w-full km-btn-primary py-3 text-sm"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {submittingInquiry ? 'Sending...' : 'Send Bid / Offer'}
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
