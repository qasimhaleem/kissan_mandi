'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Camera, CheckCircle2, ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';

const CROPS = [
  { id: 'Wheat', icon: '🌾' },
  { id: 'Rice', icon: '🍚' },
  { id: 'Cotton', icon: '⚪' },
  { id: 'Sugarcane', icon: '🎋' },
  { id: 'Maize', icon: '🌽' },
  { id: 'Potato', icon: '🥔' },
  { id: 'Onion', icon: '🧅' },
  { id: 'Tomato', icon: '🍅' },
  { id: 'Mango', icon: '🥭' },
  { id: 'Citrus', icon: '🍊' },
];

const PUNJAB_DISTRICTS = [
  'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 
  'Sargodha', 'Bahawalpur', 'Sahiwal', 'Sheikhupura', 'Jhang', 
  'Rahim Yar Khan', 'Kasur', 'Okara', 'Pakpattan', 'Vehari', 
  'Khanewal', 'Muzaffargarh', 'Dera Ghazi Khan', 'Bahawalnagar'
];

export default function PostProducePage() {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [crop, setCrop] = useState(CROPS[0].id);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<'kg' | 'maund' | 'ton'>('maund');
  const [basePrice, setBasePrice] = useState('');
  const [district, setDistrict] = useState(user?.district || 'Lahore');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(user?.coordinates || { lat: 31.5204, lng: 74.3587 });
  const [durationHours, setDurationHours] = useState('24');
  
  // Exactly 2 photos required
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [preview1, setPreview1] = useState<string>('');
  const [preview2, setPreview2] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const handlePhoto1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto1(file);
      setPreview1(URL.createObjectURL(file));
    }
  };

  const handlePhoto2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto2(file);
      setPreview2(URL.createObjectURL(file));
    }
  };

  const handleAutoLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          alert(t('locationDetected'));
        },
        () => {
          alert('Could not detect location. Please select district.');
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!quantity || Number(quantity) <= 0) {
      setError('براہ کرم صحیح مقدار درج کریں (Please enter valid quantity)');
      return;
    }

    if (!basePrice || Number(basePrice) <= 0) {
      setError('براہ کرم کم سے کم قیمت درج کریں (Please enter valid base price)');
      return;
    }

    if (!photo1 || !photo2) {
      setError('فصل کی دونوں (۲) تصاویر لگانا لازمی ہے (Exactly 2 photos required)');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('crop', crop);
      formData.append('quantity', quantity);
      formData.append('unit', unit);
      formData.append('basePrice', basePrice);
      formData.append('district', district);
      formData.append('durationHours', durationHours);
      formData.append('lat', coords.lat.toString());
      formData.append('lng', coords.lng.toString());
      formData.append('images', photo1);
      formData.append('images', photo2);

      const res = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error creating produce listing');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-sm border-2 border-[#8FD19E] text-center my-8">
        <CheckCircle2 className="w-20 h-20 text-[#6DBE82] mx-auto mb-4" />
        <h2 className="text-3xl font-black text-[#2B2B2B] mb-2">
          {t('postSuccessTitle')}
        </h2>
        <p className="text-xl text-gray-700 font-medium mb-8">
          {t('postSuccessDesc')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/farmer"
            className="px-6 py-4 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-xl rounded-2xl shadow-sm transition-all"
          >
            {t('viewListings')}
          </Link>
          <button
            onClick={() => {
              setSuccess(false);
              setQuantity('');
              setBasePrice('');
              setPhoto1(null);
              setPhoto2(null);
              setPreview1('');
              setPreview2('');
            }}
            className="px-6 py-4 bg-[#FAF6EA] border-2 border-[#8FD19E] text-[#2B2B2B] font-black text-xl rounded-2xl shadow-sm transition-all"
          >
            {t('postProduce')} (ایک اور فصل)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#8FD19E] my-4">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <Link
          href="/farmer"
          className="flex items-center gap-1.5 text-base font-bold text-gray-600 hover:text-[#2B2B2B]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('backToHome')}</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2B2B2B]">
          {t('postProduce')}
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl text-lg font-bold text-center">
          {error}
        </div>
      )}

      {/* SINGLE SIMPLE FORM WITH STRICT MINIMAL INPUTS */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Crop Dropdown with Visual Icons */}
        <div>
          <label className="block text-xl font-black text-[#2B2B2B] mb-2">
            ۱. {t('cropName')}
          </label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-[#8FD19E] text-xl font-bold bg-[#FAF6EA] text-[#2B2B2B] cursor-pointer"
          >
            {CROPS.map((c) => (
              <option key={c.id} value={c.id} className="text-lg">
                {c.icon} {t(`crops.${c.id}`) || c.id}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Quantity (number + unit selector: kg / maund / ton) */}
        <div>
          <label className="block text-xl font-black text-[#2B2B2B] mb-2">
            ۲. {t('quantity')} اور {t('unit')}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="مثلاً: 50"
              required
              className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-[#8FD19E] text-2xl font-black text-[#2B2B2B]"
            />
            <select
              value={unit}
              onChange={(e: any) => setUnit(e.target.value)}
              className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-[#8FD19E] text-xl font-bold bg-[#FAF6EA] text-[#2B2B2B]"
            >
              <option value="maund">{t('maund')}</option>
              <option value="kg">{t('kg')}</option>
              <option value="ton">{t('ton')}</option>
            </select>
          </div>
        </div>

        {/* 3. Minimum price (base price per unit) */}
        <div>
          <label className="block text-xl font-black text-[#2B2B2B] mb-2">
            ۳. {t('basePrice')} ({t('minPrice')})
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="مثلاً: 3800"
              required
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-[#8FD19E] text-2xl font-black text-[#2B2B2B]"
            />
            <span className="absolute right-4 top-4 text-gray-500 font-bold text-lg">
              روپے
            </span>
          </div>
        </div>

        {/* 4. Location (auto-detect button or pick district) */}
        <div>
          <label className="block text-xl font-black text-[#2B2B2B] mb-2">
            ۴. {t('district')} ({t('location') || 'مقام'})
          </label>
          <div className="flex gap-2">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-[#8FD19E] text-xl font-bold bg-[#FAF6EA] text-[#2B2B2B]"
            >
              {PUNJAB_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAutoLocation}
              className="px-5 bg-[#FAF6EA] border-2 border-[#8FD19E] hover:bg-[#8FD19E] rounded-2xl flex items-center justify-center font-bold text-base transition-colors"
              title={t('autoDetectLocation')}
            >
              <MapPin className="w-6 h-6 text-[#2B2B2B]" />
            </button>
          </div>
        </div>

        {/* 5. Exactly 2 photos (camera or gallery upload with preview, both required) */}
        <div>
          <label className="block text-xl font-black text-[#2B2B2B] mb-2">
            ۵. {t('twoPhotos')}
          </label>
          <div className="grid grid-cols-2 gap-4">
            {/* Photo 1 */}
            <div
              onClick={() => fileInputRef1.current?.click()}
              className="border-2 border-dashed border-[#8FD19E] bg-[#FAF6EA] rounded-2xl p-4 flex flex-col items-center justify-center h-44 cursor-pointer hover:bg-green-50 transition-colors overflow-hidden"
            >
              {preview1 ? (
                <img
                  src={preview1}
                  alt="Preview 1"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-center">
                  <Camera className="w-10 h-10 text-[#6DBE82] mx-auto mb-2" />
                  <span className="text-sm font-bold text-[#2B2B2B] block">
                    {t('photo1')}
                  </span>
                  <span className="text-xs text-gray-500 mt-1 block">
                    (لازمی تصویر ۱)
                  </span>
                </div>
              )}
              <input
                ref={fileInputRef1}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhoto1Change}
                className="hidden"
              />
            </div>

            {/* Photo 2 */}
            <div
              onClick={() => fileInputRef2.current?.click()}
              className="border-2 border-dashed border-[#8FD19E] bg-[#FAF6EA] rounded-2xl p-4 flex flex-col items-center justify-center h-44 cursor-pointer hover:bg-green-50 transition-colors overflow-hidden"
            >
              {preview2 ? (
                <img
                  src={preview2}
                  alt="Preview 2"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-center">
                  <Camera className="w-10 h-10 text-[#6DBE82] mx-auto mb-2" />
                  <span className="text-sm font-bold text-[#2B2B2B] block">
                    {t('photo2')}
                  </span>
                  <span className="text-xs text-gray-500 mt-1 block">
                    (لازمی تصویر ۲)
                  </span>
                </div>
              )}
              <input
                ref={fileInputRef2}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhoto2Change}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* 6. Auction end time (simple choices: 6 hours / 12 hours / 24 hours / 2 days) */}
        <div>
          <label className="block text-xl font-black text-[#2B2B2B] mb-2">
            ۶. {t('auctionDuration')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: t('hours6'), value: '6' },
              { label: t('hours12'), value: '12' },
              { label: t('hours24'), value: '24' },
              { label: t('days2'), value: '48' },
            ].map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDurationHours(d.value)}
                className={`py-3 px-2 rounded-xl border-2 font-bold text-base transition-all cursor-pointer ${
                  durationHours === d.value
                    ? 'border-[#8FD19E] bg-[#8FD19E] text-[#2B2B2B]'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* 7. One BIG "Post" Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-5 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-2xl rounded-2xl shadow-md transition-all min-h-[64px] flex items-center justify-center cursor-pointer mt-4"
        >
          {submitting ? t('submitting') : `🚀 ${t('postButton')}`}
        </button>
      </form>
    </div>
  );
}

