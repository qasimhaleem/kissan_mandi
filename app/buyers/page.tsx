import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  MapPin,
  Camera,
  Clock,
  ArrowRight,
  ShoppingCart,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'For Commercial Buyers — KissanMandi Agricultural Marketplace',
  description:
    'Procure verified fresh agricultural produce directly from Pakistani farmers at competitive bidding rates on KissanMandi.',
};

export default function ForBuyersPage() {
  const buyerCategories = [
    {
      title: 'Flour & Rice Mills',
      desc: 'Source large wheat and paddy lots directly from surrounding agricultural districts without brokerage friction.',
    },
    {
      title: 'Agricultural Exporters',
      desc: 'Procure high-grade Basmati rice, kinnow citrus, and mangoes with full farm-gate traceability and photo verification.',
    },
    {
      title: 'Wholesale Grain Merchants',
      desc: 'Monitor real-time harvest listings across Punjab, KP, and Sindh to secure competitive spot pricing.',
    },
    {
      title: 'Food Processors & Retailers',
      desc: 'Guarantee supply chain stability for potatoes, onions, tomatoes, and maize with direct farmer relationships.',
    },
  ];

  const features = [
    {
      title: 'Direct Farm Sourcing',
      desc: 'Buy directly from verified growers. Eliminate multiple middleman layers and artificial hoarding markups.',
      icon: Building2,
    },
    {
      title: 'District & Proximity Filtering',
      desc: 'Filter listings by district, category, volume, and price to optimize transport and freight logistics.',
      icon: MapPin,
    },
    {
      title: 'Verified Harvest Photos',
      desc: 'Review real farm batch photos before placing bids or dispatching transport vehicles.',
      icon: Camera,
    },
    {
      title: 'Transparent Bidding Windows',
      desc: 'Open, fair offers with direct farmer contact upon acceptance and Cash on Delivery settlement.',
      icon: Clock,
    },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-gradient-to-b from-km-cream-100 to-white border-b border-km-green-200/70 py-14 sm:py-20">
        <div className="km-container grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="km-badge">
              <Building2 className="w-3.5 h-3.5" />
              <span>Commercial Procurement</span>
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-km-ink tracking-tight leading-tight">
              Reliable Direct Sourcing for Commercial Buyers
            </h1>
            <p className="text-base sm:text-lg text-km-ink-muted leading-relaxed">
              Procure wheat, rice, mangoes, citrus, cotton, and fresh vegetables directly from verified growers across Pakistan with zero intermediary markups.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/marketplace" className="km-btn-primary px-7 py-3.5 text-base">
                <ShoppingCart className="w-4 h-4" />
                <span>Browse Live Marketplace</span>
              </Link>
              <Link href="/register?role=buyer" className="km-btn-outline px-6 py-3.5">
                <span>Register as Buyer</span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-km-lg border-4 border-white">
              <Image
                src="/images/produce-fruits.jpg"
                alt="Fresh Pakistani mangoes and kinnow citrus crates ready for commercial procurement"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Buyer Categories & Features */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="km-container max-w-5xl space-y-14">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-km-ink text-center">
              Who Buys on KissanMandi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buyerCategories.map((cat, idx) => (
                <div key={idx} className="bg-km-cream-100 rounded-2xl p-6 border border-km-cream-300 space-y-2">
                  <h3 className="text-lg font-extrabold text-km-ink">{cat.title}</h3>
                  <p className="text-sm text-km-ink-muted leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-km-ink text-center">
              Procurement Advantages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={idx} className="km-card km-card-hover p-7 space-y-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-km-green-100 text-km-green-800 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-extrabold text-km-ink">{feat.title}</h3>
                    <p className="text-sm text-km-ink-muted leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-km-green-800 text-white rounded-3xl p-8 sm:p-10 text-center space-y-5 shadow-km-md">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Start Sourcing Directly From Growers Today
            </h3>
            <p className="text-sm sm:text-base text-km-green-100 max-w-lg mx-auto">
              Browse verified listings by district and crop type, or create a free buyer account to place bids.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register?role=buyer" className="km-btn-light px-7 py-3.5">
                <span>Create Buyer Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm transition-colors"
              >
                <span>Explore Listings</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
