'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { Listing } from '@/lib/types';
import Link from 'next/link';

export default function BuyerDashboard() {
  const { user, token, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [listings, setListings] = useState<Listing[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'buyer')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setFetching(true);
      const res = await fetch('http://localhost:5000/api/listings');
      const data = await res.json();
      if (data.success) {
        setListings(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  if (loading || !user) {
    return <div className="text-center py-20 text-xl font-bold">...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border-2 border-[#8FD19E] rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-black text-[#2B2B2B]">
          {t('welcomeBuyer')}، {user.name}! 🛒
        </h1>
        <p className="text-gray-600 mt-1 font-medium">
          {t('browseProduce')} — تازہ ترین فصلیں براہِ راست کسانوں سے حاصل کریں
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#2B2B2B]">
          {t('browseProduce')} ({listings.length})
        </h2>
      </div>

      {fetching ? (
        <div className="text-center py-12 text-lg font-bold text-gray-500">
          ...
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-gray-300">
          <p className="text-xl font-bold text-gray-600">
            منڈی میں ابھی کوئی فعال فصل موجود نہیں۔ جلد چیک کریں!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => {
            const img1 = item.images[0]?.startsWith('/uploads')
              ? `http://localhost:5000${item.images[0]}`
              : item.images[0] || 'https://placehold.co/400x300/8FD19E/ffffff?text=Crop';

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border-2 border-[#FAF6EA] overflow-hidden shadow-sm flex flex-col hover:border-[#8FD19E] transition-all"
              >
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img
                    src={img1}
                    alt={item.crop}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-black text-[#2B2B2B]">
                      {t(`crops.${item.crop}`) || item.crop}
                    </h3>
                    <p className="text-sm font-bold text-gray-600 mt-0.5">
                      {item.quantity} {t(item.unit)} • {item.location.district}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      کسان: {item.farmer?.name}
                    </p>
                    <div className="mt-3 bg-[#FAF6EA] p-3 rounded-xl">
                      <div className="text-sm text-gray-600">{t('currentHighestBid')}:</div>
                      <div className="text-2xl font-black text-[#2B2B2B]">
                        Rs {item.highestBid > 0 ? item.highestBid : item.basePrice}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

