'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-black">
            We are here to assist your journey
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Have questions about custom rentals, fleet bookings, or vehicle sales? Reach out to our 24/7 concierge team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-black text-white p-8 sm:p-10 rounded-3xl space-y-8 shadow-xl">
            <div>
              <h3 className="text-xl font-black">Headquarters & Concierge</h3>
              <p className="text-xs text-zinc-400 mt-1">Available 24 hours a day, 7 days a week.</p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-2xl bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">Call Support</p>
                  <p className="text-zinc-400 mt-0.5">+1 (800) 555-CARKETO</p>
                  <p className="text-zinc-400">+1 (212) 555-0199</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-2xl bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">Direct Email</p>
                  <p className="text-zinc-400 mt-0.5">concierge@carketo.com</p>
                  <p className="text-zinc-400">sales@carketo.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-2xl bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">Showroom & Executive Hub</p>
                  <p className="text-zinc-400 mt-0.5">
                    5th Avenue Executive Suite, Manhattan, NY 10022
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-black text-black">Send Us a Message</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Fill out the form below and an automotive specialist will respond within 30 minutes.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-black">Thank You!</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Your inquiry has been received. Our concierge team is reviewing your message and will reach out promptly.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <Input
                  label="Subject"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. VIP Airport Delivery Inquiry"
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you with your rental or purchase today?"
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                  />
                </div>

                <Button
                  type="submit"
                  variant="dark"
                  size="lg"
                  className="w-full font-bold shadow-md hover:bg-black"
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Submit Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
