'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  Scale,
  Users,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  ShoppingCart,
  Clock,
  MapPin,
  Building2,
} from 'lucide-react';

export default function HomePage() {
  const { locale, t } = useLanguage();
  const isUrdu = locale === 'ur';

  return (
    <div className="space-y-16 md:space-y-24 py-6 md:py-10 max-w-6xl mx-auto px-4">
      {/* 1. Hero Section */}
      <section className="text-center space-y-6 pt-4 pb-8 md:pt-10 md:pb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#8FD19E] shadow-sm text-xs font-bold text-[#2B2B2B]">
          <ShieldCheck className="w-4 h-4 text-[#6DBE82]" />
          <span>{isUrdu ? 'آڑھتی کے بغیر براہِ راست زرعی منڈی' : 'Zero Commission Direct Agricultural Trade'}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#2B2B2B] tracking-tight max-w-4xl mx-auto leading-tight">
          {isUrdu
            ? 'کسان کی محنت کا پورا معاوضہ، خریدار کو تازہ فصل شفاف قیمت پر'
            : 'Fair Prices for Farmers. Fresh Produce for Verified Buyers.'}
        </h1>

        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
          {isUrdu
            ? 'کسان منڈی پاکستان کا پہلا جدید نیلامی پلیٹ فارم ہے جہاں کسان اپنی فصلیں براہِ راست پیش کرتے ہیں اور خریدار شفاف بولی کے ذریعے بہترین دام فراہم کرتے ہیں۔'
            : 'KissanMandi connects agricultural producers directly with commercial buyers, eliminating monopolistic commission agents and establishing competitive, transparent auction pricing.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-xl mx-auto">
          <Link
            href="/register?role=farmer"
            className="w-full sm:w-auto px-6 py-4 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-lg rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 min-h-[52px]"
          >
            <UserCheck className="w-5 h-5" />
            <span>{isUrdu ? 'کسان کے طور پر شروع کریں' : 'Join as Farmer'}</span>
          </Link>

          <Link
            href="/register?role=buyer"
            className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-gray-50 border-2 border-[#8FD19E] text-[#2B2B2B] font-black text-lg rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 min-h-[52px]"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{isUrdu ? 'خریدار کے طور پر شامل ہوں' : 'Join as Buyer'}</span>
          </Link>

          <Link
            href="/marketplace"
            className="w-full sm:w-auto px-6 py-4 bg-[#FAF6EA] hover:bg-[#8FD19E]/20 border-2 border-gray-300 text-[#2B2B2B] font-black text-lg rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 min-h-[52px]"
          >
            <span>{isUrdu ? 'مارکیٹ دیکھیں' : 'Browse Produce'}</span>
          </Link>
        </div>

        <div className="pt-2">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-[#2B2B2B] underline"
          >
            <span>{isUrdu ? 'پلیٹ فارم کے کام کا طریقہ جانیں' : 'Learn how the bidding process works'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 2. Key Metrics & Impact Counter */}
      <section className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-gray-100">
          <div className="pt-4 md:pt-0">
            <div className="text-3xl md:text-4xl font-black text-[#2B2B2B]">0%</div>
            <div className="text-xs md:text-sm font-bold text-gray-500 mt-1 uppercase tracking-wider">
              {isUrdu ? 'آڑھتی کمیشن' : 'Middleman Fee'}
            </div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-3xl md:text-4xl font-black text-[#2B2B2B]">100%</div>
            <div className="text-xs md:text-sm font-bold text-gray-500 mt-1 uppercase tracking-wider">
              {isUrdu ? 'شفاف بولیاں' : 'Transparent Bids'}
            </div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-3xl md:text-4xl font-black text-[#2B2B2B]">24/7</div>
            <div className="text-xs md:text-sm font-bold text-gray-500 mt-1 uppercase tracking-wider">
              {isUrdu ? 'منڈی تک رسائی' : 'Marketplace Access'}
            </div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-3xl md:text-4xl font-black text-[#2B2B2B]">COD</div>
            <div className="text-xs md:text-sm font-bold text-gray-500 mt-1 uppercase tracking-wider">
              {isUrdu ? 'براہِ راست ادائیگی' : 'Direct Settlement'}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Pillars / Value Propositions */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl md:text-4xl font-black text-[#2B2B2B] tracking-tight">
            {isUrdu ? 'کسان منڈی کیوں منتخب کریں؟' : 'Why Choose KissanMandi?'}
          </h2>
          <p className="text-base text-gray-600 font-medium">
            {isUrdu
              ? 'روایتی منڈیوں میں کسان کو اپنی قیمت کا اختیار نہیں ہوتا۔ ہم نے اس نظام کو بدل دیا ہے۔'
              : 'Traditional wholesale grain markets deprive farmers of bargaining power. We transform this with technology.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF6EA] flex items-center justify-center text-[#2B2B2B]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#2B2B2B]">
              {isUrdu ? 'کھلی اور منصفانہ بولی' : 'Competitive Real-Time Bids'}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              {isUrdu
                ? 'فصل کی بولی کھلی اور ہر ایک کے سامنے ہوتی ہے۔ زیادہ بولی دینے والا خریدار ہی فصل حاصل کرتا ہے۔'
                : 'Every bid is open and competitive. Verified buyers compete nationally, driving honest price discovery for every harvest.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF6EA] flex items-center justify-center text-[#2B2B2B]">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#2B2B2B]">
              {isUrdu ? 'کم سے کم قیمت کا تحفظ' : 'Base Reserve Protection'}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              {isUrdu
                ? 'کسان خود اپنی فصل کی شروعاتی قیمت طے کرتا ہے۔ اس قیمت سے کم پر کوئی بھی بولی نہیں لگائی جا سکتی۔'
                : 'Farmers set minimum base reserve prices. No buyer can bid below this threshold, ensuring farmers never sell at a loss.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF6EA] flex items-center justify-center text-[#2B2B2B]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#2B2B2B]">
              {isUrdu ? 'براہِ راست تصدیق اور ترسیل' : 'Direct Producer Handover'}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              {isUrdu
                ? 'نیلامی جیتنے کے بعد کسان اور خریدار براہِ راست رابطہ کر کے نقد یا ڈیلیوری طے کرتے ہیں۔'
                : 'Winning auctions reveal direct contact details for seamless logistics coordination and cash-on-delivery settlement.'}
            </p>
          </div>
        </div>
      </section>

      {/* 4. For Farmers vs For Buyers Dual Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* For Farmers */}
        <div className="bg-white border-2 border-[#8FD19E] rounded-3xl p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#8FD19E]/20 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-[#2B2B2B]" />
            </div>
            <h3 className="text-2xl font-black text-[#2B2B2B]">
              {isUrdu ? 'کسانوں کے لیے' : 'For Farmers & Producers'}
            </h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              {isUrdu
                ? 'فصل کی تصویر کھینچیں، شروعاتی قیمت اور مقدار درج کریں، اور چند سیکنڈ میں پورے ملک کے خریداروں کے سامنے لائیں۔'
                : 'Capture 2 photos of your harvest, enter your reserve price and quantity, and access hundreds of active buyers without leaving your field.'}
            </p>
            <ul className="space-y-2 text-sm font-semibold text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6DBE82]" />
                <span>{isUrdu ? 'آڑھتی کے غیر ضروری کٹوتیوں سے نجات' : 'No commission or hidden deductions'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6DBE82]" />
                <span>{isUrdu ? 'آسان اور اردو میں استعمال' : 'Simple mobile interface with native Urdu'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6DBE82]" />
                <span>{isUrdu ? 'بولی قبول کرنے کا فوری اختیار' : 'Full control to accept bids at any time'}</span>
              </li>
            </ul>
          </div>
          <Link
            href="/farmers"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-bold rounded-xl text-base transition-colors"
          >
            <span>{isUrdu ? 'کسان پورٹل کی تفصیلات' : 'Explore Farmer Benefits'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* For Buyers */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#2B2B2B]" />
            </div>
            <h3 className="text-2xl font-black text-[#2B2B2B]">
              {isUrdu ? 'تجارتی خریداروں کے لیے' : 'For Commercial Buyers'}
            </h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              {isUrdu
                ? 'ہول سیلرز، فلور ملز، رائس ملز اور برآمد کنندگان براہِ راست کسانوں سے تازہ اور معیاری فصل خریدیں۔'
                : 'Wholesalers, mill owners, food processors, and exporters procure verified agricultural produce directly from verified farmers.'}
            </p>
            <ul className="space-y-2 text-sm font-semibold text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6DBE82]" />
                <span>{isUrdu ? 'ضلع اور فاصلے کے حساب سے فلٹر' : 'Location proximity & district filtering'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6DBE82]" />
                <span>{isUrdu ? 'حقیقی تصاویر سے معیار کی جانچ' : '2 required verified crop photos per listing'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6DBE82]" />
                <span>{isUrdu ? 'منڈی کے نرخوں پر مسابقتی بولیاں' : 'Competitive bidding directly from source'}</span>
              </li>
            </ul>
          </div>
          <Link
            href="/buyers"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-[#2B2B2B] font-bold rounded-xl text-base transition-colors"
          >
            <span>{isUrdu ? 'خریدار پورٹل کی تفصیلات' : 'Explore Buyer Benefits'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. How It Works 3-Step Summary */}
      <section className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#2B2B2B]">
            {isUrdu ? 'شفاف نیلامی کا طریقہ کار' : 'How the Platform Operates'}
          </h2>
          <p className="text-sm text-gray-600 font-medium">
            {isUrdu ? 'تین آسان مراحل میں فصل کی خرید و فروخت' : 'Three transparent steps to trade crops at honest prices'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 text-center p-4">
            <div className="w-12 h-12 rounded-full bg-[#8FD19E] text-[#2B2B2B] font-black text-xl flex items-center justify-center mx-auto mb-3">
              1
            </div>
            <h4 className="text-lg font-bold text-[#2B2B2B]">
              {isUrdu ? 'فصل کی لسٹنگ' : '1. Produce Listing'}
            </h4>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              {isUrdu
                ? 'کسان فصل کا نام، مقدار، شروعاتی قیمت اور ۲ تصاویر لگا کر نیلامی شروع کرتا ہے۔'
                : 'Farmer selects crop type, quantity, reserve minimum price, and uploads 2 verified photos.'}
            </p>
          </div>

          <div className="space-y-2 text-center p-4">
            <div className="w-12 h-12 rounded-full bg-[#8FD19E] text-[#2B2B2B] font-black text-xl flex items-center justify-center mx-auto mb-3">
              2
            </div>
            <h4 className="text-lg font-bold text-[#2B2B2B]">
              {isUrdu ? 'لائیو بولیاں' : '2. Competitive Bidding'}
            </h4>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              {isUrdu
                ? 'خریدار آن لائن بولی لگاتے ہیں۔ ہر نئی بولی پچھلی بولی سے زیادہ ہونی چاہیے۔'
                : 'Buyers place transparent bids higher than the current highest bid before countdown expiry.'}
            </p>
          </div>

          <div className="space-y-2 text-center p-4">
            <div className="w-12 h-12 rounded-full bg-[#8FD19E] text-[#2B2B2B] font-black text-xl flex items-center justify-center mx-auto mb-3">
              3
            </div>
            <h4 className="text-lg font-bold text-[#2B2B2B]">
              {isUrdu ? 'کامیاب ڈیل اور ترسیل' : '3. Auction Settlement'}
            </h4>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              {isUrdu
                ? 'وقت ختم ہونے پر یا کسان کے قبل از وقت قبول کرنے پر خریدار کی تفصیلات ظاہر ہو جاتی ہیں۔'
                : 'Highest bid wins automatically or is accepted early. Direct contact details are exchanged for delivery.'}
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FAF6EA] border border-[#8FD19E] text-[#2B2B2B] font-bold text-sm rounded-xl hover:bg-[#8FD19E]/20 transition-colors"
          >
            <span>{isUrdu ? 'مکمل تفصیلی گائیڈ پڑھیں' : 'Read Full Operational Guide'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="bg-[#FAF6EA] border-2 border-[#8FD19E] rounded-3xl p-8 md:p-12 text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-black text-[#2B2B2B]">
          {isUrdu ? 'آج ہی کسان منڈی میں شمولیت اختیار کریں' : 'Transform Your Agricultural Trade Today'}
        </h2>
        <p className="text-base text-gray-700 max-w-xl mx-auto font-medium">
          {isUrdu
            ? 'سائن اپ کریں اور اپنے لیے یا اپنی کمپنی کے لیے منصفانہ اور شفاف منڈی کے دروازے کھولیں۔'
            : 'Join thousands of producers and buyers building Pakistan\'s first middleman-free agricultural marketplace.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-4 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-lg rounded-xl shadow-sm transition-all"
          >
            {isUrdu ? 'مفت اکاؤنٹ بنائیں' : 'Create Free Account'}
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 bg-white border border-gray-300 hover:bg-gray-50 text-[#2B2B2B] font-bold text-lg rounded-xl shadow-sm transition-all"
          >
            {isUrdu ? 'ہمارے نمائندے سے بات کریں' : 'Contact Support'}
          </Link>
        </div>
      </section>
    </div>
  );
}
