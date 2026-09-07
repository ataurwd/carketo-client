'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { showToast } from '@/lib/alert';
import { Button } from '@/components/ui/Button';
import {
  Ticket,
  Plus,
  Copy,
  CheckCircle2,
  Calendar,
  DollarSign,
  Percent,
  Sparkles,
  Users,
  ShieldCheck,
  X,
  Search,
} from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(15);
  const [usageLimit, setUsageLimit] = useState(100);
  const [daysValid, setDaysValid] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = () => {
    setIsFetching(true);
    adminService
      .getCoupons()
      .then((res) => setCoupons(res || []))
      .catch((err) => console.error('Failed to load coupons:', err))
      .finally(() => setIsFetching(false));
  };

  const generateCode = () => {
    const prefixes = ['LUXURY', 'VIP', 'DRIVE', 'SPRINT', 'RENT', 'SAVE', 'NOVA'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(10 + Math.random() * 90);
    setCode(`${prefix}${num}`);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      showToast('Please specify a coupon code', 'warning');
      return;
    }

    setIsLoading(true);
    const payload = {
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      usageLimit: Number(usageLimit),
      endDate: new Date(Date.now() + 86400000 * Number(daysValid)).toISOString(),
    };

    try {
      const created = await adminService.createCoupon(payload);
      setCoupons([created, ...coupons]);
      showToast(`Promotional code ${created.code} activated`, 'success');
      setCode('');
    } catch (err: any) {
      showToast(err.message || 'Failed to create coupon', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Code "${text}" copied to clipboard`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white">Promotional Coupons & Campaigns</h1>
            <span className="h-6 px-2.5 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center shadow-sm">
              {coupons.length} Active
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Issue discount promo vouchers for rental bookings and direct car purchases.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CREATE COUPON FORM (1 COL) */}
        <div className="bg-zinc-900/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-800 shadow-sm space-y-5 h-fit">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Create Promo Code</h2>
              <p className="text-[11px] text-zinc-400">Configure discount value and limits</p>
            </div>
          </div>

          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
            {/* Code */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-zinc-300">Coupon Voucher Code *</label>
                <button
                  type="button"
                  onClick={generateCode}
                  className="text-[10px] font-bold text-orange-400 hover:text-orange-300"
                >
                  Generate Random
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. SUMMER25"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono font-bold uppercase focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Discount Type & Value */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-semibold focus:outline-none focus:border-orange-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">
                  Value ({discountType === 'percentage' ? '%' : '$'})
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={discountType === 'percentage' ? 90 : 100000}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Usage Limit & Validity */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">Max Redemptions</label>
                <input
                  type="number"
                  min={1}
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">Valid For (Days)</label>
                <input
                  type="number"
                  min={1}
                  value={daysValid}
                  onChange={(e) => setDaysValid(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold py-2.5 shadow-lg shadow-orange-600/25"
            >
              {isLoading ? 'Activating Code...' : 'Activate Coupon Campaign'}
            </Button>
          </form>
        </div>

        {/* ACTIVE COUPONS LIST (2 COLS) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-base font-black text-white">Active Promotional Codes</h2>
            <span className="text-xs text-zinc-400 font-semibold">{coupons.length} vouchers</span>
          </div>

          {isFetching ? (
            <div className="p-12 text-center text-xs font-bold text-zinc-400 bg-zinc-900/60 rounded-3xl border border-zinc-800">
              Loading active promo campaigns...
            </div>
          ) : coupons.length === 0 ? (
            <div className="p-12 text-center space-y-3 bg-zinc-900/60 rounded-3xl border border-zinc-800">
              <Ticket className="w-8 h-8 text-zinc-400 mx-auto" />
              <p className="text-xs font-bold text-zinc-400">No active promotional coupons found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map((c) => {
                const isExpired = new Date(c.endDate) < new Date();
                return (
                  <div
                    key={c._id || c.code}
                    className="p-5 rounded-3xl bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-black text-white tracking-wider">
                            {c.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(c.code)}
                            className="p-1 text-zinc-400 hover:text-white"
                            title="Copy Code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs font-bold text-orange-400 mt-0.5">
                          {c.discountType === 'percentage'
                            ? `${c.discountValue}% OFF`
                            : `$${c.discountValue} FLAT DISCOUNT`}
                        </p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          isExpired
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isExpired ? 'Expired' : 'Active'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-zinc-800 text-zinc-400">
                      <div>
                        <span className="block text-[10px]">Usage Limit:</span>
                        <span className="font-bold text-zinc-200">{c.usedCount || 0} / {c.usageLimit || '∞'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px]">Valid Until:</span>
                        <span className="font-bold text-zinc-200">
                          {new Date(c.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
