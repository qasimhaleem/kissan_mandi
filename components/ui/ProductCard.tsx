'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, CheckCircle2, ArrowRight, Package } from 'lucide-react';
import { Product } from '@/lib/types';
import { resolveImageUrl } from '@/lib/api';

const CATEGORY_FALLBACK: Record<string, string> = {
  vegetables: '/images/produce-vegetables.jpg',
  fruits: '/images/produce-fruits.jpg',
  grains: '/images/produce-grains.jpg',
  pulses: '/images/produce-grains.jpg',
  oilseeds: '/images/produce-grains.jpg',
  cotton: '/images/tractor-farmland.jpg',
  sugarcane: '/images/hero-farm.jpg',
};

export function getCategoryFallbackImage(category?: string): string {
  if (!category) return '/images/produce-vegetables.jpg';
  return CATEGORY_FALLBACK[category.toLowerCase()] || '/images/produce-vegetables.jpg';
}

interface ProductCardProps {
  product: Product;
  ctaLabel?: string;
  isUrdu?: boolean;
}

export default function ProductCard({
  product,
  ctaLabel,
  isUrdu = false,
}: ProductCardProps) {
  const fallbackSrc = getCategoryFallbackImage(product.category);
  const initialSrc = product.images?.[0]
    ? resolveImageUrl(product.images[0])
    : fallbackSrc;

  const [imgSrc, setImgSrc] = useState(initialSrc);
  const href = `/marketplace/products/${product.slug || product._id}`;

  return (
    <article className="group bg-white rounded-2xl border border-km-green-200/80 shadow-km-sm hover:shadow-km-md hover:border-km-green-400 transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        <Link href={href} className="block relative aspect-[4/3] w-full bg-km-cream-200 overflow-hidden">
          <Image
            src={imgSrc}
            alt={`${product.title} — ${product.location?.district || 'Pakistan'}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            onError={() => setImgSrc(fallbackSrc)}
          />
          <div className="absolute top-3 start-3 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-km-green-800 text-xs font-bold shadow-km-sm">
              {product.category}
            </span>
          </div>
          <div className="absolute top-3 end-3">
            <span className="px-2.5 py-1 rounded-full bg-km-green-700 text-white text-[11px] font-bold shadow-km-sm">
              {isUrdu ? 'دستیاب' : 'Active'}
            </span>
          </div>
        </Link>

        <div className="p-5 space-y-3.5">
          <div>
            <Link
              href={href}
              className="text-lg font-extrabold text-km-ink hover:text-km-green-700 transition-colors line-clamp-1 block"
            >
              {product.title}
            </Link>
            <div className="flex items-center gap-1.5 text-xs font-medium text-km-ink-muted mt-1">
              <MapPin className="w-3.5 h-3.5 text-km-green-600 flex-shrink-0" />
              <span>
                {product.location?.district || 'Pakistan'}{' '}
                {isUrdu ? 'ضلع' : 'District'}
              </span>
            </div>
          </div>

          <div className="bg-km-cream-100 rounded-xl p-3.5 border border-km-cream-300/60 flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-semibold text-km-ink-muted block">
                {isUrdu ? 'موجودہ قیمت / بولی' : 'Direct Price'}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-extrabold text-km-green-800">
                  PKR {product.price.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-km-ink-subtle">
                  / {product.unit}
                </span>
              </div>
            </div>

            <div className="text-end">
              <span className="text-[11px] font-semibold text-km-ink-muted block">
                {isUrdu ? 'مقدار' : 'Quantity'}
              </span>
              <div className="flex items-center justify-end gap-1 text-sm font-bold text-km-ink mt-0.5">
                <Package className="w-3.5 h-3.5 text-km-green-600" />
                <span>
                  {product.quantity.toLocaleString()} {product.unit}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-km-ink-muted pt-0.5">
            <span>
              {isUrdu ? 'کم از کم آرڈر:' : 'Min Order:'}{' '}
              <strong className="text-km-ink">
                {product.minOrder} {product.unit}
              </strong>
            </span>
            <span className="inline-flex items-center gap-1 text-km-green-800 font-semibold truncate max-w-[140px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-km-green-600 flex-shrink-0" />
              <span className="truncate">{product.farmer?.name || (isUrdu ? 'تصدیق شدہ کسان' : 'Verified Farmer')}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-1">
        <Link
          href={href}
          className="w-full km-btn-primary py-2.5 text-sm"
        >
          <span>{ctaLabel || (isUrdu ? 'تفصیل دیکھیں اور بولی لگائیں' : 'View & Place Bid')}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>
    </article>
  );
}
