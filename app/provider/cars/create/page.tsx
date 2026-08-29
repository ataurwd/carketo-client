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
  Sparkles,
  Check,
  Loader2,
} from 'lucide-react';
import { uploadService } from '@/services/upload.service';

interface UploadedPhoto {
  file: File;
  name: string;
  size: number;
  previewUrl: string;
  r2Url?: string;
  r2Key?: string;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

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

export default function CreateCarPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isInitialized } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isInitialized) {
      if (!isAuthenticated && !user && !token) {
        router.push('/login?redirect=/provider/cars/create');
      }
    }
  }, [mounted, isInitialized, isAuthenticated, user, token, router]);

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

  // Features & Amenities State
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Bluetooth Connectivity',
    'Apple CarPlay',
    'Cruise Control',
    'Air Conditioning',
    'Leather Upholstery',
    'GPS Navigation',
    'Premium Sound System',
    'Backup Camera',
  ]);
  const [customAmenityInput, setCustomAmenityInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

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

  // Upload handlers
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = 3 - uploadedPhotos.length;
    if (availableSlots <= 0) {
      setError('You can upload a maximum of 3 photos.');
      return;
    }

    const filesToUpload = Array.from(files).slice(0, availableSlots);
    setError('');

    // Pre-create local photo items
    const newPhotos: UploadedPhoto[] = filesToUpload.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      isUploading: true,
      uploadProgress: 10,
    }));

    setUploadedPhotos((prev) => [...prev, ...newPhotos]);

    // Process each upload to R2
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const startIdx = uploadedPhotos.length + i;

      try {
        const result = await uploadService.uploadFileToR2(file, 'cars', (progress) => {
          setUploadedPhotos((current) =>
            current.map((p, idx) =>
              idx === startIdx ? { ...p, uploadProgress: progress } : p
            )
          );
        });

        // Mark complete with live public R2 URL
        setUploadedPhotos((current) =>
          current.map((p, idx) =>
            idx === startIdx
              ? {
                  ...p,
                  isUploading: false,
                  r2Url: result.publicUrl,
                  r2Key: result.key,
                  uploadProgress: 100,
                }
              : p
          )
        );
      } catch (err: any) {
        console.error('Photo upload failed:', err);
        setUploadedPhotos((current) =>
          current.map((p, idx) =>
            idx === startIdx
              ? {
                  ...p,
                  isUploading: false,
                  uploadProgress: 0,
                }
              : p
          )
        );
        setError(`Failed to upload "${file.name}": ${err.message || 'Storage error'}`);
      }
    }
  };

  const handleRemovePhoto = async (index: number) => {
    const photoToRemove = uploadedPhotos[index];
    if (photoToRemove?.r2Key) {
      uploadService.deleteFile(photoToRemove.r2Key).catch(() => {});
    }
    setUploadedPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSuccess('');

    // Pre-submission check
    if (uploadedPhotos.length === 0) {
      setError('Please upload at least 1 vehicle photo (up to 3).');
      setFieldErrors({ photos: 'At least 1 vehicle photo is required' });
      return;
    }

    const pendingUploads = uploadedPhotos.some((p) => p.isUploading);
    if (pendingUploads) {
      setError('Please wait for all photos to finish uploading before submitting.');
      return;
    }

    setIsLoading(true);

    const coverImage =
      uploadedPhotos[0]?.r2Url ||
      uploadedPhotos[0]?.previewUrl ||
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200';
    const images = uploadedPhotos
      .map((p) => p.r2Url || p.previewUrl)
      .filter(Boolean);

    const payload = {
      title,
      brand,
      model,
      year: Number(year),
      listingType,
      contactPhone: contactPhone || '01712-345678',
      rentalPrice: listingType === 'rent' ? Number(rentalPrice) : undefined,
      rentalDeposit: undefined,
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
      features: selectedAmenities.slice(0, 4),
      amenities: selectedAmenities,
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
      setSuccess('Vehicle listing published successfully with selected amenities!');
      setTimeout(() => {
        router.push('/provider/cars');
      }, 1200);
    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMap: Record<string, string> = {};
        err.errors.forEach((item: any) => {
          if (item.field) {
            const cleanKey = item.field.replace('body.', '').replace('specs.', '');
            errorMap[cleanKey] = item.message;
            errorMap[item.field] = item.message;
          }
        });
        setFieldErrors(errorMap);
      }
      setError(err.message || 'Failed to publish vehicle listing.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !isInitialized || (!isAuthenticated && !user && !token)) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-4 bg-zinc-50">
        <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-zinc-500">Checking your session...</p>
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
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Please review and resolve the following errors:</span>
            </div>
            {Object.keys(fieldErrors).length > 0 ? (
              <ul className="list-disc list-inside space-y-1 pl-1 text-[12px] text-rose-700 font-medium">
                {Object.entries(fieldErrors)
                  .filter(([k]) => !k.includes('.'))
                  .map(([field, msg]) => (
                    <li key={field}>
                      <span className="font-bold capitalize text-rose-800">
                        {field.replace(/([A-Z])/g, ' $1')}:
                      </span>{' '}
                      {msg}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-xs text-rose-700 font-medium pl-6">{error}</p>
            )}
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
                label="Vehicle Title"
                placeholder="e.g. 2024 Porsche 911 GT3 RS Coupe"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setFieldErrors((p) => ({ ...p, title: '' }));
                }}
                error={fieldErrors['title']}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Brand / Make
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
                  label="Model"
                  placeholder="e.g. 911 GT3"
                  required
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    setFieldErrors((p) => ({ ...p, model: '' }));
                  }}
                  error={fieldErrors['model']}
                />

                <Input
                  label="Manufacturing Year"
                  type="number"
                  min={1900}
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
                    {BODY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Pickup Location / Dealership Address"
                  placeholder="e.g. New York, JFK Airport Hub"
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
            </div>
          </div>

          {/* Section 2: Description & Highlights */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Sparkles className="w-5 h-5 text-black" />
              <h2 className="text-base font-black text-black">Description & Highlights</h2>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                Detailed Vehicle Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Highlight unique features, vehicle condition, service history, and inspection details..."
                className="w-full text-xs font-semibold p-4 rounded-2xl border border-zinc-200 bg-white focus:outline-none focus:border-black leading-relaxed"
              />
            </div>
          </div>

          {/* Section 3: Listing Type & Pricing */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <DollarSign className="w-5 h-5 text-black" />
              <h2 className="text-base font-black text-black">Listing Type & Direct Contact</h2>
            </div>

            {/* Listing Type Toggle: Rent vs Sale */}
            <div className="grid grid-cols-2 gap-4 p-1.5 rounded-2xl bg-zinc-100 border border-zinc-200">
              {(['rent', 'sale'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setListingType(t);
                    setFieldErrors({});
                  }}
                  className={`py-3 rounded-xl text-xs font-black capitalize transition-all ${
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
              <div>
                <Input
                  label="Daily Rental Rate ($ / Day)"
                  type="number"
                  required
                  value={rentalPrice}
                  onChange={(e) => {
                    setRentalPrice(e.target.value === '' ? '' : Number(e.target.value));
                    setFieldErrors((p) => ({ ...p, rentalPrice: '' }));
                  }}
                  placeholder="e.g. 299"
                  error={fieldErrors['rentalPrice']}
                />
              </div>
            ) : (
              <div>
                <Input
                  label="Total Outright Sale Price ($)"
                  type="number"
                  required
                  value={salePrice}
                  onChange={(e) => {
                    setSalePrice(e.target.value === '' ? '' : Number(e.target.value));
                    setFieldErrors((p) => ({ ...p, salePrice: '' }));
                  }}
                  placeholder="e.g. 85000"
                  error={fieldErrors['salePrice']}
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
                type="tel"
                placeholder="01712345678"
                required
                value={contactPhone}
                onChange={(e) => {
                  // Real-time input filter: only allow digits, spaces, hyphens, plus, and parentheses
                  const cleanVal = e.target.value.replace(/[^\d\s\-()+]/g, '');
                  setContactPhone(cleanVal);
                  setFieldErrors((p) => ({ ...p, contactPhone: '' }));
                }}
                leftIcon={<Phone className="w-4 h-4 text-black" />}
                error={fieldErrors['contactPhone']}
              />
              <p className="text-[11px] text-zinc-500">
                {listingType === 'rent'
                  ? 'Renters will see this phone number as masked (017 ••••••••) on the listing card. Logged-in users can click to reveal and copy your number to contact you directly.'
                  : 'Buyers will see this phone number on the vehicle page to call or message you directly to negotiate and inspect the car.'}
              </p>
            </div>
          </div>

          {/* Section 4: Technical Specifications (ONLY FOR CARS FOR SALE) */}
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

          {/* Section 5: Vehicle Features & Amenities (Checkmark Selector + Custom Option Input) - ONLY FOR SALE LISTINGS */}
          {listingType === 'sale' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-black" />
                  <div>
                    <h2 className="text-base font-black text-black">Features & Amenities Options</h2>
                    <p className="text-xs text-zinc-400">
                      Select equipment options and add custom features to display on the vehicle page.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
                  {selectedAmenities.length} Selected
                </span>
              </div>

              {/* Predefined Features Checkmark Options */}
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
          )}

          {/* Section 6: Vehicle Imagery (Up to 3 Photos, Max 5MB Each) */}
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
                        src={photo.r2Url || photo.previewUrl}
                        alt={photo.name}
                        className="h-full w-full object-cover"
                      />

                      {/* Uploading Overlay */}
                      {photo.isUploading && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-white space-y-2">
                          <Loader2 className="w-5 h-5 animate-spin text-white" />
                          <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-white h-full transition-all duration-300 rounded-full"
                              style={{ width: `${photo.uploadProgress || 10}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            Uploading to R2 {photo.uploadProgress}%
                          </span>
                        </div>
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        disabled={photo.isUploading}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white backdrop-blur transition-colors disabled:opacity-50"
                        title="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Cover Badge */}
                      {idx === 0 && (
                        <div className="absolute bottom-2 left-2">
                          <span className="px-2 py-0.5 rounded-full bg-black text-white text-[9px] font-black uppercase tracking-wider">
                            Cover Image
                          </span>
                        </div>
                      )}

                      {/* R2 Synced Badge */}
                      {!photo.isUploading && photo.r2Url && (
                        <div className="absolute bottom-2 right-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold shadow-sm">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>R2</span>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-600 px-1">
                      <span className="truncate max-w-[140px]">{photo.name}</span>
                      <span className="text-zinc-400">
                        {(photo.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>



          {/* Submit Action */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link href="/provider/cars">
              <Button variant="outline" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="dark"
              size="md"
              disabled={isLoading}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              {isLoading ? 'Publishing Listing...' : 'Publish Vehicle Listing'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
