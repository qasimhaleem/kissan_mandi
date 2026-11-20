'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Upload,
  X,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Package,
  Layers,
  DollarSign,
  Tag,
  Info,
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
  const { t } = useLanguage();
  const router = useRouter();

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState(PRODUCT_UNITS[0]);
  const [quantity, setQuantity] = useState('');
  const [minOrder, setMinOrder] = useState('10');
  const [district, setDistrict] = useState(user?.district || 'Mardan');
  const [address, setAddress] = useState(user?.farmerProfile?.farmAddress || '');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(
    user?.coordinates || { lat: 34.1989, lng: 72.0404 }
  );

  // Multiple photos state (up to 5 photos)
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdProduct, setCreatedProduct] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    if (photos.length + filesArray.length > 5) {
      setError('You can upload a maximum of 5 product photos.');
      return;
    }

    const newPhotos = [...photos, ...filesArray];
    const newPreviews = [...previews, ...filesArray.map((f) => URL.createObjectURL(f))];

    setPhotos(newPhotos);
    setPreviews(newPreviews);
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
          alert('GPS location recorded.');
        },
        () => {
          alert('Unable to retrieve GPS coordinates. Defaulting to district center.');
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!productName.trim()) {
      setError('Please provide a product title/name.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a short description of the crop.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setError('Please enter a valid price in PKR.');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setError('Please enter the available harvest quantity.');
      return;
    }
    if (!minOrder || Number(minOrder) <= 0) {
      setError('Please enter a valid minimum order quantity.');
      return;
    }
    if (photos.length === 0) {
      setError('Please upload at least one real photo of the produce.');
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
    } catch (err: any) {
      console.error('Error listing produce:', err);
      setError('Network communication error while uploading produce.');
    } finally {
      setSubmitting(false);
    }
  };

  if (createdProduct) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border-2 border-[#8FD19E] rounded-3xl p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-[#8FD19E]/20 text-[#2B2B2B] rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-[#6DBE82]" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#2B2B2B]">Produce Successfully Published</h1>
            <p className="text-sm text-gray-600 mt-2">
              Your listing <span className="font-bold text-[#2B2B2B]">{createdProduct.title}</span> is now active in the marketplace for commercial buyers.
            </p>
          </div>

          <div className="bg-[#FAF6EA] p-4 rounded-2xl text-left text-sm space-y-2 border border-[#8FD19E]/40">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Category:</span>
              <span className="font-bold text-[#2B2B2B]">{createdProduct.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Price:</span>
              <span className="font-bold text-[#2B2B2B]">PKR {createdProduct.price} / {createdProduct.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Quantity Available:</span>
              <span className="font-bold text-[#2B2B2B]">{createdProduct.quantity} {createdProduct.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Minimum Order:</span>
              <span className="font-bold text-[#2B2B2B]">{createdProduct.minOrder} {createdProduct.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Location:</span>
              <span className="font-bold text-[#2B2B2B]">{createdProduct.location?.district}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/farmer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-[#2B2B2B] hover:border-[#8FD19E] hover:bg-[#FAF6EA] transition-all"
            >
              Back to Farmer Portal
            </Link>
            <Link
              href={`/marketplace/products/${createdProduct.slug || createdProduct._id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#8FD19E] hover:bg-[#6DBE82] text-sm font-black text-[#2B2B2B] shadow-sm transition-all"
            >
              View in Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/farmer"
          className="p-2 rounded-xl border border-gray-200 hover:border-[#8FD19E] text-gray-600 hover:text-[#2B2B2B] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B2B2B]">
            Add Product Listing
          </h1>
          <p className="text-sm text-gray-500">
            Publish your crop inventory to the national agricultural marketplace.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Section 1: Product Basics */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-[#2B2B2B] flex items-center gap-2 border-b border-gray-100 pb-2">
            <Package className="w-4 h-4 text-[#8FD19E]" />
            <span>Product Identification</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Tomatoes"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#8FD19E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#8FD19E] bg-white"
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
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Fresh farm tomatoes, grade A harvest, sorted and ready for wholesale dispatch."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#8FD19E]"
            />
          </div>
        </div>

        {/* Section 2: Pricing & Volume */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-[#2B2B2B] flex items-center gap-2 border-b border-gray-100 pb-2">
            <DollarSign className="w-4 h-4 text-[#8FD19E]" />
            <span>Pricing & Harvest Volume</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                Unit of Measure <span className="text-red-500">*</span>
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#8FD19E] bg-white"
              >
                {PRODUCT_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                Price (PKR per {unit}) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 120"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#8FD19E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                Total Available Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 2000"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#8FD19E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                Minimum Order Quantity ({unit}) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                placeholder="e.g. 100"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#8FD19E]"
              />
              <span className="text-xs text-gray-500 mt-1 block">
                Lowest order size you are willing to fulfill.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                Availability
              </label>
              <div className="h-[46px] px-4 rounded-xl border border-gray-200 bg-[#FAF6EA] flex items-center justify-between">
                <span className="text-sm font-bold text-[#2B2B2B]">Active Listing</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#8FD19E]"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Location */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-[#2B2B2B] flex items-center gap-2 border-b border-gray-100 pb-2">
            <MapPin className="w-4 h-4 text-[#8FD19E]" />
            <span>Farm Location & Dispatch</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                District <span className="text-red-500">*</span>
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#8FD19E] bg-white"
              >
                {PAKISTAN_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                Farm Address / Tehsil
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Village, Tehsil or loading point"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#8FD19E]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Product Photos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-base font-black text-[#2B2B2B] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#8FD19E]" />
              <span>Product Photos (Cloudinary Upload)</span>
            </h2>
            <span className="text-xs text-gray-500 font-bold">
              {photos.length} / 5 Selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {previews.map((url, index) => (
              <div
                key={index}
                className="relative h-28 rounded-2xl overflow-hidden border-2 border-[#8FD19E] group bg-gray-100"
              >
                <img
                  src={url}
                  alt={`Produce preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {photos.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-28 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#8FD19E] hover:bg-[#FAF6EA] transition-all flex flex-col items-center justify-center p-2 text-center text-gray-600"
              >
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs font-bold">Add Photo</span>
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
          <p className="text-xs text-gray-500">
            High quality photos of actual crops increase buyer trust and purchase inquiries.
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <Link
            href="/farmer"
            className="px-5 py-3 rounded-xl text-sm font-bold text-gray-600 hover:text-black"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-base rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-[#2B2B2B] border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading & Publishing...</span>
              </>
            ) : (
              <span>Publish Product</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
