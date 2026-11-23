'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import {
  ShieldCheck,
  TrendingUp,
  Scale,
  Users,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  ShoppingCart,
  Camera,
  Gavel,
  Truck,
  Handshake,
  Smartphone,
  Globe,
  Coins,
  MapPin,
  Search,
  Quote,
  Sprout,
  MinusCircle,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { API_BASE } from '@/lib/api';
import ProductCard from '@/components/ui/ProductCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import SectionHeader from '@/components/ui/SectionHeader';

export default function HomePage() {
  const { locale } = useLanguage();
  const isUrdu = locale === 'ur';

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [howItWorksTab, setHowItWorksTab] = useState<'farmer' | 'buyer'>('farmer');

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

  const farmerSteps = [
    {
      step: '01',
      icon: UserCheck,
      title: isUrdu ? 'مفت کسان اکاؤنٹ بنائیں' : 'Create a Free Account',
      desc: isUrdu
        ? 'صرف اپنا نام، فون نمبر اور ضلع درج کر کے ایک منٹ میں رجسٹر ہوں۔'
        : 'Register in under a minute using only your name, phone number, and district.',
    },
    {
      step: '02',
      icon: Camera,
      title: isUrdu ? 'فصل اور ۲ تصاویر اپ لوڈ کریں' : 'List Produce with Photos',
      desc: isUrdu
        ? 'فصل کی مقدار، کم سے کم قیمت اور ۲ حقیقی تصاویر شامل کر کے منڈی میں پیش کریں۔'
        : 'Add crop volume, your reserve price, and clear farm photos so buyers trust quality.',
    },
    {
      step: '03',
      icon: Gavel,
      title: isUrdu ? 'شفاف بولیاں وصول کریں' : 'Receive Competitive Bids',
      desc: isUrdu
        ? 'ملک بھر سے تصدیق شدہ خریدار بولی لگاتے ہیں اور سب سے بہترین قیمت جیتتی ہے۔'
        : 'Verified wholesalers, mills, and buyers bid competitively—the highest offer wins.',
    },
    {
      step: '04',
      icon: Handshake,
      title: isUrdu ? 'براہِ راست ادائیگی اور حوالگی' : 'Direct Handover & Cash Payment',
      desc: isUrdu
        ? 'پسندیدہ بولی قبول کریں، خریدار سے براہِ راست رابطہ کریں اور نقد رقم حاصل کریں۔'
        : 'Accept the best offer, connect directly with the buyer, and settle in cash on delivery.',
    },
  ];

  const buyerSteps = [
    {
      step: '01',
      icon: Search,
      title: isUrdu ? 'تازہ فصلیں تلاش کریں' : 'Browse Verified Harvests',
      desc: isUrdu
        ? 'ضلع، فصل کی قسم، قیمت اور مقدار کے حساب سے تازہ ترین فصلیں فلٹر کریں۔'
        : 'Filter active farm listings by district, crop category, volume, and price range.',
    },
    {
      step: '02',
      icon: Camera,
      title: isUrdu ? 'معیار اور تصاویر دیکھیں' : 'Inspect Real Farm Photos',
      desc: isUrdu
        ? 'ہر فصل کی حقیقی تصاویر، کسان کی تفصیل اور کھیت کا مقام واضح طور پر دیکھیں۔'
        : 'Review multiple batch photos, harvest specifications, and verified grower profiles.',
    },
    {
      step: '03',
      icon: TrendingUp,
      title: isUrdu ? 'شفاف بولی یا انکوائری بھیجیں' : 'Place a Competitive Bid',
      desc: isUrdu
        ? 'آڑھتی کے بغیر براہِ راست کسان کو اپنی بہترین قیمت اور مطلوبہ مقدار پیش کریں۔'
        : 'Submit your offer directly to the grower with zero intermediary commission.',
    },
    {
      step: '04',
      icon: Truck,
      title: isUrdu ? 'کھیت سے براہِ راست ترسیل' : 'Direct Farm-Gate Procurement',
      desc: isUrdu
        ? 'بولی منظور ہونے پر کسان سے رابطہ کر کے معائنہ اور ترسیل مکمل کریں۔'
        : 'Coordinate loading, on-site quality inspection, and direct COD settlement.',
    },
  ];

  const benefits = [
    {
      icon: Coins,
      title: isUrdu ? 'منصفانہ قیمت، زیرو کمیشن' : 'Fair Prices, 0% Commission',
      desc: isUrdu
        ? 'آڑھتیوں کی ۸ سے ۱۵ فیصد کٹوتی ختم کریں۔ کسان اپنی فصل کا پورا منافع خود رکھتے ہیں۔'
        : 'Eliminate 8%–15% middleman deductions so farmers keep the full value of their harvest.',
    },
    {
      icon: Handshake,
      title: isUrdu ? 'براہِ راست فروخت' : 'Direct Farmer-to-Buyer Trade',
      desc: isUrdu
        ? 'کسانوں اور مل مالکان، تھوک فروشوں اور برآمد کنندگان کے درمیان براہِ راست رابطہ۔'
        : 'Connect growers directly with flour mills, wholesalers, processors, and exporters.',
    },
    {
      icon: Smartphone,
      title: isUrdu ? 'کسانوں کے لیے نہایت آسان' : 'Built for Farmer Simplicity',
      desc: isUrdu
        ? 'بڑے بٹن، واضح تحریر اور مختصر فارمز تاکہ ہر کسان موبائل پر آسانی سے استعمال کر سکے۔'
        : 'Large buttons, clear typography, and minimal forms designed for effortless mobile use.',
    },
    {
      icon: Globe,
      title: isUrdu ? 'مکمل اردو اور انگریزی سپورٹ' : 'Full Native Urdu & English',
      desc: isUrdu
        ? 'ایک کلک پر مکمل اردو (RTL) یا انگریزی زبان میں تبدیل ہونے والا جدید پلیٹ فارم۔'
        : 'Switch seamlessly between English and native Urdu with proper right-to-left layout.',
    },
  ];

  const testimonials = [
    {
      quote: isUrdu
        ? 'پہلے منڈی میں آڑھتی کو کمیشن اور ناجائز کٹوتیاں دینی پڑتی تھیں۔ کسان منڈی پر میں نے اپنی گندم کی فصل براہِ راست مل مالک کو بہترین ریٹ پر بیچی۔'
        : 'Before KissanMandi, I lost a huge share of my tomato harvest to middleman commissions. Listing directly brought three commercial buyers within hours.',
      name: isUrdu ? 'حاجی محمد اکرم' : 'Haji Muhammad Akram',
      role: isUrdu ? 'کسان • مردان، خیبر پختونخوا' : 'Vegetable Grower • Mardan, KP',
    },
    {
      quote: isUrdu
        ? 'ہماری فلور مل کے لیے اب کسانوں سے براہِ راست صاف گندم خریدنا بہت آسان ہو گیا ہے۔ تصاویر اور ضلع کے فلٹر سے وقت اور کرایہ دونوں بچتے ہیں۔'
        : 'Sourcing verified wheat and basmati lots directly from growers in our district has lowered our procurement cost and improved grain consistency.',
      name: isUrdu ? 'چوہدری سلمان طارق' : 'Chaudhry Salman Tariq',
      role: isUrdu ? 'پروکیورمنٹ مینیجر • فیصل آباد' : 'Procurement Manager • Faisalabad',
    },
    {
      quote: isUrdu
        ? 'اردو زبان اور بڑے بٹن ہونے کی وجہ سے مجھے خود اپنی فصل کی تصاویر لگانے اور بولیاں دیکھنے میں کوئی دشواری نہیں ہوئی۔'
        : 'The Urdu interface is clear and easy to follow on my phone. I posted my mango orchard crates in two minutes and received fair offers the same day.',
      name: isUrdu ? 'غلام فرید' : 'Ghulam Farid',
      role: isUrdu ? 'باغبان • ملتان، پنجاب' : 'Orchard Farmer • Multan, Punjab',
    },
  ];

  const activeSteps = howItWorksTab === 'farmer' ? farmerSteps : buyerSteps;

  return (
    <div className="w-full overflow-x-clip">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-km-cream-100 via-km-cream-50 to-white border-b border-km-green-200/70">
        <div className="km-container py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-6 space-y-6 animate-fade-up">
              <div className="km-eyebrow">
                <ShieldCheck className="w-4 h-4 text-km-green-700" />
                <span>
                  {isUrdu
                    ? 'پاکستان کی براہِ راست زرعی نیلامی منڈی'
                    : "Pakistan's Direct Agri-Marketplace"}
                </span>
              </div>

              <h1 className="font-heading text-hero text-km-ink">
                {isUrdu ? (
                  <>
                    آڑھتی کے بغیر اپنی فصل{' '}
                    <span className="km-highlight">براہِ راست</span> بیچیں اور
                    پورا منافع کمائیں
                  </>
                ) : (
                  <>
                    Sell Your Harvest{' '}
                    <span className="font-accent italic font-bold text-km-green-700">
                      Directly.
                    </span>{' '}
                    Keep <span className="km-highlight">Every Rupee</span> You
                    Earn.
                  </>
                )}
              </h1>

              <p className="text-body-fluid text-km-ink-muted km-measure">
                {isUrdu
                  ? 'کسان منڈی پاکستان کے کسانوں کو تصدیق شدہ خریداروں سے براہِ راست جوڑتی ہے۔ فصل لگائیں، شفاف بولیاں وصول کریں اور بغیر کسی کمیشن کے بہترین قیمت حاصل کریں۔'
                  : 'KissanMandi connects Pakistani farmers directly with verified wholesalers, mills, and buyers. List fresh produce in minutes, receive competitive bids, and trade with 0% middleman commission.'}
              </p>

              {/* Dual Primary CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/register?role=farmer"
                  className="km-btn-primary px-7 py-4 shadow-km-md"
                >
                  <UserCheck className="w-5 h-5" />
                  <span>{isUrdu ? 'میں کسان ہوں' : "I'm a Farmer"}</span>
                </Link>
                <Link
                  href="/register?role=buyer"
                  className="km-btn-outline px-7 py-4 border-km-green-700/40"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{isUrdu ? 'میں خریدار ہوں' : "I'm a Buyer"}</span>
                </Link>
              </div>

              {/* 3 Trust Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-km-green-200/70 max-w-lg">
                <div>
                  <div className="km-stat">2,400+</div>
                  <div className="text-caption text-km-ink-muted mt-1">
                    {isUrdu ? 'رجسٹرڈ کسان' : 'Verified Farmers'}
                  </div>
                </div>
                <div>
                  <div className="km-stat">5,800+</div>
                  <div className="text-caption text-km-ink-muted mt-1">
                    {isUrdu ? 'مکمل فصلیں' : 'Produce Listings'}
                  </div>
                </div>
                <div>
                  <div className="km-stat">28+</div>
                  <div className="text-caption text-km-ink-muted mt-1">
                    {isUrdu ? 'شہر اور اضلاع' : 'Cities & Districts'}
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Photography */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-km-lg border-4 border-white bg-km-cream-200 aspect-[4/3] sm:aspect-[16/11]">
                <Image
                  src="/images/hero-farm.jpg"
                  alt="Pakistani farmer inspecting lush green wheat field at golden hour"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                {/* Floating Trust Badge Card */}
                <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-km-md border border-km-green-200/80 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-km-green-100 flex items-center justify-center flex-shrink-0">
                      <Scale className="w-5 h-5 text-km-green-700" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-km-ink">
                        {isUrdu ? '۰٪ آڑھتی کمیشن' : '0% Middleman Commission'}
                      </p>
                      <p className="text-xs font-medium text-km-ink-muted">
                        {isUrdu
                          ? 'کسان سے خریدار تک براہِ راست شفاف نیلامی'
                          : 'Transparent farm-gate bidding & COD settlement'}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/marketplace"
                    className="hidden sm:inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-km-green-700 hover:bg-km-green-800 text-white text-xs font-bold transition-colors flex-shrink-0"
                  >
                    <span>{isUrdu ? 'مارکیٹ' : 'Explore'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM & SOLUTION SECTION */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="km-container space-y-12">
          <SectionHeader
            badge={isUrdu ? 'مسئلہ اور حل' : 'The Problem & Our Solution'}
            title={
              isUrdu
                ? 'آڑھتی نظام کسان کا منافع کیسے کم کرتا ہے—اور کسان منڈی اسے کیسے حل کرتی ہے'
                : 'Why Traditional Mandis Cost Farmers Their Margin'
            }
            subtitle={
              isUrdu
                ? 'روایتی منڈیوں میں کسان کو غیر شفاف کٹوتیوں اور کم ریٹ کا سامنا کرنا پڑتا ہے۔ کسان منڈی کھلی بولی کے ذریعے انصاف بحال کرتی ہے۔'
                : 'Multiple layers of middlemen erode farmer income while raising prices for commercial buyers. KissanMandi replaces opaque brokerage with open bidding.'
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Traditional Problem Card */}
            <div className="bg-km-cream-100 rounded-3xl p-8 sm:p-10 border border-km-cream-300 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-km-cream-300 text-km-ink-muted text-xs font-bold">
                  <MinusCircle className="w-3.5 h-3.5 text-km-ink-muted" />
                  <span>{isUrdu ? 'روایتی منڈی کا مسئلہ' : 'Traditional Arhti System'}</span>
                </span>
                <h3 className="text-2xl font-extrabold text-km-ink">
                  {isUrdu
                    ? 'کسان کی کمائی کا ۱۵ فیصد تک کمیشن میں ضائع'
                    : 'Up to 15% Lost to Middlemen & Hidden Deductions'}
                </h3>
                <ul className="space-y-3.5 pt-2">
                  {[
                    isUrdu
                      ? '۸٪ سے ۱۵٪ تک آڑھتی کمیشن اور وزن میں غیر منصفانہ کٹوتیاں'
                      : '8%–15% mandatory commission fees plus arbitrary weighing deductions',
                    isUrdu
                      ? 'خریداروں کی اصل قیمت سے لاعلمی اور بند کمروں میں سودے'
                      : 'Zero visibility into what commercial wholesalers actually pay',
                    isUrdu
                      ? 'ادائیگیوں میں ہفتوں کی تاخیر اور کرایہ کا اضافی بوجھ'
                      : 'Delayed cash settlements and forced upfront transport expenses',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-km-ink-muted">
                      <span className="w-5 h-5 rounded-full bg-km-cream-200 text-km-ink-muted flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                        {i + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-km-cream-300/80 text-xs font-bold text-km-ink-subtle">
                {isUrdu
                  ? 'نتیجہ: کسان کو کم منافع اور خریدار کو مہنگی فصل'
                  : 'Result: Lower farmer earnings and inflated wholesale procurement costs.'}
              </div>
            </div>

            {/* KissanMandi Solution Card */}
            <div className="bg-km-green-50 rounded-3xl p-8 sm:p-10 border-2 border-km-green-300 shadow-km-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="km-badge bg-km-green-700 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'کسان منڈی کا حل' : 'The KissanMandi Direct Model'}</span>
                </span>
                <h3 className="text-2xl font-extrabold text-km-ink">
                  {isUrdu
                    ? 'کھلی نیلامی، صفر کمیشن، براہِ راست کسان تا خریدار تجارت'
                    : 'Open Competitive Bidding with 0% Commission'}
                </h3>
                <ul className="space-y-3.5 pt-2">
                  {[
                    isUrdu
                      ? 'کسان خود اپنی کم سے کم قیمت (Reserve Price) مقرر کرتے ہیں'
                      : 'Farmers set their own strict minimum reserve price—no lowball offers',
                    isUrdu
                      ? 'ملک بھر کے خریدار شفاف بولی لگاتے ہیں، سب سے زیادہ قیمت جیتتی ہے'
                      : 'Multiple verified buyers compete openly so market demand sets the price',
                    isUrdu
                      ? 'بولی منظور ہوتے ہی براہِ راست رابطہ اور کیش آن ڈیلیوری (COD)'
                      : 'Instant direct contact handover and guaranteed Cash on Delivery settlement',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-semibold text-km-ink">
                      <CheckCircle2 className="w-5 h-5 text-km-green-700 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-km-green-200 flex items-center justify-between">
                <span className="text-xs font-bold text-km-green-800">
                  {isUrdu
                    ? 'نتیجہ: کسان کو پورا حق اور خریدار کو خالص فصل'
                    : 'Result: Higher margins for growers and fresher produce for buyers.'}
                </span>
                <Link
                  href="/how-it-works"
                  className="text-xs font-extrabold text-km-green-800 hover:underline inline-flex items-center gap-1"
                >
                  <span>{isUrdu ? 'مزید جانیں' : 'Learn more'}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION (FARMERS & BUYERS) */}
      <section className="py-16 sm:py-24 bg-km-cream-100 border-y border-km-cream-300/70">
        <div className="km-container space-y-12">
          <div className="flex flex-col items-center space-y-6">
            <SectionHeader
              badge={isUrdu ? 'آسان ۴ مراحل' : 'Simple 4-Step Process'}
              title={isUrdu ? 'کسان منڈی کیسے کام کرتی ہے؟' : 'How KissanMandi Works'}
              subtitle={
                isUrdu
                  ? 'چاہے آپ فصل فروخت کر رہے ہوں یا تھوک خریداری، پورا عمل شفاف اور چند منٹوں میں مکمل ہوتا ہے۔'
                  : 'Designed for speed and transparency—from farm listing to direct settlement.'
              }
            />

            {/* Role Switcher */}
            <div
              role="tablist"
              aria-label="Select workflow"
              className="inline-flex p-1.5 rounded-2xl bg-white border border-km-green-200 shadow-km-sm"
            >
              <button
                type="button"
                role="tab"
                aria-selected={howItWorksTab === 'farmer'}
                onClick={() => setHowItWorksTab('farmer')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  howItWorksTab === 'farmer'
                    ? 'bg-km-green-700 text-white shadow-km-sm'
                    : 'text-km-ink-muted hover:text-km-ink'
                }`}
              >
                {isUrdu ? 'کسانوں کے لیے' : 'For Farmers'}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={howItWorksTab === 'buyer'}
                onClick={() => setHowItWorksTab('buyer')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  howItWorksTab === 'buyer'
                    ? 'bg-km-green-700 text-white shadow-km-sm'
                    : 'text-km-ink-muted hover:text-km-ink'
                }`}
              >
                {isUrdu ? 'خریداروں کے لیے' : 'For Buyers'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeSteps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="km-card km-card-hover p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-km-green-100 text-km-green-800 flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-extrabold text-km-green-300">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-km-ink">
                      {item.title}
                    </h3>
                    <p className="text-sm text-km-ink-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURED & LATEST LIVE LISTINGS */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="km-container space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionHeader
              align="start"
              badge={isUrdu ? 'تازہ ترین منڈی' : 'Live Marketplace'}
              title={
                isUrdu
                  ? 'تازہ ترین اور نمایاں فصلیں'
                  : 'Featured & Latest Produce Listings'
              }
              subtitle={
                isUrdu
                  ? 'پاکستان بھر کے کسانوں کی جانب سے براہِ راست پیش کی گئی تازہ فصلیں۔'
                  : 'Fresh harvests listed directly by verified growers across Pakistan.'
              }
            />
            <Link
              href="/marketplace"
              className="km-btn-outline self-start sm:self-auto flex-shrink-0"
            >
              <span>{isUrdu ? 'تمام فصلیں دیکھیں' : 'View All Listings'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>

          {loadingListings ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="bg-km-cream-100 rounded-3xl border border-dashed border-km-green-300 p-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-km-green-100 text-km-green-800 flex items-center justify-center mx-auto">
                <Sprout className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-km-ink">
                {isUrdu ? 'نئی فصلیں جلد شامل ہو رہی ہیں' : 'New Harvests Listing Daily'}
              </h3>
              <p className="text-sm text-km-ink-muted max-w-md mx-auto">
                {isUrdu
                  ? 'کسان ابھی اپنی تازہ فصلیں اپ لوڈ کر رہے ہیں۔ آپ اپنی فصل پوسٹ کریں یا مکمل مارکیٹ پلیس دیکھیں۔'
                  : 'Farmers across Punjab, KP, and Sindh are adding fresh seasonal produce. Explore the marketplace or list your harvest today.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link href="/register?role=farmer" className="km-btn-primary">
                  {isUrdu ? 'فصل پوسٹ کریں' : 'List Your Produce'}
                </Link>
                <Link href="/marketplace" className="km-btn-outline">
                  {isUrdu ? 'مارکیٹ پلیس کھولیں' : 'Open Marketplace'}
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isUrdu={isUrdu}
                />
              ))}
            </div>
          )}

          {/* Category Quick Showcase Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-6">
            {[
              {
                title: isUrdu ? 'تازہ سبزیاں' : 'Fresh Vegetables',
                sub: isUrdu ? 'ٹماٹر، پیاز، آلو اور موسمی سبزیاں' : 'Tomatoes, Onions, Potatoes & Greens',
                img: '/images/produce-vegetables.jpg',
                href: '/marketplace/vegetables',
              },
              {
                title: isUrdu ? 'باغات کے پھل' : 'Orchard Fruits',
                sub: isUrdu ? 'آم، کینو اور تازہ پھل' : 'Pakistani Mangoes, Kinnow & Citrus',
                img: '/images/produce-fruits.jpg',
                href: '/marketplace/fruits',
              },
              {
                title: isUrdu ? 'اناج اور چاول' : 'Grains & Basmati Rice',
                sub: isUrdu ? 'گندم، باسمتی چاول اور مکئی' : 'Wheat, Basmati Rice & Maize',
                img: '/images/produce-grains.jpg',
                href: '/marketplace/grains',
              },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative rounded-2xl overflow-hidden aspect-[16/9] shadow-km-sm border border-km-green-200/80"
              >
                <Image
                  src={cat.img}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-km-green-900/85 via-km-green-900/30 to-transparent" />
                <div className="absolute bottom-4 inset-x-4 text-white">
                  <h3 className="text-lg font-extrabold text-white">{cat.title}</h3>
                  <p className="text-xs text-km-green-100 mt-0.5">{cat.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY KISSANMANDI — BENEFITS GRID */}
      <section className="py-16 sm:py-24 bg-km-cream-100 border-y border-km-cream-300/70">
        <div className="km-container space-y-12">
          <SectionHeader
            badge={isUrdu ? 'ہماری خصوصیات' : 'Why KissanMandi'}
            title={
              isUrdu
                ? 'پاکستانی زراعت کے لیے بنایا گیا قابلِ اعتماد پلیٹ فارم'
                : 'Built for Trust, Speed, and Rural Accessibility'
            }
            subtitle={
              isUrdu
                ? 'ہر فیچر کسان کی سہولت اور خریدار کے اعتماد کو مدنظر رکھ کر ڈیزائن کیا گیا ہے۔'
                : 'Every workflow is crafted to protect grower margins and simplify commercial procurement.'
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="km-card km-card-hover p-6 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-km-green-100 text-km-green-800 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-km-ink">
                    {item.title}
                  </h3>
                  <p className="text-sm text-km-ink-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. MISSION / ABOUT SPLIT SECTION */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="km-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-km-lg border border-km-green-200 aspect-[4/3]">
                <Image
                  src="/images/tractor-farmland.jpg"
                  alt="Agricultural tractor cultivating fertile green farmland in Punjab, Pakistan"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6 animate-fade-up">
              <span className="km-eyebrow">
                {isUrdu ? 'ہمارا مشن' : 'Our Mission'}
              </span>
              <h2 className="font-heading text-h2 text-km-ink">
                {isUrdu ? (
                  <>
                    خوشحال کسان،{' '}
                    <span className="km-highlight">مضبوط زرعی پاکستان</span>
                  </>
                ) : (
                  <>
                    Empowering Growers to{' '}
                    <span className="km-highlight">Own Their Market</span>
                  </>
                )}
              </h2>
              <p className="text-body-fluid text-km-ink-muted km-measure">
                {isUrdu
                  ? 'کسان منڈی کا مقصد پاکستان کے لاکھوں چھوٹے اور بڑے کسانوں کو جدید ڈیجیٹل منڈی تک براہِ راست رسائی دینا ہے، تاکہ محنت کا پھل آڑھتی کے بجائے کسان کے گھر پہنچے۔'
                  : 'Agriculture is the backbone of Pakistan, yet farmers receive the smallest share of the final retail price. KissanMandi brings transparent, nationwide price discovery directly to every farmer’s smartphone.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-km-cream-100 border border-km-cream-300/70">
                  <MapPin className="w-5 h-5 text-km-green-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-extrabold text-km-ink">
                      {isUrdu ? 'ملک گیر نیٹ ورک' : 'Nationwide Coverage'}
                    </div>
                    <p className="text-xs text-km-ink-muted mt-0.5">
                      {isUrdu
                        ? 'پنجاب، خیبر پختونخوا، سندھ اور بلوچستان کے اضلاع'
                        : 'Connecting farms across Punjab, KP, Sindh & Balochistan'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-km-cream-100 border border-km-cream-300/70">
                  <Users className="w-5 h-5 text-km-green-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-extrabold text-km-ink">
                      {isUrdu ? 'تصدیق شدہ صارفین' : 'Verified Community'}
                    </div>
                    <p className="text-xs text-km-ink-muted mt-0.5">
                      {isUrdu
                        ? 'فون اور شناختی تصدیق کے ساتھ محفوظ تجارت'
                        : 'Phone-verified farmers and commercial buyers'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/about" className="km-btn-primary">
                  <span>{isUrdu ? 'ہمارے بارے میں پڑھیں' : 'Read Our Story'}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
                <Link href="/mission" className="km-btn-outline">
                  {isUrdu ? 'مشن اور ویژن' : 'Mission & Vision'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS & TRUST SECTION */}
      <section className="py-16 sm:py-24 bg-km-cream-100 border-t border-km-cream-300/70">
        <div className="km-container space-y-12">
          <SectionHeader
            badge={isUrdu ? 'کسانوں اور خریداروں کا اعتماد' : 'Trusted Across Pakistan'}
            title={
              isUrdu
                ? 'ہمارے صارفین کیا کہتے ہیں'
                : 'Stories from Farmers & Commercial Buyers'
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((tItem, i) => (
              <div
                key={i}
                className="km-card p-7 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-km-green-100 text-km-green-700 flex items-center justify-center">
                    <Quote className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-km-ink leading-relaxed font-medium">
                    &ldquo;{tItem.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-km-green-100">
                  <div className="text-sm font-extrabold text-km-ink">
                    {tItem.name}
                  </div>
                  <div className="text-xs font-semibold text-km-green-700 mt-0.5">
                    {tItem.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CALL-TO-ACTION BANNER */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="km-container">
          <div className="relative rounded-3xl overflow-hidden bg-km-green-800 text-white shadow-km-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-km-green-700 border border-km-green-500/40 text-km-green-100 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-km-green-300" />
                  <span>
                    {isUrdu ? 'آج ہی مفت آغاز کریں' : 'Get Started Free Today'}
                  </span>
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {isUrdu
                    ? 'اپنی اگلی فصل براہِ راست کسان منڈی پر فروخت یا خریدیں'
                    : 'Ready to Trade Directly Without Middlemen?'}
                </h2>
                <p className="text-base text-km-green-100 max-w-xl leading-relaxed">
                  {isUrdu
                    ? 'ابھی اپنا مفت اکاؤنٹ بنائیں اور پاکستان کی شفاف ترین زرعی منڈی کا حصہ بنیں۔'
                    : 'Join thousands of growers and buyers building a fairer, faster agricultural marketplace across Pakistan.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <Link
                    href="/register?role=farmer"
                    className="km-btn-light px-7 py-4 text-base"
                  >
                    <UserCheck className="w-5 h-5" />
                    <span>{isUrdu ? 'کسان رجسٹریشن' : "I'm a Farmer"}</span>
                  </Link>
                  <Link
                    href="/register?role=buyer"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-base transition-all"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{isUrdu ? 'خریدار رجسٹریشن' : "I'm a Buyer"}</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative h-64 lg:h-full min-h-[280px]">
                <Image
                  src="/images/mandi-direct.jpg"
                  alt="Pakistani farmer and commercial buyer shaking hands beside fresh produce crates"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
