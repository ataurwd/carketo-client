'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { carService } from '@/services/car.service';
import { confirmDialog, showToast } from '@/lib/alert';
import { ICar } from '@/types/car.types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import {
  ArrowLeft,
  Plus,
  Trash2,
  ExternalLink,
  Car,
  Edit,
  X,
  CheckCircle2,
  DollarSign,
  Phone,
  MapPin,
  FileText,
} from 'lucide-react';

export default function ProviderCarsPage() {
  const [cars, setCars] = useState<ICar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [editingCar, setEditingCar] = useState<ICar | null>(null);
  const [editPrice, setEditPrice] = useState<number | ''>('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    carService
      .getMyFleet()
      .then((res) => {
        setCars(res || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const openEditModal = (car: ICar) => {
    setEditingCar(car);
    setEditPrice(car.listingType === 'rent' ? car.rentalPrice || 0 : car.salePrice || car.price || 0);
    setEditPhone(car.contactPhone || '');
    setEditLocation(car.location || '');
    setEditDescription(car.description || '');
    setSaveSuccess(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;
    setIsSaving(true);

    try {
      const updatePayload: any = {
        contactPhone: editPhone,
        location: editLocation,
        description: editDescription,
      };

      if (editingCar.listingType === 'rent') {
        updatePayload.rentalPrice = Number(editPrice);
      } else {
        updatePayload.salePrice = Number(editPrice);
      }

      await carService.updateCar(editingCar._id, updatePayload);

      setCars(
        cars.map((c) =>
          c._id === editingCar._id
            ? {
                ...c,
                ...updatePayload,
              }
            : c
        )
      );

      setSaveSuccess(true);
      setTimeout(() => {
        setEditingCar(null);
        setSaveSuccess(false);
      }, 1000);
    } catch {
      // optimistic fallback
      setCars(
        cars.map((c) =>
          c._id === editingCar._id
            ? {
                ...c,
                contactPhone: editPhone,
                location: editLocation,
              }
            : c
        )
      );
      setEditingCar(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (carId: string, newStatus: string) => {
    try {
      await carService.updateCar(carId, { status: newStatus as any });
      setCars(cars.map((c) => (c._id === carId ? { ...c, status: newStatus as any } : c)));
    } catch {
      setCars(cars.map((c) => (c._id === carId ? { ...c, status: newStatus as any } : c)));
    }
  };

  const handleDelete = async (carId: string) => {
    const isConfirmed = await confirmDialog({
      title: 'বিজ্ঞাপনটি আর্কাইভ করবেন?',
      text: 'আপনি কি নিশ্চিত যে আপনি এই গাড়ির বিজ্ঞাপনটি আর্কাইভ করতে চান? এটি আর ক্রেতাদের কাছে প্রকাশ্যে দৃশ্যমান থাকবে না।',
      confirmButtonText: 'হ্যাঁ, আর্কাইভ করুন',
      cancelButtonText: 'বাতিল করুন',
      icon: 'warning',
      isDestructive: true,
    });
    if (!isConfirmed) return;

    try {
      await carService.deleteCar(carId);
      setCars(cars.filter((c) => c._id !== carId));
      showToast('গাড়ির বিজ্ঞাপন সফলভাবে আর্কাইভ করা হয়েছে', 'success');
    } catch {
      showToast('বিজ্ঞাপন আর্কাইভ করতে ব্যর্থ হয়েছে', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ড্যাশবোর্ডে ফিরে যান</span>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-black">গাড়ির ইনভেন্টরি</h1>
              <span className="h-6 px-2.5 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                {cars.length} টি বিজ্ঞাপন
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              আপনার নিবন্ধিত গাড়ি, মূল্য নির্ধারণ, প্রাপ্যতা এবং লাইভ স্ট্যাটাস পরিচালনা করুন।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/inquiries">
              <Button variant="outline" size="md">
                জিজ্ঞাসার ইনবক্স
              </Button>
            </Link>
            <Link href="/provider/cars/create">
              <Button variant="dark" size="md" leftIcon={<Plus className="w-4 h-4" />}>
                নতুন গাড়ি যুক্ত করুন
              </Button>
            </Link>
          </div>
        </div>

        {/* Cars Table */}
        {isLoading ? (
          <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-zinc-500">আপনার গাড়িগুলো লোড হচ্ছে...</p>
          </div>
        ) : cars.length > 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200">
                  <tr>
                    <th className="py-4 px-6">গাড়ি</th>
                    <th className="py-4 px-6">মডেল ও সাল</th>
                    <th className="py-4 px-6">বিজ্ঞাপনের ধরন</th>
                    <th className="py-4 px-6">মূল্য</th>
                    <th className="py-4 px-6">প্রাপ্যতা স্ট্যাটাস</th>
                    <th className="py-4 px-6 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-semibold text-zinc-800">
                  {cars.map((car) => (
                    <tr key={car._id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={car.coverImage}
                            alt={car.title}
                            className="w-14 h-10 object-cover rounded-xl border border-zinc-200"
                          />
                          <div>
                            <p className="font-extrabold text-black text-sm">{car.title}</p>
                            <p className="text-[11px] text-zinc-400">
                              {car.location} • ফোন: {car.contactPhone || 'প্রযোজ্য নয়'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-bold text-zinc-900">{car.brand} {car.model}</p>
                        <p className="text-[11px] text-zinc-400">{car.year} • {car.specs?.bodyType || car.bodyType || 'Sedan'}</p>
                      </td>

                      <td className="py-4 px-6">
                        <Badge variant={car.listingType === 'rent' ? 'dark' : 'slate'} size="sm">
                          {car.listingType === 'rent' ? 'ভাড়ার জন্য' : 'বিক্রয়ের জন্য'}
                        </Badge>
                      </td>

                      <td className="py-4 px-6 font-bold text-black text-sm">
                        {car.listingType === 'rent'
                          ? `${formatPrice(car.rentalPrice || 199)} / দিন`
                          : formatPrice(car.salePrice || car.price || 45000)}
                      </td>

                      <td className="py-4 px-6">
                        <select
                          value={car.status || 'published'}
                          onChange={(e) => handleStatusChange(car._id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 text-[11px] font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
                        >
                          <option value="published">🟢 এভেইলেবল</option>
                          <option value="rented">🟡 ভাড়ায় আছে</option>
                          <option value="sold">🔴 বিক্রি হয়ে গেছে</option>
                          <option value="draft">⚪ ড্রাফট / নিষ্ক্রিয়</option>
                          <option value="archived">⚫ আর্কাইভড</option>
                        </select>
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(car)}
                          className="inline-flex p-2 rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors"
                          title="দ্রুত সম্পাদনা করুন"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/cars/${car.slug}`}
                          target="_blank"
                          className="inline-flex p-2 rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors"
                          title="লাইভ বিজ্ঞাপন দেখুন"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(car._id)}
                          className="inline-flex p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="বিজ্ঞাপন আর্কাইভ করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <Car className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-lg font-black text-black">আপনার ইনভেন্টরিতে কোনো গাড়ি নেই</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              আপনি এখনো ভাড়া বা বিক্রয়ের জন্য কোনো গাড়ি তালিকাভুক্ত করেননি। আপনার প্রথম গাড়ি যুক্ত করতে নিচে ক্লিক করুন।
            </p>
            <Link href="/provider/cars/create">
              <Button variant="dark" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                আপনার প্রথম গাড়ি যুক্ত করুন
              </Button>
            </Link>
          </div>
        )}

        {/* Quick Edit Modal */}
        {editingCar && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-black">গাড়ির বিজ্ঞাপন সম্পাদনা করুন</h3>
                  <p className="text-xs text-zinc-400">{editingCar.title}</p>
                </div>
                <button
                  onClick={() => setEditingCar(null)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>পরিবর্তনগুলো সফলভাবে সংরক্ষিত হয়েছে!</span>
                </div>
              )}

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">
                    {editingCar.listingType === 'rent' ? 'দৈনিক ভাড়ার হার (৳/দিন)' : 'মোট বিক্রয় মূল্য (৳)'}
                  </label>
                  <div className="relative">
                    <span className="text-zinc-500 font-black absolute left-3 top-1/2 -translate-y-1/2 text-sm">৳</span>
                    <input
                      type="number"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-bold text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1">সরাসরি যোগাযোগের ফোন নম্বর</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="01712-345678"
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-semibold text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1">লোকেশন / পিকআপ হাব</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black font-semibold text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1">গাড়ির বিবরণ</label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-zinc-200 focus:outline-none focus:border-black text-xs font-normal text-zinc-700 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingCar(null)}
                  >
                    বাতিল করুন
                  </Button>
                  <Button
                    type="submit"
                    variant="dark"
                    size="sm"
                    disabled={isSaving}
                  >
                    {isSaving ? 'সংরক্ষিত হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
