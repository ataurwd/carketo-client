'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { carService } from '@/services/car.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { POPULAR_BRANDS, BODY_TYPES } from '@/lib/constants';
import {
  ArrowLeft,
  Car,
  DollarSign,
  Gauge,
  Image as ImageIcon,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';

export default function CreateCarPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Porsche');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2024);
  const [listingType, setListingType] = useState<'rent' | 'sale' | 'both'>('rent');
  const [rentalPrice, setRentalPrice] = useState(299);
  const [rentalDeposit, setRentalDeposit] = useState(1000);
  const [salePrice, setSalePrice] = useState(85000);
  const [location, setLocation] = useState('New York, JFK Airport Hub');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [imageUrls, setImageUrls] = useState('');

  // Specs
  const [passengers, setPassengers] = useState(4);
  const [doors, setDoors] = useState(4);
  const [transmission, setTransmission] = useState('Automatic');
  const [fuelType, setFuelType] = useState('Petrol');
  const [bodyType, setBodyType] = useState('Coupe');
  const [mileage, setMileage] = useState(3500);
  const [luggage, setLuggage] = useState(2);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const additionalImages = imageUrls
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const payload = {
      title,
      brand,
      model,
      year: Number(year),
      listingType,
      rentalPrice: listingType !== 'sale' ? Number(rentalPrice) : undefined,
      rentalDeposit: listingType !== 'sale' ? Number(rentalDeposit) : undefined,
      salePrice: listingType !== 'rent' ? Number(salePrice) : undefined,
      location,
      description: description || `${year} ${brand} ${model} in pristine condition. Certified luxury vehicle.`,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      images: additionalImages.length > 0 ? additionalImages : [coverImage || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'],
      features: ['Leather Upholstery', 'GPS Navigation', 'Premium Sound System', 'Backup Camera'],
      amenities: ['Bluetooth', 'Apple CarPlay', 'Cruise Control', 'Air Conditioning'],
      specs: {
        passengers: Number(passengers),
        doors: Number(doors),
        transmission,
        fuelType,
        bodyType,
        mileage: Number(mileage),
        luggage: Number(luggage),
        airCondition: true,
      },
    };

    try {
      await carService.createCar(payload);
      setSuccess('Vehicle listing published successfully!');
      setTimeout(() => {
        router.push('/provider/cars');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to publish vehicle listing.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/provider"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Provider Hub</span>
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black">List a New Vehicle</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Add a car to your rental fleet or dealership inventory for instant booking.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Car className="w-5 h-5 text-black" />
              <h2 className="text-base font-black text-black">Vehicle Overview</h2>
            </div>

            <div className="space-y-4">
              <Input
                label="Listing Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 2024 Porsche 911 Carrera 4S Coupe"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Make / Brand
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                  >
                    {POPULAR_BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Model"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. 911 Carrera 4S"
                />

                <Input
                  label="Manufacturing Year"
                  type="number"
                  required
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Body Type
                  </label>
                  <select
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                  >
                    {BODY_TYPES.map((bt) => (
                      <option key={bt} value={bt}>
                        {bt}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Pickup & Handover Location"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Miami, South Beach Hub"
                  leftIcon={<MapPin className="w-4 h-4" />}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Highlight key specs, handling, interior luxury, and rental guidelines..."
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Model */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <DollarSign className="w-5 h-5 text-black" />
              <h2 className="text-base font-black text-black">Listing Type & Pricing</h2>
            </div>

            <div className="grid grid-cols-3 gap-2 p-1.5 bg-zinc-100 rounded-2xl border border-zinc-200">
              {(['rent', 'sale', 'both'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setListingType(t)}
                  className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                    listingType === t
                      ? 'bg-black text-white shadow-sm'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  For {t}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {listingType !== 'sale' && (
                <>
                  <Input
                    label="Daily Rental Rate ($)"
                    type="number"
                    required
                    value={rentalPrice}
                    onChange={(e) => setRentalPrice(Number(e.target.value))}
                  />
                  <Input
                    label="Security Deposit ($)"
                    type="number"
                    required
                    value={rentalDeposit}
                    onChange={(e) => setRentalDeposit(Number(e.target.value))}
                  />
                </>
              )}

              {listingType !== 'rent' && (
                <Input
                  label="Outright Sale Price ($)"
                  type="number"
                  required
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                />
              )}
            </div>
          </div>

          {/* Section 3: Specifications */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Gauge className="w-5 h-5 text-black" />
              <h2 className="text-base font-black text-black">Technical Specifications</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label="Passengers"
                type="number"
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
              />
              <Input
                label="Doors"
                type="number"
                value={doors}
                onChange={(e) => setDoors(Number(e.target.value))}
              />
              <Input
                label="Luggage (Bags)"
                type="number"
                value={luggage}
                onChange={(e) => setLuggage(Number(e.target.value))}
              />
              <Input
                label="Mileage (Miles)"
                type="number"
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Transmission
                </label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Dual-Clutch">Dual-Clutch</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Fuel Type
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Imagery */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <ImageIcon className="w-5 h-5 text-black" />
              <h2 className="text-base font-black text-black">Vehicle Imagery</h2>
            </div>

            <Input
              label="Primary Cover Image (URL)"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              helperText="High-resolution landscape photo of exterior."
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                Additional Gallery URLs (One per line)
              </label>
              <textarea
                rows={3}
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                placeholder="https://...&#10;https://..."
                className="w-full text-xs font-semibold p-3 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black font-mono"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4">
            <Link href="/provider">
              <Button variant="outline" size="lg">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="dark"
              size="lg"
              isLoading={isLoading}
              className="px-8 font-bold shadow-md hover:bg-black"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Publish Vehicle Listing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
