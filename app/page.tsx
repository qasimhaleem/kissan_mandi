'use client';

  import { useEffect } from 'react';
  import { useRouter } from 'next/navigation';
  import { useAuth } from '@/context/AuthContext';
  import { useLanguage } from '@/context/LanguageContext';
  import Link from 'next/link';

  export default function HomePage() {
    const { user, loading } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();

    useEffect(() => {
      if (!loading && user) {
        if (user.role === 'farmer') {
          router.push('/farmer');
        } else {
          router.push('/buyer');
        }
      }
    }, [user, loading, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4">
          <div className="w-24 h-24 bg-[#8FD19E] rounded-full flex items-center justify-center text-5xl mb-6 shadow-sm">
            🌾
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#2B2B2B] mb-4">
            {t('welcome')}
          </h1>
          <p className="text-lg md:text-xl text-[#2B2B2B] max-w-xl mb-10 leading-relaxed font-medium">
            {t('tagline')} — {t('chooseRole')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
            <Link
              href="/register?role=farmer"
              className="flex flex-col items-center justify-center p-6 bg-white border-2 border-[#8FD19E] hover:bg-[#8FD19E] rounded-2xl shadow-sm transition-all group min-h-[140px]"
            >
              <span className="text-4xl mb-2">👨‍🌾</span>
              <span className="text-2xl font-black text-[#2B2B2B] group-hover:scale-105 transition-transform">
                {t('farmer')}
              </span>
            </Link>

            <Link
              href="/register?role=buyer"
              className="flex flex-col items-center justify-center p-6 bg-white border-2 border-[#8FD19E] hover:bg-[#8FD19E] rounded-2xl shadow-sm transition-all group min-h-[140px]"
            >
              <span className="text-4xl mb-2">🛒</span>
              <span className="text-2xl font-black text-[#2B2B2B] group-hover:scale-105 transition-transform">
                {t('buyer')}
              </span>
            </Link>
          </div>

          <div className="mt-8 text-base">
            <Link href="/login" className="text-[#2B2B2B] underline font-bold hover:text-[#6DBE82]">
              {t('alreadyHaveAccount')}
            </Link>
          </div>
        </div>
        );
}
