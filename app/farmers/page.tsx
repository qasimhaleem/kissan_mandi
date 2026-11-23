import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  UserCheck,
  ShieldCheck,
  Smartphone,
  Coins,
  Camera,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'For Farmers — KissanMandi Agricultural Marketplace',
  description:
    'Sell your crops directly to commercial buyers at competitive prices with zero middleman commission on KissanMandi.',
};

export default function ForFarmersPage() {
  const benefits = [
    {
      title: 'Zero Middleman Deduction',
      desc: 'Keep 100% of your selling price. Traditional commission agents take 8% to 15% plus hidden weighing deductions.',
      icon: Coins,
    },
    {
      title: 'Set Your Own Reserve Price',
      desc: 'You decide the minimum price per maund, kg, or ton. No buyer can submit a bid below your established reserve.',
      icon: ShieldCheck,
    },
    {
      title: 'Designed for Effortless Mobile Use',
      desc: 'Extra-large buttons, minimal forms, legible text, and full native Urdu RTL support tailored for Pakistani growers.',
      icon: Smartphone,
    },
    {
      title: 'National Buyer Access',
      desc: 'Reach flour mills, rice exporters, and wholesalers directly from your farm without paying upfront mandi transport.',
      icon: UserCheck,
    },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-gradient-to-b from-km-cream-100 to-white border-b border-km-green-200/70 py-14 sm:py-20">
        <div className="km-container grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="km-badge">
              <UserCheck className="w-3.5 h-3.5" />
              <span>For Pakistani Farmers</span>
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-km-ink tracking-tight leading-tight">
              Built for the Farmer’s Profit and Dignity
            </h1>
            <p className="text-base sm:text-lg text-km-ink-muted leading-relaxed">
              Take full control of your harvest. KissanMandi removes commission agents and connects you directly with verified commercial buyers across Pakistan.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/register?role=farmer" className="km-btn-primary px-7 py-3.5 text-base">
                <span>Register as Farmer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/how-it-works" className="km-btn-outline px-6 py-3.5">
                <span>See How It Works</span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-km-lg border-4 border-white">
              <Image
                src="/images/hero-farm.jpg"
                alt="Pakistani farmer inspecting fresh green crop field"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="km-container max-w-5xl space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="km-card km-card-hover p-7 space-y-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-km-green-100 text-km-green-800 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-extrabold text-km-ink">{b.title}</h2>
                  <p className="text-sm text-km-ink-muted leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>

          {/* 3-Step Walkthrough */}
          <div className="bg-km-cream-100 border-2 border-km-green-300 rounded-3xl p-8 sm:p-10 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-km-ink">
                Post Your Harvest in 3 Simple Steps
              </h2>
              <p className="text-sm text-km-ink-muted">
                No technical training required—built for fast listing from any smartphone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: 'Enter Crop & Reserve Price',
                  desc: 'Select your produce category, quantity, unit, and minimum acceptable PKR price.',
                  icon: CheckCircle2,
                },
                {
                  step: '02',
                  title: 'Upload Farm Photos',
                  desc: 'Take clear photos of your harvest batch directly from your phone camera.',
                  icon: Camera,
                },
                {
                  step: '03',
                  title: 'Accept Best Offer & Get Paid',
                  desc: 'Compare incoming buyer offers and receive direct Cash on Delivery upon handover.',
                  icon: Coins,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="bg-white rounded-2xl p-6 border border-km-green-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <Icon className="w-6 h-6 text-km-green-700" />
                      <span className="text-lg font-extrabold text-km-green-300">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-km-ink">{item.title}</h3>
                    <p className="text-xs text-km-ink-muted leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-2">
              <Link href="/register?role=farmer" className="km-btn-primary px-8 py-4 text-base">
                <span>Start Listing Produce Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
