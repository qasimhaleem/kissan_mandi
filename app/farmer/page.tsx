'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { PlusCircle, List, ArrowDownToLine, Clock, Award } from 'lucide-react';
import { Listing } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function FarmerDashboard() {
  const { user, token, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [listings, setListings] = useState<Listing[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'farmer')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (token) {
      fetchListings();
    }
  }, [token]);

  const fetchListings = async () => {
    try {
      setFetching(true);
      const res = await fetch('http://localhost:5000/api/listings/mine', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setListings(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setFetching(false);
    }
  };

  if (loading || !user) {
    return <div className="text-center py-20 text-xl font-bold">...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Farmer Greeting Banner */}
      <div className="bg-white border-2 border-[#8FD19E] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B2B2B]">
            {t('welcomeFarmer')}، {user.name}! 👨‍🌾
          </h1>
          <p className="text-gray-600 mt-1 font-medium text-lg">
            {t('district')}: <span className="font-bold text-[#2B2B2B]">{user.district}</span>
          </p>
        </div>
      </div>

      {/* MAX 3 MAIN ACTIONS (Designed for low digital literacy: Large buttons, min 18px text, big icons) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Action 1: Post Produce */}
        <Link
          href="/farmer/post"
          className="flex flex-col items-center justify-center p-6 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] rounded-2xl shadow-sm transition-all min-h-[140px] text-center"
        >
          <PlusCircle className="w-12 h-12 mb-2 text-[#2B2B2B]" />
          <span className="text-2xl font-black">{t('postProduce')}</span>
        </Link>

        {/* Action 2: My Listings */}
        <Link
          href="/farmer"
          className="flex flex-col items-center justify-center p-6 bg-white border-2 border-[#8FD19E] hover:bg-[#FAF6EA] text-[#2B2B2B] rounded-2xl shadow-sm transition-all min-h-[140px] text-center"
        >
          <List className="w-12 h-12 mb-2 text-[#2B2B2B]" />
          <span className="text-2xl font-black">{t('myListings')}</span>
        </Link>

        {/* Action 3: Bids Received */}
        <Link
          href="/farmer/bids"
          className="flex flex-col items-center justify-center p-6 bg-white border-2 border-[#8FD19E] hover:bg-[#FAF6EA] text-[#2B2B2B] rounded-2xl shadow-sm transition-all min-h-[140px] text-center"
        >
          <ArrowDownToLine className="w-12 h-12 mb-2 text-[#2B2B2B]" />
          <span className="text-2xl font-black">{t('bidsReceived')}</span>
        </Link>
      </div>

      {/* My Listings List */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-[#2B2B2B]">
            {t('myListings')} ({listings.length})
          </h2>
          <button
            onClick={fetchListings}
            className="text-sm font-bold text-[#2B2B2B] underline hover:text-[#6DBE82]"
          >
            ریفریش (Refresh)
          </button>
        </div>

        {fetching ? (
          <div className="text-center py-12 text-lg font-bold text-gray-500">
            ...
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-gray-300">
            <div className="text-5xl mb-3">🌾</div>
            <p className="text-xl font-bold text-gray-600 mb-6">
              {t('noListings')}
            </p>
            <Link
              href="/farmer/post"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-xl rounded-xl shadow-sm transition-all"
            >
              <PlusCircle className="w-6 h-6" />
              <span>{t('postProduce')}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map((item) => {
              const img1 = item.images[0]?.startsWith('/uploads')
                ? `http://localhost:5000${item.images[0]}`
                : item.images[0] || 'https://placehold.co/400x300/8FD19E/ffffff?text=Crop';

              const img2 = item.images[1]?.startsWith('/uploads')
                ? `http://localhost:5000${item.images[1]}`
                : item.images[1] || 'https://placehold.co/400x300/6DBE82/ffffff?text=Crop';

              const isExpired = new Date() > new Date(item.endsAt);

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border-2 border-[#FAF6EA] overflow-hidden shadow-sm flex flex-col"
                >
                  {/* Photo Display (2 photos) */}
                  <div className="grid grid-cols-2 gap-1 bg-gray-100 h-48 overflow-hidden">
                    <img
                      src={img1}
                      alt={item.crop}
                      className="w-full h-full object-cover"
                    />
                    <img
                      src={img2}
                      alt={item.crop}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-black text-[#2B2B2B]">
                          {t(`crops.${item.crop}`) || item.crop}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.status === 'sold'
                              ? 'bg-blue-100 text-blue-800'
                              : isExpired || item.status === 'closed'
                              ? 'bg-gray-200 text-gray-700'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {item.status === 'sold'
                            ? t('statusSold')
                            : isExpired
                            ? t('statusClosed')
                            : t('statusActive')}
                        </span>
                      </div>

                      <div className="text-lg text-gray-700 font-bold mb-3">
                        {item.quantity} {t(item.unit)} • {item.location.district}
                      </div>

                      <div className="bg-[#FAF6EA] p-3 rounded-xl mb-4 space-y-1">
                        <div className="flex justify-between text-base">
                          <span className="text-gray-600 font-medium">{t('basePriceLabel')}:</span>
                          <span className="font-bold text-[#2B2B2B]">Rs {item.basePrice}</span>
                        </div>
                        <div className="flex justify-between text-lg">
                          <span className="text-gray-800 font-bold">{t('currentHighestBid')}:</span>
                          <span className="font-black text-[#2B2B2B] text-xl">
                            Rs {item.highestBid > 0 ? item.highestBid : item.basePrice}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(item.endsAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Link
                        href={`/farmer/bids?listingId=${item._id}`}
                        className="px-4 py-2 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-bold rounded-lg text-base shadow-sm"
                      >
                        {t('viewBids')}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

