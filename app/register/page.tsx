'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { MapPin, Sprout, UserCheck, ShoppingCart, CheckCircle2, ShieldCheck } from 'lucide-react';

const PUNJAB_DISTRICTS = [
  'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 
  'Sargodha', 'Bahawalpur', 'Sahiwal', 'Sheikhupura', 'Jhang', 
  'Rahim Yar Khan', 'Kasur', 'Okara', 'Pakpattan', 'Vehari', 
  'Khanewal', 'Muzaffargarh', 'Dera Ghazi Khan', 'Bahawalnagar'
];

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as 'farmer' | 'buyer') || 'farmer';

  const { register, verifyOtp } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'farmer' | 'buyer'>(initialRole);
  const [district, setDistrict] = useState('Lahore');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 31.5204, lng: 74.3587 });
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Verification state
  const [otpCode, setOtpCode] = useState('');
  const [mockOtpDispatched, setMockOtpDispatched] = useState<string | null>(null);
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
      setOtpCode(res.mockOtp); // Pre-fill for user convenience in testing
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
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-[#8FD19E] space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#8FD19E]/20 flex items-center justify-center mx-auto text-[#2B2B2B]">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-[#2B2B2B]">
            Verify Phone Number
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            A 6-digit verification code has been dispatched for <span className="font-bold text-[#2B2B2B]">{phone}</span>.
          </p>
        </div>

        {mockOtpDispatched && (
          <div className="p-3 bg-[#FAF6EA] border border-[#8FD19E] rounded-xl text-xs text-gray-700">
            <span className="font-bold">Test OTP Code:</span> <span className="font-mono font-bold text-base text-[#2B2B2B]">{mockOtpDispatched}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] uppercase mb-1.5">
              Enter 6-Digit Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
              placeholder="123456"
              className="w-full text-center tracking-widest text-2xl font-mono py-3 border-2 border-gray-200 rounded-xl focus:border-[#8FD19E] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={verifying}
            className="w-full py-4 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-lg rounded-xl shadow-sm transition-all"
          >
            {verifying ? 'Verifying...' : 'Confirm Verification & Continue'}
          </button>
        </form>

        <button
          onClick={() => router.push(role === 'farmer' ? '/farmer' : '/buyer')}
          className="text-xs text-gray-500 underline hover:text-[#2B2B2B]"
        >
          Skip verification for now and proceed to portal
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-[#8FD19E]">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#8FD19E] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
          <Sprout className="w-6 h-6 text-[#2B2B2B]" />
        </div>
        <h1 className="text-2xl font-black text-[#2B2B2B]">
          {t('signup')}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {t('tagline')}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Role Picker Buttons */}
      <div className="mb-5">
        <label className="block text-base font-bold text-[#2B2B2B] mb-2">
          {t('chooseRole')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`py-3 px-3 rounded-xl border-2 font-black text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'farmer'
                ? 'border-[#8FD19E] bg-[#8FD19E] text-[#2B2B2B]'
                : 'border-gray-200 bg-white text-gray-600'
            }`}
          >
            <UserCheck className="w-5 h-5" />
            <span>{t('farmer')}</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`py-3 px-3 rounded-xl border-2 font-black text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'buyer'
                ? 'border-[#8FD19E] bg-[#8FD19E] text-[#2B2B2B]'
                : 'border-gray-200 bg-white text-gray-600'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{t('buyer')}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-base font-bold text-[#2B2B2B] mb-1">
            {t('fullName')} *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Muhammad Akram"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8FD19E] focus:outline-none text-base text-[#2B2B2B]"
          />
        </div>

        <div>
          <label className="block text-base font-bold text-[#2B2B2B] mb-1">
            {t('phone')} *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('phonePlaceholder')}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8FD19E] focus:outline-none text-base text-[#2B2B2B]"
          />
        </div>

        <div>
          <label className="block text-base font-bold text-[#2B2B2B] mb-1">
            Email Address (Optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@domain.com"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8FD19E] focus:outline-none text-base text-[#2B2B2B]"
          />
        </div>

        <div>
          <label className="block text-base font-bold text-[#2B2B2B] mb-1">
            {t('password')} *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8FD19E] focus:outline-none text-base text-[#2B2B2B]"
          />
        </div>

        <div>
          <label className="block text-base font-bold text-[#2B2B2B] mb-1">
            {t('district')} *
          </label>
          <div className="flex gap-2">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8FD19E] focus:outline-none text-base text-[#2B2B2B] bg-white"
            >
              {PUNJAB_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAutoLocation}
              disabled={locating}
              title={t('autoDetectLocation')}
              className="px-3 bg-[#FAF6EA] border-2 border-[#8FD19E] rounded-xl flex items-center justify-center hover:bg-[#8FD19E] transition-colors"
            >
              <MapPin className="w-5 h-5 text-[#2B2B2B]" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-2 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-black text-xl rounded-xl shadow-sm transition-all min-h-[52px] flex items-center justify-center cursor-pointer"
        >
          {loading ? '...' : t('signup')}
        </button>
      </form>

      <div className="mt-5 text-center text-sm font-semibold">
        <Link href="/login" className="text-[#2B2B2B] underline hover:text-[#6DBE82]">
          {t('alreadyHaveAccount')}
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <Suspense fallback={<div className="text-sm font-bold text-gray-500">Loading registration...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
