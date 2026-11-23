import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, Eye, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Mission & Vision — KissanMandi',
  description:
    'Discover the mission, vision, and strategic goals behind KissanMandi direct agricultural marketplace.',
};

export default function MissionPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-gradient-to-b from-km-cream-100 to-white border-b border-km-green-200/70 py-14 sm:py-20">
        <div className="km-container max-w-4xl text-center space-y-5">
          <span className="km-badge">
            <Compass className="w-3.5 h-3.5" />
            <span>Purpose & Direction</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-km-ink tracking-tight">
            Our Mission & Vision
          </h1>
          <p className="text-base sm:text-lg text-km-ink-muted max-w-2xl mx-auto leading-relaxed">
            Transforming Pakistani agriculture from middleman dependency into an era of digital price transparency and grower prosperity.
          </p>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="km-container max-w-5xl space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-km-green-50 p-8 rounded-3xl border-2 border-km-green-300 shadow-km-sm space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-km-green-700 text-white flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-km-ink">Our Mission</h2>
              <p className="text-sm sm:text-base text-km-ink-muted leading-relaxed">
                To empower farmers with direct digital access to national buyers through open, competitive bidding—ensuring every grower receives fair payment while commercial buyers obtain verifiable, farm-fresh produce.
              </p>
              <div className="pt-4 border-t border-km-green-200 space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-km-ink">
                  <CheckCircle2 className="w-4 h-4 text-km-green-700 flex-shrink-0" />
                  <span>Eliminate 8%–15% commission agent deductions</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-km-ink">
                  <CheckCircle2 className="w-4 h-4 text-km-green-700 flex-shrink-0" />
                  <span>Prevent opaque pricing and delayed settlements</span>
                </div>
              </div>
            </div>

            <div className="km-card p-8 space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-km-cream-100 border border-km-cream-300 text-km-green-800 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-km-ink">Our Vision</h2>
              <p className="text-sm sm:text-base text-km-ink-muted leading-relaxed">
                An agricultural economy where mobile technology bridges geographic and literacy divides, turning rural farming communities into thriving, self-reliant centers of food production across Pakistan.
              </p>
              <div className="pt-4 border-t border-km-green-100 space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-km-ink">
                  <CheckCircle2 className="w-4 h-4 text-km-green-700 flex-shrink-0" />
                  <span>Nationwide crop price transparency across all districts</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-km-ink">
                  <CheckCircle2 className="w-4 h-4 text-km-green-700 flex-shrink-0" />
                  <span>Modern, decentralized agricultural commerce</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Feature Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-km-cream-100 rounded-3xl p-8 sm:p-10 border border-km-cream-300">
            <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-km-md">
              <Image
                src="/images/produce-grains.jpg"
                alt="Golden Pakistani wheat and Basmati rice sacks on sunlit farm"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="lg:col-span-7 space-y-5">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-km-ink">
                Strategic Objectives
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { stat: '100K+', label: 'Farmers Onboarded Across Pakistan' },
                  { stat: '0%', label: 'Middleman Commission Fees' },
                  { stat: '100%', label: 'Verified Direct Farm Listings' },
                ].map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-2xl border border-km-green-200/80 space-y-1"
                  >
                    <div className="text-2xl font-extrabold text-km-green-800">
                      {m.stat}
                    </div>
                    <p className="text-xs font-semibold text-km-ink-muted">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <Link href="/register" className="km-btn-primary">
                  <span>Join KissanMandi</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
