'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  CheckCircle,
  Phone,
  ShieldCheck,
  Calendar,
  Layers,
  Package,
  Send,
  AlertCircle,
  Building,
  User,
  Share2,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { API_BASE, resolveImageUrl } from '@/lib/api';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Inquiry Form state
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [requestedQuantity, setRequestedQuantity] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/marketplace/products/${slug}`);
      const data = await res.json();
      if (data.success && data.data) {
        setProduct(data.data);
      } else {
        setError(data.error?.message || 'Product listing not found.');
      }
    } catch (err) {
      setError('Failed to retrieve product details from marketplace server.');
    } finally {
      setLoading(false);
    }
  };

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

      const res = await fetch(`${API_BASE}/marketplace/products/${product._id}/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: buyerName.trim(),
          phone: buyerPhone.trim(),
          requestedQuantity: requestedQuantity ? Number(requestedQuantity) : undefined,
          message: inquiryMessage.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInquirySuccess(true);
        setPhoneRevealed(true);
      } else {
        setInquiryError(data.error?.message || 'Failed to submit inquiry.');
      }
    } catch (err) {
      setInquiryError('Network error while submitting inquiry.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#8FD19E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8 space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-black text-[#2B2B2B]">Produce Listing Not Found</h2>
          <p className="text-sm text-gray-500">{error || 'This listing may have expired or been paused by the farmer.'}</p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#8FD19E] text-[#2B2B2B] font-bold rounded-xl text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Marketplace</span>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images.map((img) => resolveImageUrl(img))
    : ['https://placehold.co/800x600/8FD19E/2B2B2B?text=Crop+Photo'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb / Navigation */}
      <div className="flex items-center justify-between text-xs font-bold text-gray-500">
        <div className="flex items-center gap-2">
          <Link href="/marketplace" className="hover:text-[#2B2B2B] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Marketplace</span>
          </Link>
          <span>/</span>
          <Link
            href={`/marketplace/${product.category.toLowerCase()}`}
            className="hover:text-[#2B2B2B]"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#2B2B2B] truncate max-w-[200px]">{product.title}</span>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Listing link copied to clipboard.');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#8FD19E] transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery & Description (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Photo */}
          <div className="relative h-96 sm:h-[450px] bg-gray-100 rounded-3xl overflow-hidden border-2 border-gray-200 shadow-sm">
            <img
              src={images[selectedImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-[#2B2B2B] shadow-sm">
                {product.category}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1.5 bg-[#8FD19E] rounded-full text-xs font-black text-[#2B2B2B] shadow-sm">
                Active Produce
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === index
                      ? 'border-[#8FD19E] shadow-sm scale-105'
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Detailed Product Specs */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#2B2B2B]">Produce Overview</h2>
              <p className="text-sm text-gray-700 mt-3 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                Specifications & Fulfillment
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-[#FAF6EA] p-3.5 rounded-2xl">
                  <span className="text-xs text-gray-500 font-semibold block">Available Volume</span>
                  <span className="text-base font-black text-[#2B2B2B]">
                    {product.quantity.toLocaleString()} {product.unit}
                  </span>
                </div>
                <div className="bg-[#FAF6EA] p-3.5 rounded-2xl">
                  <span className="text-xs text-gray-500 font-semibold block">Minimum Order</span>
                  <span className="text-base font-black text-[#2B2B2B]">
                    {product.minOrder} {product.unit}
                  </span>
                </div>
                <div className="bg-[#FAF6EA] p-3.5 rounded-2xl">
                  <span className="text-xs text-gray-500 font-semibold block">Dispatch District</span>
                  <span className="text-base font-black text-[#2B2B2B]">
                    {product.location?.district}
                  </span>
                </div>
              </div>
            </div>

            {/* Farm & Farmer Information Display */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                Grower & Farm Verification
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#8FD19E] flex items-center justify-center font-black text-[#2B2B2B]">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-[#2B2B2B]">
                        {product.farmer?.name || 'Verified Farmer'}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-[#6DBE82]" />
                    </div>
                    <p className="text-xs text-gray-500">
                      Registered Grower in {product.farmer?.district || product.location?.district} District
                    </p>
                  </div>
                </div>

                {product.farmer?.farmerProfile?.farmSizeAcres ? (
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>
                      Farm Size: <strong>{product.farmer.farmerProfile.farmSizeAcres} Acres</strong>
                    </div>
                    {product.farmer.farmerProfile.experienceYears ? (
                      <div>
                        Experience: <strong>{product.farmer.farmerProfile.experienceYears} Years</strong>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Inquiry Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border-2 border-[#8FD19E] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">
                Direct Farmgate Price
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-[#2B2B2B]">
                  PKR {product.price.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-gray-500">/ {product.unit}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>Loading Point: {product.location?.district} District</span>
              </p>
            </div>

            {/* Direct Phone Reveal */}
            <div className="pt-2">
              {phoneRevealed ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-center space-y-1 animate-in fade-in">
                  <span className="text-xs text-green-700 font-bold uppercase">
                    Farmer Direct Contact
                  </span>
                  <a
                    href={`tel:${product.farmer?.phone}`}
                    className="block text-2xl font-black text-[#2B2B2B] hover:text-[#6DBE82]"
                  >
                    {product.farmer?.phone || '0300-XXXXXXX'}
                  </a>
                  <p className="text-[11px] text-gray-500">
                    Mention KissanMandi when calling for guaranteed direct pricing.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPhoneRevealed(true)}
                  className="w-full py-3.5 rounded-2xl border-2 border-[#8FD19E] bg-[#FAF6EA] hover:bg-[#8FD19E]/20 text-[#2B2B2B] font-black text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Reveal Farmer Contact Number</span>
                </button>
              )}
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-gray-400 uppercase">
                Or Submit Procurement Request
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Inquiry Form */}
            {inquirySuccess ? (
              <div className="p-5 bg-green-50 border border-green-200 rounded-2xl text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                <h4 className="text-base font-black text-green-900">Inquiry Dispatched</h4>
                <p className="text-xs text-green-700">
                  Your purchase interest was recorded and sent to {product.farmer?.name}. You can also call them directly above.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                {inquiryError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-medium rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{inquiryError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                    Your Full Name / Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Commercial Wholesale Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#8FD19E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="03001234567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#8FD19E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                      Required Quantity ({product.unit})
                    </label>
                    <input
                      type="number"
                      min={product.minOrder}
                      value={requestedQuantity}
                      onChange={(e) => setRequestedQuantity(e.target.value)}
                      placeholder={`Min ${product.minOrder}`}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#8FD19E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                    Message / Delivery Terms
                  </label>
                  <textarea
                    rows={2}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Specify delivery destination, quality requirements, or payment terms..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#8FD19E]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingInquiry}
                  className="w-full py-3.5 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submittingInquiry ? 'Sending Inquiry...' : 'Submit Procurement Inquiry'}</span>
                </button>
              </form>
            )}

            <div className="pt-2 text-[11px] text-gray-500 space-y-1">
              <p className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#6DBE82]" />
                <span>Zero commission fee charged to either farmer or buyer.</span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#6DBE82]" />
                <span>Direct on-field or mandi settlement.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
