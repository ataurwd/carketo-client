export const SITE_CONFIG = {
  name: 'carketo',
  tagline: 'Premium Car Rental & Marketplace',
  description: 'Experience the ease and convenience of renting or buying top-tier vehicles.',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  currency: '৳',
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Rent Car', href: '/rent' },
  { label: 'Buy Car', href: '/buy' },
  { label: 'Sell Car', href: '/sell' },
  { label: 'Contact Us', href: '/contact' },
];

export const BODY_TYPES = [
  'Sedan',
  'SUV',
  'Coupe',
  'Hatchback',
  'Convertible',
  'Supercar',
  'Van / Minivan',
  'Truck',
];

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid'];

export const TRANSMISSION_TYPES = ['Automatic', 'Manual', 'Semi-Automatic'];

export const POPULAR_BRANDS = [
  'Toyota',
  'Honda',
  'Nissan',
  'Mitsubishi',
  'Hyundai',
  'Kia',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Porsche',
  'Ford',
  'Land Rover',
  'Lexus',
  'Mazda',
  'Suzuki',
  'MG',
  'Haval',
  'Tesla',
  'Volkswagen',
  'Volvo',
  'Lamborghini',
  'Ferrari',
  'Jeep',
  'Subaru',
  'Chevrolet',
  'Peugeot',
  'Proton',
  'Tata',
  'Mahindra',
  'Other Brand',
];
