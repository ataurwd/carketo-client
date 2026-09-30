'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { providerService } from '@/services/provider.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Building2, Phone, Mail, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProviderProfilePage() {
  const [businessName, setBusinessName] = useState('');
  const [providerType, setProviderType] = useState('both');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('New York');
  const [country, setCountry] = useState('USA');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [taxId, setTaxId] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    providerService.getProfile().then((p: any) => {
      if (p) {
        setBusinessName(p.businessName || '');
        setProviderType(p.providerType || 'both');
        setPhone(p.phone || '');
        setEmail(p.email || '');
        setCity(p.address?.city || 'New York');
        setCountry(p.address?.country || 'USA');
        setRegistrationNumber(p.registrationNumber || '');
        setTaxId(p.taxId || '');
      }
    }).catch(() => {
      // Mock fallback for preview
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg(null);

    try {
      await providerService.updateProfile({
        businessName,
        providerType,
        phone,
        address: { city, country },
      });
      setMsg({ type: 'success', text: 'ডিলারশিপ প্রোফাইল সফলভাবে আপডেট করা হয়েছে।' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'প্রোভাইডার প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে।' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/provider"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>প্রোভাইডার হাবে ফিরে যান</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black text-black">ডিলারশিপ ও গাড়ির প্রোফাইল</h1>

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          {msg && (
            <div
              className={`flex items-center gap-2 p-3.5 rounded-2xl text-xs font-semibold ${
                msg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {msg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <Input
              label="ব্যবসা / ডিলারশিপের নাম"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="যেমন: অ্যাপেক্স লাক্সারি মোটরস"
              leftIcon={<Building2 className="w-4 h-4" />}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                গাড়ির ব্যবসায়িক মডেল
              </label>
              <select
                value={providerType}
                onChange={(e) => setProviderType(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
              >
                <option value="both">গাড়ি ভাড়া ও বিক্রয় উভয়ই</option>
                <option value="rental">শুধুমাত্র গাড়ি ভাড়া</option>
                <option value="seller">শুধুমাত্র গাড়ি ডিলারশিপ / বিক্রয়</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="যোগাযোগের ফোন নম্বর"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+৮৮০ ১৭১২-৩৪৫৬৭৮"
                leftIcon={<Phone className="w-4 h-4" />}
              />

              <Input
                label="ব্যবসায়িক ইমেইল"
                value={email}
                disabled
                helperText="অ্যাকাউন্টের সাথে নিবন্ধিত ইমেইল।"
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="শহর / অঞ্চল"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="ঢাকা"
                leftIcon={<MapPin className="w-4 h-4" />}
              />

              <Input
                label="দেশ"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="বাংলাদেশ"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="dark"
                size="md"
                isLoading={isLoading}
                className="w-full font-bold shadow-md hover:bg-black"
              >
                ডিলারশিপের তথ্য সংরক্ষণ করুন
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
