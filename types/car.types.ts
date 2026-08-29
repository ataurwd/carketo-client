export type ListingType = 'sale' | 'rent' | 'both';
export type CarCondition = 'new' | 'used' | 'certified';
export type CarStatus = 'draft' | 'pending' | 'published' | 'rejected' | 'sold' | 'rented' | 'maintenance' | 'archived';

export interface ICarSpecs {
  doors: number;
  passengers: number;
  transmission: 'Automatic' | 'Manual' | 'Dual-Clutch' | 'Semi-Automatic' | string;
  age?: number;
  year?: number;
  luggage: number;
  airCondition: boolean;
  mileage: number;
  fuelType: string;
  bodyType: string;
  engineSize?: string;
  engineCapacity?: string;
  horsepower?: number;
  horsePower?: number;
  acceleration0to100?: number;
  topSpeed?: number;
}

export interface ICar {
  _id: string;
  id?: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  condition?: CarCondition;
  listingType: ListingType;
  price?: number;
  salePrice?: number;
  rentalPrice?: number;
  rentalDeposit?: number;
  location: string;
  description: string;
  contactPhone?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  seats?: number;
  doors?: number;
  luggage?: number;
  mileage?: number;
  airCondition?: boolean;
  specs?: ICarSpecs;
  features: string[];
  amenities: string[];
  images: string[];
  coverImage: string;
  status: CarStatus;
  isFeatured?: boolean;
  rating?: number;
  totalReviews?: number;
  provider?: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    totalReviews: number;
    phone?: string;
  };
  providerId?: any;
  createdAt?: string;
  updatedAt?: string;
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
