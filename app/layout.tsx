import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';

export const metadata: Metadata = {
  title: 'KissanMandi - Direct Agricultural Marketplace',
  description: 'Direct crop bidding platform connecting farmers and buyers without middlemen',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ur" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FAF6EA] text-[#2B2B2B] flex flex-col pb-16 sm:pb-0">
        <Providers>
          <Navbar />
          <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
            {children}
          </main>
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
