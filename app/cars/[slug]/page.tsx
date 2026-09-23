import React from 'react';
import CarDetailClient from './CarDetailClient';

import { RAW_CARS, FALLBACK_20_CARS } from '@/lib/fallbackCars';

export async function generateStaticParams() {
  const fallbackSlugs = [
    'car',
    'ford-g4-2024-5t8l1',
    'toyota-g4-2024-r79cc',
    'porsche-g4-2024-zz5wv',
    'porsche-sitter-car-m4-2024-ud7c3',
    'bmw-consequatur-aperiam-1982-0fqfo',
    ...RAW_CARS.map((c: any) => c.slug),
    ...FALLBACK_20_CARS.map((c: any) => c.slug),
  ];

  const fetchedSlugs: string[] = [];

  const endpoints = [
    'http://localhost:5000/api/v1/cars?limit=500',
    `${process.env.NEXT_PUBLIC_API_URL || 'https://carketo-v1.miscellan.com/api/v1'}/cars?limit=500`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { next: { revalidate: 60 } });
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : (json?.data?.cars || []);
        for (const item of list) {
          if (item?.slug) fetchedSlugs.push(item.slug);
        }
      }
    } catch {}
  }

  const allSlugs = Array.from(new Set([...fallbackSlugs, ...fetchedSlugs]));
  return allSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = true;

export default function CarDetailPage() {
  return <CarDetailClient />;
}
