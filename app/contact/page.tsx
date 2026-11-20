'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { API_BASE } from '@/lib/api';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'farmer' | 'buyer' | 'other'>('farmer');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !message || (!phone && !email)) {
      setError('Please provide your name, message, and at least one contact method (phone or email).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          role,
          subject: subject || 'General Inquiry',
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || data.message || 'Failed to submit inquiry.');
      }

      setReferenceId(data.referenceId || 'INQ-' + Date.now().toString().slice(-6));
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#8FD19E] text-xs font-bold text-[#2B2B2B]">
          <Mail className="w-4 h-4 text-[#6DBE82]" />
          <span>Support & Field Inquiries</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#2B2B2B] tracking-tight">
          Contact KissanMandi
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto font-medium">
          Have questions regarding produce listing, bidding auctions, or partnership opportunities? Our regional agricultural support team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Information Cards */}
        <div className="space-y-4 md:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6EA] border border-[#8FD19E] flex items-center justify-center text-[#2B2B2B]">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#2B2B2B]">Toll-Free Helpline</h3>
            <p className="text-sm font-black text-[#6DBE82]">0800-KISSAN (547726)</p>
            <p className="text-xs text-gray-500 font-medium">Mon-Sat, 7:00 AM - 9:00 PM PKT</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6EA] border border-[#8FD19E] flex items-center justify-center text-[#2B2B2B]">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#2B2B2B]">Email Inquiries</h3>
            <p className="text-sm font-bold text-[#2B2B2B]">support@kissanmandi.pk</p>
            <p className="text-xs text-gray-500 font-medium">Responses within 2 business hours</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6EA] border border-[#8FD19E] flex items-center justify-center text-[#2B2B2B]">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#2B2B2B]">Regional Field Hubs</h3>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Main Secretariat: Agricultural Trade Complex, Canal Road, Lahore.
              Regional Hubs: Multan, Faisalabad, Sahiwal, and Rahim Yar Khan.
            </p>
          </div>
        </div>

        {/* Interactive Inquiry Form */}
        <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto text-green-700">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-[#2B2B2B]">
                Inquiry Successfully Dispatched
              </h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto font-medium">
                Thank you for getting in touch. Your support reference ID is:
              </p>
              <div className="inline-block px-4 py-2 bg-[#FAF6EA] border border-[#8FD19E] rounded-xl font-mono font-bold text-lg text-[#2B2B2B]">
                {referenceId}
              </div>
              <p className="text-xs text-gray-500">
                A regional agricultural coordinator will contact you via phone or email shortly.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                    setSubject('');
                  }}
                  className="px-6 py-2.5 bg-[#FAF6EA] border border-gray-300 rounded-xl text-sm font-bold text-[#2B2B2B] hover:bg-gray-100 transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-black text-[#2B2B2B] mb-2">
                Send an Official Inquiry
              </h2>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-bold text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2B2B2B] uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8FD19E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2B2B] uppercase mb-1">
                    User Role *
                  </label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#8FD19E]"
                  >
                    <option value="farmer">Agricultural Farmer (Seller)</option>
                    <option value="buyer">Commercial Buyer / Processor</option>
                    <option value="other">Institutional / Media / Partner</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2B2B2B] uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 03001234567"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8FD19E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2B2B] uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8FD19E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] uppercase mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question about bulk wheat listing or bidding"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8FD19E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] uppercase mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Write your inquiry or question here..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8FD19E]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#8FD19E] hover:bg-[#6DBE82] text-[#2B2B2B] font-bold text-base rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
