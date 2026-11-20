'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Tag,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Package,
  Layers,
  Phone,
  CheckCircle,
  Filter,
  X,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { API_BASE, resolveImageUrl } from '@/lib/api';

const PRODUCT_CATEGORIES = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains',
  'Pulses',
  'Oilseeds',
  'Cotton',
  'Sugarcane',
  'Other',
];

const PAKISTAN_DISTRICTS = [
  'All Locations',
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
  'Peshawar',
  'Swat',
  'Charsadda',
  'Hyderabad',
  'Sukkur',
  'Quetta',
];

function MarketplaceContent({
  initialCategory,
}: {
  initialCategory?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<
    Array<{ name: string; slug: string; activeCount: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || searchParams?.get('category') || 'All'
  );
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');
  const [selectedDistrict, setSelectedDistrict] = useState(
    searchParams?.get('district') || 'All Locations'
  );
  const [minPrice, setMinPrice] = useState(searchParams?.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams?.get('maxPrice') || '');
  const [minQuantity, setMinQuantity] = useState(searchParams?.get('minQuantity') || '');
  const [sortBy, setSortBy] = useState(searchParams?.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams?.get('page')) || 1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Load Categories on mount
  useEffect(() => {
    fetch(`${API_BASE}/marketplace/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategoriesWithCounts(data.data);
        }
      })
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Fetch filtered products
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedDistrict, minPrice, maxPrice, minQuantity, sortBy, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (selectedDistrict && selectedDistrict !== 'All Locations') {
        params.append('district', selectedDistrict);
      }
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      if (minPrice) {
        params.append('minPrice', minPrice);
      }
      if (maxPrice) {
        params.append('maxPrice', maxPrice);
      }
      if (minQuantity) {
        params.append('minQuantity', minQuantity);
      }
      if (sortBy) {
        params.append('sort', sortBy);
      }
      params.append('page', page.toString());
      params.append('limit', '12');

      const res = await fetch(`${API_BASE}/marketplace?${params.toString()}`);
      const data = await res.json();

      if (data.success && data.data) {
        setProducts(data.data.products || []);
        if (data.data.pagination) {
          setPagination(data.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedDistrict('All Locations');
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setMinQuantity('');
    setSortBy('newest');
    setPage(1);
  };

  const getCategoryCount = (categoryName: string) => {
    if (categoryName === 'All') return null;
    const found = categoriesWithCounts.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    return found ? found.activeCount : null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Marketplace Header */}
      <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl">
          <span className="px-3 py-1 bg-[#8FD19E]/20 text-[#2B2B2B] font-bold text-xs rounded-full uppercase tracking-wider inline-block mb-3">
            Direct Trade Marketplace
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#2B2B2B] tracking-tight">
            Fresh Produce & Agricultural Crops
          </h1>
          <p className="text-gray-600 text-base mt-2">
            Procure verified harvests directly from Pakistani farmers. Transparent pricing, zero middleman markups, and direct fulfillment.
          </p>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by crop name (e.g. Tomatoes, Wheat, Mangoes) or district..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 text-sm font-semibold focus:outline-none focus:border-[#8FD19E] bg-gray-50/50"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-sm rounded-2xl shadow-sm transition-all"
          >
            Search Produce
          </button>
        </form>
      </div>

      {/* Category Pills Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Filter by Category
          </span>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="md:hidden flex items-center gap-1.5 text-xs font-bold text-[#2B2B2B] px-3 py-1.5 rounded-xl border border-gray-200"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {PRODUCT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            const count = getCategoryCount(cat);

            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                  isSelected
                    ? 'bg-[#8FD19E] text-[#2B2B2B] shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#8FD19E] hover:text-[#2B2B2B]'
                }`}
              >
                <span>{cat}</span>
                {count !== null && count > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isSelected ? 'bg-white/80 text-[#2B2B2B]' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hidden md:grid grid-cols-12 gap-4 items-center">
        {/* District Filter */}
        <div className="col-span-3">
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
            District / Location
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:border-[#8FD19E] bg-white text-[#2B2B2B]"
          >
            {PAKISTAN_DISTRICTS.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* Price Min / Max */}
        <div className="col-span-3">
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
            Price Range (PKR)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setPage(1);
              }}
              className="w-1/2 px-2.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#8FD19E]"
            />
            <span className="text-gray-300">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setPage(1);
              }}
              className="w-1/2 px-2.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#8FD19E]"
            />
          </div>
        </div>

        {/* Min Quantity */}
        <div className="col-span-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
            Min Quantity
          </label>
          <input
            type="number"
            placeholder="e.g. 500"
            value={minQuantity}
            onChange={(e) => {
              setMinQuantity(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#8FD19E]"
          />
        </div>

        {/* Sorting */}
        <div className="col-span-3">
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
            Sort Listings
          </label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:border-[#8FD19E] bg-white text-[#2B2B2B]"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="qty_desc">Quantity: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* Reset button */}
        <div className="col-span-1 pt-4 flex justify-end">
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-gray-500 hover:text-black underline"
            title="Clear all filters"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="md:hidden bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-sm font-bold text-[#2B2B2B]">Filter Listings</span>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="text-gray-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
            >
              {PAKISTAN_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Price Range (PKR)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 px-3 py-2 rounded-xl border border-gray-300 text-xs"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 px-3 py-2 rounded-xl border border-gray-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="qty_desc">Quantity: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleResetFilters}
              className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
            >
              Reset
            </button>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-[#8FD19E] text-[#2B2B2B] text-xs font-bold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Product Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-600">
            Showing <span className="text-[#2B2B2B]">{products.length}</span> of{' '}
            <span className="text-[#2B2B2B]">{pagination.total}</span> produce offerings
          </p>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-4 border-[#8FD19E] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-bold text-gray-500">Searching active marketplace listings...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8">
            <Package className="w-14 h-14 text-gray-300 mx-auto mb-3" />
            <h3 className="text-xl font-black text-[#2B2B2B]">No produce found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              No active listings match your current filters. Try resetting the category, price, or location filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 px-6 py-2.5 bg-[#FAF6EA] border border-[#8FD19E] text-[#2B2B2B] text-sm font-bold rounded-xl hover:bg-[#8FD19E]/20 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const mainImage = resolveImageUrl(product.images?.[0]);

              return (
                <div
                  key={product._id}
                  className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden hover:border-[#8FD19E] hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Header */}
                    <Link
                      href={`/marketplace/products/${product.slug || product._id}`}
                      className="block relative h-52 bg-gray-100 overflow-hidden"
                    >
                      <img
                        src={mainImage}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-[#2B2B2B] shadow-sm">
                          {product.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-[#8FD19E] rounded-full text-[11px] font-black text-[#2B2B2B] shadow-sm">
                          Active Stock
                        </span>
                      </div>
                    </Link>

                    {/* Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <Link
                          href={`/marketplace/products/${product.slug || product._id}`}
                          className="text-xl font-black text-[#2B2B2B] hover:text-[#6DBE82] transition-colors line-clamp-1 block"
                        >
                          {product.title}
                        </Link>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{product.location?.district} District</span>
                        </p>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="bg-[#FAF6EA] p-3 rounded-2xl flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-gray-500 font-semibold block">
                            Direct Farmer Price
                          </span>
                          <span className="text-lg font-black text-[#2B2B2B]">
                            PKR {product.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500"> / {product.unit}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-gray-500 font-semibold block">
                            Available Volume
                          </span>
                          <span className="text-base font-black text-[#2B2B2B]">
                            {product.quantity.toLocaleString()} {product.unit}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                        <span>Min Order: <strong className="text-[#2B2B2B]">{product.minOrder} {product.unit}</strong></span>
                        <span className="flex items-center gap-1 text-[#2B2B2B] font-semibold">
                          <CheckCircle className="w-3.5 h-3.5 text-[#6DBE82]" />
                          {product.farmer?.name || 'Verified Farmer'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <Link
                      href={`/marketplace/products/${product.slug || product._id}`}
                      className="w-full py-2.5 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-sm rounded-xl text-center shadow-sm transition-all"
                    >
                      View Produce & Inquire
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrevPage}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:border-[#8FD19E] disabled:opacity-40 disabled:hover:border-gray-200 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    pagination.page === num
                      ? 'bg-[#8FD19E] text-[#2B2B2B]'
                      : 'border border-gray-200 text-gray-700 hover:border-[#8FD19E]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:border-[#8FD19E] disabled:opacity-40 disabled:hover:border-gray-200 flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MarketplacePage({
  initialCategory,
}: {
  initialCategory?: string;
}) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#8FD19E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <MarketplaceContent initialCategory={initialCategory} />
    </React.Suspense>
  );
}
