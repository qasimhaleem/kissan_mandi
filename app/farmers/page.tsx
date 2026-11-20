import type { Metadata } from 'next';
import Link from 'next/link';
import {
  UserCheck,
  ShieldCheck,
  Smartphone,
  Coins,
  CheckCircle2,
  Clock,
  Camera,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'For Farmers - KissanMandi Agricultural Marketplace',
  description: 'Sell your crops directly to commercial buyers at competitive prices with zero middleman commission on KissanMandi.',
};

export default function ForFarmersPage() {
  const benefits = [
    {
      title: 'Zero Middleman Deduction',
      desc: 'Keep 100% of your selling price. Traditional commission agents take 8% to 15% plus hidden weighing deductions.',
      icon: Coins,
    },
    {
      title: 'Set Your Own Base Price',
      desc: 'You decide the minimum price per maund or kg. No buyer can submit a bid below your established reserve.',
      icon: ShieldCheck,
    },
    {
      title: 'Designed for Low Digital Literacy',
      desc: 'Extra large buttons, minimal forms, large legible text, and complete native Urdu support designed specifically for Pakistani farmers.',
      icon: Smartphone,
    },
    {
      title: 'National Market Access',
      desc: 'Reach flour mills, rice exporters, and wholesalers across the country directly from your village without paying transport upfront.',
      icon: UserCheck,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#8FD19E] text-xs font-bold text-[#2B2B2B]">
          <UserCheck className="w-4 h-4 text-[#6DBE82]" />
          <span>Producer Solutions</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#2B2B2B] tracking-tight">
          Built for the Farmer's Profit and Dignity
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed">
          Take control of your harvest. KissanMandi eliminates the middlemen and connects you directly with serious, verified buyers across Pakistan.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FAF6EA] border border-[#8FD19E] flex items-center justify-center text-[#2B2B2B]">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#2B2B2B]">{b.title}</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">{b.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 3 Step Posting Walkthrough */}
      <div className="bg-white border-2 border-[#8FD19E] rounded-3xl p-8 md:p-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#2B2B2B]">
            How to Post Produce on KissanMandi
          </h2>
          <p className="text-sm text-gray-600 font-medium">
            Posting your crop takes under one minute on any mobile phone
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 bg-[#FAF6EA] rounded-2xl border border-gray-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#8FD19E] font-black text-sm flex items-center justify-center mx-auto text-[#2B2B2B]">
              1
            </div>
            <h4 className="font-bold text-base text-[#2B2B2B]">Enter Crop Details</h4>
            <p className="text-xs text-gray-600 font-medium">
              Pick your crop from the dropdown, enter quantity, and choose your reserve price.
            </p>
          </div>

          <div className="p-5 bg-[#FAF6EA] rounded-2xl border border-gray-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#8FD19E] font-black text-sm flex items-center justify-center mx-auto text-[#2B2B2B]">
              2
            </div>
            <h4 className="font-bold text-base text-[#2B2B2B]">Snap 2 Photos</h4>
            <p className="text-xs text-gray-600 font-medium">
              Take one wide picture of the harvest and one close-up quality photo of the grain or fruit.
            </p>
          </div>

          <div className="p-5 bg-[#FAF6EA] rounded-2xl border border-gray-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#8FD19E] font-black text-sm flex items-center justify-center mx-auto text-[#2B2B2B]">
              3
            </div>
            <h4 className="font-bold text-base text-[#2B2B2B]">Publish & Accept</h4>
            <p className="text-xs text-gray-600 font-medium">
              Watch buyers bid in real time. Accept the highest bid whenever you are satisfied.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#FAF6EA] border border-gray-200 rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-2xl font-black text-[#2B2B2B]">
          Ready to Sell Your Harvest at Honest Prices?
        </h3>
        <p className="text-sm text-gray-600 max-w-lg mx-auto font-medium">
          Registration is completely free and takes 30 seconds. No paperwork required.
        </p>
        <div className="pt-2">
          <Link
            href="/register?role=farmer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-lg rounded-xl shadow-sm transition-all"
          >
            <span>Register as Farmer</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
