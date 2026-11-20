import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass, Eye, TrendingUp, CheckCircle, Shield, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Mission & Vision - KissanMandi',
  description: 'Discover the mission, vision, and strategic goals behind KissanMandi direct agricultural marketplace.',
};

export default function MissionPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#8FD19E] text-xs font-bold text-[#2B2B2B]">
          <Compass className="w-4 h-4 text-[#6DBE82]" />
          <span>Purpose & Direction</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#2B2B2B] tracking-tight">
          Our Mission & Vision
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed">
          Transforming Pakistani agriculture from an era of middlemen manipulation into an era of digital transparency and economic self-determination.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission */}
        <div className="bg-white p-8 rounded-3xl border-2 border-[#8FD19E] shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#8FD19E]/20 flex items-center justify-center text-[#2B2B2B]">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#2B2B2B]">Our Mission</h2>
          <p className="text-sm text-gray-700 leading-relaxed font-medium">
            To empower farmers with direct digital access to national buyers through open, competitive bidding, ensuring every grower receives honest remuneration for their harvest while commercial purchasers obtain fresh, verifiable produce without middleman markups.
          </p>
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
              <CheckCircle className="w-4 h-4 text-[#6DBE82]" />
              <span>Eliminate 8-15% commission agent deductions</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
              <CheckCircle className="w-4 h-4 text-[#6DBE82]" />
              <span>Prevent price fixing and delayed payments</span>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#FAF6EA] flex items-center justify-center text-[#2B2B2B]">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#2B2B2B]">Our Vision</h2>
          <p className="text-sm text-gray-700 leading-relaxed font-medium">
            An agricultural economy where technology bridges geographic and educational divides, turning rural farming communities into thriving, debt-free centers of national prosperity and sustainable food production.
          </p>
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
              <CheckCircle className="w-4 h-4 text-[#6DBE82]" />
              <span>Nationwide crop transparency across all districts</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
              <CheckCircle className="w-4 h-4 text-[#6DBE82]" />
              <span>Modern, decentralized agricultural marketplace</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Roadmap Milestones */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-6">
        <h3 className="text-2xl font-black text-[#2B2B2B] text-center">
          Strategic Objectives
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="p-5 bg-[#FAF6EA] rounded-2xl border border-gray-200 space-y-2">
            <div className="text-2xl font-black text-[#6DBE82]">100K+</div>
            <h4 className="text-base font-bold text-[#2B2B2B]">Producers Connected</h4>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Equipping farmers across Punjab, Sindh, and Khyber Pakhtunkhwa with digital tools.
            </p>
          </div>

          <div className="p-5 bg-[#FAF6EA] rounded-2xl border border-gray-200 space-y-2">
            <div className="text-2xl font-black text-[#6DBE82]">Rs. 5B+</div>
            <h4 className="text-base font-bold text-[#2B2B2B]">Farmer Value Generated</h4>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Returning billions of rupees previously siphoned by non-producing intermediaries.
            </p>
          </div>

          <div className="p-5 bg-[#FAF6EA] rounded-2xl border border-gray-200 space-y-2">
            <div className="text-2xl font-black text-[#6DBE82]">100%</div>
            <h4 className="text-base font-bold text-[#2B2B2B]">Traceable Sourcing</h4>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Enabling processors and exporters to track crop origin directly to the farm.
            </p>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="text-center pt-4">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-lg rounded-xl shadow-sm transition-colors"
        >
          <span>Join the Mission Today</span>
        </Link>
      </div>
    </div>
  );
}
