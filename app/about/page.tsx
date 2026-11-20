import type { Metadata } from 'next';
import Link from 'next/link';
import { Sprout, ShieldCheck, Target, HeartHandshake, Award, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - KissanMandi Agricultural Marketplace',
  description: 'Learn about KissanMandi, our history, and how we are empowering Pakistani farmers through transparent direct crop bidding.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#8FD19E] text-xs font-bold text-[#2B2B2B]">
          <Sprout className="w-4 h-4 text-[#6DBE82]" />
          <span>About KissanMandi</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#2B2B2B] tracking-tight">
          Pioneering Fair Agricultural Trade
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed">
          KissanMandi was created to solve the most pervasive injustice in South Asian agriculture: the middleman monopoly that undervalues the grower and inflates costs for consumers.
        </p>
      </div>

      {/* The Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 font-bold">
            01
          </div>
          <h3 className="text-2xl font-black text-[#2B2B2B]">
            The Traditional Mandi Crisis
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            For decades, smallholder farmers across Pakistan have been trapped in exploitative relationships with commission agents (arhtis). Without direct market access or price transparency, farmers have been forced to accept unilateral deductions, delayed payments, and arbitrary discounts on their hard-earned harvests.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#8FD19E] shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#8FD19E]/20 flex items-center justify-center text-[#2B2B2B] font-bold">
            02
          </div>
          <h3 className="text-2xl font-black text-[#2B2B2B]">
            The KissanMandi Breakthrough
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            By combining a mobile-first, low-literacy Urdu interface with real-time auction mechanisms, KissanMandi allows any farmer with a basic smartphone to broadcast their crop directly to commercial wholesalers, mills, and exporters. The highest honest bid wins, and payment is settled directly upon delivery.
          </p>
        </div>
      </div>

      {/* Our Operating Principles */}
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-[#2B2B2B] text-center tracking-tight">
          Our Core Principles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF6EA] flex items-center justify-center mx-auto text-[#2B2B2B]">
              <Target className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#2B2B2B]">Producer First</h4>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Every decision, interface button, and policy is optimized to safeguard the farmer’s economic dignity and reserve price.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF6EA] flex items-center justify-center mx-auto text-[#2B2B2B]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#2B2B2B]">Radical Transparency</h4>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              All active bids, time windows, and quality parameters are publicly visible to verified participants in real time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF6EA] flex items-center justify-center mx-auto text-[#2B2B2B]">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#2B2B2B]">Universal Inclusion</h4>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Designed from the ground up for low-literacy users with high-contrast buttons, simple steps, and full native Urdu localization.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#FAF6EA] border border-[#8FD19E] rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-2xl font-bold text-[#2B2B2B]">
          Be Part of the Agricultural Revolution
        </h3>
        <p className="text-sm text-gray-700 max-w-lg mx-auto font-medium">
          Whether you are a grower with 5 maunds or a mill looking for 500 tons, KissanMandi delivers honest, direct agricultural commerce.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="px-6 py-3 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-bold rounded-xl text-sm transition-colors"
          >
            Create an Account
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-[#2B2B2B] font-bold rounded-xl text-sm transition-colors"
          >
            Contact Team
          </Link>
        </div>
      </div>
    </div>
  );
}
