'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone || !password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    const res = await login(phone, password);
    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-[#8FD19E]">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🌾</div>
          <h1 className="text-2xl font-black text-[#2B2B2B]">
            {t('login')}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t('appName')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-base font-bold text-[#2B2B2B] mb-1.5">
              {t('phone')}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('phonePlaceholder')}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8FD19E] focus:outline-none text-lg text-[#2B2B2B]"
            />
          </div>

          <div>
            <label className="block text-base font-bold text-[#2B2B2B] mb-1.5">
              {t('password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8FD19E] focus:outline-none text-lg text-[#2B2B2B]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-xl rounded-xl shadow-sm transition-all min-h-[52px] flex items-center justify-center cursor-pointer"
          >
            {loading ? '...' : t('login')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-semibold">
          <Link href="/register" className="text-[#2B2B2B] underline hover:text-[#6DBE82]">
            {t('dontHaveAccount')}
          </Link>
        </div>
      </div>
    </div>
  );
}

