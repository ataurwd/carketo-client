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
  FileText,
  X,
  ShieldCheck,
  Check,
  ScrollText,
} from 'lucide-react';

const SELLER_TERMS_SECTIONS = [
  {
    title: '১. মালিকানা ও নথিপত্রের সত্যতা',
    desc: 'বিজ্ঞাপনদাতা নিশ্চিত করছেন যে তিনি এই গাড়ির বৈধ মালিক অথবা মালিকের পক্ষ থেকে বিক্রয় বা ভাড়ার জন্য আইনসম্মত ক্ষমতা প্রাপ্ত। গাড়ির রেজিস্ট্রেশন সার্টিফিকেট, ট্যাক্স টোকেন, ফিটনেস সনদ এবং ব্লু-বুক/স্মার্টকার্ড সম্পূর্ণ বৈধ ও হালনাগাদ রয়েছে। কোনো চুরিকৃত বা আইনি জটিলতায় থাকা গাড়ি তালিকাভুক্ত করা সম্পূর্ণ নিষিদ্ধ।',
  },
  {
    title: '২. নির্ভুল ও সঠিক তথ্য প্রদান',
    desc: 'গাড়ির ছবি, মাইলেজ (প্রকৃত ওডোমিটার রিডিং), বর্তমান যান্ত্রিক অবস্থা, কোনো অ্যাক্সিডেন্ট হিস্ট্রি এবং বিক্রয় বা ভাড়ার মূল্য ১০০% সত্য ও নির্ভুল হতে হবে। কোনো বিভ্রান্তিকর বা ভুয়া তথ্য প্রদান করলে কারকেটো কর্তৃপক্ষ কোনো নোটিশ ছাড়াই বিজ্ঞাপন বাতিল ও অ্যাকাউন্ট স্থায়ীভাবে স্থগিত করার অধিকার সংরক্ষণ করে।',
  },
  {
    title: '৩. সরাসরি গ্রাহক যোগাযোগ ও নিরাপত্তা',
    desc: 'কারকেটো একটি নিরপেক্ষ লিস্টিং ও কানেক্টিং প্ল্যাটফর্ম। আগ্রহী ক্রেতা বা ভাড়াটিয়া সরাসরি আপনার সাথে যোগাযোগ করবেন। টেস্ট ড্রাইভ ও অর্থ লেনদেনের সময় দিনের আলোতে নিরাপদ ও উন্মুক্ত স্থানে সাক্ষাত করুন। গাড়ির কাগজপত্র ক্রেতার সাথে সরাসরি যাচাই করার দায়িত্ব উভয় পক্ষের।',
  },
  {
    title: '৪. প্ল্যাটফর্ম ফি ও ০% ব্রোকার কমিশন',
    desc: 'কারকেটো-তে সাধারণ গাড়ি বিক্রয় বিজ্ঞাপনের ক্ষেত্রে কোনো লুকানো ফি বা অতিরিক্ত ব্রোকার কমিশন কর্তন করা হয় না। গাড়ি বিক্রয় বা ভাড়ার সম্পূর্ণ অর্থ সরাসরি ক্রেতার কাছ থেকে বিক্রেতার কাছে যাবে।',
  },
  {
    title: '৫. ইনভেন্টরি আপডেট ও বিজ্ঞাপন প্রত্যাহার',
    desc: 'গাড়িটি সফলভাবে বিক্রি বা ভাড়া হয়ে গেলে বিক্রেতা তার ড্যাশবোর্ড থেকে তাৎক্ষণিকভাবে গাড়ির প্রাপ্যতা স্ট্যাটাস আপডেট অথবা বিজ্ঞাপনটি মুছে ফেলতে বাধ্য থাকবেন, যাতে অন্য ক্রেতারা অযথা যোগাযোগ না করেন।',
  },
];

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

  // 7. Terms & Services Agreement
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);

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

  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 30) {
      setHasScrolledToEnd(true);
    }
  };

  const handleAcceptTerms = () => {
    setIsTermsAccepted(true);
    setIsTermsModalOpen(false);
    setError('');
  };

  // Submit Handler on final step
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isTermsAccepted) {
      setError('বিজ্ঞাপন প্রকাশ করার আগে অনুগ্রহ করে সেবার শর্তাবলী পড়ে টিক দিন।');
      setIsTermsModalOpen(true);
      return;
    }

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

    const coverImage = effectiveImages[0] || '';

    const carData: any = {
      title,
      listingType,
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
      coverImage,
      primaryImage: coverImage,
    };

    if (listingType === 'rent') {
      carData.rentalPrice = Number(rentalPrice);
      carData.price = Number(rentalPrice);
    } else {
      carData.salePrice = Number(salePrice);
      carData.price = Number(salePrice);
    }

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
            <div className="animate-fade-in space-y-6">
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

              {/* TERMS & SERVICES CHECKBOX CARD */}
              <div
                className={`p-5 rounded-3xl border transition-all ${
                  isTermsAccepted
                    ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      id="terms-checkbox"
                      checked={isTermsAccepted}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setIsTermsModalOpen(true);
                        } else {
                          setIsTermsAccepted(false);
                        }
                      }}
                      className="w-5 h-5 rounded-md border-zinc-300 text-black focus:ring-black cursor-pointer accent-black"
                    />
                  </div>
                  <div className="flex-1 text-xs sm:text-sm">
                    <label
                      htmlFor="terms-checkbox"
                      className="font-bold text-zinc-900 cursor-pointer select-none leading-relaxed block"
                    >
                      আমি কারকেটো-র{' '}
                      <button
                        type="button"
                        onClick={() => setIsTermsModalOpen(true)}
                        className="text-black underline underline-offset-4 font-black hover:text-emerald-700 transition-colors inline-flex items-center gap-1"
                      >
                        <ScrollText className="w-3.5 h-3.5 inline" />
                        সেবার শর্তাবলী ও বিক্রেতা চুক্তি (Terms & Services)
                      </button>{' '}
                      পড়েছি এবং তা মেনে নিতে সম্মত আছি। <span className="text-rose-500">*</span>
                    </label>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      বিজ্ঞাপনটি প্রকাশ করতে শর্তাবলী পড়ে সম্মতি প্রদান করা আবশ্যক। শর্তাবলী দেখতে নীল লেখায় ক্লিক করুন।
                    </p>
                  </div>
                  {isTermsAccepted && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      সম্মত
                    </span>
                  )}
                </div>
              </div>
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
                <div className="flex flex-col items-end">
                  <Button
                    type="submit"
                    variant="dark"
                    size="lg"
                    isLoading={isLoading}
                    disabled={!isTermsAccepted || isLoading}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    গাড়ির বিজ্ঞাপন প্রকাশ করুন
                  </Button>
                  {!isTermsAccepted && (
                    <p className="text-[11px] text-zinc-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span>বিজ্ঞাপন প্রকাশ করতে উপরে শর্তাবলীতে সম্মতি দিন</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* TERMS & SERVICES POPUP MODAL */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-zinc-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-zinc-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <ScrollText className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    সেবার শর্তাবলী ও বিক্রেতা চুক্তি
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    কারকেটো প্ল্যাটফর্মে গাড়ি তালিকাভুক্তির নীতিমালা
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Terms Content */}
            <div
              onScroll={handleTermsScroll}
              className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-zinc-700 leading-relaxed bg-zinc-50"
            >
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  বিজ্ঞাপন প্রকাশের পূর্বে অনুগ্রহ করে নিচের ৫টি ধারা মনোযোগ দিয়ে পড়ুন এবং নিচে <strong>&ldquo;আমি সম্মত ও গ্রহণ করছি (Agree)&rdquo;</strong> বাটনে চাপুন।
                </p>
              </div>

              {SELLER_TERMS_SECTIONS.map((section, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-1.5"
                >
                  <h4 className="font-black text-black text-xs sm:text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{section.title}</span>
                  </h4>
                  <p className="text-zinc-600 text-xs leading-relaxed pl-6">
                    {section.desc}
                  </p>
                </div>
              ))}

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>সবগুলো শর্তাবলী পড়া সম্পন্ন হলে নিচে সম্মতি বাটনটিতে চাপুন।</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-white border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] font-semibold text-zinc-500 text-center sm:text-left">
                সম্মতি প্রদান করলে স্বয়ংক্রিয়ভাবে চেকমার্ক যুক্ত হবে
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTermsModalOpen(false)}
                  className="flex-1 sm:flex-initial"
                >
                  বাতিল
                </Button>
                <Button
                  type="button"
                  variant="dark"
                  size="sm"
                  onClick={handleAcceptTerms}
                  className="flex-1 sm:flex-initial font-black"
                  leftIcon={<Check className="w-4 h-4 text-emerald-400" />}
                >
                  আমি সম্মত ও গ্রহণ করছি (Agree)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
