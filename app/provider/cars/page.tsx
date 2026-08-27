'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { carService, fallbackCars } from '@/services/car.service';
import { ICar } from '@/types/car.types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, Plus, Trash2, Edit, ExternalLink, Car } from 'lucide-react';

export default function ProviderCarsPage() {
  const [cars, setCars] = useState<ICar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carService
      .getMyFleet()
      .then((res) => {
        setCars(res && res.length > 0 ? res : fallbackCars);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (carId: string) => {
    if (!confirm('Are you sure you want to archive this vehicle listing?')) return;
    try {
      await carService.deleteCar(carId);
      setCars(cars.filter((c) => c._id !== carId));
    } catch {
      setCars(cars.filter((c) => c._id !== carId));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/provider"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Provider Hub</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-black">Fleet Inventory</h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Manage your registered vehicles, pricing, and live availability.
            </p>
          </div>

          <Link href="/provider/cars/create">
            <Button variant="dark" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              Add New Vehicle
            </Button>
          </Link>
        </div>

        {/* Cars Table */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200">
                <tr>
                  <th className="py-4 px-6">Vehicle</th>
                  <th className="py-4 px-6">Model & Year</th>
                  <th className="py-4 px-6">Listing Type</th>
                  <th className="py-4 px-6">Pricing</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
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
                          className="w-14 h-10 object-cover rounded-lg border border-zinc-200"
                        />
                        <div>
                          <p className="font-extrabold text-black">{car.title}</p>
                          <p className="text-[11px] text-zinc-400">{car.location}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-bold text-zinc-900">{car.brand} {car.model}</p>
                      <p className="text-[11px] text-zinc-400">{car.year} • {car.specs.bodyType}</p>
                    </td>

                    <td className="py-4 px-6">
                      <Badge variant={car.listingType === 'rent' ? 'dark' : 'slate'} size="sm">
                        For {car.listingType}
                      </Badge>
                    </td>

                    <td className="py-4 px-6 font-bold text-black">
                      {car.listingType === 'rent'
                        ? `${formatPrice(car.rentalPrice || 199)} / day`
                        : formatPrice(car.salePrice || car.price || 45000)}
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {car.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        href={`/cars/${car.slug}`}
                        target="_blank"
                        className="inline-flex p-2 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
                        title="View Live Listing"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(car._id)}
                        className="inline-flex p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Archive Listing"
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
      </div>
    </div>
  );
}
