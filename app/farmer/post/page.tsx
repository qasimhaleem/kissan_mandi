'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Camera,
  X,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Package,
  Coins,
  Upload,
} from 'lucide-react';
import { API_BASE } from '@/lib/api';

const PRODUCT_CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Pulses',
  'Oilseeds',
  'Cotton',
  'Sugarcane',
  'Other',
];

const PRODUCT_UNITS = ['KG', 'Maund', 'Ton', 'Bale', 'Crate', 'Bag'];

const PAKISTAN_DISTRICTS = [
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
  'Pakpattan',
  'Vehari',
  'Khanewal',
  'Muzaffargarh',
  'Dera Ghazi Khan',
  'Bahawalnagar',
  'Peshawar',
  'Swat',
  'Charsadda',
  'Nowshera',
  'Hyderabad',
  'Sukkur',
  'Larkana',
  'Quetta',
];

export default function AddProductPage() {
  const { user, token } = useAuth();
  const { locale, t } = useLanguage();
  const isUrdu = locale === 'ur';

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState(PRODUCT_UNITS[0]);
  const [quantity, setQuantity] = useState('');
  const [minOrder, setMinOrder] = useState('10');
  const [district, setDistrict] = useState(user?.district || 'Mardan');
  const [address, setAddress] = useState(
    user?.farmerProfile?.farmAddress || ''
  );
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(
    user?.coordinates || { lat: 34.1989, lng: 72.0404 }
  );

  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdProduct, setCreatedProduct] = useState<{
    _id: string;
    slug?: string;
    title: string;
    category: string;
    price: number;
    unit: string;
    quantity: number;
    location?: { district?: string };
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    if (photos.length + filesArray.length > 5) {
      setError(
        isUrdu
          ? 'زیادہ سے زیادہ ۵ تصاویر اپ لوڈ کی جا سکتی ہیں۔'
          : 'You can upload a maximum of 5 product photos.'
      );
      return;
    }

    setPhotos([...photos, ...filesArray]);
    setPreviews([...previews, ...filesArray.map((f) => URL.createObjectURL(f))]);
    setError('');
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
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
          alert(
            'Unable to retrieve GPS coordinates. Defaulting to selected district.'
          );
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!productName.trim()) {
      setError(
        isUrdu ? 'براہ کرم فصل کا نام درج کریں۔' : 'Please provide a product title/name.'
      );
      return;
    }
    if (!description.trim()) {
      setError(
        isUrdu
          ? 'براہ کرم فصل کی مختصر تفصیل درج کریں۔'
          : 'Please provide a short description of the crop.'
      );
      return;
    }
    if (!price || Number(price) <= 0) {
      setError(
        isUrdu
          ? 'براہ کرم درست قیمت (PKR) درج کریں۔'
          : 'Please enter a valid price in PKR.'
      );
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setError(
        isUrdu
          ? 'براہ کرم دستیاب مقدار درج کریں۔'
          : 'Please enter the available harvest quantity.'
      );
      return;
    }
    if (!minOrder || Number(minOrder) <= 0) {
      setError(
        isUrdu
          ? 'براہ کرم کم از کم آرڈر کی مقدار درج کریں۔'
          : 'Please enter a valid minimum order quantity.'
      );
      return;
    }
    if (photos.length === 0) {
      setError(
        isUrdu
          ? 'براہ کرم فصل کی کم از کم ایک حقیقی تصویر اپ لوڈ کریں۔'
          : 'Please upload at least one real photo of the produce.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', productName.trim());
      formData.append('category', category);
      formData.append('description', description.trim());
      formData.append('price', price);
      formData.append('unit', unit);
      formData.append('quantity', quantity);
      formData.append('minOrder', minOrder);
      formData.append('district', district);
      formData.append('address', address);
      formData.append('lat', coords.lat.toString());
      formData.append('lng', coords.lng.toString());

      photos.forEach((file) => {
        formData.append('images', file);
      });

      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setCreatedProduct(data.data);
      } else {
        setError(data.error?.message || 'Failed to publish product.');
      }
    } catch (err: unknown) {
      console.error('Error listing produce:', err);
      setError('Network communication error while uploading produce.');
    } finally {
      setSubmitting(false);
    }
  };

  if (createdProduct) {
    return (
      <div className="km-container max-w-2xl py-12">
        <div className="bg-white border-2 border-km-green-300 rounded-3xl p-8 sm:p-10 shadow-km-md text-center space-y-6">
          <div className="w-16 h-16 bg-km-green-100 text-km-green-700 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-km-ink">
              {t('postSuccessTitle')}
            </h1>
            <p className="text-base text-km-ink-muted">
              {isUrdu
                ? `آپ کی فصل "${createdProduct.title}" اب مارکیٹ پلیس پر فعال ہے۔`
                : `Your listing "${createdProduct.title}" is now live in the marketplace for commercial buyers.`}
            </p>
          </div>

          <div className="bg-km-cream-100 p-5 rounded-2xl text-start text-sm space-y-2.5 border border-km-cream-300">
            <div className="flex justify-between">
              <span className="text-km-ink-muted font-medium">Category:</span>
              <span className="font-bold text-km-ink">{createdProduct.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-km-ink-muted font-medium">Price:</span>
              <span className="font-extrabold text-km-green-800">
                PKR {createdProduct.price} / {createdProduct.unit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-km-ink-muted font-medium">Quantity:</span>
              <span className="font-bold text-km-ink">
                {createdProduct.quantity} {createdProduct.unit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-km-ink-muted font-medium">Location:</span>
              <span className="font-bold text-km-ink">
                {createdProduct.location?.district}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/farmer" className="w-full sm:w-auto km-btn-outline py-3.5 text-base">
              {t('viewListings')}
            </Link>
            <Link
              href={`/marketplace/products/${createdProduct.slug || createdProduct._id}`}
              className="w-full sm:w-auto km-btn-primary py-3.5 text-base"
            >
              {isUrdu ? 'مارکیٹ میں دیکھیں' : 'View in Marketplace'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="km-container max-w-3xl py-8 sm:py-10 space-y-6">
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
            {t('postProduce')}
          </h1>
          <p className="text-sm sm:text-base text-km-ink-muted">
            {isUrdu
              ? 'اپنی فصل کی تفصیل اور ۲ تصاویر شامل کر کے براہِ راست منڈی میں پیش کریں۔'
              : 'Enter your crop details and upload clear farm photos to reach verified buyers.'}
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 bg-km-cream-200 border border-km-ink/30 rounded-2xl flex items-center gap-3 text-km-ink text-sm font-bold"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-km-green-200 rounded-3xl p-6 sm:p-8 shadow-km-sm space-y-8"
      >
        {/* Step 1: Produce Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-km-ink flex items-center gap-2 border-b border-km-green-100 pb-3">
            <Package className="w-5 h-5 text-km-green-700" />
            <span>{isUrdu ? '۱۔ فصل کی تفصیل' : '1. Produce Details'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="post-name"
                className="block text-sm font-bold text-km-ink mb-1.5"
              >
                {t('cropName')} *
              </label>
              <input
                id="post-name"
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder={isUrdu ? 'مثلاً: تازہ ٹماٹر یا گندم' : 'e.g. Fresh Tomatoes'}
                className="km-input py-3.5 text-base"
              />
            </div>

            <div>
              <label
                htmlFor="post-category"
                className="block text-sm font-bold text-km-ink mb-1.5"
              >
                {isUrdu ? 'زمرہ (Category)' : 'Category'} *
              </label>
              <select
                id="post-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="km-input py-3.5 text-base"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="post-desc"
              className="block text-sm font-bold text-km-ink mb-1.5"
            >
              {isUrdu ? 'فصل کا معیار اور تفصیل' : 'Description'} *
            </label>
            <textarea
              id="post-desc"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isUrdu
                  ? 'مثلاً: تازہ کٹائی، بہترین گریڈ اے معیار، فوری ترسیل کے لیے تیار'
                  : 'e.g. Grade A farm harvest, freshly sorted and packed for dispatch.'
              }
              className="km-input text-base"
            />
          </div>
        </div>

        {/* Step 2: Price & Quantity */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-km-ink flex items-center gap-2 border-b border-km-green-100 pb-3">
            <Coins className="w-5 h-5 text-km-green-700" />
            <span>{isUrdu ? '۲۔ قیمت اور مقدار' : '2. Pricing & Volume'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="post-unit"
                className="block text-sm font-bold text-km-ink mb-1.5"
              >
                {t('unit')} *
              </label>
              <select
                id="post-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="km-input py-3.5 text-base"
              >
                {PRODUCT_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="post-price"
                className="block text-sm font-bold text-km-ink mb-1.5"
              >
                {isUrdu ? `قیمت (PKR فی ${unit})` : `Price (PKR / ${unit})`} *
              </label>
              <input
                id="post-price"
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="120"
                className="km-input py-3.5 text-base"
              />
            </div>

            <div>
              <label
                htmlFor="post-qty"
                className="block text-sm font-bold text-km-ink mb-1.5"
              >
                {t('quantity')} *
              </label>
              <input
                id="post-qty"
                type="number"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="2000"
                className="km-input py-3.5 text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="post-min-order"
                className="block text-sm font-bold text-km-ink mb-1.5"
              >
                {isUrdu
                  ? `کم از کم آرڈر (${unit})`
                  : `Minimum Order (${unit})`}{' '}
                *
              </label>
              <input
                id="post-min-order"
                type="number"
                required
                min="1"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                placeholder="100"
                className="km-input py-3.5 text-base"
              />
            </div>

            <div>
              <span className="block text-sm font-bold text-km-ink mb-1.5">
                {isUrdu ? 'اسٹیٹس' : 'Availability'}
              </span>
              <div className="h-[50px] px-4 rounded-xl border border-km-green-200 bg-km-green-50 flex items-center justify-between">
                <span className="text-sm font-bold text-km-green-800">
                  {isUrdu ? 'فوری فعال لسٹنگ' : 'Active Immediately'}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-km-green-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Location */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-km-green-100 pb-3">
            <h2 className="text-lg font-extrabold text-km-ink flex items-center gap-2">
              <MapPin className="w-5 h-5 text-km-green-700" />
              <span>{isUrdu ? '۳۔ فارم کا مقام' : '3. Farm Location'}</span>
            </h2>
            <button
              type="button"
              onClick={handleAutoLocation}
              className="text-xs font-bold text-km-green-700 hover:underline inline-flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t('autoDetectLocation')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="post-district"
                className="block text-sm font-bold text-km-ink mb-1.5"
              >
                {t('district')} *
              </label>
              <select
                id="post-district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="km-input py-3.5 text-base"
              >
                {PAKISTAN_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="post-address"
                className="block text-sm font-bold text-km-ink mb-1.5"
              >
                {isUrdu ? 'گاؤں / لوڈنگ پوائنٹ' : 'Village / Loading Point'}
              </label>
              <input
                id="post-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Village, Tehsil or farm gate"
                className="km-input py-3.5 text-base"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Photos (Large Clear Upload Area) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-km-green-100 pb-3">
            <h2 className="text-lg font-extrabold text-km-ink flex items-center gap-2">
              <Camera className="w-5 h-5 text-km-green-700" />
              <span>
                {isUrdu
                  ? '۴۔ فصل کی تصاویر (کم از کم ۲ تجویز کردہ)'
                  : '4. Produce Photos (2+ Recommended)'}
              </span>
            </h2>
            <span className="km-badge">{photos.length} / 5</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {previews.map((url, index) => (
              <div
                key={index}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-km-green-400 bg-km-cream-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Uploaded produce preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute top-2 end-2 p-1.5 bg-km-green-900/80 hover:bg-km-green-900 text-white rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {photos.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[4/3] rounded-2xl border-2 border-dashed border-km-green-400 bg-km-green-50/70 hover:bg-km-green-100 transition-all flex flex-col items-center justify-center p-4 text-center text-km-green-800 gap-2"
              >
                <Upload className="w-7 h-7 text-km-green-700" />
                <span className="text-sm font-extrabold">
                  {t('uploadPhoto')}
                </span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoSelect}
            className="hidden"
          />
        </div>

        {/* Large Submit CTA */}
        <div className="pt-4 border-t border-km-green-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <Link href="/farmer" className="w-full sm:w-auto km-btn-outline py-4 text-base">
            {isUrdu ? 'واپس جائیں' : 'Cancel'}
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto km-btn-primary px-10 py-4 text-lg shadow-km-md"
          >
            {submitting ? t('submitting') : t('postButton')}
          </button>
        </div>
      </form>
    </div>
  );
}
