'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Building2, ShieldCheck, ShieldAlert, Check, X } from 'lucide-react';

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminService
      .getProviders()
      .then((res) => setProviders(res))
      .finally(() => setIsLoading(false));
  }, []);

  const handleVerify = async (providerId: string, isVerified: boolean) => {
    try {
      await adminService.verifyProvider(providerId, isVerified);
      setProviders(
        providers.map((p) => (p._id === providerId ? { ...p, isVerified } : p))
      );
    } catch {
      setProviders(
        providers.map((p) => (p._id === providerId ? { ...p, isVerified } : p))
      );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Super Admin</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-black">Dealership & Fleet Approvals</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Review commercial provider license credentials and manage verified partner badges.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200">
                <tr>
                  <th className="py-4 px-6">Dealership Name</th>
                  <th className="py-4 px-6">Business Model</th>
                  <th className="py-4 px-6">Phone / Email</th>
                  <th className="py-4 px-6">License Verification</th>
                  <th className="py-4 px-6 text-right">Approval Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-semibold text-zinc-800">
                {providers.map((p) => (
                  <tr key={p._id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-black">{p.businessName}</p>
                          <p className="text-[11px] text-zinc-400">Rating: {p.rating || 5.0} ★</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <Badge variant="dark" size="sm" className="capitalize">
                        {p.providerType}
                      </Badge>
                    </td>

                    <td className="py-4 px-6">
                      <p className="text-zinc-800">{p.phone}</p>
                      <p className="text-[11px] text-zinc-400">{p.email}</p>
                    </td>

                    <td className="py-4 px-6">
                      {p.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Verified Dealer
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          Pending Review
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      {!p.isVerified ? (
                        <button
                          type="button"
                          onClick={() => handleVerify(p._id, true)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleVerify(p._id, false)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-bold transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Revoke</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
