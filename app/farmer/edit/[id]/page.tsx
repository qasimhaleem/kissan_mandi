'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle2,
  Package,
  Coins,
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
  const { token } = useAuth();
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
        setStatus(
          (p.status === 'paused' || p.status === 'sold_out'
            ? p.status
            : 'active')
        );
        setDistrict(p.location?.district || '');
        setImages(p.images || []);
      } else {
        setError('Product not found.');
      }
    } catch {
      setError('Failed to fetch product data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && token) {
      loadProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

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
        setTimeout(() => router.push('/farmer'), 1200);
      } else {
        setError(data.error?.message || 'Failed to update product.');
      }
    } catch {
      setError('Network communication error while updating product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-9 h-9 border-4 border-km-green-700 border-t-transparent rounded-full animate-spin" />
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
            Edit Product Listing
          </h1>
          <p className="text-sm text-km-ink-muted">
            Update pricing, available volume, or listing availability.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-km-green-50 border border-km-green-300 rounded-2xl flex items-center gap-3 text-km-green-800 text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

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
        onSubmit={handleUpdate}
        className="bg-white border-2 border-km-green-200 rounded-3xl p-6 sm:p-8 shadow-km-sm space-y-6"
      >
        {images.length > 0 && (
          <div className="space-y-2">
            <span className="block text-xs font-bold text-km-ink-muted uppercase tracking-wider">
              Uploaded Photos
            </span>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 rounded-2xl overflow-hidden border border-km-green-200 flex-shrink-0"
                >
                  <Image
                    src={resolveImageUrl(img)}
                    alt={`${title} photo ${i + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-km-ink flex items-center gap-2 border-b border-km-green-100 pb-2">
            <Package className="w-4 h-4 text-km-green-700" />
            <span>Product Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-km-ink mb-1.5">
                Product Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="km-input py-3.5 text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-km-ink mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="km-input py-3.5 text-base"
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
            <label className="block text-sm font-bold text-km-ink mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="km-input text-base"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-km-ink flex items-center gap-2 border-b border-km-green-100 pb-2">
            <Coins className="w-4 h-4 text-km-green-700" />
            <span>Pricing & Stock</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-km-ink mb-1.5">
                Unit
              </label>
              <select
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
              <label className="block text-sm font-bold text-km-ink mb-1.5">
                Price (PKR / {unit})
              </label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="km-input py-3.5 text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-km-ink mb-1.5">
                Quantity Available
              </label>
              <input
                type="number"
                required
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="km-input py-3.5 text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-km-ink mb-1.5">
                Minimum Order Quantity
              </label>
              <input
                type="number"
                required
                min="1"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="km-input py-3.5 text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-km-ink mb-1.5">
                Listing Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as 'active' | 'paused' | 'sold_out'
                  )
                }
                className="km-input py-3.5 text-base"
              >
                <option value="active">Active (Visible in Marketplace)</option>
                <option value="paused">Paused (Temporarily Hidden)</option>
                <option value="sold_out">Sold Out</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-km-green-100 flex items-center justify-end gap-3">
          <Link href="/farmer" className="km-btn-outline py-3.5">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="km-btn-primary px-8 py-3.5 text-base"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
