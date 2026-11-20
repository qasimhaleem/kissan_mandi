'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowLeft,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle,
  Package,
  DollarSign,
  MapPin,
} from 'lucide-react';
import { API_BASE, resolveImageUrl } from '@/lib/api';
import { Product } from '@/lib/types';

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

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('KG');
  const [quantity, setQuantity] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [status, setStatus] = useState<'active' | 'paused' | 'sold_out'>('active');
  const [district, setDistrict] = useState('');
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (id && token) {
      loadProduct();
    }
  }, [id, token]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/marketplace/products/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        const p: Product = data.data;
        setTitle(p.title);
        setCategory(p.category);
        setDescription(p.description);
        setPrice(p.price.toString());
        setUnit(p.unit || 'KG');
        setQuantity(p.quantity.toString());
        setMinOrder(p.minOrder.toString());
        setStatus(p.status as any);
        setDistrict(p.location?.district || '');
        setImages(p.images || []);
      } else {
        setError('Product not found.');
      }
    } catch (err) {
      setError('Failed to fetch product data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          category,
          description,
          price: Number(price),
          unit,
          quantity: Number(quantity),
          minOrder: Number(minOrder),
          status,
          district,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Product successfully updated.');
        setTimeout(() => router.push('/farmer'), 1500);
      } else {
        setError(data.error?.message || 'Failed to update product.');
      }
    } catch (err) {
      setError('Network communication error while updating product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#8FD19E] border-t-transparent rounded-full animate-spin"></div>
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
            Edit Product Listing
          </h1>
          <p className="text-sm text-gray-500">
            Update pricing, available stock, or listing status.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-800 text-sm font-medium">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="bg-white border-2 border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Photos Preview */}
        {images.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
              Product Photos
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={resolveImageUrl(img)}
                  alt="Product"
                  className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                />
              ))}
            </div>
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-[#2B2B2B] flex items-center gap-2 border-b border-gray-100 pb-2">
            <Package className="w-4 h-4 text-[#8FD19E]" />
            <span>Product Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                Product Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#8FD19E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#8FD19E] bg-white"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
              Description
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#8FD19E]"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-[#2B2B2B] flex items-center gap-2 border-b border-gray-100 pb-2">
            <DollarSign className="w-4 h-4 text-[#8FD19E]" />
            <span>Pricing & Stock</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                Unit
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
                Price (PKR per {unit})
              </label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#8FD19E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                Quantity Available
              </label>
              <input
                type="number"
                required
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#8FD19E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                Minimum Order Quantity
              </label>
              <input
                type="number"
                required
                min="1"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#8FD19E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                Listing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold focus:outline-none focus:border-[#8FD19E] bg-white"
              >
                <option value="active">Active (Visible in Marketplace)</option>
                <option value="paused">Paused (Temporarily Hidden)</option>
                <option value="sold_out">Sold Out</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <Link
            href="/farmer"
            className="px-5 py-3 rounded-xl text-sm font-bold text-gray-600 hover:text-black"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-base rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
