'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Lock } from 'lucide-react';

export default function RentalCheckoutPage() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fleet</span>
        </Link>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Secure Booking
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black">Rental Checkout</h1>
        </div>

        {isSuccess ? (
          <div className="bg-white p-12 rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-black">Reservation Confirmed!</h2>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Your rental contract has been generated. Doorstep delivery details have been dispatched to your email.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Payment Details Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-2 text-black font-black text-base">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Information</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <Lock className="w-3 h-3" />
                  256-bit Encrypted
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Cardholder Name"
                  required
                  placeholder="John Doe"
                />

                <Input
                  label="Card Number"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="•••• •••• •••• 4242"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiration Date"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM / YY"
                  />
                  <Input
                    label="CVC / CVV"
                    required
                    type="password"
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="•••"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="dark"
                    size="lg"
                    isLoading={isProcessing}
                    className="w-full font-bold shadow-md hover:bg-black"
                  >
                    Authorize & Complete Reservation
                  </Button>
                </div>
              </form>
            </div>

            {/* Reservation Summary */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
              <h3 className="text-base font-black text-black border-b border-zinc-100 pb-3">
                Rental Summary
              </h3>

              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80"
                  alt="Car"
                  className="w-20 h-14 object-cover rounded-xl border border-zinc-200"
                />
                <div>
                  <h4 className="text-sm font-black text-black">Viper SXT Coupe</h4>
                  <p className="text-xs text-zinc-400">4 Days Rental • Miami Hub</p>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-zinc-100 pt-4 text-zinc-600">
                <div className="flex justify-between">
                  <span>4 Days Rental ($329 / day)</span>
                  <span className="font-bold text-black">{formatPrice(1316)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Refundable Security Hold</span>
                  <span className="font-bold text-black">{formatPrice(1000)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Comprehensive CDW Insurance</span>
                  <span className="font-bold text-black">{formatPrice(0)} (Included)</span>
                </div>
                <div className="flex justify-between text-base font-black text-black border-t border-zinc-200 pt-3">
                  <span>Total Amount</span>
                  <span>{formatPrice(2316)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
