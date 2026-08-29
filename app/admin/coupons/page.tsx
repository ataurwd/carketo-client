'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Ticket, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(15);
  const [usageLimit, setUsageLimit] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    adminService.getCoupons().then((res) => setCoupons(res));
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg(null);

    const payload = {
      code,
      discountType,
      discountValue: Number(discountValue),
      usageLimit: Number(usageLimit),
      endDate: new Date(Date.now() + 86400000 * 60).toISOString(),
    };

    try {
      const created = await adminService.createCoupon(payload);
      setCoupons([created, ...coupons]);
      setMsg({ type: 'success', text: `Coupon ${code} created successfully.` });
      setCode('');
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Failed to create coupon.' });
    } finally {
      setIsLoading(false);
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
          <h1 className="text-2xl sm:text-3xl font-black text-black">Promotional Coupons & Discounts</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Create promotional discount codes for marketing campaigns and fleet promotions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Coupon Form */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-black text-black">Generate Discount Voucher</h2>
              <p className="text-xs text-zinc-500">New coupon will be active immediately.</p>
            </div>

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

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <Input
                label="Coupon Code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. VIP2026"
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Discount Type
                </label>
                <select
                  value={discountType}
                  onChange={(e: any) => setDiscountType(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                >
                  <option value="percentage">Percentage Discount (%)</option>
                  <option value="fixed">Fixed Taka Amount (৳)</option>
                </select>
              </div>

              <Input
                label={discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (৳)'}
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
              />

              <Input
                label="Usage Limit (Total Redemptions)"
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
              />

              <Button
                type="submit"
                variant="dark"
                size="md"
                isLoading={isLoading}
                className="w-full font-bold shadow-md hover:bg-black"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Create Promotional Coupon
              </Button>
            </form>
          </div>

          {/* Active Coupons List */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-base font-black text-black">Active Platform Coupons</h3>
              <span className="text-xs font-bold text-zinc-400">{coupons.length} Active Vouchers</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200">
                  <tr>
                    <th className="py-4 px-6">Coupon Code</th>
                    <th className="py-4 px-6">Discount Value</th>
                    <th className="py-4 px-6">Usage Progress</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-semibold text-zinc-800">
                  {coupons.map((c) => (
                    <tr key={c._id || c.code} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-zinc-100 text-black border border-zinc-200">
                          {c.code}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-bold text-black">
                        {c.discountType === 'percentage'
                          ? `${c.discountValue}% OFF`
                          : `$${c.discountValue} OFF`}
                      </td>

                      <td className="py-4 px-6 text-zinc-600">
                        {c.usageCount || 0} / {c.usageLimit || '∞'} used
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
