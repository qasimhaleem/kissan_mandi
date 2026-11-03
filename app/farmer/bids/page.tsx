'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Check, ArrowLeft, Phone, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Listing, Bid } from '@/lib/types';

function FarmerBidsContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listingId');
  const { user, token, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<string>(listingId || '');
  const [bids, setBids] = useState<Bid[]>([]);
  const [fetching, setFetching] = useState(false);
  const [acceptedBuyer, setAcceptedBuyer] = useState<{ name: string; phone: string } | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'farmer')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (token) {
      fetchMyListings();
    }
  }, [token]);

  useEffect(() => {
    if (listingId) {
      setSelectedListingId(listingId);
    }
  }, [listingId]);

  useEffect(() => {
    if (selectedListingId && token) {
      fetchBids(selectedListingId);
    }
  }, [selectedListingId, token]);

  const fetchMyListings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/listings/mine', {
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
      const res = await fetch(`http://localhost:5000/api/listings/${id}/bids`, {
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

  const handleAcceptBid = async (bidId: string) => {
    if (!confirm('کیا آپ یہ بولی قبول کرنا چاہتے ہیں؟ (Do you want to accept this bid?)')) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/listings/${selectedListingId}/accept/${bidId}`,
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <Link
          href="/farmer"
          className="flex items-center gap-1 font-bold text-gray-700 hover:text-black"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('backToHome')}</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2B2B2B]">
          {t('bidsReceived')}
        </h1>
      </div>

      {/* Select Which Produce Listing */}
      {myListings.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border-2 border-[#8FD19E]">
          <label className="block text-lg font-black text-[#2B2B2B] mb-2">
            فصل کا انتخاب کریں (Select Produce)
          </label>
          <select
            value={selectedListingId}
            onChange={(e) => setSelectedListingId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg font-bold bg-[#FAF6EA] text-[#2B2B2B]"
          >
            {myListings.map((l) => (
              <option key={l._id} value={l._id}>
                {t(`crops.${l.crop}`) || l.crop} - {l.quantity} {t(l.unit)} (شروعاتی: Rs {l.basePrice})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Accepted Buyer Details Card */}
      {acceptedBuyer && (
        <div className="bg-green-50 border-2 border-[#8FD19E] p-6 rounded-2xl text-center space-y-3">
          <div className="text-4xl">🎉</div>
          <h3 className="text-2xl font-black text-green-900">
            {t('congratulations')}
          </h3>
          <p className="text-lg font-bold text-gray-800">
            {t('contactBuyer')} اور مال کی ترسیل طے کریں:
          </p>
          <div className="bg-white p-4 rounded-xl inline-block text-left border border-green-200 shadow-sm">
            <p className="text-xl font-black text-[#2B2B2B]">
              نام: {acceptedBuyer.name}
            </p>
            <p className="text-2xl font-black text-[#6DBE82] mt-1 flex items-center gap-2">
              <Phone className="w-6 h-6" /> {acceptedBuyer.phone}
            </p>
          </div>
        </div>
      )}

      {/* Bids List Sorted Highest First with Big Accept Button */}
      <div className="bg-white p-6 rounded-3xl border-2 border-[#FAF6EA] shadow-sm">
        <h2 className="text-xl font-black text-[#2B2B2B] mb-4">
          موصولہ بولیاں (Bids Received) {bids.length > 0 ? `(${bids.length})` : ''}
        </h2>

        {fetching ? (
          <div className="text-center py-8 text-lg font-bold text-gray-500">
            ...
          </div>
        ) : bids.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-bold text-lg">
            اس فصل پر ابھی کوئی بولی موصول نہیں ہوئی۔ خریدار جلد بولی لگائیں گے!
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid, index) => (
              <div
                key={bid._id}
                className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
                  index === 0
                    ? 'border-[#8FD19E] bg-[#FAF6EA]'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
                      index === 0
                        ? 'bg-[#8FD19E] text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    #{index + 1}
                  </div>
                  <div>
                    <div className="text-2xl font-black text-[#2B2B2B]">
                      Rs {bid.amount}
                    </div>
                    <div className="text-sm font-bold text-gray-600">
                      خریدار: {bid.buyer?.name} ({bid.buyer?.district || 'پنجاب'})
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(bid.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Big Accept Button */}
                {activeListing?.status !== 'sold' ? (
                  <button
                    onClick={() => handleAcceptBid(bid._id)}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-xl rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                  >
                    <Check className="w-6 h-6" />
                    <span>{t('acceptBid')}</span>
                  </button>
                ) : (
                  <span className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm">
                    {t('statusSold')}
                  </span>
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
    <Suspense fallback={<div>Loading...</div>}>
      <FarmerBidsContent />
    </Suspense>
  );
}

