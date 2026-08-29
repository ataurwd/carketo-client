import React from 'react';
import { DollarSign, Phone } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { DatePicker } from '@/components/ui/DatePicker';

interface PricingDurationSectionProps {
  listingType: 'sale' | 'rent';
  rentalPrice: number | '';
  setRentalPrice: (val: number | '') => void;
  salePrice: number | '';
  setSalePrice: (val: number | '') => void;
  contactPhone: string;
  setContactPhone: (val: string) => void;
  expiresAt: Date;
  setExpiresAt: (val: Date) => void;
  fieldErrors: Record<string, string>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function PricingDurationSection({
  listingType,
  rentalPrice,
  setRentalPrice,
  salePrice,
  setSalePrice,
  contactPhone,
  setContactPhone,
  expiresAt,
  setExpiresAt,
  fieldErrors,
  setFieldErrors,
}: PricingDurationSectionProps) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
        <DollarSign className="w-5 h-5 text-black" />
        <div>
          <h2 className="text-base font-black text-black">
            {listingType === 'sale' ? 'Sale Pricing & Direct Contact' : 'Rental Rates & Direct Contact'}
          </h2>
          <p className="text-xs text-zinc-400">
            Set customer pricing, phone number, and visibility duration (Max 2 Months).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {listingType === 'rent' ? (
          <Input
            label="Daily Rental Rate (৳ / Day)"
            type="number"
            required
            value={rentalPrice}
            onChange={(e) => {
              setRentalPrice(e.target.value === '' ? '' : Number(e.target.value));
              setFieldErrors((p) => ({ ...p, rentalPrice: '' }));
            }}
            placeholder="e.g. 5000"
            error={fieldErrors['rentalPrice']}
          />
        ) : (
          <Input
            label="Total Outright Sale Price (৳)"
            type="number"
            required
            value={salePrice}
            onChange={(e) => {
              setSalePrice(e.target.value === '' ? '' : Number(e.target.value));
              setFieldErrors((p) => ({ ...p, salePrice: '' }));
            }}
            placeholder="e.g. 3500000"
            error={fieldErrors['salePrice']}
          />
        )}

        {/* Direct Contact Phone Number */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-black">
            Direct Contact Phone Number *
          </label>
          <Input
            type="tel"
            placeholder="01712345678"
            required
            value={contactPhone}
            onChange={(e) => {
              const cleanVal = e.target.value.replace(/[^\d\s\-()+]/g, '');
              setContactPhone(cleanVal);
              setFieldErrors((p) => ({ ...p, contactPhone: '' }));
            }}
            leftIcon={<Phone className="w-4 h-4 text-black" />}
            error={fieldErrors['contactPhone']}
          />
        </div>
      </div>

      {/* Listing Visibility Duration / Expiry Date (Custom Modern DatePicker) */}
      <div className="space-y-1.5 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
        <DatePicker
          label="Listing Active Visibility Duration"
          value={expiresAt}
          onChange={(date) => setExpiresAt(date)}
          maxMonthsAhead={2}
          helperText="Select how long this vehicle remains publicly visible. After this date, the post automatically expires. Maximum limit: 2 months (60 days) from today."
        />
      </div>
    </div>
  );
}
