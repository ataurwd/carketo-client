import React from 'react';
import { Car, MapPin, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { POPULAR_BRANDS, BODY_TYPES } from '@/lib/constants';

const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'Dual-Clutch'];
const CONDITIONS = [
  { value: 'used', label: 'Used / Pre-Owned' },
  { value: 'new', label: 'Brand New (0 km)' },
  { value: 'certified', label: 'Certified Pre-Owned' },
] as const;

const POPULAR_COLORS = [
  'Obsidian Black',
  'Pearl White',
  'Metallic Silver',
  'Dark Grey / Charcoal',
  'Midnight Blue',
  'Racing Red',
  'Emerald Green',
  'Champagne Gold',
];

interface VehicleOverviewSectionProps {
  listingType: 'sale' | 'rent';
  title: string;
  setTitle: (val: string) => void;
  brand: string;
  setBrand: (val: string) => void;
  model: string;
  setModel: (val: string) => void;
  year: number;
  setYear: (val: number) => void;
  condition: 'new' | 'used' | 'certified';
  setCondition: (val: 'new' | 'used' | 'certified') => void;
  mileage: number | '';
  setMileage: (val: number | '') => void;
  fuelType: string;
  setFuelType: (val: string) => void;
  transmission: string;
  setTransmission: (val: string) => void;
  engineCapacity: string;
  setEngineCapacity: (val: string) => void;
  color: string;
  setColor: (val: string) => void;
  passengers: number;
  setPassengers: (val: number) => void;
  registrationYear: number | '';
  setRegistrationYear: (val: number | '') => void;
  vin: string;
  setVin: (val: string) => void;
  bodyType: string;
  setBodyType: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  fieldErrors: Record<string, string>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function VehicleOverviewSection({
  listingType,
  title,
  setTitle,
  brand,
  setBrand,
  model,
  setModel,
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
  color,
  setColor,
  passengers,
  setPassengers,
  registrationYear,
  setRegistrationYear,
  vin,
  setVin,
  bodyType,
  setBodyType,
  location,
  setLocation,
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
              {listingType === 'rent'
                ? 'Essential rental vehicle details and pickup location.'
                : 'Comprehensive technical details, condition, and ownership specs.'}
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-zinc-600 bg-zinc-100 px-3 py-1 rounded-full">
          * Required Fields
        </span>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <Input
          label="Vehicle Title *"
          placeholder={
            listingType === 'rent'
              ? 'e.g. 2024 Toyota Land Cruiser Prado TX-L / Porsche Cayenne'
              : 'e.g. 2024 Toyota Land Cruiser Prado TX-L'
          }
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setFieldErrors((p) => ({ ...p, title: '' }));
          }}
          error={fieldErrors['title']}
        />

        {/* RENT LISTING: ONLY PICKUP LOCATION */}
        {listingType === 'rent' ? (
          <div>
            <Input
              label="Pickup Location / Hub Address *"
              placeholder="e.g. Dhaka, Gulshan-2 / New York JFK Airport Hub"
              required
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setFieldErrors((p) => ({ ...p, location: '' }));
              }}
              leftIcon={<MapPin className="w-4 h-4 text-black" />}
              error={fieldErrors['location']}
            />
            <p className="text-[11px] text-zinc-400 mt-1.5 font-medium">
              Renters will see this address for pickup and drop-off coordination.
            </p>
          </div>
        ) : (
          /* SALE LISTINGS: COMPREHENSIVE SPECIFICATIONS */
          <div className="space-y-4 pt-1 animate-fade-in">
            {/* Brand, Model, Manufacturing Year */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Brand / Make *
                </label>
                <select
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setFieldErrors((p) => ({ ...p, brand: '' }));
                  }}
                  className={`w-full text-xs font-semibold px-3 py-2.5 rounded-xl border ${
                    fieldErrors['brand'] ? 'border-rose-500' : 'border-zinc-200'
                  } bg-white focus:outline-none focus:border-black`}
                >
                  {POPULAR_BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {fieldErrors['brand'] && (
                  <p className="text-[11px] font-bold text-rose-600 mt-1">{fieldErrors['brand']}</p>
                )}
              </div>

              <Input
                label="Model *"
                placeholder="e.g. Prado TX-L, Premio, Civic"
                required
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                  setFieldErrors((p) => ({ ...p, model: '' }));
                }}
                error={fieldErrors['model']}
              />

              <Input
                label="Manufacturing Year *"
                type="number"
                min={1950}
                max={new Date().getFullYear() + 2}
                required
                value={year}
                onChange={(e) => {
                  setYear(Number(e.target.value));
                  setFieldErrors((p) => ({ ...p, year: '' }));
                }}
                error={fieldErrors['year']}
              />
            </div>

            {/* Condition, Mileage / Odometer, Fuel Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => {
                    const newCond = e.target.value as 'new' | 'used' | 'certified';
                    setCondition(newCond);
                    if (newCond === 'new') setMileage(0);
                  }}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label={`Mileage (km) ${condition !== 'new' ? '*' : '(Brand New = 0)'}`}
                type="number"
                min={0}
                disabled={condition === 'new'}
                required={condition !== 'new'}
                value={condition === 'new' ? 0 : mileage}
                onChange={(e) => setMileage(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 45000"
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Fuel Type *
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                >
                  {FUEL_TYPES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Transmission, Seats, Exterior Color */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Transmission *
                </label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                >
                  {TRANSMISSIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Number of Seats *"
                type="number"
                min={1}
                max={50}
                required
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Exterior Color *
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Pearl White, Obsidian Black"
                  required
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Color Quick Suggestion Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-zinc-400 mr-1">Color presets:</span>
              {POPULAR_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                    color === c
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Body Type & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Body Type *
                </label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                >
                  {BODY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Pickup Location / Dealership Address *"
                placeholder="e.g. Dhaka, Gulshan-2 / New York Hub"
                required
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setFieldErrors((p) => ({ ...p, location: '' }));
                }}
                leftIcon={<MapPin className="w-4 h-4 text-black" />}
                error={fieldErrors['location']}
              />
            </div>

            {/* Engine Capacity, Registration Year, VIN */}
            <div className="pt-4 border-t border-zinc-100 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-black uppercase tracking-wider text-zinc-800">
                  Sale Specifications & Ownership Data
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Engine Capacity *"
                  placeholder="e.g. 1500cc, 2.0L Turbo, 3.0L V6"
                  required
                  value={engineCapacity}
                  onChange={(e) => setEngineCapacity(e.target.value)}
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Registration Year
                  </label>
                  <input
                    type="number"
                    min={1950}
                    max={new Date().getFullYear() + 2}
                    value={registrationYear}
                    onChange={(e) =>
                      setRegistrationYear(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    placeholder="e.g. 2024"
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                  />
                  <p className="text-[10px] text-zinc-400">Can differ from manufacturing year</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                    VIN / Chassis Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={vin}
                    onChange={(e) => setVin(e.target.value.toUpperCase())}
                    placeholder="e.g. WVWZZZ1KZ9W123456"
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black uppercase tracking-wider"
                  />
                  <p className="text-[10px] text-zinc-400">Private & secure • Masked on public listing</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
