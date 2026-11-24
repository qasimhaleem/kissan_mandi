'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { API_BASE } from '@/lib/api';

export default function LoginPage() {
  const { login } = useAuth();
  const { t, locale } = useLanguage();
  const isUrdu = locale === 'ur';

  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password flow
  const [showForgot, setShowForgot] = useState(false);
  const [resetPhone, setResetPhone] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'submit'>('request');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneOrEmail || !password) {
      setError('Please enter your phone or email and password');
      return;
    }

    setLoading(true);
    const res = await login(phoneOrEmail, password);
    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Login failed');
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!resetPhone) {
      setError('Please provide your phone number.');
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: resetPhone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(
          data.error?.message || data.message || 'Failed to request password reset.'
        );
      }

      setResetToken(data.mockResetToken || '');
      setResetStep('submit');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to request reset.'
      );
    } finally {
      setResetLoading(false);
    }
  };

  const handleExecuteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!resetToken || !newPassword) {
      setError('Reset token and new password are required.');
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(
          data.error?.message || data.message || 'Password reset failed.'
        );
      }

      setResetSuccess(
        'Password has been successfully updated. You may now log in.'
      );
      setShowForgot(false);
      setPassword('');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to update password.'
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="km-container py-10 sm:py-16">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-km-green-200/80 shadow-km-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Form Column */}
        <div className="lg:col-span-6 p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="space-y-2 mb-7">
            <Link href="/" className="inline-block mb-3">
              <Image
                src="/logo.png"
                alt="KissanMandi — Farmers Marketplace"
                width={185}
                height={36}
                className="h-8 w-auto object-contain hover:opacity-90 transition-opacity"
                priority
              />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-km-ink">
              {t('login')}
            </h1>
            <p className="text-sm text-km-ink-muted">
              {isUrdu
                ? 'اپنے کسان منڈی پورٹل میں داخل ہوں'
                : 'Sign in to access your KissanMandi Farmer or Buyer portal.'}
            </p>
          </div>

          {resetSuccess && (
            <div className="mb-5 p-3.5 bg-km-green-50 border border-km-green-300 text-km-green-800 rounded-xl text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-km-green-700 flex-shrink-0" />
              <span>{resetSuccess}</span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-5 p-3.5 bg-km-cream-200 border border-km-ink/30 text-km-ink rounded-xl text-sm font-semibold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-km-ink flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!showForgot ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="login-identifier"
                  className="block text-sm font-bold text-km-ink mb-1.5"
                >
                  {isUrdu ? 'فون نمبر یا ای میل' : 'Phone Number or Email'}
                </label>
                <input
                  id="login-identifier"
                  type="text"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="03001234567 or user@domain.com"
                  required
                  className="km-input py-3.5 text-base"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="text-sm font-bold text-km-ink"
                  >
                    {t('password')}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(true);
                      setError('');
                    }}
                    className="text-xs font-bold text-km-green-700 hover:text-km-green-900 underline"
                  >
                    {isUrdu ? 'پاس ورڈ بھول گئے؟' : 'Forgot Password?'}
                  </button>
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="km-input py-3.5 text-base"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full km-btn-primary py-4 text-base mt-2"
              >
                {loading
                  ? isUrdu
                    ? 'تصدیق ہو رہی ہے...'
                    : 'Authenticating...'
                  : t('login')}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 bg-km-cream-100 rounded-xl border border-km-cream-300 text-xs text-km-ink-muted font-medium">
                Reset your password using your registered phone number.
              </div>

              {resetStep === 'request' ? (
                <form onSubmit={handleRequestReset} className="space-y-3.5">
                  <div>
                    <label
                      htmlFor="reset-phone"
                      className="block text-xs font-bold text-km-ink mb-1.5"
                    >
                      Registered Phone Number
                    </label>
                    <input
                      id="reset-phone"
                      type="tel"
                      value={resetPhone}
                      onChange={(e) => setResetPhone(e.target.value)}
                      required
                      placeholder="03001234567"
                      className="km-input"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full km-btn-primary py-3"
                  >
                    {resetLoading ? 'Requesting...' : 'Send Reset Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleExecuteReset} className="space-y-3.5">
                  <div>
                    <label
                      htmlFor="reset-token"
                      className="block text-xs font-bold text-km-ink mb-1.5"
                    >
                      Reset Token / Code
                    </label>
                    <input
                      id="reset-token"
                      type="text"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      required
                      className="km-input font-mono"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="reset-new-password"
                      className="block text-xs font-bold text-km-ink mb-1.5"
                    >
                      New Password
                    </label>
                    <input
                      id="reset-new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="km-input"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full km-btn-primary py-3"
                  >
                    {resetLoading ? 'Updating...' : 'Set New Password'}
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowForgot(false);
                  setError('');
                }}
                className="w-full text-center text-xs text-km-green-800 underline font-bold pt-1"
              >
                Back to Login
              </button>
            </div>
          )}

          <div className="mt-7 pt-5 border-t border-km-green-100 text-center text-sm font-medium text-km-ink-muted">
            <Link
              href="/register"
              className="text-km-green-800 font-bold hover:underline"
            >
              {t('dontHaveAccount')}
            </Link>
          </div>
        </div>

        {/* Visual Editorial Side Column */}
        <div className="hidden lg:block lg:col-span-6 relative min-h-[520px] bg-km-green-900">
          <Image
            src="/images/hero-farm.jpg"
            alt="Pakistani farmer in green wheat field"
            fill
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-km-green-900/90 via-km-green-900/30 to-transparent" />
          <div className="absolute bottom-8 inset-x-8 text-white space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-km-green-700/90 text-km-green-100 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Commission Marketplace</span>
            </span>
            <h2 className="text-2xl font-extrabold text-white">
              Direct Access to Verified Farmers & Commercial Buyers
            </h2>
            <p className="text-sm text-km-green-100 leading-relaxed">
              Manage your harvest listings, track incoming bids, and settle deals directly with Cash on Delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
