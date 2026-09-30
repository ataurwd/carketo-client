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
  ArrowRight,
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

  // Multi-step form state (1 to 4) - Hidden from user, only Next and Back buttons
  const [currentStep, setCurrentStep] = useState<number>(1);

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
  const [rentalPrice, setRentalPrice] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [contactPhone, setContactPhone] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  });

  // 3. Vehicle Overview Details (Model, Seats, Color, Location, Registration Year, VIN removed per request)
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [condition, setCondition] = useState<'new' | 'used' | 'certified' | ''>('');
  const [mileage, setMileage] = useState<number | ''>('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [engineCapacity, setEngineCapacity] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [doors] = useState<number>(4);
  const [luggage] = useState<number>(2);

  // 4. Description & Highlights
  const [description, setDescription] = useState('');

  // 5. Photos State (Max 3, Max 5MB each)
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // 6. Features & Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

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
      setError('আপনি সর্বোচ্চ ৩টি ছবি আপলোড করতে পারবেন।');
      return;
    }

    const validImageFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setError(`"${file.name}" একটি সমর্থিত ছবি ফাইল নয়। অনুগ্রহ করে JPEG, PNG, বা WebP আপলোড করুন।`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" ফাইলের আকার ৫ এমবি সীমার বেশি।`);
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
        setError(`"${file.name}" আপলোড করতে ব্যর্থ হয়েছে: ${err.message || 'স্টোরেজ ত্রুটি'}`);
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

  // Step-by-step validations
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      errs.title = 'গাড়ির শিরোনাম আবশ্যক';
    } else if (trimmedTitle.length < 3) {
      errs.title = 'গাড়ির শিরোনাম কমপক্ষে ৩ অক্ষরের হতে হবে';
    } else if (trimmedTitle.length > 100) {
      errs.title = 'গাড়ির শিরোনাম ১০০ অক্ষরের বেশি হতে পারবে না';
    }

    if (!brand.trim()) {
      errs.brand = 'অনুগ্রহ করে গাড়ির ব্র্যান্ড নির্বাচন করুন';
    }

    const yearStr = year !== '' && year !== undefined ? year.toString() : '';
    const currentYear = new Date().getFullYear();
    if (!yearStr) {
      errs.year = 'উৎপাদন সাল আবশ্যক';
    } else if (yearStr.length !== 4) {
      errs.year = 'উৎপাদন সাল অবশ্যই ৪ সংখ্যার হতে হবে (যেমন: 2024)';
    } else {
      const yearNum = Number(year);
      if (isNaN(yearNum) || yearNum < 1950 || yearNum > currentYear + 2) {
        errs.year = `উৎপাদন সাল ১৯৫০ এবং ${currentYear + 2} এর মধ্যে হতে হবে`;
      }
    }

    if (!condition) {
      errs.condition = 'অনুগ্রহ করে গাড়ির কন্ডিশন নির্বাচন করুন';
    } else if (condition !== 'new') {
      if (mileage === '' || isNaN(Number(mileage)) || Number(mileage) < 0) {
        errs.mileage = 'ব্যবহৃত গাড়ির জন্য সঠিক মাইলেজ আবশ্যক';
      } else if (Number(mileage) > 9999999) {
        errs.mileage = 'মাইলেজ ৯৯,৯৯,৯৯৯ কিমি এর বেশি হতে পারবে না';
      }
    }

    if (!fuelType) {
      errs.fuelType = 'অনুগ্রহ করে জ্বালানির ধরন নির্বাচন করুন';
    }

    if (!transmission) {
      errs.transmission = 'অনুগ্রহ করে ট্রান্সমিশন নির্বাচন করুন';
    }

    if (!bodyType) {
      errs.bodyType = 'অনুগ্রহ করে বডি টাইপ নির্বাচন করুন';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (listingType === 'rent') {
      if (rentalPrice === '' || isNaN(Number(rentalPrice)) || Number(rentalPrice) <= 0) {
        errs.rentalPrice = 'সঠিক দৈনিক ভাড়ার হার আবশ্যক (০ এর বেশি)';
      } else if (Number(rentalPrice) > 10000000) {
        errs.rentalPrice = 'দৈনিক ভাড়ার হার ৳ ১,০০,০০,০০০ এর বেশি হতে পারবে না';
      }
    } else {
      if (salePrice === '' || isNaN(Number(salePrice)) || Number(salePrice) <= 0) {
        errs.salePrice = 'সঠিক বিক্রয় মূল্য আবশ্যক (০ এর বেশি)';
      } else if (Number(salePrice) > 1000000000) {
        errs.salePrice = 'বিক্রয় মূল্য ৳ ১০০,০০,০০,০০০ এর বেশি হতে পারবে না';
      }
    }

    const cleanPhone = contactPhone.replace(/\D/g, '');
    if (!cleanPhone) {
      errs.contactPhone = 'সরাসরি যোগাযোগের ফোন নম্বর আবশ্যক';
    } else if (cleanPhone.length !== 11) {
      errs.contactPhone = `ফোন নম্বর অবশ্যই ১১ সংখ্যার হতে হবে (বর্তমান: ${cleanPhone.length} সংখ্যা)`;
    } else if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      errs.contactPhone = '01 দিয়ে শুরু হওয়া সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01712345678)';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 1) {
      if (!validateStep1()) {
        setError('এগিয়ে যাওয়ার আগে অনুগ্রহ করে প্রয়োজনীয় ঘরগুলো পূরণ করুন।');
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 2) {
      if (!validateStep2()) {
        setError('অনুগ্রহ করে সঠিক মূল্য এবং যোগাযোগের তথ্য দিন।');
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 3) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submit Handler on final step
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateStep1() || !validateStep2()) {
      setError('প্রকাশ করার আগে অনুগ্রহ করে সকল ত্রুটি সমাধান করুন।');
      return;
    }

    if (uploadedPhotos.some((p) => p.isUploading)) {
      setError('ছবি এখনো আপলোড হচ্ছে। অনুগ্রহ করে একটু অপেক্ষা করুন।');
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

    // Automatically derive model from title if omitted
    const derivedModel =
      title.trim().split(' ').length > 1
        ? title.trim().split(' ').slice(1).join(' ')
        : title.trim() || 'Standard';

    const carData = {
      title,
      listingType,
      rentalPrice: listingType === 'rent' ? Number(rentalPrice) : 0,
      salePrice: listingType === 'sale' ? Number(salePrice) : 0,
      price: listingType === 'sale' ? Number(salePrice) : Number(rentalPrice),
      contactPhone: contactPhone.trim(),
      expiresAt: expiresAt.toISOString(),
      location: 'Dhaka',
      description: description.trim() || `${title} available for ${listingType}. Verified and inspected.`,
      brand: brand || 'Toyota',
      model: derivedModel,
      year: Number(year) || 2024,
      condition: condition || 'used',
      mileage: condition === 'new' ? 0 : Number(mileage) || 0,
      color: 'Obsidian Black',
      engineCapacity: engineCapacity || '1500cc',
      bodyType: bodyType || 'Sedan',
      fuelType: fuelType || 'Petrol',
      transmission: transmission || 'Automatic',
      doors: Number(doors) || 4,
      seats: 5,
      luggage: Number(luggage) || 2,
      features: listingType === 'sale' ? selectedAmenities : [],
      images: effectiveImages,
      primaryImage: effectiveImages[0],
    };

    try {
      await carService.createCar(carData);
      setSuccess('গাড়ির বিজ্ঞাপন সফলভাবে প্রকাশিত হয়েছে!');
      setTimeout(() => {
        router.push('/provider/cars');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'গাড়ির বিজ্ঞাপন তৈরি করতে ব্যর্থ হয়েছে। অনুগ্রহ করে প্রয়োজনীয় তথ্যগুলো যাচাই করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header - No step indicator shown per user specification */}
        <div className="flex items-center justify-between">
          <Link
            href="/provider/cars"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            ইনভেন্টরিতে ফিরে যান
          </Link>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
            নতুন গাড়ি যুক্ত করুন
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            বাংলাদেশে সরাসরি বিক্রয় বা দৈনিক ভাড়ার জন্য একটি ভেরিফাইড গাড়ির বিজ্ঞাপন তৈরি করুন।
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
          {/* STEP 1: LISTING TYPE & VEHICLE OVERVIEW SPECIFICATIONS */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-fade-in">
              <ListingTypeSelector
                listingType={listingType}
                onChange={(type) => {
                  setListingType(type);
                  setFieldErrors({});
                }}
              />

              <VehicleOverviewSection
                listingType={listingType}
                title={title}
                setTitle={setTitle}
                brand={brand}
                setBrand={setBrand}
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
                bodyType={bodyType}
                setBodyType={setBodyType}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
              />
            </div>
          )}

          {/* STEP 2: PRICING, CONTACT & VISIBILITY DURATION */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
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
            </div>
          )}

          {/* STEP 3: DETAILED DESCRIPTION & FEATURES/AMENITIES */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                  <Sparkles className="w-5 h-5 text-black" />
                  <h2 className="text-base font-black text-black">বিবরণ ও মূল বৈশিষ্ট্য</h2>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                    গাড়ির বিস্তারিত বিবরণ
                  </label>
                  <textarea
                    rows={4}
                    maxLength={2000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
                    placeholder={
                      listingType === 'rent'
                        ? 'ভাড়ার শর্তাবলী, দৈনিক মাইলেজ সীমা, ড্রাইভার অপশন, জ্বালানি নীতি এবং পিকআপের বিবরণ লিখুন...'
                        : 'গাড়ির মূল বৈশিষ্ট্য, কন্ডিশন, সার্ভিস হিস্ট্রি, টেস্ট-ড্রাইভ অপশন এবং পরিদর্শনের বিবরণ লিখুন...'
                    }
                    className="w-full text-xs font-semibold p-4 rounded-2xl border border-zinc-200 bg-white focus:outline-none focus:border-black leading-relaxed"
                  />
                </div>
              </div>

              {listingType === 'sale' && (
                <FeaturesAmenitiesSection
                  selectedAmenities={selectedAmenities}
                  setSelectedAmenities={setSelectedAmenities}
                />
              )}
            </div>
          )}

          {/* STEP 4: VEHICLE IMAGERY & FINAL PUBLISH */}
          {currentStep === 4 && (
            <div className="animate-fade-in">
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
            </div>
          )}

          {/* Multi-Step Navigation Controls: Only Next & Back buttons (No stepper displayed) */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-200">
            <div>
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleBack}
                  disabled={isLoading}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  পেছনে
                </Button>
              ) : (
                <Link href="/provider/cars">
                  <Button type="button" variant="outline" size="md" disabled={isLoading}>
                    বাতিল করুন
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              {currentStep < 4 ? (
                <Button
                  type="button"
                  variant="dark"
                  size="md"
                  onClick={handleNext}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  পরবর্তী
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="dark"
                  size="lg"
                  isLoading={isLoading}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  গাড়ির বিজ্ঞাপন প্রকাশ করুন
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
