'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { confirmDialog, showToast } from '@/lib/alert';
import { Button } from '@/components/ui/Button';
import {
  Building2,
  ShieldCheck,
  ShieldAlert,
  Check,
  X,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = () => {
    setIsLoading(true);
    adminService
      .getProviders()
      .then((res) => setProviders(res || []))
      .catch((err) => console.error('Failed to load providers:', err))
      .finally(() => setIsLoading(false));
  };

  const handleVerify = async (providerId: string, isVerified: boolean) => {
    const isConfirmed = await confirmDialog({
      title: isVerified ? 'Approve Dealership / Provider?' : 'Revoke Dealership Verification?',
      text: isVerified
        ? 'This will award the Verified Partner Badge and permit live commercial vehicle ingestion.'
        : 'This will remove the Verified Partner Badge.',
      confirmButtonText: isVerified ? 'Yes, Verify Partner' : 'Yes, Revoke',
      cancelButtonText: 'Cancel',
      icon: isVerified ? 'question' : 'warning',
      isDestructive: !isVerified,
    });
    if (!isConfirmed) return;

    try {
      await adminService.verifyProvider(providerId, isVerified);
      setProviders(
        providers.map((p) => (p._id === providerId ? { ...p, isVerified } : p))
      );
      showToast(
        isVerified ? 'Dealership verified successfully' : 'Verification revoked',
        'success'
      );
    } catch {
      showToast('Failed to update provider status', 'error');
    }
  };

  const filteredProviders = providers.filter((p) => {
    if (filter === 'verified' && !p.isVerified) return false;
    if (filter === 'unverified' && p.isVerified) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchCompany = p.companyName?.toLowerCase().includes(q);
      const matchName = p.userId?.name?.toLowerCase().includes(q);
      const matchEmail = p.userId?.email?.toLowerCase().includes(q);
      const matchCity = p.city?.toLowerCase().includes(q);
      return matchCompany || matchName || matchEmail || matchCity;
    }
    return true;
  });

  const verifiedCount = providers.filter((p) => p.isVerified).length;
  const unverifiedCount = providers.filter((p) => !p.isVerified).length;

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white">Dealership & Provider Approvals</h1>
            <span className="h-6 px-2.5 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center shadow-sm">
              {providers.length} Dealerships
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Review commercial fleet providers, business licenses, KYC submissions, and partner badges.
          </p>
        </div>
      </div>

      {/* STATS TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-zinc-400">Total Dealerships</p>
          <p className="text-xl font-black text-white mt-1">{providers.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-emerald-400">Verified Partners</p>
          <p className="text-xl font-black text-emerald-400 mt-1">{verifiedCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-amber-400">Pending KYC Review</p>
          <p className="text-xl font-black text-amber-400 mt-1">{unverifiedCount}</p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-zinc-900/80 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by company name, owner, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500 placeholder:text-zinc-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Dealerships</option>
            <option value="verified">Verified Partners</option>
            <option value="unverified">Pending Review</option>
          </select>
        </div>
      </div>

      {/* PROVIDERS LIST */}
      <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-zinc-400">
            <div className="h-8 w-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading dealership records...
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Building2 className="w-8 h-8 text-zinc-400 mx-auto" />
            <p className="text-xs font-bold text-zinc-400">No commercial providers matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/70 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                  <th className="py-3.5 px-4 sm:px-6">Dealership / Company</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Verification Status</th>
                  <th className="py-3.5 px-4 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs font-medium">
                {filteredProviders.map((p) => (
                  <tr key={p._id} className="hover:bg-zinc-800/40 transition-colors">
                    {/* Company */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400 text-xs shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{p.companyName || 'Dealership'}</p>
                          <p className="text-[11px] text-zinc-400 truncate">{p.userId?.name || 'Owner'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4">
                      <p className="text-zinc-200">{p.userId?.email}</p>
                      <p className="text-[11px] text-zinc-400">{p.phone || p.userId?.phone || 'No Phone'}</p>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 text-zinc-300">
                      {p.city ? `${p.city}, ${p.country || 'USA'}` : 'Global Online'}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          p.isVerified
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {p.isVerified ? (
                          <>
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified Partner</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3 h-3" />
                            <span>Pending Review</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      {p.isVerified ? (
                        <Button
                          onClick={() => handleVerify(p._id, false)}
                          variant="outline"
                          className="bg-zinc-800 hover:bg-zinc-700 text-rose-400 border-zinc-700 rounded-xl text-xs font-bold"
                        >
                          Revoke Verification
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleVerify(p._id, true)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md"
                        >
                          Approve Partner
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
