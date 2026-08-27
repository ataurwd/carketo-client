import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-zinc-200 shadow-sm space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Legal Agreement</span>
          <h1 className="text-3xl font-black text-black mt-1">Terms of Service & Rental Agreement</h1>
          <p className="text-xs text-zinc-400 mt-1">Last Updated: August 2026</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or booking through Carketo (&quot;the Platform&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue using our services immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">2. Driver Eligibility & Verification</h2>
            <p>
              All renters must be at least 21 years of age (25 for high-performance supercars) and possess a valid, unexpired driver&apos;s license held continuously for at least 12 months. All drivers must pass our automated identity and driving record verification checks.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">3. Security Deposits & Payment Authorization</h2>
            <p>
              A mandatory refundable security deposit is authorized on the primary renter&apos;s payment card prior to vehicle dispatch. This hold covers potential tolls, fuel discrepancies, fines, or excess damage and is released within 72 hours of unblemished vehicle inspection.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">4. Vehicle Usage Policies</h2>
            <p>
              All vehicles on Carketo are strictly non-smoking. Unauthorized track racing, sub-leasing, or driving outside authorized territory limits without written consent is strictly prohibited and forfeits insurance coverage.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">5. Cancellation & Refunds</h2>
            <p>
              Full refunds are granted for bookings cancelled at least 24 hours prior to scheduled pickup. Cancellations within 24 hours are subject to a standard 1-day rental fee charge.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
