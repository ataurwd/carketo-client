export const SITE_CONFIG = {
  name: 'carketo',
  tagline: 'প্রিমিয়াম গাড়ি ভাড়া ও মার্কেটপ্লেস',
  description: 'সহজে এবং নিশ্চিন্তে সেরা মানের গাড়ি ভাড়া নিন অথবা ক্রয় করুন।',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  currency: '৳',
};

export const NAV_LINKS = [
  { label: 'হোম', href: '/' },
  { label: 'গাড়ি ভাড়া', href: '/rent' },
  { label: 'গাড়ি কিনুন', href: '/buy' },
  { label: 'গাড়ি বিক্রি', href: '/sell' },
  { label: 'যোগাযোগ', href: '/contact' },
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
