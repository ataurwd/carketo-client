'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { contactService } from '@/services/contact.service';
import { showToast } from '@/lib/alert';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await contactService.submitContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: subject.trim(),
        message: message.trim(),
      });

      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      showToast('Your message has been sent successfully!', 'success');
    } catch (err: any) {
      const msg = err.message || 'Failed to submit your message. Please try again.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
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
                Fill out the form below and an automotive specialist will respond promptly.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {submitted ? (
              <div className="py-12 text-center space-y-4">
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
                    label="Your Name *"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    disabled={isSubmitting}
                  />
                  <Input
                    label="Subject *"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. VIP Airport Delivery Inquiry"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you with your rental or purchase today?"
                    disabled={isSubmitting}
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black disabled:bg-zinc-50 disabled:cursor-not-allowed"
                  />
                </div>

                <Button
                  type="submit"
                  variant="dark"
                  size="lg"
                  className="w-full font-bold shadow-md hover:bg-black"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  rightIcon={!isSubmitting ? <Send className="w-4 h-4" /> : undefined}
                >
                  {isSubmitting ? 'Sending Inquiry...' : 'Submit Inquiry'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
