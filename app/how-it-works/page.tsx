import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  TrendingUp,
  Award,
  Truck,
  Camera,
  HelpCircle,
  ArrowRight,
  UserCheck,
  ShoppingCart,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works — KissanMandi Agricultural Marketplace',
  description:
    'Learn how to list crops, place competitive bids, and complete direct farmer-to-buyer transactions on KissanMandi.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Farmer Lists Produce in 60 Seconds',
      description:
        'Select the crop category, enter available volume (kg, maund, or ton), and set a strict minimum reserve price. Upload clear farm photos (overview and close-up quality) so buyers can verify produce authenticity.',
      badge: 'Listing & Reserve Price',
      icon: Camera,
    },
    {
      number: '02',
      title: 'Transparent Real-Time Bidding',
      description:
        'Your produce goes live in the marketplace feed immediately. Verified commercial buyers filter by district, crop, and quantity, then submit competitive offers above your reserve price.',
      badge: 'Live Auction',
      icon: TrendingUp,
    },
    {
      number: '03',
      title: 'Bid Acceptance or Automatic Win',
      description:
        'When the bidding window closes, the highest verified offer wins automatically. Farmers can also accept an attractive bid earlier to lock in a deal right away.',
      badge: 'Auction Resolution',
      icon: Award,
    },
    {
      number: '04',
      title: 'Direct Contact & Cash-on-Delivery Settlement',
      description:
        'Both parties receive verified phone contact details immediately upon acceptance. Coordinate transport, on-farm quality inspection at loading, and settle directly via Cash on Delivery (COD).',
      badge: 'Direct Handover',
      icon: Truck,
    },
  ];

  const faqs = [
    {
      q: 'Does KissanMandi charge any commission fees?',
      a: 'No. Traditional commission agents (arhtis) take 8% to 15% of the total transaction value. KissanMandi charges zero commission so farmers keep the full agreed price.',
    },
    {
      q: 'Can a buyer bid below the farmer’s minimum price?',
      a: 'No. Every offer must meet or exceed the farmer’s established reserve price, guaranteeing no crop is ever sold below fair farm-gate value.',
    },
    {
      q: 'Why are real farm photos required for every listing?',
      a: 'Photo verification builds buyer confidence before transport is dispatched. Overview and close-up photos allow mills and wholesalers to inspect grain size, ripeness, and sorting quality.',
    },
    {
      q: 'How is payment and transport handled?',
      a: 'Payment is settled directly between the buyer and farmer upon inspection and handover (Cash on Delivery), eliminating delayed mandi payouts.',
    },
  ];

  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-km-cream-100 to-white border-b border-km-green-200/70 py-14 sm:py-20">
        <div className="km-container grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="km-badge">
              <FileText className="w-3.5 h-3.5" />
              <span>Operational Guide</span>
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-km-ink tracking-tight leading-tight">
              How KissanMandi Works
            </h1>
            <p className="text-base sm:text-lg text-km-ink-muted leading-relaxed">
              A transparent, 4-step direct marketplace connecting Pakistani farmers and commercial buyers without middlemen or hidden deductions.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/register?role=farmer" className="km-btn-primary">
                <UserCheck className="w-4 h-4" />
                <span>Start as Farmer</span>
              </Link>
              <Link href="/marketplace" className="km-btn-outline">
                <ShoppingCart className="w-4 h-4" />
                <span>Browse Marketplace</span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-km-lg border-4 border-white">
              <Image
                src="/images/mandi-direct.jpg"
                alt="Direct handover of fresh farm produce crates between farmer and buyer"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Steps */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="km-container max-w-5xl space-y-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="km-card km-card-hover p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-km-green-100 border border-km-green-300/60 flex items-center justify-center flex-shrink-0 text-km-green-800">
                  <Icon className="w-7 h-7" />
                </div>
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-extrabold text-km-green-700 bg-km-cream-100 px-2.5 py-1 rounded-lg border border-km-cream-300">
                      STEP {step.number}
                    </span>
                    <span className="km-badge">{step.badge}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-km-ink">
                    {step.title}
                  </h2>
                  <p className="text-sm sm:text-base text-km-ink-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-km-cream-100 border-t border-km-cream-300/70">
        <div className="km-container max-w-5xl space-y-10">
          <div className="text-center space-y-3">
            <span className="km-badge">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Frequently Asked Questions</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-km-ink">
              Common Questions Answered
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="km-card p-6 sm:p-7 space-y-3">
                <h3 className="text-base font-extrabold text-km-ink">{faq.q}</h3>
                <p className="text-sm text-km-ink-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-km-green-800 text-white rounded-3xl p-8 sm:p-10 text-center space-y-5 shadow-km-md">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Experience Direct Agricultural Trade?
            </h3>
            <p className="text-sm sm:text-base text-km-green-100 max-w-xl mx-auto">
              Create your free farmer or buyer account in under a minute and start trading directly.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <Link href="/register?role=farmer" className="km-btn-light px-7 py-3.5">
                <span>Register as Farmer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register?role=buyer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm transition-colors"
              >
                <span>Register as Buyer</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
