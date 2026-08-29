'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { carService } from '@/services/car.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DatePicker } from '@/components/ui/DatePicker';
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
  Sparkles,
  Check,
  Loader2,
  ShieldCheck,
  Palette,
  Calendar,
  Layers,
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

  // 1. Listing Type (Top Choice)
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale');

  // 2. Pricing & Visibility
  const [rentalPrice, setRentalPrice] = useState<number | ''>(299);
  const [salePrice, setSalePrice] = useState<number | ''>(85000);
  const [contactPhone, setContactPhone] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  });

  // 3. Vehicle Overview Details
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Porsche');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2024);
  const [condition, setCondition] = useState<'new' | 'used' | 'certified'>('used');
  const [mileage, setMileage] = useState<number | ''>(35000);
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Automatic');
  const [engineCapacity, setEngineCapacity] = useState('1500cc');
  const [color, setColor] = useState('Obsidian Black');
  const [passengers, setPassengers] = useState<number>(5);
  const [registrationYear, setRegistrationYear] = useState<number | ''>(2024);
  const [vin, setVin] = useState('');
  const [bodyType, setBodyType] = useState('Sedan');
  const [location, setLocation] = useState('Dhaka, Gulshan-2');
  const [doors, setDoors] = useState<number>(4);
  const [luggage, setLuggage] = useState<number>(2);

  // 4. Description & Highlights
  const [description, setDescription] = useState('');

  // 5. Photos State (Max 3, Max 5MB each)
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // 6. Features & Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Bluetooth Connectivity',
    'Apple CarPlay',
    'Cruise Control',
    'Air Conditioning',
    'Leather Upholstery',
    'GPS Navigation',
    'Backup Camera',
    'Keyless Entry & Push Start',
  ]);
  const [customAmenityInput, setCustomAmenityInput] = useState('');

  // Status & Feedback
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
  const processUploadedFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    const availableSlots = 3 - uploadedPhotos.length;
    if (availableSlots <= 0) {
      setError('You can upload a maximum of 3 photos.');
      return;
    }

    const validImageFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setError(`"${file.name}" is not a supported image file. Please upload JPEG, PNG, or WebP.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" exceeds the 5MB size limit.`);
        return;
      }
      validImageFiles.push(file);
    }

    const filesToUpload = validImageFiles.slice(0, availableSlots);
    if (filesToUpload.length === 0) return;
    setError('');

    const newPhotos: UploadedPhoto[] = filesToUpload.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      isUploading: true,
      uploadProgress: 10,
    }));

    const startIndex = uploadedPhotos.length;
    setUploadedPhotos((prev) => [...prev, ...newPhotos]);

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const targetIdx = startIndex + i;

      try {
        const result = await uploadService.uploadFileToR2(file, 'cars', (progress) => {
          setUploadedPhotos((current) =>
            current.map((p, idx) =>
              idx === targetIdx ? { ...p, uploadProgress: progress } : p
            )
          );
        });

        setUploadedPhotos((current) =>
          current.map((p, idx) =>
            idx === targetIdx
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
            idx === targetIdx
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processUploadedFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleRemovePhoto = async (index: number) => {
    const photoToRemove = uploadedPhotos[index];
    if (photoToRemove?.r2Key) {
      uploadService.deleteFile(photoToRemove.r2Key).catch(() => {});
    }
    setUploadedPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSuccess('');

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

    const autoBrand = listingType === 'rent' ? (brand || title.split(' ')[0] || 'Standard') : brand;
    const autoModel = listingType === 'rent' ? (model || title.split(' ').slice(1).join(' ') || 'Fleet') : model;
    const autoYear = listingType === 'rent' ? (year || new Date().getFullYear()) : Number(year);

    const payload = {
      title,
      brand: autoBrand,
      model: autoModel,
      year: autoYear,
      condition: listingType === 'sale' ? condition : 'used',
      color: listingType === 'sale' ? color : 'Standard',
      registrationYear: (listingType === 'sale' && registrationYear) ? Number(registrationYear) : undefined,
      vin: (listingType === 'sale' && vin) ? vin.trim() : undefined,
      engineCapacity: listingType === 'sale' ? (engineCapacity || undefined) : undefined,
      listingType,
      contactPhone: contactPhone || '01712-345678',
      rentalPrice: listingType === 'rent' ? Number(rentalPrice) : undefined,
      rentalDeposit: undefined,
      salePrice: listingType === 'sale' ? Number(salePrice) : undefined,
      location,
      bodyType: listingType === 'sale' ? bodyType : 'Sedan',
      fuelType: listingType === 'sale' ? fuelType : 'Petrol',
      transmission: listingType === 'sale' ? transmission : 'Automatic',
      seats: listingType === 'sale' ? Number(passengers) : 4,
      doors: Number(doors),
      luggage: Number(luggage),
      mileage: listingType === 'sale' ? (condition === 'new' ? 0 : Number(mileage || 0)) : 0,
      description: description || `${title} available for ${listingType}. Verified and inspected.`,
      coverImage,
      images,
      expiresAt: expiresAt ? expiresAt.toISOString() : undefined,
      features: listingType === 'sale' ? selectedAmenities.slice(0, 4) : [],
      amenities: listingType === 'sale' ? selectedAmenities : [],
      specs: {
        passengers: listingType === 'sale' ? Number(passengers) : 4,
        doors: Number(doors),
        transmission: listingType === 'sale' ? transmission : 'Automatic',
        fuelType: listingType === 'sale' ? fuelType : 'Petrol',
        bodyType: listingType === 'sale' ? bodyType : 'Sedan',
        mileage: listingType === 'sale' ? (condition === 'new' ? 0 : Number(mileage || 0)) : 0,
        luggage: Number(luggage),
        engineCapacity: listingType === 'sale' ? engineCapacity : undefined,
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
            Choose your listing type, add full vehicle specifications, and upload up to 3 photos.
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
          {/* ========================================================================= */}
          {/* SECTION 1: LISTING TYPE (PLACED AT THE VERY TOP AS REQUESTED)            */}
          {/* ========================================================================= */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-black" />
                <h2 className="text-base font-black text-black">Listing Purpose & Intent</h2>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700">
                Primary Selection
              </span>
            </div>

            <p className="text-xs text-zinc-500">
              Select whether you are listing this vehicle for outright sale or daily rental.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => {
                  setListingType('sale');
                  setFieldErrors({});
                }}
                className={`p-5 rounded-2xl text-left transition-all flex items-start gap-4 border ${
                  listingType === 'sale'
                    ? 'bg-black text-white border-black shadow-lg ring-2 ring-black/10 scale-[1.01]'
                    : 'bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200 text-zinc-800'
                }`}
              >
                <div
                  className={`p-3 rounded-xl shrink-0 ${
                    listingType === 'sale' ? 'bg-white/15 text-white' : 'bg-white text-zinc-900 border border-zinc-200 shadow-sm'
                  }`}
                >
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-black flex items-center gap-2">
                    <span>For Sale</span>
                    {listingType === 'sale' && (
                      <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded-full font-bold">
                        Active
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[11px] leading-relaxed mt-1 ${
                      listingType === 'sale' ? 'text-zinc-300' : 'text-zinc-500'
                    }`}
                  >
                    Dealership inventory or private sale with condition, mileage, registration & VIN.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setListingType('rent');
                  setFieldErrors({});
                }}
                className={`p-5 rounded-2xl text-left transition-all flex items-start gap-4 border ${
                  listingType === 'rent'
                    ? 'bg-black text-white border-black shadow-lg ring-2 ring-black/10 scale-[1.01]'
                    : 'bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200 text-zinc-800'
                }`}
              >
                <div
                  className={`p-3 rounded-xl shrink-0 ${
                    listingType === 'rent' ? 'bg-white/15 text-white' : 'bg-white text-zinc-900 border border-zinc-200 shadow-sm'
                  }`}
                >
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-black flex items-center gap-2">
                    <span>For Rent</span>
                    {listingType === 'rent' && (
                      <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded-full font-bold">
                        Active
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[11px] leading-relaxed mt-1 ${
                      listingType === 'rent' ? 'text-zinc-300' : 'text-zinc-500'
                    }`}
                  >
                    Rental fleet listing with daily pricing, direct renter contact & pickup hub.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: VEHICLE OVERVIEW & SPECIFICATIONS                              */}
          {/* ========================================================================= */}
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
              {/* Title (Always required for both Rent and Sale) */}
              <Input
                label="Vehicle Title *"
                placeholder={
                  listingType === 'rent'
                    ? 'e.g. 2024 Toyota Land Cruiser Prado TX-L / Porsche Cayenne'
                    : 'e.g. 2024 Porsche 911 GT3 RS Coupe'
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
                          onChange={(e) => setRegistrationYear(e.target.value === '' ? '' : Number(e.target.value))}
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

          {/* ========================================================================= */}
          {/* SECTION 3: PRICING, CONTACT & VISIBILITY EXPIRATION                       */}
          {/* ========================================================================= */}
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
              ) : (
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

          {/* ========================================================================= */}
          {/* SECTION 4: DETAILED DESCRIPTION & HIGHLIGHTS                              */}
          {/* ========================================================================= */}
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
                placeholder={
                  listingType === 'rent'
                    ? 'Rental terms, daily mileage limits, chauffeur option, fuel policy, and pickup details...'
                    : 'Highlight vehicle condition, maintenance records, test-drive options, and inspection history...'
                }
                className="w-full text-xs font-semibold p-4 rounded-2xl border border-zinc-200 bg-white focus:outline-none focus:border-black leading-relaxed"
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 5: FEATURES & AMENITIES OPTIONS (HIDDEN FOR RENT LISTINGS)        */}
          {/* ========================================================================= */}
          {listingType === 'sale' && (
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
          )}

          {/* ========================================================================= */}
          {/* SECTION 6: VEHICLE IMAGERY (MAX 3 PHOTOS WITH DRAG & DROP)                */}
          {/* ========================================================================= */}
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

            {/* Dropzone Area with Live Drag and Drop */}
            {uploadedPhotos.length < 3 && (
              <label
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center group ${
                  isDragging
                    ? 'border-black bg-black/5 ring-4 ring-black/10 scale-[1.01]'
                    : 'border-zinc-300 hover:border-black bg-zinc-50/50 hover:bg-zinc-50'
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all shadow-sm mb-3 ${
                    isDragging
                      ? 'bg-black text-white scale-110 animate-bounce'
                      : 'bg-white border border-zinc-200 text-zinc-700 group-hover:scale-110'
                  }`}
                >
                  <UploadCloud className={`w-6 h-6 ${isDragging ? 'text-white' : 'text-black'}`} />
                </div>
                <p className="text-xs font-extrabold text-black">
                  {isDragging ? 'Release to upload photos!' : 'Click to select or drag & drop car photos'}
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

                      {/* Delete Button */}
                      {!photo.isUploading && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-sm transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {idx === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black text-white text-[10px] font-black uppercase tracking-wider">
                          Cover Photo
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-zinc-500">
                      <span className="truncate max-w-[120px]">{photo.name}</span>
                      <span>{(photo.size / 1024 / 1024).toFixed(1)} MB</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link href="/provider/cars">
              <Button type="button" variant="outline" size="md" disabled={isLoading}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="dark"
              size="lg"
              isLoading={isLoading}
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
