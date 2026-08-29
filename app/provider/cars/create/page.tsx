'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { carService } from '@/services/car.service';
import { uploadService } from '@/services/upload.service';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth.store';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sparkles,
} from 'lucide-react';

import { ListingTypeSelector } from '@/components/provider/cars/ListingTypeSelector';
import { VehicleOverviewSection } from '@/components/provider/cars/VehicleOverviewSection';
import { PricingDurationSection } from '@/components/provider/cars/PricingDurationSection';
import { FeaturesAmenitiesSection } from '@/components/provider/cars/FeaturesAmenitiesSection';
import {
  ImageDropzoneSection,
  UploadedPhoto,
} from '@/components/provider/cars/ImageDropzoneSection';

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

  // 1. Listing Type
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale');

  // 2. Pricing & Visibility
  const [rentalPrice, setRentalPrice] = useState<number | ''>(5000);
  const [salePrice, setSalePrice] = useState<number | ''>(3500000);
  const [contactPhone, setContactPhone] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  });

  // 3. Vehicle Overview Details
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Toyota');
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

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  // File Upload Handlers
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
      if (validImageFiles.length >= availableSlots) break;
    }

    if (validImageFiles.length === 0) return;
    setError('');

    const newPhotoItems: UploadedPhoto[] = validImageFiles.map((file) => ({
      file,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
      isUploading: true,
      uploadProgress: 10,
    }));

    setUploadedPhotos((prev) => [...prev, ...newPhotoItems]);

    for (const file of validImageFiles) {
      try {
        setUploadedPhotos((prev) =>
          prev.map((p) => (p.file === file ? { ...p, uploadProgress: 40 } : p))
        );

        const uploadResult = await uploadService.uploadFileToR2(file, 'cars', (progress) => {
          setUploadedPhotos((prev) =>
            prev.map((p) => (p.file === file ? { ...p, uploadProgress: progress } : p))
          );
        });

        setUploadedPhotos((prev) =>
          prev.map((p) =>
            p.file === file
              ? {
                  ...p,
                  isUploading: false,
                  uploadProgress: 100,
                  r2Url: uploadResult.publicUrl,
                  r2Key: uploadResult.key,
                }
              : p
          )
        );
      } catch (err: any) {
        setUploadedPhotos((prev) => prev.filter((p) => p.file !== file));
        setError(`Failed to upload "${file.name}": ${err.message || 'Storage error'}`);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processUploadedFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos((prev) => {
      const removed = prev[index];
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Validate form before submission
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Vehicle title is required';

    if (listingType === 'rent') {
      if (!location.trim()) errs.location = 'Pickup location / hub address is required';
      if (!rentalPrice || Number(rentalPrice) <= 0) errs.rentalPrice = 'Valid daily rate is required';
    } else {
      if (!brand.trim()) errs.brand = 'Brand is required';
      if (!model.trim()) errs.model = 'Model is required';
      if (!year || year < 1950) errs.year = 'Valid manufacturing year is required';
      if (!location.trim()) errs.location = 'Dealership / pickup location is required';
      if (!salePrice || Number(salePrice) <= 0) errs.salePrice = 'Valid sale price is required';
    }

    if (!contactPhone.trim()) {
      errs.contactPhone = 'Direct contact phone number is required';
    } else if (contactPhone.replace(/\D/g, '').length < 7) {
      errs.contactPhone = 'Please enter a valid phone number';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setError('Please resolve the highlighted validation errors.');
      return;
    }

    if (uploadedPhotos.some((p) => p.isUploading)) {
      setError('Photos are still uploading. Please wait a moment.');
      return;
    }

    setIsLoading(true);

    const imageUrls = uploadedPhotos
      .map((p) => p.r2Url || p.previewUrl)
      .filter((url) => url && !url.startsWith('blob:'));

    const effectiveImages =
      imageUrls.length > 0
        ? imageUrls
        : ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200'];

    const carData = {
      title,
      listingType,
      rentalPrice: listingType === 'rent' ? Number(rentalPrice) : 0,
      salePrice: listingType === 'sale' ? Number(salePrice) : 0,
      price: listingType === 'sale' ? Number(salePrice) : Number(rentalPrice),
      contactPhone: contactPhone.trim(),
      expiresAt: expiresAt.toISOString(),
      location: location.trim(),
      description: description || `${title} available for ${listingType}. Verified and inspected.`,
      brand: listingType === 'sale' ? brand : brand || 'Toyota',
      model: listingType === 'sale' ? model : title.split(' ')[0] || 'Standard',
      year: listingType === 'sale' ? Number(year) : 2024,
      condition: listingType === 'sale' ? condition : 'used',
      mileage: listingType === 'sale' ? (condition === 'new' ? 0 : Number(mileage) || 0) : 0,
      color: listingType === 'sale' ? color : 'Obsidian Black',
      engineCapacity: listingType === 'sale' ? engineCapacity : '1500cc',
      registrationYear:
        listingType === 'sale' && registrationYear ? Number(registrationYear) : undefined,
      vin: listingType === 'sale' && vin.trim() ? vin.trim() : undefined,
      bodyType: listingType === 'sale' ? bodyType : 'Sedan',
      fuelType: listingType === 'sale' ? fuelType : 'Petrol',
      transmission: listingType === 'sale' ? transmission : 'Automatic',
      doors: Number(doors) || 4,
      seats: Number(passengers) || 5,
      luggage: Number(luggage) || 2,
      features: listingType === 'sale' ? selectedAmenities : [],
      images: effectiveImages,
      primaryImage: effectiveImages[0],
    };

    try {
      await carService.createCar(carData);
      setSuccess('Vehicle listing published successfully!');
      setTimeout(() => {
        router.push('/provider/cars');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create vehicle listing. Please check required fields.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/provider/cars"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inventory
          </Link>
          <span className="text-xs font-semibold text-zinc-400">Step 1 of 1 • New Listing</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
            Add New Vehicle
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Create an verified vehicle listing for outright sale or daily rental in Bangladesh.
          </p>
        </div>

        {/* Global Feedback Notifications */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: LISTING TYPE */}
          <ListingTypeSelector
            listingType={listingType}
            onChange={(type) => {
              setListingType(type);
              setFieldErrors({});
            }}
          />

          {/* SECTION 2: VEHICLE OVERVIEW & SPECIFICATIONS */}
          <VehicleOverviewSection
            listingType={listingType}
            title={title}
            setTitle={setTitle}
            brand={brand}
            setBrand={setBrand}
            model={model}
            setModel={setModel}
            year={year}
            setYear={setYear}
            condition={condition}
            setCondition={setCondition}
            mileage={mileage}
            setMileage={setMileage}
            fuelType={fuelType}
            setFuelType={setFuelType}
            transmission={transmission}
            setTransmission={setTransmission}
            engineCapacity={engineCapacity}
            setEngineCapacity={setEngineCapacity}
            color={color}
            setColor={setColor}
            passengers={passengers}
            setPassengers={setPassengers}
            registrationYear={registrationYear}
            setRegistrationYear={setRegistrationYear}
            vin={vin}
            setVin={setVin}
            bodyType={bodyType}
            setBodyType={setBodyType}
            location={location}
            setLocation={setLocation}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
          />

          {/* SECTION 3: PRICING, CONTACT & VISIBILITY EXPIRATION */}
          <PricingDurationSection
            listingType={listingType}
            rentalPrice={rentalPrice}
            setRentalPrice={setRentalPrice}
            salePrice={salePrice}
            setSalePrice={setSalePrice}
            contactPhone={contactPhone}
            setContactPhone={setContactPhone}
            expiresAt={expiresAt}
            setExpiresAt={setExpiresAt}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
          />

          {/* SECTION 4: DETAILED DESCRIPTION */}
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

          {/* SECTION 5: FEATURES & AMENITIES OPTIONS (HIDDEN FOR RENT LISTINGS) */}
          {listingType === 'sale' && (
            <FeaturesAmenitiesSection
              selectedAmenities={selectedAmenities}
              setSelectedAmenities={setSelectedAmenities}
            />
          )}

          {/* SECTION 6: VEHICLE IMAGERY (MAX 3 PHOTOS WITH DRAG & DROP) */}
          <ImageDropzoneSection
            uploadedPhotos={uploadedPhotos}
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileChange={handleFileChange}
            onRemovePhoto={handleRemovePhoto}
          />

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
