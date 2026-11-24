'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  MapPin,
  UserCheck,
  ShoppingCart,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

const PAKISTAN_DISTRICTS = [
  'Lahore',
  'Mardan',
  'Faisalabad',
  'Rawalpindi',
  'Multan',
  'Gujranwala',
  'Sargodha',
  'Bahawalpur',
  'Sahiwal',
  'Sheikhupura',
  'Jhang',
  'Rahim Yar Khan',
  'Kasur',
  'Okara',
  'Pakpattan',
  'Vehari',
  'Khanewal',
  'Muzaffargarh',
  'Dera Ghazi Khan',
  'Bahawalnagar',
  'Peshawar',
  'Swat',
  'Hyderabad',
  'Sukkur',
  'Quetta',
];

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole =
    (searchParams.get('role') as 'farmer' | 'buyer') || 'farmer';

  const { register, verifyOtp } = useAuth();
  const { t, locale } = useLanguage();
  const isUrdu = locale === 'ur';
  const router = useRouter();

  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'farmer' | 'buyer'>(initialRole);
  const [district, setDistrict] = useState('Lahore');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 31.5204,
    lng: 74.3587,
  });
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Verification state
  const [otpCode, setOtpCode] = useState('');
  const [mockOtpDispatched, setMockOtpDispatched] = useState<string | null>(
    null
  );
  const [verifying, setVerifying] = useState(false);

  const handleAutoLocation = () => {
    if ('geolocation' in navigator) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLocating(false);
          alert(t('locationDetected'));
        },
        () => {
          setLocating(false);
          alert('Could not detect location. Please select district manually.');
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !phone || !password) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    const res = await register({
      name,
      phone,
      email: email ? email.trim() : undefined,
      password,
      role,
      district,
      coordinates: coords,
    });
    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Registration failed');
      return;
    }

    if (res.mockOtp) {
      setMockOtpDispatched(res.mockOtp);
      setOtpCode(res.mockOtp);
      setStep('verify');
    } else {
      router.push(role === 'farmer' ? '/farmer' : '/buyer');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpCode) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setVerifying(true);
    const res = await verifyOtp(phone, otpCode);
    setVerifying(false);

    if (!res.success) {
      setError(res.message || 'OTP verification failed');
      return;
    }

    router.push(role === 'farmer' ? '/farmer' : '/buyer');
  };

  if (step === 'verify') {
    return (
      <div className="max-w-md mx-auto km-card p-8 space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-km-green-100 flex items-center justify-center mx-auto text-km-green-800">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-km-ink">
            Verify Phone Number
          </h1>
          <p className="text-sm text-km-ink-muted mt-1">
            A 6-digit verification code has been dispatched for{' '}
            <span className="font-bold text-km-ink">{phone}</span>.
          </p>
        </div>

        {mockOtpDispatched && (
          <div className="p-3.5 bg-km-cream-100 border border-km-green-300 rounded-xl text-xs text-km-ink-muted">
            <span className="font-bold">Verification Code:</span>{' '}
            <span className="font-mono font-extrabold text-base text-km-green-800">
              {mockOtpDispatched}
            </span>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="p-3.5 bg-km-cream-200 border border-km-ink/30 text-km-ink rounded-xl text-sm font-semibold"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label
              htmlFor="otp-code"
              className="block text-xs font-bold text-km-ink uppercase mb-1.5"
            >
              Enter 6-Digit Code
            </label>
            <input
              id="otp-code"
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
              placeholder="123456"
              className="km-input text-center tracking-widest text-2xl font-mono py-3.5"
            />
          </div>

          <button
            type="submit"
            disabled={verifying}
            className="w-full km-btn-primary py-4 text-base"
          >
            {verifying ? 'Verifying...' : 'Confirm Verification & Continue'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push(role === 'farmer' ? '/farmer' : '/buyer')}
          className="text-xs text-km-green-800 underline font-semibold"
        >
          Skip verification for now and proceed to portal
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-km-green-200/80 shadow-km-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      {/* Form Column */}
      <div className="lg:col-span-7 p-7 sm:p-10">
        <div className="space-y-1.5 mb-6">
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
            {t('signup')}
          </h1>
          <p className="text-sm text-km-ink-muted">
            {isUrdu
              ? 'کسان یا خریدار کے طور پر اپنا مفت اکاؤنٹ بنائیں'
              : 'Create your free Farmer or Buyer account in under a minute.'}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 p-3.5 bg-km-cream-200 border border-km-ink/30 text-km-ink rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-km-ink flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <span className="block text-xs font-bold text-km-ink uppercase tracking-wider mb-2">
              {t('chooseRole')}
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('farmer')}
                className={`p-4 rounded-2xl border-2 text-start transition-all flex items-center gap-3 ${
                  role === 'farmer'
                    ? 'border-km-green-700 bg-km-green-50 text-km-ink shadow-km-sm'
                    : 'border-km-green-200/80 bg-white text-km-ink-muted hover:border-km-green-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    role === 'farmer'
                      ? 'bg-km-green-700 text-white'
                      : 'bg-km-cream-100 text-km-green-800'
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold">{t('farmer')}</div>
                  <div className="text-[11px] text-km-ink-muted">
                    {isUrdu ? 'فصل فروخت کریں' : 'Sell produce'}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`p-4 rounded-2xl border-2 text-start transition-all flex items-center gap-3 ${
                  role === 'buyer'
                    ? 'border-km-green-700 bg-km-green-50 text-km-ink shadow-km-sm'
                    : 'border-km-green-200/80 bg-white text-km-ink-muted hover:border-km-green-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    role === 'buyer'
                      ? 'bg-km-green-700 text-white'
                      : 'bg-km-cream-100 text-km-green-800'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold">{t('buyer')}</div>
                  <div className="text-[11px] text-km-ink-muted">
                    {isUrdu ? 'بولی لگائیں' : 'Browse & bid'}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="reg-name"
                className="block text-xs font-bold text-km-ink mb-1.5"
              >
                {t('fullName')} *
              </label>
              <input
                id="reg-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Muhammad Ali"
                className="km-input"
              />
            </div>

            <div>
              <label
                htmlFor="reg-phone"
                className="block text-xs font-bold text-km-ink mb-1.5"
              >
                {t('phone')} *
              </label>
              <input
                id="reg-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phonePlaceholder')}
                className="km-input"
              />
            </div>
          </div>

          {/* Email & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-bold text-km-ink mb-1.5"
              >
                Email (Optional)
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="km-input"
              />
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs font-bold text-km-ink mb-1.5"
              >
                {t('password')} *
              </label>
              <input
                id="reg-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="km-input"
              />
            </div>
          </div>

          {/* District & Auto Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <label
                htmlFor="reg-district"
                className="block text-xs font-bold text-km-ink mb-1.5"
              >
                {t('district')} *
              </label>
              <select
                id="reg-district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="km-input"
              >
                {PAKISTAN_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleAutoLocation}
              disabled={locating}
              className="km-btn-outline py-3 text-xs"
            >
              <MapPin className="w-4 h-4 text-km-green-700" />
              <span>
                {locating ? 'Detecting GPS...' : t('autoDetectLocation')}
              </span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full km-btn-primary py-4 text-base mt-2"
          >
            {loading ? 'Creating Account...' : t('register')}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-km-green-100 text-center text-sm font-medium text-km-ink-muted">
          <Link
            href="/login"
            className="text-km-green-800 font-bold hover:underline"
          >
            {t('alreadyHaveAccount')}
          </Link>
        </div>
      </div>

      {/* Visual Side Panel */}
      <div className="hidden lg:block lg:col-span-5 relative min-h-[560px] bg-km-green-900">
        <Image
          src="/images/mandi-direct.jpg"
          alt="Direct agricultural trade between Pakistani farmer and buyer"
          fill
          sizes="42vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-km-green-900/90 via-km-green-900/35 to-transparent" />
        <div className="absolute bottom-8 inset-x-8 text-white space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-km-green-700/90 text-km-green-100 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Free Registration</span>
          </span>
          <h2 className="text-2xl font-extrabold text-white">
            Join 2,400+ Farmers & Buyers Across Pakistan
          </h2>
          <p className="text-sm text-km-green-100 leading-relaxed">
            Zero commission fees, verified farm photos, and transparent competitive pricing on every harvest.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="km-container py-10 sm:py-16">
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-km-green-700 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
