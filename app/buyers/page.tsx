import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  TrendingDown,
  MapPin,
  Camera,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'For Commercial Buyers - KissanMandi Agricultural Marketplace',
  description: 'Procure verified fresh agricultural produce directly from Pakistani farmers at competitive bidding rates on KissanMandi.',
};

export default function ForBuyersPage() {
  const buyerCategories = [
    {
      title: 'Flour & Rice Mills',
      desc: 'Source large wheat and paddy lots directly from surrounding agricultural districts without brokerage friction.',
    },
    {
      title: 'Agricultural Exporters',
      desc: 'Procure high-grade basmati rice, citrus (kinnow), and mangoes with full farm-gate traceability and photo verification.',
    },
    {
      title: 'Wholesale Grain Merchants',
      desc: 'Monitor real-time harvest auctions across Punjab and Sindh, securing competitive spot pricing as soon as crops are cut.',
    },
    {
      title: 'Food Processors & Retailers',
      desc: 'Guarantee supply chain stability for potatoes, onions, tomatoes, and maize with direct farmer relationships.',
    },
  ];

  const features = [
    {
      title: 'Direct Farm Sourcing',
      desc: 'Buy directly from the actual grower. Eliminate two to three layers of middlemen and artificial hoarding markups.',
      icon: Building2,
    },
    {
      title: 'Location Proximity Matching',
      desc: 'Filter listings by district or distance in kilometers to optimize your freight and transport logistics.',
      icon: MapPin,
    },
    {
      title: 'Dual Verified Batch Photos',
      desc: 'Every listing requires two mandatory high-resolution photos (overview and grain close-up) before bids can be received.',
      icon: Camera,
    },
    {
      title: 'Live Auction Transparency',
      desc: 'Fair, open bidding windows. View current highest bids, countdown timers, and place validated competitive offers.',
      icon: Clock,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#8FD19E] text-xs font-bold text-[#2B2B2B]">
          <Building2 className="w-4 h-4 text-[#6DBE82]" />
          <span>Commercial Procurement</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#2B2B2B] tracking-tight">
          Reliable Direct Sourcing for Commercial Buyers
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed">
          Procure wheat, rice, cotton, sugarcane, maize, and horticultural crops directly from verified growers across Pakistan with zero intermediary markups.
        </p>
      </div>

      {/* Target Buyer Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {buyerCategories.map((cat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <h3 className="text-xl font-bold text-[#2B2B2B]">{cat.title}</h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">{cat.desc}</p>
          </div>
        ))}
      </div>

      {/* Feature Grid */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-8">
        <h2 className="text-2xl sm:text-3xl font-black text-[#2B2B2B] text-center">
          Procurement Advantages
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="p-6 bg-[#FAF6EA] rounded-2xl border border-gray-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#8FD19E] flex items-center justify-center text-[#2B2B2B]">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-[#2B2B2B]">{f.title}</h4>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#FAF6EA] border-2 border-[#8FD19E] rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-2xl font-black text-[#2B2B2B]">
          Upgrade Your Agricultural Procurement
        </h3>
        <p className="text-sm text-gray-600 max-w-lg mx-auto font-medium">
          Create your commercial buyer profile today to access live harvest auctions and bid directly on verified crops.
        </p>
        <div className="pt-2">
          <Link
            href="/register?role=buyer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-lg rounded-xl shadow-sm transition-all"
          >
            <span>Register as Commercial Buyer</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
