import React from 'react';
import { Car } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { POPULAR_BRANDS, BODY_TYPES } from '@/lib/constants';

const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'Dual-Clutch'];
const CONDITIONS = [
  { value: 'used', label: 'Used / Pre-Owned' },
  { value: 'new', label: 'Brand New (0 km)' },
  { value: 'certified', label: 'Certified Pre-Owned' },
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
            <h2 className="text-base font-black text-black">Vehicle Overview</h2>
            <p className="text-xs text-zinc-400">
              Basic vehicle information and technical specifications.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-zinc-600 bg-zinc-100 px-3 py-1 rounded-full">
          * Required Fields
        </span>
      </div>

      <div className="space-y-5">
        {/* Title (Full Width) */}
        <Input
          label="Vehicle Title *"
          placeholder="Enter vehicle title (e.g. 2024 Toyota Land Cruiser Prado TX-L)"
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
            label="Brand / Make *"
            placeholder="Select one"
            value={brand}
            onChange={(val) => {
              setBrand(val);
              setFieldErrors((p) => ({ ...p, brand: '' }));
            }}
            options={POPULAR_BRANDS}
            error={fieldErrors['brand']}
          />

          <Input
            label="Manufacturing Year *"
            type="text"
            inputMode="numeric"
            placeholder="Enter 4-digit year (e.g. 2024)"
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
            label="Condition *"
            placeholder="Select one"
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
            label={`Mileage (km) ${condition !== 'new' ? '*' : '(Brand New = 0)'}`}
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
            placeholder="Enter mileage in km (e.g. 45000)"
            error={fieldErrors['mileage']}
          />

          {/* Row 3: Fuel Type & Transmission */}
          <Select
            label="Fuel Type *"
            placeholder="Select one"
            value={fuelType}
            onChange={(val) => {
              setFuelType(val);
              setFieldErrors((p) => ({ ...p, fuelType: '' }));
            }}
            options={FUEL_TYPES}
            error={fieldErrors['fuelType']}
          />

          <Select
            label="Transmission *"
            placeholder="Select one"
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
            label="Body Type *"
            placeholder="Select one"
            value={bodyType}
            onChange={(val) => {
              setBodyType(val);
              setFieldErrors((p) => ({ ...p, bodyType: '' }));
            }}
            options={BODY_TYPES}
            error={fieldErrors['bodyType']}
          />

          <Input
            label="Engine Capacity"
            placeholder="Enter engine capacity (e.g. 1500cc or 2.0L Turbo)"
            maxLength={30}
            value={engineCapacity}
            onChange={(e) => setEngineCapacity(e.target.value.slice(0, 30))}
          />
        </div>
      </div>
    </div>
  );
}
