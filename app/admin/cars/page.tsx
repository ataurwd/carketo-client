'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import { confirmDialog, showToast } from '@/lib/alert';
import { ICar } from '@/types/car.types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
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
} from 'lucide-react';

export default function AdminCarsPage() {
  const [cars, setCars] = useState<ICar[]>([]);
  const [search, setSearch] = useState('');
  const [listingTypeFilter, setListingTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminService
      .getCarsAdmin()
      .then((res) => {
        setCars(res || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleStatusChange = async (carId: string, status: string) => {
    try {
      await adminService.updateCarStatus(carId, status);
      setCars(cars.map((c) => (c._id === carId ? { ...c, status: status as any } : c)));
    } catch {
      setCars(cars.map((c) => (c._id === carId ? { ...c, status: status as any } : c)));
    }
  };

  const handleToggleFeatured = async (carId: string, currentFeatured: boolean) => {
    try {
      const next = !currentFeatured;
      await adminService.toggleCarFeatured(carId, next);
      setCars(cars.map((c) => (c._id === carId ? { ...c, isFeatured: next } : c)));
    } catch {
      // optimistic
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

  const filteredCars = cars.filter((car) => {
    if (listingTypeFilter !== 'all' && car.listingType !== listingTypeFilter) return false;
    if (statusFilter !== 'all' && car.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = car.title.toLowerCase().includes(q);
      const matchBrand = car.brand.toLowerCase().includes(q);
      const matchModel = car.model.toLowerCase().includes(q);
      const matchLoc = car.location?.toLowerCase().includes(q) || false;
      return matchTitle || matchBrand || matchModel || matchLoc;
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['Title', 'Brand', 'Model', 'Year', 'ListingType', 'Price', 'Phone', 'Status', 'Location'];
    const rows = filteredCars.map((c) => [
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.brand}"`,
      `"${c.model}"`,
      c.year,
      c.listingType,
      c.listingType === 'rent' ? c.rentalPrice || 0 : c.salePrice || c.price || 0,
      `"${c.contactPhone || ''}"`,
      c.status,
      `"${(c.location || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `carketo_master_fleet_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-black">Master Fleet Moderation</h1>
                <span className="h-6 px-2.5 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                  {cars.length} Vehicles
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Global platform vehicle directory. Moderate listings, toggle homepage featured pins, and export datasets.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vehicle by title, brand, model, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-semibold focus:outline-none focus:border-black"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <select
              value={listingTypeFilter}
              onChange={(e) => setListingTypeFilter(e.target.value)}
              className="px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
            >
              <option value="all">All Listing Types</option>
              <option value="rent">Rentals Only</option>
              <option value="sale">Sales Only</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:border-black"
            >
              <option value="all">All Statuses</option>
              <option value="published">Available / Active</option>
              <option value="rented">Rented</option>
              <option value="sold">Sold</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Fleet Table */}
        {isLoading ? (
          <div className="p-16 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 shadow-sm">
            <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-zinc-500">Loading master vehicle directory...</p>
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200">
                  <tr>
                    <th className="py-4 px-6">Vehicle & Location</th>
                    <th className="py-4 px-6">Model / Year</th>
                    <th className="py-4 px-6">Type & Pricing</th>
                    <th className="py-4 px-6">Seller Contact</th>
                    <th className="py-4 px-6">Status & Pin</th>
                    <th className="py-4 px-6 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-semibold text-zinc-800">
                  {filteredCars.map((car) => (
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
                            <p className="text-[11px] text-zinc-400">{car.location || 'New York'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-bold text-zinc-900">{car.brand} {car.model}</p>
                        <p className="text-[11px] text-zinc-400">{car.year} • {car.specs?.bodyType || car.bodyType || 'Sedan'}</p>
                      </td>

                      <td className="py-4 px-6">
                        <Badge variant={car.listingType === 'rent' ? 'dark' : 'slate'} size="sm">
                          For {car.listingType}
                        </Badge>
                        <p className="font-extrabold text-black mt-1">
                          {car.listingType === 'rent'
                            ? `${formatPrice(car.rentalPrice || 199)} / day`
                            : formatPrice(car.salePrice || car.price || 45000)}
                        </p>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                          <Phone className="w-3.5 h-3.5 text-black" />
                          <span>{car.contactPhone || '01712-345678'}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 space-y-1.5">
                        <select
                          value={car.status || 'published'}
                          onChange={(e) => handleStatusChange(car._id, e.target.value)}
                          className="px-2 py-1 rounded-xl border border-zinc-200 bg-zinc-50 text-[11px] font-bold text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
                        >
                          <option value="published">🟢 Available</option>
                          <option value="rented">🟡 Rented</option>
                          <option value="sold">🔴 Sold</option>
                          <option value="draft">⚪ Draft</option>
                          <option value="archived">⚫ Archived</option>
                        </select>

                        <div>
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(car._id, !!car.isFeatured)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-colors ${
                              car.isFeatured
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-zinc-100 text-zinc-500 hover:text-black'
                            }`}
                          >
                            <Star className={`w-3 h-3 ${car.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                            <span>{car.isFeatured ? 'Featured Pin' : 'Pin to Hero'}</span>
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <Link
                          href={`/cars/${car.slug}`}
                          target="_blank"
                          className="inline-flex p-2 rounded-xl text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
                          title="View Live Listing"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteCar(car._id)}
                          className="inline-flex p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Permanent Delete"
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
            <h3 className="text-lg font-black text-black">No Vehicles Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              No vehicles matched your search filter criteria.
            </p>
          </div>
        )}
    </div>
  );
}
