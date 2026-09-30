import React from 'react';
import { Car } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { POPULAR_BRANDS, BODY_TYPES } from '@/lib/constants';

const FUEL_TYPES = [
  { value: 'Petrol', label: 'পেট্রোল (Petrol)' },
  { value: 'Diesel', label: 'ডিজেল (Diesel)' },
  { value: 'Hybrid', label: 'হাইব্রিড (Hybrid)' },
  { value: 'Electric', label: 'ইলেকট্রিক (Electric)' },
  { value: 'CNG', label: 'সিএনজি (CNG)' },
];
const TRANSMISSIONS = [
  { value: 'Automatic', label: 'অটোমেটিক (Automatic)' },
  { value: 'Manual', label: 'ম্যানুয়াল (Manual)' },
  { value: 'Dual-Clutch', label: 'ডুয়েল-ক্লাচ (Dual-Clutch)' },
];
const CONDITIONS = [
  { value: 'used', label: 'ব্যবহৃত / রিকন্ডিশনড' },
  { value: 'new', label: 'একদম নতুন (০ কিমি)' },
  { value: 'certified', label: 'সার্টিফাইড প্রি-ওনড' },
];

interface VehicleOverviewSectionProps {
  listingType: 'sale' | 'rent';
  title: string;
  setTitle: (val: string) => void;
  brand: string;
  setBrand: (val: string) => void;
  year: number | '';
  setYear: (val: number | '') => void;
  condition: 'new' | 'used' | 'certified' | '';
  setCondition: (val: 'new' | 'used' | 'certified' | '') => void;
  mileage: number | '';
  setMileage: (val: number | '') => void;
  fuelType: string;
  setFuelType: (val: string) => void;
  transmission: string;
  setTransmission: (val: string) => void;
  engineCapacity: string;
  setEngineCapacity: (val: string) => void;
  bodyType: string;
  setBodyType: (val: string) => void;
  fieldErrors: Record<string, string>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  // Optional backwards compatibility props
  model?: string;
  setModel?: (val: string) => void;
  color?: string;
  setColor?: (val: string) => void;
  passengers?: number;
  setPassengers?: (val: number) => void;
  registrationYear?: number | '';
  setRegistrationYear?: (val: number | '') => void;
  vin?: string;
  setVin?: (val: string) => void;
  location?: string;
  setLocation?: (val: string) => void;
}

export function VehicleOverviewSection({
  title,
  setTitle,
  brand,
  setBrand,
  year,
  setYear,
  condition,
  setCondition,
  mileage,
  setMileage,
  fuelType,
  setFuelType,
  transmission,
  setTransmission,
  engineCapacity,
  setEngineCapacity,
  bodyType,
  setBodyType,
  fieldErrors,
  setFieldErrors,
}: VehicleOverviewSectionProps) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-black" />
          <div>
            <h2 className="text-base font-black text-black">গাড়ির সংক্ষিপ্ত বিবরণ</h2>
            <p className="text-xs text-zinc-400">
              গাড়ির প্রাথমিক তথ্য এবং কারিগরি স্পেসিফিকেশন।
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-zinc-600 bg-zinc-100 px-3 py-1 rounded-full">
          * চিহ্নিত ঘরগুলো আবশ্যক
        </span>
      </div>

      <div className="space-y-5">
        {/* Title (Full Width) */}
        <Input
          label="গাড়ির শিরোনাম *"
          placeholder="গাড়ির শিরোনাম লিখুন (যেমন: 2024 Toyota Land Cruiser Prado TX-L)"
          maxLength={100}
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value.slice(0, 100));
            setFieldErrors((p) => ({ ...p, title: '' }));
          }}
          error={fieldErrors['title']}
        />

        {/* 2-Column Grid: Balanced Specifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Row 1: Brand & Year */}
          <Select
            label="ব্র্যান্ড / নির্মাতা *"
            placeholder="একটি নির্বাচন করুন"
            value={brand}
            onChange={(val) => {
              setBrand(val);
              setFieldErrors((p) => ({ ...p, brand: '' }));
            }}
            options={POPULAR_BRANDS}
            error={fieldErrors['brand']}
          />

          <Input
            label="উৎপাদন সাল *"
            type="text"
            inputMode="numeric"
            placeholder="৪ সংখ্যার সাল লিখুন (যেমন: 2024)"
            maxLength={4}
            required
            value={year === '' ? '' : year}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 4);
              setYear(val === '' ? ('' as any) : Number(val));
              setFieldErrors((p) => ({ ...p, year: '' }));
            }}
            error={fieldErrors['year']}
          />

          {/* Row 2: Condition & Mileage */}
          <Select
            label="কন্ডিশন *"
            placeholder="একটি নির্বাচন করুন"
            value={condition}
            onChange={(val) => {
              const newCond = val as 'new' | 'used' | 'certified' | '';
              setCondition(newCond);
              if (newCond === 'new') setMileage(0);
              setFieldErrors((p) => ({ ...p, condition: '' }));
            }}
            options={CONDITIONS}
            error={fieldErrors['condition']}
          />

          <Input
            label={`মাইলেজ (কিমি) ${condition !== 'new' ? '*' : '(নতুন = ০)'}`}
            type="text"
            inputMode="numeric"
            maxLength={7}
            disabled={condition === 'new'}
            required={condition !== 'new'}
            value={condition === 'new' ? 0 : mileage === '' ? '' : mileage}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 7);
              setMileage(val === '' ? '' : Number(val));
              setFieldErrors((p) => ({ ...p, mileage: '' }));
            }}
            placeholder="মাইলেজ কিমি-তে লিখুন (যেমন: 45000)"
            error={fieldErrors['mileage']}
          />

          {/* Row 3: Fuel Type & Transmission */}
          <Select
            label="জ্বালানির ধরন *"
            placeholder="একটি নির্বাচন করুন"
            value={fuelType}
            onChange={(val) => {
              setFuelType(val);
              setFieldErrors((p) => ({ ...p, fuelType: '' }));
            }}
            options={FUEL_TYPES}
            error={fieldErrors['fuelType']}
          />

          <Select
            label="ট্রান্সমিশন *"
            placeholder="একটি নির্বাচন করুন"
            value={transmission}
            onChange={(val) => {
              setTransmission(val);
              setFieldErrors((p) => ({ ...p, transmission: '' }));
            }}
            options={TRANSMISSIONS}
            error={fieldErrors['transmission']}
          />

          {/* Row 4: Body Type & Engine Capacity */}
          <Select
            label="বডি টাইপ *"
            placeholder="একটি নির্বাচন করুন"
            value={bodyType}
            onChange={(val) => {
              setBodyType(val);
              setFieldErrors((p) => ({ ...p, bodyType: '' }));
            }}
            options={BODY_TYPES}
            error={fieldErrors['bodyType']}
          />

          <Input
            label="ইঞ্জিন ক্ষমতা"
            placeholder="ইঞ্জিন ক্ষমতা লিখুন (যেমন: 1500cc বা 2.0L Turbo)"
            maxLength={30}
            value={engineCapacity}
            onChange={(e) => setEngineCapacity(e.target.value.slice(0, 30))}
          />
        </div>
      </div>
    </div>
  );
}
