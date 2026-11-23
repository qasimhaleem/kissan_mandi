import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sprout,
  ShieldCheck,
  Target,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — KissanMandi Agricultural Marketplace',
  description:
    'Learn about KissanMandi, our history, and how we empower Pakistani farmers through transparent direct crop trading.',
};

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-gradient-to-b from-km-cream-100 to-white border-b border-km-green-200/70 py-14 sm:py-20">
        <div className="km-container grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="km-badge">
              <Sprout className="w-3.5 h-3.5" />
              <span>About KissanMandi</span>
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-km-ink tracking-tight leading-tight">
              Pioneering Fair Agricultural Trade in Pakistan
            </h1>
            <p className="text-base sm:text-lg text-km-ink-muted leading-relaxed">
              KissanMandi was built to solve a long-standing challenge in South Asian agriculture: the middleman monopoly that undervalues farmers and inflates procurement costs for commercial buyers.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-km-lg border-4 border-white">
              <Image
                src="/images/tractor-farmland.jpg"
                alt="Fertile agricultural farmland in Punjab, Pakistan"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Breakthrough */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="km-container max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-km-cream-100 p-8 rounded-3xl border border-km-cream-300 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-km-cream-300 flex items-center justify-center text-km-ink font-extrabold">
              01
            </div>
            <h2 className="text-2xl font-extrabold text-km-ink">
              The Traditional Mandi Crisis
            </h2>
            <p className="text-sm sm:text-base text-km-ink-muted leading-relaxed">
              For decades, smallholder farmers across Pakistan have depended on commission agents (arhtis). Without direct buyer access or open price discovery, growers have faced unilateral deductions, delayed settlements, and arbitrary discounts on their harvests.
            </p>
          </div>

          <div className="bg-km-green-50 p-8 rounded-3xl border-2 border-km-green-300 shadow-km-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-km-green-700 text-white flex items-center justify-center font-extrabold">
              02
            </div>
            <h2 className="text-2xl font-extrabold text-km-ink">
              The KissanMandi Breakthrough
            </h2>
            <p className="text-sm sm:text-base text-km-ink-muted leading-relaxed">
              By pairing a simple, Urdu-friendly mobile experience with transparent bidding, KissanMandi enables any farmer with a smartphone to reach mills, wholesalers, and exporters directly—keeping 100% of their negotiated price.
            </p>
          </div>
        </div>
      </section>

      {/* Operating Principles */}
      <section className="py-16 sm:py-20 bg-km-cream-100 border-t border-km-cream-300/70">
        <div className="km-container max-w-5xl space-y-10">
          <div className="text-center space-y-2">
            <span className="km-badge">Our Foundation</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-km-ink">
              Our Core Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Producer First',
                desc: 'Every feature, interface control, and reserve-price rule is built to protect the farmer’s economic dignity.',
              },
              {
                icon: ShieldCheck,
                title: 'Radical Transparency',
                desc: 'Active prices, harvest volumes, farm locations, and photo verifications are visible to participants in real time.',
              },
              {
                icon: HeartHandshake,
                title: 'Universal Inclusion',
                desc: 'Crafted from the ground up with large buttons, clear steps, and complete native Urdu RTL support.',
              },
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="km-card km-card-hover p-7 text-center space-y-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-km-green-100 text-km-green-800 flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-km-ink">{p.title}</h3>
                  <p className="text-sm text-km-ink-muted leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>

          {/* CTA Box */}
          <div className="bg-km-green-800 text-white rounded-3xl p-8 sm:p-10 text-center space-y-5 shadow-km-md">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Be Part of the Direct Agricultural Movement
            </h3>
            <p className="text-sm sm:text-base text-km-green-100 max-w-lg mx-auto">
              Whether you are a grower with 5 maunds or a commercial mill sourcing 500 tons, KissanMandi delivers honest, direct trade.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <Link href="/register" className="km-btn-light px-7 py-3.5">
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Explore Marketplace</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
