'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { carService } from '@/services/car.service';
import { uploadService } from '@/services/upload.service';
import { ICar } from '@/types/car.types';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/lib/alert';
import {
  POPULAR_BRANDS,
  BODY_TYPES,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
} from '@/lib/constants';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  X,
  Plus,
  Sparkles,
  Image as ImageIcon,
  Star,
  ShieldCheck,
  Loader2,
  Car as CarIcon,
  Tag,
  Gauge,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  Calendar,
} from 'lucide-react';

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
  'পাওয়ার স্টিয়ারিং',
  'অ্যান্টি-লক ব্রেকিং সিস্টেম (ABS)',
];

interface CarEditFormProps {
  carId: string;
  returnUrl: string;
  isAdmin?: boolean;
}

export function CarEditForm({ carId, returnUrl, isAdmin = false }: CarEditFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Listing Model & Pricing
  const [listingType, setListingType] = useState<'sale' | 'rent' | 'both'>('sale');
  const [rentalPrice, setRentalPrice] = useState<number | ''>('');
  const [rentalDeposit, setRentalDeposit] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [contactPhone, setContactPhone] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<string>('published');
  const [isFeatured, setIsFeatured] = useState(false);

  // 2. Vehicle Overview Details
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [condition, setCondition] = useState<'new' | 'used' | 'certified' | ''>('used');
  const [color, setColor] = useState('');
  const [registrationYear, setRegistrationYear] = useState<number | ''>('');

  // 3. Technical Specifications
  const [bodyType, setBodyType] = useState('Sedan');
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Automatic');
  const [seats, setSeats] = useState<number | ''>(5);
  const [doors, setDoors] = useState<number | ''>(4);
  const [luggage, setLuggage] = useState<number | ''>(2);
  const [mileage, setMileage] = useState<number | ''>('');
  const [airCondition, setAirCondition] = useState(true);
  const [engineCapacity, setEngineCapacity] = useState('');

  // 4. Features & Amenities
  const [amenities, setAmenities] = useState<string[]>([]);
  const [customAmenityInput, setCustomAmenityInput] = useState('');

  // 5. Images Management
  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [directImageUrl, setDirectImageUrl] = useState('');

  // 6. Description
  const [description, setDescription] = useState('');

  // Fetch initial car data
  useEffect(() => {
    let isMounted = true;

    async function fetchCarData() {
      setLoading(true);
      setError(null);
      try {
        const car = await carService.getCarBySlug(carId);
        if (!isMounted) return;

        if (!car) {
          setError('গাড়ির তথ্য পাওয়া যায়নি। আইডিটি সঠিক কিনা পরীক্ষা করুন।');
          setLoading(false);
          return;
        }

        // Pre-fill all fields
        setTitle(car.title || '');
        setBrand(car.brand || '');
        setModel(car.model || '');
        setYear(car.year || '');
        setCondition(car.condition || 'used');
        setColor(car.color || '');
        setRegistrationYear(car.registrationYear || '');

        setListingType((car.listingType as any) || 'sale');
        setRentalPrice(car.rentalPrice || '');
        setRentalDeposit(car.rentalDeposit || '');
        setSalePrice(car.salePrice || car.price || '');
        setContactPhone(car.contactPhone || '');
        setLocation(car.location || '');
        setStatus(car.status || 'published');
        setIsFeatured(Boolean(car.isFeatured));

        const specs: any = car.specs || {};
        setBodyType(car.bodyType || specs.bodyType || 'Sedan');
        setFuelType(car.fuelType || specs.fuelType || 'Petrol');
        setTransmission(car.transmission || specs.transmission || 'Automatic');
        setSeats(car.seats ?? specs.passengers ?? 5);
        setDoors(car.doors ?? specs.doors ?? 4);
        setLuggage(car.luggage ?? specs.luggage ?? 2);
        setMileage(car.mileage ?? specs.mileage ?? '');
        setAirCondition(
          car.airCondition !== undefined
            ? car.airCondition
            : specs.airCondition !== undefined
            ? specs.airCondition
            : true
        );
        setEngineCapacity(car.engineCapacity || specs.engineCapacity || '');

        // Features & Amenities
        const combinedAmenities = Array.from(
          new Set([...(car.features || []), ...(car.amenities || [])])
        );
        setAmenities(combinedAmenities);

        // Images
        setCoverImage(car.coverImage || '');
        setImages(car.images && car.images.length > 0 ? car.images : car.coverImage ? [car.coverImage] : []);

        setDescription(car.description || '');
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'গাড়ির তথ্য লোড করতে সমস্যা হয়েছে।');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (carId) {
      fetchCarData();
    }

    return () => {
      isMounted = false;
    };
  }, [carId]);

  // Handle Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadService.uploadFileToR2(file, 'cars', (pct) => {
          setUploadProgress(Math.round(((i + pct / 100) / files.length) * 100));
        });

        if (res?.publicUrl) {
          newUrls.push(res.publicUrl);
        }
      }

      if (newUrls.length > 0) {
        // If no cover image yet, set first uploaded as cover
        if (!coverImage) {
          setCoverImage(newUrls[0]);
        }
        setImages((prev) => [...prev, ...newUrls]);
        showToast(`${newUrls.length} টি ছবি সফলভাবে আপলোড হয়েছে!`, 'success');
      }
    } catch (err: any) {
      showToast(err?.message || 'ছবি আপলোড করতে ব্যর্থ হয়েছে।', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleAddDirectImageUrl = () => {
    const url = directImageUrl.trim();
    if (!url) return;
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
      if (!coverImage) setCoverImage(url);
      setDirectImageUrl('');
      showToast('ছবি যুক্ত করা হয়েছে!', 'success');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const removedUrl = images[indexToRemove];
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updated);

    // If removed cover image, pick next available
    if (coverImage === removedUrl) {
      setCoverImage(updated.length > 0 ? updated[0] : '');
    }
  };

  const handleSetAsCover = (url: string) => {
    setCoverImage(url);
    showToast('কভার ছবি পরিবর্তন করা হয়েছে!', 'info');
  };

  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleAddCustomAmenity = () => {
    const val = customAmenityInput.trim();
    if (!val) return;
    if (!amenities.includes(val)) {
      setAmenities((prev) => [...prev, val]);
    }
    setCustomAmenityInput('');
  };

  // Form Submit
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !brand.trim() || !model.trim()) {
      showToast('দয়া করে গাড়ির নাম, ব্র্যান্ড ও মডেল পূরণ করুন।', 'error');
      return;
    }

    if (!contactPhone.trim()) {
      showToast('সরাসরি যোগাযোগের ফোন নম্বর প্রয়োজন।', 'error');
      return;
    }

    if (listingType === 'sale' && !salePrice) {
      showToast('বিক্রয় মূল্য নির্ধারণ করুন।', 'error');
      return;
    }

    if (listingType === 'rent' && !rentalPrice) {
      showToast('দৈনিক ভাড়ার রেট নির্ধারণ করুন।', 'error');
      return;
    }

    setIsSaving(true);

    try {
      const payload: any = {
        title: title.trim(),
        brand: brand.trim(),
        model: model.trim(),
        year: year ? Number(year) : undefined,
        condition: condition || 'used',
        color: color.trim() || undefined,
        registrationYear: registrationYear ? Number(registrationYear) : undefined,

        listingType,
        rentalPrice: listingType === 'sale' ? undefined : Number(rentalPrice) || 0,
        rentalDeposit: Number(rentalDeposit) || 0,
        salePrice: listingType === 'rent' ? undefined : Number(salePrice) || 0,
        price: listingType === 'rent' ? Number(rentalPrice) || 0 : Number(salePrice) || 0,

        contactPhone: contactPhone.trim(),
        location: location.trim() || 'Dhaka',
        status,
        isFeatured,

        bodyType,
        fuelType,
        transmission,
        seats: seats ? Number(seats) : 5,
        doors: doors ? Number(doors) : 4,
        luggage: luggage ? Number(luggage) : 2,
        mileage: mileage ? Number(mileage) : 0,
        airCondition,
        engineCapacity: engineCapacity.trim() || undefined,

        specs: {
          bodyType,
          fuelType,
          transmission,
          passengers: seats ? Number(seats) : 5,
          doors: doors ? Number(doors) : 4,
          luggage: luggage ? Number(luggage) : 2,
          mileage: mileage ? Number(mileage) : 0,
          airCondition,
          engineCapacity: engineCapacity.trim() || undefined,
        },

        coverImage: coverImage || images[0] || '',
        images: images.length > 0 ? images : coverImage ? [coverImage] : [],
        features: amenities,
        amenities,
        description: description.trim(),
      };

      await carService.updateCar(carId, payload);
      showToast('গাড়ির তথ্য সফলভাবে আপডেট করা হয়েছে!', 'success');
      router.push(returnUrl);
    } catch (err: any) {
      showToast(err?.message || 'গাড়ির তথ্য আপডেট করতে ব্যর্থ হয়েছে।', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 pt-28 pb-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-sm font-bold text-zinc-600">গাড়ির বিস্তারিত তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 pt-28 pb-20 max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="h-16 w-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-black">{error}</h2>
        <Link href={returnUrl}>
          <Button variant="dark" size="md">
            তালিকায় ফিরে যান
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-24 text-zinc-900">
      <form onSubmit={handleSave} className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* TOP BAR / HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href={returnUrl}
              className="p-2.5 rounded-2xl bg-zinc-100 hover:bg-black hover:text-white transition-colors text-zinc-700"
              title="ফিরে যান"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-black">গাড়ির বিবরণ সম্পাদনা</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-black uppercase tracking-wider">
                  {listingType === 'rent' ? 'ভাড়ার গাড়ি' : listingType === 'sale' ? 'বিক্রয়' : 'উভয়'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-semibold mt-0.5">
                {brand} {model} ({year}) • ID: {carId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <Link href={returnUrl}>
              <Button type="button" variant="outline" size="sm" className="text-xs font-bold">
                বাতিল করুন
              </Button>
            </Link>
            <Button
              type="submit"
              variant="dark"
              size="sm"
              disabled={isSaving}
              className="text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20"
              leftIcon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            >
              {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
            </Button>
          </div>
        </div>

        {/* 1. LISTING MODEL & PRICING */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <DollarSign className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-black text-black">১. লিস্টিং ধরন ও মূল্য নির্ধারণ</h2>
          </div>

          {/* Model Toggle */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-700">লিস্টিংয়ের ধরন নির্বাচন করুন *</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { id: 'sale', label: 'সরাসরি বিক্রয়', desc: 'গাড়িটি এককালীন মূল্যে বিক্রয়যোগ্য' },
                { id: 'rent', label: 'দৈনিক ভাড়া', desc: 'দৈনিক / সাপ্তাহিক চুক্তিতে ভাড়াযোগ্য' },
                { id: 'both', label: 'বিক্রয় ও ভাড়া উভয়ই', desc: 'ক্রেতা চাইলে কিনতে বা ভাড়া নিতে পারেন' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setListingType(t.id as any)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    listingType === t.id
                      ? 'border-black bg-black text-white shadow-sm ring-2 ring-black/10'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-white hover:border-zinc-300 text-zinc-700'
                  }`}
                >
                  <p className="text-xs font-black">{t.label}</p>
                  <p className={`text-[10px] mt-0.5 ${listingType === t.id ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    {t.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(listingType === 'sale' || listingType === 'both') && (
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">বিক্রয় মূল্য (৳) *</label>
                <div className="relative">
                  <span className="text-zinc-500 font-black absolute left-3 top-1/2 -translate-y-1/2 text-xs">৳</span>
                  <input
                    type="number"
                    required
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="যেমন: ২৫০০০০০"
                    className="w-full pl-8 pr-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-xs"
                  />
                </div>
              </div>
            )}

            {(listingType === 'rent' || listingType === 'both') && (
              <>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">দৈনিক ভাড়ার রেট (৳/দিন) *</label>
                  <div className="relative">
                    <span className="text-zinc-500 font-black absolute left-3 top-1/2 -translate-y-1/2 text-xs">৳</span>
                    <input
                      type="number"
                      required
                      value={rentalPrice}
                      onChange={(e) => setRentalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="যেমন: ৩০০০"
                      className="w-full pl-8 pr-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">সিকিউরিটি ডিপোজিট (৳)</label>
                  <div className="relative">
                    <span className="text-zinc-500 font-black absolute left-3 top-1/2 -translate-y-1/2 text-xs">৳</span>
                    <input
                      type="number"
                      value={rentalDeposit}
                      onChange={(e) => setRentalDeposit(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="যেমন: ৫০০০"
                      className="w-full pl-8 pr-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-xs"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">সরাসরি যোগাযোগের ফোন নম্বর *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="01712-345678"
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">লোকেশন / পিকআপ হাব *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="যেমন: ঢাকা, গুলশান"
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-semibold text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">বিজ্ঞাপনের স্ট্যাটাস</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-xs bg-white cursor-pointer"
              >
                <option value="published">সক্রিয় / লাইভ (Published)</option>
                <option value="draft">ড্রাফট (Draft)</option>
                <option value="sold">বিক্রি সম্পন্ন (Sold)</option>
                <option value="rented">ভাড়া সম্পন্ন (Rented)</option>
                <option value="maintenance">সার্ভিসিং / রক্ষণাবেক্ষণ (Maintenance)</option>
                <option value="archived">আর্কাইভ (Archived)</option>
              </select>
            </div>
          </div>

          {isAdmin && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className={`w-5 h-5 ${isFeatured ? 'text-amber-500 fill-amber-500' : 'text-zinc-400'}`} />
                <div>
                  <h4 className="text-xs font-black text-amber-950">ভিআইপি ফিচার্ড শোকেসে প্রদর্শন করুন</h4>
                  <p className="text-[11px] text-amber-800">হোমপেজের টপ প্রিমিয়াম শোকেসে এই গাড়িটি প্রাধান্য পাবে।</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* 2. VEHICLE OVERVIEW & IDENTITY */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <CarIcon className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-black text-black">২. গাড়ির পরিচিতি ও মেক</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">বিজ্ঞাপনের শিরোনাম (Listing Title) *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: Toyota Premio F-EX Package 2021 Sunroof"
              className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">ব্র্যান্ড / মেক *</label>
              <select
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-xs bg-white cursor-pointer"
              >
                <option value="">ব্র্যান্ড নির্বাচন করুন</option>
                {POPULAR_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">মডেল নাম *</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="যেমন: Premio, Allion, Corolla, Prado"
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">উৎপাদন সাল (Year) *</label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="যেমন: 2021"
                min={1980}
                max={2030}
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">গাড়ির বর্তমান অবস্থা (Condition)</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-xs bg-white cursor-pointer"
              >
                <option value="used">ব্যবহৃত (Used)</option>
                <option value="new">ব্র্যান্ড নিউ (Brand New)</option>
                <option value="certified">সার্টিফাইড প্রি-ওনড (Certified Pre-Owned)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">গাড়ির রঙ (Color)</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="যেমন: Pearl White, Obsidian Black"
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-semibold text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">রেজিস্ট্রেশন সাল</label>
              <input
                type="number"
                value={registrationYear}
                onChange={(e) => setRegistrationYear(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="যেমন: 2023"
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-semibold text-xs"
              />
            </div>
          </div>
        </div>

        {/* 3. TECHNICAL SPECIFICATIONS */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Gauge className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-black text-black">৩. টেকনিক্যাল স্পেসিফিকেশন</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">বডি টাইপ</label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-xs bg-white cursor-pointer"
              >
                {BODY_TYPES.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">জ্বালানির ধরন (Fuel)</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-xs bg-white cursor-pointer"
              >
                {FUEL_TYPES.map((ft) => (
                  <option key={ft} value={ft}>
                    {ft}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">ট্রান্সমিশন (গিয়ার)</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-xs bg-white cursor-pointer"
              >
                {TRANSMISSION_TYPES.map((tr) => (
                  <option key={tr} value={tr}>
                    {tr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">ইঞ্জিন ক্ষমতা (cc)</label>
              <input
                type="text"
                value={engineCapacity}
                onChange={(e) => setEngineCapacity(e.target.value)}
                placeholder="যেমন: 1500 cc, 2.0L"
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-semibold text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">মাইলেজ (কি.মি.)</label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="যেমন: 35000"
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-semibold text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">আসন সংখ্যা (Seats)</label>
              <input
                type="number"
                value={seats}
                onChange={(e) => setSeats(e.target.value === '' ? '' : Number(e.target.value))}
                min={2}
                max={20}
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-semibold text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">দরজার সংখ্যা</label>
              <input
                type="number"
                value={doors}
                onChange={(e) => setDoors(e.target.value === '' ? '' : Number(e.target.value))}
                min={2}
                max={6}
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-semibold text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">এয়ার কন্ডিশনার (AC)</label>
              <div className="flex items-center gap-2 pt-1.5">
                <button
                  type="button"
                  onClick={() => setAirCondition(!airCondition)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    airCondition
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {airCondition ? 'হ্যাঁ, এসি আছে' : 'এসি নেই'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. FEATURES & AMENITIES */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-black text-black">৪. সুযোগ-সুবিধা ও প্রিমিয়াম ফিচারসমূহ</h2>
            </div>
            <span className="text-xs font-bold text-zinc-500">
              {amenities.length} টি নির্বাচিত
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_AMENITIES.map((item) => {
              const selected = amenities.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleAmenity(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selected
                      ? 'bg-black text-white shadow-sm ring-1 ring-black'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  <span>{item}</span>
                  {selected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* Add custom feature */}
          <div className="pt-2 flex items-center gap-2 max-w-md">
            <input
              type="text"
              value={customAmenityInput}
              onChange={(e) => setCustomAmenityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomAmenity();
                }
              }}
              placeholder="অন্যান্য কোনো বিশেষ ফিচার লিখুন..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:border-black text-xs font-semibold"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCustomAmenity}
              className="text-xs font-bold shrink-0"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              যোগ করুন
            </Button>
          </div>
        </div>

        {/* 5. IMAGE MANAGEMENT & UPLOAD */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-black text-black">৫. গাড়ির ছবি গ্যালারি ও আপলোড</h2>
            </div>
            <span className="text-xs font-bold text-zinc-500">
              {images.length} টি ছবি সংযুক্ত আছে
            </span>
          </div>

          {/* Current Gallery Grid */}
          {images.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-zinc-700">সংযুক্ত ছবিসমূহ:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((imgUrl, idx) => {
                  const isCover = coverImage === imgUrl;
                  return (
                    <div
                      key={idx}
                      className={`relative group rounded-2xl overflow-hidden border-2 aspect-[4/3] bg-zinc-100 ${
                        isCover ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-zinc-200'
                      }`}
                    >
                      <img src={imgUrl} alt={`Car photo ${idx + 1}`} className="w-full h-full object-cover" />

                      {isCover && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-black shadow-sm">
                          কভার ছবি
                        </span>
                      )}

                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => handleSetAsCover(imgUrl)}
                            className="px-2.5 py-1 rounded-xl bg-white text-black text-[11px] font-bold hover:bg-orange-500 hover:text-white transition-colors"
                          >
                            কভার করুন
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="px-2.5 py-1 rounded-xl bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 transition-colors flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>মুছুন</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upload Dropzone */}
          <div className="p-6 rounded-3xl border-2 border-dashed border-zinc-300 hover:border-black transition-colors bg-zinc-50/50 flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-zinc-200 flex items-center justify-center text-zinc-600">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <p className="text-xs font-black text-black">নতুন ছবি আপলোড করতে ক্লিক করুন বা টেনে আনুন</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">JPG, PNG, WEBP ফরম্যাট সমর্থিত</p>
            </div>

            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm">
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>আপলোড হচ্ছে ({uploadProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>ডিভাইস থেকে ছবি বেছে নিন</span>
                  </>
                )}
              </span>
            </label>
          </div>

          {/* Direct URL input fallback */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="url"
              value={directImageUrl}
              onChange={(e) => setDirectImageUrl(e.target.value)}
              placeholder="অথবা সরাসরি ছবির ওয়েব লিংক (URL) পেস্ট করুন..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:border-black text-xs font-semibold"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddDirectImageUrl}
              className="text-xs font-bold shrink-0"
            >
              লিংক যুক্ত করুন
            </Button>
          </div>
        </div>

        {/* 6. FULL DESCRIPTION */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <FileText className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-black text-black">৬. গাড়ির পূর্ণাঙ্গ বিবরণ</h2>
          </div>

          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="গাড়ির বর্তমান অবস্থা, অ্যাক্সিডেন্ট হিস্ট্রি, কাগজপত্র হালনাগাদ সংক্রান্ত তথ্য বা বিশেষ কোনো নির্দেশিকা বিস্তারিত লিখুন..."
            className="w-full p-4 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black text-xs font-normal leading-relaxed text-zinc-800"
          />
        </div>

        {/* BOTTOM STICKY ACTION BAR */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur p-4 rounded-3xl border border-zinc-200 shadow-2xl flex items-center justify-between gap-4">
          <Link href={returnUrl}>
            <Button type="button" variant="outline" size="md" className="font-bold text-xs">
              বাতিল করুন
            </Button>
          </Link>

          <Button
            type="submit"
            variant="dark"
            size="md"
            disabled={isSaving}
            className="font-bold text-xs bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/30"
            leftIcon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          >
            {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তনগুলো সংরক্ষণ করুন'}
          </Button>
        </div>
      </form>
    </div>
  );
}
