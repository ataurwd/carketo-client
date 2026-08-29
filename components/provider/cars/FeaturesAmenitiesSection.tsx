import React, { useState } from 'react';
import { Sparkles, Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const PRESET_AMENITIES = [
  'Bluetooth Connectivity',
  'Apple CarPlay',
  'Android Auto',
  'Cruise Control',
  'Air Conditioning',
  'Leather Upholstery',
  'GPS Navigation',
  'Premium Sound System',
  'Backup Camera',
  'Sunroof / Moonroof',
  'Heated Seats',
  'Keyless Entry & Push Start',
  'Blind Spot Monitor',
  'Lane Departure Warning',
  'Parking Sensors',
  'Wireless Phone Charger',
  'All-Wheel Drive (AWD)',
  'Alloy Wheels',
];

interface FeaturesAmenitiesSectionProps {
  selectedAmenities: string[];
  setSelectedAmenities: React.Dispatch<React.SetStateAction<string[]>>;
}

export function FeaturesAmenitiesSection({
  selectedAmenities,
  setSelectedAmenities,
}: FeaturesAmenitiesSectionProps) {
  const [customAmenityInput, setCustomAmenityInput] = useState('');

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleAddCustomAmenity = () => {
    const trimmed = customAmenityInput.trim();
    if (!trimmed) return;
    if (!selectedAmenities.includes(trimmed)) {
      setSelectedAmenities((prev) => [...prev, trimmed]);
    }
    setCustomAmenityInput('');
  };

  const handleRemoveAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => prev.filter((a) => a !== amenity));
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-black" />
          <div>
            <h2 className="text-base font-black text-black">Features & Amenities Options</h2>
            <p className="text-xs text-zinc-400">
              Select standard options and add custom equipment to display on the vehicle page.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
          {selectedAmenities.length} Selected
        </span>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-3">
          Standard Equipment & Packages (Click to toggle)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {PRESET_AMENITIES.map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                  isChecked
                    ? 'bg-black text-white border-black shadow-sm'
                    : 'bg-zinc-50/70 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-md flex items-center justify-center border transition-colors ${
                    isChecked ? 'bg-white border-white text-black' : 'border-zinc-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="truncate">{amenity}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Feature Input */}
      <div className="space-y-2 pt-2 border-t border-zinc-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">
          Add Custom Feature / Aftermarket Option
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="e.g. Carbon Ceramic Brakes, Custom Exhaust, Panoramic Sunroof, Sport Suspension..."
            value={customAmenityInput}
            onChange={(e) => setCustomAmenityInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomAmenity();
              }
            }}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-semibold focus:outline-none focus:border-black"
          />
          <Button
            type="button"
            variant="dark"
            size="sm"
            onClick={handleAddCustomAmenity}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Feature
          </Button>
        </div>
      </div>

      {/* Selected Custom Features Chips */}
      {selectedAmenities.filter((a) => !PRESET_AMENITIES.includes(a)).length > 0 && (
        <div className="space-y-2 pt-2">
          <label className="block text-[11px] font-bold text-zinc-400 uppercase">
            Custom Added Features:
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {selectedAmenities
              .filter((a) => !PRESET_AMENITIES.includes(a))
              .map((customA) => (
                <span
                  key={customA}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-bold"
                >
                  <span>{customA}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(customA)}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
