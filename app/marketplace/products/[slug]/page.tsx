'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Send,
  AlertCircle,
  User,
  Share2,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { API_BASE, resolveImageUrl } from '@/lib/api';
import { getCategoryFallbackImage } from '@/components/ui/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Inquiry / Offer form state
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [requestedQuantity, setRequestedQuantity] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/marketplace/products/${slug}`);
      const data = await res.json();
      if (data.success && data.data) {
        setProduct(data.data);
      } else {
        setError(data.error?.message || 'Product listing not found.');
      }
    } catch {
      setError('Failed to retrieve product details from marketplace server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!buyerName.trim() || !buyerPhone.trim()) {
      setInquiryError('Please provide your name and phone number.');
      return;
    }

    try {
      setSubmittingInquiry(true);
      setInquiryError('');

      const res = await fetch(
        `${API_BASE}/marketplace/products/${product._id}/inquiry`,
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
        setInquiryError(data.error?.message || 'Failed to submit inquiry.');
      }
    } catch {
      setInquiryError('Network error while submitting inquiry.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="km-container py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[16/10] bg-km-cream-200 rounded-3xl" />
          <div className="h-44 bg-white rounded-3xl border border-km-green-100" />
        </div>
        <div className="lg:col-span-5">
          <div className="h-[440px] bg-white rounded-3xl border border-km-green-200" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="km-container max-w-2xl py-16 text-center">
        <div className="bg-white border-2 border-dashed border-km-green-300 rounded-3xl p-10 space-y-4">
          <AlertCircle className="w-12 h-12 text-km-green-700 mx-auto" />
          <h1 className="text-2xl font-extrabold text-km-ink">
            Produce Listing Not Found
          </h1>
          <p className="text-sm text-km-ink-muted">
            {error ||
              'This listing may have expired or been paused by the farmer.'}
          </p>
          <Link href="/marketplace" className="km-btn-primary">
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>Return to Marketplace</span>
          </Link>
        </div>
      </div>
    );
  }

  const fallbackImg = getCategoryFallbackImage(product.category);
  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) => resolveImageUrl(img))
      : [fallbackImg];

  return (
    <div className="km-container py-8 sm:py-10 space-y-6">
      {/* Breadcrumb & Share */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-km-ink-muted">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          <Link
            href="/marketplace"
            className="hover:text-km-green-800 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>Marketplace</span>
          </Link>
          <span>/</span>
          <Link
            href={`/marketplace/${product.category.toLowerCase()}`}
            className="hover:text-km-green-800"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-km-ink truncate max-w-[200px]">
            {product.title}
          </span>
        </nav>

        <button
          type="button"
          onClick={handleCopyShare}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-km-green-200 bg-white hover:bg-km-green-50 text-km-green-800 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Link Copied' : 'Share Listing'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery + Specs + Grower Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Gallery Image */}
          <div className="relative aspect-[16/10] bg-km-cream-200 rounded-3xl overflow-hidden border-2 border-white shadow-km-md">
            <Image
              src={images[selectedImageIndex] || fallbackImg}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
            <div className="absolute top-4 start-4">
              <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-km-green-800 shadow-km-sm">
                {product.category}
              </span>
            </div>
            <div className="absolute top-4 end-4">
              <span className="px-3 py-1.5 bg-km-green-700 rounded-full text-xs font-extrabold text-white shadow-km-sm">
                Active Stock
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`View photo ${index + 1}`}
                  className={`relative w-24 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === index
                      ? 'border-km-green-700 shadow-km-sm'
                      : 'border-km-green-200/70 opacity-75 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} view ${index + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Overview & Specifications */}
          <div className="km-card p-6 sm:p-8 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-km-ink">
                {product.title}
              </h1>
              <p className="text-sm sm:text-base text-km-ink-muted mt-3 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="border-t border-km-green-100 pt-6">
              <h2 className="text-xs font-extrabold text-km-ink-muted uppercase tracking-wider mb-4">
                Specifications & Fulfillment
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-km-cream-100 p-4 rounded-2xl border border-km-cream-300/70">
                  <span className="text-xs font-semibold text-km-ink-muted block">
                    Available Volume
                  </span>
                  <span className="text-lg font-extrabold text-km-ink">
                    {product.quantity.toLocaleString()} {product.unit}
                  </span>
                </div>
                <div className="bg-km-cream-100 p-4 rounded-2xl border border-km-cream-300/70">
                  <span className="text-xs font-semibold text-km-ink-muted block">
                    Minimum Order
                  </span>
                  <span className="text-lg font-extrabold text-km-ink">
                    {product.minOrder} {product.unit}
                  </span>
                </div>
                <div className="bg-km-cream-100 p-4 rounded-2xl border border-km-cream-300/70">
                  <span className="text-xs font-semibold text-km-ink-muted block">
                    Dispatch District
                  </span>
                  <span className="text-lg font-extrabold text-km-ink">
                    {product.location?.district}
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Grower Profile */}
            <div className="border-t border-km-green-100 pt-6">
              <h2 className="text-xs font-extrabold text-km-ink-muted uppercase tracking-wider mb-4">
                Verified Grower & Farm Details
              </h2>
              <div className="bg-km-green-50/70 border border-km-green-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-km-green-700 text-white flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-km-ink">
                        {product.farmer?.name || 'Verified Farmer'}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-km-green-700" />
                    </div>
                    <p className="text-xs font-medium text-km-ink-muted">
                      Registered Grower in{' '}
                      {product.farmer?.district || product.location?.district}{' '}
                      District
                    </p>
                  </div>
                </div>

                {product.farmer?.farmerProfile?.farmSizeAcres ? (
                  <div className="text-xs text-km-ink-muted space-y-1">
                    <div>
                      Farm Size:{' '}
                      <strong className="text-km-ink">
                        {product.farmer.farmerProfile.farmSizeAcres} Acres
                      </strong>
                    </div>
                    {product.farmer.farmerProfile.experienceYears ? (
                      <div>
                        Experience:{' '}
                        <strong className="text-km-ink">
                          {product.farmer.farmerProfile.experienceYears} Years
                        </strong>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Bid / Inquiry Card */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-white border-2 border-km-green-300 rounded-3xl p-6 sm:p-8 shadow-km-md space-y-6">
            <div>
              <span className="text-xs font-extrabold text-km-green-700 uppercase tracking-wider block">
                Direct Farm-Gate Asking Price
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-km-ink">
                  PKR {product.price.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-km-ink-muted">
                  / {product.unit}
                </span>
              </div>
              <p className="text-xs font-medium text-km-ink-muted mt-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-km-green-700" />
                <span>
                  Loading Point: {product.location?.district} District
                </span>
              </p>
            </div>

            {/* Direct Phone Reveal */}
            {phoneRevealed ? (
              <div className="p-4 bg-km-green-50 border border-km-green-300 rounded-2xl text-center space-y-1">
                <span className="text-xs text-km-green-800 font-bold uppercase">
                  Farmer Direct Contact
                </span>
                <a
                  href={`tel:${product.farmer?.phone}`}
                  className="block text-2xl font-extrabold text-km-ink hover:text-km-green-700"
                >
                  {product.farmer?.phone || '0300-XXXXXXX'}
                </a>
                <p className="text-[11px] text-km-ink-muted">
                  Mention KissanMandi for direct zero-commission pricing.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPhoneRevealed(true)}
                className="w-full km-btn-light py-3.5 text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Reveal Farmer Phone Number</span>
              </button>
            )}

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-km-green-100" />
              <span className="flex-shrink mx-3 text-[11px] font-bold text-km-ink-subtle uppercase tracking-wider">
                Submit Bid / Procurement Inquiry
              </span>
              <div className="flex-grow border-t border-km-green-100" />
            </div>

            {inquirySuccess ? (
              <div className="p-5 bg-km-green-50 border border-km-green-300 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-km-green-700 mx-auto" />
                <h3 className="text-base font-extrabold text-km-ink">
                  Inquiry & Offer Dispatched
                </h3>
                <p className="text-xs text-km-ink-muted">
                  Your request has been sent to {product.farmer?.name}. You can
                  also call the farmer directly using the contact revealed above.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                {inquiryError && (
                  <div
                    role="alert"
                    className="p-3 bg-km-cream-200 border border-km-ink/30 text-km-ink text-xs font-bold rounded-xl flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{inquiryError}</span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="inq-name"
                    className="block text-xs font-bold text-km-ink mb-1.5"
                  >
                    Your Name / Business *
                  </label>
                  <input
                    id="inq-name"
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Al-Rehman Wholesale Traders"
                    className="km-input py-2.5 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="inq-phone"
                      className="block text-xs font-bold text-km-ink mb-1.5"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="inq-phone"
                      type="tel"
                      required
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="03001234567"
                      className="km-input py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="inq-qty"
                      className="block text-xs font-bold text-km-ink mb-1.5"
                    >
                      Quantity ({product.unit})
                    </label>
                    <input
                      id="inq-qty"
                      type="number"
                      min={product.minOrder}
                      value={requestedQuantity}
                      onChange={(e) => setRequestedQuantity(e.target.value)}
                      placeholder={`Min ${product.minOrder}`}
                      className="km-input py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="inq-msg"
                    className="block text-xs font-bold text-km-ink mb-1.5"
                  >
                    Offer Price / Delivery Notes
                  </label>
                  <textarea
                    id="inq-msg"
                    rows={2}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Enter your proposed bid rate, pickup schedule, or delivery city..."
                    className="km-input text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingInquiry}
                  className="w-full km-btn-primary py-3.5 text-sm shadow-km-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {submittingInquiry
                      ? 'Submitting Offer...'
                      : 'Submit Bid / Inquiry'}
                  </span>
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-km-green-100 text-xs text-km-ink-muted space-y-1.5">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-km-green-700 flex-shrink-0" />
                <span>0% middleman commission for both parties.</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-km-green-700 flex-shrink-0" />
                <span>Direct inspection & Cash on Delivery settlement.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
