'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import { confirmDialog, showToast } from '@/lib/alert';
import { ICar } from '@/types/car.types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Car,
  Search,
  SlidersHorizontal,
  Star,
  Trash2,
  ExternalLink,
  Download,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  Phone,
  Plus,
  Edit,
  X,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Fuel,
  Gauge,
  ChevronDown,
  Check,
} from 'lucide-react';

const CAR_STATUS_CONFIG: Record<
  string,
  { label: string; badge: string; dot: string; desc: string }
> = {
  published: {
    label: 'Published',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.1)]',
    dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    desc: 'Live on public storefront',
  },
  draft: {
    label: 'Draft',
    badge: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/80 hover:bg-zinc-800 hover:border-zinc-600',
    dot: 'bg-zinc-400',
    desc: 'Hidden from public view',
  },
  pending: {
    label: 'Pending Approval',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.1)]',
    dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
    desc: 'Awaiting admin review',
  },
  rented: {
    label: 'Under Rent',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20 hover:border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.1)]',
    dot: 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]',
    desc: 'Active rental in progress',
  },
  sold: {
    label: 'Sold',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.1)]',
    dot: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]',
    desc: 'Purchased & title transferred',
  },
  archived: {
    label: 'Archived',
    badge: 'bg-zinc-900/90 text-zinc-500 border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700',
    dot: 'bg-zinc-600',
    desc: 'Deactivated fleet record',
  },
};

function CarStatusDropdown({
  carId,
  currentStatus,
  onStatusChange,
}: {
  carId: string;
  currentStatus: string;
  onStatusChange: (carId: string, newStatus: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const activeConfig = CAR_STATUS_CONFIG[currentStatus] || CAR_STATUS_CONFIG.draft;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer select-none ${activeConfig.badge}`}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${activeConfig.dot}`} />
        <span>{activeConfig.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-zinc-900/98 backdrop-blur-2xl border border-zinc-700/80 shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 border-b border-zinc-800/80 mb-1 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
              Update Fleet Status
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Live</span>
          </div>
          <div className="space-y-0.5">
            {Object.entries(CAR_STATUS_CONFIG).map(([key, config]) => {
              const isSelected = key === currentStatus;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onStatusChange(carId, key);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                    isSelected
                      ? 'bg-zinc-800 text-white shadow-inner'
                      : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />
                    <div className="text-left truncate">
                      <p className="truncate leading-tight text-white">{config.label}</p>
                      <p className="text-[10px] text-zinc-400 font-normal truncate mt-0.5">
                        {config.desc}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface CarFormData {
  title: string;
  brand: string;
  model: string;
  year: number;
  listingType: 'rent' | 'sale' | 'both';
  rentalPrice?: number;
  salePrice?: number;
  coverImage: string;
  location: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  seats: number;
  doors: number;
  description: string;
  isFeatured: boolean;
  status: 'draft' | 'published' | 'pending' | 'sold' | 'rented' | 'archived';
}

const defaultFormData: CarFormData = {
  title: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  listingType: 'rent',
  rentalPrice: 150,
  salePrice: 45000,
  coverImage: '',
  location: 'Manhattan, New York',
  mileage: 15000,
  fuelType: 'Petrol',
  transmission: 'Automatic',
  seats: 5,
  doors: 4,
  description: '',
  isFeatured: false,
  status: 'published',
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<ICar[]>([]);
  const [search, setSearch] = useState('');
  const [listingTypeFilter, setListingTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<ICar | null>(null);
  const [formData, setFormData] = useState<CarFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    setIsLoading(true);
    adminService
      .getCarsAdmin()
      .then((res) => {
        setCars(res || []);
      })
      .finally(() => setIsLoading(false));
  };

  const handleStatusChange = async (carId: string, status: string) => {
    try {
      await adminService.updateCarStatus(carId, status);
      setCars(cars.map((c) => (c._id === carId ? { ...c, status: status as any } : c)));
      showToast(`Vehicle status updated to ${status}`, 'success');
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleToggleFeatured = async (carId: string, currentFeatured: boolean) => {
    try {
      const next = !currentFeatured;
      await adminService.toggleCarFeatured(carId, next);
      setCars(cars.map((c) => (c._id === carId ? { ...c, isFeatured: next } : c)));
      showToast(next ? 'Marked as Featured' : 'Removed from Featured', 'success');
    } catch {
      showToast('Failed to update featured status', 'error');
    }
  };

  const handleDeleteCar = async (carId: string) => {
    const isConfirmed = await confirmDialog({
      title: 'Permanently Delete Listing?',
      text: 'Are you sure you want to permanently delete this vehicle listing as Administrator? This action cannot be undone.',
      confirmButtonText: 'Yes, Delete Listing',
      cancelButtonText: 'Cancel',
      icon: 'warning',
      isDestructive: true,
    });
    if (!isConfirmed) return;

    try {
      await adminService.deleteCarAdmin(carId);
      setCars(cars.filter((c) => c._id !== carId));
      showToast('Vehicle listing deleted successfully', 'success');
    } catch {
      showToast('Failed to delete vehicle listing', 'error');
    }
  };

  const openAddModal = () => {
    setFormData(defaultFormData);
    setIsAddModalOpen(true);
  };

  const openEditModal = (car: ICar) => {
    setEditingCar(car);
    setFormData({
      title: car.title,
      brand: car.brand,
      model: car.model,
      year: car.year,
      listingType: car.listingType as any,
      rentalPrice: car.rentalPrice,
      salePrice: car.salePrice || car.price,
      coverImage: car.coverImage || '',
      location: car.location || '',
      mileage: car.mileage || 0,
      fuelType: car.fuelType || 'Petrol',
      transmission: car.transmission || 'Automatic',
      seats: car.seats || 5,
      doors: car.doors || 4,
      description: car.description || '',
      isFeatured: !!car.isFeatured,
      status: car.status as any,
    });
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.brand || !formData.model) {
      showToast('Please fill in Title, Brand and Model', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCar) {
        await adminService.updateCarAdmin(editingCar._id, formData);
        showToast('Vehicle updated successfully', 'success');
        setEditingCar(null);
      } else {
        await adminService.createCarAdmin(formData);
        showToast('New vehicle listing added to fleet', 'success');
        setIsAddModalOpen(false);
      }
      fetchCars();
    } catch {
      showToast('Failed to save vehicle details', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCars = cars.filter((car) => {
    if (listingTypeFilter !== 'all' && car.listingType !== listingTypeFilter) return false;
    if (statusFilter !== 'all' && car.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = car.title?.toLowerCase().includes(q);
      const matchBrand = car.brand?.toLowerCase().includes(q);
      const matchModel = car.model?.toLowerCase().includes(q);
      const matchLoc = car.location?.toLowerCase().includes(q) || false;
      return matchTitle || matchBrand || matchModel || matchLoc;
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['Title', 'Brand', 'Model', 'Year', 'ListingType', 'Price', 'Status', 'Location'];
    const rows = filteredCars.map((c) => [
      `"${c.title?.replace(/"/g, '""')}"`,
      `"${c.brand}"`,
      `"${c.model}"`,
      c.year,
      c.listingType,
      c.listingType === 'rent' ? c.rentalPrice : c.salePrice || c.price,
      c.status,
      `"${c.location || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `karketo_fleet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalAssetValue = cars.reduce((acc, c) => {
    if (c.listingType === 'sale') return acc + (c.salePrice || c.price || 0);
    return acc + (c.rentalPrice ? c.rentalPrice * 30 : 0);
  }, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white">Fleet Inventory Control</h1>
            <span className="h-6 px-2.5 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center shadow-sm">
              {cars.length} Units
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Complete vehicle fleet management, pricing, moderation, and direct vehicle creation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={openAddModal}
            className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-600/25 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </Button>

          <Button
            variant="outline"
            onClick={exportCSV}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-zinc-400">Total Fleet</p>
          <p className="text-xl font-black text-white mt-1">{cars.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-emerald-400">Published / Live</p>
          <p className="text-xl font-black text-emerald-400 mt-1">
            {cars.filter((c) => c.status === 'published').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-orange-400">Featured Showcase</p>
          <p className="text-xl font-black text-orange-400 mt-1">
            {cars.filter((c) => c.isFeatured).length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-extrabold uppercase text-blue-400">Gross Fleet Valuation</p>
          <p className="text-xl font-black text-blue-400 mt-1">{formatPrice(totalAssetValue)}</p>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-zinc-900/80 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-zinc-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, brand, model, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500 placeholder:text-zinc-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Listing Type Filter */}
          <select
            value={listingTypeFilter}
            onChange={(e) => setListingTypeFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Types (Rent & Sale)</option>
            <option value="rent">Rental Fleet Only</option>
            <option value="sale">Direct Sales Only</option>
            <option value="both">Both Rent & Sale</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending Approval</option>
            <option value="rented">Under Rental</option>
            <option value="sold">Sold</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* CARS TABLE */}
      <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-zinc-400">
            <div className="h-8 w-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading fleet vehicles...
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Car className="w-8 h-8 text-zinc-400 mx-auto" />
            <p className="text-xs font-bold text-zinc-400">No vehicles matching your current filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/70 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                  <th className="py-3.5 px-4 sm:px-6">Vehicle Details</th>
                  <th className="py-3.5 px-4">Category / Model</th>
                  <th className="py-3.5 px-4">Pricing</th>
                  <th className="py-3.5 px-4">Status Moderation</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs font-medium">
                {filteredCars.map((car) => (
                  <tr key={car._id} className="hover:bg-zinc-800/40 transition-colors">
                    {/* Vehicle Details */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        {car.coverImage ? (
                          <img
                            src={car.coverImage}
                            alt=""
                            className="w-16 h-12 rounded-xl object-cover bg-zinc-800 shrink-0 border border-zinc-700/50"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700/50">
                            <Car className="w-5 h-5 text-zinc-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate hover:text-orange-400 transition-colors">
                            {car.title}
                          </p>
                          <p className="text-[11px] text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                            <span>{car.location || 'Not Specified'}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Model / Year */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-zinc-200">
                        {car.brand} {car.model}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-zinc-800 text-zinc-300">
                        {car.year} • {car.listingType}
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="py-4 px-4">
                      {car.listingType === 'rent' || car.listingType === 'both' ? (
                        <p className="font-black text-orange-400">
                          {formatPrice(car.rentalPrice || 0)} <span className="text-[10px] text-zinc-400 font-normal">/day</span>
                        </p>
                      ) : null}
                      {car.listingType === 'sale' || car.listingType === 'both' ? (
                        <p className="font-black text-blue-400">
                          {formatPrice(car.salePrice || car.price || 0)}
                        </p>
                      ) : null}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-4">
                      <CarStatusDropdown
                        carId={car._id}
                        currentStatus={car.status}
                        onStatusChange={handleStatusChange}
                      />
                    </td>

                    {/* Featured Star Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleFeatured(car._id, !!car.isFeatured)}
                        className={`p-2 rounded-xl border transition-all ${
                          car.isFeatured
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-sm'
                            : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:text-white'
                        }`}
                        title={car.isFeatured ? 'Featured on Homepage' : 'Click to Feature'}
                      >
                        <Star className={`w-4 h-4 ${car.isFeatured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(car)}
                          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                          title="Edit Vehicle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <Link
                          href={`/cars/${car.slug || car._id}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                          title="View Live Listing"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDeleteCar(car._id)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT CAR MODAL */}
      {(isAddModalOpen || editingCar) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">
                    {editingCar ? 'Edit Vehicle Details' : 'Add New Vehicle to Fleet'}
                  </h2>
                  <p className="text-xs text-zinc-400">Configure vehicle specifications, pricing, and media.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingCar(null);
                }}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCar} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Listing Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024 Mercedes-Benz S-Class AMG Line"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Brand / Make *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mercedes-Benz"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Model */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. S-Class"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Year */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Manufacturing Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value, 10) || 2024 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Listing Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Business Model</label>
                  <select
                    value={formData.listingType}
                    onChange={(e) => setFormData({ ...formData, listingType: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="rent">Rental Only</option>
                    <option value="sale">Direct Sale Only</option>
                    <option value="both">Both Rent & Sale</option>
                  </select>
                </div>

                {/* Rental Price */}
                {(formData.listingType === 'rent' || formData.listingType === 'both') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">Daily Rental Price ($/day)</label>
                    <input
                      type="number"
                      value={formData.rentalPrice || ''}
                      onChange={(e) => setFormData({ ...formData, rentalPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                )}

                {/* Sale Price */}
                {(formData.listingType === 'sale' || formData.listingType === 'both') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">Sale Price ($)</label>
                    <input
                      type="number"
                      value={formData.salePrice || ''}
                      onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                )}

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Location City / Hub</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Cover Image URL */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Cover Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Fuel & Transmission */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Fuel Type</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Transmission</label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                {/* Description */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Vehicle highlights, package options, warranty info..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Featured Checkbox */}
                <div className="sm:col-span-2 flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="h-4 w-4 rounded bg-zinc-950 border-zinc-800 text-orange-600 focus:ring-0"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-bold text-zinc-300 cursor-pointer">
                    Display in Featured VIP Showcase on Homepage
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingCar(null);
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-600/25"
                >
                  {isSubmitting ? 'Saving Vehicle...' : editingCar ? 'Save Changes' : 'Create Listing'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
