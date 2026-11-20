'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { Sprout, KeyRound, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '@/lib/api';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();

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
        throw new Error(data.error?.message || data.message || 'Failed to request password reset.');
      }

      setResetToken(data.mockResetToken || '');
      setResetStep('submit');
    } catch (err: any) {
      setError(err.message || 'Failed to request reset.');
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
        throw new Error(data.error?.message || data.message || 'Password reset failed.');
      }

      setResetSuccess('Password has been successfully updated. You may now log in.');
      setShowForgot(false);
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-[#8FD19E]">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#8FD19E] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Sprout className="w-6 h-6 text-[#2B2B2B]" />
          </div>
          <h1 className="text-2xl font-black text-[#2B2B2B]">
            {t('login')}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Access your KissanMandi Portal
          </p>
        </div>

        {resetSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>{resetSuccess}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        {!showForgot ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base font-bold text-[#2B2B2B] mb-1.5">
                Phone Number or Email
              </label>
              <input
                type="text"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="03001234567 or user@domain.com"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8FD19E] focus:outline-none text-base text-[#2B2B2B]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-base font-bold text-[#2B2B2B]">
                  {t('password')}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(true);
                    setError('');
                  }}
                  className="text-xs font-bold text-gray-500 hover:text-[#2B2B2B] underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8FD19E] focus:outline-none text-base text-[#2B2B2B]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-xl rounded-xl shadow-sm transition-all min-h-[52px] flex items-center justify-center cursor-pointer"
            >
              {loading ? 'Authenticating...' : t('login')}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-[#FAF6EA] rounded-xl border border-gray-200 text-xs text-gray-700 font-medium">
              Reset your password using your registered phone number.
            </div>

            {resetStep === 'request' ? (
              <form onSubmit={handleRequestReset} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#2B2B2B] mb-1">
                    Registered Phone Number
                  </label>
                  <input
                    type="tel"
                    value={resetPhone}
                    onChange={(e) => setResetPhone(e.target.value)}
                    required
                    placeholder="03001234567"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-bold text-sm rounded-xl"
                >
                  {resetLoading ? 'Requesting...' : 'Send Reset Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleExecuteReset} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#2B2B2B] mb-1">
                    Reset Token / Code
                  </label>
                  <input
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#2B2B2B] mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-bold text-sm rounded-xl"
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
              className="w-full text-center text-xs text-gray-500 underline font-bold mt-2"
            >
              Back to Login
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm font-semibold">
          <Link href="/register" className="text-[#2B2B2B] underline hover:text-[#6DBE82]">
            {t('dontHaveAccount')}
          </Link>
        </div>
      </div>
    </div>
  );
}
