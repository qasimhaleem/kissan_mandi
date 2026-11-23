import type { Metadata } from 'next';
import {
  Plus_Jakarta_Sans,
  Inter,
  Playfair_Display,
  Noto_Nastaliq_Urdu,
  Noto_Naskh_Arabic,
} from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  style: ['italic'],
  variable: '--font-accent',
  display: 'swap',
});

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['600', '700'],
  variable: '--font-urdu-heading',
  display: 'swap',
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-urdu-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KissanMandi — Direct Agricultural Marketplace for Pakistan',
  description:
    'Connect directly with Pakistani farmers and verified commercial buyers. List fresh produce, receive competitive bids, and trade transparently with zero middleman commission.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ur"
      dir="rtl"
      className={`${plusJakartaSans.variable} ${inter.variable} ${playfairDisplay.variable} ${notoNastaliqUrdu.variable} ${notoNaskhArabic.variable}`}
    >
      <body className="min-h-screen bg-km-cream-100 text-km-ink font-sans antialiased flex flex-col pb-16 sm:pb-0">
        <Providers>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
