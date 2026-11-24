'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { useLanguage } from '@/context/LanguageContext';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: {
          new (
            options: {
              pageLanguage: string;
              includedLanguages: string;
              layout?: unknown;
              autoDisplay?: boolean;
            },
            elementId: string
          ): unknown;
          InlineLayout?: {
            SIMPLE: unknown;
          };
        };
      };
    };
  }
}

export default function GoogleTranslate() {
  const { setLocale } = useLanguage();
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    // Check if googtrans cookie is already present
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const gtCookie = getCookie('googtrans');
    if (gtCookie && gtCookie.includes('/ur')) {
      setCurrentLang('ur');
      setLocale('ur');
    } else {
      setCurrentLang('en');
      setLocale('en');
    }

    // Define Google Translate initialization callback
    window.googleTranslateElementInit = () => {
      const gTranslate = window.google?.translate?.TranslateElement;
      if (gTranslate) {
        new gTranslate(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,ur,pa,sd',
            layout: gTranslate.InlineLayout?.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };
  }, [setLocale]);

  const handleLanguageChange = (lang: 'en' | 'ur') => {
    if (lang === currentLang) return;

    setCurrentLang(lang);
    setLocale(lang);

    const hostname = window.location.hostname;
    // Set googtrans cookie for root and current domain
    if (lang === 'en') {
      document.cookie = 'googtrans=/en/en; path=/;';
      document.cookie = `googtrans=/en/en; path=/; domain=${hostname};`;
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
      document.cookie = `googtrans=; path=/; domain=${hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    } else {
      document.cookie = `googtrans=/en/${lang}; path=/;`;
      document.cookie = `googtrans=/en/${lang}; path=/; domain=${hostname};`;
    }

    // If Google Translate dropdown select exists in DOM, trigger its change
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    } else {
      // Refresh to allow Google Translate script to read cookie on boot
      window.location.reload();
    }
  };

  return (
    <div className="notranslate inline-flex items-center">
      {/* Hidden standard Google Translate DOM target */}
      <div id="google_translate_element" className="hidden" aria-hidden="true" />

      {/* Google Translate Script */}
      <Script
        id="google-translate-script"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      {/* Duffel-Style Segmented Language Switcher */}
      <div
        role="group"
        aria-label="Language selector via Google Translate"
        className="inline-flex items-center p-0.5 rounded-full bg-neutral-100 border border-neutral-200/80"
      >
        <button
          type="button"
          onClick={() => handleLanguageChange('en')}
          aria-pressed={currentLang === 'en'}
          title="Switch to English"
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
            currentLang === 'en'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => handleLanguageChange('ur')}
          aria-pressed={currentLang === 'ur'}
          title="Google Translate to Urdu (اردو)"
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
            currentLang === 'ur'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          اردو
        </button>
      </div>
    </div>
  );
}
