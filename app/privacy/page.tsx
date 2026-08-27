import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-zinc-200 shadow-sm space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Data Protection</span>
          <h1 className="text-3xl font-black text-black mt-1">Privacy & Security Policy</h1>
          <p className="text-xs text-zinc-400 mt-1">Last Updated: August 2026</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">1. Information We Collect</h2>
            <p>
              We collect information provided directly during registration and booking, including your full name, email address, phone number, driver&apos;s license details, and billing information. Automated diagnostics and telemetry data are collected solely for roadside safety and fleet management.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">2. How We Protect Your Data</h2>
            <p>
              Carketo employs 256-bit TLS encryption across all network communications. Passwords are encrypted using Argon2id cryptographic hashing, and sensitive payment card records are handled via PCI-DSS compliant payment gateways.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">3. Cookies & Session Storage</h2>
            <p>
              We use secure, HTTP-only authentication cookies to maintain your login session securely without exposing tokens to clientside JavaScript or third-party tracking scripts.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-black">4. Your Rights & Data Deletion</h2>
            <p>
              You have the full right to inspect, export, or request permanent deletion of your account and personal records at any time through your Account Settings or by contacting concierge@carketo.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
