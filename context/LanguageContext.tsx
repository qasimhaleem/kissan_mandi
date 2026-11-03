'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '@/locales/en.json';
import ur from '@/locales/ur.json';

type Locale = 'ur' | 'en';

interface LanguageContextType {
  locale: Locale;
  setLocale: (lang: Locale) => void;
  t: (key: string) => any;
  dir: 'rtl' | 'ltr';
}

const translations: Record<Locale, any> = { en, ur };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to Urdu for farmers as per requirements
  const [locale, setLocaleState] = useState<Locale>('ur');

  useEffect(() => {
    const saved = localStorage.getItem('km_locale') as Locale;
    if (saved && (saved === 'ur' || saved === 'en')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (lang: Locale) => {
    setLocaleState(lang);
    localStorage.setItem('km_locale', lang);
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations[locale];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback: any = translations['en'];
        for (const fKey of keys) {
          if (fallback && fallback[fKey] !== undefined) {
            fallback = fallback[fKey];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return typeof current === 'string' ? current : path;
  };

  const dir = locale === 'ur' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [dir, locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      <div dir={dir} className={locale === 'ur' ? 'font-urdu' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

