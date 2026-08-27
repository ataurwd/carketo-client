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
      setMsg({ type: 'success', text: 'Dealership profile updated successfully.' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Failed to update provider profile.' });
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
          <span>Back to Provider Hub</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black text-black">Dealership & Fleet Profile</h1>

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
              label="Business / Dealership Name"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Apex Luxury Motors LLC"
              leftIcon={<Building2 className="w-4 h-4" />}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                Fleet Business Model
              </label>
              <select
                value={providerType}
                onChange={(e) => setProviderType(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
              >
                <option value="both">Both Car Rental & Sales</option>
                <option value="rental">Rental Fleet Only</option>
                <option value="seller">Car Dealership / Sales Only</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 0199"
                leftIcon={<Phone className="w-4 h-4" />}
              />

              <Input
                label="Business Email"
                value={email}
                disabled
                helperText="Email registered with account."
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City / Region"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York"
                leftIcon={<MapPin className="w-4 h-4" />}
              />

              <Input
                label="Country"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="USA"
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
                Save Dealership Details
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
