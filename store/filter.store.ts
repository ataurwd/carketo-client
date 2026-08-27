import { create } from 'zustand';
import { ICarFilters, ListingType } from '@/types/car.types';

interface FilterStore {
  filters: ICarFilters;
  setFilter: <K extends keyof ICarFilters>(key: K, value: ICarFilters[K]) => void;
  resetFilters: () => void;
}

const initialFilters: ICarFilters = {
  search: '',
  listingType: undefined,
  brand: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  bodyType: undefined,
  fuelType: undefined,
  transmission: undefined,
  location: '',
  page: 1,
  limit: 12,
  sortBy: 'latest',
};

export const useFilterStore = create<FilterStore>((set) => ({
  filters: initialFilters,
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: key === 'page' ? (value as number) : 1 },
    })),
  resetFilters: () => set({ filters: initialFilters }),
}));
