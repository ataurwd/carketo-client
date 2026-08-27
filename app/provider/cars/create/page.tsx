'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { carService } from '@/services/car.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { POPULAR_BRANDS, BODY_TYPES } from '@/lib/constants';
import { useAuthStore } from '@/store/auth.store';
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
  Phone,
  UploadCloud,
  X,
  FileImage,
  Lock,
} from 'lucide-react';

interface UploadedPhoto {
  name: string;
  size: number;
  dataUrl: string;
}

export default function CreateCarPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user && !token) {
      router.push('/login?redirect=/provider/cars/create');
    }
  }, [mounted, user, token, router]);

  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Porsche');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2024);
  const [listingType, setListingType] = useState<'rent' | 'sale'>('rent');
  const [contactPhone, setContactPhone] = useState('');
  const [rentalPrice, setRentalPrice] = useState<number | ''>(299);
  const [rentalDeposit, setRentalDeposit] = useState<number | ''>(1000);
  const [salePrice, setSalePrice] = useState<number | ''>(85000);
  const [location, setLocation] = useState('New York, JFK Airport Hub');
  const [description, setDescription] = useState('');

  // 3-Image Upload State (Max 3, Max 5MB each)
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);

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

  // File Upload Handler (Max 3 files, Max 5MB each)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxAllowed = 3;
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (uploadedPhotos.length + files.length > maxAllowed) {
      setError(`You can upload a maximum of ${maxAllowed} images at a time for each vehicle listing.`);
      return;
    }

    const newPhotos: UploadedPhoto[] = [];
    const filesArray = Array.from(files);

    for (const file of filesArray) {
      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds the 5MB maximum size limit (${(file.size / (1024 * 1024)).toFixed(2)} MB). Please select photos under 5MB.`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError(`File "${file.name}" is not a valid image file. Please upload JPEG, PNG, or WebP.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhotos((prev) => {
            if (prev.length >= maxAllowed) return prev;
            return [
              ...prev,
              {
                name: file.name,
                size: file.size,
                dataUrl: event.target!.result as string,
              },
            ];
          });
        }
      };
      reader.readAsDataURL(file);
    }

    setError('');
    // Clear input value so same files can be re-selected if removed
    e.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (uploadedPhotos.length === 0) {
      setError('Please upload at least 1 image for the vehicle listing.');
      setIsLoading(false);
      return;
    }

    const images = uploadedPhotos.map((p) => p.dataUrl);
    const coverImage = images[0];

    const payload = {
      title,
      brand,
      model,
      year: Number(year),
      listingType,
      contactPhone: contactPhone || '01712-345678',
      rentalPrice: listingType === 'rent' ? Number(rentalPrice) : undefined,
      rentalDeposit: listingType === 'rent' ? Number(rentalDeposit) : undefined,
      salePrice: listingType === 'sale' ? Number(salePrice) : undefined,
      location,
      bodyType,
      fuelType,
      transmission,
      seats: Number(passengers),
      doors: Number(doors),
      luggage: Number(luggage),
      mileage: Number(mileage),
      description: description || `${year} ${brand} ${model} in pristine condition. Certified luxury vehicle.`,
      coverImage,
      images,
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
      setSuccess('Vehicle listing published successfully with uploaded photos!');
      setTimeout(() => {
        router.push('/provider/cars');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to publish vehicle listing.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || (!user && !token)) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-4 bg-zinc-50">
        <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-zinc-500">Authenticating...</p>
      </div>
    );
  }

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
            Add a car to your rental fleet or dealership inventory. Upload up to 3 photos (max 5MB each).
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

            <div className="grid grid-cols-2 gap-2 p-1.5 bg-zinc-100 rounded-2xl border border-zinc-200">
              {(['rent', 'sale'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setListingType(t)}
                  className={`py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    listingType === t
                      ? 'bg-black text-white shadow-sm'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  For {t}
                </button>
              ))}
            </div>

            {listingType === 'rent' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Daily Rental Rate ($ / Day)"
                  type="number"
                  required
                  value={rentalPrice}
                  onChange={(e) => setRentalPrice(Number(e.target.value))}
                  placeholder="e.g. 299"
                />
                <Input
                  label="Security Deposit ($)"
                  type="number"
                  required
                  value={rentalDeposit}
                  onChange={(e) => setRentalDeposit(Number(e.target.value))}
                  placeholder="e.g. 1000"
                />
              </div>
            ) : (
              <div>
                <Input
                  label="Total Outright Sale Price ($)"
                  type="number"
                  required
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  placeholder="e.g. 85000"
                />
              </div>
            )}

            {/* Direct Contact Phone Number for BOTH Rent and Sale */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-black">
                  Direct Contact Phone Number
                </label>
                <span className="text-[11px] text-zinc-500 font-semibold">
                  e.g. 01712-345678
                </span>
              </div>
              <Input
                placeholder="01712345678"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4 text-black" />}
              />
              <p className="text-[11px] text-zinc-500">
                {listingType === 'rent'
                  ? 'Renters will see this phone number as masked (017 ••••••••) on the listing card. Logged-in users can click to reveal and copy your number to contact you directly.'
                  : 'Buyers will see this phone number on the vehicle page to call or message you directly to negotiate and inspect the car.'}
              </p>
            </div>
          </div>

          {/* Section 3: Technical Specifications (ONLY FOR CARS FOR SALE) */}
          {listingType === 'sale' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <Gauge className="w-5 h-5 text-black" />
                <div>
                  <h2 className="text-base font-black text-black">Technical Specifications</h2>
                  <p className="text-xs text-zinc-400">Detailed technical specs for prospective buyers</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Input
                  label="Passengers / Seats"
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
          )}

          {/* Section 4: Vehicle Imagery (Up to 3 Photos, Max 5MB Each) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-black" />
                <h2 className="text-base font-black text-black">Vehicle Photos (Max 3 Images)</h2>
              </div>
              <span className="text-xs font-bold text-zinc-500">
                {uploadedPhotos.length}/3 Uploaded
              </span>
            </div>

            {/* Dropzone Area */}
            {uploadedPhotos.length < 3 && (
              <label className="relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl border-2 border-dashed border-zinc-300 hover:border-black bg-zinc-50/50 hover:bg-zinc-50 transition-all cursor-pointer text-center group">
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="h-12 w-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 group-hover:scale-110 transition-transform shadow-sm mb-3">
                  <UploadCloud className="w-6 h-6 text-black" />
                </div>
                <p className="text-xs font-extrabold text-black">
                  Click to select or drag & drop car photos
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Upload up to {3 - uploadedPhotos.length} more images • Max file size: <strong>5MB</strong> each (JPEG, PNG, WebP)
                </p>
              </label>
            )}

            {/* Image Previews Grid */}
            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {uploadedPhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-2xl border border-zinc-200 bg-zinc-50 p-2 overflow-hidden shadow-sm space-y-2"
                  >
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-200 border border-zinc-100">
                      <img
                        src={photo.dataUrl}
                        alt={photo.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white backdrop-blur transition-colors"
                        title="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {idx === 0 && (
                        <div className="absolute bottom-2 left-2">
                          <span className="px-2 py-0.5 rounded-full bg-black text-white text-[9px] font-black uppercase tracking-wider">
                            Cover Image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="px-1 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-zinc-700 truncate max-w-[120px]">
                        {photo.name}
                      </span>
                      <span className="font-bold text-zinc-400">
                        {(photo.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action */}
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
