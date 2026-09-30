import React, { useState } from 'react';
import { Sparkles, Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const PRESET_AMENITIES = [
  'ব্লুটুথ কানেক্টিভিটি',
  'অ্যাপল কারপ্লে',
  'অ্যান্ড্রয়েড অটো',
  'ক্রুজ কন্ট্রোল',
  'এয়ার কন্ডিশনিং (এসি)',
  'লেদার সিট',
  'জিপিএস নেভিগেশন',
  'প্রিমিয়াম সাউন্ড সিস্টেম',
  'ব্যাকআপ ক্যামেরা',
  'সানরুফ / মুনরুফ',
  'হিটেড সিট',
  'কি-লেস এন্ট্রি ও পুশ স্টার্ট',
  'ব্লাইন্ড স্পট মনিটর',
  'লেন ডিপার্চার ওয়ার্নিং',
  'পার্কিং সেন্সর',
  'ওয়্যারলেস ফোন চার্জার',
  'অল-হুইল ড্রাইভ (AWD)',
  'অ্যালয় হুইলস',
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
            <h2 className="text-base font-black text-black">ফিচার ও সুবিধাসমূহ</h2>
            <p className="text-xs text-zinc-400">
              গাড়ির পেজে প্রদর্শনের জন্য স্ট্যান্ডার্ড অপশনগুলো নির্বাচন করুন এবং কাস্টম সরঞ্জাম যুক্ত করুন।
            </p>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
          {selectedAmenities.length} টি নির্বাচিত
        </span>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-3">
          স্ট্যান্ডার্ড সরঞ্জাম ও প্যাকেজ (সিলেক্ট করতে ক্লিক করুন)
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
          কাস্টম ফিচার / আফটারমার্কেট অপশন যুক্ত করুন
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="যেমন: কার্বন সিরামিক ব্রেক, কাস্টম এক্সহস্ট, প্যানোরামিক সানরুফ, স্পোর্ট সাসপেনশন..."
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
            ফিচার যুক্ত করুন
          </Button>
        </div>
      </div>

      {/* Selected Custom Features Chips */}
      {selectedAmenities.filter((a) => !PRESET_AMENITIES.includes(a)).length > 0 && (
        <div className="space-y-2 pt-2">
          <label className="block text-[11px] font-bold text-zinc-400 uppercase">
            যুক্ত করা কাস্টম ফিচারসমূহ:
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
