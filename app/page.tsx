'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import {
  TrendingUp,
  Scale,
  ArrowRight,
  UserCheck,
  Camera,
  Gavel,
  Truck,
  Handshake,
  MapPin,
  Search,
  Quote,
  Clock,
  Sparkles,
  Calculator,
  ChevronRight,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { API_BASE } from '@/lib/api';
import ProductCard from '@/components/ui/ProductCard';
import SkeletonCard from '@/components/ui/SkeletonCard';

export default function HomePage() {
  const { locale } = useLanguage();
  const isUrdu = locale === 'ur';

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [howItWorksTab, setHowItWorksTab] = useState<'farmer' | 'buyer'>('farmer');

  // Duffel-Style Interactive Showcase State
  const [interactiveTab, setInteractiveTab] = useState<'calculator' | 'auction'>('calculator');
  const [selectedCrop, setSelectedCrop] = useState<'rice' | 'wheat' | 'mango' | 'potato'>('rice');
  const [cropVolume, setCropVolume] = useState<number>(300); // In Mann

  // Simulated live auction bids
  const [simulatedBids, setSimulatedBids] = useState([
    {
      id: 1,
      bidder: isUrdu ? 'الرحمان رائس ملز (گوجرانوالہ)' : 'Al-Rehman Rice Mills (Gujranwala)',
      amount: 4450,
      time: isUrdu ? '۲ منٹ پہلے' : '2m ago',
      verified: true,
    },
    {
      id: 2,
      bidder: isUrdu ? 'نیشنل فلور اینڈ کموڈٹیز (کراچی)' : 'National Commodities (Karachi)',
      amount: 4400,
      time: isUrdu ? '۶ منٹ پہلے' : '6m ago',
      verified: true,
    },
    {
      id: 3,
      bidder: isUrdu ? 'حبیب ٹریڈرز (فیصل آباد)' : 'Habib Traders (Faisalabad)',
      amount: 4320,
      time: isUrdu ? '۱۵ منٹ پہلے' : '15m ago',
      verified: false,
    },
  ]);

  useEffect(() => {
    let active = true;
    const fetchLatest = async () => {
      try {
        setLoadingListings(true);
        const res = await fetch(`${API_BASE}/marketplace?limit=6&sort=newest`);
        const data = await res.json();
        if (active && data.success && data.data?.products) {
          setFeaturedProducts(data.data.products);
        }
      } catch (err) {
        console.error('Failed to load featured listings:', err);
      } finally {
        if (active) setLoadingListings(false);
      }
    };
    fetchLatest();
    return () => {
      active = false;
    };
  }, []);

  // Crop calculation data (Prices per Mann in PKR)
  const cropPrices: Record<
    'rice' | 'wheat' | 'mango' | 'potato',
    { name: string; nameUrdu: string; pricePerUnit: number; unit: string; unitUrdu: string }
  > = {
    rice: {
      name: 'Super Kernel Basmati Paddy',
      nameUrdu: 'سپر کرینل باسمتی دھان',
      pricePerUnit: 4400,
      unit: 'Mann (40kg)',
      unitUrdu: 'من (۴۰ کلو)',
    },
    wheat: {
      name: 'Milling Wheat (گندم)',
      nameUrdu: 'پنجاب ملنگ گندم',
      pricePerUnit: 3900,
      unit: 'Mann (40kg)',
      unitUrdu: 'من (۴۰ کلو)',
    },
    mango: {
      name: 'Chaunsa Mango Export Grade',
      nameUrdu: 'چونسہ آم برآمدی گریڈ',
      pricePerUnit: 2800,
      unit: 'Crate (10kg)',
      unitUrdu: 'کریٹ (۱۰ کلو)',
    },
    potato: {
      name: 'Mozika Table Potato',
      nameUrdu: 'موزیکا آلو',
      pricePerUnit: 1950,
      unit: 'Bag (50kg)',
      unitUrdu: 'بوری (۵۰ کلو)',
    },
  };

  const currentCrop = cropPrices[selectedCrop];
  const grossTradeValue = cropVolume * currentCrop.pricePerUnit;
  // Traditional middleman charges: 8% commission + 3% weight cut / munshiana (11% total loss)
  const traditionalMandiLoss = Math.round(grossTradeValue * 0.11);

  const handleAddSimulatedBid = () => {
    const highestAmount = simulatedBids[0]?.amount || 4450;
    const newAmount = highestAmount + 50;
    const newBid = {
      id: Date.now(),
      bidder: isUrdu ? 'صدیقی ایگری ایکسپو (لاہور)' : 'Siddiqui Agri Export (Lahore)',
      amount: newAmount,
      time: isUrdu ? 'ابھی' : 'Just now',
      verified: true,
    };
    setSimulatedBids([newBid, ...simulatedBids.slice(0, 2)]);
  };

  const farmerSteps = [
    {
      step: '01',
      icon: UserCheck,
      title: isUrdu ? 'مفت کسان اکاؤنٹ بنائیں' : 'Create Free Account',
      desc: isUrdu
        ? 'صرف اپنا نام، فون نمبر اور ضلع درج کر کے ایک منٹ میں رجسٹر ہوں۔'
        : 'Register in under 60 seconds with your phone number and agricultural district.',
    },
    {
      step: '02',
      icon: Camera,
      title: isUrdu ? 'فصل اور ۲ تصاویر اپ لوڈ کریں' : 'List Harvest with Photos',
      desc: isUrdu
        ? 'فصل کی مقدار، کم سے کم قیمت اور ۲ حقیقی تصاویر شامل کر کے منڈی میں پیش کریں۔'
        : 'Specify crop volume, minimum reserve price, and clear field photographs.',
    },
    {
      step: '03',
      icon: Gavel,
      title: isUrdu ? 'شفاف بولیاں وصول کریں' : 'Receive Open Bids',
      desc: isUrdu
        ? 'ملک بھر سے تصدیق شدہ خریدار بولی لگاتے ہیں اور سب سے بہترین قیمت جیتتی ہے۔'
        : 'Verified mills, wholesalers, and exporters place competing bids in real time.',
    },
    {
      step: '04',
      icon: Handshake,
      title: isUrdu ? 'براہِ راست ادائیگی اور حوالگی' : 'Direct Settlement & COD',
      desc: isUrdu
        ? 'پسندیدہ بولی قبول کریں، خریدار سے براہِ راست رابطہ کریں اور نقد رقم حاصل کریں۔'
        : 'Accept the top offer, coordinate dispatch, and receive full payment upon handover.',
    },
  ];

  const buyerSteps = [
    {
      step: '01',
      icon: Search,
      title: isUrdu ? 'تازہ فصلیں تلاش کریں' : 'Browse Verified Harvests',
      desc: isUrdu
        ? 'ضلع، فصل کی قسم، قیمت اور مقدار کے حساب سے تازہ ترین فصلیں فلٹر کریں۔'
        : 'Filter active listings by province, commodity category, volume, and reserve price.',
    },
    {
      step: '02',
      icon: Camera,
      title: isUrdu ? 'معیار اور تصاویر دیکھیں' : 'Review Crop Specs',
      desc: isUrdu
        ? 'ہر فصل کی حقیقی تصاویر، کسان کی تفصیل اور کھیت کا مقام واضح طور پر دیکھیں۔'
        : 'Inspect verified batch photographs, moisture grades, and farmer credentials.',
    },
    {
      step: '03',
      icon: TrendingUp,
      title: isUrdu ? 'شفاف بولی لگائیں' : 'Place Competitive Bid',
      desc: isUrdu
        ? 'اپنی بولی اور مقدار درج کریں؛ کسان کو فوری اطلاع موصول ہوگی۔'
        : 'Submit your price per Mann or crate; the grower is notified immediately.',
    },
    {
      step: '04',
      icon: Truck,
      title: isUrdu ? 'لوڈنگ پر معائنہ اور ادائیگی' : 'Inspect & Pay at Loading',
      desc: isUrdu
        ? 'فصل کی لوڈنگ پر معائنہ مکمل کریں اور براہِ راست کسان کو کیش یا بینک سے ادا کریں۔'
        : 'Conduct physical inspection at farm-gate dispatch and settle directly with the grower.',
    },
  ];

  return (
    <div className="w-full space-y-20 lg:space-y-28 overflow-hidden pb-16">
      {/* 1. DUFFEL-STYLE HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 lg:pt-20">
        <div className="km-container">
          {/* Eyebrow Pill */}
          <div className="flex justify-center mb-6">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-neutral-200/90 text-xs font-semibold text-neutral-800 shadow-sm hover:border-km-green-400 hover:bg-neutral-50 transition-all duration-200 group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {isUrdu
                  ? '۰٪ آڑھتی کمیشن · پاکستان بھر میں براہِ راست زرعی نیلامی'
                  : '0% Middleman Fees · Direct Farm-Gate Bidding Across Pakistan'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-800 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-all" />
            </Link>
          </div>

          {/* Hero Headline (Duffel GT America Bold with Italic Accent) */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="font-heading font-extrabold text-[36px] sm:text-[54px] lg:text-[68px] text-km-ink leading-[1.08] tracking-tight">
              {isUrdu ? (
                <>
                  زرعی اجناس کی تجارت،{' '}
                  <span className="italic text-km-green-700">بغیر کسی آڑھتی کے۔</span>
                </>
              ) : (
                <>
                  Trade farm produce,{' '}
                  <span className="italic text-km-green-700 font-normal">without the middlemen.</span>
                </>
              )}
            </h1>

            {/* Subtext */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
              {isUrdu
                ? 'پاکستان کی پہلی ڈیجیٹل ایگری منڈی جہاں کسان اپنی فصلیں براہِ راست پیش کرتے ہیں، تصدیق شدہ خریدار کھلی بولیاں لگاتے ہیں اور پوری رقم کسان کو ملتی ہے۔'
                : 'Connect verified Pakistani growers directly with commercial flour mills, rice exporters, and wholesale buyers. Transparent bidding, photo-verified harvests, and 100% retained grower margin.'}
            </p>

            {/* Duffel-Style CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/marketplace"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-km-ink text-white font-medium text-sm hover:bg-km-green-800 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <span>{isUrdu ? 'مارکیٹ پلیس دیکھیں' : 'Explore Marketplace'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
              <Link
                href="/farmer/post"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-neutral-800 font-medium text-sm border border-neutral-200/90 hover:bg-neutral-50 hover:border-neutral-300 transition-all active:scale-[0.98]"
              >
                <span>{isUrdu ? 'فصل پوسٹ کریں (کسان)' : 'Post Produce as Farmer'}</span>
              </Link>
            </div>
          </div>

          {/* Duffel-Style Hero Visual Frame with Micro-Floating Cards */}
          <div className="mt-12 sm:mt-16 relative">
            <div className="relative rounded-3xl overflow-hidden border border-black/[0.08] shadow-2xl bg-white aspect-[16/10] sm:aspect-[21/9]">
              <Image
                src="/images/hero-farm.jpg"
                alt="Pakistani farmer inspecting healthy wheat harvest"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Floating Live Badge 1: Top Left */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/90 backdrop-blur-md border border-white/60 p-3 sm:p-4 rounded-2xl shadow-lg max-w-[280px] sm:max-w-xs text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">
                    {isUrdu ? 'لائیو بولی قبول ہوئی' : 'Live Bid Accepted'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {isUrdu ? '۰٪ کمیشن' : '0% Fee'}
                  </span>
                </div>
                <p className="text-neutral-600 font-medium">
                  {isUrdu
                    ? 'سپر کرنل باسمتی · ۵۰۰ من — ₨ ۴،۴۵۰/من (سرگودھا)'
                    : 'Basmati 386 · 500 Mann — ₨ 4,450/Mann (Sargodha)'}
                </p>
              </div>

              {/* Floating Live Badge 2: Bottom Right */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[#0E2015]/90 backdrop-blur-md border border-[#235034] p-3 sm:p-4 rounded-2xl shadow-xl text-white text-xs max-w-[260px] sm:max-w-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-emerald-200">
                    {isUrdu ? 'حقیقی تجارت کی شرح' : 'Verified Trade Volume'}
                  </span>
                </div>
                <p className="font-extrabold text-sm sm:text-base tabular-nums text-white">
                  ₨ 850M+ <span className="font-normal text-xs text-neutral-300">Traded Across 45+ Districts</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUFFEL-STYLE INTERACTIVE SHOWCASE (PLATFORM PREVIEW & CALCULATOR) */}
      <section className="km-container">
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-10 lg:p-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-km-green-700">
                {isUrdu ? 'پلیٹ فارم ڈیمو اور منافع کا حساب' : 'Interactive Platform Preview'}
              </span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-km-ink tracking-tight mt-1">
                {isUrdu
                  ? 'دیکھیں کہ کسان منڈی روایتی آڑھت سے کیسے بہتر ہے'
                  : 'Experience the transparency of direct digital trade'}
              </h2>
            </div>

            {/* Segmented Switcher (Duffel-style) */}
            <div className="inline-flex items-center p-1 rounded-full bg-neutral-100 border border-neutral-200/70 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setInteractiveTab('calculator')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  interactiveTab === 'calculator'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-km-green-700" />
                <span>{isUrdu ? 'منافع کیلکولیٹر' : 'Profit Calculator'}</span>
              </button>
              <button
                type="button"
                onClick={() => setInteractiveTab('auction')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  interactiveTab === 'auction'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Gavel className="w-3.5 h-3.5 text-km-green-700" />
                <span>{isUrdu ? 'لائیو نیلامی ڈیمو' : 'Live Auction Demo'}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: PROFIT CALCULATOR */}
          {interactiveTab === 'calculator' && (
            <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Controls Column */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
                    {isUrdu ? '۱. فصل منتخب کریں' : '1. Select Commodity'}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(
                      [
                        { key: 'rice', label: isUrdu ? 'باسمتی چاول' : 'Basmati Rice' },
                        { key: 'wheat', label: isUrdu ? 'گندم' : 'Milling Wheat' },
                        { key: 'mango', label: isUrdu ? 'چونسہ آم' : 'Chaunsa Mango' },
                        { key: 'potato', label: isUrdu ? 'موزیکا آلو' : 'Table Potato' },
                      ] as const
                    ).map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => setSelectedCrop(c.key)}
                        className={`p-3 rounded-2xl border text-xs font-bold text-left rtl:text-right transition-all ${
                          selectedCrop === c.key
                            ? 'bg-km-green-50 border-km-green-600 text-km-green-900 shadow-sm'
                            : 'bg-white border-neutral-200/80 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      {isUrdu ? '۲. فصل کی مقدار (من یا کریٹ)' : '2. Harvest Volume'}
                    </label>
                    <span className="font-heading font-extrabold text-sm text-km-ink tabular-nums">
                      {cropVolume}{' '}
                      <span className="text-xs font-normal text-neutral-500">
                        {isUrdu ? currentCrop.unitUrdu : currentCrop.unit}
                      </span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="25"
                    value={cropVolume}
                    onChange={(e) => setCropVolume(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-km-green-700"
                  />
                  <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                    <span>50 {isUrdu ? 'من' : 'units'}</span>
                    <span>500 {isUrdu ? 'من' : 'units'}</span>
                    <span>1,000 {isUrdu ? 'من' : 'units'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs text-neutral-600 space-y-1">
                  <div className="flex justify-between">
                    <span>{isUrdu ? 'اوسط مارکیٹ ریٹ:' : 'Estimated Base Benchmark:'}</span>
                    <span className="font-bold text-neutral-900 tabular-nums">
                      ₨ {currentCrop.pricePerUnit.toLocaleString()} / {isUrdu ? currentCrop.unitUrdu : currentCrop.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isUrdu ? 'کل پیداوار کی قیمت:' : 'Gross Harvest Value:'}</span>
                    <span className="font-bold text-neutral-900 tabular-nums">
                      ₨ {grossTradeValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comparison Results Card */}
              <div className="lg:col-span-6 bg-[#0E2015] rounded-3xl p-6 sm:p-8 text-white border border-[#235034] shadow-lg space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#235034]">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                      {isUrdu ? 'کسان منڈی بچت' : 'Retained Value Comparison'}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {isUrdu ? 'آڑھت کا نقصان بمقابلہ کسان منڈی' : 'Traditional Mandi vs KissanMandi'}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#163321] text-km-green-300 flex items-center justify-center">
                    <Scale className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Traditional Mandi */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#162D1F]/50 border border-[#235034]/60 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-neutral-300">
                        {isUrdu ? 'روایتی منڈی (آڑھتی کمیشن، کٹوتی)' : 'Traditional Mandi (Arhti deductions)'}
                      </p>
                      <p className="text-[11px] text-red-300">
                        {isUrdu ? '۱۱٪ آڑھت، منشیانہ، پلے داری کٹوتی' : '11% avg broker commission & cuts'}
                      </p>
                    </div>
                    <span className="font-bold text-red-400 tabular-nums text-sm">
                      - ₨ {traditionalMandiLoss.toLocaleString()}
                    </span>
                  </div>

                  {/* KissanMandi */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#163321] border border-km-green-500/40 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-white">
                        {isUrdu ? 'کسان منڈی (براہِ راست نیلامی)' : 'KissanMandi Direct Trade'}
                      </p>
                      <p className="text-[11px] text-km-green-300">
                        {isUrdu ? '۰٪ کمیشن · کوئی خفیہ کٹوتی نہیں' : '0% commission · Zero deductions'}
                      </p>
                    </div>
                    <span className="font-bold text-emerald-300 tabular-nums text-sm">
                      ₨ 0 fee
                    </span>
                  </div>
                </div>

                {/* Net Extra Margin */}
                <div className="pt-4 border-t border-[#235034] flex items-center justify-between">
                  <div>
                    <p className="text-xs text-neutral-400 uppercase font-semibold">
                      {isUrdu ? 'کسان کے پاس اضافی بچت:' : 'Extra Net Margin in Farmer’s Pocket:'}
                    </p>
                    <p className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-400 tabular-nums mt-0.5">
                      + ₨ {traditionalMandiLoss.toLocaleString()}
                    </p>
                  </div>
                  <Link
                    href="/farmer/post"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-km-green-300 hover:bg-km-green-400 text-[#0A160E] text-xs font-bold transition-all shadow-sm"
                  >
                    <span>{isUrdu ? 'فصل پوسٹ کریں' : 'Post This Batch'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE AUCTION SIMULATOR */}
          {interactiveTab === 'auction' && (
            <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-km-green-100 text-km-green-800">
                      {isUrdu ? 'فعال لسٹنگ نمونہ' : 'Active Batch Preview'}
                    </span>
                    <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{isUrdu ? 'نیلامی جاری ہے' : 'Auction Live'}</span>
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-lg text-km-ink">
                    {isUrdu
                      ? 'سپر کرنل باسمتی دھان (پیداوار ۲۰۲۶) — ۵۰۰ من'
                      : 'Super Kernel Basmati Paddy (Harvest 2026) — 500 Mann'}
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs text-neutral-600">
                    <p>
                      <strong className="text-neutral-900">{isUrdu ? 'کسان:' : 'Farmer:'}</strong>{' '}
                      {isUrdu ? 'حاجی محمد اکرم' : 'Haji Muhammad Akram'}
                    </p>
                    <p>
                      <strong className="text-neutral-900">{isUrdu ? 'مقام:' : 'District:'}</strong>{' '}
                      {isUrdu ? 'سرگودھا، پنجاب' : 'Sargodha, Punjab'}
                    </p>
                    <p>
                      <strong className="text-neutral-900">{isUrdu ? 'کم سے کم قیمت:' : 'Reserve:'}</strong>{' '}
                      ₨ 4,200/Mann
                    </p>
                    <p>
                      <strong className="text-neutral-900">{isUrdu ? 'ادائیگی:' : 'Settlement:'}</strong>{' '}
                      {isUrdu ? 'کیش آن لوڈنگ' : 'Cash at Loading'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddSimulatedBid}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-km-green-700 hover:bg-km-green-800 text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-km-green-300" />
                    <span>{isUrdu ? 'نئی مسابقتی بولی لگائیں (+₨ ۵۰)' : 'Simulate Outbidding (+₨ 50)'}</span>
                  </button>
                  <span className="text-xs text-neutral-500">
                    {isUrdu ? 'کلک کر کے لائیو بولی کا اثر دیکھیں' : 'Click to see live bid reaction'}
                  </span>
                </div>
              </div>

              {/* Live Bids Feed */}
              <div className="lg:col-span-6 bg-neutral-900 rounded-3xl p-6 text-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {isUrdu ? 'لائیو موصولہ بولیاں' : 'Real-Time Incoming Bids'}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{isUrdu ? 'لائیو سٹریمنگ' : 'Live Feed'}</span>
                  </span>
                </div>

                <div className="space-y-2.5">
                  {simulatedBids.map((bid, index) => (
                    <div
                      key={bid.id}
                      className={`p-3.5 rounded-2xl flex items-center justify-between transition-all ${
                        index === 0
                          ? 'bg-[#163321] border border-km-green-500/50 shadow-sm'
                          : 'bg-neutral-800/80 border border-neutral-700/60'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white">{bid.bidder}</p>
                          {bid.verified && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-neutral-700 text-neutral-300">
                              Verified Mill
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400">{bid.time}</p>
                      </div>

                      <div className="text-right rtl:text-left">
                        <span className="font-heading font-extrabold text-base text-emerald-400 tabular-nums">
                          ₨ {bid.amount.toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-neutral-400">/ Mann</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. LOGOS / TRUST METRICS STRIP (Duffel: "Trusted by teams at...") */}
      <section className="km-container text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">
          {isUrdu
            ? 'پاکستان کے ۴۵+ اضلاع اور تجارتی منڈیوں سے تصدیق شدہ کسان اور خریدار'
            : 'TRUSTED BY 12,000+ REGISTERED GROWERS & WHOLESALE BUYERS ACROSS PAKISTAN'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { name: isUrdu ? 'لاہور گرین مارکیٹ' : 'Lahore Grain Exchange', sub: 'Badami Bagh Hub' },
            { name: isUrdu ? 'ملتان مینگو فیڈریشن' : 'Multan Mango Hub', sub: 'Southern Punjab' },
            { name: isUrdu ? 'گوجرانوالہ رائس ملرز' : 'Gujranwala Rice Millers', sub: 'Basmati Belt' },
            { name: isUrdu ? 'سرگودھا کنو ایسوسی ایشن' : 'Sargodha Citrus Growers', sub: 'Bhalwal Orchards' },
            { name: isUrdu ? 'فیصل آباد اگریکلچر چیمبر' : 'Faisalabad Agro Chamber', sub: 'Central Punjab' },
          ].map((partner) => (
            <div
              key={partner.name}
              className="p-4 rounded-2xl bg-white border border-neutral-200/80 text-center space-y-0.5 shadow-sm hover:border-neutral-300 transition-colors"
            >
              <p className="text-xs font-bold text-km-ink">{partner.name}</p>
              <p className="text-[10px] font-medium text-neutral-400">{partner.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DUFFEL-STYLE BENTO GRID / CORE ADVANTAGES WITH RICH VISUALS */}
      <section className="km-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-km-green-700">
            {isUrdu ? 'شفافیت اور فوائد' : 'Core Advantages'}
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-km-ink tracking-tight mt-1">
            {isUrdu
              ? 'کیوں کسان منڈی روایتی نظام کو بدل رہی ہے'
              : 'Why producers and buyers choose direct trade'}
          </h2>
          <p className="text-sm text-neutral-600 mt-2">
            {isUrdu
              ? 'روایتی منڈیوں میں کسان اور خریدار کے درمیان ۸ سے ۱۵ فیصد آڑھتی لے جاتے ہیں۔ ہم یہ کمیشن صفر کر کے براہِ راست رابطہ فراہم کرتے ہیں۔'
              : 'Middlemen take substantial margins while offering zero transparency. We eliminate the broker layer and connect both parties directly.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              image: '/images/mandi-direct.jpg',
              title: isUrdu ? '۰٪ آڑھتی کمیشن' : '0% Middleman Commission',
              desc: isUrdu
                ? 'کسان بولی کی ۱۰۰ فیصد رقم خود رکھتے ہیں۔ نہ کوئی منشیانہ، نہ ناجائز کٹوتی۔'
                : 'Farmers retain 100% of the winning bid. No hidden broker cuts or arbitrary weight discounts.',
              badge: '100% Retained Value',
            },
            {
              image: '/images/produce-grains.jpg',
              title: isUrdu ? 'ملک بھر سے مسابقتی بولیاں' : 'Nationwide Open Bidding',
              desc: isUrdu
                ? 'لاہور، کراچی، فیصل آباد اور راولپنڈی سے براہِ راست تصدیق شدہ ملز اور تاجر بولی لگاتے ہیں۔'
                : 'Commercial mills, wholesalers, and exporters from all provinces bid directly on your batch.',
              badge: 'Direct Mill Auctions',
            },
            {
              image: '/images/produce-fruits.jpg',
              title: isUrdu ? 'تصدیق شدہ حقیقی تصاویر' : 'Photo-Verified Batches',
              desc: isUrdu
                ? 'ہر لسٹنگ میں فصل کے نمونے، حقیقی تصاویر اور مقام واضح ہوتا ہے تاکہ اعتماد قائم رہے۔'
                : 'High-resolution field photography, harvest moisture, and verified grower credentials on every listing.',
              badge: 'Quality Inspection',
            },
            {
              image: '/images/hero-farm.jpg',
              title: isUrdu ? 'آسان اردو اور فون سپورٹ' : 'Native Support & Hotline',
              desc: isUrdu
                ? 'انتہائی سادہ انٹرفیس، اردو میں مکمل رہنمائی اور 0800-KISSAN مفت ہیلپ لائن۔'
                : 'Intuitive interface designed for low-literacy rural users, backed by toll-free phone assistance.',
              badge: '0800-KISSAN',
            },
          ].map((adv) => (
            <div
              key={adv.title}
              className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm hover:border-km-green-300 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                <Image
                  src={adv.image}
                  alt={adv.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-neutral-900 shadow-sm">
                  {adv.badge}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-2">
                <h3 className="font-heading font-bold text-base text-km-ink group-hover:text-km-green-800 transition-colors">
                  {adv.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {adv.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. VISUAL COMMODITY CATEGORIES SHOWCASE */}
      <section className="km-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-km-green-700">
              {isUrdu ? 'زرعی اقسام' : 'Commodity Categories'}
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-km-ink tracking-tight mt-1">
              {isUrdu ? 'فصلوں کی اہم اقسام' : 'Explore Commodities by Category'}
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-km-green-800 hover:text-km-green-900 group"
          >
            <span>{isUrdu ? 'تمام مارکیٹ پلیس' : 'View Full Catalog'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: isUrdu ? 'چاول اور اناج' : 'Grains & Basmati',
              sub: 'Super Kernel, Basmati 386, Punjab Wheat',
              count: '140+ Batches',
              href: '/marketplace/grains',
              image: '/images/produce-grains.jpg',
            },
            {
              title: isUrdu ? 'باغات کے پھل' : 'Orchard Fruits',
              sub: 'Chaunsa, Sindhri Mangoes & Bhalwal Kinnow',
              count: '95+ Batches',
              href: '/marketplace/fruits',
              image: '/images/produce-fruits.jpg',
            },
            {
              title: isUrdu ? 'تازہ سبزیاں' : 'Fresh Vegetables',
              sub: 'Mozika Potatoes, Red Onions & Tomatoes',
              count: '120+ Batches',
              href: '/marketplace/vegetables',
              image: '/images/produce-vegetables.jpg',
            },
            {
              title: isUrdu ? 'کھیت کی براہِ راست پیداوار' : 'Farmland Contracts',
              sub: 'Bulk acreage harvests, direct farm-gate COD',
              count: '80+ Batches',
              href: '/marketplace',
              image: '/images/tractor-farmland.jpg',
            },
          ].map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group bg-white rounded-3xl border border-neutral-200/80 shadow-sm hover:shadow-md hover:border-km-green-300 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-neutral-900 shadow-sm">
                  {cat.count}
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-heading font-bold text-base text-white drop-shadow-sm">
                    {cat.title}
                  </h3>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <p className="text-[11px] text-neutral-500 truncate mr-2">
                  {cat.sub}
                </p>
                <div className="w-6 h-6 rounded-full bg-neutral-100 group-hover:bg-km-green-800 group-hover:text-white text-neutral-600 flex items-center justify-center flex-shrink-0 transition-colors">
                  <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. LIVE MARKETPLACE PRODUCE SECTION (API Integrated) */}
      <section className="km-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-km-green-700">
              {isUrdu ? 'تازہ ترین لسٹنگز' : 'Active Market Batches'}
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-km-ink tracking-tight mt-1">
              {isUrdu ? 'منڈی میں موجود تازہ فصلیں' : 'Latest Harvest Listings Open for Bidding'}
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-km-green-800 hover:text-km-green-900 group"
          >
            <span>{isUrdu ? 'تمام فصلیں دیکھیں' : 'View All Marketplace Listings'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
          </Link>
        </div>

        {loadingListings ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          /* Fallback Showcase when backend database has not seeded listings */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 's1',
                title: isUrdu ? 'سپر کرنل باسمتی چاول (دھان)' : 'Super Kernel Basmati Paddy',
                crop: isUrdu ? 'چاول' : 'Rice',
                qty: '500 Mann (40kg)',
                loc: isUrdu ? 'گوجرانوالہ، پنجاب' : 'Gujranwala, Punjab',
                price: 4450,
                farmer: isUrdu ? 'چوہدری بشیر احمد' : 'Chaudhry Bashir Ahmed',
                img: '/images/produce-grains.jpg',
              },
              {
                id: 's2',
                title: isUrdu ? 'چونسہ آم (برآمدی گریڈ)' : 'Chaunsa Mango Export Grade',
                crop: isUrdu ? 'آم' : 'Mangoes',
                qty: '200 Crates (10kg)',
                loc: isUrdu ? 'ملتان، پنجاب' : 'Multan, Punjab',
                price: 2800,
                farmer: isUrdu ? 'ملک طارق حسین' : 'Malik Tariq Hussain',
                img: '/images/produce-fruits.jpg',
              },
              {
                id: 's3',
                title: isUrdu ? 'پنجاب ملنگ گندم (۲۰۲۶ فصل)' : 'Punjab Milling Wheat (2026 Batch)',
                crop: isUrdu ? 'گندم' : 'Wheat',
                qty: '800 Mann (40kg)',
                loc: isUrdu ? 'سرگودھا، پنجاب' : 'Sargodha, Punjab',
                price: 3950,
                farmer: isUrdu ? 'حاجی محمد اکرم' : 'Haji Muhammad Akram',
                img: '/images/tractor-farmland.jpg',
              },
            ].map((mock) => (
              <div
                key={mock.id}
                className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  <Image
                    src={mock.img}
                    alt={mock.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-neutral-800 shadow-sm">
                    {mock.crop}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-heading font-bold text-base text-km-ink group-hover:text-km-green-800 transition-colors">
                      {mock.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <MapPin className="w-3.5 h-3.5 text-km-green-700 flex-shrink-0" />
                      <span>{mock.loc}</span>
                      <span>•</span>
                      <span>{mock.qty}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                        {isUrdu ? 'بہترین بولی' : 'Highest Bid'}
                      </span>
                      <span className="font-heading font-extrabold text-base text-km-ink tabular-nums">
                        ₨ {mock.price.toLocaleString()}
                      </span>
                    </div>

                    <Link
                      href="/marketplace"
                      className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
                    >
                      {isUrdu ? 'بولی لگائیں' : 'Place Bid'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. DUFFEL-STYLE INVERTED DARK SECTION ("BUILD WITH ZERO LIMITATIONS") */}
      <section className="px-4 sm:px-8">
        <div className="bg-[#0B1A10] text-white rounded-3xl p-8 sm:p-14 lg:p-20 relative overflow-hidden border border-[#162D1F] max-w-7xl mx-auto shadow-2xl">
          <Image
            src="/images/tractor-farmland.jpg"
            alt="Punjab agricultural farmland"
            fill
            className="object-cover object-center opacity-15 mix-blend-luminosity pointer-events-none"
            sizes="(max-width: 1280px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1A10] via-[#0B1A10]/95 to-[#0B1A10]/75 pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              {isUrdu ? 'ادارہ جاتی بنیادی ڈھانچہ' : 'Institutional Infrastructure'}
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              {isUrdu
                ? 'پاکستانی زراعت کے لیے شفاف تجارتی نظام۔'
                : 'Direct trade execution built for Pakistani agriculture.'}
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              {isUrdu
                ? 'کسان منڈی صرف ایک ویب سائٹ نہیں بلکہ پاکستان کی دیہی معیشت کا جدید پلیٹ فارم ہے۔ ہم تصدیق، بولی، اور نقد ادائیگی کے تمام مراحل کو بغیر کسی رکاوٹ کے جوڑتے ہیں۔'
                : 'KissanMandi bridges the gap between rural production and metropolitan food processing. Transparent real-time auctions, physical quality check at loading, and direct producer payment.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#1C3E28]">
              <div>
                <p className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-400 tabular-nums">
                  48 Hours
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  {isUrdu ? 'اوسط نیلامی اور تصفیہ کا وقت' : 'Average Auction & Handover Time'}
                </p>
              </div>
              <div>
                <p className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-400 tabular-nums">
                  0% Commission
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  {isUrdu ? 'کسان کے لیے مستقل زیرو فیس' : 'Permanent Zero Deduction for Growers'}
                </p>
              </div>
              <div>
                <p className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-400 tabular-nums">
                  0800-KISSAN
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  {isUrdu ? 'مفت ہیلپ لائن اور رہنمائی' : 'Toll-Free Voice Assistance'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS (TWO-SIDED INTERACTIVE TABS) */}
      <section className="km-container">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-km-green-700">
            {isUrdu ? 'طریقہ کار' : 'How It Works'}
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-km-ink tracking-tight mt-1">
            {isUrdu ? 'سادہ اور شفاف ۴ مراحل' : 'Simple 4-Step Process'}
          </h2>
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center p-1 rounded-full bg-neutral-100 border border-neutral-200/80">
              <button
                type="button"
                onClick={() => setHowItWorksTab('farmer')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  howItWorksTab === 'farmer'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {isUrdu ? 'کسانوں کے لیے' : 'For Farmers (کسان)'}
              </button>
              <button
                type="button"
                onClick={() => setHowItWorksTab('buyer')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  howItWorksTab === 'buyer'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {isUrdu ? 'خریداروں کے لیے' : 'For Buyers (تجارتی خریدار)'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(howItWorksTab === 'farmer' ? farmerSteps : buyerSteps).map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="p-8 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-4 hover:border-neutral-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-extrabold text-2xl text-km-green-700 tabular-nums">
                    {st.step}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-base text-km-ink">
                  {st.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Visual Workflow Assurance Banner */}
        <div className="mt-8 bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm overflow-hidden">
          <div className="relative w-full md:w-64 h-36 rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-100">
            <Image
              src="/images/mandi-direct.jpg"
              alt="Direct crop trade between farmer and buyer"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 256px"
            />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left rtl:md:text-right">
            <span className="text-[10px] uppercase font-bold tracking-widest text-km-green-700">
              Guaranteed Direct Settlement
            </span>
            <h4 className="font-heading font-bold text-lg text-km-ink">
              Direct Physical Inspection & Cash on Delivery (COD)
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
              Every successful auction concludes with direct coordination between the grower and the buyer. Inspect crop quality on-site at vehicle loading, verify exact weight, and complete payment immediately.
            </p>
          </div>
          <Link
            href="/how-it-works"
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            <span>Full Operational Guide</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </section>

      {/* 8. VERIFIED TESTIMONIALS / CASE STUDIES */}
      <section className="km-container">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-km-green-700">
            {isUrdu ? 'حقیقی کسانوں کے تاثرات' : 'Verified Grower Stories'}
          </span>
          <h2 className="font-heading font-bold text-3xl text-km-ink tracking-tight mt-1">
            {isUrdu ? 'ہمارے صارفین کیا کہتے ہیں' : 'Trusted by commercial growers and millers'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: isUrdu
                ? 'پہلے غلہ منڈی میں آڑھتی من مانی کٹوتیاں کر لیتے تھے۔ کسان منڈی پر گوجرانوالہ کی مل نے براہِ راست بولی دی اور مجھے فی من ۳۵۰ روپے زائد منافع ملا۔'
                : 'Earlier, local brokers took huge deductions on our basmati paddy. On KissanMandi, a Gujranwala rice mill placed a direct bid, yielding ₨ 350 more per Mann.',
              author: isUrdu ? 'حاجی محمد اکرم' : 'Haji Muhammad Akram',
              role: isUrdu ? 'باسمتی چاول کے کاشتکار' : 'Basmati Rice Grower',
              location: isUrdu ? 'سرگودھا، پنجاب' : 'Sargodha, Punjab',
              gain: '+28% Retained Margin',
            },
            {
              quote: isUrdu
                ? 'ہم کراچی میں گروسری اور ہول سیل سپلائی کرتے ہیں۔ کسان منڈی سے ہمیں ملتان کے باغات سے براہِ راست تصدیق شدہ چونسہ ملا، وہ بھی بغیر کسی مڈل مین کے۔'
                : 'We operate wholesale distribution in Karachi. Sourcing directly from verified Multan mango orchards gave us unmatched freshness and zero broker markups.',
              author: isUrdu ? 'سلمان رشید' : 'Salman Rasheed',
              role: isUrdu ? 'ہول سیل زرعی خریدار' : 'Wholesale Commodity Buyer',
              location: isUrdu ? 'کراچی، سندھ' : 'Karachi, Sindh',
              gain: 'Zero Middleman Markups',
            },
            {
              quote: isUrdu
                ? 'نہایت آسان انٹرفیس ہے۔ میں نے اپنے موبائل سے ۲ تصاویر کھینچیں اور منٹوں میں لسٹنگ کر دی۔ گندم کی فصل کی نیلامی ۴۸ گھنٹوں میں مکمل ہو گئی۔'
                : 'Extremely simple to use. I took two photos on my smartphone, posted the wheat lot, and verified buyers from Lahore competed for the entire batch in 48 hours.',
              author: isUrdu ? 'چوہدری طارق باجوہ' : 'Chaudhry Tariq Bajwa',
              role: isUrdu ? 'گندم اور مکئی کاشتکار' : 'Wheat & Corn Producer',
              location: isUrdu ? 'وہاڑی، پنجاب' : 'Vehari, Punjab',
              gain: '48hr Direct Settlement',
            },
          ].map((t) => (
            <div
              key={t.author}
              className="p-8 rounded-3xl bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-km-green-300" />
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <p className="font-heading font-bold text-sm text-km-ink">{t.author}</p>
                  <p className="text-[11px] text-neutral-500">{t.role} · {t.location}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-km-green-100 text-km-green-800">
                  {t.gain}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. DUFFEL-STYLE PRE-FOOTER CALL TO ACTION */}
      <section className="km-container">
        <div className="bg-gradient-to-r from-km-green-50 via-white to-km-cream-100 rounded-3xl p-8 sm:p-14 border border-km-green-200/80 shadow-sm text-center max-w-4xl mx-auto space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-km-green-800">
            {isUrdu ? 'آج ہی شامل ہوں' : 'Get Started Today'}
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-km-ink tracking-tight">
            {isUrdu
              ? 'کیا آپ اپنی فصل یا ہول سیل خریداری کو منافع بخش بنانا چاہتے ہیں؟'
              : 'Ready to trade produce directly with zero broker deductions?'}
          </h2>
          <p className="max-w-xl mx-auto text-sm text-neutral-600">
            {isUrdu
              ? 'کسان منڈی پر مفت اکاؤنٹ بنا کر آج ہی اپنی پہلی فصل پیش کریں یا ملک بھر کی تصدیق شدہ فصلوں پر بولی لگائیں۔'
              : 'Join thousands of registered Pakistani growers and verified institutional buyers on the country’s premier agricultural bidding exchange.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-km-ink text-white font-medium text-sm hover:bg-km-green-800 shadow-sm hover:shadow transition-all active:scale-[0.98]"
            >
              <span>{isUrdu ? 'مفت اکاؤنٹ بنائیں' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
            <Link
              href="/marketplace"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-neutral-800 font-medium text-sm border border-neutral-200/90 hover:bg-neutral-50 transition-all active:scale-[0.98]"
            >
              <span>{isUrdu ? 'مارکیٹ پلیس دیکھیں' : 'Browse All Produce'}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
