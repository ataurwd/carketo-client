export type ListingType = 'sale' | 'rent' | 'both';
export type CarCondition = 'new' | 'used' | 'certified';
export type CarStatus = 'draft' | 'pending' | 'published' | 'rejected' | 'sold' | 'archived';

export interface ICarSpecs {
  doors: number;
  passengers: number;
  transmission: 'Automatic' | 'Manual' | 'Semi-Automatic';
  age?: number;
  year: number;
  luggage: number;
  airCondition: boolean;
  mileage: number;
  fuelType: string;
  bodyType: string;
  engineSize?: string;
  horsePower?: number;
}

export interface ICar {
  _id: string;
  id?: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  condition: CarCondition;
  listingType: ListingType;
  price?: number;
  salePrice?: number;
  rentalPrice?: number;
  location: string;
  description: string;
  specs: ICarSpecs;
  features: string[];
  amenities: string[];
  images: string[];
  coverImage: string;
  status: CarStatus;
  provider: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    totalReviews: number;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ICarFilters {
  search?: string;
  listingType?: ListingType;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  location?: string;
  pickupDate?: string;
  returnDate?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'year_desc' | 'popular' | 'latest';
}
