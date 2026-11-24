import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';
import NavigationProgress from '@/components/NavigationProgress';

// Duffel primary English typography: GT America
const gtAmerica = localFont({
  src: [
    {
      path: '../public/fonts/GT-America-Standard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/GT-America-Standard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/GT-America-Standard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-gt-america',
  display: 'swap',
});

// Duffel mono typography: GT America Mono
const gtAmericaMono = localFont({
  src: [
    {
      path: '../public/fonts/GT-America-Mono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kissanmandi-tawny.vercel.app'),
  title: 'KissanMandi — Direct Agricultural Marketplace for Pakistan',
  description:
    'Connect directly with Pakistani farmers and verified commercial buyers. List fresh produce, receive competitive bids, and trade transparently with 0% middleman commission.',
  keywords: [
    'Pakistan Agriculture',
    'Kissan Mandi',
    'Direct Farm Trade',
    'Basmati Rice',
    'Chaunsa Mangoes',
    'Wheat Bidding',
    'Lahore Mandi Rates',
    'Punjab Agri Exchange',
    'Multan Agriculture',
  ],
  authors: [{ name: 'KissanMandi Technologies Ltd' }],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'KissanMandi — Pakistan’s Direct Agri-Trading Exchange',
    description:
      'Trade farm produce without the middlemen. Transparent real-time auctions, photo-verified harvest batches, and 0% broker deductions.',
    url: 'https://kissanmandi-tawny.vercel.app',
    siteName: 'KissanMandi Pakistan',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KissanMandi — Pakistan’s Direct Agri-Trading Exchange',
    description:
      'Connect directly with Pakistani growers and verified commercial buyers with 0% middleman fees.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${gtAmerica.variable} ${gtAmericaMono.variable}`}
    >
      <body className="min-h-screen bg-km-cream-100 text-km-ink font-sans antialiased flex flex-col pb-16 sm:pb-0">
        <Providers>
          <NavigationProgress />
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}

