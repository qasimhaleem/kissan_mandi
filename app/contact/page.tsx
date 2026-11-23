'use client';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
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
      setError(
        'Please provide your name, message, and at least one contact method (phone or email).'
      );
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
        throw new Error(
          data.error?.message || data.message || 'Failed to submit inquiry.'
        );
      }

      setReferenceId(data.referenceId || 'INQ-' + Date.now().toString().slice(-6));
      setSubmitted(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-gradient-to-b from-km-cream-100 to-white border-b border-km-green-200/70 py-14 sm:py-16">
        <div className="km-container max-w-4xl text-center space-y-4">
          <span className="km-badge">
            <Mail className="w-3.5 h-3.5" />
            <span>Support & Field Inquiries</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-km-ink tracking-tight">
            Contact KissanMandi
          </h1>
          <p className="text-base sm:text-lg text-km-ink-muted max-w-2xl mx-auto">
            Questions about produce listings, competitive bidding, or commercial partnerships? Our regional agricultural support team is ready to assist.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-km-cream-100/50">
        <div className="km-container max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Information Cards */}
          <div className="lg:col-span-4 space-y-4">
            <div className="km-card p-6 space-y-2.5">
              <div className="w-11 h-11 rounded-xl bg-km-green-100 text-km-green-800 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h2 className="text-base font-extrabold text-km-ink">
                Toll-Free Helpline
              </h2>
              <p className="text-base font-extrabold text-km-green-800">
                0800-KISSAN (547726)
              </p>
              <p className="text-xs font-medium text-km-ink-muted flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-km-green-600" />
                <span>Mon–Sat, 7:00 AM – 9:00 PM PKT</span>
              </p>
            </div>

            <div className="km-card p-6 space-y-2.5">
              <div className="w-11 h-11 rounded-xl bg-km-green-100 text-km-green-800 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-base font-extrabold text-km-ink">
                Email Inquiries
              </h2>
              <p className="text-sm font-bold text-km-green-800">
                support@kissanmandi.pk
              </p>
              <p className="text-xs font-medium text-km-ink-muted">
                Responses within 2 business hours
              </p>
            </div>

            <div className="km-card p-6 space-y-2.5">
              <div className="w-11 h-11 rounded-xl bg-km-green-100 text-km-green-800 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-base font-extrabold text-km-ink">
                Regional Field Hubs
              </h2>
              <p className="text-xs font-medium text-km-ink-muted leading-relaxed">
                Lahore Trade Corridor, Multan Agricultural Hub, Faisalabad Grain Desk, and Mardan Horticulture Desk.
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-8">
            <div className="km-card p-6 sm:p-10">
              {submitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-km-green-100 text-km-green-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-km-ink">
                    Inquiry Received
                  </h2>
                  <p className="text-sm text-km-ink-muted max-w-md mx-auto">
                    Thank you, <strong>{name}</strong>. Your message has been logged with our regional support team.
                  </p>
                  <div className="inline-block px-4 py-2 rounded-xl bg-km-cream-100 border border-km-green-300 text-xs font-bold text-km-green-800">
                    Reference ID: {referenceId}
                  </div>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setName('');
                        setPhone('');
                        setEmail('');
                        setSubject('');
                        setMessage('');
                      }}
                      className="km-btn-outline"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-extrabold text-km-ink">
                      Send Us a Message
                    </h2>
                    <p className="text-sm text-km-ink-muted mt-0.5">
                      Fill in your contact information and we will reach out promptly.
                    </p>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="p-4 rounded-xl bg-km-cream-200 border border-km-ink/30 text-km-ink text-sm font-semibold flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-5 h-5 text-km-ink flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-bold text-km-ink mb-1.5">
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Muhammad Usman"
                        className="km-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-role" className="block text-xs font-bold text-km-ink mb-1.5">
                        I am a
                      </label>
                      <select
                        id="contact-role"
                        value={role}
                        onChange={(e) =>
                          setRole(e.target.value as 'farmer' | 'buyer' | 'other')
                        }
                        className="km-input"
                      >
                        <option value="farmer">Farmer / Grower</option>
                        <option value="buyer">Commercial Buyer / Mill</option>
                        <option value="other">Partner / Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-bold text-km-ink mb-1.5">
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="03001234567"
                        className="km-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-bold text-km-ink mb-1.5">
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="km-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-bold text-km-ink mb-1.5">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Bulk Wheat Procurement Support"
                      className="km-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold text-km-ink mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe how our team can help you..."
                      className="km-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full km-btn-primary py-3.5 text-base"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting Inquiry...' : 'Submit Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
