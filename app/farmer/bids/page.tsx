'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  CheckCircle2,
  ArrowLeft,
  Phone,
  Gavel,
  Award,
  User as UserIcon,
} from 'lucide-react';
import { Listing, Bid } from '@/lib/types';
import { API_BASE } from '@/lib/api';

function FarmerBidsContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listingId');
  const { user, token, loading } = useAuth();
  const { t, locale } = useLanguage();
  const isUrdu = locale === 'ur';
  const router = useRouter();

  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<string>(
    listingId || ''
  );
  const [bids, setBids] = useState<Bid[]>([]);
  const [fetching, setFetching] = useState(false);
  const [acceptedBuyer, setAcceptedBuyer] = useState<{
    name: string;
    phone: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'farmer')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const fetchMyListings = async () => {
    try {
      const res = await fetch(`${API_BASE}/listings/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setMyListings(data.data);
        if (!selectedListingId) {
          setSelectedListingId(data.data[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBids = async (id: string) => {
    try {
      setFetching(true);
      const res = await fetch(`${API_BASE}/listings/${id}/bids`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setBids(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyListings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (listingId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedListingId(listingId);
    }
  }, [listingId]);

  useEffect(() => {
    if (selectedListingId && token) {
      fetchBids(selectedListingId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedListingId, token]);

  const handleAcceptBid = async (bidId: string) => {
    if (
      !confirm(
        isUrdu
          ? 'کیا آپ یہ بولی قبول کرنا چاہتے ہیں؟'
          : 'Do you want to accept this bid?'
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/listings/${selectedListingId}/accept/${bidId}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        setAcceptedBuyer(data.data.buyer);
        alert(t('congratulations'));
        fetchMyListings();
      } else {
        alert(data.message || 'Error accepting bid');
      }
    } catch (err) {
      console.error(err);
      alert('Error accepting bid');
    }
  };

  const activeListing = myListings.find((l) => l._id === selectedListingId);

  return (
    <div className="km-container max-w-4xl py-8 sm:py-10 space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/farmer"
          aria-label="Back to Farmer Portal"
          className="p-3 rounded-xl border border-km-green-200 bg-white hover:bg-km-green-50 text-km-green-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-km-ink">
            {t('bidsReceived')}
          </h1>
          <p className="text-sm text-km-ink-muted">
            {isUrdu
              ? 'اپنی فصل پر موصول ہونے والی بولیاں دیکھیں اور بہترین قیمت قبول کریں۔'
              : 'Review incoming buyer bids and accept the highest offer directly.'}
          </p>
        </div>
      </div>

      {/* Listing Selector */}
      {myListings.length > 0 && (
        <div className="km-card p-5 sm:p-6 space-y-2.5 border-2 border-km-green-300">
          <label
            htmlFor="bid-listing-select"
            className="block text-base font-extrabold text-km-ink"
          >
            {isUrdu ? 'فصل کا انتخاب کریں' : 'Select Produce Listing'}
          </label>
          <select
            id="bid-listing-select"
            value={selectedListingId}
            onChange={(e) => setSelectedListingId(e.target.value)}
            className="km-input py-3.5 text-base font-bold bg-km-cream-100"
          >
            {myListings.map((l) => (
              <option key={l._id} value={l._id}>
                {t(`crops.${l.crop}`) || l.crop} — {l.quantity} {t(l.unit)} (Base: PKR{' '}
                {l.basePrice})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Accepted Buyer Contact Card */}
      {acceptedBuyer && (
        <div className="bg-km-green-50 border-2 border-km-green-400 p-6 sm:p-8 rounded-3xl text-center space-y-4 shadow-km-sm">
          <div className="w-14 h-14 rounded-2xl bg-km-green-700 text-white flex items-center justify-center mx-auto">
            <Award className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-km-ink">
            {t('congratulations')}
          </h2>
          <p className="text-base font-medium text-km-ink-muted">
            {t('contactBuyer')}
          </p>
          <div className="bg-white p-5 rounded-2xl inline-block text-start border border-km-green-200 shadow-km-sm space-y-1.5">
            <p className="text-lg font-extrabold text-km-ink flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-km-green-700" />
              <span>{acceptedBuyer.name}</span>
            </p>
            <a
              href={`tel:${acceptedBuyer.phone}`}
              className="text-2xl font-extrabold text-km-green-800 hover:underline flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              <span>{acceptedBuyer.phone}</span>
            </a>
          </div>
        </div>
      )}

      {/* Bids List */}
      <div className="km-card p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-km-green-100 pb-4">
          <h2 className="text-xl font-extrabold text-km-ink flex items-center gap-2">
            <Gavel className="w-5 h-5 text-km-green-700" />
            <span>
              {t('bidsReceived')} {bids.length > 0 ? `(${bids.length})` : ''}
            </span>
          </h2>
        </div>

        {fetching ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-km-green-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bids.length === 0 ? (
          <div className="py-12 text-center bg-km-cream-100 rounded-2xl border border-dashed border-km-green-300 space-y-2 p-6">
            <Gavel className="w-10 h-10 text-km-green-700 mx-auto" />
            <p className="text-base font-bold text-km-ink">
              {isUrdu
                ? 'اس فصل پر ابھی کوئی بولی موصول نہیں ہوئی۔'
                : 'No bids received for this listing yet.'}
            </p>
            <p className="text-sm text-km-ink-muted">
              {isUrdu
                ? 'خریداروں کی بولیاں یہاں خودکار طور پر ظاہر ہوں گی۔'
                : 'Verified buyer offers will appear here as soon as they are placed.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid, index) => (
              <div
                key={bid._id}
                className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  index === 0
                    ? 'border-km-green-400 bg-km-green-50/70 shadow-km-sm'
                    : 'border-km-green-100 bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-base flex-shrink-0 ${
                      index === 0
                        ? 'bg-km-green-700 text-white'
                        : 'bg-km-cream-100 text-km-ink'
                    }`}
                  >
                    #{index + 1}
                  </div>
                  <div>
                    <div className="km-price text-2xl sm:text-3xl">
                      PKR {bid.amount.toLocaleString()}
                    </div>
                    <div className="text-base font-semibold text-km-ink">
                      {bid.buyer?.name} ({bid.buyer?.district || 'Pakistan'})
                    </div>
                    <div className="text-caption text-km-ink-subtle">
                      {new Date(bid.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {activeListing?.status !== 'sold' ? (
                  <button
                    type="button"
                    onClick={() => handleAcceptBid(bid._id)}
                    className="w-full sm:w-auto km-btn-primary px-7 py-3.5 text-base"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{t('acceptBid')}</span>
                  </button>
                ) : (
                  <span className="km-badge">{t('statusSold')}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FarmerBidsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-km-green-700 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <FarmerBidsContent />
    </Suspense>
  );
}
