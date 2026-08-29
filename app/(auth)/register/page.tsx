'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  const { user, isAuthenticated, isInitialized, setAuth } = useAuthStore();

  const redirectUrl = searchParams.get('redirect') || searchParams.get('from') || '/dashboard';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Automatically redirect if already logged in
  useEffect(() => {
    if (isInitialized && isAuthenticated && user) {
      const explicitRedirect = searchParams.get('redirect') || searchParams.get('from');
      const targetUrl = explicitRedirect || (user.role === 'admin' ? '/admin' : '/dashboard');
      router.replace(targetUrl);
    }
  }, [isInitialized, isAuthenticated, user, searchParams, router]);

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

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase font-bold text-zinc-400">
          <span className="bg-white px-3">Or continue with</span>
        </div>
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={() => {
          window.location.href = authService.getGoogleAuthUrl();
        }}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full border border-zinc-300 bg-white hover:bg-zinc-50 text-xs sm:text-sm font-bold text-black shadow-sm transition-all"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

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
