'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { Mail, Lock, User as UserIcon, Phone, ArrowRight, AlertCircle, CheckCircle2, Building2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [role, setRole] = useState<'user' | 'provider'>('user');
  const [providerType, setProviderType] = useState<'seller' | 'rental' | 'both'>('both');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const data = await authService.register({
        name,
        email,
        password,
        phone,
        role,
        providerType: role === 'provider' ? providerType : undefined,
      });

      setAuth(data.user, data.accessToken);
      setSuccess('Account created successfully! Welcome to Carketo.');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <Logo variant="dark" size="lg" />
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Join Carketo to rent, buy, or list your vehicles worldwide.
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-zinc-100 rounded-2xl border border-zinc-200">
          <button
            type="button"
            onClick={() => setRole('user')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'user'
                ? 'bg-black text-white shadow-md'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Customer / Renter</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('provider')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'provider'
                ? 'bg-black text-white shadow-md'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Car Dealer / Fleet</span>
          </button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={role === 'provider' ? 'Business / Dealership Name' : 'Full Name'}
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={role === 'provider' ? 'Apex Motors LLC' : 'John Doe'}
            leftIcon={<UserIcon className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          {role === 'provider' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                Provider Business Model
              </label>
              <select
                value={providerType}
                onChange={(e: any) => setProviderType(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
              >
                <option value="both">Both Car Rental & Selling (Recommended)</option>
                <option value="rental">Rental Fleet Only</option>
                <option value="seller">Car Dealership / Sales Only</option>
              </select>
            </div>
          )}

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters (uppercase, lowercase, number)"
            helperText="Must be at least 8 characters with upper, lower and numbers."
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <Button
            type="submit"
            variant="dark"
            size="lg"
            isLoading={isLoading}
            className="w-full text-sm font-bold shadow-md hover:bg-black mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {role === 'provider' ? 'Create Provider Account' : 'Create Customer Account'}
          </Button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs font-semibold text-zinc-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-black hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
