import React from 'react';
import CarDetailClient from './CarDetailClient';

export async function generateStaticParams() {
  const fallbackSlugs = [
    'car',
    'ford-g4-2024-5t8l1',
    'toyota-g4-2024-r79cc',
    'porsche-g4-2024-zz5wv',
    'porsche-sitter-car-m4-2024-ud7c3',
    'bmw-consequatur-aperiam-1982-0fqfo',
  ];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${apiUrl}/cars?limit=200`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data) && data.data.length > 0) {
        const fetchedSlugs = data.data.map((c: { slug: string }) => ({ slug: c.slug }));
        return [{ slug: 'car' }, ...fetchedSlugs];
      }
    }
  } catch (error) {
    console.warn('Could not fetch cars at build time, using fallback slugs:', error);
  }

  return fallbackSlugs.map(slug => ({ slug }));
}

export const dynamicParams = true;

export default function CarDetailPage() {
  return <CarDetailClient />;
}
