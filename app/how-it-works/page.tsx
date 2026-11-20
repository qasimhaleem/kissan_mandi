import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FileText,
  TrendingUp,
  Award,
  Truck,
  Camera,
  CheckCircle2,
  Clock,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works - KissanMandi Agricultural Marketplace',
  description: 'Learn how to list crops, place bids, and complete direct farmer-to-buyer transactions on KissanMandi.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Farmer Lists Produce in 60 Seconds',
      description:
        'The farmer selects the crop, enters the quantity (kg, maund, or ton), and specifies a strict minimum base reserve price. Exactly two photos (an overview and a close-up quality photo) are uploaded to verify produce authenticity.',
      badge: 'Listing & Reserve Price',
      icon: Camera,
    },
    {
      number: '02',
      title: 'Transparent Real-Time Bidding',
      description:
        'The produce is immediately visible in the active marketplace feed. Commercial buyers place bids in real time. Each bid must be higher than the current highest bid and at least the base price. A live countdown timer shows time remaining.',
      badge: 'Live Auction',
      icon: TrendingUp,
    },
    {
      number: '03',
      title: 'Bid Acceptance or Automatic Win',
      description:
        'When the auction duration finishes, the highest bid wins automatically. The farmer also has the flexibility to accept any attractive bid earlier to finalize the deal immediately.',
      badge: 'Auction Resolution',
      icon: Award,
    },
    {
      number: '04',
      title: 'Direct Contact & Cash-on-Delivery Settlement',
      description:
        'Once a bid is accepted, the farmer and winning buyer receive each other’s verified contact details. They coordinate transport, quality inspection at loading, and final payment directly via Cash on Delivery (COD).',
      badge: 'Direct Handover',
      icon: Truck,
    },
  ];

  const faqs = [
    {
      q: 'Does KissanMandi charge any commission fees?',
      a: 'No. Traditional commission agents (arhtis) take 8% to 15% of the total transaction value. KissanMandi charges zero commission, meaning the farmer keeps the full agreed price.',
    },
    {
      q: 'Can a buyer bid below the farmer’s minimum price?',
      a: 'No. The platform enforces that every bid must meet or exceed the farmer’s base reserve price, ensuring no crop is sold at an unfair rate.',
    },
    {
      q: 'Why are two photos required for every listing?',
      a: 'To guarantee quality transparency. Photo 1 provides a broad overview of the harvest batch, while Photo 2 provides a detailed close-up so buyers can evaluate grain size, moisture, or color before bidding.',
    },
    {
      q: 'How is payment and transport handled?',
      a: 'Payment is settled directly between the buyer and farmer upon inspection and handover (Cash on Delivery). This avoids payment holding or banking complications for rural producers.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#8FD19E] text-xs font-bold text-[#2B2B2B]">
          <FileText className="w-4 h-4 text-[#6DBE82]" />
          <span>Operational Guide</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#2B2B2B] tracking-tight">
          How KissanMandi Works
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed">
          A completely transparent, 4-step direct auction model connecting agricultural producers and buyers without intermediaries.
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start gap-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#FAF6EA] border border-[#8FD19E] flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-black text-[#2B2B2B]">{step.number}</span>
              </div>
              <div className="space-y-2 flex-1">
                <div className="inline-block px-3 py-1 rounded-full bg-green-50 border border-green-200 text-xs font-bold text-green-800">
                  {step.badge}
                </div>
                <h3 className="text-2xl font-black text-[#2B2B2B]">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#8FD19E]/20 flex items-center justify-center mx-auto text-[#2B2B2B]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2B2B2B]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="p-5 bg-[#FAF6EA] rounded-2xl border border-gray-200 space-y-2">
              <h4 className="text-base font-bold text-[#2B2B2B]">{faq.q}</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action */}
      <div className="text-center pt-4">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-lg rounded-xl shadow-sm transition-colors"
        >
          <span>Get Started on KissanMandi</span>
        </Link>
      </div>
    </div>
  );
}
