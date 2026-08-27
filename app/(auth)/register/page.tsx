'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { Mail, Lock, User as UserIcon, Phone, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const redirectUrl = searchParams.get('redirect') || searchParams.get('from') || '/dashboard';

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
      });

      setAuth(data.user, data.accessToken);
      setSuccess('Account created successfully! Welcome to Carketo.');
      const targetUrl =
        searchParams.get('redirect') ||
        searchParams.get('from') ||
        (data.user?.role === 'admin' ? '/admin' : '/dashboard');
      setTimeout(() => {
        router.push(targetUrl);
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-xl">
      {/* Header */}
      <div className="text-center space-y-3">
        <Link href="/" className="inline-block">
          <Logo variant="dark" size="lg" />
        </Link>
        <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Create an Account
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500">
          Join Carketo to rent, buy, or sell vehicles directly with zero commissions.
        </p>
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
          label="Full Name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ataur Rahman"
          leftIcon={<UserIcon className="w-4 h-4" />}
        />

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
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 01712345678"
          leftIcon={<Phone className="w-4 h-4" />}
        />

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
          Create Account
        </Button>
      </form>

      <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-medium">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Argon2id Encrypted • Direct Buyer & Seller Contact</span>
      </div>

      {/* Footer Link */}
      <p className="text-center text-xs font-semibold text-zinc-500 pt-2 border-t border-zinc-100">
        Already have an account?{' '}
        <Link
          href={`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
          className="font-bold text-black hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50">
      <Suspense fallback={<div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin" />}>
        <RegisterFormContent />
      </Suspense>
    </div>
  );
}
